# 우동 배치 잡(pg_cron) 운영 가이드

- **작성**: Task 037 (2026-08-26)
- **배경**: 1차 MVP에는 스케줄러가 없어서 회비 리마인드(Task 028)와 투표 마감(Task 030)을 **lazy 처리**했다 — 멤버가 해당 화면을 여는 순간 밀린 것을 만들었다. 화면을 열지 않는 사람은 영원히 리마인드를 받지 못하고, 아무도 열지 않은 투표는 마감 시각이 지나도 `open`으로 남는 구조적 한계가 있었다. Task 037에서 Supabase Cron(pg_cron)으로 전환했다.

---

## 등록된 잡

| 잡 이름                 | 스케줄(UTC)   | KST        | 실행 명령                                                       | 하는 일                                                      |
| ----------------------- | ------------- | ---------- | --------------------------------------------------------------- | ------------------------------------------------------------ |
| `woodong_due_reminders` | `0 0 * * *`   | 매일 09:00 | `select public.woodong_run_due_reminders()`                     | 주기가 지난 미납 청구에 `due_reminder` 알림 생성             |
| `woodong_vote_closing`  | `*/5 * * * *` | 5분마다    | `select public.woodong_run_vote_closing()`                      | `closes_at`이 지난 `open` 투표를 `closed`로 전환 + 결과 알림 |
| `woodong_push_dispatch` | `* * * * *`   | 1분마다    | `select net.http_post(... /functions/v1/woodong-push-dispatch)` | 발송 대기 중인 웹 푸시를 Edge Function으로 보내 실제 발송    |

> ⏰ **pg_cron 스케줄 표현식은 UTC**다(Supabase 세션 기본 타임존이 UTC). KST를 노릴 때는 9시간을 빼서 적는다.
>
> 🔤 잡 이름은 반드시 `woodong_` 접두어를 붙인다. 이 Supabase 프로젝트는 다른 앱과 공유하고 있고(`docs/ops/SUPABASE_SHARED_PROJECT.md`), 남의 잡(`weekly_log_reminder`, `weekly_log_notification_cleanup`)과 섞이면 안 된다.

### 웹 푸시 디스패처는 별도 문서에

`woodong_push_dispatch` 잡이 하는 일(VAPID 키 보관, Edge Function 배포, 재시도·폴백 정책, 구독 정리)은 `docs/ops/WEB_PUSH.md`에 따로 정리했다. 이 문서는 **잡 등록과 스케줄**까지만 다룬다.

### 정산 발행 알림은 왜 잡이 없나

`settlement_published` 알림은 **총무가 발행 버튼을 누르는 순간** `woodong_publish_settlement` 안에서 팬아웃된다(Task 036). 애초에 lazy 처리가 아니라 즉시 발송이라 스케줄러로 옮길 것이 없다. 공지(`woodong_create_announcement`)·투표 생성(`woodong_create_vote`)·수동 마감(`woodong_close_vote_now`)도 같다.

---

## 함수 구조 — lazy와 배치가 규칙을 공유한다

```
woodong_process_due_reminders_core(p_user_id, p_group_id, ...)   ← 규칙 본체
├── woodong_process_due_reminders(p_group_id, ...)   = core(auth.uid(), ...)   [앱/롤백용]
└── woodong_run_due_reminders()                      = core(null, null, ...)   [pg_cron]

woodong_close_expired_votes_core(p_user_id, p_group_id, ...)     ← 규칙 본체
├── woodong_close_expired_votes(p_group_id, ...)     = core(auth.uid(), ...)   [앱/롤백용]
└── woodong_run_vote_closing()                       = core(null, null, ...)   [pg_cron]
```

`p_user_id`가 `null`이면 전체가 대상(배치), 지정하면 그 사용자만(lazy)이다. **규칙을 한 벌만 두는 것이 이 설계의 핵심**이다 — 두 벌로 복사하면 lazy와 배치의 판단이 갈라지고, 갈라지는 순간 "한쪽은 보냈는데 다른 쪽은 아직 안 보낸 것으로 아는" 중복 발송이 생긴다.

### 중복 발송 방지

두 core 함수 모두 **선점(UPDATE)과 알림 생성이 한 문장**이다.

- 회비 리마인드: `woodong_dues.last_reminded_at`을 `now()`로 갱신하는 `UPDATE`가 그대로 알림 INSERT의 원천이다.
- 투표 마감: `status = 'open'`인 행을 `'closed'`로 바꾸는 `UPDATE`가 그대로 알림 대상 목록이다.

동시에 두 경로가 같은 행을 노리면 뒤에 온 `UPDATE`는 행 잠금에서 기다렸다가 **갱신된 행으로 조건을 다시 평가**하고(READ COMMITTED의 EvalPlanQual) 0행이 된다. 즉 **lazy 경로와 배치 경로를 동시에 켜 두어도 중복 발송이 구조적으로 불가능**하다. 전환 중 두 경로를 겹쳐 돌릴 수 있었던 근거이자, 롤백이 안전한 근거다.

