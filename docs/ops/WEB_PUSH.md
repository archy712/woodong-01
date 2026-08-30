# 우동 웹 푸시(Web Push) 운영 가이드

- **작성**: Task 038 (2026-08-26)
- **배경**: v1.5에서 카카오톡 알림톡·Slack·이메일을 알림 로드맵에서 제외하고 **웹 푸시**를 유일한 외부 알림 채널로 채택했다(PRD 2장, 4.3). 1차 MVP는 앱 내 알림만 발송했고, Task 027이 채널 설정 UI만 먼저 만들어 뒀다.

---

## ⚠️ 배포 전 운영자가 해야 할 일 (1건)

**Vercel 프로젝트에 환경변수 하나를 추가해야 프로덕션에서 웹 푸시를 켤 수 있다.**

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BKplxCI2q6PRi_CydsHH2055vAy4BmdsIF7X_GWschxGqM7uZ5W848xWWc8YekBqehPjDH7mmwRgHb_o0Q5Co4I
```

- Vercel → 프로젝트 `woodong-01` → Settings → Environment Variables (Production/Preview/Development 전부)
- **공개 키라서 비밀이 아니다.** 브라우저 구독 등록에 반드시 필요하고 모든 방문자에게 내려간다(PRD 4.2가 `NEXT_PUBLIC_` 접두어를 쓰라고 명시한 이유).
- **비공개 키는 Vercel에 넣지 않는다.** Supabase Vault에만 있고 Edge Function만 읽는다(아래 참고).
- 추가하지 않으면 마이페이지의 웹 푸시 스위치가 비활성 상태로 보이고 "이 환경에는 웹 푸시 키가 설정되지 않아 켤 수 없어요" 안내가 뜬다. **앱의 다른 기능에는 영향이 없다.**

---

## 구조

```
[앱/배치] 알림 팬아웃 RPC
   └─ woodong_notification_channels(user_id) 로 채널 판정
        ├─ in_app   행 (status='sent')      → 알림센터가 읽는다
        └─ web_push 행 (status='pending')   → 발송 큐

[pg_cron] woodong_push_dispatch (1분)
   └─ pg_net → POST /functions/v1/woodong-push-dispatch  (Bearer: 전용 디스패치 토큰)
        ├─ woodong_get_push_config()    ← Vault에서 VAPID 키 + 토큰
        ├─ woodong_claim_push_batch(20) ← for update skip locked, attempt_count++
        ├─ web-push 로 FCM/Mozilla/APNs 에 발송
        ├─ woodong_mark_push_sent(ids)
        └─ woodong_mark_push_failed(id, error, permanent)

[브라우저] public/sw.js
   ├─ push            → showNotification(제목, 본문, 딥링크)
   └─ notificationclick → 열려 있는 탭 재사용, 없으면 새 탭
```

- 발송 큐를 별도 테이블로 만들지 않고 `woodong_notifications`를 그대로 쓴다 — PRD 4.4가 "모든 발송 시도를 이 테이블에 상태로 기록한다"고 정했다.
- Edge Function은 큐를 직접 SELECT/UPDATE하지 않고 **RPC 4종만** 부른다. 재시도·폴백 정책이 Deno 코드가 아니라 DB 한 곳에 있어야 SQL Editor에서 수동으로 돌릴 때도 규칙이 갈라지지 않는다.

### 알림센터와의 관계

두 채널을 모두 켠 사용자는 한 사건에 대해 행을 **두 개** 갖는다. 알림센터와 헤더 뱃지는 `channel = 'in_app'`으로 걸러서 읽으므로 목록에 두 번 뜨지 않는다(`lib/woodong/queries/notifications.ts`).

---

## 비밀 값 보관

| 값                    | 위치                                        | 읽는 주체                 |
| --------------------- | ------------------------------------------- | ------------------------- |
| VAPID 공개 키         | `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (앱) + Vault | 브라우저, Edge Function   |
| VAPID 비공개 키       | Vault `woodong_vapid_private_key`           | Edge Function만           |
| VAPID subject (`sub`) | Vault `woodong_vapid_subject`               | Edge Function만           |
| 디스패치 토큰         | Vault `woodong_push_dispatch_token`         | pg_cron(발신), 함수(검증) |

