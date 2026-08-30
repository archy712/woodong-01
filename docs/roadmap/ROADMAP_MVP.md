# 우동(Woodong) 1차 MVP 개발 로드맵

동호회/모임의 운영·회비 정산·투표를 한 곳에서 관리해 "총무 1인 부담"을 줄이는 모바일 우선 웹 서비스.

- **문서 버전**: v1.6 (알림 매체 로드맵 변경 — 카카오톡 알림톡/Slack/이메일 제외, 웹 푸시로 대체)
- **기준 PRD**: `docs/prd/PRD_MVP.md` (v1.5, 2026-08-24)
- **레포지토리(코드네임)**: `moim-ops` / 작업 디렉토리 `woodong-01`
- **사용자 노출명**: 우동 (Woodong)
- **1차 MVP 목표 기간**: 4주 (약 160h, 1인 개발 기준)

**📅 최종 업데이트**: 2026-08-30
**📊 진행 상황**: Phase 0~7 완료(1차 MVP 범위 전량) + Phase 8 진행 중 — **43/44 Tasks 완료**, 마지막 Task 040은 7개 항목 중 4개 완료. 프로덕션 배포됨: https://woodong-01.vercel.app

---

## 개요

우동은 **동호회/러닝크루/등산모임 운영진(총무)과 10~50명 규모 소규모 커뮤니티 멤버**를 위한 모임 운영 자동화 서비스로, 1차 MVP에서 다음 기능을 제공합니다.

- **모임 관리**: 모임 생성/수정/삭제, 초대 코드 기반 참여, 총무/일반회원 역할 구분
- **회비 현황 관리(3.4-a)**: 회비 항목(사이클) 생성, 멤버별 청구 자동 생성, 납부 상태 수동 대사, 납부율 대시보드
- **모임 알림(앱 내)**: 공지사항 발송, 알림센터 읽음/클릭 처리, 회비 리마인드 lazy 처리
- **투표 관리**: 객관식/찬반 투표, 복수 선택·익명 옵션, lazy 마감 + 수동 조기마감, 결과 알림
- **인증**: 이메일/비밀번호 + Google + Kakao 소셜 로그인 (Naver는 1차 제외)

> **범위 원칙**: 본 로드맵의 Phase 구성은 PRD 7.1절의 우선순위 0~8을 그대로 따르며, 7.2절 2차 확장 항목은 Phase 8에 별도 격리한다. 우선순위/범위/리스크를 임의로 재해석하지 않는다.

### 1차 MVP 범위 매핑 (PRD 7.1)

| PRD 우선순위 | 기능                                              | 대응 Phase | 대응 Task |
| :----------: | ------------------------------------------------- | ---------- | --------- |
|      0       | Supabase 프로젝트 정비 (5.0, 4.2) — **선행 작업** | Phase 0    | 001~005   |
|      —       | 애플리케이션 골격 (구조 우선 접근법)              | Phase 1    | 006~009   |
|      7       | 디자인 시스템 (3.7)                               | Phase 2    | 010, 013  |
|      8       | 푸터 특수 요구사항 (3.8)                          | Phase 2    | 011       |
|      6       | 모임 메인 페이지 (3.1)                            | Phase 2    | 014       |
|      1       | 인증 (3.6)                                        | Phase 3    | 015~018-1 |
|      2       | 모임 관리 (3.2)                                   | Phase 4    | 019~021-1 |
|      3       | 회비 현황 관리 (3.4-a)                            | Phase 5    | 022~024-1 |
|      4       | 모임 알림 — 앱 내 알림만 (3.3)                    | Phase 6    | 025~028   |
|      5       | 투표 관리 (3.5)                                   | Phase 6    | 029~030-1 |
|      —       | 품질/성능/배포 마무리                             | Phase 7    | 031~034   |
|     7.2      | **2차 확장 (MVP 이후)**                           | Phase 8    | 035~040   |

### 4주 일정 배분

| 주차       | 주요 Phase                              | 산출물                                                                             |
| ---------- | --------------------------------------- | ---------------------------------------------------------------------------------- |
| **Week 1** | Phase 0 + Phase 1                       | `woodong_*` 스키마·RLS·Storage 준비 완료, 전체 라우트 골격과 타입/폼 아키텍처 확정 |
| **Week 2** | Phase 2 + Phase 3(착수)                 | 더미 데이터 기반 전체 UI 완성, 브랜드 테마 적용, 인증 플로우 개편                  |
| **Week 3** | Phase 3(완료) + Phase 4 + Phase 5(착수) | 소셜 로그인 동작, 모임 CRUD/초대/역할 관리 실데이터 연동                           |
| **Week 4** | Phase 5(완료) + Phase 6 + Phase 7       | 회비 대시보드, 앱 내 알림, 투표 lazy 마감, 성능·E2E 회귀·배포                      |

