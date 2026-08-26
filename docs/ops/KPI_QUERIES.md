# 우동 KPI 산출 쿼리 (PRD 8장)

- **작성**: Task 034 (2026-08-26)
- **대상**: PRD 8장 성공 지표 6종
- **실행 방법**: Supabase SQL Editor 또는 `service_role` 연결에서 실행한다. **앱의 `anon`/`authenticated` 클라이언트로는 산출할 수 없다** — `woodong_vote_responses`는 본인 행만 SELECT 가능하고, `auth.users`는 애초에 노출되지 않는다.

---

## 요약

|  #  | 지표                                   | 산출 방식                     |      검증      |
| :-: | -------------------------------------- | ----------------------------- | :------------: |
| K1  | 주간 활성 모임 수(WAG)                 | 쿼리 (제약 있음)              |       ✅       |
| K2  | 알림 클릭률                            | 쿼리                          |       ✅       |
| K3  | 투표 참여율                            | 쿼리                          |       ✅       |
| K4  | 모임 생성 → 첫 회비 항목 7일 내 전환율 | 쿼리                          |       ✅       |
| K5  | 회비 납부율 개선폭                     | 설문(도입 전) + 쿼리(도입 후) | ✅ 쿼리 부분만 |
| K6  | 총무 1인당 정산 소요시간 감소          | 설문 전용                     |   해당 없음    |

**검증 방법**: 프로덕션 `woodong_*` 테이블은 Task 033에서 정리해 전부 0행이라 그대로는 아무것도 검증할 수 없다. 그렇다고 공유 프로젝트의 프로덕션 테이블에 픽스처를 넣고 싶지도 않아서, `woodong_kpi_sandbox` 스키마에 `CREATE TABLE ... (LIKE public.woodong_* INCLUDING DEFAULTS INCLUDING CONSTRAINTS)`로 **동일 구조의 사본**을 만들고 `search_path`를 그쪽으로 돌려 검증했다. 아래 쿼리는 스키마 접두어가 없으므로 `search_path`만 바꾸면 쿼리 문자열을 한 글자도 고치지 않고 그대로 돌아간다.

`user_id`에는 이 프로젝트에 실제로 존재하는 `auth.users.id`를 썼다(읽기만 함). 덕분에 K1의 `join auth.users`도 프로덕션과 완전히 같은 조인으로 검증됐다. 검증 후 `DROP SCHEMA woodong_kpi_sandbox CASCADE`로 지웠고, 프로덕션 `woodong_*` 13개 테이블이 모두 0행인 것과 `auth.users` 69행이 그대로인 것을 확인했다.

---

## K1. 주간 활성 모임 수 (WAG) — 목표 20개 이상

> PRD 정의: "주간 1회 이상 로그인 멤버가 있는 모임 수"

### ⚠️ 정의를 그대로 만족하는 쿼리는 "이번 주"만 낼 수 있다

**로그인 이벤트 로그가 없다.** 확인한 결과는 이렇다.

- `auth.audit_log_entries` — **0행**. 호스팅 GoTrue가 이 테이블을 채우지 않는다. 지난 주 로그인을 여기서 되찾을 수 없다.
- `auth.sessions` — 활성 세션만 남는다. 로그아웃/만료로 지워지므로 과거 주차 집계에 쓸 수 없다.
- `auth.users.last_sign_in_at` — **가장 최근 로그인 시각 하나뿐**이다.

`last_sign_in_at`으로 "최근 7일"을 재는 건 맞다. 마지막 로그인이 7일 안이면 7일 안에 로그인한 게 맞기 때문이다. 하지만 3주 전 주차의 WAG는 이 컬럼으로 복원할 수 없다. **K1-a는 매주 실행해서 값을 따로 적어 두어야 시계열이 된다.**

### K1-a. 정의 그대로 (이번 주 한정)

```sql
select count(distinct m.group_id) as weekly_active_groups
from woodong_group_members m
join auth.users u on u.id = m.user_id
where m.status = 'active'
  and u.last_sign_in_at >= now() - interval '7 days';
```

**검증**: 모임 3개(G1 활성 3명 / G2 2명 / G3 활성 2명 + 나간 멤버 1명)에서 G1·G3에만 최근 7일 로그인 멤버를 두었다 → **2 반환. 기대값과 일치.**

### K1-b. 활동 기반 대체 지표 (주차별 시계열 가능)