- **Edge Function 시크릿(`supabase secrets set`)을 쓰지 않았다.** 그 경로는 CLI/대시보드 수동 조작을 요구해서 배포 자동화 밖의 단계가 하나 더 생긴다. Vault는 SQL로 다룰 수 있고 저장 시 암호화된다.
- **`sub`에 개인 이메일 대신 서비스 URL(`https://woodong-01.vercel.app`)을 넣었다.** `sub`는 푸시 서비스(FCM/Apple)에 그대로 전달되는 값이라, 운영자 이메일을 외부 사업자에게 넘길 이유가 없다. RFC 8292는 `mailto:`와 `https:`를 모두 허용한다.
- **디스패치 토큰은 `service_role` 키를 재사용하지 않는다.** Edge Function을 `verify_jwt = false`로 두고 자체 베어러 검사를 하는 대신, 이 엔드포인트에만 쓰는 토큰을 따로 발급했다. 유출되어도 할 수 있는 일은 "대기 중인 푸시를 지금 보내라"뿐이고, 회수는 Vault 값 교체로 끝난다.

### 키 회전

```sql
-- 1) 새 키쌍 생성 후 Vault 값을 교체한다(비공개 키는 절대 마이그레이션 파일에 넣지 않는다).
select vault.update_secret(
  (select id from vault.secrets where name = 'woodong_vapid_private_key'),
  '<새 비공개 키>'
);
select vault.update_secret(
  (select id from vault.secrets where name = 'woodong_vapid_public_key'),
  '<새 공개 키>'
);
```

⚠️ **VAPID 키를 바꾸면 기존 구독이 전부 무효가 된다.** 브라우저는 구독 시점의 `applicationServerKey`로 발급된 endpoint만 인정하므로, 회전 후 첫 발송은 전부 404/410으로 실패하고 자동으로 구독이 정리된다(사용자는 마이페이지에서 다시 켜야 한다). 회전 직후 `NEXT_PUBLIC_VAPID_PUBLIC_KEY`도 함께 바꾸고, Edge Function은 인스턴스 캐시가 있으므로 재배포한다.

---

## 재시도 / 폴백 정책 (PRD 4.4)

| 시도           | 실패 시 동작                                    |
| -------------- | ----------------------------------------------- |
| 1회차 실패     | 1분 뒤 재시도 (`status='pending'`)              |
| 2회차 실패     | 5분 뒤 재시도                                   |
| 3회차 실패     | 15분 뒤 재시도                                  |
| 4회차 실패     | `status='failed'` + **앱 내 알림으로 폴백**     |
| 404 / 410 응답 | 재시도 없이 즉시 최종 실패 + **죽은 구독 정리** |

- 폴백은 같은 사건의 `in_app` 행이 **없을 때만** 새로 만든다(상태 `fallback_sent`). 이미 있으면 알림센터에 같은 내용이 두 번 뜬다.
- 폴백은 사용자가 `in_app`을 꺼 두었어도 만든다 — PRD 4.4가 "**반드시** 폴백 발송"을 요구한다. 대신 상태로 구분할 수 있게 남긴다.
- 구독 정리는 `destination`을 비우고 `web_push`를 끈다. 비우기만 하면 마이페이지에는 켜져 있는데 아무 데도 못 가는 상태가 되어, 사용자가 다시 허용할 계기를 잃는다.

---

## 점검

### 큐 상태

```sql
select channel, status, count(*), max(created_at) as latest
from public.woodong_notifications
where created_at >= now() - interval '2 days'
group by channel, status
order by channel, status;
```

