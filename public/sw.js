/**
 * 우동 Service Worker (Task 038).
 *
 * 웹 푸시를 받으려면 Service Worker가 반드시 있어야 한다 — 브라우저는 탭이 닫혀 있어도
 * 이 스크립트를 깨워 `push` 이벤트를 전달한다. 오프라인 캐싱은 하지 않는다(범위 밖이고,
 * Next.js의 라우트 페이로드를 어설프게 캐시하면 오래된 화면이 남는다).
 *
 * ⚠️ 이 파일은 `public/`에 있어 빌드 파이프라인을 거치지 않는다. 최상위 스코프(`/`)에
 * 등록하려면 루트 경로에서 서빙돼야 하기 때문이다(`/sw.js`). 그래서 TypeScript도 번들링도
 * 쓰지 않는 순수 JS다.
 */

// 새 버전을 배포했을 때 기존 탭이 닫히기를 기다리지 않고 곧바로 교체한다.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim()),
);

/** 디스패처(Edge Function)가 보내는 페이로드 형태. 깨져 있어도 알림은 띄운다. */
function parsePayload(event) {
  const fallback = {
    title: "우동",
    body: "새 알림이 도착했어요.",
    url: "/protected/notifications",
  };

  if (!event.data) return fallback;

  try {
    const data = event.data.json();
    return {
      title: data.title || fallback.title,
      body: data.body || fallback.body,
      url: data.url || fallback.url,
      tag: data.tag,
    };
  } catch {
    // JSON이 아니면 텍스트로라도 보여 준다. 알림을 통째로 버리는 것보다 낫다.
    return { ...fallback, body: event.data.text() || fallback.body };
  }
}

self.addEventListener("push", (event) => {
  const payload = parsePayload(event);

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/pwa-icon",
      badge: "/icon",
      // 같은 알림이 재시도로 두 번 도착해도 기기에는 하나만 남는다(디스패처가 알림 id를 넣는다).
      tag: payload.tag,
      data: { url: payload.url },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    (event.notification.data && event.notification.data.url) || "/";

  // 이미 열려 있는 우동 탭이 있으면 그 탭을 재사용한다. 알림을 누를 때마다 새 탭이 쌓이면
  // 사용자는 같은 서비스의 탭 여러 개를 손으로 정리해야 한다.
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (
            new URL(client.url).origin === self.location.origin &&
            "focus" in client
          ) {
            return client.focus().then((focused) => {
              if ("navigate" in focused) return focused.navigate(targetUrl);
              return focused;
            });
          }
        }
        return self.clients.openWindow(targetUrl);
      }),
  );
});