로그인 로그가 없는 동안 추세를 보려면 "멤버 활동이 1건이라도 있었던 모임"을 대신 센다. 모임 참여·공지 작성·회비 항목 생성·투표 생성/응답·알림 열람/클릭·납부 기록이 모두 타임스탬프를 남기므로 과거 주차도 소급 집계된다.

```sql
with member_activity as (
  select group_id, joined_at   as at from woodong_group_members where joined_at is not null
  union all
  select group_id, created_at  as at from woodong_announcements
  union all
  select group_id, created_at  as at from woodong_due_cycles
  union all
  select group_id, created_at  as at from woodong_votes
  union all
  select v.group_id, r.responded_at from woodong_vote_responses r join woodong_votes v on v.id = r.vote_id
  union all
  select group_id, read_at     as at from woodong_notifications where read_at is not null
  union all
  select group_id, clicked_at  as at from woodong_notifications where clicked_at is not null
  union all
  select group_id, paid_at     as at from woodong_payments
)
select
  date_trunc('week', at)::date as week_start,
  count(distinct group_id)     as active_groups
from member_activity
where at >= date_trunc('week', now()) - interval '8 weeks'
group by 1
order by 1;
```

**검증**: 8주치 픽스처에 대해 `2026-08-03: 1 / 08-10: 1 / 08-17: 2 / 08-24: 2` 반환. 주차 경계(`date_trunc('week')`는 월요일 시작)까지 손으로 계산한 값과 일치.

⚠️ **K1-b는 K1-a보다 낮게 나온다.** 로그인만 하고 아무것도 안 한 멤버는 잡히지 않는다. 두 지표를 섞어 추세를 논하면 안 되고, 목표(20개) 대비 달성 판정은 정의에 맞는 K1-a로 한다.

⚠️ `woodong_payments`에는 `created_at`이 없어 `paid_at`(총무가 입력한 **납부 일시**)을 썼다. 총무가 지난달 납부를 뒤늦게 기록하면 활동 시각이 과거 주차로 들어간다. 정확한 시계열이 필요하면 `woodong_payments.created_at` 추가를 검토한다.

### 후속 제안

로그인 시계열이 정말 필요해지면 **로그인 이벤트 테이블**(`woodong_login_events`: `user_id`, `occurred_at`)을 두고 세션 확립 지점에서 하루 1행씩 upsert하는 방식이 가장 싸다. 1차 MVP 범위 밖이므로 Phase 8(Task 040) 후보로만 남긴다.

---

## K2. 알림 클릭률 — 목표 40% 이상

```sql
select
  count(*)                                                 as sent_count,
  count(read_at)                                           as read_count,
  count(clicked_at)                                        as clicked_count,
  round(100.0 * count(clicked_at) / nullif(count(*), 0), 1) as click_rate_pct,
  round(100.0 * count(read_at)    / nullif(count(*), 0), 1) as read_rate_pct
from woodong_notifications
where status in ('sent', 'fallback_sent')
  and created_at >= now() - interval '8 weeks';
```

**검증**: `sent` 10건(열람 6, 클릭 4) + `failed` 1건 + `pending` 1건을 넣고 실행 → `sent_count 10 / read 6 / clicked 4 / 클릭률 40.0 / 열람률 60.0`. **미발송 2건이 분모에서 제외되는 것까지 확인.**

**주의사항**

- 분모를 `status in ('sent','fallback_sent')`로 제한하는 이유: `pending`/`failed`는 발송되지 않았으므로 클릭될 수 없다. 이걸 분모에 넣으면 클릭률이 실제보다 낮게 나온다. 팬아웃 RPC(`woodong_create_announcement` 등)는 삽입 시점에 바로 `'sent'`를 넣는다(컬럼 기본값은 `'pending'`이지만 실제로 쓰이지 않는다).
- **PRD 목표 "40% 이상"이 클릭률인지 열람률인지 모호하다.** 알림센터에서 알림을 열면 `read_at`이, 알림을 눌러 대상 화면으로 이동하면 `clicked_at`이 찍힌다. 두 값을 함께 뽑아 두었으니 판정 기준을 하나로 확정해야 한다(→ 미결 사항).
- 팬아웃은 **작성자 본인을 제외**하고(`m.user_id <> v_user`) 알림 설정을 끈 멤버도 제외하므로, 분모는 "실제 수신 대상"과 일치한다.

---

## K3. 투표 참여율 — 목표 60% 이상

### 투표별

