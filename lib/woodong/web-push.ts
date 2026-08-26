/**
 * 브라우저 쪽 웹 푸시 구독 헬퍼 (Task 038).
 *
 * 컴포넌트에서 분리한 이유는 이 함수들이 전부 **브라우저 API를 직접 만지는 부수효과**라서다.
 * 렌더 경로에 섞이면 순수성 규칙(`react-hooks/purity`)에 걸리고, 테스트할 때도 붙잡을 곳이
 * 없어진다. 호출은 전부 이벤트 핸들러 안에서 일어난다.
 */

import type { WebPushSubscription } from "@/lib/woodong/notifications";

/** Service Worker 스코프를 `/`로 잡기 위해 루트에서 서빙한다(`public/sw.js`). */
const SERVICE_WORKER_URL = "/sw.js";

export type PushEnvironment = {
  /** Service Worker + Push API를 둘 다 쓸 수 있는가. */
  supported: boolean;
  /** iOS/iPadOS인가 — 홈 화면 설치 여부에 따라 동작이 갈린다. */
  ios: boolean;
  /** 홈 화면에 추가된(standalone) 상태로 실행 중인가. */
  standalone: boolean;
  /** 현재 알림 권한. Notification API가 없으면 `unsupported`. */
  permission: NotificationPermission | "unsupported";
};

export const SSR_PUSH_ENVIRONMENT: PushEnvironment = {
  supported: false,
  ios: false,
  standalone: false,
  permission: "unsupported",
};

/**
 * 브라우저 환경을 한 번만 읽어 문자열로 굳힌다.
 *
 * `useSyncExternalStore`의 `getSnapshot`은 **호출할 때마다 같은 참조**를 돌려줘야 해서
 * (아니면 무한 렌더가 된다) 객체 대신 문자열을 캐시한다. 권한은 사용자가 허용/차단하면
 * 바뀌므로 `invalidatePushEnvironment()`로 캐시를 버릴 수 있게 열어 둔다.
 */
let cachedSnapshot: string | null = null;

export function getPushEnvironmentSnapshot(): string {
  if (cachedSnapshot === null) {
    cachedSnapshot = serializePushEnvironment(readPushEnvironment());
  }
  return cachedSnapshot;
}

export function getServerPushEnvironmentSnapshot(): string {
  return serializePushEnvironment(SSR_PUSH_ENVIRONMENT);
}

export function invalidatePushEnvironment() {
  cachedSnapshot = null;
}

function serializePushEnvironment(env: PushEnvironment): string {
  return [
    env.supported ? "1" : "0",
    env.ios ? "1" : "0",
    env.standalone ? "1" : "0",
    env.permission,
  ].join("|");
}

export function parsePushEnvironment(snapshot: string): PushEnvironment {
  const [supported, ios, standalone, permission] = snapshot.split("|");
  return {
    supported: supported === "1",
    ios: ios === "1",
    standalone: standalone === "1",
    permission: (permission ?? "unsupported") as PushEnvironment["permission"],
  };
}

function readPushEnvironment(): PushEnvironment {
  if (typeof window === "undefined") return SSR_PUSH_ENVIRONMENT;

  const ua = window.navigator.userAgent;
  // iPadOS 13+는 데스크톱 Safari를 흉내 내서 UA에 "iPad"가 없다. 터치 지원 Mac으로 판별한다.
  const ios =
    /iPad|iPhone|iPod/.test(ua) ||
    (ua.includes("Macintosh") && window.navigator.maxTouchPoints > 1);

  const standalone =
    window.matchMedia?.("(display-mode: standalone)").matches === true ||
    // iOS Safari 전용 비표준 플래그. 표준 미디어 쿼리를 지원하지 않는 버전이 있어 함께 본다.
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true;

  return {
    supported: "serviceWorker" in window.navigator && "PushManager" in window,
    ios,
    standalone,
    permission:
      typeof Notification === "undefined"
        ? "unsupported"
        : Notification.permission,
  };
}

/**
 * VAPID 공개 키(base64url 문자열)를 `applicationServerKey`가 요구하는 바이트 배열로 바꾼다.
 * base64url은 `-`/`_`를 쓰고 패딩이 없어서 `atob`에 그대로 넣을 수 없다.
 */
function urlBase64ToUint8Array(base64Url: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4);
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  // 반환 타입에 `ArrayBuffer`를 명시한다. 기본 `Uint8Array`는 `ArrayBufferLike`(SharedArrayBuffer
  // 포함)를 버퍼로 갖는 것으로 추론되는데, `applicationServerKey`는 공유 버퍼를 받지 않는다.
  const output = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  await navigator.serviceWorker.register(SERVICE_WORKER_URL);
  // `register()`는 등록만 보장한다. 실제로 제어권을 가진 워커가 활성화될 때까지 기다려야
  // `pushManager`를 쓸 수 있다.
  return navigator.serviceWorker.ready;
}

export type SubscribeResult =
  | { ok: true; subscription: WebPushSubscription }
  | { ok: false; reason: "unsupported" | "denied" | "failed" };

/**
 * 알림 권한을 요청하고 Push 구독을 만든다.
 *
 * ⚠️ `userVisibleOnly: true`는 선택이 아니다 — 크롬은 "푸시를 받으면 반드시 사용자에게
 * 보이는 알림을 띄운다"는 약속 없이는 구독을 내주지 않는다. 우리 Service Worker는 실제로
 * 매번 `showNotification()`을 호출하므로 이 약속을 지킨다.
 */
export async function subscribeToPush(
  vapidPublicKey: string,
): Promise<SubscribeResult> {
  const env = readPushEnvironment();
  if (!env.supported || env.permission === "unsupported") {
    return { ok: false, reason: "unsupported" };
  }

  try {
    const permission = await Notification.requestPermission();
    invalidatePushEnvironment();

    if (permission !== "granted") {
      return { ok: false, reason: "denied" };
    }

    const registration = await getRegistration();

    // 이미 구독이 있으면(다른 탭에서 켰거나 이전 세션의 잔재) 그대로 재사용한다.
    // 같은 키로 다시 subscribe하면 브라우저가 기존 구독을 돌려주지만, 키가 바뀐 경우에는
    // InvalidStateError가 나므로 먼저 해지한다.
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
      await existing.unsubscribe();
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    return {
      ok: true,
      subscription: subscription.toJSON() as WebPushSubscription,
    };
  } catch (error) {
    console.error("[web-push] subscribe failed:", error);
    return { ok: false, reason: "failed" };
  }
}

/**
 * 브라우저 쪽 구독을 해지한다.
 *
 * 실패해도 **성공으로 취급한다.** 서버의 `destination`을 비우는 것이 사용자가 기대하는
 * "끄기"의 본질이고, 브라우저 구독이 남아 있어도 우리가 보내지 않으면 알림은 오지 않는다.
 * 여기서 실패를 그대로 올리면 "껐는데 안 꺼졌다"는 잘못된 메시지를 보게 된다.
 */
export async function unsubscribeFromPush(): Promise<void> {
  try {
    if (!("serviceWorker" in navigator)) return;
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration?.pushManager.getSubscription();
    await subscription?.unsubscribe();
  } catch (error) {
    console.error("[web-push] unsubscribe failed:", error);
  }
}