---

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스(`CLAUDE.md`, `docs/guides/`)를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `docs/roadmap/ROADMAP_MVP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 새 작업 문서는 빈 체크박스 상태로 시작하며 변경 사항 요약은 비워 둠

3. **작업 구현**

- 작업 파일의 명세서를 따름
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 E2E 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 테스트 통과 확인 후 다음 단계로 진행하고, 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- `/update-roadmap` 슬래시 커맨드로 완료된 Task를 ✅로 표시하고 진행 상황(N/44) 갱신

### 코드베이스 정합성 규칙 (모든 Task 공통, PRD 부록)

- 신규 공개 페이지는 `lib/supabase/proxy.ts`의 `updateSession()` allow-list에 반드시 등록한다.
- 모든 신규 페이지는 얇은 `export default function Page()` + `<Suspense fallback={...}><XxxContent /></Suspense>` + `async function XxxContent()` 패턴을 따른다(`cacheComponents: true` 대응).
- 세션 확인은 `getUser()`가 아니라 **`getClaims()`**를 사용한다.
- Supabase 클라이언트는 컨텍스트별로 `lib/supabase/client.ts`(브라우저) / `server.ts`(서버, 요청마다 신규 생성) / `proxy.ts`를 구분해서 사용한다.
- 신규 UI 문자열은 `lib/i18n/dictionaries/types.ts`의 `Dictionary` 타입과 `{ko,en,ja,zh}.ts` **4개 파일에 모두** 반영한다(strict 인터페이스 + pre-commit `tsc --noEmit` 때문에 누락 시 커밋 실패).
- 신규 폼(모임 생성, 회비 항목 생성, 투표 생성 등)은 **react-hook-form + zod + Server Actions**(`docs/guides/forms-react-hook-form.md`) 패턴을 기본 채택하고, 뮤테이션 후 갱신은 `revalidatePath`/`revalidateTag`로 처리한다. **인증 폼만** 기존 "Client Component에서 `supabase.auth.*` 직접 호출" 패턴을 유지한다.
- 아이콘은 lucide-react만 사용하고, 신규 컴포넌트는 `npx shadcn@latest add` 우선, 레지스트리에 없을 때만 `components/` 루트에 직접 구현한다.

---

## 개발 단계

### Phase 0: Supabase 프로젝트 정비 (PRD 우선순위 0 — 선행 작업) ✅

> **전제**: Supabase 무료 플랜 프로젝트를 **다른 앱과 공유**한다(신규 프로젝트 생성 없음). 우동 전용 객체는 전부 `public` 스키마에 **`woodong_` 접두어**로 생성하고, 기존 테이블(`profiles`, `notifications`, `weekly_logs`, `organizations` 등)에는 **어떠한 `ALTER`/`DROP`/`TRUNCATE`도 수행하지 않는다**(PRD 5.0).
> **의존성**: Phase 0 전체가 Phase 3~6의 선행 작업이다. Phase 1·2는 Phase 0과 병렬 진행 가능하다.

- **Task 001: Supabase 공유 프로젝트 사전 점검 및 운영 정책 확정** ✅ - 완료
  - ✅ `list_tables` / `list_extensions` / `list_migrations`로 공유 프로젝트 현황 스냅샷 확보 및 기존 테이블 목록 문서화 (`docs/ops/SUPABASE_SHARED_PROJECT.md`)
  - ✅ `profiles` 재사용 범위 확정: `id`/`email`/`name`/`phone_number`/`bio`는 **읽기 전용 재사용**, `role`·`avatar_key`·`notify_on_*`는 **재사용 금지**로 코드 규약화
  - ✅ `notifications`(기존 공유 테이블) 재사용 불가 사실 확인 및 `woodong_notifications` 신규 생성 방침 확정
  - ✅ Supabase Auth 설정 결정 및 적용: Manual Linking 베타 옵션 활성화 완료, Kakao "이메일 없이 가입 허용"(EmailOptional)은 Biz App 미등록 전제로 기본 경로 확정(Task 016에서 provider별로 적용)
  - ✅ Free 플랜 제약 확인 및 운영 방침 수립: DB 500MB 용량·커넥션 풀 공유 모니터링, "7일 미사용 시 프로젝트 일시정지" 대비 QA 기간 정기 접근 루틴
  - ✅ `service_role` 키를 `NEXT_PUBLIC_` 접두사 없는 서버 전용 환경 변수로 등록(`.env.local` 완료, Vercel 환경 변수는 Task 033 배포 시 등록)
  - **완료 조건**: 공유 프로젝트 현황 스냅샷 문서화 완료, Auth 옵션 3종(이메일 없는 사용자 허용 / Manual Linking / OAuth provider) 결정 기록, 서버 전용 환경 변수 등록 확인

- **Task 002: `woodong_*` 테이블 마이그레이션 작성 및 적용** ✅ - 완료
  - ✅ PRD 5.2~5.7 마이그레이션: `woodong_groups`, `woodong_group_members`, `woodong_group_invites`, `woodong_due_cycles`, `woodong_dues`, `woodong_payments`
  - ✅ PRD 5.10~5.13 마이그레이션: `woodong_votes`, `woodong_vote_options`, `woodong_vote_responses`, `woodong_announcements`, `woodong_notifications`, `woodong_notification_preferences`
  - ✅ PRD 5.8~5.9(`woodong_expenses`, `woodong_settlements`, `woodong_settlement_items`)는 **2차 확장 대상**으로 확정, 기본 방침대로 Phase 8로 미룸(이번 Task에서 미생성)
  - ✅ 제약 조건 반영: `UNIQUE(group_id, user_id)`(멤버십), `UNIQUE(code)`(초대), `UNIQUE(due_cycle_id, user_id)`(청구), `UNIQUE(user_id, channel)`(알림 설정)
  - ✅ 사용자 참조는 **`auth.users(id)`를 FK 대상**으로 설계(생성/기록자 컬럼은 `ON DELETE SET NULL`, 소유 주체 컬럼은 `ON DELETE CASCADE`로 분기)
  - ✅ 확장성 컬럼 반영: `woodong_groups.type`(자유 값), `woodong_due_cycles.due_type`(`regular`/`extra`), `woodong_notification_preferences.channel`의 `CHECK(channel in ('kakao','slack','email','in_app'))` — 그 외 열거형 컬럼에도 CHECK 제약 동일 적용 (✅ v1.6 후속 완료: 알림 매체 로드맵이 `web_push`/`in_app`으로 바뀌면서 이 CHECK 제약도 **Task 027의 `update_woodong_notification_channel_check` 마이그레이션에서 `('web_push','in_app')`로 갱신**했다 — `woodong_notifications.channel`도 동일. 원래 Task 038 예정이었으나 그때까지 미루면 Task 027의 "web_push 설정 저장"이 CHECK 위반으로 불가능해 앞당겼다)
  - ✅ 금액 컬럼은 전부 `numeric(14,0)`(원 단위, 소수점 없음)로 통일
  - ✅ 모든 FK 컬럼에 covering 인덱스 추가(24개), `woodong_announcements.updated_at` 자동 갱신 트리거(`woodong_set_updated_at()`) 구현
  - **완료 조건**: 12개 `woodong_*` 테이블 생성 완료(`create_woodong_groups_domain`/`create_woodong_dues_domain`/`create_woodong_votes_domain`/`create_woodong_announcements`/`create_woodong_notifications_domain` 5개 마이그레이션), 기존 32개 테이블 변경 이력 0건, `list_tables`로 접두어 규칙 위반 객체 없음 확인, `get_advisors`는 RLS 비활성 경고(Task 003에서 해소 예정) 외 이상 없음

- **Task 003: RLS 헬퍼 함수 및 정책 구현** ✅ - 완료
  - ✅ `woodong_is_group_member(p_group_id uuid)` / `woodong_is_group_admin(p_group_id uuid)`를 `SECURITY DEFINER` + `set search_path = ''`로 정의(PRD 4.2)
  - ✅ 모든 `woodong_*` 테이블 `ENABLE ROW LEVEL SECURITY` 적용
  - ✅ SELECT 정책에 `woodong_is_group_member(group_id)`, 쓰기 정책에 `woodong_is_group_admin(group_id)` 적용 — **`woodong_group_members` 자신의 정책도 동일 함수를 사용해 `infinite recursion detected in policy(42P17)` 회피** 확인
  - ✅ `woodong_vote_responses`: (a) 본인 레코드만 SELECT/INSERT 가능한 행 단위 정책, (b) `woodong_get_vote_results()` — 익명/실명 투표 결과를 함께 처리하는 `SECURITY DEFINER` 함수로 통합 구현(익명은 카운트만, 실명은 투표자 이름 배열까지 반환 — Task 030 요구사항 선반영)
  - ✅ `woodong_notification_preferences`: 본인 레코드만 SELECT/INSERT/UPDATE
  - ✅ `woodong_notifications`: 본인 수신 레코드만 SELECT, `read_at`/`clicked_at`만 UPDATE 허용하는 **컬럼 보호 트리거**를 `woodong_notifications` 전용으로 신규 구현(기존 `notifications_protect_columns`는 재사용하지 않음)
  - ✅ **마지막 총무 보호 트리거**: `woodong_group_members`에서 마지막 `admin`의 `role` 변경 및 `status='left'` 전환을 차단(PRD 3.2 AC, 5.3, 9장 "총무 단일 실패점") — SQL 레벨 시나리오 테스트로 정확한 에러 문구까지 검증 완료
  - ✅ `woodong_dues.status` 자동 갱신 트리거: 연결된 `woodong_payments.amount` 합계와 `woodong_dues.amount`를 비교해 `unpaid`/`partial`/`paid` 갱신(INSERT/UPDATE/DELETE 전부 대응) — 부분납부→완납→재부분납부 3단계 SQL 시나리오로 검증 완료
  - ✅ `woodong_vote_responses` 중복 방지 `BEFORE INSERT` 트리거: `woodong_votes.allow_multiple`을 조회해 `false`면 `UNIQUE(vote_id, user_id)` 상당, `true`면 `UNIQUE(vote_id, user_id, option_id)` 상당으로 분기 검증
  - ✅ `woodong_group_invites.used_count` 원자적 증가 RPC 정의(동시성 이슈 방지)
  - ✅ (계획에 없던 추가 보정) 신규 `SECURITY DEFINER` 함수 8개에 대해 이 공유 프로젝트의 `ALTER DEFAULT PRIVILEGES`가 `anon`에 EXECUTE를 직접 부여하던 문제를 발견해 명시적 REVOKE로 차단, 트리거 전용 함수 5개(4개 신규 + Task 002의 `woodong_set_updated_at`)에 남아있던 `authenticated`/`anon` 직접 실행 권한도 기존 프로젝트 컨벤션(트리거 함수는 EXECUTE 완전 회수)에 맞춰 회수
  - **완료 조건**: `get_advisors`(security) **ERROR 0건** 달성(RLS 비활성 12건 전부 해소). 남은 WARN은 전부 기존 프로젝트 소유 항목이거나, `woodong_is_group_member`/`woodong_is_group_admin`/`woodong_get_vote_results`/`woodong_increment_invite_used_count`처럼 `authenticated`에게 의도적으로 열어둔 RPC뿐(기존 `is_admin()` 등과 동일 패턴, 문자 그대로의 "경고 0건"은 아니지만 실질적 위험 없음). 재귀 오류(42P17) 미발생, 총무 강등/탈퇴 차단 및 납부 상태 자동 갱신을 SQL 레벨에서 검증 완료

- **Task 004: Storage 비공개 버킷 및 서명 URL 유틸 구성** ✅ - 완료
  - ✅ `woodong-receipts`(영수증), `woodong-covers`(모임 대표 이미지) 버킷을 **모두 비공개(private)**로 생성(`file_size_limit=5242880`, `allowed_mime_types`: jpeg/png/webp)
  - ✅ `storage.objects`에 `woodong_is_group_member`/`woodong_is_group_admin` 기반 정책 적용 — 오브젝트 경로를 `{group_id}/파일명` 컨벤션으로 고정하고 `(storage.foldername(name))[1]`로 그룹 판별(기존 `weekly-log-attachments` 정책 패턴과 동일 스타일), 버킷 2개 × SELECT/INSERT/UPDATE/DELETE 총 8개 정책
  - ✅ 조회 시 `createSignedUrl()`로 임시 URL을 발급하는 공통 유틸 작성(`lib/supabase/storage.ts`의 `getSignedStorageUrl()`, `buildGroupObjectPath()`) — public URL 미사용
  - ✅ **클라이언트 사이드 리사이즈 유틸**(`lib/storage/image.ts`의 `resizeImageFile()`, Canvas API로 업로드 전 축소 후 JPEG 재인코딩) 구현 — Supabase Storage 서버 사이드 이미지 변환은 **Pro 플랜 전용**이므로 1차는 이 방식으로 대체(PRD 4.1, 9장)
  - ✅ 원본 업로드 5MB 제한 검증 로직(`validateImageFile()`) 및 `next/image` 연동(`next.config.ts`의 `images.remotePatterns`가 서명 URL 경로 `/storage/v1/object/sign/**`만 허용)
  - **완료 조건**: 버킷 2개 비공개 생성 확인, RLS 정책 8건으로 비멤버 접근 차단 설계 완료(실제 업로드 E2E 검증은 로그인 플로우가 준비되는 Task 019/033에서 수행 예정), 리사이즈/검증 유틸 구현 및 `npm run check-all`(typecheck/lint) 통과 확인

- **Task 005: `database.types.ts` 재생성 및 타입 레이어 정비** ✅ - 완료
  - ✅ `mcp__supabase__generate_typescript_types`로 `lib/supabase/database.types.ts` 재생성(다른 앱 테이블 타입이 함께 포함되는 것은 정상) — `woodong_*` 테이블 12개 + 함수 4개(`woodong_is_group_member`/`woodong_is_group_admin`/`woodong_get_vote_results`/`woodong_increment_invite_used_count`) 전부 반영 확인
  - ✅ `Tables<"woodong_groups">` 등 헬퍼 기반으로 도메인별 `Pick` 타입 컨벤션 정리(`components/profile-form.tsx` 패턴 준용) — 절차를 `docs/guides/product-structure.md`에 문서화
  - ✅ **(재생성 과정에서 발견한 선행 버그 수정)** 기존 `database.types.ts`가 실제 스키마가 아니라 스타터킷 최초 템플릿의 가짜 `profiles` 컬럼(`username`/`full_name`/`avatar_url` — 실제로는 존재하지 않음)을 담고 있었고, 이를 쓰던 `components/profile-form.tsx`/`app/protected/profile/page.tsx`가 이미 런타임에서 깨져 있었음(타입 재생성 전엔 가짜 타입 덕에 컴파일만 통과). 실제 컬럼(`id`/`email`/`name`/`phone_number`/`bio`)으로 맞추되, PRD 5.0/5.1의 "읽기 전용 재사용" 원칙에 따라 **쓰기(UPDATE) 기능은 제거하고 읽기 전용 표시로 전환**(사용자 확인 후 결정)
  - ✅ `npm run typecheck` 통과 확인 및 재생성 절차를 개발 가이드에 문서화(`docs/guides/product-structure.md`)
  - **완료 조건**: `npm run check-all` 통과(typecheck/lint/format:check 전부 0 에러 확인 — 과정에서 무관한 기존 포맷 오류 1건도 함께 정리), `woodong_*` 테이블 타입이 전부 반영됨

---

### Phase 1: 애플리케이션 골격 구축 (구조 우선) ✅

> **목적**: 실제 기능 구현 전에 전체 라우트·타입·폼 아키텍처를 먼저 확정해 중복 작업을 최소화하고 UI/백엔드 병렬 개발을 가능하게 한다.
> **의존성**: Phase 0과 병렬 진행 가능(Task 007의 DB 파생 타입만 Task 005 이후 정합성 확인).

- **Task 006: 라우트 구조 및 페이지 스캐폴딩** ✅ - 완료
  - ✅ PRD 6장 IA 기준 App Router 라우트 골격 생성:
    - ✅ 공개: `app/page.tsx`(랜딩), `app/invite/[code]/page.tsx`(초대 참여), 기존 `/icons`·`/gallery` 유지
    - ✅ 보호: `app/protected/groups/page.tsx`(목록), `groups/new`, `groups/[groupId]`(상세/홈), `groups/[groupId]/settings`, `groups/[groupId]/announcements`(+`/new`), `groups/[groupId]/dues`, `groups/[groupId]/votes`(+`/new`, `/[voteId]`), `app/protected/notifications`(알림센터), `app/protected/me`(마이페이지)
    - ✅ 2차 확장 라우트(`dues/expenses`, `settlements`)는 이번 Phase에서 생성하지 않음
  - ✅ 모든 페이지를 얇은 `Page` + `<Suspense>` + `XxxContent` 패턴의 빈 껍데기로 생성
  - ✅ `lib/supabase/proxy.ts`의 `updateSession()` allow-list에 `/invite` 신규 공개 경로 등록
  - ✅ `app/protected/**` 개별 서버 컴포넌트에 `getClaims()` 이중 방어 스텁 배치
  - **완료 조건**: 모든 라우트가 404 없이 렌더링되고 비로그인 시 보호 라우트가 `/auth/login`으로 리다이렉트됨, dev 오버레이 `blocking-route` 에러 0건 — curl 검증 완료(공개 200 / 보호 307→로그인)

- **Task 007: 도메인 타입 및 zod 스키마 정의** ✅ - 완료
  - ✅ `lib/woodong/`(도메인별 파일: `groups`/`dues`/`votes`/`announcements`/`notifications`/`common`)에 모임/멤버/초대/회비/투표/공지/알림 도메인 타입 정의(`Tables<"woodong_...">` 파생 `Pick`/`Omit` 컨벤션)
  - ✅ 역할·상태 리터럴 유니온 정의: `role`, `member status`, `dues status`, `vote status`, `notification status`, `channel` 전부 database.types.ts/CHECK 제약과 대조해 정의(`woodong_groups.type`은 CHECK 제약이 없는 자유 값으로 확인되어 상수 힌트만 제공)
  - ✅ 폼 입력 검증용 zod 스키마 6종 정의(모임 생성, 초대 발급, 회비 항목 생성, 납부 기록, 공지 작성, 투표 생성/응답) — 실제 설치 버전 `zod@3.25.76`(v3) API 기준
  - ✅ Server Action 응답 타입 `ActionResult<T>`(성공/필드 에러/일반 에러) 공통 규격 정의(`lib/woodong/common.ts`)
  - **완료 조건**: DB 타입(Task 005)과 도메인 타입 간 불일치 0건, `npm run typecheck` 통과

- **Task 008: 폼 아키텍처 및 Server Action 기반 구축** ✅ - 완료
  - ✅ `docs/guides/forms-react-hook-form.md` 기준 react-hook-form + zod + Server Actions 공통 래퍼/훅 구현(`hooks/use-server-action-form.ts`의 `useServerActionForm()`)
  - ✅ `revalidatePath`/`revalidateTag` 기반 뮤테이션 후 갱신 규약 확립(`cacheComponents: true` 환경, `"use cache"` 도입 시 `revalidateTag` 추가 방식으로 확장 예정 문서화)
  - ✅ 공통 에러 처리(`lib/woodong/errors.ts`의 `mapSupabaseError()`)·토스트(`sonner`)·낙관적 UI 패턴(`useOptimistic` 활용 지점 문서화) 정의, RLS 거부(`42501`) 응답의 사용자 메시지 매핑 규칙 수립
  - ✅ 인증 폼은 기존 Client Component 직접 호출 패턴 유지한다는 예외 규칙을 `docs/guides/forms-react-hook-form.md`에 명문화
  - ✅ **(과정에서 발견한 선행 버그 수정)** Task 003의 `woodong_group_members_insert_bootstrap_admin` RLS 정책이 `woodong_groups`를 직접 서브쿼리해 순환 참조를 일으켜, 어떤 사용자도 자신이 만든 모임의 admin으로 자기등록할 수 없던 버그를 발견·수정(`woodong_created_group()` SECURITY DEFINER 함수 신설, 기존 `woodong_is_group_member` 패턴과 동일하게 EXECUTE 권한 구성)
  - **완료 조건**: 샘플 폼(모임 생성 폼, `components/create-group-form.tsx`)이 유효성 검사 → Server Action(`createGroupAction`) → `revalidatePath` → 화면 갱신까지 end-to-end로 동작(Playwright 실계정 검증 완료, `woodong_group_members`에 admin 자동 등록 SQL로 확인)

- **Task 009: i18n Dictionary 확장 및 4개 언어 스텁 구성** ✅ - 완료
  - ✅ 우동 도메인 문자열 키 설계: `common` 신규 키 13개 + `groups`/`dues`/`votes`/`notifications`/`auth`/`errors`/`emptyStates` 7개 네임스페이스 신규 추가
  - ✅ `lib/i18n/dictionaries/types.ts`의 `Dictionary` strict 인터페이스에 신규 키 추가
  - ✅ `ko.ts`에 브랜드 톤앤매너 반영한 확정 문구 작성(예: `emptyStates.noGroups` "아직 속한 모임이 없어요. 우동, 모임을 부탁해!", `dues.reminderToastMessage` "아직 회비 납부 전이시네요. 우동이 살짝 알려드릴게요!")
  - ✅ `en.ts`/`ja.ts`/`zh.ts`에는 신규 키에 한해 동일 한국어 문자열을 스텁으로 복사(기존 랜딩/갤러리 번역은 유지) + `TODO(i18n)` 주석으로 2차 확장 표시
  - **완료 조건**: 4개 언어 파일 키 개수 일치(각 198개 확인), `npm run typecheck` 및 pre-commit 훅 통과

---

### Phase 2: 디자인 시스템 및 UI 완성 (더미 데이터 활용) ✅

> **PRD 우선순위 7(디자인 시스템), 8(푸터 요구사항), 6(모임 메인 페이지)에 해당.**
> **의존성**: Task 006(라우트 골격) 필요. Phase 0과 병렬 진행 가능(모든 화면은 하드코딩 더미 데이터 사용).

- **Task 010: 우동 브랜드 디자인 토큰 적용** ✅ - 완료
  - ✅ 코럴/앰버 계열 컬러 팔레트를 `app/globals.css`의 `:root`/`.dark` HSL CSS 변수(`--primary` 등)와 `tailwind.config.ts`의 `theme.extend.colors`에 함께 반영(v3 방식 하이브리드 구성 유지) — 라이트 `--primary: 14 85% 44%`(진한 코럴), 다크 `--primary: 14 85% 58%`(밝은 코럴), `--accent`는 앰버(`38 92% 50%`)로 통일, `--chart-1~5`도 코럴/앰버 계열로 재배치
  - ✅ 다크모드(next-themes) 대비비 검증: `--primary`(대비 4.83:1)·`--accent`(대비 7.99:1) 등 주요 시맨틱 토큰을 WCAG 공식으로 직접 계산해 4.5:1 이상 확보, `/gallery` 라이트·다크 스크린샷으로 버튼 variant 6종 육안 검증 완료
  - ✅ `tailwind.config.ts`에 테마 전환과 무관한 장식용 고정 팔레트 `brand.coral`(`DEFAULT`/`dark`/`tint`)·`brand.amber`(`DEFAULT`/`tint`) 추가 — CSS 변수 값과 동일한 HEX로 로고/마케팅 그래픽 전용, 화면 UI는 시맨틱 토큰 우선 사용 원칙을 주석으로 명시
  - ✅ 로고/파비콘(우동 그릇 모티프 + 사람 아이콘) 자산 적용: `components/logo.tsx`(헤더용 `Logo`/`LogoMark`), `app/icon.tsx`(32×32 `next/og` `ImageResponse`), `app/apple-icon.tsx`(180×180) 신규 구현, 기본 Next.js `app/favicon.ico` 제거
  - ✅ (과정에서 발견한 선행 버그 수정) `app/icon.tsx`/`app/apple-icon.tsx`가 확장자 없는 동적 라우트라 `proxy.ts`의 기존 matcher(`favicon.ico`, `.svg/.png/...` 확장자만 제외)에 걸러지지 않아 비로그인 상태에서 파비콘 요청이 `/auth/login`으로 307 리다이렉트되던 문제 발견·수정(matcher에 `icon$`/`apple-icon$` 추가)
  - ✅ `app/layout.tsx`의 기본 메타데이터(`title`/`description`)를 스타터킷 문구에서 우동 브랜드 문구로 교체 — 오류 메시지·빈 상태 문구의 브랜드 톤앤매너 확장은 Task 009에서 `lib/i18n/dictionaries/ko.ts`에 선반영 완료(`emptyStates`/`errors` 네임스페이스)
  - **완료 조건**: 라이트/다크 양쪽에서 주요 화면 대비비 WCAG AA 충족(계산 및 스크린샷 검증 완료), `--primary` 계열 하드코딩 색상 0건(`grep` 확인), `npm run check-all` 통과

- **Task 011: 공통 레이아웃·네비게이션·푸터 구현 (PRD 우선순위 8 포함)** ✅ - 완료
  - ✅ 모바일 우선 앱 셸: `components/app-header.tsx`(로고, 로그인 시 "내 모임"·알림 종 아이콘, 언어 스위처, 테마 토글, `AuthButton`)를 `app/layout.tsx`(루트 레이아웃)에 배치해 **모든 라우트에서 공유** — 이전에는 `app/page.tsx`·`app/protected/layout.tsx`·갤러리 6개 페이지가 각자 헤더를 중복 구현하고 있었음(스타터킷 잔재 "next.js starter-kit v3"/"Powered by Supabase" 등 서로 다른 브랜딩 포함)을 발견해 전부 이 공용 헤더로 통합
  - ✅ 알림 종 아이콘·"내 모임" 링크는 `components/header-auth-nav.tsx`가 자체 `getClaims()` 조회로 로그인 사용자에게만 렌더링(비로그인 시 `null`) — 안 읽은 알림 뱃지는 Task 026에서 이 컴포넌트에 추가 예정
  - ✅ `app/protected/groups/[groupId]/layout.tsx` + `components/groups/group-nav-tabs.tsx`(Client, `usePathname()` 기반)로 모임 하위 탭(홈/공지/회비/투표/설정) 구성, 헤더 바로 아래 `sticky` 고정
  - ✅ `components/app-footer.tsx`에 "개발자 문서" 그룹을 별도 라벨(`text-xs uppercase`)로 시각 구분해 `/icons`·`/gallery` 링크 배치(PRD 3.8 그대로), 일반 링크(소개/기술 스택)는 상단에 분리 — `/avatars`·`/charts`는 `/about` 페이지의 갤러리 카드로 계속 접근 가능해 폭넓게 유지
  - ✅ `AppHeader`/`AppFooter`/그룹 탭 모두 `getLocale()`/`getClaims()` 등 request-time API를 쓰는 부분만 `<Suspense>`로 감싸 `cacheComponents: true`의 `blocking-route` 에러 없이 스트리밍되도록 구성(Page + Suspense + Content 패턴을 레이아웃 단위로 확장 적용)
  - ✅ (과정에서 발견한 정리) 헤더 통합으로 완전히 미사용이 된 `components/deploy-button.tsx`(스타터킷 "Deploy to Vercel" 버튼) 삭제, i18n `Dictionary`에 `nav`(groupsLabel/notificationsLabel/devDocsLabel/groupTabs) 네임스페이스 신규 추가(ko 확정 문구, en/ja/zh는 Task 009 관례대로 스텁+TODO)
  - **완료 조건**: 모든 라우트에서 헤더/푸터가 일관 렌더링(Playwright로 `/`, `/about`, `/icons`, `/protected/groups`, `/protected/groups/[groupId]` 및 하위 탭 4종을 라이트/다크·로그인/비로그인 조합으로 스크린샷 검증), `/icons`·`/gallery` 링크가 로그인 없이 접근 가능(기존 allow-list 그대로 유지, 신규 공개 라우트 없음), 개발자 문서임이 UI에서 명확히 구분됨, `npm run check-all` 통과

- **Task 012: 전체 화면 UI 구현 (하드코딩 더미 데이터)** ✅ - 완료
  - ✅ 더미 데이터 생성/관리 유틸 작성(모임, 멤버, 초대, 회비 사이클/청구, 공지, 투표, 알림) — `lib/woodong/dummy/`
  - ✅ 모임 영역 UI: 목록(카드 리스트), 생성 폼, 상세 홈 대시보드(공지·납부율·진행 중 투표 요약), 설정(정보 수정/멤버 목록·역할/초대 링크/삭제)
  - ✅ 회비 영역 UI: 대시보드(멤버별 진행률 바 + 상단 전체 납부율 요약), 회비 항목 생성 폼, 납부 상태 변경 다이얼로그 — **1차에서는 "잔액"을 노출하지 않거나 "수입만 집계"로 한정**(지출 데이터 없음, PRD 3.4 주석)
  - ✅ 공지/알림 UI: 공지 목록·작성, 알림센터(읽음/안읽음 구분), 마이페이지(프로필, 알림 채널 on/off, 연동된 계정)
  - ✅ 투표 UI: 목록(진행 중/마감), 생성 폼(선택지 동적 추가, 복수 선택·익명 옵션), 상세/참여, 결과(익명/실명 분기 표시)
  - ✅ 초대 참여 화면(`/invite/[code]`) 및 만료/무효 코드 에러 상태
  - ✅ 로딩 스켈레톤·빈 상태·에러 상태를 모든 화면에 배치(브랜드 톤 문구 적용)
  - **완료 조건**: PRD 6.1~6.4의 1차 MVP 대상 화면 전체가 더미 데이터로 렌더링되고 사용자 플로우 네비게이션이 끊김 없이 연결됨

- **Task 013: 인포그래픽/시각화 컴포넌트 및 반응형 검증** ✅ - 완료
  - ✅ 기존 `/charts` 갤러리에서 검증된 **recharts 기반 패턴을 재사용**해 회비 납부율 진행률 바, 투표 결과 차트 구현
  - ✅ 360px~데스크톱 반응형 검증: **가로 스크롤 미발생**, 모든 인터랙션 요소 **최소 44x44px** 터치 타겟 확보
  - ✅ 아이콘은 lucide-react만 사용(다른 아이콘 세트 혼용 금지) 규칙 준수 점검
  - ✅ Playwright MCP로 360px / 768px / 1280px 뷰포트 스냅샷 회귀 검증
  - **완료 조건**: 3개 뷰포트에서 가로 스크롤 0건, 터치 타겟 위반 0건, 차트 컴포넌트가 더미 데이터로 정상 렌더링

- **Task 014: 모임 메인(랜딩) 페이지 구현 (PRD 우선순위 6)** ✅ - 완료
  - ✅ 비로그인: 서비스 소개 섹션 + 핵심 기능 요약 + 기술 스택 인포그래픽(**1차는 간소화 버전**, 배지 4종 + `/tech-stack` 링크) + "무료로 시작하기" CTA
  - ✅ 로그인: CTA를 "내 모임 보기"로 대체하고 클릭 시 모임 목록으로 이동
  - ✅ `getClaims()` 사용 컴포넌트를 `<Suspense fallback={...}>`로 감싸 `cacheComponents: true` 환경에서 blocking-route 에러 방지
  - ✅ 기존 `app/page.tsx`, `app/about/page.tsx`의 얇은 `Page` + `XxxContent` 패턴 재사용
  - **완료 조건**: 로그인 전/후 CTA 분기가 정상 동작, dev 오버레이 blocking-route 에러 0건, LCP 측정 기준선 확보

---

### Phase 3: 인증 (PRD 우선순위 1) ✅

> **범위**: 이메일 회원가입/로그인 + Google 소셜 로그인 + Kakao 소셜 로그인(이메일 미제공 예외 처리 포함). **Naver는 1차 범위에서 완전히 제외**(2차 착수 전 1~2일 스파이크로 구현 가능 여부 검증 후 결정).
> **의존성**: Task 001(Auth 옵션 결정), Task 006(라우트 골격).

- **Task 015: 이메일 인증 플로우 정비** ✅ - 완료
  - ✅ 기존 `app/auth/*`(로그인/회원가입) 흐름의 에러 UI를 하드코딩 `text-red-500`에서 Task 010 시맨틱 토큰 `text-destructive`로 교체해 브랜드 일관성 확보
  - ⚠️ **(계획 변경, PRD v1.3)** 회원가입 이메일 확인 절차를 1차 MVP 범위에서 제외: 이 프로젝트가 쓰는 공유 Supabase 무료 플랜은 커스텀 SMTP 미설정 시 (a) 이메일 템플릿 수정 불가, (b) 기본 메일 서버가 프로젝트 팀 멤버 외 주소로 발송 불가라는 제약이 있음(Supabase 공식 문서로 확인). `sign-up-form.tsx`를 가입 즉시 세션 발급 + `/protected` 리다이렉트로 재설계하고 `emailRedirectTo` 제거, 미사용된 `/auth/sign-up-success` 라우트와 4개 언어 `signUpSuccess` 사전 항목 삭제
  - ⚠️ **(계획 변경, PRD v1.4)** 같은 이메일 발송 제약으로 **비밀번호 찾기(로그아웃 상태의 이메일 재설정)도 1차 MVP에서 제외**하고 로그인 상태 전용 "화면 내 비밀번호 변경"으로 재설계: `app/auth/forgot-password`, `app/auth/update-password`, 더 이상 호출부가 없어진 `app/auth/confirm/route.ts` 전부 삭제, `login-form.tsx`의 "비밀번호를 잊으셨나요?" 링크 제거. 신규 `components/change-password-form.tsx`(현재 비밀번호로 `signInWithPassword()` 재인증 후 `updateUser()`)를 `app/protected/me`(마이페이지) 카드로 추가. 로그아웃 상태에서 이메일만으로 재설정 가능하게 하면 계정 탈취 취약점이 되므로 의도적으로 제공하지 않음(완전한 계정 잠김은 관리자 수동 대응, PRD 9장 리스크 추가)
  - 인증 폼은 기존 "Client Component에서 `supabase.auth.*` 직접 호출" 패턴 유지
  - ✅ **(사용자 액션 완료)** Supabase 대시보드 Authentication → Sign In / Providers → Email에서 **"Confirm email" 옵션 비활성화** 적용 확인
  - ✅ Playwright로 실계정 검증 2건: (1) 회원가입 → 즉시 세션 발급(`getClaims()` 응답에 `email_verified: true`) → 보호 페이지 접근 → 로그아웃 → 재로그인, (2) 마이페이지에서 틀린 현재 비밀번호로 변경 시도 시 에러 노출 확인 → 올바른 현재 비밀번호로 변경 성공 → 로그아웃 → 새 비밀번호로 재로그인 성공. 테스트 계정 2개는 검증 후 `auth.users`에서 직접 삭제로 정리
  - 커스텀 SMTP(Resend 등) 연동 후 이메일 기반 가입 확인/비밀번호 재설정 재도입 여부는 별도 결정 사항으로 남겨둠(2차 확장 후보)
  - **완료 조건**: ✅ 가입 → 즉시 로그인 상태로 보호 페이지 접근 확인. ✅ 로그인 상태에서 비밀번호 변경 → 로그아웃 → 새 비밀번호로 재로그인까지 실계정 기준으로 정상 동작 확인

- **Task 016: Google / Kakao 소셜 로그인 연동 및 계정 연결 정책 구현** ✅ - 완료
  - ✅ Supabase Auth에 Google, Kakao provider 설정 및 리다이렉트 URL 구성 — 콜백은 `https://<project-ref>.supabase.co/auth/v1/callback`, 앱 복귀 경로는 `{origin}/auth/callback`
  - ⚠️ **(계획 변경) Kakao 비즈 앱 전환이 불가피함을 확인**: 로드맵/PRD가 전제하던 "Biz App 미등록 + 이메일 없는 계정"은 **Supabase 내장 Kakao provider로는 로그인 자체가 불가능**했다. GoTrue `internal/api/provider/kakao.go`가 기본 scope에 `account_email`을 하드코딩하고 `options.scopes`는 이를 **교체가 아니라 덧붙이기만** 해서 제거할 수 없는데, 해당 동의항목은 비즈 앱에서만 등록 가능해 인가 단계에서 **KOE205**로 실패한다. 대시보드의 "Allow users without an email"은 사용자 생성 시점 옵션이라 이 단계를 구제하지 못한다(Supabase 공식 문서의 반대 안내는 현재 사실과 다름 — upstream supabase/auth#2574, #2579 미머지). → **개인 개발자 비즈 앱**(사업자등록번호 불필요, 소유자 본인인증만 필요)으로 전환하고 `카카오계정(이메일)`을 **선택 동의**로 등록해 해결. 상세 경위와 대안(Custom OIDC `custom:kakao`) 비교는 `docs/ops/SUPABASE_SHARED_PROJECT.md` §3에 기록
  - ✅ `components/social-auth-buttons.tsx` 신규 구현(Google/Kakao 버튼 + 진행 상태·에러 UI 공유) — 기존 `components/google-auth-button.tsx`는 중복 로직이라 삭제하고 로그인/회원가입 폼을 이 컴포넌트로 통합, `googleConnecting` 사전 키는 provider 중립적인 `socialConnecting`으로 리네임(4개 언어 + `Dictionary` 타입)
  - ✅ **계정 자동 연결 수용 정책 구현**(PRD 3.6.2): verified 이메일 기준 자동 연결은 플랫폼 기본 동작이므로 수용하고 **사후 고지 토스트**를 노출. 판별은 로그인 전/후 비교(로그아웃 상태에선 "이전" 스냅샷을 얻을 수 없음) 대신 **`exchangeCodeForSession()` 응답의 identity 목록에서 "계정은 이전에 생성됐는데 identity는 방금 생성됨"** 조합으로 수행(`app/auth/callback/route.ts`) — identity 2개 이상 + 최신 identity가 60초 이내 생성 + 계정 생성 시각과 5초 초과 차이
  - ✅ 콜백이 `?linked=1` / `?no_email=1`을 붙이고, `components/auth/oauth-result-toast.tsx`(+ 루트 레이아웃의 서버 래퍼 `oauth-result-toast-slot.tsx`)가 이를 읽어 토스트를 1회 노출한 뒤 `router.replace()`로 파라미터를 제거. 연결된 이메일은 URL로 실어 나르지 않고 세션(`getClaims()`)에서 직접 읽어 토스트 설명에 표시
  - ✅ **Kakao 이메일 미제공 예외 처리**: 이메일이 **선택 동의**라 사용자가 거부하면 여전히 이메일 없이 가입되므로, "Allow users without an email" 전제를 유지하고 `no_email` 토스트("계정 연동하기" 액션 → 마이페이지)와 마이페이지 안내 문구(`app/protected/me/page.tsx`, `data.claims.email` 부재 시)를 배치
  - ✅ 자동 연결 시 이메일 알림 발송은 **2차 확장**으로 분류(1차는 인앱 토스트만)
  - ✅ Playwright 실계정 검증: (1) Kakao 신규 가입 → `/protected` 복귀 및 세션 발급(`email_verified: true`, 이름/이메일 수신 확인), 최초 가입은 자동 연결로 오판하지 않음(identity 간격 0.006초), (2) 동일 이메일 이메일계정 선생성 후 Kakao 로그인 → **단일 user에 email+kakao identity 2개** 확인(간격 92초 → 연결로 정상 판정), (3) 두 토스트의 실제 렌더링 문구·액션·URL 정리 동작 확인. 테스트 계정은 검증 후 `auth.users`에서 삭제로 정리
  - **완료 조건**: ✅ Google/Kakao 로그인 성공, ✅ 동일 verified 이메일 자동 연결 시 **user id가 유지되어** 기존 모임/회비 데이터 접근이 보존됨 및 안내 토스트 노출. ⚠️ "이메일 동의를 거부한 Kakao 계정 가입"은 코드 경로와 토스트를 검증했으나, 이미 동의를 마친 계정으로는 거부 시나리오를 재현할 수 없어 **실계정 E2E는 Task 018-1에서 신규 카카오 계정으로 수행**

- **Task 017: 로그인 후 원래 경로 복귀(`next` 파라미터) 구현** ✅ - 완료
  - ✅ 검증 로직을 `lib/auth/next-path.ts` 한 곳으로 모음(`sanitizeNextPath()` / `resolveNextPath()` / `buildLoginPath()` / `DEFAULT_AFTER_LOGIN_PATH`) — Edge(proxy)·서버 컴포넌트·클라이언트 컴포넌트가 모두 쓰므로 런타임 의존성 없는 순수 함수로 구현
  - ✅ **3개 지점 수정**(PRD 부록): (1) `lib/supabase/proxy.ts`가 리다이렉트 시 `pathname + search`를 `next`로 부착(원래 쿼리스트링은 `url.search = ""`로 비우고 재구성), (2) `components/login-form.tsx`의 `/protected` 하드코딩 제거 후 페이지에서 검증해 내려준 `next`로 이동, (3) `app/auth/callback/route.ts`가 `resolveNextPath()`로 복원 — 기존의 임시 `startsWith("/")` 검사 대체
  - ✅ 범위 확장 2건: 회원가입 폼(`sign-up-form.tsx`)도 동일하게 `next` 복귀 처리(초대 링크 → 가입 흐름 대응), 소셜 로그인(`social-auth-buttons.tsx`)은 `redirectTo`를 `/auth/callback?next=...`로 구성해 provider 왕복 후에도 경로가 유지되게 함. 로그인 ↔ 회원가입 상호 링크도 `next`를 이어받는다
  - ✅ 오픈 리다이렉트 방지 규칙: `/`로 시작하지 않는 값·`//evil.com`(프로토콜 상대)·역슬래시 포함·공백/제어문자 포함 값을 거르고, `new URL(value, base)` 파싱 후 오리진이 유지됐는지로 최종 확인. 추가로 `/auth*` 경로는 **로그인 → 로그인 루프 방지**를 위해 차단. 실패 시 조용히 기본 경로로 폴백(잘못된 `next`가 URL에 남지 않음)
  - ✅ 복귀 경로 부재/무효 시 기본 목적지를 **모임 목록(`/protected/groups`)**으로 통일(기존 `/protected`)
  - ✅ 초대 링크 플로우 연결: `/invite/[code]`는 공개 라우트지만 참여는 로그인이 필요하므로, 비로그인 사용자에게는 `JoinInviteButton` 대신 `buildLoginPath("/invite/{code}")` 링크 버튼을 노출(신규 사전 키 `groups.invitePage.loginToJoinButton`, ko 확정 문구 + en/ja/zh 스텁)
  - ✅ Playwright 실계정 검증: (1) 비로그인으로 `/protected/groups/g-1/dues` 접근 → `?next=%2Fprotected%2Fgroups%2Fg-1%2Fdues`로 이동 → 회원가입 링크가 `next` 승계 → 가입 직후 해당 회비 페이지로 복귀, (2) `/invite/RUN-8F3K2Q` → "로그인하고 참여하기" → 로그인 → 초대 화면 복귀 및 "참여하기" 버튼으로 전환, (3) `?next=https://evil.example.com/pwn` 주입 후 로그인 → `/protected/groups`로 폴백, (4) Google 버튼 클릭 시 Supabase authorize의 `redirect_to`가 `/auth/callback?next=%2Fprotected%2Fnotifications%3Ftab%3Dunread`로 생성됨을 확인(소셜 왕복 완주 E2E는 Task 018-1). 쿼리스트링 보존·`//evil.com`·역슬래시·`/auth` 루프 차단은 curl로 추가 확인. 테스트 계정은 검증 후 `auth.users`에서 삭제로 정리
  - **완료 조건**: ✅ 비로그인 상태로 `/protected/groups/[id]/dues` 접근 → 로그인 → 해당 경로 복귀, ✅ 외부 URL 주입 시 기본 경로로 폴백, ✅ `npm run check-all` 통과

- **Task 018: 마이페이지 연동 계정 관리 및 프로필** ✅ - 완료
  - ✅ `app/protected/me`가 서버에서 `getUserIdentities()`로 연결된 provider를 읽어 신규 `components/me/linked-accounts.tsx`(Client)에 최소 필드(`identityId`/`provider`/`email`)만 내려준다 — 더미 하드코딩(Google 연동됨/Kakao 안 됨) 제거
  - ✅ `linkIdentity()`로 추가 연동(Manual Linking 베타 활성화 전제, Task 001에서 적용 완료): OAuth 왕복이라 `redirectTo`를 `/auth/callback?next=/protected/me`로 구성해 Task 017의 복귀 경로 규약을 그대로 태운다. `unlinkIdentity()`는 확인 다이얼로그(AlertDialog) 뒤에서 실행
  - ✅ **마지막 identity 보호 이중 방어**: identity가 1개면 해제 버튼 `disabled` + 안내 문구 노출, 클릭 시에도 `getUserIdentities()`로 재조회해 2개 미만이면 중단(다른 탭에서 먼저 해제한 경우 대비). 서버(GoTrue)도 `422 single_identity_not_deletable`로 거부함을 실제 API 호출로 확인
  - ✅ 연동 실패 경로 보강: `linkIdentity`는 code 없이 `?error=...`로 콜백에 돌아오므로(예: 이미 다른 계정에 붙은 identity → `identity_already_exists`) `app/auth/callback/route.ts`가 이 파라미터를 먼저 읽어 에러 화면에 전달하도록 수정 — 기존에는 "No code provided"로 뭉개졌다
  - ✅ 부수 정리 2건: provider 브랜드 SVG를 `components/auth/provider-icons.tsx`로 추출해 로그인 버튼과 연동 목록이 공유(중복 제거), 비밀번호 변경 카드는 **이메일 identity가 있는 계정에만** 노출(현재 비밀번호 재인증이 전제라 소셜 전용 계정에는 동작하지 않음)
  - ⚠️ **(문구 정정)** `kakaoNoEmailNotice`가 "마이페이지에서 이메일 계정과 연동할 수 있어요"라고 안내했으나, Task 015에서 확인한 SMTP 제약(이메일 확인 메일 발송 불가) 때문에 소셜 전용 계정에 이메일 로그인 수단을 붙이는 경로는 1차에 존재하지 않는다. "Google 계정을 연동하면 로그인 수단을 하나 더 둘 수 있어요"로 4개 언어 모두 정정
  - ℹ️ `profiles`는 스키마 변경 0건(읽기 전용 원칙 유지). 단 `name`/`phone_number`/`bio`의 본인 행 UPDATE는 Task 012에서 근거를 남기고 이미 허용한 상태라 이번 Task에서 되돌리지 않았다(`lib/woodong/actions/profile.ts` 주석 참고). `role`·`avatar_key`·`notify_on_*` 미사용 원칙은 그대로이며 아바타는 `woodong_profiles`를 쓴다
  - ✅ Playwright 실계정 검증: (1) identity 1개 계정 → 이메일 "연동됨" + 해제 버튼 비활성 + 마지막 수단 안내, Google/Kakao "연동 안 됨" + 연동하기 버튼, (2) identity 2개 상태 → 해제 버튼 활성화 및 안내 문구 사라짐 → Google 해제 실행 → 토스트 + 목록 즉시 갱신 + `auth.identities`에서 실제 삭제 확인, (3) 마지막 identity 해제를 API로 직접 시도 → `422 single_identity_not_deletable`, (4) 연동하기 클릭 시 authorize URL의 `redirect_to`가 `/auth/callback?next=%2Fprotected%2Fme`로 생성됨. 2개 identity 상태는 Google 실계정 자격증명 없이 재현하기 위해 테스트 계정에 합성 google identity를 넣어 만들었고(해제는 실제 API 호출), **실제 Google 연동 왕복 완주는 Task 018-1에서 수행**. 테스트 계정은 검증 후 `auth.users`에서 삭제로 정리
  - **완료 조건**: ✅ provider 목록 정확 표시, ✅ 마지막 identity 해제 시도 차단(UI·서버 양쪽), ✅ `profiles` 스키마 변경 0건, ✅ `npm run check-all` 통과

- **Task 018-1: 인증 통합 테스트 (Playwright MCP)** ✅ - 완료
  - **## 테스트 체크리스트**
    - ✅ 이메일 가입 → 즉시 세션 발급 및 보호 페이지 접근(회귀) — 비로그인 상태로 `/protected/groups/g-1/dues` 접근 → `next` 부착 → 가입 → 해당 경로 복귀까지 한 번에 확인
    - ✅ Google 로그인 성공 후 `next` 경로 복귀 — 사용자 실계정(`archy712@gmail.com`)으로 검증: 비로그인 상태에서 `/protected/groups/g-1/votes` 접근 → `?next=%2Fprotected%2Fgroups%2Fg-1%2Fvotes` 부착 → Google 로그인 → **정확히 그 경로로 복귀**(주소창·헤더 로그인 상태·"투표" 탭 활성 스크린샷 확인). 인가 URL의 `redirect_to`에 `/auth/callback?next=...`가 실리는 것도 함께 확인
    - ➖ 동일 verified 이메일 소셜 로그인 시 자동 연결 + 안내 토스트 — **Task 016의 실계정 검증으로 갈음**(사용자 결정). 재검증하려면 우동 전용 여분 Google 계정이 필요한데, 유일한 실계정(`archy712@gmail.com`)은 공유 프로젝트의 다른 앱에서 쓰던 기존 user라 이메일 identity를 붙이는 조작을 하지 않기로 함
    - ✅ 이메일 없는 Kakao 계정 가입 및 수동 연동 안내 — 실계정으로 검증(Task 016에서 이월된 항목 해소): 카카오계정에서 우동 앱 **연결 끊기** → Supabase에서 기존 `archy712@kakao.com` user 삭제(사용자 승인) → 동의 화면에서 **`카카오계정(이메일)` 선택 항목 해제** 후 로그인 → **`email = null`인 신규 user + kakao identity 1개** 생성 확인, `no_email` 안내 토스트가 실제로 노출됨(문구·"계정 연동하기" 액션·파라미터 자동 정리는 자동화 브라우저에서 별도 확인)
    - ✅ 마지막 identity 해제 차단, provider 2개 이상일 때만 해제 버튼 활성화 — 1개 상태(버튼 비활성 + 안내) → 합성 identity로 2개 상태(활성) → 해제 → 다시 1개 상태 회귀 확인
    - ✅ 마이페이지 비밀번호 변경(회귀) — 틀린 현재 비밀번호 거부("현재 비밀번호가 올바르지 않아요.") → 올바른 비밀번호로 변경 성공 → 로그아웃 → 새 비밀번호로 재로그인
    - ✅ 엣지 케이스 — 외부 URL `next` 주입 시 `/protected/groups` 폴백, 중복 가입 시도 차단, 약한 비밀번호 거부
  - ⚠️ **(테스트 중 발견·수정)** 로그인/회원가입 실패 문구가 Supabase 영문 원문("Invalid login credentials", "User already registered")으로 노출되고 있었다(완료 조건 "브랜드 톤 부합" 위반). 인증 계층 전용 매퍼 `lib/auth/auth-error-message.ts`의 `mapAuthErrorMessage()`를 신설해 GoTrue `code`(`invalid_credentials`/`user_already_exists`/`weak_password`/`same_password`/`identity_already_exists`/`single_identity_not_deletable`/rate limit)를 한국어 문구로 매핑하고, 매핑에 없는 에러는 원문 대신 일반 문구로 폴백(콘솔에는 원문 기록)하도록 정리. 인증 관련 5개 컴포넌트(로그인/회원가입/소셜 버튼/비밀번호 변경/연동 계정)가 `genericError` 문자열 대신 `errors` 사전을 받도록 시그니처 통일, `errors` 네임스페이스에 auth 문구 7종 추가(ko 확정 + en/ja/zh 스텁)
  - 🐛 **(테스트 중 발견·수정한 실제 버그)** 마이페이지 "연동된 계정"이 **실제로 연동된 provider를 전부 "연동 안 됨"으로 표시**하는 경우가 사용자 실세션에서 재현됐다. 원인은 서버 컴포넌트의 `getUserIdentities()`(내부적으로 `getUser()` 호출)가 세션 갱신 시점에 `400 "Auth session missing!"`으로 실패하는데 그 에러를 무시하고 빈 배열로 렌더링한 것 — 이 저장소가 `getUser()` 대신 `getClaims()`를 쓰기로 한 이유와 같은 계열의 문제다. **provider 목록의 출처를 JWT 클레임 `app_metadata.providers`로 교체**(서명 검증을 마친 값이라 추가 네트워크 호출 없음)하고, identity_id가 실제로 필요한 **해제 시점에만** 브라우저 클라이언트로 조회하도록 정리. 클레임은 토큰 발급 시점 기준이라 해제 직후 목록이 남는 문제가 있어 **해제 성공 후 `refreshSession()`으로 토큰을 재발급**한 뒤 갱신한다. 클레임에 provider가 하나도 없는 비정상 상태에는 "연동 정보를 불러오지 못했어요" 안내를 노출(오해로 인한 재연동 시도 방지)
  - ✅ 교체 후 재검증: provider 1개(해제 비활성) → 2개(해제 활성, 목록 정확) → Google 해제 → `auth.identities` 실제 삭제 + `raw_app_meta_data.providers` 갱신 + 화면 즉시 반영까지 확인
  - ⚠️ **(정리 중 실수)** 테스트 계정 정리에 `like 'woodong-%@example.com'` 와일드카드를 써서 이번 테스트 계정 외에 Task 012의 잔여 테스트 계정(`woodong-task012-test@example.com`)까지 함께 삭제했다. `woodong_*` 테이블이 전부 0행이라 실데이터 영향은 없었으나, 앞으로 정리는 이메일 정확 일치로만 수행한다
  - **완료 조건**: ✅ 시나리오 통과(자동 연결 1건은 Task 016 검증으로 갈음), ✅ 실패 케이스 문구가 브랜드 톤에 부합, ✅ `npm run check-all` 통과

---

### Phase 4: 모임 관리 (PRD 우선순위 2) ✅

> **의존성**: Phase 0(스키마·RLS), Task 008(폼 아키텍처), Task 012(UI), Phase 3(인증).

- **Task 019: 모임 CRUD 구현** ✅ - 완료
  - ✅ 모임 생성은 Task 008에서 만든 `createGroupAction`을 그대로 사용(생성자 `admin` 자기등록 + 상세 페이지 이동). 이번 Task에서 실계정으로 재확인
  - ✅ 필수 항목(모임 이름) 미입력 시 "모임 이름을 입력해주세요" 표시 및 요청 미전송(react-hook-form + zod 클라이언트 검증)
  - ✅ 모임 정보 수정(`updateGroupAction`): 이름/설명/유형/기본 회비 + 대표 이미지. 이미지는 브라우저에서 형식·5MB 검증 → Canvas 리사이즈 → `woodong-covers` 비공개 버킷 업로드 후 **오브젝트 경로만** 액션에 전달하고, 조회는 서명 URL로 한다(공개 URL 미사용). 경로 위조를 막기 위해 서버에서 `{groupId}/` 접두어를 재검증
  - ✅ 모임 삭제(`deleteGroupAction`): **하드 삭제**로 확정 — 자식 테이블 FK가 전부 `ON DELETE CASCADE`라 모임 행 하나로 회비/투표/공지/알림/멤버십이 함께 정리되고, 소프트 삭제는 모든 조회·RLS에 "미삭제" 조건을 덧붙여야 해 1차 범위에서 비용이 더 크다(복구 요구사항도 PRD에 없음). ⚠️ Storage 삭제 정책이 `woodong_is_group_admin()`을 요구하므로 **커버 이미지를 먼저 지우고 모임 행을 나중에** 지운다(순서가 바뀌면 이미지가 영구히 남는다)
  - ✅ 더미 조회를 실제 쿼리로 교체: 조회 전용 모듈 `lib/woodong/queries/groups.ts` 신설(`listMyGroups`/`getGroupDetail`/`listGroupMembers`, 전부 사용자 세션 클라이언트로 RLS 아래 동작). 목록·상세·설정 페이지가 실데이터로 렌더링되고 뮤테이션 후 `revalidatePath`로 갱신. 상세의 공지/회비/투표 요약과 초대 목록은 각 도메인 Task(020/024/028/029) 몫이라 더미 유지(실제 모임 id에는 더미가 없어 자연히 빈 상태로 표시)
  - ✅ 총무 전용 UI 게이팅: 일반회원에게는 정보 수정 폼 대신 안내 문구를 보여주고 위험 구역(삭제) 카드를 렌더링하지 않는다(쓰기는 RLS가 막지만 실패할 조작을 유도하지 않기 위한 이중 방어). Server Action도 UPDATE/DELETE 결과가 0행이면 조용히 성공 처리하지 않고 권한 오류로 되돌린다(PostgREST는 RLS 거부를 에러가 아니라 0행으로 응답)
  - ⚠️ **(과정에서 발견·수정한 선행 버그)** Task 004에서 넣은 `next.config.ts`의 `images.remotePatterns`가 `new URL(...)` 인스턴스 형태라 **`search`가 빈 문자열로 고정**돼, `?token=...`이 필수인 서명 URL이 전부 매칭에서 탈락했다(대표 이미지가 `next/image`에서 "hostname is not configured"로 렌더링 실패). 객체 형태로 바꿔 `search` 제약을 없애 해결
  - ⚠️ **(Task 021 선행 제약 발견)** 공유 `profiles`의 SELECT 정책이 `id = auth.uid() OR is_admin()`이라 **총무도 다른 멤버의 이름/연락처를 읽을 수 없다.** 로드맵 Task 021의 "profiles 조인으로 이름 표시"는 그대로는 불가능하며, 우동 전용 `SECURITY DEFINER` RPC(`woodong_get_vote_results` 패턴)가 필요하다. 이번 Task의 멤버 목록은 실제 멤버십 행(역할/본인 여부)만 표시하고 이름 표시는 Task 021로 넘겼다(공유 테이블 정책은 변경하지 않음)
  - ✅ Playwright 실계정 검증(계정 2개): 생성(빈 이름 검증 포함) → 상세 이동("1명 참여 중" = 총무 자동 등록) → 수정 + 커버 업로드(DB 경로·리사이즈된 .jpg 확인, 상세에서 서명 URL 이미지 렌더링 확인) → **비멤버 접근 시 "모임을 찾을 수 없거나 접근 권한이 없어요"** → 일반회원으로 추가 후 설정 화면이 총무 전용 안내로 표시 → **UI를 우회한 REST PATCH/DELETE도 RLS가 0행으로 차단**(데이터 무변경 확인) → 총무로 삭제 → 목록 빈 상태 + `woodong_groups`/`woodong_group_members`/`storage.objects` 전부 0건. 테스트 계정 2개는 이메일 정확 일치로 삭제해 정리
  - **완료 조건**: ✅ 생성 → 상세 이동 → 수정 → 삭제 전 구간 동작, ✅ 비멤버의 조회/수정이 RLS로 차단됨, ✅ `npm run check-all` 통과

- **Task 020: 초대 코드 발급·참여·무효화 구현** ✅ - 완료
  - > **Task 003에서 확인된 선행 제약**: `woodong_group_members` INSERT 정책은 "자신이 만든 그룹의 admin 자기등록"만 허용하도록 잠겨 있어, 초대로 합류하는 `member` 행 INSERT는 클라이언트에서 직접 불가능하다. `woodong_increment_invite_used_count()`를 호출하고 멤버십을 INSERT하는 통합 `SECURITY DEFINER` RPC(예: `woodong_redeem_group_invite(p_code text)`)를 신규로 만들어야 한다. 또한 `woodong_group_invites` SELECT가 관리자 전용이라 `/invite/[code]` 공개 미리보기 페이지가 모임 이름 등을 직접 조회할 수 없으므로, 최소 정보만 반환하는 별도 `SECURITY DEFINER` 함수도 필요하다.
  - ✅ 위 제약대로 **`SECURITY DEFINER` RPC 2종 신규 구현**(`set search_path = ''`, 기존 우동 함수와 동일 권한 구성):
    - `woodong_get_invite_preview(p_code text)` — 모임 이름/설명/유형/멤버 수 + 초대 상태만 반환. `/invite/[code]`가 PRD 6.2의 **공개 페이지**라 `anon`에도 EXECUTE를 부여했다(회비·투표·멤버 명단 등 모임 내부 데이터는 일절 싣지 않는다)
    - `woodong_redeem_group_invite(p_code text)` — 유효성 검증 + `used_count` 증가 + 멤버십 등록을 **한 트랜잭션**으로 처리. `authenticated`만 EXECUTE(비로그인 호출은 `401 permission denied`로 확인)
  - ✅ 실패를 exception이 아니라 **status 문자열**(`joined`/`already_member`/`not_found`/`expired`/`revoked`/`exhausted`/`unauthenticated`)로 반환 — 호출부가 사유별 한국어 문구를 고를 수 있어야 하고, "만료"와 "무효화"와 "소진"을 한 덩어리로 뭉개면 사용자가 다음 행동(총무에게 새 링크 요청)을 알 수 없기 때문
  - ✅ `used_count` 원자적 증가: 유효성 재검증과 증가를 **UPDATE 한 문장**(`where ... and used_count < max_uses`)으로 묶어 동시 참여 경합에서도 초과 사용이 불가능하다(Task 003의 `woodong_increment_invite_used_count()`는 invite id 기반이라 코드 조회·멤버십 등록과 트랜잭션을 공유할 수 없어 이 통합 RPC로 대체했고, 기존 함수는 그대로 남겨 뒀다)
  - ✅ 발급 폼은 `expires_at`/`max_uses` **필수**(zod: 만료는 현재 이후, 최대 사용 횟수는 1 이상), 다이얼로그를 열 때 7일 뒤·20회를 기본값으로 채운다. ⚠️ 기본값을 렌더 중 `new Date()`로 계산하면 Client Component도 SSR되므로 hydration 불일치가 나서, **다이얼로그 open 시점**에만 계산하도록 했다
  - ✅ 코드는 `crypto.getRandomValues()` 기반 `ABCD-EFGH` 형식(`lib/woodong/invite-code.ts`). 헷갈리는 글자(`0`/`O`/`I`/`L`)를 뺀 **정확히 32자** 알파벳을 써서 `% 32`의 modulo bias를 없앴고(32^8 ≈ 1.1조), `UNIQUE(code)` 충돌 시에만 최대 5회 재시도한다. 조회는 대문자+trim 정규화라 소문자로 공유된 링크도 열린다(앱·DB 양쪽에서 정규화)
  - ✅ **재발급 시 기존 코드 무효화**(PRD 3.2 AC): 새 초대를 만들면 같은 모임의 다른 활성 초대를 `is_active = false` + `revoked_at`으로 내린다. ⚠️ **새 초대를 먼저 INSERT하고 옛 초대를 나중에** 내린다(순서를 뒤집으면 INSERT 실패 시 쓸 수 있는 링크가 하나도 없는 상태로 남는다). 총무가 직접 무효화하는 버튼(확인 다이얼로그)도 추가
  - ✅ 이미 멤버인 사용자 재접속: RPC가 **INSERT를 시도하기 전에** `already_member`로 빠져나가 모임 상세로 보낸다. `UNIQUE(group_id, user_id)` 위반을 `mapSupabaseError()`가 "이미 존재하는 데이터입니다"로 바꿔 보여주면 안 되기 때문이며, `used_count`도 올리지 않는다(재접속이 초대 사용 횟수를 갉아먹지 않는다)
  - ✅ 탈퇴(`status='left'`) 후 재참여는 `on conflict do update`로 재활성화하되 **role을 항상 `member`로 되돌린다** — 공개 초대 링크를 타고 들어온 사람이 예전 총무 권한을 되찾는 경로가 있으면 안 된다
  - ✅ 참여 버튼은 모임 id가 아니라 **코드만** 서버로 넘긴다(클라이언트가 모임 id를 정하면 "코드는 A 모임 것인데 B 모임으로 가입" 위조가 가능). 이동 경로도 액션이 돌려준 `groupId`를 쓴다
  - ✅ 설정 화면의 초대 섹션에 **총무 게이팅 추가** — 기존에는 정보 수정/위험 구역만 `isAdmin` 분기였고 초대 카드는 누구에게나 렌더링돼 일반회원에게 빈 목록과 반드시 실패하는 버튼이 보였다
  - ⚠️ **(과정에서 수정한 자체 버그 2건)** (1) `returns table (status text, group_id uuid)`의 OUT 파라미터가 plpgsql 안에서 동명 컬럼과 충돌해 `42702`로 실패 — 내부 쿼리를 테이블 별칭으로 한정하고 `on conflict`는 제약 조건 이름(`on conflict on constraint ...`)으로 지정해 해소. (2) 초대 화면이 유효성을 멤버 판정보다 먼저 봐서, **이미 멤버인 사람이 만료된 옛 링크를 누르면 에러 화면**이 떴다(멀쩡한 멤버가 쫓겨난 줄 안다) — RPC와 같은 순서(멤버 판정 우선)로 맞췄다
  - ⚠️ **(스키마 보정)** `woodong_group_invites`에 `created_at`이 없어 목록 정렬 기준이 없었다. `not null default now()` 컬럼과 `(group_id, created_at desc)` 인덱스를 추가(`add_woodong_group_invites_created_at`)
  - ✅ 더미 정리: `DUMMY_GROUP_INVITES`/`getDummyGroupInvites`/`findDummyInviteByCode`/`isDummyInviteUsable`이 전부 미사용이 되어 삭제, `inviteId()` 헬퍼도 제거(섹션 코드 3은 재사용 금지 주석만 남김). i18n은 `groups.invite`에 7개, `groups.invitePage`에 5개 키를 추가하고 데모 문구("데모 화면이라 실제로 저장되지는 않아요")를 실제 동작 문구로 교체(ko 확정 + en/ja/zh 스텁 + `Dictionary` 타입)
  - ✅ SQL 레벨 시나리오 22건 전수 통과(임시 검증 함수로 미리보기 4종·참여 실패 4종·정상 참여·중복 참여·탈퇴 후 재참여·max_uses 경계·정규화 등을 자동 검증 후 함수 삭제)
  - ✅ Playwright 실계정 E2E(계정 4개): 발급(기본값·재발급 라벨 전환) → 비로그인 미리보기(모임 이름 노출 + `?next=` 로그인 링크) → 가입 후 복귀 → 참여(2명→3명) → 재방문 시 "이미 이 모임의 멤버예요" → 재발급으로 옛 코드 자동 무효화 → 수동 무효화 → `max_uses` 소진 → 만료. **UI를 우회한 REST 호출도 전부 차단**: 일반회원의 초대 목록 SELECT는 0행, INSERT는 `403 42501`, 본인 role의 admin 승격 PATCH는 0행(무변경), `anon`의 redeem RPC는 `401`. 폼 검증(과거 만료일/0회)은 요청 자체를 보내지 않음(초대 행 수 불변 확인). 테스트 계정 4개와 모임은 이메일 정확 일치로 삭제해 정리(`woodong_*` 전부 0행 복귀)
  - **완료 조건**: ✅ 정상 참여/중복 참여/만료/무효화/사용 횟수 초과 5개 케이스 전부 명세대로 동작, ✅ `get_advisors`(security) **ERROR 0건**(신규 WARN 2건은 Task 003과 동일하게 의도적으로 열어 둔 RPC), ✅ `npm run check-all` 통과

- **Task 021: 멤버 역할 관리 및 마지막 총무 보호** ✅ - 완료
  - ✅ 총무의 멤버 역할 변경(`admin` ↔ `member`) 및 멤버 제외(`status='left'`)를 `lib/woodong/actions/members.ts`의 `updateMemberRoleAction`/`removeGroupMemberAction`으로 구현. 대상은 `user_id`가 아니라 **멤버십 행 id**로 지정해 "다른 모임의 같은 사용자"를 건드릴 여지를 없앴고, 제외는 물리 삭제가 아니라 `status='left'` 전환이다(회비·투표 기록이 `user_id`를 참조하므로 행을 지우면 과거 기록의 주체를 잃는다)
  - ✅ 일반회원의 역할 변경 시도는 `woodong_group_members_update_admin` RLS 정책이 차단한다. PostgREST는 RLS 거부를 에러가 아니라 **0행 갱신**으로 돌려주므로 `count: "exact"`로 확인해 권한 오류로 되돌린다(Task 019/020과 같은 패턴 — 조용히 성공한 것처럼 보이면 안 된다)
  - ✅ **마지막 총무 보호 3중 방어**: DB 트리거(Task 003) → Server Action의 `isLastAdminError()` 매핑 → UI 버튼 비활성 + 안내 문구. 애플리케이션에서 "admin 수를 세고 1이면 막는" 식으로 구현하지 않은 이유는 두 총무가 동시에 서로를 강등할 때 둘 다 통과해 총무가 0명이 되는 경합이 생기기 때문이며, UI 판정은 어디까지나 "실패할 게 확실한 조작을 유도하지 않기" 위한 것이다. `P0001`은 모든 `raise exception`이 공유하는 범용 코드라 코드만 보지 않고 메시지의 "마지막 총무" 문구까지 확인해 판별하고, 사용자에게는 DB 원문 대신 `LAST_ADMIN_ERROR_MESSAGE` 상수(PRD 3.2 AC 문장)를 보여준다
  - ⚠️ **(선행 제약 해소)** Task 019에서 발견한 "공유 `profiles`의 SELECT 정책이 `id = auth.uid() OR is_admin()`이라 총무도 다른 멤버 이름을 못 읽는다"는 제약을, 공유 테이블 정책을 건드리지 않고(PRD 5.0) 우동 전용 `SECURITY DEFINER` RPC **`woodong_list_group_members(p_group_id uuid)`** 신설로 해소(`set search_path = ''`, `anon` EXECUTE 명시 REVOKE + `authenticated`만 GRANT — Task 003 규약). 비멤버 호출은 에러가 아니라 **빈 결과**로 응답한다(에러로 구분해 주면 모임 존재 여부가 노출된다)
  - ✅ **연락처 노출 범위 결정**: 이름은 같은 모임의 활성 멤버 전원에게, **이메일·전화번호는 총무 또는 본인에게만** 내려준다(RPC 안에서 분기). 회비 독촉 등 연락 주체는 총무이고, 모임에 참여했다는 이유만으로 일반회원끼리 연락처가 공개되면 안 되기 때문이다. 이름이 비어 있으면(가입 시 이름을 받지 않아 흔하다) 이메일 → "이름 미확인 멤버" 순으로 폴백하므로, 일반회원 화면에서는 자연히 이름 미설정 멤버가 "이름 미확인 멤버"로 보인다
  - ✅ 아바타는 우동 전용 `woodong_profiles.avatar_key`를 같은 RPC에서 함께 읽는다(공유 `profiles.avatar_key` 재사용 금지 원칙 유지). `plpgsql` OUT 파라미터는 전부 `member_` 접두어를 붙여 Task 020에서 겪은 `42702`(ambiguous column) 충돌을 예방
  - ✅ "모임 나가기"는 총무가 자기 자신을 제외하는 경로로 구현(같은 액션·같은 트리거). 자기 자신 제외도 RLS를 통과하는데, `woodong_is_group_admin()`이 UPDATE 문의 **스냅샷(변경 전 상태)**을 보기 때문이며 커밋 후에야 멤버가 아니게 된다. 나간 뒤에는 그 페이지에 머무르면 "접근 권한이 없어요"만 보이므로 모임 목록으로 이동시킨다. 일반회원의 자발적 탈퇴는 UPDATE 정책상 불가능하고 PRD 3.2 AC에도 없어 1차 범위 밖으로 남겼다
  - ✅ 신규 컴포넌트 `components/groups/group-member-list.tsx`(Client): 아바타·이름·"나" 뱃지·연락처·역할 뱃지 + 총무 전용 아이콘 버튼 2종(역할 변경/내보내기), 조작마다 확인 다이얼로그. 목록은 로컬 state로 들지 않고 서버가 내려준 값을 그대로 그린 뒤 `revalidatePath` + `router.refresh()`로 갱신(초대 관리자와 같은 규약). i18n `groups.members`에 키 18종 추가하고 더 이상 사실이 아닌 `namesComingSoonNotice`("이름·연락처는 다음 업데이트 예정")는 삭제(ko 확정 + en/ja/zh 버튼 라벨은 번역, 나머지는 관례대로 스텁 + `TODO(i18n)`)
  - ✅ SQL 레벨 시나리오 12건 전수 통과(임시 검증 함수로 역할별 목록 노출 범위·비멤버 빈 결과·일반회원 승격 차단·마지막 총무 강등/탈퇴 차단·총무 2명일 때 자기 강등 허용·강등 후 권한 상실·마지막 총무가 된 두 번째 총무 재차단까지 자동 검증 후 트랜잭션 롤백으로 흔적 0건)
  - ✅ Playwright 실계정 E2E(계정 2개): 총무 단독 상태에서 버튼 2종 비활성 + 마지막 총무 안내 → 초대로 일반회원 합류 → **일반회원 화면에는 버튼이 아예 없고 총무 연락처도 안 보임**(본인 정보만 표시) → 총무가 승격 → 안내 사라지고 버튼 활성화 → 내보내기 → 다시 마지막 총무 상태로 복귀 → 총무 지정 후 "모임 나가기" → 모임 목록 리다이렉트 + 토스트 + 빈 상태 → 나간 계정의 설정 페이지 접근 시 "모임을 찾을 수 없거나 접근 권한이 없어요". **UI를 우회한 REST 호출도 전부 차단**: 일반회원의 자기 승격/총무 강등/총무 내보내기 PATCH는 모두 0행(데이터 무변경), `profiles` 직접 조회는 본인 행만, 마지막 총무의 강제 강등·강제 탈퇴는 `400 P0001` + PRD 문구 그대로. 360px에서 가로 스크롤 0건·44px 미만 터치 타겟 0건 확인. 테스트 계정 2개는 이메일 정확 일치로 삭제하고 `woodong_*` 전부 0행 복귀
  - ℹ️ (부수 확인) 내보낸 멤버가 초대 링크로 재참여하면 role이 `admin`이었더라도 `member`로 리셋되는 Task 020의 규칙이 "내보내기 → 재참여" 경로에서도 그대로 동작함을 실계정으로 확인
  - **완료 조건**: ✅ 일반회원 권한 상승 시도 차단(UI·RLS 양쪽), ✅ 마지막 총무 강등/탈퇴가 DB 트리거·Server Action·UI 3중으로 차단됨, ✅ `get_advisors`(security) **ERROR 0건**(신규 WARN 1건은 Task 003과 동일하게 의도적으로 열어 둔 `authenticated` 전용 RPC), ✅ `npm run check-all` 통과

- **Task 021-1: 모임 관리 통합 테스트 (Playwright MCP)** ✅ - 완료
  - **## 테스트 체크리스트** — 실계정 4개(총무 A / 일반회원 B·C / 비멤버 D)로 Phase 4 전 구간을 **한 번에 이어서** 회귀 검증. 개별 Task에서 이미 확인한 항목도 이번 패스에서 다시 실행했다(코드 변경 0건, 발견된 결함 없음)
    - ✅ 모임 생성 → 생성자 총무 자동 등록 확인 → 정보 수정 → 삭제 — 생성 직후 `woodong_group_members`에 `admin`/`active` 1행, 이름·소개·유형 수정 반영, 삭제 시 모임·멤버십·초대·Storage 오브젝트까지 전부 0건으로 정리
    - ✅ 초대 링크 생성 → 다른 계정으로 참여 → 멤버 목록 반영 — 소문자 URL(`/invite/huyp-qs76`)로 접속해도 정규화되어 열리는 것까지 확인, 참여 후 "2명 참여 중"과 설정 화면 멤버 목록에 즉시 반영
    - ✅ 동일 계정 재참여 시 중복 멤버십 미생성 — 재방문 시 "이미 이 모임의 멤버예요"로 분기하고 `used_count`도 1에서 오르지 않음(재접속이 초대 사용 횟수를 갉아먹지 않는다)
    - ✅ 만료/무효화/사용 횟수 초과 코드 에러 처리 — **비멤버 계정으로** 4종을 각각 확인: 무효화("이 초대 링크는 무효화됐어요"), 소진("사용 가능 횟수를 모두 채웠어요"), 만료("이 초대 링크는 만료됐어요"), 존재하지 않는 코드("유효하지 않은 초대 코드예요"). 재발급 시 기존 코드가 `is_active=false`+`revoked_at`으로 자동 무효화되는 것도 같은 흐름에서 확인. 반대로 **이미 멤버인 계정**에게는 무효화된 옛 링크도 에러가 아니라 "이미 멤버" 화면이 뜬다(Task 020에서 고친 판정 순서 회귀)
    - ✅ 일반회원 계정으로 역할 변경 API 호출 시 RLS 차단 — UI를 거치지 않은 REST 직접 호출 **7종**(자기 승격 / 총무 강등 / 총무 내보내기 / 모임 이름 변경 / 모임 삭제 / 초대 목록 조회 / 초대 발급)을 모두 시도해 앞 6종은 0행·빈 배열, 초대 발급만 `403 42501`. 이후 SQL로 모임명·총무 수·초대 수가 그대로임을 확인(데이터 무변경)
    - ✅ 마지막 총무 강등/탈퇴 차단 메시지 노출 — 3중 방어를 각각 실증: (1) UI에서 두 버튼 `disabled` + 안내 문구, (2) **경합 상황 재현**(화면은 "총무 2명"으로 알고 있는 상태에서 다른 경로로 두 번째 총무를 강등한 뒤 자기 강등 클릭) → 서버 트리거가 막고 Server Action이 옮긴 PRD 문구가 **토스트로 노출**되는 것까지 확인, (3) REST 강제 호출은 `400 P0001` + 같은 문구
    - ✅ 엣지 케이스 — 모임 이름 미입력: "모임 이름을 입력해주세요" 표시 + `fetch` 후킹으로 **요청 0건** 확인. 대표 이미지 5MB 초과(6MB `.jpg`): 토스트 "이미지 용량은 5MB를 초과할 수 없습니다." 노출 + 파일 미첨부(업로드 요청 자체가 발생하지 않음), 같은 입력창에 정상 이미지(2000×1200, 766KB)를 넣으면 1600px·376KB로 리사이즈되어 업로드. 동시 참여 요청: `max_uses=1` 초대에 **두 계정의 토큰으로 `Promise.all` 동시 redeem** → 정확히 1건 `joined` / 1건 `exhausted`, `used_count`는 1/1(초과 사용 불가)
  - **완료 조건**: ✅ 위 시나리오 전부 통과, ✅ RLS 우회 경로 없음(REST 직접 호출 9종 전부 차단·무변경), ✅ 테스트 계정 4개·모임·Storage 오브젝트 정리 완료(`woodong_*` 전부 0행), ✅ `npm run check-all` 통과

---

### Phase 5: 회비 현황 관리 — 3.4-a (PRD 우선순위 3) ✅

> **1차 범위는 3.4-a(회비 현황)만.** 지출 등록·영수증 첨부·정산 리포트 발행/PDF(3.4-b)는 **Phase 8(2차 확장)**로 이동한다. 회비 대시보드의 "잔액"은 1차에서 노출하지 않거나 "수입만 집계"로 한정한다.
> **의존성**: Phase 4(모임/멤버십), Phase 0(스키마·트리거).

- **Task 022: 회비 항목(`woodong_due_cycles`) 생성 및 청구 팬아웃** ✅ - 완료
  - ✅ **팬아웃 방식 확정 — 신규 RPC `woodong_create_due_cycle()`**(마이그레이션 `create_woodong_due_cycle_fanout`). 항목 INSERT와 멤버별 청구 INSERT를 한 함수에 넣어 **호출 1회 = 트랜잭션 1개**로 만들었다. Server Action에서 INSERT를 두 번 나눠 하면 두 번째가 실패했을 때 "청구가 하나도 없는 회비 항목"이 남고(총무는 만든 줄 아는데 아무도 청구받지 않는다), 애플리케이션에서는 이 부분 실패를 되돌릴 방법이 없다
  - ✅ ⚠️ 이 함수는 다른 우동 RPC와 달리 **`SECURITY DEFINER`가 아니라 `SECURITY INVOKER`(기본값)**다. 팬아웃에 필요한 권한(`woodong_due_cycles` INSERT / `woodong_dues` INSERT / `woodong_group_members` SELECT)이 전부 기존 RLS 정책으로 총무에게 이미 열려 있어 권한을 뚫을 이유가 없고, INVOKER로 두면 총무 판정을 애플리케이션이 아니라 RLS(`woodong_is_group_admin`)가 그대로 강제한다. 그래서 `get_advisors`(security)에 **신규 WARN이 한 건도 추가되지 않았다**(Task 003/020/021은 DEFINER라 WARN이 늘었다). `set search_path = ''` + `anon` EXECUTE 명시 REVOKE는 기존 규약 그대로
  - ✅ 청구는 **생성 시점의 활성 멤버 스냅샷**이다: `status = 'active'`인 멤버만 대상이고(나간 멤버 제외), `woodong_dues.amount`는 항목 금액의 스냅샷, `group_id`는 RLS 단순화를 위해 비정규화 저장. 재실행(중복 제출·재시도)은 `on conflict on constraint woodong_dues_due_cycle_id_user_id_key do nothing`으로 흡수하고, 실제 생성 건수를 `charged_count`로 함께 반환한다
  - ✅ **항목 생성 후 가입한 멤버는 기존 항목에 소급 청구되지 않는다**(정책 확정). 지난 회비를 소급해 물리면 "가입 전 회비"를 청구하는 셈이라 기본값으로는 위험하고, 필요한 경우 총무가 새 항목을 만들면 된다. 반대로 **내보낸 멤버의 과거 청구는 삭제하지 않는다**(납부 이력의 주체를 잃지 않기 위해 — Task 021의 `status='left'` 전환과 같은 이유). 이 정책은 Task 024-1 체크리스트의 "항목 생성 후 신규 가입 멤버 처리"에 대한 답이다
  - ✅ 금액 하한을 **DB CHECK 제약**(`woodong_due_cycles.amount > 0`, `woodong_dues.amount > 0`)으로도 못박았다. zod가 이미 1원 이상을 강제하지만, 총무는 UI를 우회해 `woodong_due_cycles`에 직접 INSERT할 권한이 있어서(총무 본인은 RLS를 통과한다) 애플리케이션 검증만으로는 0원/음수 항목을 막을 수 없다
  - ✅ 조회 전용 모듈 `lib/woodong/queries/dues.ts`(`getDuesOverview` — 항목·청구·납부 합계를 한 번에, 전부 사용자 세션 클라이언트로 RLS 아래 동작)와 Server Action `lib/woodong/actions/dues.ts`(`createDueCycleAction`) 신설. 회비 화면의 더미 조회를 실제 쿼리로 교체하고, 비멤버에게는 모임 상세와 같은 "모임을 찾을 수 없거나 접근 권한이 없어요"를 먼저 보여준다(빈 회비 목록과 구분되지 않으면 안 된다)
  - ✅ 대시보드는 로컬 state를 버리고 서버가 내려준 값을 그대로 그린다(멤버 목록·초대 관리자와 같은 규약). 생성 후에는 `revalidatePath` + `router.refresh()`로 다시 받아오는데, 팬아웃 결과(활성 멤버 N명)를 클라이언트가 흉내 내면 서버와 다르게 계산될 수 있기 때문이다. 총무가 아니면 "새 회비 항목" 버튼을 렌더링하지 않는다(RLS 이중 방어)
  - ✅ **납부 기록 UI(더미 다이얼로그·"납부완료로 변경" 버튼)는 이번에 화면에서 내렸다** — 실데이터 화면에 저장되지 않는 버튼을 남기면 "납부 처리했는데 새로고침하면 사라지는" 오해를 만든다. `components/dues/record-payment-dialog.tsx` 파일은 그대로 두고 Task 023에서 실제 Server Action과 함께 다시 붙인다. 멤버 이름/아바타 표시 규칙은 Task 021의 `woodong_list_group_members()` RPC를 재사용하고, 두 화면이 어긋나지 않도록 `lib/woodong/member-display.ts`로 헬퍼를 모았다
  - ⚠️ **(E2E에서 발견·수정한 자체 버그)** 리마인드 주기는 선택 항목(nullable)인데 **비워 두면 저장이 막혔다**. `z.coerce.number()`가 빈 문자열을 `0`으로 바꿔 `.optional()`을 무력화하고 `min(1)`에 걸린 것 — `z.preprocess`로 빈 값을 `undefined`로 먼저 정규화해 해결하고, 라벨에도 "(선택)"을 명시했다(4개 언어). ℹ️ 같은 원인으로 `createGroupSchema.defaultDueAmount`도 빈 칸이 `null`이 아니라 `0`으로 저장되는데, `min: 0`이라 에러는 나지 않아 이번 범위에서는 손대지 않았다(Task 024에서 회비 기본값을 쓸 때 함께 정리)
  - ✅ SQL 레벨 시나리오 15건 전수 통과(임시 픽스처 트랜잭션으로 팬아웃 건수·제목/기간 trim·`created_by`·금액/상태/그룹 스냅샷·나간 멤버 제외·재실행 0건·일반회원/비멤버 차단(42501)·금액 0원과 잘못된 `due_type` 차단(23514) + 항목 수 불변·리마인드 주기 null·두 번째 항목의 별도 청구 세트·일반회원 조회 4건/비멤버 0건까지 자동 검증 후 롤백, 흔적 0건)
  - ✅ Playwright 실계정 E2E(계정 2개): 빈 폼 제출 시 4개 필드 검증 문구 + **`fetch` 후킹으로 요청 0건**, 음수 금액도 요청 0건 → 총무 1명 상태에서 항목 생성(제목·기간 앞뒤 공백이 DB에서 trim, 청구 1건) → 초대로 일반회원 합류 → 두 번째 항목 생성 시 청구 2건·탭 자동 선택·토스트 노출 → 일반회원 화면에는 **"새 회비 항목" 버튼이 아예 없고** 남의 이름은 "이름 미확인 멤버"(Task 021의 연락처 노출 범위 그대로) → 일반회원 내보내기 후 세 번째 항목은 다시 청구 1건(과거 청구는 보존) → 내보내진 계정으로 회비 페이지 접근 시 "모임을 찾을 수 없거나 접근 권한이 없어요". **UI를 우회한 REST 호출 5종도 전부 차단**: RPC 직접 호출/항목 INSERT/청구 INSERT는 `403 42501`, 청구 status PATCH와 항목 DELETE는 0행(무변경), 같은 모임 청구 SELECT만 정상. 360px에서 가로 스크롤 0건·44px 미만 터치 타겟 0건. 테스트 계정 2개와 모임은 삭제해 `woodong_*` 전부 0행 복귀
  - ℹ️ (Task 024로 넘기는 관찰) 멤버별 납부율 차트의 Y축 라벨이 360px에서 잘린다(이름 미설정 계정은 긴 이메일로 폴백되기 때문). 대시보드 표시 개선은 Task 024 범위다
  - **완료 조건**: ✅ 항목 생성 1회로 활성 멤버 수만큼 청구가 정확히 생성되고 재실행 시에도 중복 생성되지 않음, ✅ `get_advisors`(security) **ERROR 0건 + 신규 WARN 0건**, ✅ `npm run check-all` 통과

- **Task 023: 납부 이력 기록 및 상태 자동 갱신** ✅ - 완료
  - ✅ Server Action 3종(`recordPaymentAction`/`updatePaymentAction`/`deletePaymentAction`)으로 `woodong_payments` 이력을 쌓고 고치고 지운다. **애플리케이션은 `woodong_dues.status`를 한 번도 쓰지 않는다** — 이력이 바뀌면 Task 003의 트리거(`woodong_update_due_status`, AFTER INSERT/UPDATE/DELETE)가 합계와 청구 금액을 비교해 `unpaid`/`partial`/`paid`를 다시 계산한다. 애초에 `woodong_dues`에는 UPDATE 정책 자체가 없어 총무조차 status를 직접 쓸 수 없다(SQL·REST 양쪽에서 0행 확인)
  - ✅ `group_id`는 클라이언트가 보낸 값을 믿지 않고 **청구/이력 행에서 조회해서** 채운다. 클라이언트가 정하게 두면 "A 모임의 청구인데 B 모임 소속으로 기록"해 RLS 판정을 흐릴 여지가 생긴다. 수정 대상에서 `due_id`는 제외했다 — 이력을 다른 사람의 청구로 옮기면 트리거가 **옮기기 전 청구**의 상태를 다시 계산하지 못해 상태가 굳어 버린다(정정은 삭제 후 재기록이어야 한다)
  - ✅ 일반회원의 쓰기는 RLS가 막고(INSERT는 `42501`), UPDATE/DELETE는 PostgREST가 0행으로 응답하므로 `count: "exact"`로 확인해 권한 오류로 되돌린다(Task 019~021과 같은 패턴)
  - ✅ 납부 금액 하한도 **DB CHECK 제약**으로 못박았다(`woodong_payments.amount > 0`, 마이그레이션 `add_woodong_payments_amount_positive`). 총무는 INSERT 정책을 통과하므로 UI를 우회해 음수 금액을 넣을 수 있고, 그러면 합계가 줄어 **이미 완납 처리한 청구가 미납으로 되돌아가는** 상태 오염이 가능하다(Task 022에서 항목·청구 금액에 CHECK를 건 것과 같은 이유)
  - ✅ UI는 "상태 토글"이 아니라 **멤버별 납부 이력 관리 다이얼로그**(`components/dues/payment-manager-dialog.tsx`)로 만들었다. 한 청구에 부분 납부가 여러 번 쌓일 수 있어 토글로는 표현이 안 되기 때문이다. 이력 목록 + 추가 폼 + 인라인 수정 + 삭제(확인 다이얼로그)를 한 화면에 두고, 누계/남은 금액을 상단에 고정 표시한다. 목록의 "납부완료로 변경" 버튼은 **남은 금액만큼의 이력을 남기는 단축 경로**일 뿐 저장 데이터는 다이얼로그와 완전히 같다
  - ✅ **일반회원에게도 다이얼로그를 열어 주되 읽기 전용**이다(자기 회비를 얼마나 냈는지 확인할 수 있어야 한다). 추가 폼·수정·삭제 버튼은 렌더링하지 않는다(실패할 조작을 유도하지 않는 이중 방어)
  - ✅ 날짜 왕복 기준을 UTC로 고정했다(`dateOnlyToIso`/`isoToDateOnly`). `<input type="date">`의 `YYYY-MM-DD`를 저장할 때와 목록에 표시할 때 기준이 다르면 타임존에 따라 "고른 날짜와 보이는 날짜가 하루 어긋나는" 문제가 생긴다
  - ⚠️ **(E2E에서 발견·수정한 자체 버그 2건)**
    1. **납부 기록 버튼이 아무 반응도 없었다.** 금액 입력에 `min={1} step={1000}`을 줬더니 30,000원이 **브라우저 네이티브 검증에서 무효**가 되어(유효값이 1, 1001, 2001…) submit 이벤트 자체가 발생하지 않았다. zod 에러도, 요청도, 로그도 없어서 원인이 드러나지 않는 유형의 실패다. 금액·리마인드 주기 입력에서 `min`/`max`/`step`을 **전부 제거**하고 검증은 zod가 전담하도록 바꿨다(한국어 메시지도 그래야 항상 노출된다). ℹ️ 같은 제약이 Task 022의 회비 항목 금액에도 있어 **1,000원 단위가 아닌 회비(예: 12,500원)를 저장할 수 없었다** — 함께 고쳤다
    2. 기록 직후 추가 폼의 기본 금액이 **갱신 전 잔액**으로 남았다(30,000원 청구에 10,000원을 넣어도 기본값이 계속 30,000원). 그대로 저장하면 의도치 않은 초과 납부가 된다 — 남은 금액을 `key`로 걸어 잔액이 바뀌면 폼을 새로 마운트하도록 했다
  - ✅ SQL 레벨 시나리오 16건 전수 통과(부분 납부 1회 → `partial`, **2회 누적 → `paid`**, 이력 수정 시 `partial` 복귀, 초과 납부 → `paid`, 이력 전체 삭제 → `unpaid` 복귀, 음수 금액 `23514` 차단, 일반회원 INSERT `42501`·UPDATE/DELETE 0행, 일반회원·총무의 `dues.status` 직접 UPDATE 0행, 비멤버 조회 0행 — 트랜잭션 롤백으로 흔적 0건)
  - ✅ Playwright 실계정 E2E(계정 2개): 부분 납부 10,000원 기록(이력·누계·남은 금액·상태 `부분납부` 반영, 입력한 날짜 그대로 표시) → 잔액 20,000원이 기본값으로 채워진 채 추가 기록 → **`납부완료`로 전환 + 미납자 목록에서 제외** → 이력 수정(20,000→5,000)으로 `부분납부` 복귀 → 이력 삭제로 누계 복원 → "납부완료로 변경" 버튼으로 전체 납부율 50%(1/2) 즉시 반영. 일반회원 화면에는 "새 회비 항목"·"납부완료로 변경"이 없고 다이얼로그는 이력만 보인다(폼 0개). **UI를 우회한 REST 호출 4종도 전부 차단**: 이력 INSERT는 `403 42501`, 이력 UPDATE/DELETE와 `dues.status` PATCH는 0행(데이터 무변경 SQL로 확인), 같은 모임 이력 SELECT만 정상. 360px에서 가로 스크롤 0건. 테스트 계정 2개·모임은 삭제해 `woodong_*` 전부 0행 복귀
  - **완료 조건**: ✅ 부분 납부 2회 누적 시 `partial` → `paid` 자동 전환(SQL·UI 양쪽), ✅ 일반회원의 쓰기 시도 차단(UI·RLS·Server Action 3중), ✅ `get_advisors`(security) ERROR 0건 + 신규 WARN 0건, ✅ `npm run check-all` 통과

- **Task 024: 회비 대시보드 구현** ✅ - 완료
  - ✅ 집계 계산을 순수 함수 모듈 `lib/woodong/dues-summary.ts`(`summarizeDueCycle`/`dueProgressPercent`/`dueRemainingAmount`/`formatWon`)로 분리했다. 납부율은 **모임 홈 요약 카드**와 **회비 대시보드** 두 곳에서 그려지는데 각자 계산하면 반올림 기준 하나만 달라도 "홈은 60%, 대시보드는 50%"가 된다. 상태 카운트는 화면이 다시 판정하지 않고 트리거가 계산해 둔 `woodong_dues.status`를 그대로 센다(Task 003/023)
  - ✅ 요약을 **인원 기준과 금액 기준 두 축으로** 나눴다. 게이지(recharts RadialBar)는 완납 인원 비율, 그 옆 진행률 바는 수납액/청구액 비율이다. 하나만 보면 "5명 중 4명이 냈지만 금액은 절반"인 상황이 안 보인다. 표기는 `수납 17,500원 / 청구 25,000원`처럼 **수입만** 쓰고 "잔액"은 계산하지도 노출하지도 않는다(지출 데이터 부재, PRD 3.4-a)
  - ⚠️ **(발견·수정) 게이지가 0%일 때 통째로 사라지던 문제.** 값을 `endAngle`로 표현하는 shadcn 기본형은 0%에서 시작각과 끝각이 같아져 `background` 트랙까지 그려지지 않고 140px짜리 빈 사각형에 "0%" 글자만 남는다 — **회비 항목을 막 만든 직후가 정확히 그 상태**다. 차트는 항상 360°를 돌게 두고(`endAngle={-270}`) 값은 `PolarAngleAxis`의 0~100 도메인으로 매핑하도록 바꿔 0%에서도 빈 트랙 링이 보이게 했다
  - ✅ **멤버별 가로 막대 차트를 상태 분포 스택 바로 교체**했다. 기존 차트는 Y축에 멤버 이름을 그려 360px에서 라벨이 잘렸고(이름 미설정 계정은 긴 이메일로 폴백 — Task 022가 넘긴 관찰), 바로 아래 멤버 목록이 같은 수치를 다시 보여줘 정보가 중복이었다. 차트는 **이름 라벨이 없는 분포 요약**만 맡고(완납/부분납부/미납 개수), 멤버별 진행률은 목록 각 행의 `DuesMemberProgressBar`로 옮겨 잘릴 라벨 자체를 없앴다. 스택 바는 `isAnimationActive={false}` — 폭이 바뀔 때마다 0에서 다시 자라느라 막대가 잠깐 사라지는 연출이 한 줄 요약에는 득보다 실이 크다
  - ✅ 진행률 바는 공용 `components/ui/progress.tsx`를 쓰지 않고 회비 전용(`DuesMemberProgressBar`)으로 만들었다. 공용 프리미티브는 인디케이터 색이 `bg-primary` 고정이라 완납/부분납부/미납 색 구분이 불가능한데, 여러 화면이 공유하는 shadcn 파일을 회비 사정에 맞춰 고칠 이유는 없다(색 정의도 차트와 한 곳에서 관리된다)
  - ✅ 멤버 목록에 **상태 필터**(전체/미납/부분납부/완납, ToggleGroup)를 붙이고 미납 하이라이트 카드에서 "미납만 보기"로 바로 걸 수 있게 했다. 하이라이트 배지에는 이름과 함께 **남은 금액**을 표시한다(총무가 얼마를 받아야 하는지가 목록의 목적). 다른 회비 항목 탭으로 옮기면 필터는 자동으로 풀린다 — 새 항목에서 빈 목록만 보이는 상황을 만들지 않기 위해서다
  - ✅ **모임 홈의 회비 요약 카드를 더미에서 실데이터로 교체**(`getLatestDueCycleSummary`). 홈에서 `getDuesOverview()`를 그대로 쓰면 모든 항목·청구·이력을 다 읽는데 카드가 쓰는 건 최신 항목 하나뿐이라, 대상 항목의 청구와 그 청구에 달린 이력만 좁혀서 읽는다. 분모는 모임 인원이 아니라 **이 항목의 청구 인원**이다(항목 생성 뒤 가입한 멤버는 소급 청구되지 않으므로 둘이 다를 수 있다 — Task 022 정책)
  - ✅ 스켈레톤 UI(`components/dues/dues-dashboard-skeleton.tsx`)를 `Suspense fallback`에 연결했다. 회비 화면은 항목·청구·이력에 멤버 표시 이름 RPC까지 겹쳐 첫 응답이 느린데 `fallback={null}`이면 그동안 화면이 통째로 비어 "빈 모임"처럼 보인다. 폴백에 클라이언트 번들을 얹지 않도록 서버 컴포넌트로 뒀고, 스트리밍된 초기 HTML에 스켈레톤 22개가 6.2KB 지점에서 먼저 실려 오고 실제 콘텐츠는 63.8KB 지점에 오는 것으로 동작을 확인했다
  - ⚠️ **(Task 022가 넘긴 항목 정리) `createGroupSchema.defaultDueAmount`가 빈 칸을 `0`으로 저장하던 문제** — `z.coerce.number()`가 빈 문자열을 0으로 바꾸고 `min: 0`이라 에러도 안 나서 드러나지 않았다. "기본 회비 미설정"과 "기본 회비 0원"은 다른 뜻이므로 `z.preprocess`로 빈 값을 `undefined`로 정규화(Task 022의 `reminderIntervalDays`와 같은 처리). 이어서 **회비 항목 생성 폼이 모임의 기본 회비 금액을 프리필**하도록 연결했다(정기 회비는 매달 같은 금액이라 매번 다시 입력할 이유가 없다). 기본값이 없으면 금액 칸은 예전의 `0` 대신 **빈 칸**으로 시작하고, 그때 `z.coerce.number()`에 `undefined`가 들어가 zod 기본 영어 메시지("Expected number, received nan")가 뜨는 것을 막기 위해 `createDueCycleSchema.amount`에도 빈 값 → `0` 정규화를 넣어 항상 한국어 `minMessage`가 나오게 했다
  - ✅ i18n 신규 키 10종(`headcountRateLabel`/`amountRateLabel`/`paidCountSuffix`/`chargedCountSuffix`/`collectedAmountLabel`/`chargedAmountLabel`/`statusFilterLabel`/`filterAllLabel`/`filterEmptyState`/`showUnpaidOnlyButton`) — ko 확정 문구, en/ja/zh는 관례대로 스텁+`TODO(i18n)`. ℹ️ 요약 줄에 `common.memberCountSuffix`("명 참여 중")를 재사용했다가 "0/2명 참여 중 납부완료"가 되는 것을 E2E에서 발견해 전용 접미사 2종을 새로 뒀다
  - ✅ Playwright 실계정 E2E(계정 2개): 기본 회비 30,000원으로 모임 생성 → **회비 항목 폼 금액 칸이 30,000으로 프리필** → 항목 생성(청구 1건) → 초대로 일반회원 합류 → 두 번째 항목을 12,500원으로 생성(1,000원 단위가 아닌 금액도 저장, 청구 2건·청구 합계 25,000원) → 부분 납부 5,000원 기록 시 **금액 기준 20% / 상태 분포 부분납부 1·미납 1 / 미납 배지의 남은 금액 7,500원**이 동시에 갱신 → "납부완료로 변경"으로 인원 50%·금액 70% 반영. 필터는 미납 1건만 표시, 납부완료 필터는 "이 상태인 멤버가 없어요.", 탭 전환 시 전체로 리셋. 일반회원 화면에는 "새 회비 항목"·"납부완료로 변경"이 없고 남의 이름은 "이름 미확인 멤버"(Task 021 범위 유지). 360px·768px에서 **가로 스크롤 0건 / 44px 미만 터치 타겟 0건**, 1280px 다크모드 육안 확인. 테스트 계정 2개·모임은 삭제해 `woodong_*` 전부 0행 복귀
  - **완료 조건**: ✅ 납부 기록·완납 처리가 게이지·금액 진행률 바·상태 분포·미납 목록에 즉시 반영(`revalidatePath` + `router.refresh()`), ✅ 360px에서 진행률 바 가독성 확보(라벨 잘림 원인 제거), ✅ DB 변경 없음(마이그레이션 0건), ✅ `npm run check-all` 통과

- **Task 024-1: 회비 관리 통합 테스트 (Playwright MCP)** ✅ - 완료
  - **## 테스트 체크리스트**
    - ✅ 회비 항목 생성 → 활성 멤버 전원 `unpaid` 청구 생성 확인 — 활성 멤버가 1명·2명·3명일 때 각각 항목을 만들어 **청구가 정확히 1건·2건·3건** 생성되는 것을 UI와 SQL 양쪽에서 확인(청구 대상 이메일까지 대조). 청구 합계도 인원 × 항목 금액과 일치(12,500 × 3 = 37,500원)
    - ✅ 납부 상태 변경 → `woodong_payments` 기록 → `status` 자동 갱신 → 대시보드 즉시 반영 — 다이얼로그에서 금액을 기록할 때마다 게이지·금액 진행률 바·상태 분포·미납 목록·모임 홈 카드가 같은 값으로 갱신됨. 애플리케이션은 `status`를 쓰지 않고 트리거 결과를 그대로 표시한다(Task 023 설계). 반대로 **이력을 전부 삭제하면 `paid` → `unpaid`로 되돌아가는 것**도 확인
    - ✅ 부분 납부 누적으로 `partial` → `paid` 전환 — 12,500원 청구에 5,000원 기록 → `부분납부`(분포 1/1/1), 이어서 7,500원 추가 → 누계 12,500원으로 `납부완료`(분포 2/0/1). 두 번의 기록이 한 청구에 쌓이는 경로가 UI에서 그대로 동작
    - ✅ 일반회원 계정으로 상태 변경 시도 시 권한 차단 — **UI**: "새 회비 항목"·"납부완료로 변경" 버튼이 렌더링되지 않고, 납부 관리 다이얼로그는 열리되 **폼 0개·입력 0개**(닫기 버튼만)로 읽기 전용. **REST 우회 9종**: 항목 INSERT / 청구 INSERT / 이력 INSERT / 팬아웃 RPC 직접 호출은 `403 42501`, 항목 DELETE / 청구 `status` PATCH / 남의 이력 UPDATE·DELETE는 0행(`content-range: */0`), 같은 모임 SELECT만 정상. 호출 후 SQL로 **데이터 무변경** 확인
    - ✅ 전체 납부율 계산 정확성 검증 — UI 표기와 DB 집계를 **반올림까지 대조해 오차 0**. 인원 기준 1/3 → 33%, 2/3 → 67%, 금액 기준 17,500/37,500 → 47%, 25,000/37,500 → 67%. **모임 홈 요약 카드와 회비 대시보드가 같은 값**을 보여주는 것도 확인(Task 024에서 `summarizeDueCycle()`을 공유하게 만든 목적)
    - ✅ 엣지 케이스 — **금액 0/음수/빈 칸**: 세 경우 모두 `fetch` 후킹으로 **요청 0건**, "회비 금액은 1원 이상이어야 합니다"가 노출되고 다이얼로그 유지(빈 칸에서 zod 기본 영어 메시지가 나오지 않는 것까지 확인 — Task 024 수정 사항). **과거 날짜 납부 기한**: 2026-01-15로 항목 생성이 정상 허용됨(밀린 회비를 뒤늦게 등록하는 정상 시나리오라 막지 않는다). **항목 생성 후 신규 가입 멤버**: 항목 2건이 있는 상태에서 세 번째 멤버가 합류해도 **기존 항목 어디에도 소급 청구되지 않고**, 이후 만든 항목에만 3건이 생성됨(Task 022 정책 그대로)
    - ✅ **멤버 0명 모임에서 항목 생성** — 앱 경로로는 도달 불가함을 실증했다. 마지막 총무의 탈퇴(`status='left'`)와 강등이 트리거에 `P0001`로 막히고(문구: "마지막 총무는 역할을 변경하거나 탈퇴할 수 없습니다…"), 활성 멤버 0명 모임을 SQL로 강제로 만들어 팬아웃 RPC를 호출해도 RLS가 `42501`로 차단한다(비멤버는 어차피 총무가 아니므로). 확인용 픽스처는 즉시 삭제
    - ✅ (Task 024 회귀) 모임 생성 시 기본 회비 금액을 비워 두면 `0`이 아니라 **`NULL`로 저장**되는 것을 실제 폼으로 확인
  - ⚠️ **(범위 밖 관찰, 후속 과제로 이관)** 로그인 직후 `/protected/groups`에서 `listMyGroups`가 **`PGRST303 "JWT issued at future"`**로 1회 실패하는 것을 콘솔에서 발견했다. 로컬 시계와 Supabase 서버 시계는 초 단위까지 일치하므로 원인은 **GoTrue(토큰 발급)와 PostgREST(검증) 사이의 순간 스큐**다. 현재 `listMyGroups`는 실패를 삼키고 빈 배열을 반환해 **가입한 모임이 있는데도 "아직 속한 모임이 없어요" 빈 상태가 잠깐 보인다**. 회비 범위가 아니고(`lib/woodong/queries/groups.ts`, Task 019) 재시도 정책 결정이 필요해 이번 Task에서 손대지 않고 **Task 033의 "에러 핸들링 및 폴백 UI" 항목에 반영**했다
  - **완료 조건**: ✅ 위 시나리오 전부 통과, ✅ 금액 계산 오차 0(UI ↔ DB 대조), ✅ RLS 우회 경로 없음(REST 9종 전부 차단·무변경), ✅ 테스트 계정 3개·모임·초대·항목·청구·이력 정리 완료(`woodong_*` 전부 0행), ✅ 코드 변경 0건 — 발견된 회비 관련 결함 없음, ✅ `npm run check-all` 통과

---

### Phase 6: 모임 알림(앱 내) 및 투표 관리 (PRD 우선순위 4, 5)

> **1차 범위**: 앱 내 알림만 구현. 외부 채널(웹 푸시)과 실시간 pg_cron 스케줄러는 **2차 확장**(v1.6, 카카오톡 알림톡/Slack/이메일은 로드맵에서 완전히 제외). 회비 리마인드와 투표 마감은 **조회 시점 lazy 처리**로 대체한다.
> **의존성**: Phase 4·5(공지/회비 데이터), Phase 0(알림 테이블·컬럼 보호 트리거).

- **Task 025: 공지사항(`woodong_announcements`) CRUD 및 알림 팬아웃** ✅ - 완료
  - ⚠️ **(계획 변경, 사용자 승인) 팬아웃을 Edge Function이 아니라 `SECURITY DEFINER` RPC로 구현**했다(마이그레이션 `create_woodong_announcement_fanout`). 로드맵은 "클라이언트 RLS로 불가능하므로 Edge Function + `service_role`"을 전제했는데, 같은 제약을 **DB 함수로 풀면 세 가지가 더 낫다**: ① 공지 INSERT와 알림 팬아웃이 **한 트랜잭션**이라 "아무에게도 전달되지 않은 공지"가 남을 수 없다(Edge Function은 왕복 2회라 사이에서 실패하면 되돌릴 수 없다 — Task 022에서 회비 팬아웃을 RPC로 만든 것과 같은 이유), ② **`service_role` 키를 아예 쓰지 않으므로** "번들 노출" 위험이 원천 제거된다, ③ 이 저장소는 같은 성격의 권한 상승을 이미 **DEFINER RPC 12개**로 처리해 왔고 Edge Function은 0개다(`woodong_redeem_group_invite`가 가장 가까운 선례). 배포 대상·시크릿 관리·무료 플랜 콜드 스타트도 늘지 않는다
  - ✅ `woodong_create_announcement(p_group_id, p_title, p_body)` — 총무 판정을 **함수 내부에서** `woodong_is_group_admin()`으로 수행한다. DEFINER는 RLS를 우회하므로 판정을 RLS에 맡길 수 없다(회비 팬아웃이 INVOKER로 충분했던 것과 갈리는 지점 — 그쪽은 필요한 권한이 이미 총무에게 열려 있었다). 제목/본문 공백 검증도 함수 안에서 한 번 더 한다(REST 직접 호출 대비). `set search_path = ''` + `anon` EXECUTE 명시 REVOKE는 기존 규약 그대로
  - ✅ **팬아웃 대상 규칙**: 활성 멤버 중 `in_app`을 **명시적으로 끄지 않은** 사람(`coalesce(p.enabled, true)`) + **작성자 본인 제외**. 설정 행이 없으면 받는 **opt-out**이다 — opt-in으로 두면 마이페이지에 한 번도 안 들어간 사람은 어떤 공지도 못 받는데 그건 알림 기능이 없는 것과 같다. 자기가 방금 쓴 공지 알림을 자기가 받을 이유도 없다
  - ✅ `type='notice'`, `related_type='announcement'`, `related_id`=공지 ID, `channel='in_app'`, `status='sent'`로 기록(앱 내 알림은 레코드 생성이 곧 전달이라 `pending`을 거치지 않는다)
  - ✅ **수정은 알림을 재발송하지 않는다**(정책 확정). 오탈자 하나에 멤버 전원 알림이 다시 가면 알림이 신뢰를 잃고, 이미 읽은 사람에게 같은 공지가 안읽음으로 되살아난다. 크게 바뀌었으면 새 공지를 쓰는 편이 받는 사람에게도 분명하다 — 폼에 "수정해도 알림은 다시 가지 않아요"로 명시. `groupId`는 수정 대상에서 제외했다(공지를 다른 모임으로 옮기면 이미 발송된 알림의 `related_id`가 그 모임 비멤버를 가리킨다)
  - ✅ 수정 Server Action은 **RPC를 쓰지 않는다** — 팬아웃이 없어 권한 상승이 필요 없고 `woodong_announcements_update_admin` 정책이 이미 총무만 통과시킨다. RLS 거부가 0행으로 오므로 `count: "exact"`로 확인해 권한 오류로 되돌린다(Task 019~023과 같은 패턴). `updated_at`은 Task 002의 트리거가 갱신하고, 목록은 `created_at`과 1초 넘게 벌어졌을 때만 "수정됨" 배지를 붙인다(INSERT 시점 마이크로초 차이로 갓 쓴 공지가 수정됨으로 보이지 않게)
  - ✅ 조회 전용 모듈 `lib/woodong/queries/announcements.ts`(`listAnnouncements`/`listRecentAnnouncements`)와 Server Action `lib/woodong/actions/announcements.ts` 신설. 공지 목록·작성 폼의 더미를 실데이터로 교체하고, **모임 홈의 "최근 공지" 카드도 실데이터로 전환**(홈은 최신 3건만 좁혀 읽는다). 비멤버에게는 회비 화면과 같은 "모임을 찾을 수 없거나 접근 권한이 없어요"를 먼저 보여준다
  - ✅ 발송 성공 토스트는 **서버가 실제로 만든 알림 건수**를 그대로 쓴다(클라이언트가 멤버 수로 흉내 내면 작성자·비활성 멤버가 빠진 서버 계산과 어긋난다). 총무가 아니면 "공지 작성" 버튼을 렌더링하지 않고, `/announcements/new`에 직접 들어와도 폼 대신 안내 문구를 보여준다
  - ✅ i18n 신규 키 9종(ko 확정 문구, en/ja/zh는 관례대로 스텁+`TODO(i18n)`)
  - ✅ **(과정에서 함께 고친 것)** 공지 작성 페이지 상단 "공지사항" 돌아가기 링크가 360px에서 높이 20px로 **44px 터치 타겟 규칙(Task 013)을 위반**하고 있었다 — `min-h-11` 적용
  - ✅ Playwright 실계정 E2E(계정 3개, m2는 `in_app`을 끈 상태): 빈 폼 제출은 **요청 0건** + 두 필드 검증 문구 → 제목/본문 앞뒤 공백이 DB에서 trim되어 저장 → **총원 3명 중 정확히 1명에게만 알림 생성**(작성자 본인 제외, `in_app` 끈 m2 제외)되고 토스트도 "1명에게 알림을 보냈어요" → 수정 후에도 **알림은 여전히 1건**(재발송 없음)이고 `updated_at`만 갱신되며 "수정됨" 배지 노출. 일반회원은 목록에 작성/수정 버튼이 없고 `/new`는 폼 0개. **UI 우회 REST 5종 전부 차단**: 팬아웃 RPC·공지 INSERT·알림 INSERT는 `403 42501`(RPC는 "공지는 총무만 작성할 수 있습니다"), 공지 UPDATE/DELETE는 0행(제목 무변경 SQL 확인), 알림은 필터 없이 요청해도 **본인 것만** 반환. 360px에서 가로 스크롤 0건·터치 타겟 위반 0건. 테스트 계정 3개·모임·공지·알림·설정 정리 완료
  - ✅ **`service_role` 키 미노출 검증**: 애플리케이션 코드에 `SERVICE_ROLE` 참조 **0건**, `.env.local`의 실제 키 값(219자)으로 `.next/static`(클라이언트 전송 자산)과 `.next` 전체를 문자열 검색해 **발견 0건**. 브라우저가 받은 HTML+인라인+스크립트 24개(약 6MB) 전수 검사에서도 `sb_secret_` 형태 0건 — 검출된 `service_role` 문자열은 전부 `@supabase/auth-js`의 JSDoc 주석이었다(같은 검사에서 `sb_publishable_` 키는 정상 검출되어 검사 자체가 동작함을 확인)
  - **완료 조건**: ✅ 공지 1건 발송 시 `in_app` 활성 멤버 수만큼(작성자 제외) 알림 생성, ✅ `service_role` 키가 클라이언트 번들에 노출되지 않음(코드 참조 0건 + 빌드 산출물 0건), ✅ `get_advisors`(security) **ERROR 0건**(신규 WARN 1건은 `authenticated`에게 의도적으로 연 DEFINER RPC로, Task 003/020/021과 동일 패턴이며 `anon`에는 REVOKE됨), ✅ `npm run check-all` 통과

- **Task 026: 알림센터 구현 (읽음/클릭 처리)** ✅ - 완료
  - ✅ **DB 변경 0건** — 이번 Task는 마이그레이션도 RPC도 추가하지 않았다. Task 003이 이미 `woodong_notifications`에 본인 행 SELECT/UPDATE 정책과 컬럼 보호 트리거(`woodong_prevent_unauthorized_notification_update`)를 만들어 뒀고, 읽음/클릭은 **권한 상승이 필요 없는 유일한 쓰기 경로**다. 공지 팬아웃(Task 025)처럼 `SECURITY DEFINER`로 감쌌다면 오히려 그 트리거가 지켜 주는 보호막을 우리 손으로 우회하는 셈이 된다 — DEFINER는 필요할 때만 쓴다는 원칙을 여기서 지켰다
  - ✅ 조회 전용 모듈 `lib/woodong/queries/notifications.ts` 신설: `listMyNotifications`(최신 50건, 모임 이름 FK 임베드)·`countUnreadNotifications`(헤더 뱃지용). 두 함수 모두 **`user_id` 앱 레벨 필터를 일부러 붙이지 않았다** — 정책(`user_id = auth.uid()`)이 이미 유일한 필터이고, 앱 필터를 덧대면 "정책이 없어도 안전하다"는 착각을 남긴다(REST 검증에서 필터 없는 요청도 본인 것만 온다고 실측). 실패 시 throw 대신 빈 배열/0으로 폴백해 헤더 하나 때문에 페이지 전체가 깨지지 않게 했다
  - ✅ Server Action `lib/woodong/actions/notifications.ts` 신설:
    - `markNotificationClickedAction` — **이미 값이 있는 컬럼은 덮어쓰지 않는다**. `read_at`/`clicked_at`은 "처음" 읽고 처음 누른 시각이어야 도달~반응 지연을 계산할 수 있고, 같은 알림을 다시 눌렀다고 지표가 뒤로 밀리면 안 된다. 쓸 것이 없으면 빈 UPDATE 자체를 보내지 않는다
    - `markAllNotificationsReadAction` — `clicked_at`은 **건드리지 않는다**. 목록에서 "모두 읽음"을 누른 것은 알림을 실제로 열어 본 것이 아니라, 여기서 클릭까지 찍으면 KPI 클릭률이 부풀려진다
    - 남의 알림 ID를 넘기면 RLS가 에러가 아니라 0행으로 응답하므로 SELECT로 존재를 먼저 확인하고, **타인 알림과 삭제된 알림에 같은 메시지**("알림을 찾을 수 없어요.")를 쓴다 — 구분해 주면 남의 알림 ID의 존재 자체가 샌다
  - ✅ **클릭은 Action을 await한 뒤에 이동한다**(`components/notifications/notifications-list.tsx`). 이동을 먼저 시작하면 브라우저가 진행 중인 요청을 취소해 클릭 기록이 조용히 누락되고, 그러면 KPI "알림 클릭률"이 실제보다 낮게 잡힌다. 반대로 기록이 실패하면 토스트만 띄우고 **이동은 그대로 진행**한다 — 지표 때문에 사용자가 알림을 못 여는 것이 더 나쁘다. 새 탭/새 창(⌘·Ctrl·Shift·Alt, 휠 클릭)은 가로채지 않고 브라우저에 맡긴다(그 경로는 클릭 기록이 남지 않지만, 이동을 막는 쪽이 더 나쁘다)
  - ✅ 헤더 종 아이콘 미읽음 뱃지(`components/header-auth-nav.tsx`, Task 011에서 예고한 자리): `head: true` + `count: "exact"`로 **페이로드 0인 개수 전용 요청**(모든 라우트의 헤더에서 매 요청 실행된다), 99 초과는 `99+`로 축약. 뱃지는 루트 레이아웃에 있어 클라이언트 내비게이션만으로는 다시 그려지지 않으므로, 클릭 처리 후 `router.refresh()`를 **이동 전에** 호출해 도착 화면의 숫자가 이미 맞도록 했다
  - ✅ 목록에 **모임 이름**을 함께 표시(알림은 여러 모임에서 섞여 오므로 "어느 모임 소식인지"가 목록에서 바로 보여야 한다). 더미 데이터를 실데이터로 교체하고 로컬 state 기반 가짜 읽음 처리를 제거, 요약 문구도 `3안읽음` → `3건의 새 알림이 있어요`로 교정
  - ✅ i18n 신규 키 5종(ko 확정 문구, en/ja/zh는 관례대로 스텁+`TODO(i18n)`)
  - ✅ Playwright 실계정 E2E(계정 2개, 공지 2건 팬아웃): 헤더 뱃지 `2` + aria-label "알림 (안 읽은 알림 2)" → 알림 클릭 시 공지 화면으로 이동하며 `read_at`/`clicked_at` **동시 기록**, 도착 화면 뱃지 즉시 `1` → **같은 알림 재클릭 시 두 타임스탬프 불변**(최초 클릭 유지) → "모두 읽음" 토스트 "1건을 읽음으로 표시했어요."(이미 읽은 1건 제외) 후 `read_at`만 채워지고 `clicked_at`은 `null` 유지, 뱃지 사라짐 → 알림 0건일 때 빈 상태 문구 노출. **양방향 격리 확인**: m1은 본인 알림 1건만, m2는 본인 2건만 보인다
  - ✅ **UI 우회 REST 6종 전부 차단**: 필터 없는 SELECT도 본인 2건만 반환, 타인 알림은 SELECT/UPDATE 모두 **0행**(원본 `read_at` 무변경 SQL 확인), 본인 알림이라도 `title`/`user_id`/`status` 변경은 컬럼 보호 트리거가 `P0001 "권한이 없습니다: read_at, clicked_at 외의 컬럼은 변경할 수 없습니다."`로 거부, 알림 INSERT는 `403 42501`, DELETE는 0행(정책 없음). Server Action이 보내는 것과 동일한 SELECT/UPDATE를 m1 세션으로 SQL 임퍼소네이션해도 `visible_rows=0 / updated_rows=0`
  - ✅ 360px에서 가로 스크롤 0건·터치 타겟(44px) 위반 0건 실측. 테스트 계정 2개·모임·공지·알림 정리 완료(`woodong_*` 전부 0행)
  - ⚠️ **(범위 밖 재관찰)** Task 024-1에서 후속 과제로 이관한 `PGRST303 "JWT issued at future"`(로그인 직후 `listMyGroups` 1회 실패)가 이번 테스트에서도 그대로 재현됐다. 알림 조회 경로에서는 발생하지 않았고 조치 위치도 그대로라, Task 033의 "에러 핸들링 및 폴백 UI" 항목에 남겨 둔다
  - **완료 조건**: ✅ 읽음/클릭 상태가 정확히 갱신되고(최초 시각 보존, 중복 클릭에도 1회만) ✅ 타인 알림 조회·조작이 UI·REST·SQL 어느 경로로도 차단됨, ✅ `get_advisors`(security) **ERROR 0건**(WARN은 전부 기존 항목, 이번 Task는 DB 객체 추가 0건), ✅ `npm run check-all` 통과

- **Task 027: 알림 채널 설정 (마이페이지)** ✅ - 완료
  - ✅ **(계획 변경) `channel` CHECK 제약 갱신을 Task 038에서 이번 Task로 앞당겼다.** DB는 여전히 v1.4 시절 값(`kakao`/`slack`/`email`/`in_app`)을 들고 있어서 `web_push` 설정을 저장하려는 순간 `23514`로 막힌다 — 즉 이 Task의 요구사항 자체를 이 제약 없이는 만들 수 없다. 마이그레이션 `update_woodong_notification_channel_check`로 `woodong_notification_preferences.channel`·`woodong_notifications.channel`을 **`('web_push','in_app')`**으로 좁혔고, 두 테이블 모두 **0행인 상태**에서 적용해 백필/정리 전략이 필요 없었다. 재생성한 두 제약은 Task 002의 `udong_` 오타 접두어를 `woodong_`으로 교정했다(나머지 10개 CHECK 제약은 여전히 `udong_` — 동작에는 영향이 없어 이번 범위에 넣지 않았다)
  - ✅ 조회 `listMyChannelPreferences`(`lib/woodong/queries/notifications.ts`)는 **저장된 행이 없어도 채널마다 한 줄씩 채워서** 돌려준다. 설정을 한 번도 건드리지 않은 사용자가 정상 상태이기 때문이다
  - ✅ **채널별 기본값을 코드 한 곳(`CHANNEL_DEFAULT_ENABLED`)에 못 박았다**: `in_app`은 **opt-out(기본 ON)** — 팬아웃 RPC가 `coalesce(p.enabled, true)`로 판정하므로 화면 기본값이 다르면 "켜져 있는데 안 온다/꺼져 있는데 온다"가 된다. `web_push`는 반대로 **opt-in(기본 OFF)** — 브라우저 권한과 Push 구독(`destination`)이 있어야 보낼 수 있어서, 켜진 것처럼 보여 주면 지킬 수 없는 약속이 된다
  - ✅ Server Action `updateChannelPreferenceAction`은 UPDATE가 아니라 **upsert**(`onConflict: "user_id,channel"`)다 — 설정 행은 첫 토글 때 생긴다. `user_id`는 요청 본문이 아니라 **세션 클레임에서 채운다**(정책이 어차피 막지만, 남의 설정을 만들어 보라고 본문에 자리를 내주지 않는다). 이 테이블에는 `updated_at` 갱신 트리거가 없어(Task 002는 공지에만 붙였다) Action이 명시적으로 채운다
  - ✅ 토글은 **낙관적 로컬 state**로 즉시 움직이고, 실패하면 이전 값으로 되돌린 뒤 토스트를 띄운다 — 되돌리지 않으면 화면에는 꺼져 있는데 실제로는 알림이 계속 오게 된다. 성공 후 `router.refresh()`로 서버 값을 다시 읽는다
  - ✅ 마이페이지의 `DUMMY_NOTIFICATION_PREFERENCES`를 제거하고 실데이터로 교체. i18n은 `kakao`/`slack`/`email` 키를 삭제하고 `webPush`·채널별 설명 2종·`saveErrorToast` 신규 추가(ko 확정 문구, en/ja/zh는 관례대로 스텁+`TODO(i18n)`)
  - ✅ Playwright 실계정 E2E(계정 2개): 설정 행 0개 상태에서 **기본값이 규칙대로**(in_app ON / web_push OFF) 렌더 → 각각 토글하면 DB에 행 2개 생성(`in_app=false`, `web_push=true`) → 새로고침 후 **저장값 그대로 복원** → 같은 채널을 껐다 켜도 **행은 계속 2개**(`UNIQUE(user_id, channel)` upsert, 건드린 채널의 `updated_at`만 갱신)
  - ✅ **발송 연동 검증(핵심 완료 조건)**: m2가 `in_app`을 끈 상태에서 총무가 공지를 발송하면 알림 **0건**(작성자·비활성 멤버 모두 제외), 다시 켠 뒤 발송하면 **정확히 1건**(`channel='in_app'`). `web_push`가 켜져 있어도 **web_push 알림 행은 생성되지 않는다**(1차는 `in_app`만 발송)
  - ✅ **UI 우회 REST 4종 전부 차단**: 필터 없는 설정 조회도 본인 것만(m1 세션에서 m2 행 0건), 타인 설정 UPDATE는 0행, 타인 명의 INSERT는 `403 42501`, 삭제된 채널 값(`email`) 저장은 `400 23514`(새 제약 이름으로 거부). 실제 DB 값 무변경 확인
  - ✅ 360px 가로 스크롤 0건. 스위치 컨트롤 자체는 32×18px이지만 **행 전체(`<label>`, 60~92px 높이 × 전체 너비)가 터치 타겟**이며, 라벨 텍스트를 눌러도 저장까지 되는 것을 실측 확인(Task 013 규칙 충족 방식이 기존 UI와 동일)
  - ⚠️ **미검증 경로**: 저장 실패 시 토글이 이전 값으로 되돌아가는 분기는 실패를 인위적으로 만들 방법이 마땅치 않아 E2E로 밟지 못했다(코드 경로는 성공/실패 공통이며 실패 시 `formError` → 토스트 + 롤백)
  - **완료 조건**: ✅ 설정 저장/복원 정상 동작(기본값·upsert·복원 전부 실측), ✅ `in_app` 비활성 사용자에게 앱 내 알림이 생성되지 않음(0건 → 재활성화 시 1건), ✅ `get_advisors`(security) **ERROR 0건**(WARN은 전부 기존 항목), ✅ `npm run check-all` 통과

- **Task 028: 회비 리마인드 lazy 처리 구현** ✅ - 완료
  - > **Task 003에서 확인된 선행 제약**: `woodong_dues`에는 클라이언트용 UPDATE 정책이 전혀 없다(상태는 트리거 전용). `last_reminded_at` 갱신도 `SECURITY DEFINER` RPC를 통해서만 가능하므로, 리마인드 생성 로직 자체를 이 RPC 안에 구현해야 한다.
  - ✅ 마이그레이션 `create_woodong_process_due_reminders` — `woodong_process_due_reminders(p_group_id, p_title_suffix, p_body)` `SECURITY DEFINER` + `set search_path = ''`, `anon` EXECUTE 명시 REVOKE(비로그인 호출은 `401 42501 permission denied for function`으로 실측 확인). 대상은 **호출자 본인(`auth.uid()`)의 청구로만** 좁히며, 남의 리마인드를 만들 수 있는 인자 자체가 없다
  - ✅ **선점(UPDATE) → 알림 INSERT를 한 문장(CTE)으로** 처리한다. 조회 후 갱신으로 나누면 동시에 들어온 두 요청이 모두 "보낼 때가 됐다"고 판단해 중복 알림을 만든다. 한 문장으로 두면 뒤에 온 UPDATE가 행 잠금에서 기다렸다가 **갱신된 행으로 조건을 다시 평가**(READ COMMITTED EvalPlanQual)해 0행이 된다
  - ✅ **첫 리마인드의 기준점은 `coalesce(last_reminded_at, cycle.created_at)`**. `last_reminded_at`이 null이라고 곧바로 보내면 회비 항목을 만든 직후 대시보드를 연 멤버가 주기가 지나지도 않았는데 독촉을 받는다. 이 기준이라야 로드맵의 "주기 미도래 시 미생성"이 갓 만든 항목에도 성립한다
  - ✅ 대상 조건: 본인 청구 + `status <> 'paid'`(부분납부도 미납이므로 포함) + `reminder_interval_days is not null`(nullable = 리마인드 없음, PRD 5.5) + **활성 멤버**(모임을 떠난 사람에게 독촉하지 않는다 — 로드맵에 없던 조건이지만 탈퇴자에게 알림이 가는 것이 명백히 잘못이라 추가)
  - ✅ `in_app`을 끈 사람에게는 **아무것도 하지 않는다** — 알림도 안 만들고 `last_reminded_at`도 건드리지 않는다. 그 컬럼은 "실제로 알린 시각"이어야 하고, 나중에 채널을 다시 켰을 때 곧바로 받는 편이 맞다(설정 행이 없으면 켜진 것으로 보는 opt-out 규칙은 공지 팬아웃과 동일)
  - ✅ 호출부는 `lib/woodong/due-reminders.ts`의 `processDueReminders()` — **`queries/`에 두지 않았다**. 이름은 조회처럼 불리지만 실제로는 렌더 도중 쓰기를 하는 함수라, 읽기 전용 규약의 `queries/*`와 섞이면 안 된다. Server Action도 아니다(렌더 중에는 `revalidatePath`를 호출할 수 없고, 같은 렌더에서 곧바로 다시 읽으므로 재검증도 불필요). 실패해도 throw하지 않는다 — 리마인드 때문에 회비 화면이 안 열리면 훨씬 나쁘다
  - ✅ 진입점 2곳(PRD 3.3/3.4-a가 지정한 그대로): 회비 대시보드(모임 한정)와 알림센터(모든 모임). 둘 다 **조회보다 먼저** 실행해 이번 렌더에 반영되게 했다
  - ✅ 알림 문구는 i18n에서 넘긴다(`dues.reminderNotificationTitleSuffix`/`reminderNotificationBody` — 기존 미사용 키 `reminderToastMessage`를 실제 용도에 맞게 개명, en/ja/zh 접미사는 실제 번역). RPC 쪽에도 한국어 기본값을 두었는데, **2차 pg_cron 배치에는 사용자 로케일이 없어** 호출부가 문구를 넘길 수 없기 때문이다
  - ✅ **⚠️ 실시간 배치 발송(pg_cron)은 2차 확장(Task 037)**임을 마이그레이션 주석·`due-reminders.ts` 주석에 명시(확장 시 대상 사용자 인자를 받는 형태로 넓히면 된다는 방향까지 기록)
  - ✅ Playwright 실계정 E2E(계정 2개, 회비 항목 4종): **주기 미도래**(방금 만든 7일 주기)·**주기 미설정**(null)·**완납**(paid) 3종은 전부 미생성이고, **주기 도래 + 미납** 1건만 알림 생성 + 해당 청구의 `last_reminded_at`만 갱신 → 회비 화면·알림센터에 재진입해도 **추가 생성 0건** → 알림센터 목록에 `8월 정기회비 납부 리마인드`로 정상 노출(링크는 해당 모임 회비 화면)
  - ✅ **동시성**: `last_reminded_at`을 10일 전으로 되돌린 뒤 **RPC 8회 동시 호출** — 정확히 1회만 `1`을 반환하고 나머지 7회는 `0`, 알림 증가분도 1건(중복 생성 0건)
  - ✅ `in_app` off 상태로 회비 화면 진입 → 알림 미생성 **및 `last_reminded_at` 무변경** 확인, 다시 켜고 진입하면 곧바로 1건 생성. 탈퇴(`status='left'`) 상태에서는 주기가 지나도 0건
  - ✅ **사용자 간 격리**: m1이 호출하면 m1 본인 청구에 대해서만 생성되고(같은 항목이라도 m2가 완납한 청구는 m2에게 안 가고 미납인 m1에게만 간다) m2의 알림/`last_reminded_at`은 무변경
  - ✅ `database.types.ts` 재생성(신규 함수 4줄만 반영), 테스트 계정 2개·모임·회비 항목·청구·납부·알림 정리 완료(`woodong_*` 전부 0행)
  - **완료 조건**: ✅ 주기 미도래 시 미생성, ✅ 주기 도래 시 1건만 생성, ✅ 동시 8요청에서도 중복 생성 0건, ✅ `get_advisors`(security) **ERROR 0건**(신규 WARN 1건은 `authenticated`에게 의도적으로 연 DEFINER RPC로 Task 003/020/021/025와 동일 패턴이며 `anon`에는 REVOKE됨), ✅ `npm run check-all` 통과

- **Task 029: 투표 생성 및 참여 구현** ✅ - 완료
  - ✅ 마이그레이션 `create_woodong_create_vote_and_closed_guard`:
    - `woodong_create_vote(...)` `SECURITY DEFINER` RPC — 공지(Task 025)와 같은 이유다. ① `woodong_notifications`에 INSERT 정책이 없어 클라이언트가 남에게 알림을 만들 수 없고, ② **투표·선택지·알림이 한 트랜잭션**이어야 "선택지가 하나도 없는 투표"나 "아무도 모르는 투표"가 남지 않는다. 총무 판정은 DEFINER가 RLS를 우회하므로 함수 안에서 `woodong_is_group_admin()`으로 직접 한다. 제목/선택지/마감일시 검증도 REST 직접 호출 대비 함수 안에서 한 번 더 하고, **빈 선택지는 버린 뒤 개수를 센다**(공백만 채워 2개를 만드는 우회 차단)
    - ⚠️ **(로드맵에 없던 추가) `woodong_prevent_closed_vote_response` BEFORE INSERT 트리거** — RLS INSERT 정책은 "본인 + 멤버"만 보고, Task 003의 중복 방지 트리거는 같은 사람이 두 번 넣는 것만 본다. 즉 **마감된 투표에 응답을 밀어 넣는 경로가 열려 있었다**. `status='closed'`뿐 아니라 **`closes_at` 경과**도 함께 보는데, 1차 MVP의 마감이 조회 시점 lazy 전환(Task 030)이라 "시각은 지났는데 status는 아직 open"인 구간이 반드시 존재하기 때문이다. 트리거 이름을 `woodong_a_...`로 둬서 중복 방지 트리거보다 먼저 돌게 했다(같은 BEFORE INSERT는 이름 순 실행 — 마감이 이유일 때 중복 메시지가 나오면 안 된다)
  - ✅ 조회 전용 모듈 `lib/woodong/queries/votes.ts`(`listVotes`/`listOpenVotes`/`getVoteDetail`)와 Server Action `lib/woodong/actions/votes.ts`(`createVoteAction`/`submitVoteResponseAction`) 신설. 목록·상세·생성 폼의 더미를 실데이터로 교체
  - ✅ **집계는 `woodong_vote_responses`를 직접 세지 않는다** — 그 테이블은 본인 응답만 SELECT할 수 있어(익명성, PRD 4.2) 클라이언트가 셀 수 있는 숫자는 0 아니면 1이다. 총 응답 수·선택지별 집계는 Task 003의 `woodong_get_vote_results()` RPC만 알고 있고, 목록 카드의 "N표"도 이 RPC 경유다(투표당 1회 호출이라 `VOTES_PAGE_SIZE=50` 상한 + 병렬 호출, 규모가 커지면 집계 전용 RPC로 바꿔야 한다고 주석에 남김)
  - ✅ 참여는 **RPC를 쓰지 않는다** — 본인 응답 INSERT는 이미 정상 권한이라 권한 상승이 필요 없다. 복수 선택은 **한 문장으로** 넣는다(선택지마다 나눠 넣으면 중간 실패 시 일부만 반영되고, 사용자는 재시도조차 못 한다 — 이미 들어간 것 때문에 중복으로 막힌다)
  - ✅ 결과 표시는 로컬 state로 더하지 않고 `router.refresh()`로 서버에서 다시 받는다. 익명 투표에서 클라이언트가 표를 더하면 "내가 무엇을 골랐는지"가 화면 상태에 남아, 익명성을 지키는 유일한 경로(RPC)를 우회하게 된다. 이 과정에서 `VoteDetail`은 Client → **Server Component**로 전환
  - ✅ 찬반(`yes_no`)을 고르면 폼이 선택지를 **찬성/반대 2개로 고정**(추가/삭제 버튼 숨김)하고 서버도 `yes_no`는 정확히 2개만 허용한다 — 찬반인데 선택지가 5개면 형식과 내용이 어긋난다
  - ✅ `datetime-local` 값은 타임존이 없어 그대로 보내면 DB가 UTC로 읽는다. Action에서 `new Date(...).toISOString()`으로 변환해 넘기고, 실제로 `21:00 KST → 12:00 UTC`로 저장되는 것을 확인
  - ✅ 총무가 아니면 목록의 "투표 만들기" 버튼을 렌더링하지 않고, `/votes/new`에 직접 들어와도 폼 대신 안내를 보여준다. 비멤버에게는 회비·공지와 같은 "모임을 찾을 수 없거나 접근 권한이 없어요"
  - ✅ i18n: 데모 문구가 남아 있던 `create.successToast`/`submitVoteSuccessToast`를 실제 문구로 교체하고 신규 키 6종 추가(알림 제목/본문, 팬아웃 건수, 총무 전용 안내, 마감 안내 — en/ja/zh 스텁 관례 유지)
  - ✅ Playwright 실계정 E2E(계정 2개): **빈 폼 제출은 요청 0건** + 4개 필드 검증 문구 → **과거 마감일시는 "마감 일시는 현재 이후여야 합니다"로 차단** → 단일선택 투표 생성(선택지 2개, 순서 보존, 알림 1건 = 작성자 제외) → 복수선택+익명 투표 생성(선택지 3개) → 찬반 투표 생성(찬성|반대 자동 고정) → 일반회원 화면에 "투표 만들기" 버튼 없음 → **단일선택 참여 1표(100%)** 후 "이미 참여한 투표예요" → **복수선택 2개 동시 참여 → 2표(각 50%)**, 익명이라 이름 미노출 / 실명 투표는 "참여자: 테스트멤버" 노출
  - ✅ **UI 우회 REST 7종 전부 차단**: 단일선택 중복 참여 `P0001`("이미 이 투표에 참여했습니다"), 복수선택 동일 선택지 재투표 `P0001`("이미 동일한 선택지에"), 남의 `user_id`로 응답 `403 42501`, 일반회원의 생성 RPC 호출 `403 42501`("투표는 총무만 만들 수 있습니다"), `woodong_votes` 직접 INSERT `403 42501`, **마감 후 참여 `403 42501`**(status는 아직 `open`인 상태에서 `closes_at` 경과만으로 차단됨을 확인), 응답 테이블 필터 없이 조회해도 **본인 3건만**(다른 사용자 id 0건 — 익명성 유지)
  - ✅ **한 문장 다중 INSERT도 트리거가 잡는다**: 단일선택 투표에 선택지 2개를 한 statement로 넣는 우회를 SQL로 시도해 `P0001`로 거부되고 0행이 남는 것을 확인(plpgsql이 같은 명령 안에서 앞선 행을 본다). Action 쪽에서도 단일선택에 2개 이상이 오면 필드 에러로 먼저 거른다
  - ✅ 360px 가로 스크롤 0건·터치 타겟 위반 0건, `database.types.ts` 재생성, 테스트 계정 2개·모임·투표 3건·선택지·응답·알림 정리 완료
  - ⚠️ **(관찰, Task 030으로 이관)** 실명 투표 결과의 `voter_names`는 `profiles.name`이 비어 있으면 배열에서 **아예 빠진다**(`array_remove(..., null)`). 그러면 "3표"인데 이름은 1개만 보이는 화면이 나올 수 있다. 결과 화면은 Task 030 범위라 그쪽에서 멤버 목록과 같은 `unnamedMemberLabel` 폴백(Task 021의 `member-display.ts`)을 적용하는 편이 맞다
  - **완료 조건**: ✅ 단일/복수 선택 투표가 각각 명세대로 동작, ✅ 중복 투표 차단 확인(UI·REST·한 문장 다중 INSERT 전부), ✅ `get_advisors`(security) **ERROR 0건**(신규 WARN 1건은 `authenticated`에게 의도적으로 연 DEFINER RPC, 트리거 함수는 EXECUTE 전량 회수라 WARN 없음), ✅ `npm run check-all` 통과

- **Task 030: 투표 lazy 마감·집계·결과 알림 구현** ✅ - 완료
  - > **Task 003에서 확인된 선행 제약**: `woodong_votes` UPDATE는 관리자 전용 정책뿐이라 lazy 마감(아무 멤버나 조회 시 `status`를 `closed`로 전환)이 RLS를 통과하지 못한다. lazy/수동 조기마감 공용 `SECURITY DEFINER` 함수를 새로 만들어야 한다.
  - ✅ 마이그레이션 `create_woodong_vote_closing` — 함수 3종:
    - `woodong_close_expired_votes(p_group_id, p_title, p_body)` — **lazy 마감**. `update ... where status='open' and closes_at <= now()` **한 문장으로 선점**한다. 동시에 두 멤버가 같은 투표를 열면 뒤에 온 UPDATE는 앞의 행 잠금에서 기다렸다가 **갱신된 행으로 조건을 다시 평가**하므로(READ COMMITTED의 EvalPlanQual) 0행이 되고 결과 알림도 만들어지지 않는다. 조회 후 갱신(select → update)으로 나눴다면 둘 다 "내가 닫는다"고 판단해 알림이 두 번 갔을 것이다 — Task 028의 회비 리마인드와 같은 패턴. DEFINER는 RLS를 우회하므로 `woodong_is_group_member()`로 "내가 속한 모임인지"를 함수 안에서 직접 확인한다
    - `woodong_close_vote_now(p_vote_id, p_title, p_body)` — **총무 수동 조기마감**. 같은 선점 방식이라 이미 닫힌 투표에서는 0행 → 결과 알림이 다시 가지 않는다. 총무 판정도 함수 안에서 `woodong_is_group_admin()`으로 한다. 없는 투표와 권한 없는 투표를 **구분해서 알려 주지 않는다**(구분하면 "그 투표가 존재하는지"가 비멤버에게 새는 정보가 된다)
    - `woodong_notify_vote_close(p_vote_ids[], ...)` — 두 경로가 공유하는 **내부 전용** 팬아웃. 대상 규칙("활성 멤버 중 `in_app`을 명시적으로 끄지 않은 사람" = opt-out)을 두 함수에 복사해 두면 언젠가 한쪽만 고쳐져 규칙이 갈라진다. **EXECUTE는 anon·authenticated·public 전량 회수** — 직접 호출을 열어 주면 "마감을 선점하지 않은" 호출자가 아무 투표에나 알림을 만들 수 있다
  - ⚠️ **lazy 마감과 수동 마감은 알림 대상이 한 명 다르다(의도한 것)**. lazy는 **아무도 제외하지 않는다** — 마감을 촉발한 사람은 "그 순간 화면을 연 사람"일 뿐이라 임의로 정해지는데, 그 사람만 빼면 **누가 먼저 열었느냐에 따라 알림 대상이 달라진다**. 반면 수동 마감은 총무가 의도해서 누른 것이라 공지·투표 생성 팬아웃과 같은 규칙으로 본인을 제외한다. 두 경우 모두 **참여 여부와는 무관하게** 나머지 멤버 전원이 받는다(결과는 모임의 결정 사항이라 투표하지 않은 사람에게도 알려야 한다)
  - ✅ 마이그레이션 `fix_woodong_vote_results_unnamed_voters` — **Task 029에서 이관된 관찰 사항 해소**. 기존 `array_remove(array_agg(p.name), null)`은 `profiles.name`이 빈 참여자를 배열에서 통째로 빼서 **"2표인데 이름은 1개"**가 나왔다. 이제 빈 자리를 빈 문자열로 남기고(`array_agg(...) filter (where r.id is not null)`, 이름 없는 사람은 뒤로 정렬) 화면이 멤버 목록·회비 대시보드와 **같은** `unnamedMemberLabel`("이름 미확인 멤버")로 채운다 — `voter_names.length`가 `response_count`와 항상 일치하게 됐다. 익명 투표가 `null`을 반환하는 동작은 그대로
  - ✅ 렌더 도중 쓰기를 하는 `lib/woodong/vote-closing.ts` 신설(`processExpiredVotes`). `queries/*`는 읽기 전용 규약이라 섞지 않고, 렌더 중에는 `revalidatePath`를 부를 수 없으므로 Server Action도 아니다 — Task 028의 `due-reminders.ts`와 같은 자리. 실패해도 throw하지 않는다(마감 전환 때문에 투표 화면 자체가 안 열리면 훨씬 나쁘다). 늦어져도 안전한 이유는 화면이 `status`가 아니라 `closes_at`을 직접 보고 참여 위젯을 감추기 때문(쿼리 계층의 `isClosed`)
  - ✅ 호출 지점 3곳 — 투표 **목록**, 투표 **상세**(알림 클릭으로 목록을 거치지 않고 들어오는 경로), **모임 홈**. 전부 조회보다 **먼저** 실행해야 방금 전환된 상태가 이번 렌더에 반영된다
  - ⚠️ **(로드맵에 없던 추가) 모임 홈의 "진행 중인 투표" 카드가 아직 더미였다** — Task 029가 목록·상세·생성만 실데이터로 바꾸면서 `listOpenVotes()`를 만들어 두고 연결하지 않았다. 그 카드는 `status`로만 거르므로 lazy 마감을 붙여도 만료 투표가 계속 "진행중"으로 남아 이번 Task의 결과가 화면에서 어긋난다. 실쿼리로 연결하고 `getDummyGroupDashboard` 의존을 제거했다
  - ✅ 총무 전용 `CloseVoteButton`(`components/votes/close-vote-button.tsx`) — 마감은 되돌릴 수 없고 모임 전원에게 알림이 나가므로 `AlertDialog`로 한 번 더 확인받는다(모임 삭제와 같은 규약). 이미 닫혀 있었으면(다른 총무가 먼저 눌렀거나 lazy로 닫혔거나) **실패가 아니라** "이미 마감된 투표예요"로 알린다 — 원하던 상태에 이미 도달해 있는 것이다. Action이 RPC 호출 **전에** `status`를 한 번 읽는 이유는, 알림 대상이 총무 혼자인 모임에서는 정상 마감도 팬아웃 0건이라 "이미 마감돼 있었다"와 구분되지 않기 때문
  - ✅ 결과 시각화는 Task 013 차트 컴포넌트(`VoteResultsChart`) 재사용 — Task 029에서 이미 연결돼 있어 이번엔 이름 폴백만 얹었다
  - ✅ i18n: 신규 키 6종(마감 다이얼로그 제목, 성공/이미마감 토스트, 팬아웃 건수 접미사, 결과 알림 제목·본문) — `Dictionary` 타입 + 4개 언어 파일 갱신(en/ja/zh 스텁 관례 유지). 기존 `closeNowButton`/`closeNowConfirmMessage`는 Task 012의 UI 스텁을 그대로 썼다
  - ✅ **DB 레벨 검증**(임시 픽스처: 모임 1·멤버 4·투표 3, 검증 후 전량 삭제): 만료 2건만 마감되고 진행중 1건은 그대로 → **재호출 0건**(중복 마감·중복 알림 없음) → 알림은 멤버 4명 중 `in_app`을 끈 1명을 뺀 **3건**, 투표하지 않은 멤버와 마감을 촉발한 멤버 모두 포함 → 일반회원의 수동 마감 `42501`("투표는 총무만 마감할 수 있습니다") → **비멤버의 lazy 마감 호출은 0건**(진행중 투표 status 그대로) → 총무 수동 마감 첫 호출 2건(본인 제외)·두 번째 호출 **0건** → 마감 후 참여 시도 `42501` → 비멤버의 결과 RPC 호출 거부 → **익명 투표 결과의 `voter_names`가 `null`**(카운트만), 실명 투표는 `["최지우", ""]`로 길이가 `response_count`와 일치
  - ⚠️ **다중 세션 동시 요청 테스트는 미수행** — 이 환경에서는 진짜 동시 세션을 만들 수 없었다(pg_cron 워커가 멈춰 있고 dblink 미설치). 선점 자체는 Task 028에서 동시 8요청으로 검증된 것과 **같은 한 문장 UPDATE** 구조이고, 순차 재호출이 0건인 것까지는 위에서 확인했다. Task 030-1에서도 브라우저 컨텍스트가 하나라 재현하지 못해 **최종적으로 Task 033의 E2E 회귀 항목으로 이관**했다
  - **완료 조건**: ✅ 마감 전환이 1회만 수행되고 중복 알림 없음(순차 재호출 기준, 동시 요청은 Task 033), ✅ 익명 투표에서 응답자 식별 정보가 어떤 경로로도 노출되지 않음(RPC가 `null` 반환 + 비멤버 호출 거부), ✅ `get_advisors`(security) **ERROR 0건**(신규 WARN 2건은 `authenticated`에게 의도적으로 연 DEFINER RPC로 Task 025/028/029와 동일 패턴이며 `anon`에는 REVOKE됨, 내부 전용 팬아웃 함수는 EXECUTE 전량 회수라 WARN 없음), ✅ `npm run check-all` + `npm run build` 통과

- **Task 030-1: 알림·투표 통합 테스트 (Playwright MCP)** ✅ - 완료
  - **테스트 픽스처**: 실계정 3개(총무 1 + 일반회원 2, 그중 1명은 마이페이지에서 `in_app`을 **끈** 계정)로 모임 1개·초대 코드·공지 1건·회비 항목 1건(청구 3건)·투표 2건을 UI로 직접 만들어 진행. 시간 경과가 필요한 두 곳(회비 리마인드 주기, 투표 마감 시각)만 SQL로 되돌렸다
  - **## 테스트 체크리스트**
    - ✅ 공지 발송 → 멤버 계정 알림센터에 노출 → 클릭 시 이동 및 `read_at`/`clicked_at` 갱신 — 알림센터에 4건(공지·`vote_start` 2·회비 리마인드)이 쌓이고, 공지 알림 클릭 후 두 컬럼이 모두 채워지는 것을 SQL로 확인. ⚠️ **공지는 "상세"가 아니라 목록(`/announcements`)으로 이동한다** — 공지 상세 라우트가 없어서 `resolveHref`가 목록을 가리킨다(Task 025 설계). 체크리스트 문구와 다르지만 결함은 아니다
    - ✅ `in_app` 비활성 사용자에게 알림 미생성 — 그 계정의 알림은 공지·투표 시작·투표 마감·회비 리마인드 **전부 0건**. 본인이 직접 회비 대시보드와 알림센터를 열어도 0건이고, **`last_reminded_at`도 `null` 그대로**(채널을 다시 켜면 곧바로 받도록 한 Task 028 설계가 실제로 지켜짐)
    - ✅ 미납 상태에서 대시보드 진입 시 리마인드 생성, 주기 내 재진입 시 미생성 — 항목 생성 직후 진입은 **0건**(주기 미도래), 생성 시각을 8일 전으로 되돌린 뒤 진입하니 **1건** 생성되고 `last_reminded_at` 갱신, 곧바로 재진입해도 **1건 유지**
    - ✅ 투표 생성 → 전원 `vote_start` 알림 → 단일/복수 선택 참여 → 중복 투표 차단 — 투표 2건 각각 알림 1건(작성자·`in_app` off 제외). 단일선택은 라디오, 복수선택은 체크박스 2개 동시 참여가 각각 정상 기록. 중복은 **UI**("이미 참여한 투표예요")와 **REST 우회**(`P0001` "이미 이 투표에 참여했습니다") 양쪽에서 차단
    - ✅ 마감일시 경과 후 조회 시 자동 마감 + 결과 집계 + `vote_close` 알림 기록 — 마감 시각을 1시간 전으로 되돌린 뒤 **일반회원이 목록을 여는 것만으로** 상태가 `closed`로 바뀌고 "마감" 섹션으로 이동, 집계(2표)는 그대로 유지. 알림은 **참여 여부와 무관하게** 전원(촉발한 본인 포함) 2건. 목록·상세·모임 홈 3경로를 다시 방문해도 **중복 알림 0건**
    - ✅ 총무 수동 조기마감 플로우 — "지금 마감"은 총무 화면에만 렌더링(일반회원 화면에 없음), 확인 다이얼로그에서 **취소하면 `open` 그대로**, 확인하면 배지가 "마감"으로 바뀌고 버튼이 사라진다. 알림은 **마감을 누른 총무 본인을 제외한 1건**(lazy 마감과 갈리는 지점이 실제 동작으로 확인됨). 이미 마감된 투표에 RPC를 다시 호출하면 **0건**
    - ✅ 익명 투표 결과에서 응답자 이름 미노출(네트워크 응답 페이로드까지 검증) — `woodong_get_vote_results` REST 응답에서 익명 투표는 `voter_names: null`(카운트만), 실명 투표만 배열을 돌려준다. **응답 테이블을 필터 없이 조회해도 본인 3건만** 보이고 다른 사용자 id는 0건. 마감 이후에도 `null` 유지
    - ✅ 엣지 케이스 — **선택지 1개**(빈 칸 포함): 요청 0건 + "선택지 내용을 입력해주세요"(삭제 버튼이 2개 미만에서 disabled라 UI로는 애초에 1개를 만들 수 없다). **과거 마감일시**: 요청 0건 + "마감 일시는 현재 이후여야 합니다". **마감 직후 투표 시도**: REST로 밀어 넣어도 `42501`("이미 마감된 투표입니다"). **타인 알림 읽음 처리**: PATCH가 **0행**(`content-range: */*`)이고 대상 알림의 `read_at`/`clicked_at`은 `null` 그대로
    - ✅ (Task 030 회귀) **`voter_names` 이름 폴백** — 이름이 빈 계정이 참여한 실명 투표에서 "참여자: **이름 미확인 멤버**"가 표시되고, 이름을 설정한 계정과 나란히 각각 올바르게 렌더링. 수정 전이라면 참여자 줄 자체가 사라졌을 화면이다
    - ✅ (Task 030 회귀) **내부 전용 팬아웃 RPC 직접 호출** `woodong_notify_vote_close` → `42501 permission denied for function`, **일반회원의 수동 마감 RPC** → `42501`("투표는 총무만 마감할 수 있습니다")
  - ⚠️ **다중 세션 동시 마감 테스트는 여전히 미수행** — Task 030에서 이관받았으나, 이번 E2E도 브라우저 컨텍스트가 하나라 같은 순간에 두 멤버가 같은 투표를 여는 상황을 만들지 못했다. 순차 재호출이 0건인 것(위 두 항목)까지만 확인했고, 선점 구조 자체는 Task 028에서 동시 8요청으로 검증된 것과 같은 한 문장 UPDATE다. **Task 033의 E2E 회귀 항목으로 이관**한다
  - **완료 조건**: ✅ 위 시나리오 전부 통과, ✅ 익명성 보장 검증 완료(RPC 페이로드 + 응답 테이블 직접 조회 양쪽), ✅ 테스트 계정 3개·모임·초대·공지·회비·투표·알림 정리 완료(`woodong_*` 전 테이블 0행), ✅ **코드 변경 0건 — 발견된 결함 없음**, ✅ `npm run check-all` 통과

---

### Phase 7: 1차 MVP 품질 확보 및 출시 준비 ✅

> **의존성**: Phase 3~6 완료.

- **Task 031: 성능·접근성 최적화** ✅ - 완료
  - **측정 환경**: `npm run build` + `npm run start`(프로덕션 빌드) 대상 Lighthouse 13.4.1, 모바일 폼팩터(시뮬레이션 4G). 보호 페이지는 실계정 세션 쿠키를 `--extra-headers`로 넣어 측정하고, 측정용 모임·회비 2건·투표 3건·공지 5건 픽스처는 검증 후 전량 삭제
  - ✅ **접근성: 주요 5개 화면 전부 100/100** (착수 시점 랜딩 모바일 94 / 데스크톱 89). 발견한 결함은 전부 실제 결함이었다:
    - `button-name` — **테마 전환 버튼에 접근 가능한 이름이 없었다**(아이콘 하나뿐). 스크린리더에 그냥 "버튼"으로 읽힌다. `sr-only` 텍스트로 이름을 주고 아이콘은 `aria-hidden` 처리. 문구는 i18n 키(`nav.theme`) 신설 — 이 참에 하드코딩 영어였던 Light/Dark/System 메뉴 항목도 4개 언어로 번역
    - `color-contrast` (2건) — 로고 워드마크 "Woodong"(`text-muted-foreground/70`, 10px)과 **비활성 탭**(`text-foreground/60`, 실측 4.32:1 → AA 기준 4.5:1 미달). 각각 투명도를 걷어내고 `/70`으로 올렸다. 탭은 shadcn 프리미티브(`components/ui/tabs.tsx`)라 회비 대시보드뿐 아니라 탭을 쓰는 모든 화면에 함께 적용된다
    - `aria-progressbar-name` — 모임 홈의 납부율 진행바에 이름이 없어 "진행률 표시줄 67%"라고만 읽혔다. `aria-label`로 무엇의 67%인지 알려 준다
  - ⚠️ **(Lighthouse가 못 잡는 결함, 직접 발견) `<html lang="en">`인데 콘텐츠는 전부 한국어였다** — `html-has-lang` 감사는 "lang이 있는지"만 보므로 100점이어도 통과한다. 스크린리더가 한국어를 영어 음성 엔진으로 읽어 내용을 알아들을 수 없게 만드는 실제 결함이다. 정적 셸에 기본 로케일 `ko`를 박고, 다른 언어는 이미 로케일을 아는 헤더 경계에서 `HtmlLangSync`(클라이언트)가 속성만 고친다 — 루트 레이아웃에서 `getLocale()`을 부르면 쿠키를 읽는 순간 **문서 전체가 동적**이 되어 `cacheComponents`의 정적 셸이 사라지고, `<html>`은 `<Suspense>`로 감쌀 수도 없다
  - ✅ **LCP 개선: 랜딩 모바일 3.2s → 2.8s**(perf 93 → 96). 결정타는 **루트 레이아웃의 `OAuthResultToast`가 Supabase 브라우저 클라이언트를 모듈 최상단에서 import하던 것** — 실제로 필요한 경로는 OAuth 콜백 직후 `?linked=...`가 붙은 1회뿐인데, 랜딩을 포함한 **모든 페이지**가 251KB(전송 64 KiB, 그중 61 KiB 미사용) 청크를 받고 있었다. 필요한 순간에만 `await import()`하도록 바꿔 **스크립트 전송량 268 → 204 KiB**, LCP 요소 렌더 지연 **530ms → 111ms**. 로그아웃(`UserNavMenu`)도 같은 이유로 클릭 시점 로드로 전환
    - ⚠️ **중간 측정이 한 번 틀렸다** — `pkill`이 실패해 이전 빌드 서버가 살아 있는 채로 측정해 "개선 효과 없음"으로 보였다. 포트를 확실히 비우고 재측정해서야 청크가 사라진 것을 확인했다. 이후 측정은 매번 서버 재기동 후 수행
  - ✅ **스켈레톤 UI**: 회비 대시보드에만 있던 스켈레톤을 **모임 목록·모임 홈·공지·투표 목록·투표 상세·알림센터 6개 화면**으로 확대(`components/page-skeletons.tsx`, 전부 서버 컴포넌트라 폴백이 클라이언트 번들을 늘리지 않는다). 이 앱은 페이지가 전부 얇은 셸 + `<Suspense>` 구조라 폴백이 `null`이면 헤더 아래가 통째로 빈 화면이고, 느린 회선에서 그 화면은 "데이터가 없는 모임"과 구별되지 않는다
    - ⚠️ **스켈레톤이 실제보다 짧으면 CLS가 나빠진다** — 처음 만든 투표 상세 스켈레톤이 실제(약 860px)보다 500px가량 짧아 콘텐츠 도착 시 푸터가 밀려 **CLS 0.169**(기준 0.1 초과)가 됐다. 실제 구조(차트 176px + 선택지 4행 + 참여 위젯)에 맞춰 키워 **0.003**으로 해결. 회비 대시보드가 처음부터 0.003이었던 것도 같은 이유(Task 024의 스켈레톤이 실제 레이아웃과 같은 골격)
  - ✅ **INP: 실측 최대 56ms**(목표 200ms) — 회비 탭 전환·납부 상태 필터·납부 관리 다이얼로그 열기를 `PerformanceObserver('event')`로 측정. 5개 화면 **TBT 0~40ms**로 메인 스레드 여유도 확인
  - ✅ **360px 반응형: 10개 화면 가로 스크롤 0건**. 터치 타겟 44px 위반은 랜딩 2건(히어로 CTA 40px, "기술 스택 더 보기" 링크 20px)만 실제 결함이라 `min-h-11`로 수정 — 투표 라디오(16×16)와 마이페이지 스위치(32×18)는 `<label>` 래퍼가 247×44/247×60이라 실제 탭 영역이 충분한 **위양성**이었다. 수정 후 Lighthouse `target-size` 통과
  - ✅ **키보드 내비게이션**: 양수 `tabindex` 0건(탭 순서 왜곡 없음), 접근 가능한 이름 없는 포커스 대상 0건(Lighthouse a11y 100으로 교차 확인)
  - ✅ **이미지**: 사용자 업로드는 `lib/storage/image.ts`가 업로드 **전에** 클라이언트에서 리사이즈(최대 1600px, JPEG 0.85)하고, 표시는 `next/image` + `next.config.ts`의 서명 URL `remotePatterns` 경유임을 재확인(Storage 서버 변환은 Pro 플랜 전용이라 미사용, Task 004/019 설계 그대로)
  - ⚠️ **LCP 목표 미달 — 보호 페이지 4.2~5.9s, 랜딩 2.8s(목표 4G 2.5s)**. 원인은 코드가 아니라 측정 환경이다: 관측 LCP는 랜딩 114ms·보호 페이지 546~~867ms이고, 3~~6초는 Lighthouse Lantern이 **4G RTT를 시뮬레이션**해 환산한 값이다. 남은 임계 경로는 ① 렌더 블로킹 CSS 2개(25.9KB + 1KB, 시뮬레이션 기준 450ms + 153ms)와 ② 보호 페이지의 **서버 → Supabase 왕복**(개발 노트북에서 원격 리전으로 나가는 지연이라 프로덕션의 Vercel 엣지 ↔ 같은 리전 Supabase와 다르다). **실제 목표 달성 여부는 Task 033의 프로덕션 배포 후 실측으로 판정**한다
  - **완료 조건**: ✅ 주요 5개 화면 **Lighthouse 접근성 100/100**(기준선 충족), ✅ INP 목표(200ms) 달성 — 실측 56ms, ✅ CLS 전 화면 0.1 이하(최대 0.057), ⚠️ **LCP 목표는 로컬 시뮬레이션 기준 미달 → Task 033 프로덕션 실측으로 이월**, ✅ 측정 픽스처·테스트 계정 정리 완료, ✅ `npm run check-all` + `npm run build` 통과

- **Task 032: 스타터킷 잔재 정리 및 라우팅 최종 정합성 확인** ✅ - 완료
  - ✅ **4개 데모 페이지 존치 결정: `/about`만 제거, `/tech-stack`·`/avatars`·`/charts`는 유지.** 판단 기준은 "우동 사용자에게 보여도 말이 되는가"였다
    - `/about`은 **문자 그대로 "next.js 스타터킷3 소개"**였다(`heroTitle: "next.js starter-kit v3"`). 게다가 푸터 주석이 "스타터킷 소개(/about) 링크는 노출하지 않는다"고 명시해 **어디서도 링크되지 않는 도달 불가 라우트**였다 — 존치 이유가 없어 제거
    - `/tech-stack`은 PRD 3.1이 랜딩 요구사항으로 명시한 "사용 기술 스택 소개"에 해당하고 랜딩·푸터 양쪽에서 링크된다 → 유지
    - `/avatars`, `/charts`는 PRD 3.8이 재사용 확정한 `/icons`·`/gallery`와 같은 개발자/QA용 내부 문서 성격이고 이미 푸터에 나란히 노출 중 → 유지. **푸터 링크 5개는 변경 없음**
  - ✅ **유지하기로 한 `/tech-stack`의 문구를 우동 기준으로 교정** — 존치 결정만으로는 "스타터킷 잔재" 문제가 남는다. 실제로 이 페이지는 **자기 자신을 스타터킷이라고 소개하고 있었고**(4개 언어 `techStack.description` + `PLANNED_TECH_STACK.description`), 내용도 **Phase 3~6에서 실제로 쓴 스택과 어긋나 있었다**
    - `Supabase Auth`가 "Google OAuth 지원"으로만 적혀 있었다 → 실제 구현(Task 016)은 **Google + Kakao**
    - **`백엔드 & 인증` 카테고리에 데이터베이스 항목이 아예 없었다** — 우동은 12개 `woodong_*` 테이블과 RLS가 핵심인데 Supabase Auth만 적혀 있었다. `Supabase Postgres`(RLS 격리)와 `Supabase Storage`(모임 대표 이미지 + 서명 URL) 항목 추가
  - ✅ **`lib/supabase/proxy.ts` allow-list 정리** — 6줄짜리 `!pathname.startsWith(...)` 체인을 `PUBLIC_PATH_PREFIXES` 배열 + `some()`으로 바꾸고 실제 라우트와 대조했다. 여기서 **`/about` 외에 `/login`도 잔재로 드러났다**: allow-list에 있지만 이 앱에 `app/login`은 존재한 적이 없다(로그인은 `/auth/login`이고 이미 `/auth` 접두어로 통과한다). 공개 경로가 상수 하나에 모이면서 "새 공개 페이지 추가 시 등록" 규약의 위치도 명확해졌다
  - ✅ **`/protected` 루트는 삭제가 아니라 리다이렉트로 처리** — 내용은 `getClaims()` 결과를 `JSON.stringify`로 덤프하고 `FetchDataSteps` 튜토리얼을 띄우는 순수 스타터킷 화면이었고 링크도 0건이었다. 다만 세그먼트를 통째로 지우면 북마크·구 링크가 404가 되므로 `redirect(DEFAULT_AFTER_LOGIN_PATH)`로 모임 목록에 넘긴다(로그인 직후 경로와 같은 상수를 재사용해 두 경로가 갈라지지 않게 했다)
  - ✅ **미사용 자산 제거**: `components/tutorial/` 3파일, **`lib/woodong/dummy/` 8파일 1,075줄**(Phase 1~~2 스캐폴딩 — Phase 3~~6에서 실데이터로 전환한 뒤 참조 0건으로 남아 있었다), 소비자가 없던 배럴 `lib/woodong/index.ts`
  - ✅ **사전(dictionary) 정리** — `about` 블록 전체 + `demoModeNotice`(삭제한 더미 스캐폴딩용 문구)를 4개 언어와 `types.ts`에서 제거. 이 과정에서 **`headerTitle` 키 6종이 어느 컴포넌트에서도 읽히지 않는 죽은 데이터**임을 확인해 함께 제거했다(`about`/`gallery`/`icons`/`avatars`/`charts`/`techStack` — 과거 헤더가 페이지 제목을 표시하던 시절의 잔재)
  - ✅ **라우팅 정합성 실측**(프로덕션 빌드 + `next start`, 비로그인 세션): `/`·`/tech-stack`·`/avatars`·`/charts`·`/gallery`·`/icons`·`/invite/[code]` **200**, `/protected*` 전부 `next` 쿼리를 보존한 채 `/auth/login`으로 **307**. 제거한 `/about`은 존재하지 않는 `/nope`와 **완전히 동일하게 동작**함을 확인(비로그인은 로그인 리다이렉트, 로그인 상태면 404) — 잔재가 남아 응답하는 경우가 없다
  - ⚠️ **`.next` 캐시 때문에 typecheck가 한 번 실패했다** — `app/about/page.tsx`를 지운 뒤 `tsc`가 `.next/types/validator.ts`의 `Cannot find module '../../app/about/page.js'`로 죽었다. 코드 문제가 아니라 Next가 생성해 둔 라우트 타입이 stale한 것이라, **라우트를 삭제할 때는 `rm -rf .next` 후 재빌드**해야 한다
  - **완료 조건**: ✅ 존치 결정이 코드와 allow-list에 반영, ✅ 미사용 라우트 0건(`next build` 라우트 목록에서 `/about` 소멸, 나머지 31개 라우트 전부 도달 가능), ✅ `npm run check-all` 통과(0 errors — 남은 6건은 shadcn 벤더 컴포넌트의 기존 warning), ✅ `npm run build` 통과, ✅ `CLAUDE.md`의 `/about`·`components/tutorial/`·allow-list 서술 갱신

- **Task 033: 전체 사용자 플로우 E2E 회귀 테스트 및 배포** ✅ - 완료
  - **테스트 픽스처**: 실계정 2개(총무 1 + 일반회원 1)로 모임 1개·초대 코드·회비 항목 1건(청구 2건)·납부 1건·공지 1건·투표 1건을 UI로 직접 만들어 진행. 시간 경과가 필요한 두 곳(투표 마감 시각, 회비 리마인드 주기)만 SQL로 되돌렸다. 프로덕션 빌드(`npm run build` + `npm run start`) 대상
  - **## 테스트 체크리스트**
    - ✅ **전 구간 통합 시나리오 통과** — 가입 → 모임 생성 → 초대 발급(`UEDR-NUKF`, 만료·최대 20회 기본값 자동 세팅) → 비로그인 초대 미리보기 → 두 번째 계정 가입(`next` 보존) → 참여 → 회비 항목 생성(멤버 2명 청구 자동 생성, 60,000원) → 납부 처리(납부율 50% 반영) → 공지 발송 → 투표 생성/참여(중복 참여 차단) → 마감 → 모임 삭제 시 13개 테이블 CASCADE 0행
    - ✅ **권한 분기 회귀 — UI와 REST 양쪽**. 일반회원 화면에는 "모임 정보 수정/역할 변경/초대 발급은 총무만" 안내만 뜨고 생성 버튼과 위험 구역이 아예 렌더링되지 않는다. **REST로 직접 8종을 시도해도 전부 막혔다**: INSERT 계열(회비 항목·납부·초대)은 `42501`, 공지 RPC는 `42501`("공지는 총무만 작성할 수 있습니다"), UPDATE/DELETE 계열(모임 수정·삭제·청구 상태 변경·**자기 자신 총무 승격**)은 RLS `USING`이 걸러 **HTTP 200 + 0행**. 시도 후 모임명·역할·청구 상태·각 테이블 건수가 하나도 변하지 않은 것을 SQL로 확인
    - ✅ **(Task 030 → 030-1 이관분) 다중 세션 동시 투표 마감 — 드디어 재현·검증 완료.** 브라우저 컨텍스트로는 두 세션을 못 만들어 두 번 미뤄졌던 항목인데, **두 계정의 access token을 각각 받아 `woodong_close_expired_votes`를 동시 8요청**으로 때리는 방식으로 진짜 경쟁 상태를 만들었다. 결과: **정확히 1개 요청만 `1`을 반환하고 나머지 7개는 `0`**, `vote_close` 알림은 멤버 2명에게 **각 1건씩 중복 0건**. 한 문장 UPDATE 선점이 실제 동시성 아래서 의도대로 동작함
    - ✅ **오프라인·서버 에러 폴백** — 아래 "발견하고 고친 결함" 참고. 잘못된 자격증명은 그대로 "이메일 또는 비밀번호가 올바르지 않아요."로 구분됨(회귀 확인)
    - ✅ **360 / 768 / 1280 3개 뷰포트 회귀 — 12개 화면 × 3 = 36건 전부 가로 스크롤 0건**(`scrollWidth > clientWidth` 자동 측정)
    - ⚠️ **(Task 031에서 이관) 프로덕션 배포 후 LCP 실측 — 절반만 통과.** 아래 "프로덕션 배포 및 실측" 참고
  - **## 발견하고 고친 결함 (코드 6건 + DB 2건)**
    - 🔒 **`woodong_increment_invite_used_count(uuid)` — 권한 검사가 없는 SECURITY DEFINER 함수가 살아 있었다.** Task 020에서 초대 로직을 `woodong_redeem_group_invite()`로 합치며 호출부가 사라졌는데 `authenticated` EXECUTE가 남아 있었고, 함수 본문에 **호출자 검증이 한 줄도 없다**. `woodong_group_invites`의 RLS는 SELECT/INSERT/UPDATE/DELETE를 전부 `woodong_is_group_admin()`으로 막아 두었는데 이 함수는 그 검사를 통째로 우회해, 초대 UUID를 아는 사람(현재/과거 총무)이 반복 호출하면 `used_count`를 `max_uses`까지 올려 **모임 초대 링크를 영구히 소진**시킬 수 있었다. 호출부가 없으므로 `drop function`이 곧 수정(마이그레이션 `drop_woodong_increment_invite_used_count`). 삭제 후 REST 호출이 `PGRST202` 404로 떨어지는 것과, 일반회원의 초대 행 조회가 여전히 0행인 것을 함께 확인
    - ⚡ **woodong RLS 정책 12개의 `auth.uid()` → `(select auth.uid())`** (마이그레이션 `optimize_woodong_rls_auth_uid_initplan`). performance advisor `auth_rls_initplan` 경고 12건이 **전부 해소**됐다. 판정 결과는 동일하고 플래너가 행마다 재평가하지 않고 InitPlan으로 한 번만 평가한다
    - 🐛 **(이관분 수정) `listMyGroups`가 조회 실패와 "결과 0건"을 구분하지 못했다** — Task 024-1·030-1에서 두 번 관측된 `PGRST303`. 반환 타입을 `{ ok: true; groups } | { ok: false }`로 바꿔 **타입 차원에서 두 경우가 섞이지 않게** 막고, `PGRST303`(시계 스큐)일 때만 250ms·600ms로 짧게 두 번 재시도한다(RLS 위반처럼 다시 해도 같은 실패는 재시도하지 않는다). 화면은 빈 상태 대신 "일시적인 오류가 발생했어요 + 다시 시도"를 그린다. **`woodong_group_members`의 SELECT 권한을 잠깐 회수해 실제로 실패를 주입**해 확인했고 권한은 즉시 복구
    - 🐛 **같은 결함이 `getGroupDetail`에도 있었다(더 넓은 영향)** — 조회 실패 시 `null`을 반환해 **모임 홈·회비·공지·투표·설정 5개 화면이 "모임을 찾을 수 없거나 접근 권한이 없어요"로 표시**됐다. 멀쩡한 멤버가 자기가 쫓겨난 줄 알게 되는 화면이다("없음"과 "비멤버"를 같이 처리하는 건 존재 여부를 숨기려는 의도된 설계지만 **조회 실패까지 여기 섞인 건 의도가 아니다**). 실패는 throw하도록 바꾸고, 에러를 통째로 버리던 멤버십 조회도 같이 고쳤다
    - 🐛 **앱 전체에 `error.tsx`가 하나도 없었다** — 서버 컴포넌트가 throw하면 Next.js 기본 화면(`This page couldn't load` / `A server error occurred.` / `ERROR 2821105671@E394`)이 떴다. **영문이고, 헤더·푸터가 통째로 사라지고, 사용자에게 의미 없는 내부 식별자가 노출된다.** `app/error.tsx`(앱 셸 유지, 한국어, 다시 시도)와 레이아웃까지 터졌을 때를 위한 `app/global-error.tsx` 추가. 실패 주입으로 폴백이 헤더·푸터를 유지한 채 한국어로 뜨는 것을 확인
    - 🐛 **`errors.networkError`가 4개 언어에 정의돼 있는데 쓰는 곳이 0건이었다** — 네트워크가 끊기면 `TypeError: Failed to fetch`가 오는데 코드 매핑에 걸리지 않아 "일시적인 오류"로 폴백됐다. 틀린 말은 아니지만 **사용자가 할 수 있는 일(연결 확인)을 알려주지 못한다.** `mapAuthErrorMessage()`에 네트워크 판별을 넣어 연결했고, Supabase 요청만 실패시킨 상태로 로그인해 **"네트워크 연결을 확인해주세요."**가 뜨는 것을 확인
    - 💄 **빈 상태에서 같은 문장이 두 번 나오는 곳 2군데** — 회비 대시보드는 "회비는 수입만 집계돼요…"를 빈 상태 설명과 하단 상시 카드에서 **각각** 그렸고, 투표 목록은 `votes.emptyState`와 `emptyStates.noVotes`가 **문장이 완전히 같아** 위아래로 겹쳤다. 투표 쪽은 게다가 `votes.emptyState`가 **en/ja/zh 사전에도 한국어가 그대로** 들어 있어, 번역된 `emptyStates.noVotes`만 남기는 것으로 두 문제를 함께 해결
    - 💄 **모임 목록 빈 상태의 설명이 페이지 제목이었다** — `EmptyDescription`에 `dict.groups.pageTitle`("모임 목록")이 들어가 있어 빈 화면에 아무 의미 없는 한 줄이 붙어 있었다. 제거(안내는 제목 문구가 하고, 바로 아래 CTA가 다음 행동을 가리킨다)
  - **## 프로덕션 배포 및 실측**
    - ✅ **Vercel 프로덕션 배포 완료** — `archy2/woodong-01` 신규 생성(기존 프로젝트가 없었다), GitHub 저장소 연결, **https://woodong-01.vercel.app**. 배포 리전은 `icn1`(서울)
      - ⚠️ **`NEXT_PUBLIC_` 변수는 CLI 기본값(secret visibility)으로는 등록되지 않는다** — `invalid_visibility` 에러가 난다("public framework prefix cannot use secret visibility on Production or Preview"). `--visibility config --no-sensitive`로 3개 환경에 한 번에 넣어야 한다. `SUPABASE_SERVICE_ROLE_KEY`는 반대로 sensitive로 **production/preview에만** 넣었다(로컬 개발은 `.env.local`이 담당)
      - ⚠️ `vercel env ls`가 보여주는 `eyJ2IjoidjIi…`는 값이 아니라 CLI의 표시 형식이다. 실제 값은 `vercel env pull`로 확인했다(`https://ybhluy…`, `sb_publishable_…`)
      - ⚠️ `vercel link`가 `.gitignore`에 `.env*`를 추가하는데, 이 저장소는 이미 `.env*.local` + `.env`로 더 정확하게 무시하고 있어 되돌렸다(그대로 두면 나중에 `.env.example` 같은 문서용 파일까지 삼킨다)
    - ✅ **배포 후 스모크 통과** — 비로그인 라우팅 11경로가 로컬과 동일(공개 6개 200, `/protected*` 307 + `next` 보존, 제거한 `/about`은 로그인 리다이렉트). 실계정으로 가입 → 모임 생성 → 5개 탭·알림센터·마이페이지 전 화면 정상 렌더링 확인 후 픽스처 전량 삭제
    - ⚠️ **LCP 판정: 랜딩·모임 목록은 통과, 보호 페이지 2종은 미달** (Lighthouse 13.4.1, 모바일 시뮬레이션 4G — Task 031과 같은 기준)

      | 화면            | perf |      LCP |      CLS | 판정         |
      | --------------- | ---: | -------: | -------: | ------------ |
      | 랜딩(데스크톱)  |  100 |     0.5s |        0 | —            |
      | 랜딩(모바일 4G) |   96 | **2.3s** |    0.002 | ✅ 목표 2.5s |
      | 모임 목록       |   96 | **2.3s** |     0.02 | ✅           |
      | 회비 대시보드   |   86 |     3.3s | **0.14** | ❌ LCP·CLS   |
      | 모임 홈         |   83 | **4.7s** |    0.013 | ❌ LCP       |
      - ✅ **Task 031이 이월한 랜딩 LCP는 해결됐다** — 로컬 2.8s → 프로덕션 **2.3s**. "렌더 블로킹 CSS는 시뮬레이션 환산 탓"이라던 Task 031의 예측이 맞았다
      - ❌ **하지만 보호 페이지는 시뮬레이션 탓이 아니었다.** Task 031은 로컬에서 관측 LCP 546~~867ms인데 시뮬레이션만 4.2~~5.9s로 나오는 것을 보고 "측정 환경 문제"로 판단했는데, 프로덕션에서는 **관측 LCP 자체가 3,986ms**(모임 홈)로 시뮬레이션(4,685ms)과 비슷하다. 즉 실제로 느리다
      - **원인은 서버 → Supabase 왕복이 맞되, 리전 문제는 아니다.** Vercel `icn1`·Supabase 게이트웨이 `ICN` 둘 다 서울이고 `server-response-time`은 10~20ms다. 그런데 **TTFB 0.18~~0.29s / 스트리밍 완료 2.0~~2.7s**로, 셸은 즉시 오고 `<Suspense>` 안쪽(Supabase 쿼리)이 2초 이상을 쓴다. 랜딩은 같은 조건에서 총 0.6s다. 모임 홈 한 화면이 `getClaims` → `getGroupDetail`(모임 + 멤버십 + 인원 집계 + 서명 URL) → 공지 → 회비 요약 → 투표 → lazy 마감·리마인드까지 **순차 왕복을 여러 번** 한다
      - ❌ **회비 대시보드 CLS 0.14(기준 0.1)** — 원인은 **푸터 밀림**(단일 shift 0.1396). `DuesDashboardSkeleton`은 Task 024/031에서 "실제 레이아웃과 같은 골격"으로 만들어 데이터가 있을 때는 0.003이지만, **항목이 0건이면 한 줄짜리 빈 상태로 확 줄어들며 푸터가 위로 튄다**. 새 모임을 만든 총무가 회비 탭에서 처음 보는 화면이 정확히 이 경우다
      - **두 건 모두 Task 031 성격의 성능 최적화(쿼리 병렬화 + 스켈레톤/빈 상태 높이 정합)라 이번 Task에서 손대지 않았다.** 검증에도 배포·재측정 사이클이 한 번 더 필요하다. **아래 후속 과제로 분리**한다
  - **## 후속 과제로 분리**
    - 🔄 **보호 페이지 LCP 최적화 — 서버 시간은 절반으로 줄였으나 Lighthouse 시뮬레이션 목표(2.5s)는 여전히 미달.** 아래 "LCP 최적화 결과" 참고
    - ✅ **회비 대시보드 CLS — 0.14 → 0.003으로 해소.** 다만 **직접 고쳐서가 아니라** 아래 최적화로 서버 응답이 빨라져 스켈레톤 노출 구간이 짧아진 결과다. 원인(스켈레톤 921px vs 빈 상태 443px, 360px 기준 478px 붕괴 → 푸터 밀림)은 그대로 남아 있으므로, **서버가 느려지면 다시 나타날 수 있다**
  - **## LCP 최적화 결과 (Task 033 후속)**
    - **한 일: 화면당 Supabase 순차 왕복 줄이기.** 코드 변경만이고 마이그레이션은 없다
      - `getGroupDetail()` — 모임 → 멤버십 → 인원수를 줄줄이 await하던 것을 `Promise.all` 한 묶음으로. 셋 다 `groupId`/`userId`만 필요해 서로를 기다릴 이유가 없었다(왕복 3 → 1). 서명 URL만 `cover_image_object_path`에 의존해 뒤에 남겼고, 대표 이미지가 없는 모임은 그 왕복이 아예 생기지 않는다
      - 모임 홈 — **투표 lazy 마감 RPC가 회비·공지 조회까지 붙잡고 있었다.** 실제로 이 결과에 의존하는 건 `listOpenVotes` 하나뿐이라 "마감 → 투표 조회" 한 체인으로 묶어 나머지와 나란히 돌린다
      - `getLatestDueCycleSummary()` — 회차 → 청구 → 납부 3단 체인이 모임 홈에서 가장 긴 경로였다. FK를 이용한 **PostgREST 중첩 임베딩 한 번**으로 합쳤다(왕복 3 → 1). 임베딩 쿼리가 단일 쿼리와 같은 비용(실측 57~72ms)임을 확인했고, RLS는 임베딩된 테이블에도 그대로 적용된다
      - `getDuesOverview()` — 회차를 먼저 읽어 "0건이면 조기 반환"하려고 순차로 돌렸는데, 청구·납부는 `group_id`가 비정규화돼 있어 회차를 기다릴 필요가 없다. 조기 반환의 절약보다 **항상 붙는 왕복 1회**가 더 비쌌다(왕복 2 → 1)
      - 회비 페이지 — 리마인드 RPC를 조회보다 먼저 await하던 것을 병렬로. 이 화면은 리마인드 결과로 그리는 것이 하나도 없다(`last_reminded_at`은 타입에만 있고 렌더링되지 않으며, 알림은 알림센터와 헤더 배지가 따로 읽는다). ⚠️ 나중에 이 화면에서 `last_reminded_at`을 표시하면 순서를 되돌려야 한다
    - **결과 (프로덕션 실측, 같은 계정·같은 데이터)**

      | 지표                |              모임 목록 |             모임 홈 |       회비 대시보드 |
      | ------------------- | ---------------------: | ------------------: | ------------------: |
      | 문서 응답 시간      |      2,034 → **908ms** |                   — |                   — |
      | **관측 LCP**        |    2,357 → **1,172ms** | 3,986 → **1,950ms** | 2,622 → **2,074ms** |
      | 스트리밍 완료(curl) |                      — |    2.28 → **1.91s** |    2.69 → **1.39s** |
      | CLS                 |           0.02 → 0.016 |       0.013 → 0.026 |    **0.14 → 0.003** |
      | 시뮬 LCP(목표 2.5s) | 2,292 → **4,597ms** ⚠️ |     4,747 → 4,747ms |     3,348 → 3,400ms |

    - ⚠️ **관측 지표는 전부 개선됐는데 Lighthouse 시뮬레이션 LCP는 개선되지 않았고, 모임 목록은 오히려 나빠졌다.** 3회 반복 측정에서 편차가 거의 없어(시뮬 4,595~4,610ms) 측정 노이즈가 아니다. 다만 **회귀도 아니다**: 같은 트레이스에서 문서 응답 2,034 → 908ms, 관측 LCP 2,357 → 1,172ms, 시뮬 FCP 1,402 → 1,095ms, 메인스레드 작업 0.8 → 0.7s(Script Evaluation 377 → 271ms)로 전부 좋아졌고 요청 수·전송량(45건 737KB)은 동일하다. Lantern이 관측 트레이스를 4G·4x CPU로 재계산하는 과정에서 LCP 후보 요소가 바뀐 것으로 보이며, **이 화면들에서는 시뮬 LCP가 실제 개선을 따라오지 않는다**
    - **남은 병목은 쿼리가 아니라 JS다.** 서버 쪽 기여를 분리해 재보니(5회 평균) 랜딩 0.83s / 존재하지 않는 모임 1.03s / 모임 홈 1.52s로, **화면 고유 쿼리가 더하는 몫은 약 0.7s**이고 나머지 0.83s는 레이아웃·프레임워크·네트워크 기본값이다. 반면 번들은 **JS 640KB 중 429KB가 미사용**으로 남아 있다. 시뮬 LCP를 목표선까지 내리려면 다음 레버는 쿼리 병렬화가 아니라 **번들 축소**다(Task 031 성격)
    - ✅ 최적화 후 8개 화면(모임 목록·홈·회비·공지·투표·설정·알림센터·마이페이지) 정상 렌더링 확인. 중첩 임베딩으로 바꾼 회비 요약이 값까지 맞는지 실데이터로 검증(청구 1건 30,000원 → 납부 처리 후 "100% / 수납 30,000원")
  - **## 남은 항목 (사용자 조치 필요)**
    - ⛔ **`auth_leaked_password_protection` — Pro 플랜 전용이라 활성화 불가(경고 존치).** 대시보드에서 토글을 켜고 Save하면 서버가 거부한다. 설정 화면 설명줄과 Supabase 문서(`guides/auth/password-security`) 모두 "Only available on **Pro plan** and above"로 명시한다. 이 프로젝트는 Free이므로(같은 근거로 Task 031에서 Storage 서버 변환도 포기했다) **플랜을 올리기 전까지 이 advisor 경고는 남는다 — 미해결이 아니라 플랜 제약으로 판정**한다
    - ✅ **대신 같은 Email 패널에서 Free로 가능한 두 가지를 적용했다** (advisor 항목은 아니지만 같은 화면에서 발견)
      - **`Require current password when updating` ON + 앱 코드 대응.** 기존 `ChangePasswordForm`은 `signInWithPassword`로 재인증한 뒤 `updateUser({ password })`를 부르는 구조라, **현재 비밀번호 확인이 화면에서만 걸렸다** — 세션을 쥔 사람이 콘솔에서 `updateUser({ password })`를 직접 부르면 통째로 건너뛴다. `updateUser()`에 `current_password`를 함께 보내도록 고치고 토글을 켰다. **순서가 중요하다: 코드를 먼저 배포해야 한다**(토글을 먼저 켜면 앱이 `current_password`를 보내지 않는 동안 비밀번호 변경이 전부 실패한다). 클라이언트 재인증은 남겼다 — 서버가 거부하면 일반 에러로 내려와 "현재 비밀번호가 틀렸다"는 구체적 안내를 주기 어렵기 때문
        - **REST로 우회 차단을 직접 확인**: `current_password` 없이 → `current_password_required`, 틀린 값 → `current_password_invalid`, 올바른 값 → 변경 성공. 수정 전이라면 첫 번째가 그대로 통했다
        - ⚠️ 이 토글은 **비밀번호 재설정 플로우가 있으면 그것도 깨뜨린다.** 확인 결과 `updateUser` 호출부는 `ChangePasswordForm` 한 곳뿐이고 이 앱에는 재설정 플로우 자체가 없어(`app/auth/`는 login·sign-up·callback·error 4개뿐) 영향이 없었다. CLAUDE.md가 "비밀번호 재설정/이메일 확인(`confirm/route.ts`)"이 있다고 서술하고 있어 함께 정정했다
        - 서버가 새로 내려주는 `current_password_required`/`current_password_invalid` 두 코드를 `mapAuthErrorMessage()`에 매핑했다(없으면 "일시적인 오류"라는 엉뚱한 안내가 나간다)
      - **`Minimum password length` 6 → 8** (Supabase 권장). 앱에는 클라이언트 길이 검증이 없어 전적으로 Supabase 판정에 의존하므로 코드 변경은 불필요했지만, `errors.authWeakPassword`가 4개 언어 모두 "6자 이상"으로 안내하고 있어 **틀린 안내가 나갈 뻔했다** — 8자로 수정하면서 en/ja/zh에 한국어가 그대로 있던 것도 함께 번역. 프로덕션에서 7자 가입이 `weak_password "Password should be at least 8 characters."`로 거부되고, UI에도 "8자 이상"이 뜨는 것을 확인
  - **## advisor 최종 상태**
    - performance: **woodong 관련 WARN 0건**(12건 전부 해소). 남은 항목은 전부 INFO이고 공유 프로젝트의 **다른 앱 테이블**(`departments`, `weekly_log_*`, `brands`, `org_*`)이다
    - security: **woodong 관련으로 새로 조치할 항목 0건.** 남은 woodong WARN 13건은 `authenticated`에게 의도적으로 연 RPC 표면으로, 각 함수가 내부에서 권한을 검사한다(오늘도 공지 RPC가 `42501`로 거부하는 것을 확인). `woodong_get_invite_preview`만 `anon`에 열려 있는데 이는 **비로그인 초대 미리보기(PRD 3.3)에 필요**하다. 그 외 WARN은 다른 앱 함수(`check_org_*`, `next_master_code`, `is_admin` 등)
    - ⚠️ **완료 조건의 "security advisor 경고 0건"은 문자 그대로는 달성 불가**하다 — ① SECURITY DEFINER 린트는 RPC를 의도적으로 노출하는 앱에서는 정보성 경고이고, ② `auth_leaked_password_protection`은 대시보드 토글이며, ③ 나머지는 우리 소유가 아니다. **"woodong 소유 항목 중 조치 가능한 것 0건"으로 판정**한다
  - **## 관찰(수정 안 함)**
    - ⚠️ **사전 163개 키가 en/ja/zh에서 한국어 그대로다** — 우동 도메인 UI(Phase 3~6에서 추가된 키) 대부분. `en.ts`에 `TODO(i18n): Task 018-1 new keys below are Korean placeholders` 마커가 있는 **알려진 한계**라 이번에 손대지 않았다. 1차 MVP가 한국어 우선인 것과는 별개로, 언어 전환 기능이 노출돼 있으므로 **범위 판단이 필요**하다
    - ⚠️ **삭제된 사용자의 세션이 로그인 상태로 렌더링된다** — 이전 Task의 테스트 계정을 DB에서 지웠는데도 브라우저에는 헤더가 로그인 상태로 떴다. `getClaims()`가 JWT를 로컬 검증만 하기 때문으로 토큰 만료 전까지 유지된다(JWT의 일반적 성질). 실사용에서 계정 삭제 기능이 없어 1차 MVP 영향은 없다
  - **완료 조건**: ✅ 통합 시나리오 전부 통과, ✅ 권한 분기 회귀(UI + REST) 통과, ✅ 동시 마감 회귀 통과, ✅ 3개 뷰포트 36건 통과, ✅ 에러 폴백 3종(조회 실패/서버 에러/네트워크) 실패 주입으로 검증, ✅ **프로덕션 배포 완료 + 배포 후 스모크 테스트 통과**, ⚠️ **LCP는 랜딩·모임 목록만 목표 달성 — 보호 페이지 2종과 회비 CLS는 후속 과제로 분리**, ✅ 픽스처·테스트 계정 정리 완료(로컬·프로덕션 양쪽, `woodong_*` 13개 테이블 0행, 테스트 계정 0개), ✅ DB 권한 원복 확인, ✅ 세션 토큰·쿠키 아티팩트 삭제, ✅ `npm run check-all` + `npm run build` 통과, ⚠️ security advisor는 위 판정 기준으로 통과

