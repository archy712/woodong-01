# Supabase Free 플랜 운영 모니터링 체크리스트

- **작성**: Task 034 (2026-08-26)
- **배경**: 우동은 전용 Supabase 프로젝트를 쓰지 못하고 **다른 앱 2개와 Free 플랜 프로젝트를 공유**한다(PRD 5.0, `docs/ops/SUPABASE_SHARED_PROJECT.md`). 용량·커넥션·일시정지 정책이 전부 공유 자원이라, 우동이 아닌 앱의 사용량 때문에 우동이 멈출 수 있다.

---

## 착수 시점 실측 (2026-08-26 기준)

| 항목              | 실측        | Free 한도 | 여유         |
| ----------------- | ----------- | --------- | ------------ |
| 데이터베이스 크기 | **18.2 MB** | 500 MB    | 3.6% 사용    |
| `max_connections` | —           | **60**    | 현재 12 사용 |

스키마별 내역: `public` 4.2 MB(45개 테이블) / `auth` 1.5 MB(23개) / `realtime` 336 kB / `storage` 320 kB. 나머지는 시스템 카탈로그와 WAL이다.

`woodong_*` 13개 테이블은 현재 전부 0행이라(Task 033에서 픽스처 정리) **18.2 MB는 사실상 다른 앱 + Postgres 기본 오버헤드**다. 우동 데이터는 아직 이 숫자에 거의 기여하지 않았다.

---

## 정기 점검 항목

### 매주 (5분)

- [ ] **DB 용량** — 400 MB(80%)를 넘으면 경보. 아래 쿼리를 SQL Editor에서 실행한다.

  ```sql
  select
    pg_size_pretty(pg_database_size(current_database())) as db_size,
    round(100.0 * pg_database_size(current_database()) / (500 * 1024 * 1024), 1) as pct_of_free_limit;
  ```

- [ ] **우동이 차지하는 비중** — 우리 몫이 얼마나 늘었는지 본다. 급증하면 원인 테이블을 바로 알 수 있다.

  ```sql
  select
    c.relname as table_name,
    pg_size_pretty(pg_total_relation_size(c.oid)) as total_size,
    (select n_live_tup from pg_stat_user_tables t where t.relid = c.oid) as approx_rows
  from pg_class c
  join pg_namespace n on n.oid = c.relnamespace
  where n.nspname = 'public' and c.relkind = 'r' and c.relname like 'woodong_%'
  order by pg_total_relation_size(c.oid) desc;
  ```

- [ ] **프로젝트 일시정지 방지** — Free 플랜은 **7일간 요청이 없으면 프로젝트를 일시정지**한다. 프로덕션(https://woodong-01.vercel.app)에 실제 트래픽이 없는 기간에는 주 1회 이상 접속해 세션을 만든다. 위 용량 쿼리를 돌리는 것만으로도 요청이 발생하므로 이 점검을 거르지 않는 것이 곧 일시정지 방지책이다.

- [ ] **K1-a WAG 기록** — `docs/ops/KPI_QUERIES.md`의 K1-a는 **이번 주 값만 산출 가능**하다. 매주 실행해 값을 적어 두지 않으면 시계열이 영영 복원되지 않는다. 아래 표에 누적한다.

### 매월 (15분)

- [ ] **Supabase advisor 확인** — `get_advisors`로 security/performance 점검. 판정 기준은 Task 033에서 확정한 대로 "**woodong 소유 항목 중 조치 가능한 것 0건**"이다. 다른 앱 소유(`departments`, `weekly_log_*`, `org_*` 등) 경고는 우리 소관이 아니다.
- [ ] **Storage 사용량** — `woodong-covers`/`woodong-receipts` 버킷 용량 확인(Free 한도 1 GB). 모임 대표 이미지는 클라이언트에서 리사이즈해 올리므로 급증할 일은 없지만, 삭제된 모임의 고아 오브젝트가 남지 않는지 본다.
- [ ] **Auth 사용자 수** — MAU 한도(Free 50,000) 대비 여유 확인. 현재 프로젝트 전체 69명이며 대부분 다른 앱 사용자다.
- [ ] **커넥션 사용량** — 피크 시간대에 아래를 실행해 `max_connections`(60) 대비 여유를 본다. Vercel Fluid compute가 요청마다 새 Supabase 클라이언트를 만들지만 PgBouncer 뒤에 있으므로 보통 문제되지 않는다. 다만 다른 앱과 **같은 풀을 쓴다**는 점이 리스크다.

  ```sql
  select
    (select count(*) from pg_stat_activity) as current_connections,
    (select setting::int from pg_settings where name = 'max_connections') as max_connections,
    (select count(*) from pg_stat_activity where state = 'idle in transaction') as idle_in_transaction;
  ```

### 분기 (30분)

- [ ] **유료 전환 / 프로젝트 분리 판단** — 아래 임계값 중 하나라도 넘으면 결정을 미루지 않는다.

---

## 경보 임계값과 대응

| 신호                         | 임계값        | 대응                                                                                                                                     |
| ---------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| DB 용량                      | 400 MB (80%)  | 우동 몫이 주원인이면 Pro 전환 검토. 다른 앱이 주원인이면 **우동만 신규 프로젝트로 이관**(`woodong_*` 접두어로 격리해 둔 이유가 이것이다) |
| DB 용량                      | 450 MB (90%)  | 즉시 조치. Free 한도 초과 시 쓰기가 막힌다                                                                                               |
| `idle in transaction` 커넥션 | 5개 이상 지속 | 커넥션 누수 조사. 서버 컴포넌트가 Supabase 클라이언트를 전역에 들고 있지 않은지 확인(`lib/supabase/server.ts` 주석 참고)                 |
| 프로젝트 미접속              | 5일           | 일시정지(7일) 전에 접속. 데모/QA 기간에 특히 주의                                                                                        |
| Storage 용량                 | 800 MB (80%)  | 고아 오브젝트 정리 후 재평가                                                                                                             |

---

## 이관 시 사전 확인 사항

프로젝트를 분리하게 되면 `woodong_*` 테이블만 옮기면 되도록 설계돼 있지만, **그대로 옮겨지지 않는 것이 두 가지** 있다.

1. **`profiles` 테이블은 공유 테이블이다.** 우동은 `id`/`email`/`name`/`phone_number`/`bio`를 재사용 중이고(`lib/woodong/profile.ts`), 이 테이블은 다른 앱 소유다. 이관 시 우동 전용 프로필 테이블을 새로 만들고 데이터를 옮겨야 한다.
2. **`auth.users`가 그대로 넘어가지 않는다.** 사용자 계정은 프로젝트에 묶여 있으므로 이관 시 재가입이 필요하거나 별도의 사용자 마이그레이션이 필요하다. 이 비용이 이관의 실질적 걸림돌이므로, **이관보다 Pro 전환이 거의 항상 싸다**는 점을 판단 시 기억한다.

---

## 주간 기록

| 주차 (월요일) | DB 용량 | woodong 행 수 합계 | K1-a WAG | 비고                    |
| ------------- | ------- | ------------------ | -------- | ----------------------- |
| 2026-08-24    | 18.2 MB | 0                  | 0        | Task 034 착수 시점 실측 |
