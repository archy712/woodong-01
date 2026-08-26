/**
 * 우동 웹 푸시 디스패처 (Task 038).
 *
 * 알림 행은 전부 Postgres RPC 안에서 만들어지는데(공지·투표 시작/마감·회비 리마인드·정산
 * 발행), 웹 푸시 발송은 VAPID 비공개 키를 쥔 서버 런타임이 해야 한다. 이 함수가 그 자리다.
 *
 * pg_cron 잡 `woodong_push_dispatch`가 pg_net으로 매분 호출한다(`docs/ops/CRON_JOBS.md`).
 * 큐를 직접 SELECT/UPDATE하지 않고 RPC 4종만 부른다 — 재시도·폴백 정책(PRD 4.4)이 Deno
 * 코드가 아니라 DB 한 곳에 있어야 SQL Editor에서 수동으로 돌릴 때도 규칙이 갈라지지 않는다.
 *
 * 배포: MCP `deploy_edge_function` 또는 `supabase functions deploy woodong-push-dispatch`.
 * 이 디렉토리는 배포된 것과 같은 소스를 저장소에 남겨 두기 위한 것이다(Edge Function은
 * Supabase에만 있으면 코드 리뷰도 롤백도 불가능하다).
 */
import webpush from "npm:web-push@3.6.7";
import { createClient } from "jsr:@supabase/supabase-js@2";

/** 한 번의 tick에서 처리할 최대 건수. 남은 것은 다음 tick(1분 뒤)이 가져간다. */
const BATCH_LIMIT = 20;

/** 푸시 서비스가 "이 구독은 죽었다"고 알려 주는 코드. 재시도해도 같은 답이 온다. */
const GONE_STATUS = new Set([404, 410]);

type ClaimedRow = {
  id: string;
  group_id: string | null;
  user_id: string;
  type: string;
  related_type: string | null;
  related_id: string | null;
  title: string;
  body: string;
  attempt_count: number;
  destination: string | null;
};

/**
 * 알림이 가리키는 화면. 앱의 `resolveHref()`(components/notifications/notifications-list.tsx)와
 * **같은 규칙**이어야 한다 — 푸시를 눌러 열리는 곳과 알림센터에서 눌러 열리는 곳이 다르면
 * 같은 알림인데 다른 데로 간다.
 */
function resolvePath(row: ClaimedRow): string {
  if (!row.group_id) return "/protected/notifications";
  const base = `/protected/groups/${row.group_id}`;
  switch (row.related_type) {
    case "vote":
      return `${base}/votes/${row.related_id}`;
    case "announcement":
      return `${base}/announcements`;
    case "due":
      return `${base}/dues`;
    case "settlement":
      return `${base}/dues/settlements/${row.related_id}`;
    default:
      return base;
  }
}