- **Task 034: 출시 전 운영·법무 준비 및 KPI 계측 기반 구축** ✅ - 완료
  - **범위 확대 결정**: 로드맵 완료 조건은 "처리방침·약관 관련 **결정 기록**"까지였으나, 서비스가 이미 프로덕션에 배포된 상태(https://woodong-01.vercel.app)라 문서만 `docs/`에 두고 서비스에 노출하지 않으면 PIPA 대응으로서 실효가 없다고 판단해 **초안 작성 + 서비스 반영(공개 페이지·푸터 링크·회원가입 동의)까지 진행**했다. 결정 근거는 전부 `docs/legal/LEGAL_DECISIONS.md`에 기록
  - **## 법무 (D-1 ~ D-4)**
    - **문서 본문은 `docs/`가 아니라 `lib/legal/`에 뒀다**(`privacy-policy.ts`, `terms-of-service.ts`). 앱이 렌더링하는 원본과 문서용 사본을 따로 두면 반드시 어긋나기 때문이다. `docs/legal/LEGAL_DECISIONS.md`에는 "왜 그렇게 정했는가"만 남겼다
    - ✅ **개인정보 처리방침 초안(12개 조)** — 항목·목적·보유기간을 전부 코드베이스의 실제 동작과 대조해 썼다. 그 과정에서 **초안이 사실과 어긋날 뻔한 지점 3개**를 잡았다:
      - **제4조 (모임 내 공개 범위)** — 이메일·전화번호는 `woodong_list_group_members()` RPC가 총무·본인에게만 채워 주지만, **회비 청구·납부 이력은 `woodong_dues`/`woodong_payments`의 SELECT 정책이 `woodong_is_group_member(group_id)`라 같은 모임 멤버 전원에게 공개**된다. "누가 얼마를 아직 안 냈는지"가 모임에 공개되는 건 회비 투명성을 위한 의도된 설계지만, 고지 없이 두면 처리방침의 정확성 요건을 어긴다. 노출 범위를 표로 명시했다
      - **보유기간에서 "회원 탈퇴 시까지"를 쓸 뻔했다** — 이 앱에는 **계정 삭제 기능이 없다**. 사실대로 "현재 스스로 계정을 삭제하는 기능이 없으며 연락처로 요청하면 처리한다"고 적었다
      - **"모임 탈퇴는 각 모임 화면에서 직접 할 수 있다"도 틀렸다** — `woodong_group_members`의 UPDATE 정책이 총무 전용이라 **일반회원의 자발적 탈퇴는 불가능**하다(`lib/woodong/actions/members.ts` 주석에 이미 적혀 있던 사실). 총무만 나갈 수 있고 일반회원은 총무에게 요청해야 한다고 정정
    - ✅ **이용약관 초안(12개 조)** — PRD 9장이 결정을 요구한 금융 고지를 **제7조(회비에 관한 특칙)**로 별도 조항화. ① PG 미제공·금융정보 미수집, ② 자금 예치/이체 중개를 하지 않으므로 전자금융거래 당사자가 아님, ③ **납부 상태는 총무의 수동 입력값이라 실제 입금과 다를 수 있고 책임은 입력한 총무에게 있음**, ④ 미납·과납·오기재 면책. ③은 PRD 9장 "정산 데이터 정확성" 리스크를 약관 언어로 옮긴 것
    - ✅ **회원가입 필수 동의 체크박스 추가** — 여기서 놓치기 쉬운 결함을 하나 잡았다. **회원가입 카드에는 이메일 폼과 소셜 로그인 버튼이 같이 있고 둘 다 계정을 만든다.** 체크박스가 이메일 폼만 막으면 **소셜 경로로 들어온 사용자는 아무것도 동의하지 않은 채 가입한다.** `SocialAuthButtons`에 `disabled` prop을 새로 열어 양쪽을 함께 잠갔다(로그인 화면은 동의 대상이 아니라 prop을 넘기지 않는다)
    - ⚠️ **`Label` 프리미티브의 기본값이 `flex items-center gap-2`였다** — 동의 문구는 "텍스트 + 링크 + 텍스트 + 링크 + 텍스트" 5조각이라, 조각마다 0.5rem이 벌어져 **"개인정보 처리방침 에 동의합니다"처럼 렌더링**되고 좁은 화면에서 줄바꿈도 안 됐다. 브라우저 스크린샷으로 발견해 `block`으로 되돌렸다. DOM의 `textContent`는 처음부터 정상이었으므로 **텍스트만 확인했다면 놓쳤을 결함**이다
    - 동의 문구 안의 링크는 `stopPropagation` + `target="_blank"`이다. 라벨 안의 링크라 전파를 끊지 않으면 **약관을 읽으려고 눌렀을 뿐인데 동의 체크가 켜진다.** 새 탭인 이유는 가입 폼이 이메일·비밀번호를 React state로만 들고 있어 같은 탭에서 이동했다 돌아오면 입력값이 날아가기 때문
    - **D-3. 법적 문서는 한국어 정본 1개만 둔다** — 언어 전환 기능이 노출돼 있지만 법적 효력을 갖는 문장을 4벌로 번역하면 오역이 곧 법적 리스크가 되고, 개정 시 4벌 동기화도 필요하다(이 저장소는 이미 사전 163개 키가 en/ja/zh에서 한국어로 방치돼 있다 — Task 033 관찰). 4개 언어로 번역한 건 페이지 제목·요약·"정본은 한국어" 안내 같은 UI 문구뿐이고, 본문을 감싼 `<article>`에 `lang="ko"`를 박아 스크린리더가 한국어 음성 엔진으로 읽게 했다(Task 031의 `<html lang>` 수정과 같은 이유)
    - **의도적으로 안 한 것**: 동의 시각·약관 버전을 DB에 저장하지 않는다. 동의 이력을 남기려면 `woodong_consents` 테이블과 약관 개정 시 재동의 플로우가 함께 필요한데, 약관 버전 관리 체계가 확정되기 전에 스키마부터 만들면 다시 갈아엎게 된다. **법률 자문에서 "동의 이력 보관 의무"가 확인되면 그때 설계**한다
  - **## KPI 계측 (`docs/ops/KPI_QUERIES.md`)**
    - **검증 방법**: 프로덕션 `woodong_*`는 Task 033에서 정리해 전부 0행이라 그대로는 검증이 불가능했고, 공유 프로젝트의 프로덕션 테이블에 픽스처를 넣고 싶지도 않았다. `woodong_kpi_sandbox` 스키마에 `CREATE TABLE ... (LIKE public.woodong_* INCLUDING DEFAULTS INCLUDING CONSTRAINTS)`로 동일 구조 사본을 만들고 `search_path`만 돌려 **쿼리 문자열을 한 글자도 고치지 않고** 검증했다. `user_id`에는 실재하는 `auth.users.id`를 썼기 때문에(읽기만) K1의 `join auth.users`도 프로덕션과 같은 조인으로 검증됐다. 검증 후 `DROP SCHEMA ... CASCADE`, 프로덕션 13개 테이블 0행 유지와 `auth.users` 69행 불변을 확인
    - ⚠️ **WAG는 정의대로는 "이번 주"밖에 낼 수 없다** — **로그인 이벤트 로그가 없다.** `auth.audit_log_entries`는 **0행**(호스팅 GoTrue가 채우지 않는다), `auth.sessions`는 활성 세션만 남고, `auth.users.last_sign_in_at`은 **가장 최근 1건뿐**이다. 마지막 로그인이 7일 안이면 7일 내 로그인이 맞으므로 이번 주 값은 정확하지만, 3주 전 주차는 복원할 수 없다. 그래서 ① 정의 그대로의 K1-a(이번 주, 매주 실행해 기록 필요)와 ② 활동 기반 시계열 대체 지표 K1-b를 나눠 정의하고, **둘을 섞어 추세를 논하지 말 것**과 목표(20개) 판정은 K1-a로 한다는 것을 명시했다
    - ✅ **쿼리형 4종 전부 기대값과 일치**: K1-a WAG `2`, K1-b 주차별 `08-03:1 / 08-10:1 / 08-17:2 / 08-24:2`(주 경계까지 손계산과 일치), K2 알림 `발송 10 / 열람 6 / 클릭 4 → 40.0%·60.0%`(`failed`·`pending` 2건이 분모에서 빠지는 것까지), K3 투표 `2/3·1/2·0/2`(**`status='left'` 멤버가 분모에서 빠지는 것 확인** — 행은 3개인데 `eligible_members` 2), K4 전환율 `분모 2 / 전환 1 → 50.0%`
    - **K4의 핵심은 `where g.created_at <= now() - interval '7 days'`다** — 어제 만든 모임을 분모에 넣으면 "아직 7일이 안 지난 것"이 미전환으로 집계돼 전환율이 구조적으로 낮게 나온다. 2일 전 생성한 G3가 분모에서 빠지는 것을 픽스처로 확인했다
    - ✅ **설문형 2종 절차 정의**: K5(납부율 개선폭)는 도입 전 자체 신고를 설문 2문항으로 받고 도입 후는 쿼리로 산출(쿼리도 검증 완료 — 부분 납부 픽스처에서 인원 기준 33.3% / 금액 기준 50.0%로 갈리는 것 확인), K6(정산 소요시간)은 PRD 정의상 설문 전용이라 도입 전/후 2시점 3문항과 **중앙값** 집계(표본이 작다)를 설계. K6 문항 1이 회상 응답이라 과대 추정되기 쉽다는 한계도 함께 적었다
    - ⚠️ **PRD 8장 목표치 3개가 어느 계산식인지 모호하다** — K2 "40%"가 클릭률인지 열람률인지(40.0 vs 60.0), K3 "60%"가 투표 단위 단순평균인지 전체 합산인지(38.9 vs 42.9), K5가 인원 기준인지 금액 기준인지(33.3 vs 50.0). 픽스처에서 **실제로 값이 갈리는 것을 확인**했으므로 판정 기준 확정이 필요하다(문서의 "미결 사항"에 정리)
    - ⚠️ 익명 투표도 `woodong_vote_responses.user_id`를 저장하므로(RLS와 `woodong_get_vote_results()`가 노출을 막을 뿐) 참여율 집계가 가능하지만, **집계 결과에서 개인을 역추적할 수 있어 이 쿼리 결과를 모임에 공유하면 안 된다**는 경고를 문서에 달았다
    - ⚠️ 모든 KPI 쿼리는 `service_role`로만 실행 가능하다(`woodong_vote_responses`는 본인 행만 SELECT, `auth.users`는 미노출)
  - **## 운영 (`docs/ops/FREE_PLAN_MONITORING.md`)**
    - 착수 시점 실측: **DB 18.2 MB / 500 MB(3.6%)**, `max_connections` 60 중 12 사용. 스키마별로는 `public` 4.2 MB(45개 테이블) / `auth` 1.5 MB / `realtime` 336 kB / `storage` 320 kB. `woodong_*`가 전부 0행이므로 **18.2 MB는 사실상 다른 앱 + Postgres 오버헤드**다
    - 주간(용량·우동 비중·일시정지 방지·K1-a 기록) / 월간(advisor·Storage·MAU·커넥션) / 분기(유료 전환 판단) 점검 항목과 실행 쿼리, 경보 임계값 5종(용량 80%/90%, `idle in transaction` 5개, 미접속 5일, Storage 80%)을 표로 확정. 주간 기록 표에 착수 시점 실측을 첫 행으로 넣었다
    - **이관이 생각보다 비싸다는 점을 기록**: `woodong_*`만 옮기면 되도록 설계했지만 ① `profiles`는 다른 앱 소유 공유 테이블이라 우동 전용 테이블을 새로 만들어야 하고, ② **`auth.users`가 프로젝트에 묶여 있어 그대로 넘어가지 않는다.** 실질적으로 **이관보다 Pro 전환이 거의 항상 싸다**
  - **## 관찰(수정 안 함)**
    - ⚠️ **영어 로케일 375px에서 헤더가 17px 가로 오버플로한다**(`scrollWidth` 392 vs 375). "Sign in"/"Sign up"이 "로그인"/"회원가입"보다 넓어서 생기는 기존 i18n 레이아웃 결함으로, **Task 034에서 건드리지 않은 `/tech-stack`에서도 동일하게 재현**되는 것을 확인했다(한국어는 372로 정상). 이번 작업이 만든 것이 아니라 범위 밖으로 두었다
  - **완료 조건**: ✅ 처리방침·약관 초안 작성 + 결정 4건(D-1~D-4) 기록, ✅ **초안을 서비스에 반영**(`/privacy`·`/terms` 공개 페이지, proxy allow-list 등록, 푸터 별도 행 링크, 회원가입 필수 동의로 이메일·소셜 양쪽 게이팅), ✅ KPI 쿼리형 4종 + K5 후행 쿼리까지 5종을 샌드박스 픽스처로 기대값 대조 검증, ✅ 설문형 2종 문항·시점·집계 방식 정의, ✅ Free 플랜 모니터링 체크리스트 확정(실측 포함), ✅ `npm run check-all` + `npm run build` 통과, ✅ 프로덕션 데이터 무변경 확인(`woodong_*` 13개 테이블 0행, `auth.users` 69행), ⚠️ **법률 자문 검토 대기 6건은 미해소**(전자금융거래법 적용 여부, 처리자 표시 의무, 동의 이력 보관 의무, 만 14세 미만 처리, 국외 이전 동의 방식, 탈퇴 기능 부재의 적법성), ⚠️ PRD 8장 목표치 판정 기준 3건 미확정, ⚠️ 도메인·상표는 로드맵 명시대로 개발과 무관한 별도 트랙

---

### Phase 8: 2차 확장 (MVP 이후 — PRD 7.2)

> **1차 MVP 출시 이후 착수. 본 Phase의 Task는 1차 4주 일정에 포함하지 않는다.**

- **Task 035: 회비 지출 등록 구현 (3.4-b)** ✅ - 완료
  - **## 사전 확인 — 이미 준비돼 있던 것**
    - `woodong-receipts` **비공개 버킷과 Storage 정책 4종이 Task 004에서 이미 만들어져 있었다**(조회는 멤버, 쓰기는 총무). 정책이 경로의 첫 세그먼트를 모임 id로 보고 판정하므로(`woodong_is_group_admin((storage.foldername(name))[1]::uuid)`), 기존 `buildGroupObjectPath()`가 만드는 `{groupId}/{uuid}-{파일명}` 형식이 그대로 맞았다. `WOODONG_RECEIPTS_BUCKET` 상수도 이미 있었다. 이 Task에서 새로 만든 것은 **테이블뿐**이다
  - **## 마이그레이션 (`create_woodong_expenses`)**
    - PRD 5.8의 8개 컬럼 + 코드베이스 관례인 `created_by`/`created_at`. 인덱스 4개(`group_id`, `paid_by`, `created_by`, `(group_id, spent_at desc)`), `amount > 0` CHECK, RLS 4정책
    - **`category`를 자유 값이 아니라 CHECK로 고정했다.** PRD 5.8은 "회식비/행사비/기타 등"으로 예시만 들었고 `woodong_groups.type`은 자유 값이지만, **Task 036의 정산 리포트가 카테고리별로 집계**한다. 자유 문자열이면 "회식"/"회식비"/"식대"가 서로 다른 카테고리로 갈라져 집계가 깨진다. `meal/event/supplies/venue/transport/other` 6종으로 고정하고, 값을 늘리려면 CHECK·`EXPENSE_CATEGORIES`·4개 언어 사전을 함께 고쳐야 한다고 주석에 박아 뒀다
    - **조회는 멤버 전원, 쓰기만 총무**로 열었다. 지출을 총무만 볼 수 있게 하면 "회비 사용 내역을 투명하게 기록한다"는 3.4-b의 목적 자체가 사라진다. 회비 수입(`woodong_dues`/`woodong_payments`)과 같은 가시성 규칙이다
    - `paid_by`는 `ON DELETE SET NULL`이다. 담당자가 탈퇴해도 지출 기록은 정산 근거로 남아야 한다
    - `database.types.ts` 재생성 결과가 **+47줄뿐**이라 다른 앱 테이블 타입이 흔들리지 않은 것을 확인했다
  - **## 잔액 (PRD 3.4-b, "잔액 표기 활성화")**
    - **수입을 청구액이 아니라 실제 수납액으로 잡았다.** `getDuesOverview()`의 `paidAmounts`(청구 id → `woodong_payments` 합계)를 더한다. 청구액을 쓰면 **아직 아무도 내지 않은 회비까지 통장에 있는 돈으로 계산되어** 잔액이 부풀려진다. 화면에도 "총 수입은 실제로 납부 확인된 금액만 더한 값이에요(청구액이 아닙니다)"를 각주로 달았다
    - 지출이 수입을 넘으면 **음수를 그대로 보여준다**(0으로 깎지 않고 `text-destructive`). 잔액이 마이너스인 것은 총무가 가장 먼저 알아야 할 사실이다
    - 카테고리별 집계 칩의 정렬은 금액순이 아니라 `EXPENSE_CATEGORIES` 순이다. 금액순이면 지출을 하나 등록할 때마다 범례 순서가 뒤바뀌어 읽기 어렵다
  - **## 발견해서 함께 고친 것**
    - ⚠️ **모임 홈에도 "수입만 집계" 안내 카드가 남아 있었다**(`app/protected/groups/[groupId]/page.tsx`). 지출이 생긴 순간 이 문장은 거짓이 된다. 홈에 잔액 카드를 복제하는 대신 **안내만 제거**했다 — Task 033에서 LCP를 최적화한 화면이라 조회를 하나 더 붙이고 싶지 않았고, 로드맵이 요구한 범위도 "회비 대시보드의 잔액"이다. 죽은 사전 키 `dues.incomeOnlyNotice`도 types + 4개 언어에서 함께 지웠다(방치하면 "번역 안 된 키 163개"가 늘어날 뿐이다)
    - ⚠️ **담당자 이름을 지출 조회에서 조인할 수 없다.** 이름은 공유 `profiles`에 있는데 그 테이블의 SELECT 정책이 **본인 행 또는 앱 관리자**다. 회비 화면이 이미 `woodong_list_group_members()` 결과를 들고 있으므로 `ExpenseRow`에서 `paidByName`을 빼고 화면에서 `paid_by`를 그 목록으로 해석하도록 바꿨다
    - **서명 URL을 행마다 발급하면 왕복 N회**가 된다. `getSignedStorageUrls()`(복수형 `createSignedUrls`)를 새로 만들어 1회로 묶었고, 영수증이 하나도 없으면 요청 자체를 생략한다. 개별 실패는 그 행만 `null`이 되어 목록 전체가 죽지 않는다
    - **영수증 경로가 이 모임 것인지 서버에서 한 번 더 검사한다**(`isOwnGroupReceiptPath`). Storage RLS는 경로 첫 세그먼트로 권한을 판정하므로, 다른 모임 경로의 오브젝트를 이 모임 지출 행에 매달면 **DB 행은 이 모임 소유인데 파일은 저쪽 소유**가 되어 조회 권한이 어긋난다
    - **영수증 교체·삭제 시 이전 오브젝트를 지운다.** 남기면 아무 행도 가리키지 않는 파일이 비공개 버킷에 쌓여 Free 플랜 용량을 먹는다(`docs/ops/FREE_PLAN_MONITORING.md`). 단 삭제 실패는 성공으로 처리한다 — 고아 파일 하나 때문에 사용자가 고친 내용을 되돌리는 편이 더 나쁘다
    - **RLS는 권한 없는 UPDATE/DELETE를 에러가 아니라 0행으로 돌려준다.** `count === 0`을 걸러 내지 않으면 일반회원에게 "저장했습니다" 토스트가 뜬다. 두 액션 모두 명시적으로 처리했다
  - **## E2E 검증 (Playwright MCP, 프로덕션 빌드)**
    - 테스트 계정 2개를 UI 회원가입으로 만들었다(Task 034에서 넣은 **약관 동의 게이팅도 이 과정에서 함께 검증**됐다)
    - ✅ **필수 항목 유효성**(PRD AC): 빈 폼 제출 → 다이얼로그가 닫히지 않고 "지출 카테고리를 선택해주세요" / "지출 금액은 1원 이상이어야 합니다" 두 개가 한국어로 노출
    - ✅ **등록 + 영수증**: 회식비 18,000원 등록 → 잔액이 `30,000 − 18,000 = 12,000원`으로 정확히 계산. 영수증 서명 URL을 실제로 `fetch`해 **200 / image/jpeg / 762바이트 / token 쿼리 있음**까지 확인(클라이언트 리사이즈가 PNG→JPEG로 변환한 것도 그대로 드러났다). 저장된 경로는 `{groupId}/{uuid}-receipt-test.jpg`로 Storage 정책이 기대하는 형식
    - ✅ **수정 + 영수증 교체**: 45,000원으로 바꾸니 잔액 `-15,000원`이 `text-destructive`로 표시. **이전 오브젝트가 사라지고 새 것만 남아 고아 파일 0건** 확인
    - ✅ **삭제**: 확인 다이얼로그 → 삭제 후 지출 0행, **버킷 오브젝트도 0건**, 잔액이 30,000원으로 복귀
    - ✅ **권한 분기 (RLS 직접 검증)**: 일반회원 JWT로 위장(`set local role authenticated` + `request.jwt.claims`)해 4방향을 확인 — SELECT 1행(투명성 의도대로 **열림**), UPDATE **0행**, DELETE **0행**, INSERT **42501 거부**
    - ✅ **권한 분기 (UI 이중 방어)**: 일반회원 화면에서 잔액·지출 항목·영수증 링크는 보이고 등록/수정/삭제 버튼은 전부 없으며 "지출 등록·수정은 총무만 할 수 있어요" 안내가 노출
    - ✅ **모바일 375px**: 가로 오버플로 없음(`scrollWidth` 360)
    - ✅ **advisor**: 신규 테이블에 대한 security 경고 0건(RLS 누락·정책 부재 해당 없음), performance도 WARN 0건 — `woodong_expenses` 항목은 INFO "unused index" 3건뿐이고 이는 방금 만든 빈 테이블이라 당연하다. **FK 3개가 전부 인덱스로 덮여 있다는 뜻이기도 하다**
    - ✅ **정리**: 테스트 모임·계정 2개 삭제 후 `woodong_*` 전 테이블 0행, Storage 오브젝트 0건, `auth.users` 69명 원복 확인
  - **## 관찰(수정 안 함)**
    - ⚠️ **신규 UI 문구를 en/ja/zh에 한국어 그대로 넣었다.** 이 저장소가 Task 012부터 지켜 온 방식이고(`TODO(i18n)` 마커), 실제 번역은 Task 040에 모여 있다. 여기서만 번역하면 오히려 화면 안에서 언어가 섞인다
  - **완료 조건**: ✅ `woodong_expenses` 생성 + RLS 4정책, ✅ 지출 등록 폼(카테고리·금액·담당자·지출 일자·비고) + 필수 항목 누락 시 유효성 에러, ✅ 영수증을 비공개 버킷에 업로드하고 `receipt_object_path`만 저장(public URL 저장 없음) + 조회는 `createSignedUrl()`, ✅ 지출 목록·수정·삭제 UI, ✅ 회비 대시보드 "잔액" 표기 활성화, ✅ `npm run check-all` + `npm run build` 통과, ✅ 프로덕션 데이터 원복

- **Task 036: 정산 리포트 발행 및 다운로드 구현 (3.4-b)** ✅ - 완료
  - **## 결정 사항 (로드맵이 요구한 "결정 필요" 2건)**
    - **D-1. 검토 단계(초안 → 발행)를 도입한다** (PRD 9장 "정산 데이터 정확성"). 수입·지출이 전부 총무의 수동 입력이라 금액 오류 확률이 실재하는데, **발행은 전 멤버 알림 팬아웃을 동반해 되돌릴 수 없다.** 초안이 없으면 오타 하나에 삭제 → 재발행이 되고 멤버는 같은 정산 알림을 두 번 받는다. `woodong_settlements.status`(`draft`/`published`)로 구현했고, 초안은 총무만 조회·재계산·수정할 수 있다
    - **D-2. PDF는 라이브러리 없이 브라우저 인쇄로 만든다.** jsPDF류는 한글을 찍으려면 폰트를 임베드해야 하는데(서브셋해도 수백 KB~1MB), Task 033 후속에서 **"JS 640KB 중 429KB 미사용"이 남은 LCP 병목**으로 기록된 상태라 번들을 더 키울 이유가 없었다. 브라우저 인쇄는 한글 폰트를 OS에서 가져오므로 의존성이 0이고, PRD AC도 "웹 뷰 **또는** PDF로 다운로드"다. 실제로 A4 PDF를 뽑아 한글·레이아웃까지 확인했다(아래 E2E)
  - **## 마이그레이션 (`create_woodong_settlements`, `create_woodong_settlement_functions`)**
    - PRD 5.9의 두 테이블 + 이 저장소 관례인 `created_by`/`created_at`/`updated_at`. 인덱스 6개, RLS 7정책, 트리거 2개
    - **PRD 5.9에 없는 컬럼 3개를 추가했고, 각각 이유가 있다**
      - `items.group_id` — RLS가 모임을 판정하려면 필요하다. settlements를 매번 조인해 판정하면 정책 술어가 서브쿼리가 된다(`woodong_payments.group_id`와 같은 비정규화)
      - `items.entry_count` — 이 항목으로 합산된 원본 레코드 수. 리포트에 "회식비 30,000원 · 2건"처럼 근거의 두께를 함께 보여 준다. "2건"을 문자열로 저장하면 i18n이 깨지므로 숫자로 둔다
      - `items.sort_order` — 표시 순서를 스냅샷에 박는다. 금액순이면 회비를 한 건 확인할 때마다 표의 순서가 뒤바뀐다. 생성 함수가 **수입=회비 기한순 → 지출=`EXPENSE_CATEGORIES` 정의순**으로 한 번 정한다
    - ⚠️ **`items.category`에는 일부러 CHECK 제약을 걸지 않았다.** 이 테이블은 스냅샷이다 — 나중에 카테고리를 개편하면 과거 리포트에는 지금 존재하지 않는 값이 남아 있어야 정상이고, 그때 CHECK가 있으면 마이그레이션이 과거 데이터를 고치도록 강요한다(= 스냅샷 훼손). 값은 사용자 입력이 아니라 `due_type`/`woodong_expenses.category`(둘 다 CHECK가 걸려 있다)에서 **복사**되므로 오타가 들어올 경로 자체가 없다. 대신 화면(`settlementCategoryLabel`)이 사전에 없는 값을 원문 그대로 폴백한다
    - **발행분 불변성은 RLS가 아니라 트리거로 막는다.** RLS의 `USING`/`WITH CHECK`로는 "OLD.status가 published면 거부"를 표현할 수 없다. `woodong_settlements_prevent_published_change`(BEFORE UPDATE)가 담당하고, 이름이 `..._set_updated_at`보다 사전순으로 앞이라 먼저 실행된다
    - `published_by`/`created_by`는 `ON DELETE SET NULL`이다. 총무가 탈퇴해도 리포트는 정산 근거로 남아야 한다(Task 035의 `paid_by`와 같은 규칙)
    - `database.types.ts` 재생성 결과가 **+197줄 / 삭제 0줄**이라 다른 앱 테이블 타입이 흔들리지 않은 것을 확인했다
  - **## 집계 함수 3종 — DEFINER는 발행 하나뿐**
    - `woodong_build_settlement_items()` / `woodong_create_settlement_draft()` / `woodong_recalculate_settlement_draft()`는 **전부 `security invoker`**다. 이들이 하는 일(항목 삭제·삽입, 헤더 갱신)은 이미 RLS가 총무에게만 허용하므로 권한 상승이 필요 없고, DEFINER로 만들면 **RLS를 우회하는 경로가 하나 더 생길 뿐**이다. 일반회원이 REST로 직접 불러도 42501이나 0행으로 끝난다(E2E에서 확인)
    - `woodong_publish_settlement()`만 `SECURITY DEFINER`다. `woodong_notifications`에는 INSERT 정책이 아예 없어서(본인 행 SELECT/UPDATE만) 어떤 클라이언트도 남의 알림을 만들 수 없기 때문이다 — `woodong_create_announcement`와 같은 이유·같은 패턴이고, 총무 판정을 함수가 직접 한다
    - 생성과 재계산이 **정확히 같은 집계**를 써야 하므로 항목 생성 SQL은 `woodong_build_settlement_items()` 한 곳에만 둔다. 두 벌로 복사하면 "만들 때와 다시 계산할 때 숫자가 다른" 버그가 언젠가 생긴다
    - **총계는 원본이 아니라 방금 만든 스냅샷 항목에서 다시 더한다.** 원본을 한 번 더 집계하면 항목 합 ≠ 총계가 될 수 있고, 리포트에서는 그게 곧 신뢰 상실이다
  - **## 집계 규칙**
    - **수입은 청구액이 아니라 실제 수납액**(`woodong_payments`)이다. 청구액을 쓰면 아직 아무도 내지 않은 회비까지 통장에 있는 돈으로 잡힌다(Task 035의 잔액 카드와 같은 기준, 화면에도 같은 각주를 단다)
    - **수입은 회비 항목(사이클) 하나가 한 줄, 지출은 카테고리 하나가 한 줄**이다. 비대칭이지만 이유가 있다 — 수입에는 `woodong_due_cycles`라는 중간 묶음이 이미 있고(멤버×회차로 펼치면 50명×12회차 = 600줄), 지출에는 그런 묶음이 없어 카테고리가 그 역할을 한다. **Task 035가 `category`를 자유 값이 아니라 CHECK로 고정한 이유가 바로 이 집계**다
    - 기간 판정 기준: 지출은 `spent_at`(date)이라 그대로 비교하고, 수입은 `paid_at`(timestamptz)을 **`at time zone 'UTC'`로 되돌려** 날짜를 비교한다. 애플리케이션이 `<input type="date">` 값을 UTC 자정으로 저장하므로(`dateOnlyToIso`, Task 023), 여기서 로컬 타임존을 쓰면 총무가 고른 날짜와 정산 기간이 하루씩 어긋난다
  - **## 라우팅 — 상단 탭을 6개로 늘리지 않았다**
    - `/protected/groups/[groupId]/dues/settlements`(목록)와 `.../[settlementId]`(상세)로 **회비 아래**에 뒀다. 정산은 회비 수입과 지출의 결과물이고, `GroupNavTabs`가 `pathname.startsWith(".../dues")`로 판정하므로 이 화면에서도 "회비" 탭이 그대로 켜진다. 진입점은 회비 대시보드 하단 링크(멤버에게도 보인다 — 발행분 조회는 총무 전용이 아니다)
    - 알림센터의 `resolveHref()`에 `settlement` 분기를 추가했다(`related_type`이 이미 PRD 5.13에 정의돼 있었는데 갈 곳이 없었다)
  - **## 인쇄 CSS (`app/globals.css`)**
    - 모든 규칙을 **`body:has(.print-report)`로 감쌌다.** 정산 상세만 그 클래스를 붙이므로 다른 화면에서 Ctrl+P를 눌러도 이 규칙이 개입하지 않는다
    - 라이트/다크 어느 테마로 보고 있든 인쇄물은 흰 종이 기준이라, `:root`/`.dark`의 **HSL 토큰만 인쇄용으로 갈아끼운다**. 그러면 화면에서 쓰던 Tailwind 클래스가 그대로 인쇄 색으로 바뀐다. 단 잔액 음수의 `--destructive`는 무채색으로 죽이지 않는다(흑백 프린터에서도 구분돼야 한다)
  - **## E2E 검증 (Playwright MCP, 프로덕션 빌드)**
    - 테스트 계정 2개(총무/일반회원)를 UI 회원가입으로 만들고, 모임·초대 링크·회비 항목 2종(정기/번개)·납부 1건을 UI로 생성했다. **기간 경계를 정확히 찌르는 픽스처**(납부 3건·지출 4건)는 SQL로 심었다 — 경계일 하루 차이가 이번 Task의 핵심 로직이라 날짜를 손으로 고르는 것보다 확실하다
    - ✅ **기간 필터링이 경계까지 정확하다**: 2026-08-01~08-31 기준 → 수입 40,000원(**08-31 납부 포함**, 09-02·07-31 납부 제외), 지출 35,000원(**08-01·08-31 지출 포함**, 07-31 지출 제외), 잔액 5,000원. 항목도 정기 30,000(1건)/번개 10,000(1건), 회식비 30,000(2건)/교통비 5,000(1건)으로 정확
    - ✅ **재계산**: 기간을 2026-07-01~08-31로 넓히니 50,000 / 85,000 / **-35,000원**으로 다시 계산되고, 07-31 대관료 50,000원이 카테고리 정의순(회식비 → 대관료 → 교통비) 자리에 들어왔다. 음수 잔액은 `text-destructive`로 표시(0으로 깎지 않는다). 8월로 되돌리니 원래 값으로 복귀
    - ✅ **유효성**: 종료일 < 시작일 → 다이얼로그가 닫히지 않고 "종료일은 시작일보다 빠를 수 없어요"가 종료일 칸 아래 한국어로 노출
    - ✅ **발행 + 팬아웃**: 확인 다이얼로그 → 발행 후 상태 배지가 "발행됨"으로 바뀌고 재계산·발행 버튼이 사라진다. 알림은 **정확히 1건**(멤버에게만, 발행자 본인 제외), `settlement_published`/`settlement`/`in_app`/`sent`에 `related_id`가 리포트를 가리킨다. 멤버가 알림센터에서 클릭하면 그 리포트 상세로 이동
    - ✅ **발행분 불변성 (트리거 직접 검증)**: **postgres 슈퍼유저로도** 막힌다 — 직접 UPDATE → `23514 이미 발행된 정산 리포트는 수정할 수 없습니다`, 재계산 RPC → `23514 ... 다시 계산할 수 없습니다`, 총무 JWT로 재발행 → `23514 이미 발행된 정산 리포트입니다`. 금액은 40,000/35,000/5,000 그대로
    - ✅ **권한 분기 (RLS 직접 검증)**: 일반회원 JWT로 위장(`set local role authenticated` + `request.jwt.claims`) — **초안**은 헤더 0행/항목 0행(총무는 1행/4행), **발행 후**에는 1행/4행으로 열린다(투명성 의도대로). 초안 생성 → `42501 new row violates row-level security policy`, UPDATE **0행**, DELETE **0행**, 항목 DELETE **0행**. 발행 RPC → `42501 정산 리포트는 총무만 발행할 수 있습니다`
    - ✅ **권한 분기 (UI 이중 방어)**: 일반회원 화면에는 리포트 본문과 "PDF로 저장"만 있고 발행·재계산·삭제 버튼과 "새 정산 리포트"가 전부 없으며, 초안 안내 문구도 노출되지 않고 "정산 리포트 생성·발행은 총무만 할 수 있어요"가 표시
    - ✅ **인쇄/PDF**: `emulateMedia({media:'print'})`로 계산된 스타일을 확인 — 헤더·탭·사이트 푸터 `visibility:hidden`, `.print-hidden` `display:none`, 리포트만 `visible` + `position:absolute`, 본문 배경 `rgb(255,255,255)`·제목 `rgb(0,0,0)`. 실제로 **A4 PDF를 생성해 눈으로 확인**했고 한글·금액·항목표·각주가 전부 정상 렌더(폰트 임베딩 없이 OS 폰트 사용)
    - ✅ **빈 기간**: 수입도 지출도 없는 기간(2026-01)으로 만들면 0/0/0과 "이 기간에 집계된 수입·지출이 없어요."
    - ✅ **삭제 + 캐스케이드**: 초안·발행분 모두 삭제 후 `woodong_settlements` 0행, **`woodong_settlement_items`도 0행**(FK cascade), 발송된 알림 1건은 **그대로 남았다** — 알림 이력을 소급해 지우면 KPI "알림 클릭률"의 분모가 흔들린다
    - ✅ **모바일 375px**: 목록·상세 모두 가로 오버플로 없음(`scrollWidth` 360)
    - ✅ **advisor**: security **ERROR 0건**. 신규 WARN은 `woodong_publish_settlement`의 `authenticated` 실행 권한 1건뿐이고 Task 025/028/029/030과 동일한 의도된 DEFINER 패턴이다. performance는 **WARN 0건**이며 신규 테이블 관련은 INFO "unused index" 4건뿐 — **FK 전부가 인덱스로 덮여 있다는 뜻**이기도 하다
    - ✅ **정리**: 테스트 모임·계정 2개 삭제 후 `woodong_*` 15개 테이블 전량 0행, `auth.users` 69명 원복 확인. 서버 로그 에러 0건, 브라우저 콘솔은 기존 autocomplete 힌트(VERBOSE)뿐
  - **## 발견해서 함께 고친 것**
    - ⚠️ **새로 만든 함수 5개가 전부 `anon`에게 열려 있었다.** Postgres는 새 함수에 **PUBLIC EXECUTE**를 기본으로 주고 `anon`은 PUBLIC을 상속하므로, 마이그레이션에 써 둔 `revoke ... from anon`만으로는 아무 효과가 없었다(advisor가 그대로 잡아냈다). `revoke ... from public, anon`으로 고쳤고, 트리거 전용 함수는 `authenticated`까지 회수했다(트리거의 EXECUTE는 CREATE TRIGGER 시점에만 검사되므로 동작에 영향이 없다 — `woodong_set_updated_at`이 이미 그 상태였다). **최종 ACL이 `woodong_create_announcement`와 정확히 같아진 것까지 대조 확인**했다
  - **## 관찰(수정 안 함)**
    - ⚠️ **신규 UI 문구를 en/ja/zh에 한국어 그대로 넣었다**(`TODO(i18n)` 마커). Task 012부터 지켜 온 방식이고 실제 번역은 Task 040에 모여 있다 — 여기서만 번역하면 오히려 화면 안에서 언어가 섞인다
    - ⚠️ **발행 알림 문구는 수신자 각자의 언어가 아니라 "발행한 총무의 언어"로 기록된다.** 공지 알림(Task 025)·투표 알림(Task 030)과 같은 한계다. 알림 본문을 DB에 문자열로 저장하는 구조라 수신 시점 번역이 불가능하고, 고치려면 알림 스키마를 키+파라미터 형태로 바꿔야 해서 이번 범위 밖이다
    - ⚠️ **일반회원 화면에서 발행자 이름이 "이름 미확인 멤버"로 보인다.** `woodong_list_group_members()`가 이메일을 총무·본인에게만 내려주고(Task 021), 테스트 계정은 프로필 이름을 채우지 않았기 때문이다. 의도된 개인정보 분리이고 폴백 문구도 기존 규약(`unnamedMemberLabel`) 그대로다
  - **완료 조건**: ✅ `woodong_settlements`/`woodong_settlement_items` 생성 + 발행 시점 스냅샷(총 수입/총 지출/잔액 + 항목별 상세), ✅ 기간 지정 리포트 생성(초안) + 웹 뷰 + PDF 다운로드(브라우저 인쇄), ✅ 일반회원은 조회만 가능하고 수정/삭제 버튼 미노출(RLS + UI 이중 방어), ✅ 발행 시 전체 멤버에게 `settlement_published` 알림 기록(발행자 제외, 중복 0건), ✅ **결정 2건 기록(D-1 검토 단계 도입, D-2 PDF 방식)**, ✅ `npm run check-all` + `npm run build` 통과, ✅ 프로덕션 데이터 원복

- **Task 037: 실시간 배치 스케줄러(pg_cron) 전환** ✅ - 완료
  - Supabase Cron(pg_cron) 도입으로 회비 리마인드·투표 마감/집계·정산 발행 알림을 **lazy 처리에서 실시간 발송으로 전환**
  - 기존 lazy 로직과의 중복 발송 방지 전략 수립 및 전환 절차 정의
  - **## 사전 확인 — 범위 조정 1건**
    - **정산 발행 알림은 스케줄러로 옮길 것이 없었다.** `settlement_published`는 총무가 발행 버튼을 누르는 순간 `woodong_publish_settlement` 안에서 팬아웃된다(Task 036) — 애초에 lazy가 아니라 즉시 발송이다. 공지(Task 025)·투표 생성(Task 029)·수동 마감도 같다. **실제 전환 대상은 회비 리마인드(Task 028)와 투표 자동 마감(Task 030) 둘뿐**이고, 이 판단을 `docs/ops/CRON_JOBS.md`에 "왜 잡이 없나" 절로 남겼다
    - pg_cron은 이 프로젝트에 **이미 켜져 있었다**(다른 앱의 `weekly_log_reminder`, 마이그레이션 `enable_pg_cron`). 확장 활성화 작업이 필요 없었고, 잡 이름 접두어·UTC 스케줄 계산 같은 관례도 그 앱에서 그대로 가져왔다
  - **## 마이그레이션 1 (`create_woodong_batch_notification_functions`)**
    - **기존 RPC를 그대로 cron에서 부를 수 없다.** `woodong_process_due_reminders`/`woodong_close_expired_votes`는 `auth.uid()`로 **호출한 본인의 행만** 처리한다(화면을 연 사람이 곧 대상이었으니까). pg_cron에는 세션이 없어 `auth.uid()`가 null이므로 그대로 부르면 **항상 0건**이다
    - 그래서 규칙(선점 UPDATE 조건·수신 설정·중복 방지)을 담은 **core 함수를 하나 두고**, 기존 RPC는 `auth.uid()`를 넘기는 얇은 래퍼로, 배치는 `p_user_id = null`(= 전체) 진입점으로 갈랐다. `..._core(p_user_id, p_group_id, ...)` → `woodong_process_due_reminders(...)` / `woodong_run_due_reminders()`, 투표도 같은 3단 구조다. **규칙을 두 벌로 복사하면 lazy와 배치의 판단이 갈라지고, 갈라지는 순간 "한쪽은 보냈는데 다른 쪽은 아직 안 보낸 것으로 아는" 중복 발송이 생긴다**
    - ⚠️ **`in_app` 수신 설정 확인을 함수 앞머리에서 UPDATE 문장 **안으로** 옮겼다.** 원래는 "호출자 한 명"의 설정을 한 번 조회해 끄면 곧바로 return하는 구조였는데, 배치는 설정이 제각각인 여러 명을 한 번에 처리하므로 그 방식이 성립하지 않는다. 판정 결과는 동일하다 — 끈 사람은 0행이 되어 알림도, `last_reminded_at` 갱신도 일어나지 않는다(E2E에서 실측)
    - **중복 발송 방지 전략**: 두 core 모두 **선점(UPDATE)과 알림 INSERT가 한 문장**이다(회비는 `last_reminded_at`, 투표는 `status`). 동시에 두 경로가 같은 행을 노리면 뒤에 온 UPDATE가 행 잠금에서 기다렸다가 **갱신된 행으로 조건을 재평가**해(READ COMMITTED의 EvalPlanQual) 0행이 된다. 즉 **lazy와 배치를 동시에 켜 두어도 중복이 구조적으로 불가능**하고, 이것이 전환을 한 번에 해도 되는 근거이자 롤백이 안전한 근거다
    - **`*_core`와 `woodong_run_*`은 `public`/`anon`/`authenticated`에서 EXECUTE를 회수했다.** core는 `p_user_id`를 인자로 받으므로 앱 롤이 직접 부를 수 있으면 **남의 uuid를 넣어 다른 사람 이름으로 알림을 만들 수 있다**. Task 036에서 배운 대로 `from public, anon, authenticated`로 회수해야 실제로 닫힌다(`anon`은 PUBLIC을 상속한다). cron은 소유자(postgres)로 실행되므로 영향이 없다
    - **기존 lazy RPC 2개는 DROP하지 않고 남겼다.** 시그니처·반환값·에러 코드를 그대로 유지한 얇은 래퍼다 — 앱 코드는 `git revert`로 되돌릴 수 있어도 **DROP한 함수는 되돌릴 수 없다**. 롤백을 "잡 끄기 + 앱 커밋 revert"만으로 끝내기 위한 의도적 잔존이고, 함수 코멘트에 그렇게 적어 뒀다
  - **## 마이그레이션 2 (`schedule_woodong_cron_jobs`)**
    - `woodong_due_reminders` — `0 0 * * *` UTC = **매일 09:00 KST**. 주기는 회비 항목의 `reminder_interval_days`가 정하고 잡은 "그 주기가 지났는지 하루 한 번 확인"만 한다. 더 자주 돌려도 보내는 건수는 같고(주기 조건이 막는다) 밤중에 알림이 생길 뿐이다
    - `woodong_vote_closing` — `*/5 * * * *`. 1분 주기로 좁힐 수도 있지만 공유 Free 플랜에서 하루 1,440번 도는 잡을 굳이 만들지 않았다
    - 잡 이름에 `woodong_` 접두어를 붙였다(공유 프로젝트의 격리 규칙, `docs/ops/SUPABASE_SHARED_PROJECT.md`). `cron.schedule(name, ...)`은 같은 이름을 덮어쓰므로 재실행해도 중복 등록되지 않는다
  - **## 앱 전환 — 렌더 도중 쓰기를 걷어냈다**
    - lazy 호출부 5곳(회비 대시보드, 알림센터, 모임 홈, 투표 목록, 투표 상세)을 제거하고 `lib/woodong/due-reminders.ts`·`vote-closing.ts`를 삭제했다. 이 모듈들은 "이름은 조회인데 렌더 중 쓰기를 하는" 예외였고, 그 예외가 존재한 이유(스케줄러 부재)가 사라졌다
    - ⚠️ **`dues.reminderNotificationTitleSuffix`/`Body` 사전 키를 types + 4개 언어에서 지웠다.** 배치에는 사용자 로케일이 없어 호출부가 문구를 넘길 수 없고, 문구의 주인이 SQL 기본값으로 넘어갔다. 아무도 읽지 않는 키를 남기면 이후 번역 작업(Task 040)에서 "화면 어디에 나오는지 찾을 수 없는 문자열"이 된다. `votes.closeNotification*`은 **수동 마감 버튼이 계속 쓰므로 그대로 뒀다**
  - **## 발견해서 함께 고친 것**
    - ⚠️ **lazy 마감을 걷어내자 투표 화면 안에서 말이 어긋났다.** 배지는 `status`(아직 `open`)를 보고 "진행중", 본문은 `isClosed`(`closes_at` 기준)를 보고 "마감된 투표라 더 이상 참여할 수 없어요"를 동시에 표시한다. 전에는 lazy 마감이 렌더 시점에 `status`를 맞춰 줘서 이 구간이 거의 없었지만, 배치는 최대 5분 늦는다. **화면이 쓰는 마감 판정을 `isVoteClosed()` 한 곳으로 모으고** 투표 상세 배지·목록 배지·목록 진행중/마감 분류·모임 홈 "진행 중인 투표" 카드(`listOpenVotes`에 `closes_at` 조건 추가)를 전부 그것으로 바꿨다. 참여 차단은 원래부터 `closes_at` 기준이라(쿼리 계층 + `woodong_prevent_closed_vote_response` 트리거) 배치 지연이 참여 가능 여부에 영향을 준 적은 없다
  - **## E2E 검증 (Playwright MCP + SQL)**
    - 테스트 계정 2개(총무/일반회원)를 UI 회원가입으로 만들고 모임·초대 링크·회비 항목 2종·투표 1건을 UI로 생성한 뒤, 시각 조건(`created_at`, `closes_at`)만 SQL로 되돌려 배치를 돌렸다
    - ✅ **주기 전에는 아무것도 만들지 않는다**: 방금 만든 회비 항목 상태에서 `woodong_run_due_reminders()` → **0건**
    - ✅ **주기가 지나면 전체 멤버에게 만든다**: 10월 항목만 8일 전으로 되돌리니 → **2건**(총무 + 일반회원). **일반회원은 회비 화면을 한 번도 연 적이 없다** — lazy 시절에는 영원히 못 받았을 알림이고, 이 Task의 목적 그 자체다. 같은 시점의 9월 항목(주기 미도달)은 대상에서 빠졌다
    - ✅ **중복 0건**: 즉시 재실행 → **0건**
    - ✅ **수신 거부 존중**: 일반회원의 `in_app`을 끄고 주기를 다시 넘기니 → **1건**(총무만). 일반회원의 `last_reminded_at`은 **8일 전 그대로**(알리지 않았으므로 "알린 시각"을 갱신하지 않는다)
    - ✅ **lazy 경로가 실제로 사라졌다**: 마감 시각을 10분 전으로 되돌린 뒤 투표 목록·상세를 열어도 DB `status`는 `open` 그대로(전에는 이 순간 닫혔다). 화면은 배지·본문 모두 "마감"으로 일관되게 표시되고 "지금 마감" 버튼도 감춰진다
    - ✅ **실제 cron 잡이 프로덕션에서 돌았다**: 수동 실행이 0을 반환하길래 `cron.job_run_details`를 보니 **06:25:00·06:30:00 두 번 `succeeded`**였고, 06:30 실행이 그 투표를 이미 닫아 둔 것이었다. 등록·스케줄·실행·중복 방지가 한 번에 확인된 셈이다
    - ✅ **마감 팬아웃**: 수신 설정 복구 후 재마감 → 투표 1건 마감 + 결과 알림 **2건**(활성 멤버 전원, 참여 여부 무관). 재실행 → **0건**
    - ✅ **수신자 화면**: 일반회원으로 로그인해 알림센터에서 리마인드·마감 알림 2건을 확인(한국어 문구, 각각 회비 대시보드·투표 상세로 이동)
    - ✅ **advisor**: 신규 `*_core`/`woodong_run_*` 4개에 대한 security 경고 **0건**(회수가 실제로 먹혔다는 뜻 — Task 036에서 이 항목이 잡혔던 것과 대비된다). 나머지 WARN은 전부 기존 항목
    - ✅ **정리**: 테스트 모임·계정 2개 삭제 후 `woodong_*` 전 테이블 0행 확인
  - **## 관찰(수정 안 함)**
    - ⚠️ **배치가 만드는 알림은 한국어 고정이다.** 알림 제목·본문은 생성 시점에 문자열로 저장되는데 pg_cron에는 사용자 로케일이 없다. lazy 시절에는 화면의 로케일을 넘겨 en/ja/zh 사용자가 번역된 리마인드를 받았으므로 **이 부분은 전환의 대가**다. 고치려면 사용자별 로케일을 저장하거나(`woodong_profiles.locale`) 알림을 키+파라미터로 저장해 **읽는 시점에 조립**해야 한다 — 후자는 공지·투표 알림(Task 025/030)에 이미 기록된 같은 한계라 Task 040에서 함께 다룬다
    - ⚠️ **투표 결과 알림은 최대 5분 늦는다.** 참여는 그동안에도 막히므로(`closes_at` 기준 + 트리거) 영향은 "알림이 언제 오느냐"뿐이다
    - ⚠️ **`cron.job_run_details`는 처리 건수를 남기지 않는다**(`return_message`가 "1 row"). 건수는 `raise log`로 Postgres 로그에 `[woodong-cron] ... =N` 형태로 남긴다 — 집계 테이블을 하나 더 만들면 공유 Free 플랜 용량을 먹기 때문이다(`docs/ops/FREE_PLAN_MONITORING.md`)
  - **완료 조건**: ✅ `woodong_process_due_reminders_core`/`woodong_close_expired_votes_core` + 배치 진입점 2종 생성(앱 롤 EXECUTE 회수), ✅ pg_cron 잡 2종 등록(`woodong_due_reminders` 매일 09:00 KST, `woodong_vote_closing` 5분마다) + 실제 실행 성공 확인, ✅ 중복 발송 방지 전략(한 문장 선점 UPDATE) 수립·실측, ✅ 앱의 렌더 도중 쓰기(lazy 호출부 5곳 + 모듈 2개) 제거, ✅ 전환·롤백 절차와 점검 쿼리를 `docs/ops/CRON_JOBS.md`에 문서화, ✅ `npm run check-all` + `npm run build` 통과, ✅ 프로덕션 데이터 원복

- **Task 038: 웹 푸시(Web Push) 알림 연동** (v1.6 — 카카오톡 알림톡/Slack/이메일 대체) ✅ - 완료
  - ~~**선행 작업**: `channel` CHECK 제약을 `('web_push','in_app')`로 마이그레이션~~ → **Task 027에서 완료**(`update_woodong_notification_channel_check`, 두 테이블 모두 0행인 상태로 적용해 백필 불필요). 마이페이지가 `web_push` 설정을 저장하려면 이 제약이 먼저 필요해 앞당겼다
  - VAPID 키 발급, Service Worker 등록, `web-push` 라이브러리로 서버 발송 로직 구현
  - 브라우저 알림 권한 요청 UX 설계 — 사용자가 허용하면 Push 구독 정보를 `woodong_notification_preferences.destination`에 JSON으로 저장
  - iOS Safari는 홈 화면에 추가(PWA 설치)한 경우에만 웹 푸시가 동작하므로, iOS 사용자에게 "홈 화면에 추가" 온보딩 안내 UI 제공
  - **재시도/폴백 정책**(PRD 4.4): 최대 3회, 지수 백오프(1분 → 5분 → 15분), 최종 실패 시 앱 내 알림으로 폴백하고 `woodong_notifications.status`에 `pending`/`sent`/`failed`/`fallback_sent` 기록
  - 만료·무효화된 Push 구독 정리 로직 구현(웹 푸시는 발송 건당 과금이 없어 별도 비용 시뮬레이션은 불필요)
  - **## 결정 사항 — 디스패처를 어디에 둘 것인가**
    - 알림 행은 전부 Postgres RPC 안에서 만들어지는데 웹 푸시 발송은 VAPID 비공개 키를 쥔 서버 런타임이 해야 한다. 이 둘을 잇는 디스패처의 위치가 이번 Task의 갈림길이었고, **Supabase Edge Function**을 택했다(사용자 결정). 근거: 큐·스케줄·키가 전부 Supabase 안에 모이고 Vercel 배포와 무관하게 동작하며, PRD 2장이 "정기 발송은 pg_cron, Edge Function 자체에는 스케줄러가 없음"으로 이 조합을 이미 상정했다
    - **착수 전에 스파이크로 불확실성부터 걷어냈다.** `npm:web-push`가 Deno에서 도는지가 이 선택의 유일한 리스크였다 — 임시 함수를 배포해 `generateRequestDetails()`로 확인했고(Deno 2.1.4에서 `vapid t=eyJ0…` JWT 서명 + `aes128gcm` 156바이트 암호화 성공), 그 뒤에 본 구현을 시작했다. 스파이크 함수는 키 없는 410 스텁으로 덮어 뒀다(MCP에 Edge Function 삭제 도구가 없다 — 남은 정리는 `supabase functions delete woodong-push-spike`)
  - **## 마이그레이션 1 (`add_woodong_push_delivery_queue`)**
    - 발송 큐를 **별도 테이블로 만들지 않고** `woodong_notifications`를 그대로 썼다(`channel='web_push'` + `status='pending'`이 곧 대기열). PRD 4.4가 "모든 발송 시도를 이 테이블에 상태로 기록한다"고 정했기 때문이다. 재시도 부기 컬럼 3개(`attempt_count`/`next_attempt_at`/`last_error`)와 **부분 인덱스**를 추가했다 — `in_app` 행(대다수)은 인덱스에 들어가지 않는다
    - ⚠️ **Task 003의 컬럼 보호 트리거가 디스패처까지 막았다.** 그 트리거는 `read_at`/`clicked_at` 외의 변경을 **누구에게나**(postgres 포함) 거부한다. 트리거를 무르는 대신 **트랜잭션 로컬 플래그**(`app.woodong_notification_dispatch`)로 문을 열고, 그 플래그가 켜진 경로에서도 수신자·본문·유형은 여전히 못 바꾸게 했다. 플래그를 켜는 것은 DEFINER RPC 3개뿐이고 `set_config(..., true)`라 트랜잭션이 끝나면 사라진다. 클라이언트는 켤 방법이 없다 — `set_config`는 `pg_catalog`에 있어 PostgREST에 노출되지 않는다(REST로 실측: 404)
    - **"누가 어느 채널로 받는가"를 `woodong_notification_channels(user_id)` 한 곳에 모았다.** 팬아웃 지점이 5곳인데 채널 판정을 5벌로 복사하면 규칙이 갈라진다(Task 037에서 core 함수를 뽑은 것과 같은 이유). 한 사용자에 대해 0~2행을 돌려준다 — `in_app`(기본 ON) / `web_push`(기본 OFF + **구독 정보가 있어야** 대상)
  - **## 마이그레이션 2 (`route_woodong_fanouts_through_notification_channels`)**
    - 팬아웃 5곳(공지·투표 시작·투표 마감·회비 리마인드·정산 발행)을 전부 `cross join lateral woodong_notification_channels(...)`로 바꿨다. 두 채널을 켠 사람은 한 사건에 행이 **둘** 생기고, 알림센터는 `channel='in_app'`으로 걸러 읽는다(안 그러면 목록에 같은 알림이 두 번 뜬다)
    - ⚠️ **`notified_count`를 행 수가 아니라 수신자 수로 세도록 고쳤다.** 채널별로 펼치면서 `count(*)`가 되면 두 채널을 켠 사람 하나가 2로 세어져 "3명에게 보냈어요"가 "5명"이 된다. 투표 마감은 여러 투표를 한 번에 닫을 수 있어 `(수신자 × 투표)` 기준이다(후속 마이그레이션 `fix_woodong_notify_vote_close_recipient_count`에서 교정)
    - ⚠️ **회비 리마인드의 선점 UPDATE에서 수신 대상 판정이 빠졌다.** 예전에는 `in_app`을 끈 사람을 선점 단계에서 걸렀지만 이제 채널이 둘이라 "어떤 채널이든 하나라도 켜져 있으면 대상"이 맞다. 두 채널을 모두 끈 사람은 알림이 안 만들어지지만 `last_reminded_at`은 갱신된다 — 주기가 밀려 쌓이지 않게 하려는 의도된 동작이고 주석에 남겼다
  - **## 마이그레이션 3·4 (디스패처 RPC 4종 + 잡 등록)**
    - Edge Function은 큐를 직접 만지지 않고 `woodong_get_push_config` / `woodong_claim_push_batch` / `woodong_mark_push_sent` / `woodong_mark_push_failed`만 부른다. **재시도·폴백 정책이 Deno 코드가 아니라 DB에 있어야** SQL Editor에서 수동으로 돌릴 때도 규칙이 갈라지지 않는다. 4종 전부 `public/anon/authenticated`에서 EXECUTE 회수(실측: anon REST 호출 401/404)
    - 선점은 `for update skip locked` + `attempt_count++` + `next_attempt_at`을 1분 뒤로 미는 방식이다. 디스패처가 겹쳐 돌아도 같은 알림을 두 번 보내지 않고, Edge Function이 응답 없이 죽어도 1분 뒤 자동으로 재시도된다
    - **VAPID 비공개 키는 Supabase Vault에 넣었다.** Edge Function 시크릿(`supabase secrets set`)은 CLI/대시보드 수동 조작을 요구해서 배포 자동화 밖의 단계가 하나 더 생긴다. Vault는 SQL로 다룰 수 있고 저장 시 암호화된다. **키 값은 마이그레이션이 아니라 `execute_sql`로 넣었다** — 마이그레이션 본문은 `supabase_migrations` 테이블에 평문으로 남기 때문이다
    - **`sub` 클레임에 개인 이메일 대신 서비스 URL을 넣었다.** `sub`는 FCM/Apple에 그대로 전달되는 값이라 운영자 이메일을 외부 사업자에게 넘길 이유가 없다(RFC 8292는 `https:`도 허용한다)
    - **디스패치 토큰을 따로 발급했다.** `verify_jwt = true`로 두면 pg_cron이 `service_role` 키를 들고 있어야 하는데, 운영 만능키를 이 용도 하나 때문에 한 곳 더 늘리는 대신 이 엔드포인트 전용 토큰을 만들고 함수가 직접 검사한다(타이밍 세이프 비교). 유출되어도 할 수 있는 일은 "대기 중인 푸시를 지금 보내라"뿐이고 회수는 Vault 값 교체로 끝난다
  - **## 앱 (PWA 인프라를 처음부터)**
    - `public/` 디렉토리 자체가 없던 저장소라 **매니페스트·Service Worker·512px 아이콘을 새로 만들었다**. `/sw.js`는 proxy 매처에서 제외했고(브라우저가 세션과 무관하게 주기적으로 가져가는 파일이라 로그인 리다이렉트가 걸리면 등록이 깨진다), `/manifest.webmanifest`·`/pwa-icon`은 `PUBLIC_PATH_PREFIXES`에 등록했다. 셋 다 비로그인 200 확인
    - 아이콘을 `app/icon.tsx`(32px)와 별도로 만든 이유: Next.js가 그 파일들을 **해시 붙은 URL**로 서빙해서(`/icon?65f39837…`) 매니페스트처럼 URL을 문자열로 적어야 하는 곳에서 가리킬 수 없다
    - 브라우저 환경 판별(지원 여부·iOS·standalone·권한)은 `useEffect` + `setState`가 아니라 **`useSyncExternalStore`**로 읽는다. 이 저장소의 react-hooks strict 규칙이 effect 안의 setState를 막고, 렌더 중 `navigator` 접근은 순수성 규칙에 걸린다
    - 웹 푸시 토글은 다른 채널과 경로가 다르다 — **켜는 것과 목적지를 확보하는 것이 같은 동작**이라 권한 요청 → 구독 → 서버 저장이 한 묶음이고, 서버 저장이 실패하면 브라우저 구독도 되돌린다(안 그러면 브라우저는 구독 중인데 서버는 모르는 상태가 된다)
    - 켤 수 없는 환경에서는 스위치를 잠그되 **끄는 것은 허용한다** — 나중에 브라우저에서 알림을 차단한 사용자가 켜진 상태로 갇히면 안 된다
  - **## E2E 검증 (Playwright MCP + SQL + 실제 FCM)**
    - ✅ **실제 푸시가 브라우저에 도착했다.** 테스트 계정으로 마이페이지에서 웹 푸시를 켜자 Chromium이 **진짜 FCM endpoint**로 구독을 발급했고(`fcm.googleapis.com/fcm/send/f3UrM3MGU2U:…`, 365바이트 JSON 저장), 총무가 공지를 올린 뒤 디스패처를 돌리니 `{"claimed":1,"sent":1}` → **Service Worker의 `getNotifications()`에 제목·본문·`tag`(알림 id)·딥링크 URL이 그대로 들어 있었다**. DB→Edge Function→FCM→브라우저→SW 전 구간 실측
    - ✅ **채널 팬아웃**: 공지 1건에 대해 멤버에게 `in_app`(sent) + `web_push`(pending) **2행**, 작성자에게는 0행. 알림센터에는 **1건만** 표시되고 뱃지도 1
    - ✅ **영구 실패 + 폴백(PRD 4.4의 핵심)**: 앱 내 알림을 끈 사용자에게 죽은 endpoint를 심고 공지를 보내니 web_push 행 1개만 생성 → 디스패처가 FCM에서 **410 Gone**을 받아 재시도 없이 최종 실패 처리 → **`in_app` 행이 `fallback_sent` 상태로 새로 생성**(사용자가 in_app을 껐어도 만든다) → 죽은 구독의 `destination`이 비워지고 `web_push`가 꺼졌다
    - ✅ **재시도 백오프**: 일시적 실패로 4회를 돌리니 `60초 → 300초 → 900초 → 최종 실패(fallback_sent)`. PRD 4.4의 "최대 3회, 1분 → 5분 → 15분"과 정확히 일치
    - ✅ **컬럼 보호**: 일반회원 JWT로 위장해 `status`(값이 실제로 바뀌는 변경)·`attempt_count`·`next_attempt_at`·`last_error` 변경 시도 → 전부 `P0001` 거부, `read_at`은 정상 동작(회귀 없음). 디스패처 RPC 3종과 채널 판정 함수는 `permission denied`
    - ✅ **iOS 안내**: iPhone UA + 390px 컨텍스트에서 웹 푸시 스위치가 잠기고 "iPhone·iPad는 홈 화면에 추가해야 받을 수 있어요" 안내가 노출, 앱 내 알림 스위치는 정상 동작, 가로 오버플로 0(`scrollWidth` 375)
    - ✅ **cron 경로**: `woodong_push_dispatch` 잡이 매분 `200 {"ok":true,…}`를 기록. pg_net → Edge Function 왕복이 프로덕션에서 실제로 돈다
    - ✅ **정리**: 테스트 모임·계정 2개 삭제 후 `woodong_*` 전 테이블 0행
  - **## 발견해서 함께 고친 것**
    - ⚠️ **pg_net을 켜자 `net.http_post`가 `anon`/`authenticated`에게 열렸다.** DB가 임의 주소로 HTTP 요청을 보내게 만드는 SSRF 도구이고, `net.http_request_queue`에는 **우리 cron이 넣는 디스패치 토큰이 헤더로 남는다**. 회수를 시도했지만 **효과가 없었다** — PUBLIC 권한을 `supabase_admin`이 부여했고 Postgres의 REVOKE는 "내가 준 권한"만 회수하므로 `postgres` 롤에서는 에러 없이 무시된다(실행 후 `has_function_privilege`가 여전히 true). 실효 방어선은 **`net` 스키마가 PostgREST에 노출되지 않는다** 하나뿐이고(실측: `Accept-Profile: net` → PGRST106), 이 프로젝트는 다른 앱과 공유하고 있어 설정이 우리 손 밖에서 바뀔 수 있다. 무효한 마이그레이션을 그대로 두면 "막았다"는 거짓 기록이 되므로 **후속 마이그레이션(`document_pg_net_grant_limitation`)으로 정정하고** 점검 항목을 `docs/ops/WEB_PUSH.md`에 남겼다
  - **## 관찰(수정 안 함)**
    - ⚠️ **사용자당 기기 1대만 등록된다.** 구독 정보를 `destination` 한 칸에 저장하는 PRD 5.13 스키마 때문이다. 다른 기기에서 켜면 이전 기기 구독이 덮어써진다 — 마이페이지에 그 사실을 안내 문구로 적었다. 여러 기기 지원은 구독 테이블 분리가 필요해 범위 밖
    - ⚠️ **배치가 만드는 알림은 한국어 고정**(Task 037과 같은 한계). 웹 푸시는 그 문자열을 그대로 실어 나르므로 푸시도 한국어로 간다. 알림을 키+파라미터로 저장해 읽는 시점에 조립하도록 바꿔야 해결되고, Task 040에 모여 있다
    - ⚠️ **신규 UI 문구를 en/ja/zh에 한국어 그대로 넣었다**(`TODO(i18n)` 마커). Task 012부터 지켜 온 방식이다
  - **⚠️ 운영자 조치 필요 1건**: Vercel 환경변수 `NEXT_PUBLIC_VAPID_PUBLIC_KEY` 추가(공개 키라 비밀 아님). 없으면 프로덕션에서 스위치가 잠기고 안내 문구가 뜬다 — **다른 기능에는 영향 없음**. 값과 절차는 `docs/ops/WEB_PUSH.md` 최상단
  - **완료 조건**: ✅ VAPID 키 발급 + Vault 보관, ✅ Service Worker 등록(`push`/`notificationclick`)과 PWA 매니페스트, ✅ Edge Function `woodong-push-dispatch` + pg_cron 잡(1분) 실동작, ✅ 권한 요청 UX와 구독 정보 `destination` 저장, ✅ iOS "홈 화면에 추가" 온보딩 안내, ✅ 재시도 3회(1/5/15분) + 최종 실패 시 앱 내 폴백 + 상태 4종 기록(실측), ✅ 만료·무효 구독 정리(410 → destination 비우고 채널 끄기), ✅ `npm run check-all` + `npm run build` 통과, ✅ 프로덕션 데이터 원복

- **Task 039: Naver 스파이크 및 Apple 로그인 검토** ✅ - 완료 (스파이크 종료, 실구현은 조건부 GO)
  - **## 로드맵이 깔고 있던 전제 2개가 모두 뒤집혔다**
    - ✅ **네이버는 표준 OIDC discovery를 제공한다** — `https://nid.naver.com/.well-known/openid-configuration`이 200으로 응답(issuer `https://nid.naver.com`, PKCE S256, RS256, pairwise sub). "제공하지 않아 불확실"하다는 Task 039의 전제는 더 이상 사실이 아니다
    - ✅ **Supabase Auth가 Custom OAuth/OIDC provider를 정식 지원하고, 우동 프로젝트에 이미 들어와 있다** — `auth.custom_oauth_providers` 테이블이 최신 스펙 컬럼(`attribute_mapping`·`email_optional`·`skip_nonce_check` 등)째로 존재하고 등록된 provider는 0건. 무료 플랜 3개 쿼터라 **플랜 업그레이드도 마이그레이션도 불필요**. 설치된 `@supabase/supabase-js` 2.112.3의 `Provider` 타입도 이미 `custom:${string}`을 포함해 **패키지 업그레이드 없이** `signInWithOAuth({ provider: "custom:naver" })`가 타입을 통과한다
    - → **결정 N-1: 로드맵 대안 2(Route Handler + `auth.admin` 자체 콜백)는 채택하지 않는다.** secret key를 Next 앱에 들이고 세션 발급·identity 연결·자동 연결 판정을 재구현해야 하는데 Custom Provider가 같은 일을 한다
  - **## 그래도 바로 구현하지 않은 이유 — 이메일 클레임 1건이 계정 정책을 가른다**
    - 네이버 discovery의 `scopes_supported`는 **`["openid","profile"]`뿐이고 `email`이 없다.** 이메일은 scope가 아니라 네이버 개발자센터의 "제공 정보" 설정으로 결정돼 `/v1/nid/me` 응답에 실린다
    - GoTrue 소스(`internal/api/provider/custom_oauth.go`) 확인 결과 **`oidc` 타입은 `id_token`이 있으면 userinfo 엔드포인트를 아예 호출하지 않는다.** 네이버는 항상 `id_token`을 주므로, **`id_token`에 `email`이 없으면 네이버 사용자는 전원 이메일 없는 별도 계정**이 되어 자동 계정 연결(PRD 3.6.2)이 무력화된다 — Task 016에서 `custom:kakao`를 버렸던 것과 정확히 같은 함정
    - 우회 수단도 막혀 있다. `attribute_mapping`은 `applyAttributeMapping()`이 클레임을 평면 맵으로 펴 놓고 대입할 뿐이라 **중첩 경로(`response.email`)를 못 쓴다.** 네이버 프로필 API는 `{resultcode, message, response:{id, email, …}}` 로 한 겹 감싸서 준다 → **`oauth2` 타입으로 `/v1/nid/me`를 직결하는 안(옵션 B)은 불가**
    - → **결정 N-2/N-3**: 1단계는 Custom OIDC로 붙여 `auth.identities.identity_data`에서 `email`/`email_verified`/`sub`를 실측하고, 없으면 **Custom OAuth2 + userinfo 프록시 Edge Function**(`/v1/nid/me`를 `{sub, email, email_verified, …}`로 평탄화, `verify_jwt: false`)으로 전환한다. GoTrue가 userinfo를 `Authorization: Bearer`로 GET한다는 것까지 소스로 확인했다
    - ⚠️ 옵션 C를 택하면 **프록시가 `email_verified`를 선언하는 순간 기존 Google/Kakao 계정과 자동 연결된다.** 편의와 계정 탈취 리스크가 맞바뀌는 보안 결정이라 착수 시 명시적으로 정하고 PRD 3.6.2에 반영해야 한다
  - **## 남은 미확인 4건은 라이브 로그인 1회로 전부 결판난다** — `id_token`의 `email`(U-1)·`email_verified`(U-2) 유무, 네이버가 "필수"라고 명시한 **토큰 교환 시 `state`를 GoTrue가 보내지 않는데도 교환이 통과하는지**(U-3), pairwise `sub`의 안정성(U-4). U-3은 더미 자격증명으로 `state` 유무를 바꿔 호출해 봤으나 둘 다 `invalid_client`(401)로 같아 **client 검증이 먼저 걸린다는 것만 확인**했다
  - **⚠️ 운영자 조치 필요 2건 (이것이 실구현의 착수 조건 = 결정 N-4)**: (1) 네이버 개발자센터 앱 등록 — Callback URL은 Google/Kakao와 동일한 `https://ybhluyzkmpjmrxyhkolt.supabase.co/auth/v1/callback`, 제공 정보에서 **이메일·이름을 "필수 제공"으로 신청**(추가 제공은 사용자가 거부 가능), (2) 사전 검수 요청 — 승인 전에는 등록된 아이디로만 로그인된다. 절차·등록 명령·30분 검증 시나리오는 `docs/ops/NAVER_LOGIN_SPIKE.md`
  - **자격증명 없이는 라이브 검증이 불가능하므로 앱 코드에는 아무것도 넣지 않았다** — 테스트 못 하는 인증 경로를 늘리지 않는다는 판단(로드맵 품질 기준: 인증 Task는 E2E 통과 후 완료). 실구현은 Task 040 항목으로 이관
  - **## Apple — 계속 보류, 트리거를 "iOS 앱 스토어 등록 결정"으로 구체화**
    - Supabase 네이티브 지원이라 기술 리스크는 없다. 걸리는 건 **Apple Developer Program 연 $99**와 **최대 6개월마다 갱신해야 하는 client secret JWT(ES256)** 운영 부담
    - App Store 심사 지침 4.8은 **앱을 스토어에 낼 때** 적용된다. 우동은 현재 **PWA**(Task 038의 "홈 화면에 추가")라 심사 대상이 아니므로 **지금 붙일 이유가 없다**
    - ⚠️ 붙일 때는 Hide My Email 릴레이 주소(`@privaterelay.appleid.com`) 때문에 **이메일 기반 자동 계정 연결이 사실상 무력화**되고 Task 040의 "자동 연결 이메일 알림"과도 충돌한다는 점을 함께 설계해야 한다
  - **## Facebook — 보류 유지**, 재평가 트리거만 명시: Task 034 KPI(K1/K2) 가입 이탈 분석에서 "지원 소셜 없음"이 유의미하게 잡힐 때. 네이티브 지원이라 필요해지면 즉시 추가 가능
  - **완료 조건**: ✅ 네이버 OIDC discovery 실측, ✅ Supabase Custom Provider 지원 여부를 **프로젝트 DB에서 직접 확인**, ✅ 클라이언트 타입·콜백 라우트 영향 범위 확인(변경 0줄), ✅ 옵션 4개(A/B/C/D) 비교 후 권장안 확정 + 결정 4건(N-1~~N-4) 기록, ✅ Apple·Facebook 재검토 트리거 갱신, ✅ 스파이크 문서 `docs/ops/NAVER_LOGIN_SPIKE.md` 작성, ✅ 프로덕션 데이터·설정 무변경(읽기 전용 조회만, provider 등록 0건), ⚠️ **실구현은 운영자 조치 2건 완료 후 착수**(Task 040으로 이관), ⚠️ 미확인 4건(U-1~~U-4)은 자격증명 확보 후 라이브 1회로 해소

- **Task 040: 운영 고도화 및 잔여 확장 항목** 🔶 진행 중 (4/7 항목 완료)
  - ✅ **총무 교체 대비 정산 데이터 CSV 내보내기**(PRD 9장 "정산 데이터 이관 부재")
    - **원장 3종 + 리포트**로 나눠 내보낸다(`청구 현황`/`납부 이력`/`지출`/`정산 리포트`). 리포트만 넘기면 다음 총무가 "이 금액이 어디서 나왔는지"를 되짚을 수 없고, 세 원장은 1행의 의미가 서로 달라 한 시트에 합치면 표로 읽히지 않는다
    - **엑셀·구글 시트가 실제로 어떻게 읽는지**에 맞췄다: UTF-8 **BOM**(없으면 한글 Windows 엑셀이 CP949로 읽어 전부 깨진다), CRLF, RFC 4180 이스케이프, **수식 주입 방지**(사용자가 쓴 메모의 `=`/`+`/`-`/`@` 앞에 `'`를 붙여 텍스트로 고정), RFC 5987 한글 파일명. 금액은 포맷하지 않고 숫자로 넣어 받는 쪽에서 합계를 낼 수 있게 했다
    - **Server Action이 아니라 Route Handler**로 만들었다 — 결과물이 화면 갱신이 아니라 파일이고, Server Action은 `Content-Disposition`을 정할 수 없어 장부 전체를 클라이언트 payload로 실어 보내야 한다. 덕분에 UI는 상태 없는 `<a>` 링크 4개가 전부다
    - **총무 전용**이다. RLS는 회비·지출 조회를 멤버 전원에게 열어 두지만(화면이 그렇게 동작한다), 멤버별 납부 상태와 사용자 id가 한 파일로 통째로 나가는 경로라 앱에서 역할을 한 번 더 본다. 헤더·상태 문구는 **읽는 사람의 로케일**을 따른다
  - ✅ **알림센터 고급 필터링** — 유형 5종 + 미읽음
    - ⚠️ 로드맵이 적어 둔 **"채널별"은 구현하지 않았다.** 알림센터는 Task 038부터 `channel = 'in_app'`만 읽는다(웹 푸시 행은 발송 기록이라 함께 보이면 같은 알림이 두 번 뜬다). 선택지가 하나뿐인 필터가 되고 `web_push`를 고르면 항상 0건이라, 실제로 쓸모가 있는 **미읽음 필터**로 대체했다
    - **필터를 쿼리에 실었다.** 목록이 최신 50건으로 잘리는데 화면에서 거르면 "회비 알림만"이 그 50건 안의 3건만 보여준다. 조건을 쿼리에 실으면 잘림이 필터 뒤에 적용돼 "회비 알림 최신 50건"이 된다
    - 필터 UI는 **클라이언트 컴포넌트가 아니다**(상태가 URL뿐이라 링크로 충분). 뒤로 가기·공유·읽음 처리 후 `router.refresh()`에도 필터가 유지된다. 결과 0건은 "알림 없음"과 다른 문구 + 해제 링크로 구분한다
  - ✅ **알림 문구 i18n 구조 개선** — Task 037/038이 남긴 "배치 알림 한국어 고정" 한계 해소
    - `woodong_notifications`에 **`template_key` + `params`(jsonb)** 추가(CHECK 제약), 알림 생성 4개 RPC가 함께 저장하도록 갱신. **`title`/`body`는 그대로 유지** — 웹 푸시 디스패처가 읽는 값이고 구버전 폴백이기도 해서, 이 변경은 추가만 하고 기존 동작을 바꾸지 않는다
    - 화면은 `renderNotificationText()`가 **읽는 시점에 읽는 사람의 사전으로** 조립한다. 공지(`notice`)는 제목·본문이 총무가 쓴 사용자 콘텐츠라 템플릿을 붙이지 않고 원문을 그대로 쓴다
    - ⚠️ **웹 푸시로 나가는 문구는 여전히 한국어**다. 발송 시점에 문자열을 고르는 주체가 브라우저가 아니라 Edge Function이라, 해결하려면 사용자별 로케일 저장(`woodong_profiles.locale`)과 Edge Function 템플릿이 함께 필요하다(`docs/ops/WEB_PUSH.md`에 기록)
  - ✅ **i18n 실제 번역**(en/ja/zh) — Task 012부터 쌓인 한국어 스텁 **243종**을 3개 언어로 번역하고 `TODO(i18n)` 마커 25줄씩 제거, 세 파일 모두 한글 잔여 0줄. 개수 접미사(`${count}${suffix}`)는 복수 처리가 불가능해 **개수와 무관하게 읽히는 영어 표현**으로 바꿨다("1 new notifications" → "1 unread" 등 8건, E2E 중 발견)
  - **## E2E 검증(Playwright MCP, 실계정 2개)**
    - CSV: 4개 데이터셋 값 대조(청구 30,000 / 납부 20,000 / 미납 10,000 / 부분납부), **BOM 바이트 `EF BB BF` 실측**, CRLF, 수식 주입 메모(`=SUM(1,2) 테스트, "인용" 포함`)가 `"'=SUM(1,2) 테스트, ""인용"" 포함"`으로 안전하게 이스케이프됨, 한글 파일명 인코딩, 잘못된 dataset → 400
    - 권한: **일반회원 4개 데이터셋 전부 403**, 비멤버 모임 id도 403, 회비 화면에서 메뉴 자체가 렌더링되지 않음
    - 알림: 배치 RPC가 만든 리마인드가 ko → "8월 회비 납부 리마인드", en → "Reminder: 8월 회비", ja → "8월 회비 の納付リマインド"로 **같은 행이 언어별로 다르게 조립**되는 것을 확인(파라미터인 회비 항목명은 원문 유지). 유형 필터·미읽음 필터·조합·필터 0건 안내까지 확인
    - 테스트 데이터는 검증 후 전량 삭제(모임·알림·회비·지출·정산 0행, 테스트 계정 2개 `auth.users`에서 제거). 남아 있는 모임 1건은 **다른 사용자의 실데이터**로 손대지 않았다
  - ⬜ **네이버 로그인 실구현**(Task 039 스파이크 결과 조건부 GO) — 운영자 조치 2건(네이버 앱 등록 + 검수) 선행 필수. 착수 시 `docs/ops/NAVER_LOGIN_SPIKE.md`의 라이브 검증(U-1~U-4) → 옵션 A(Custom OIDC) 또는 옵션 C(Custom OAuth2 + userinfo 프록시 Edge Function) 확정 → 버튼·아이콘·4개 언어 사전 추가 순서로 진행
  - ⬜ 계정 자동 연결 발생 시 **이메일 알림 발송**(PRD 3.6.2 정책 5번, 1차는 인앱 토스트만) — ⚠️ **전제 재검토 필요**: v1.5에서 이메일을 알림 채널에서 제외하고 웹 푸시로 일원화했으므로, SMTP를 새로 들일지 인앱·푸시로 대체할지 먼저 정해야 한다
  - ⬜ Supabase Storage **Pro 플랜 업그레이드 시 서버 사이드 이미지 변환으로 전환**(1차 클라이언트 리사이즈 대체) — 플랜 업그레이드 대기
  - ⬜ 모임 유형 다양화(스터디, 취미모임 템플릿)에 따른 UI 커스터마이징

---

## Task 의존관계 요약

```
Phase 0 (001~005) ──┬──> Phase 3 (015~018-1) ──> Phase 4 (019~021-1) ──> Phase 5 (022~024-1) ──> Phase 6 (025~030-1) ──> Phase 7 (031~034) ──> Phase 8 (035~040)
                    │
Phase 1 (006~009) ──┴──> Phase 2 (010~014) ─────────────────────────────────┘ (UI는 더미 데이터로 선행 완성)
```

- **Phase 0과 Phase 1·2는 병렬 진행 가능** — Phase 2는 전 구간 더미 데이터를 사용하므로 DB 준비를 기다리지 않는다.
- **Phase 3 이후는 Phase 0 완료가 필수**(스키마·RLS·타입).
- Phase 4 → 5 → 6은 데이터 의존(모임 → 회비/투표/공지) 순서를 따른다.

---

## 리스크 및 결정 필요 사항 (PRD 9장 연계)

| 리스크                                                                             | 상태                                                                                     | 로드맵 반영 위치                                            |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Supabase 프로젝트 공유(무료 슬롯 부족)                                             | 해결 — `woodong_` 접두어 격리 + 기존 테이블 무변경                                       | Task 001, 002 / 잔여: 용량·커넥션 모니터링(Task 034)        |
| Naver OAuth 네이티브 미지원                                                        | 해소 — 네이버가 표준 OIDC discovery 제공 + Supabase Custom Provider 지원 확인(조건부 GO) | Task 016(제외 명시), Task 039(스파이크) / 실구현은 Task 040 |
| 계정 자동 연결(끌 수 없는 플랫폼 기본 동작)                                        | 결정 완료 — 자동 연결 수용 + 사후 고지                                                   | Task 016 / 이메일 알림은 Task 040                           |
| **Kakao Biz App 미등록 시 이메일 미제공**                                          | 착수 시점 결정 필요 — "Allow users without an email" 활성화 및 Biz App 등록 일정 확인    | Task 001(옵션 결정), Task 016(예외 플로우)                  |
| 웹 푸시 iOS 지원 제약(홈 화면 추가 필요) (v1.6, 카카오톡 알림톡/Slack/이메일 대체) | 해결 — iOS·미설치이면 스위치를 잠그고 "홈 화면에 추가" 안내를 노출(Task 038)             | Task 038                                                    |
| Storage 서버 사이드 변환 Pro 플랜 전용                                             | 1차는 클라이언트 리사이즈로 대체                                                         | Task 004 / 전환은 Task 040                                  |
| Free 플랜 7일 미사용 시 프로젝트 일시정지                                          | 운영 루틴으로 대응                                                                       | Task 001, Task 034                                          |
| 개인정보보호법(PIPA) 대응                                                          | 출시 전 처리방침·동의 절차 결정 필요(법률 자문 권장)                                     | Task 034                                                    |
| 금융 정보 취급 법적 고지                                                           | 이용약관 문구 결정 필요, PG 연동은 MVP 명시적 제외                                       | Task 034                                                    |
| **총무 단일 실패점**                                                               | 결정 완료 — 마지막 총무 역할 변경/탈퇴 차단을 1차에 포함                                 | Task 003(트리거), Task 021(UI 이중 방어)                    |
| 초대 코드 유출                                                                     | 설계 완료 — 만료·최대 사용 횟수 필수화 + 재발급 시 기존 코드 무효화                      | Task 020                                                    |
| 정산 데이터 정확성(수동 입력 의존)                                                 | 해결 — 검토 단계(초안 → 발행) 도입 확정, 발행분은 트리거로 불변 처리                     | Task 036                                                    |
| 정산 데이터 이관 부재(총무 교체)                                                   | 해결 — 회비·납부·지출·정산 CSV 내보내기(총무 전용) 구현                                  | Task 040                                                    |
| 알림 발송 비용 (v1.6 갱신 — 웹 푸시는 무료)                                        | 리스크 해소, 별도 비용 시뮬레이션 불필요                                                 | Task 038                                                    |
| 스타터킷 데모 페이지(`/avatars`, `/charts`, `/about`, `/tech-stack`) 존치 여부     | 결정 완료 — `/about`만 제거, 나머지 3개는 유지(`/tech-stack` 문구는 우동 기준 교정)      | Task 032                                                    |
| 1차 MVP 공수 초과(163~212h vs 4주 160h)                                            | 해결 — 3.4-b·스케줄러·Naver/Apple을 2차로 이동해 범위 축소                               | Phase 8 격리                                                |

---

## 품질 기준 (모든 Task 공통 완료 조건)

- `npm run check-all`(typecheck + lint + format:check) 통과
- pre-commit 훅(lint-staged + `tsc --noEmit`) 및 commitlint(이모지 + 컨벤셔널 커밋) 통과
- 신규 UI 문자열이 `Dictionary` 타입과 4개 언어 파일에 모두 반영됨
- request-time API 사용 컴포넌트가 `<Suspense>` 경계 안에 있고 dev 오버레이 `blocking-route` 에러 0건
- API 연동·비즈니스 로직 Task는 **Playwright MCP E2E 테스트 통과** 후 완료 처리
- 기존 공유 테이블(`profiles` 등)에 대한 `ALTER`/`DROP`/`TRUNCATE` 0건

---

**📅 최종 업데이트**: 2026-08-30
**📊 진행 상황**: Phase 0~7 완료(1차 MVP 출시 준비 완료), Phase 8 진행 중 — 잔여 Task 040의 3개 항목(네이버 실구현·자동 연결 알림·모임 유형 템플릿, 전부 선행 조건 대기) (43/44 Tasks 완료)