### 실행 권한

`*_core`와 `woodong_run_*`은 `public`/`anon`/`authenticated`에서 **EXECUTE를 회수**했다. `*_core`는 `p_user_id`를 인자로 받으므로 앱 롤이 직접 부를 수 있으면 남의 uuid를 넣어 다른 사람 이름으로 알림을 만들 수 있다. cron은 함수 소유자(`postgres`)로 실행되므로 회수의 영향을 받지 않는다.

---

## 점검

### 최근 실행 이력

```sql
select j.jobname, d.status, d.start_time, d.end_time, d.return_message
from cron.job_run_details d
join cron.job j on j.jobid = d.jobid
where j.jobname like 'woodong%'
order by d.start_time desc
limit 20;
```

- `status`가 `succeeded`가 아닌 행이 있으면 `return_message`에 원인이 남는다.
- ⚠️ `return_message`에는 **처리 건수가 남지 않는다**(`SELECT 1`만 기록된다). 건수는 Postgres 로그에 `[woodong-cron] due reminders created=N` / `[woodong-cron] votes closed=N` 형태로 남는다(`raise log`). Supabase Dashboard → Logs → Postgres에서 `woodong-cron`으로 검색한다.
- `cron.job_run_details`는 계속 쌓인다. Free 플랜 용량을 공유하므로(`docs/ops/FREE_PLAN_MONITORING.md`) 월 점검 때 크기를 확인하고 필요하면 오래된 행을 지운다.

### 결과 확인 (알림이 실제로 생겼는지)

```sql
select type, count(*), max(created_at) as latest
from public.woodong_notifications
where created_at >= now() - interval '2 days'
group by type
order by type;
```

### 수동 실행

배치를 기다리지 않고 지금 돌리려면 SQL Editor(= `postgres` 롤)에서 직접 부른다.

```sql
select public.woodong_run_due_reminders();  -- 생성된 리마인드 건수 반환
select public.woodong_run_vote_closing();   -- 이번에 마감된 투표 수 반환
```

---

## 전환·롤백 절차

배치가 오작동하면(중복은 구조적으로 불가능하지만, 예컨대 문구가 잘못됐거나 부하가 문제라면) **잡만 끄면 된다.** 함수와 앱 코드는 그대로 두어도 된다.

```sql
-- 1) 잡 비활성화 (등록은 남고 실행만 멈춘다)
select cron.alter_job((select jobid from cron.job where jobname = 'woodong_due_reminders'), active := false);
select cron.alter_job((select jobid from cron.job where jobname = 'woodong_vote_closing'), active := false);

-- 2) 완전히 제거해야 한다면
select cron.unschedule('woodong_due_reminders');
select cron.unschedule('woodong_vote_closing');
```

lazy 처리로 되돌리려면 Task 037의 **앱 커밋을 revert**한다. `woodong_process_due_reminders` / `woodong_close_expired_votes`는 시그니처·반환값·에러 코드를 그대로 유지한 채 DB에 남겨 두었으므로(DROP하면 되돌릴 수 없다) 마이그레이션을 다시 만들 필요가 없다.

---

## 알려진 제약

- **배치가 만드는 알림도 앱에서는 번역되어 보인다(Task 040에서 해소).** 알림 제목·본문은 여전히 생성 시점에 문자열로 저장되지만(웹 푸시 발송과 구버전 폴백에 필요하다), 이제 `template_key` + `params`가 함께 저장되어 **알림센터가 읽는 사람의 로케일로 문구를 조립**한다(`lib/woodong/notification-text.ts`). 배치가 만든 회비 리마인드도 en/ja/zh 사용자에게 각자의 언어로 보인다. ⚠️ **남은 한계: 웹 푸시로 나가는 문구는 여전히 저장된 한국어**다 — 발송 시점에는 읽는 사람의 브라우저가 아니라 Edge Function이 문자열을 고르기 때문이다. 해결하려면 사용자별 로케일 저장(`woodong_profiles.locale`)과 Edge Function 쪽 템플릿이 함께 필요하다.
- **투표 마감 알림은 최대 5분 늦는다.** 그 사이에도 참여는 막힌다 — 화면은 `closes_at`을 직접 보고 참여 위젯을 감추고(쿼리 계층의 `isClosed`), `woodong_prevent_closed_vote_response` 트리거가 서버에서 한 번 더 막는다. 지연은 "결과 알림이 언제 오느냐"와 "모임 상세의 진행 중 카드에 언제까지 남느냐"에만 영향을 준다.
- **Free 플랜 프로젝트가 일시정지되면 잡도 멈춘다.** 7일 미사용 시 정지되며(`docs/ops/FREE_PLAN_MONITORING.md`), 복구 후 밀린 실행을 몰아서 돌려주지는 않는다. 다만 두 잡 모두 "지금 조건에 맞는 행"을 찾는 방식이라 정지 기간 중 놓친 대상은 재개 후 첫 실행에서 그대로 처리된다.