### 막힌 발송 조사

```sql
select id, user_id, attempt_count, next_attempt_at, left(last_error, 200) as last_error, title
from public.woodong_notifications
where channel = 'web_push' and status in ('pending', 'failed')
order by created_at desc
limit 20;
```

### 디스패처 호출 결과

```sql
select r.status_code, left(r.content, 200) as content, r.created
from net._http_response r
order by r.created desc
limit 10;
```

`{"ok":true,"claimed":N,"sent":N,"failed":N}`가 정상이다. `401 unauthorized`가 보이면 Vault의 디스패치 토큰과 cron 잡이 어긋난 것이다.

### 수동 실행

```bash
curl -X POST "https://ybhluyzkmpjmrxyhkolt.supabase.co/functions/v1/woodong-push-dispatch" \
  -H "Authorization: Bearer $(<Vault의 woodong_push_dispatch_token>)"
```

### 재배포

```bash
supabase functions deploy woodong-push-dispatch --no-verify-jwt
```

소스는 `supabase/functions/woodong-push-dispatch/index.ts`에 저장소 사본이 있다. **`--no-verify-jwt`를 빼면 게이트웨이가 cron 요청을 JWT 없다고 401로 막는다.**

---

## 알려진 제약

- **사용자당 기기 1대만 등록된다.** 구독 정보를 `woodong_notification_preferences.destination` 한 칸에 저장하는 PRD 5.13 스키마 때문이다. 다른 기기에서 켜면 이전 기기의 구독은 덮어써지고 조용히 알림이 끊긴다(마이페이지에 그 사실을 안내 문구로 적어 뒀다). 여러 기기를 지원하려면 구독 테이블을 따로 만들어야 한다.
- **iOS는 홈 화면에 추가(PWA 설치)해야만 동작한다.** iOS 16.4+ Safari의 제약이다. 마이페이지에서 iOS이면서 standalone이 아니면 스위치를 잠그고 설치 안내를 띄운다.
- **푸시로 나가는 문구는 발신 시점 로케일로 굳는다.** 배치(pg_cron)가 만드는 알림은 사용자 로케일을 알 수 없어 한국어 기본 문구가 저장되고, 웹 푸시는 그 문자열을 그대로 실어 나른다. Task 040에서 `template_key` + `params`를 함께 저장하도록 바꿔 **앱 내 알림센터는 읽는 사람의 언어로 조립**되지만, 푸시 페이로드는 Edge Function이 만들기 때문에 여전히 저장된 문자열을 쓴다. 푸시까지 번역하려면 사용자별 로케일 저장과 Edge Function 템플릿이 필요하다.
- **pg_net의 `net.*` 실행 권한을 `anon`/`authenticated`에서 회수할 수 없다.** PUBLIC 권한을 `supabase_admin`이 부여했고, 우리가 쓰는 `postgres` 롤은 소유자도 부여자도 아니라 REVOKE가 조용히 무시된다(실측 확인). **실효 방어선은 "`net` 스키마가 PostgREST에 노출되지 않는다" 하나뿐**이다. 아래 쿼리가 `public, graphql_public`만 돌려주는지 정기 점검한다 — 이 프로젝트는 다른 앱과 공유하고 있어 설정이 우리 손 밖에서 바뀔 수 있다.

  ```bash
  curl -s "$SUPABASE_URL/rest/v1/http_request_queue?select=*&limit=1" \
    -H "apikey: $PUBLISHABLE_KEY" -H "Accept-Profile: net"
  # 기대: {"code":"PGRST106", ... "Only the following schemas are exposed: public, graphql_public"}
  ```

- **Free 플랜 프로젝트가 일시정지되면 디스패처도 멈춘다.** 재개 후 첫 tick이 밀린 큐를 그대로 가져간다(TTL 24시간을 넘긴 푸시는 푸시 서비스가 버린다).