/** 구독 JSON은 브라우저가 만들어 그대로 저장한 값이다. 형태가 깨졌으면 보낼 곳이 없다. */
function parseSubscription(destination: string | null) {
  if (!destination) return null;
  try {
    const parsed = JSON.parse(destination);
    if (
      typeof parsed?.endpoint === "string" &&
      typeof parsed?.keys?.p256dh === "string" &&
      typeof parsed?.keys?.auth === "string"
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

type PushConfig = {
  vapid_public: string;
  vapid_private: string;
  vapid_subject: string | null;
  dispatch_token: string | null;
};

/** 인스턴스가 살아 있는 동안 재사용한다. 매분 호출되는 함수라 Vault 왕복을 매번 하지 않는다. */
let cachedConfig: PushConfig | null = null;

function bearerOf(req: Request): string {
  const header = req.headers.get("Authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

/**
 * 길이·내용 비교 시간이 입력에 따라 달라지지 않게 한다. 토큰을 한 글자씩 맞춰 보는
 * 타이밍 공격을 막는 표준 조치다.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const left = enc.encode(a);
  const right = enc.encode(b);
  // 길이가 다르면 어차피 실패지만, 길이 자체가 정보가 되지 않도록 같은 길이로 맞춰 비교한다.
  const length = Math.max(left.length, right.length);
  let diff = left.length ^ right.length;
  for (let i = 0; i < length; i++) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
}

Deno.serve(async (req: Request) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json(
      { ok: false, error: "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 누락" },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  // VAPID 키와 디스패치 토큰은 Vault에 있다(Edge Function 시크릿을 쓰면 대시보드/CLI 수동
  // 단계가 늘어난다). 인스턴스가 살아 있는 동안은 다시 읽지 않는다.
  if (!cachedConfig) {
    const { data, error } = await supabase
      .rpc("woodong_get_push_config")
      .single();
    if (error || !data?.vapid_private || !data?.vapid_public) {
      return Response.json(
        {
          ok: false,
          error: `VAPID 설정을 읽지 못했습니다: ${error?.message ?? "빈 값"}`,
        },
        { status: 500 },
      );
    }
    cachedConfig = data as PushConfig;
  }
  const config = cachedConfig;

  // 이 함수는 `verify_jwt = false`라 인증을 직접 한다. 호출자는 pg_cron뿐이고, 토큰은
  // 이 엔드포인트 전용이다(`service_role` 키를 재사용하지 않는다 — 4/4 마이그레이션 주석 참고).
  if (
    !config.dispatch_token ||
    !timingSafeEqual(bearerOf(req), config.dispatch_token)
  ) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    config.vapid_subject ?? "https://woodong-01.vercel.app",
    config.vapid_public,
    config.vapid_private,
  );

  const { data: claimed, error: claimError } = await supabase.rpc(
    "woodong_claim_push_batch",
    { p_limit: BATCH_LIMIT },
  );

  if (claimError) {
    return Response.json(
      { ok: false, error: `큐 선점 실패: ${claimError.message}` },
      { status: 500 },
    );
  }

  const rows = (claimed ?? []) as ClaimedRow[];
  if (rows.length === 0) {
    return Response.json({ ok: true, claimed: 0, sent: 0, failed: 0 });
  }

  const sentIds: string[] = [];
  const failures: { id: string; error: string; permanent: boolean }[] = [];

  // 한 건의 실패가 나머지를 막지 않도록 전부 병렬로 보내고 결과만 모은다.
  await Promise.all(
    rows.map(async (row) => {
      const subscription = parseSubscription(row.destination);

      // 구독을 끊은 뒤에 큐에 남아 있던 행. 재시도해도 목적지가 생기지 않으므로 영구 실패다.
      if (!subscription) {
        failures.push({
          id: row.id,
          error: "구독 정보 없음(해지되었거나 형식이 올바르지 않음)",
          permanent: true,
        });
        return;
      }

      const payload = JSON.stringify({
        title: row.title,
        body: row.body,
        url: resolvePath(row),
        // 같은 알림이 재시도로 두 번 도착해도 기기에는 하나만 남는다.
        tag: row.id,
        notificationId: row.id,
      });

      try {
        await webpush.sendNotification(subscription, payload, {
          TTL: 60 * 60 * 24,
        });
        sentIds.push(row.id);
      } catch (error) {
        const statusCode = (error as { statusCode?: number })?.statusCode;
        const detail = (error as { body?: string })?.body ?? String(error);
        failures.push({
          id: row.id,
          error: `${statusCode ?? "?"} ${detail}`.slice(0, 500),
          permanent: statusCode !== undefined && GONE_STATUS.has(statusCode),
        });
      }
    }),
  );

  if (sentIds.length > 0) {
    const { error } = await supabase.rpc("woodong_mark_push_sent", {
      p_ids: sentIds,
    });
    if (error) console.error("[push-dispatch] mark_sent 실패:", error.message);
  }

  // 실패는 건별로 기록한다 — 재시도 예약인지 최종 실패인지 행마다 다르다.
  for (const failure of failures) {
    const { error } = await supabase.rpc("woodong_mark_push_failed", {
      p_id: failure.id,
      p_error: failure.error,
      p_permanent: failure.permanent,
    });
    if (error)
      console.error("[push-dispatch] mark_failed 실패:", error.message);
  }

  console.log(
    `[push-dispatch] claimed=${rows.length} sent=${sentIds.length} failed=${failures.length}`,
  );

  return Response.json({
    ok: true,
    claimed: rows.length,
    sent: sentIds.length,
    failed: failures.length,
  });
});