```sql
with vote_stats as (
  select
    v.id,
    v.group_id,
    v.title,
    v.status,
    (select count(*) from woodong_group_members m
      where m.group_id = v.group_id and m.status = 'active')  as eligible_members,
    (select count(distinct r.user_id) from woodong_vote_responses r
      where r.vote_id = v.id)                                 as responders
  from woodong_votes v
  where v.created_at >= now() - interval '8 weeks'
)
select
  title,
  eligible_members,
  responders,
  round(100.0 * responders / nullif(eligible_members, 0), 1) as participation_pct
from vote_stats
order by title;
```

### 전체 집계

```sql
with vote_stats as (
  select
    v.id,
    (select count(*) from woodong_group_members m
      where m.group_id = v.group_id and m.status = 'active') as eligible_members,
    (select count(distinct r.user_id) from woodong_vote_responses r
      where r.vote_id = v.id)                                as responders
  from woodong_votes v
  where v.created_at >= now() - interval '8 weeks'
)
select
  count(*)                                                             as vote_count,
  round(avg(100.0 * responders / nullif(eligible_members, 0)), 1)      as avg_per_vote_pct,
  round(100.0 * sum(responders) / nullif(sum(eligible_members), 0), 1) as pooled_pct
from vote_stats;
```

**검증**: V1 `2/3 → 66.7%`, V2 `1/2 → 50.0%`, V3 `0/2 → 0.0%`를 정확히 반환했고, 집계는 `avg_per_vote 38.9% / pooled 42.9%`. **`status='left'`인 멤버가 분모에서 빠지는 것도 확인**(G3는 행이 3개지만 `eligible_members`가 2로 나왔다).

**주의사항**

- **`avg_per_vote_pct`와 `pooled_pct`는 다른 값이다.** 앞은 투표 하나를 1표로 세고(작은 모임이 크게 반영), 뒤는 사람 수로 센다(큰 모임이 크게 반영). 목표 60%를 어느 쪽으로 판정할지 확정해야 한다(→ 미결 사항). 검증 픽스처에서 38.9 vs 42.9로 갈렸다.
- 익명 투표도 `woodong_vote_responses.user_id`를 저장한다(RLS와 `woodong_get_vote_results()`가 노출을 막을 뿐이다). 따라서 익명 투표도 참여율 집계가 가능하다. 다만 **집계 결과에서 개인을 역추적할 수 있으므로 이 쿼리 결과를 모임에 공유하면 안 된다.**
- 분모를 "현재 활성 멤버 수"로 잡았다. 투표 종료 후 멤버가 늘거나 줄면 과거 투표의 참여율이 흔들린다. 정확히 하려면 투표 시점의 멤버 수 스냅샷이 필요한데 1차 MVP에는 없다.

---

## K4. 모임 생성 → 첫 회비 항목 7일 내 전환율 — 목표 70% 이상

```sql
with cohort as (
  select
    g.id,
    g.created_at,
    (select min(c.created_at) from woodong_due_cycles c where c.group_id = g.id) as first_cycle_at
  from woodong_groups g
  -- 관측창이 끝난 모임만 분모에 넣는다. 어제 만든 모임을 분모에 넣으면
  -- "아직 7일이 안 지난 것"이 미전환으로 집계돼 전환율이 구조적으로 낮게 나온다.
  where g.created_at <= now() - interval '7 days'
)
select
  count(*) as eligible_groups,
  count(*) filter (
    where first_cycle_at is not null
      and first_cycle_at <= created_at + interval '7 days'
  ) as converted_groups,
  round(
    100.0 * count(*) filter (
      where first_cycle_at is not null
        and first_cycle_at <= created_at + interval '7 days'
    ) / nullif(count(*), 0),
    1
  ) as conversion_rate_pct
from cohort;
```

**검증**: G1(8일 전 생성 → 3일 뒤 회비 항목 = 전환 O), G2(20일 전 생성 → 12일 뒤 = 7일 초과, 전환 X), G3(2일 전 생성 = 관측창 미완료) 픽스처에서 `eligible 2 / converted 1 / 50.0%` 반환. **G3가 분모에서 빠지는 것이 이 쿼리의 핵심이고 그대로 동작했다.**

---

## K5. 회비 납부율 개선폭 — 목표 +15%p 이상 (설문 + 쿼리 병행)

**순수 쿼리로 산출 불가.** "도입 전" 납부율은 서비스에 데이터가 없다(서비스를 쓰기 전이므로 당연하다). 총무의 자체 신고를 설문으로 받아야 한다. 도입 후 수치만 아래 쿼리로 산출한다.

### 도입 후 (쿼리)

```sql
select
  c.id                                       as due_cycle_id,
  c.group_id,
  c.title,
  count(d.id)                                as charged_count,
  count(*) filter (where d.status = 'paid')  as paid_count,
  round(100.0 * count(*) filter (where d.status = 'paid') / nullif(count(d.id), 0), 1) as headcount_rate_pct,
  sum(d.amount)                              as charged_amount,
  coalesce(sum(p.paid_amount), 0)            as collected_amount,
  round(100.0 * coalesce(sum(p.paid_amount), 0) / nullif(sum(d.amount), 0), 1) as amount_rate_pct
from woodong_due_cycles c
join woodong_dues d on d.due_cycle_id = c.id
left join lateral (
  select sum(amount) as paid_amount from woodong_payments where due_id = d.id
) p on true
group by c.id, c.title, c.group_id
order by c.title;
```

**검증**: 30,000원 × 3명 청구에서 전액 1명 / 15,000원 부분 납부 1명 / 미납 1명 → `인원 기준 33.3%, 금액 기준 50.0%`. 부분 납부가 인원 기준에서는 미납으로, 금액 기준에서는 절반으로 반영되는 것을 확인했다.

⚠️ **인원 기준과 금액 기준이 다르다.** 부분 납부가 있으면 반드시 갈린다. 설문으로 받는 "도입 전 납부율"과 **같은 기준**으로 비교해야 하며, 총무가 자체 신고할 때 떠올리는 값은 대개 인원 기준이다. 설문 문항에서 기준을 명시한다(아래 참고).

### 도입 전 (설문)

- **대상**: 우동으로 첫 회비 항목을 생성한 모임의 총무
- **시점**: 첫 회비 항목 생성 직후 1회 (모임 화면에 1회성 배너 또는 이메일)
- **문항**
  1. 우동을 쓰기 전, 회비 납부 마감일 기준으로 **회비를 낸 인원 비율**은 평균 몇 %였습니까? (0~100 슬라이더)
  2. 그 수치는 어떻게 파악하셨습니까? (① 장부·엑셀 기록 ② 대략적인 기억 ③ 모름)
- **집계**: 문항 2가 ③인 응답은 베이스라인에서 제외한다. 개선폭 = (도입 후 `headcount_rate_pct` 평균) − (문항 1 평균).

---

## K6. 총무 1인당 정산 소요시간 감소 — 목표 50% 이상 감소 (설문 전용)

**PRD 8장 정의 자체가 "설문 기반"이다.** 서비스는 총무가 화면 밖에서 쓴 시간(계좌 확인, 카톡 독촉, 엑셀 정리)을 관측할 수 없다.

- **대상**: 회비 항목을 1개 이상 만들고 납부 기록을 5건 이상 남긴 총무
- **시점**: ① 첫 회비 항목 생성 직후(도입 전 회상), ② 4주 뒤(도입 후 실측)
- **문항**
  1. (도입 전) 우동을 쓰기 전, **한 달치 회비를 정산하는 데** 총 몇 분 정도 쓰셨습니까? (분 단위 입력)
  2. (도입 후) 지난 한 달치 회비를 정산하는 데 총 몇 분 정도 쓰셨습니까? (분 단위 입력)
  3. (도입 후) 가장 시간을 아낀 부분은 무엇입니까? (① 납부 확인 ② 미납자 독촉 ③ 현황 공유 ④ 기타)
- **집계**: 두 시점 모두 응답한 총무만 대상으로 `(1 − 문항2/문항1)`의 중앙값. 표본이 작을 것이므로 평균 대신 중앙값을 쓴다.

⚠️ 문항 1은 **회상 응답**이라 과대 추정되기 쉽다(도입 후 편해졌다고 느끼면 과거를 더 힘들었던 것으로 기억한다). 목표 달성 여부를 이 지표 하나로 단정하지 않는다.

---

## 미결 사항 (판정 기준 확정 필요)

1. **K2 목표 40%가 클릭률인가 열람률인가.** 검증 픽스처에서 40.0% vs 60.0%로 갈렸다.
2. **K3 목표 60%를 `avg_per_vote_pct`로 볼지 `pooled_pct`로 볼지.** 38.9% vs 42.9%로 갈렸다.
3. **K5의 납부율 기준을 인원으로 할지 금액으로 할지.** 33.3% vs 50.0%로 갈렸다. 설문 문항이 인원 기준으로 작성돼 있으므로 인원 기준이 자연스럽다.
4. **K1 시계열 확보 여부.** 로그인 이벤트 테이블을 추가할지, K1-a 주간 수동 기록으로 버틸지.
