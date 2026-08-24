# 우동(Woodong) 1차 MVP 개발 로드맵

동호회/모임의 운영·회비 정산·투표를 한 곳에서 관리해 "총무 1인 부담"을 줄이는 모바일 우선 웹 서비스.

- **문서 버전**: v1.3 (Phase 2 완료 반영)
- **기준 PRD**: `docs/prd/PRD_MVP.md` (v1.2, 2026-08-23)
- **레포지토리(코드네임)**: `moim-ops` / 작업 디렉토리 `woodong-01`
- **사용자 노출명**: 우동 (Woodong)
- **1차 MVP 목표 기간**: 4주 (약 160h, 1인 개발 기준)

**📅 최종 업데이트**: 2026-08-24
**📊 진행 상황**: Phase 0·1·2 완료, Phase 3 대기 중 (14/44 Tasks 완료)

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
  - ✅ 확장성 컬럼 반영: `woodong_groups.type`(자유 값), `woodong_due_cycles.due_type`(`regular`/`extra`), `woodong_notification_preferences.channel`의 `CHECK(channel in ('kakao','slack','email','in_app'))` — 그 외 열거형 컬럼에도 CHECK 제약 동일 적용
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

### Phase 3: 인증 (PRD 우선순위 1)

> **범위**: 이메일 회원가입/로그인 + Google 소셜 로그인 + Kakao 소셜 로그인(이메일 미제공 예외 처리 포함). **Naver는 1차 범위에서 완전히 제외**(2차 착수 전 1~2일 스파이크로 구현 가능 여부 검증 후 결정).
> **의존성**: Task 001(Auth 옵션 결정), Task 006(라우트 골격).

- **Task 015: 이메일 인증 플로우 정비**
  - 기존 `app/auth/*`(로그인/회원가입/비밀번호 찾기/재설정/`confirm/route.ts`) 흐름을 우동 브랜드 UI로 확장
  - 회원가입 시 이메일 확인 링크 발송 및 확인 전 보호 페이지 접근 제한 확인
  - 비밀번호 재설정 메일 → 새 비밀번호 설정 페이지 플로우 검증
  - 인증 폼은 기존 "Client Component에서 `supabase.auth.*` 직접 호출" 패턴 유지
  - **완료 조건**: 가입 → 이메일 확인 → 로그인 → 비밀번호 재설정 전 구간이 실제 메일 수신 기준으로 동작

- **Task 016: Google / Kakao 소셜 로그인 연동 및 계정 연결 정책 구현**
  - Supabase Auth에 Google, Kakao provider 설정 및 리다이렉트 URL 구성
  - **계정 자동 연결 수용 정책 구현**(PRD 3.6.2): verified 이메일 기준 자동 identity 연결은 플랫폼 기본 동작이므로 그대로 수용하고, **사후 고지 토스트**("기존 [이메일] 계정에 연결되었습니다")를 노출 — 연결 여부는 `getUserIdentities()`로 로그인 전/후 identity 개수를 비교해 판별
  - **Kakao 이메일 미제공 예외 처리**: Biz App 미등록 시 `account_email`을 받지 못하므로, "Allow users without an email" 전제 하에 이메일 없는 신규 계정으로 정상 가입 처리하고 마이페이지 수동 연동 안내를 노출
  - 자동 연결 시 이메일 알림 발송은 **2차 확장**으로 분류(1차는 인앱 토스트만)
  - **완료 조건**: Google/Kakao 로그인 성공, 동일 verified 이메일 자동 연결 시 기존 모임/회비 데이터 접근 유지 및 안내 토스트 노출, 이메일 없는 Kakao 계정이 에러 없이 가입 완료

- **Task 017: 로그인 후 원래 경로 복귀(`next` 파라미터) 구현**
  - **3개 지점을 함께 수정**(PRD 부록 명시): `lib/supabase/proxy.ts`(리다이렉트 시 원래 경로를 `next` 쿼리 파라미터로 부착), `components/login-form.tsx`(현재 `/protected` 하드코딩 리다이렉트 제거), OAuth 콜백 라우트(`next` 파라미터 전달/복원)
  - `next` 파라미터 오픈 리다이렉트 방지 검증(내부 경로만 허용하는 화이트리스트/동일 오리진 검사)
  - 복귀 경로가 없을 때의 기본 목적지를 **모임 목록 페이지**로 설정
  - 초대 링크(`/invite/[code]`) 접근 시 로그인 유도 후 초대 화면으로 복귀하는 플로우 연결
  - **완료 조건**: 비로그인 상태로 `/protected/groups/[id]/dues` 접근 → 로그인 → 해당 경로 복귀, 외부 URL 주입 시 기본 경로로 폴백

- **Task 018: 마이페이지 연동 계정 관리 및 프로필**
  - `getUserIdentities()` 기준 연결된 provider 목록 표시
  - `linkIdentity()`로 추가 연동(Manual Linking 베타 옵션 활성화 전제), `unlinkIdentity()`로 해제
  - **연결된 provider가 2개 이상일 때만 해제 버튼 활성화**(마지막 1개는 로그인 수단 상실 방지를 위해 해제 불가)
  - `profiles`의 `name`/`phone_number` 등은 **읽기 전용 재사용** 원칙에 따라 표시 위주로 처리(우동에서 `role`·`avatar_key`·`notify_on_*`는 사용/변경 금지)
  - **완료 조건**: provider 목록 정확 표시, 마지막 identity 해제 시도 차단, `profiles` 스키마 변경 0건

- **Task 018-1: 인증 통합 테스트 (Playwright MCP)**
  - **## 테스트 체크리스트**
    - 이메일 가입 → 확인 전 보호 페이지 접근 차단 → 확인 후 접근 허용
    - Google 로그인 성공 후 `next` 경로 복귀
    - 동일 verified 이메일 소셜 로그인 시 자동 연결 + 안내 토스트 노출
    - 이메일 없는 Kakao 계정 가입 및 수동 연동 안내 노출
    - 마지막 identity 해제 차단, provider 2개 이상일 때만 해제 버튼 활성화
    - 비밀번호 재설정 전체 플로우
    - 엣지 케이스: 만료된 확인 링크, 잘못된 `next` 값(외부 URL), 중복 가입 시도
  - **완료 조건**: 위 시나리오 전부 통과, 실패 케이스의 에러 메시지가 브랜드 톤 가이드에 부합

---

### Phase 4: 모임 관리 (PRD 우선순위 2)

> **의존성**: Phase 0(스키마·RLS), Task 008(폼 아키텍처), Task 012(UI), Phase 3(인증).

- **Task 019: 모임 CRUD 구현**
  - 모임 생성 Server Action: 생성자를 **자동으로 `admin`(총무)로 `woodong_group_members`에 등록**하고 상세 페이지로 이동
  - 필수 항목(모임 이름) 미입력 시 유효성 검사 에러 표시 및 요청 미전송
  - 모임 정보 수정(이름/설명/대표 이미지/`default_due_amount`/`type`) — 대표 이미지는 `woodong-covers` 비공개 버킷 업로드 + 클라이언트 리사이즈 + 서명 URL 조회
  - 모임 삭제: 확인 다이얼로그 재확인 후 연관 회비/투표/공지 데이터 함께 삭제(또는 소프트 삭제) 처리 방식 확정 및 구현
  - 더미 데이터를 실제 Supabase 쿼리로 교체하고 `revalidatePath`로 목록/상세 갱신
  - **완료 조건**: 생성 → 상세 이동 → 수정 → 삭제 전 구간 동작, 비멤버의 조회/수정이 RLS로 차단됨

- **Task 020: 초대 코드 발급·참여·무효화 구현**
  - > **Task 003에서 확인된 선행 제약**: `woodong_group_members` INSERT 정책은 "자신이 만든 그룹의 admin 자기등록"만 허용하도록 잠겨 있어, 초대로 합류하는 `member` 행 INSERT는 클라이언트에서 직접 불가능하다. `woodong_increment_invite_used_count()`를 호출하고 멤버십을 INSERT하는 통합 `SECURITY DEFINER` RPC(예: `woodong_redeem_group_invite(p_code text)`)를 신규로 만들어야 한다. 또한 `woodong_group_invites` SELECT가 관리자 전용이라 `/invite/[code]` 공개 미리보기 페이지가 모임 이름 등을 직접 조회할 수 없으므로, 최소 정보만 반환하는 별도 `SECURITY DEFINER` 함수도 필요하다.
  - 초대 코드/링크 생성: `expires_at`, `max_uses` 설정 필수화(코드 유출 대비, PRD 9장), 복사 UI 제공
  - 참여 처리: `is_active = true AND revoked_at IS NULL AND expires_at > now() AND (max_uses IS NULL OR used_count < max_uses)` 조건 검증 후 `일반회원`으로 등록
  - `used_count` 원자적 증가 RPC 호출(동시성 이슈 방지, Task 003에서 `woodong_increment_invite_used_count()`로 구현 완료)
  - **이미 멤버인 사용자 재접속 시** `UNIQUE(group_id, user_id)` 제약으로 중복 멤버십 생성 없이 모임 상세로 바로 이동
  - **재발급 시 이전 초대는 `is_active = false` + `revoked_at` 기록**으로 무효화
  - 만료/무효 코드 입력 시 "유효하지 않은 초대 코드입니다" 에러 표시
  - **완료 조건**: 정상 참여/중복 참여/만료/무효화/사용 횟수 초과 5개 케이스가 모두 명세대로 동작

- **Task 021: 멤버 역할 관리 및 마지막 총무 보호**
  - 총무의 멤버 역할 변경(`admin` ↔ `member`) 및 멤버 제외(`status='left'`) 기능
  - 일반회원의 역할 변경 시도는 **RLS로 차단**되고 권한 없음 응답 반환
  - **마지막 총무 보호**(PRD 9장 "총무 단일 실패점"): 모임에 `admin`이 1명뿐일 때 자신의 역할 변경/탈퇴 시도 시 "마지막 총무는 역할을 변경하거나 탈퇴할 수 없습니다. 먼저 다른 멤버를 총무로 지정해주세요" 에러 표시 및 요청 거부 — DB 트리거(Task 003) + UI 이중 방어
  - 멤버 목록에서 `profiles` 조인으로 이름/연락처 표시(읽기 전용)
  - **완료 조건**: 일반회원 권한 상승 시도 차단, 마지막 총무 강등/탈퇴가 DB·UI 양쪽에서 차단됨

- **Task 021-1: 모임 관리 통합 테스트 (Playwright MCP)**
  - **## 테스트 체크리스트**
    - 모임 생성 → 생성자 총무 자동 등록 확인 → 정보 수정 → 삭제
    - 초대 링크 생성 → 다른 계정으로 참여 → 멤버 목록 반영
    - 동일 계정 재참여 시 중복 멤버십 미생성
    - 만료/무효화/사용 횟수 초과 코드 에러 처리
    - 일반회원 계정으로 역할 변경 API 호출 시 RLS 차단
    - 마지막 총무 강등/탈퇴 차단 메시지 노출
    - 엣지 케이스: 모임 이름 미입력, 대표 이미지 5MB 초과 업로드, 동시 참여 요청
  - **완료 조건**: 위 시나리오 전부 통과 및 RLS 우회 경로 없음 확인

---

### Phase 5: 회비 현황 관리 — 3.4-a (PRD 우선순위 3)

> **1차 범위는 3.4-a(회비 현황)만.** 지출 등록·영수증 첨부·정산 리포트 발행/PDF(3.4-b)는 **Phase 8(2차 확장)**로 이동한다. 회비 대시보드의 "잔액"은 1차에서 노출하지 않거나 "수입만 집계"로 한정한다.
> **의존성**: Phase 4(모임/멤버십), Phase 0(스키마·트리거).

- **Task 022: 회비 항목(`woodong_due_cycles`) 생성 및 청구 팬아웃**
  - 회비 항목 생성 폼: 제목(`title`), 대상 기간(`period`), 금액(`amount`), 납부 기한(`due_date`), 리마인드 주기(`reminder_interval_days`), `due_type`(`regular`/`extra`)
  - 생성 시 **해당 시점의 모든 활성 멤버에 대해 `woodong_dues` 레코드를 `unpaid` 상태로 자동 생성**(멤버당 1건, `UNIQUE(due_cycle_id, user_id)`로 중복 방지)
  - `woodong_dues.amount`는 생성 시점 `woodong_due_cycles.amount` 스냅샷으로 저장, `group_id`는 RLS 단순화를 위해 비정규화 저장
  - 팬아웃 트랜잭션 처리 방식(RPC 또는 Server Action 내 일괄 insert) 확정 및 부분 실패 방지
  - **완료 조건**: 항목 생성 1회로 활성 멤버 수만큼 청구가 정확히 생성되고 재실행 시에도 중복 생성되지 않음

- **Task 023: 납부 이력 기록 및 상태 자동 갱신**
  - 총무가 특정 멤버 상태를 "납부완료/부분납부"로 변경 시 `woodong_payments`에 이력 기록(`amount`, `paid_at`, `recorded_by`, `memo`)
  - `woodong_dues.status`는 연결된 `woodong_payments.amount` **합계와 `woodong_dues.amount` 비교로 `paid`/`partial` 자동 갱신**(Task 003 트리거) — 애플리케이션에서 직접 status를 쓰지 않음
  - 총무 외 사용자의 상태 변경 시도는 `woodong_is_group_admin()` 정책으로 차단
  - 납부 이력 조회/수정/삭제 UI 및 오입력 정정 플로우
  - **완료 조건**: 부분 납부 2회 누적 시 `partial` → `paid` 자동 전환 확인, 일반회원의 쓰기 시도 차단

- **Task 024: 회비 대시보드 구현**
  - 멤버별 납부/미납/부분납부 상태를 **진행률 바(인포그래픽 스타일)**로 표시하고 **전체 납부율을 상단에 요약**
  - 회비 항목별 탭/필터, 미납자 목록 하이라이트
  - Task 013의 recharts 기반 컴포넌트 재사용, 데이터 많은 페이지는 스켈레톤 UI로 체감 속도 개선
  - **"잔액" 표기는 노출하지 않거나 "수입만 집계"로 한정**(지출 데이터 부재)
  - 더미 데이터를 실제 쿼리로 교체하고 상태 변경 즉시 반영(`revalidatePath`)
  - **완료 조건**: 상태 변경이 대시보드에 즉시 반영, 360px 뷰포트에서 진행률 바 가독성 확보

- **Task 024-1: 회비 관리 통합 테스트 (Playwright MCP)**
  - **## 테스트 체크리스트**
    - 회비 항목 생성 → 활성 멤버 전원 `unpaid` 청구 생성 확인
    - 납부 상태 변경 → `woodong_payments` 기록 → `status` 자동 갱신 → 대시보드 즉시 반영
    - 부분 납부 누적으로 `partial` → `paid` 전환
    - 일반회원 계정으로 상태 변경 시도 시 권한 차단
    - 전체 납부율 계산 정확성 검증
    - 엣지 케이스: 금액 0/음수 입력, 과거 날짜 납부 기한, 멤버 0명 모임에서 항목 생성, 항목 생성 후 신규 가입 멤버 처리 정책 확인
  - **완료 조건**: 위 시나리오 전부 통과, 금액 계산 오차 0

---

### Phase 6: 모임 알림(앱 내) 및 투표 관리 (PRD 우선순위 4, 5)

> **1차 범위**: 앱 내 알림만 구현. 외부 채널(카카오톡 알림톡/Slack/이메일)과 실시간 pg_cron 스케줄러는 **2차 확장**. 회비 리마인드와 투표 마감은 **조회 시점 lazy 처리**로 대체한다.
> **의존성**: Phase 4·5(공지/회비 데이터), Phase 0(알림 테이블·컬럼 보호 트리거).

- **Task 025: 공지사항(`woodong_announcements`) CRUD 및 알림 팬아웃**
  - 공지 목록/작성/수정 UI 및 Server Action(작성·수정 권한은 `woodong_is_group_admin()`)
  - 발송 시 각 멤버의 `woodong_notification_preferences`에서 **`in_app`이 활성화된 대상 기준으로 `woodong_notifications` 레코드 생성**(1차는 `in_app`만 발송)
  - **모임 전체 팬아웃 INSERT는 클라이언트 RLS로 불가능하므로 Edge Function에서 `service_role` 키로 수행**(서버 전용 환경 변수 관리, PRD 4.2)
  - `type='notice'`, `related_type='announcement'`, `related_id`=공지 ID로 다형 참조 기록
  - **완료 조건**: 공지 1건 발송 시 `in_app` 활성 멤버 수만큼 알림 생성, `service_role` 키가 클라이언트 번들에 노출되지 않음 확인

- **Task 026: 알림센터 구현 (읽음/클릭 처리)**
  - 헤더 종 아이콘 + 미읽음 뱃지, 알림센터 페이지(전체 이력, 읽음/안읽음 구분 표시)
  - 알림 클릭 시 관련 리소스(공지/투표/회비)로 이동하며 **`read_at`/`clicked_at` 갱신** — 컬럼 보호 트리거로 그 외 컬럼 UPDATE는 차단
  - 본인 수신 알림만 조회 가능(RLS)
  - KPI "알림 클릭률" 산출 기반이 되도록 `read_at`/`clicked_at` 기록 누락 방지
  - **완료 조건**: 읽음/클릭 상태가 정확히 갱신되고 타인 알림 조회·조작이 차단됨

- **Task 027: 알림 채널 설정 (마이페이지)**
  - `woodong_notification_preferences` 기반 채널별 on/off UI(`kakao`/`slack`/`email`/`in_app`) — **1차에서 실제 발송은 `in_app`만**, 나머지는 설정만 저장하고 "2차 지원 예정" 안내 표기
  - 채널별 `destination` 입력(카카오: 전화번호, Slack: webhook/멤버 ID, 이메일: 오버라이드 주소) 저장 — 2차 발송에 사용
  - 본인 레코드만 SELECT/UPDATE(RLS), `UNIQUE(user_id, channel)` 준수
  - 비활성화된 채널로는 발송되지 않고 활성 채널로만 발송되는 로직 검증
  - **완료 조건**: 설정 저장/복원 정상 동작, `in_app` 비활성 사용자에게 앱 내 알림이 생성되지 않음

- **Task 028: 회비 리마인드 lazy 처리 구현**
  - > **Task 003에서 확인된 선행 제약**: `woodong_dues`에는 클라이언트용 UPDATE 정책이 전혀 없다(상태는 트리거 전용). `last_reminded_at` 갱신도 `SECURITY DEFINER` RPC를 통해서만 가능하므로, 리마인드 생성 로직 자체를 이 RPC 안에 구현해야 한다.
  - 멤버가 **회비 대시보드 또는 알림센터에 진입하는 시점**에, `woodong_due_cycles.reminder_interval_days`와 `woodong_dues.last_reminded_at`을 비교해 주기가 지난 **미납 멤버에 한해** 리마인드 알림(`type='due_reminder'`)을 `woodong_notifications`에 기록
  - 리마인드 생성 후 `last_reminded_at` 갱신, 동시 조회 시 중복 생성 방지(원자적 갱신 또는 조건부 insert)
  - **실시간 배치 발송(pg_cron)은 2차 확장**임을 코드 주석과 문서에 명시
  - **완료 조건**: 주기 미도래 시 미생성, 주기 도래 시 1건만 생성, 동시 요청에서도 중복 생성 0건

- **Task 029: 투표 생성 및 참여 구현**
  - 투표 생성 폼: 제목, **선택지 2개 이상**, 마감일시(`closes_at`), `vote_type`(`multiple_choice`/`yes_no`), `allow_multiple`, `is_anonymous`
  - 생성 시 `woodong_votes` + `woodong_vote_options` 생성 및 **멤버 전원에게 "새 투표 시작" 알림(`type='vote_start'`)** 기록
  - 유효성 검사: 선택지 1개 이하 또는 마감일시가 과거이면 에러 표시 후 생성 차단
  - 참여: `allow_multiple = false`면 1개 선택 + `UNIQUE(vote_id, user_id)`로 중복 차단, `allow_multiple = true`면 선택 수만큼 응답 생성 + `UNIQUE(vote_id, user_id, option_id)`로 동일 선택지 중복만 차단(Task 003의 `BEFORE INSERT` 트리거로 분기 검증)
  - **완료 조건**: 단일/복수 선택 투표가 각각 명세대로 동작, 중복 투표 차단 확인

- **Task 030: 투표 lazy 마감·집계·결과 알림 구현**
  - > **Task 003에서 확인된 선행 제약**: `woodong_votes` UPDATE는 관리자 전용 정책뿐이라 lazy 마감(아무 멤버나 조회 시 `status`를 `closed`로 전환)이 RLS를 통과하지 못한다. lazy/수동 조기마감 공용 `SECURITY DEFINER` 함수를 새로 만들어야 한다.
  - **lazy 마감**: 마감일시가 지난 투표의 목록/상세 조회 시 서버에서 상태를 `closed`로 전환하고 결과를 집계해 조회 멤버에게 즉시 표시
  - **수동 조기마감**: 총무의 "지금 마감" 클릭 → 확인 다이얼로그 → lazy 마감과 동일한 로직 수행
  - **익명/실명 투표 결과**: Task 003에서 이미 `woodong_get_vote_results(p_vote_id)` `SECURITY DEFINER` 함수로 구현 완료(`woodong_vote_responses` 직접 SELECT 불필요) — 익명 투표는 `voter_names`가 `null`(카운트만), 실명 투표는 투표자 이름 배열을 반환하므로 이 Task에서는 이 함수를 호출해 결과 화면만 구성하면 된다
  - 마감 전환 완료 시 **참여 여부와 무관하게 모임 멤버 전원에게 결과 알림(`type='vote_close'`)** 기록(1차: 조회 트리거 기반, 2차: pg_cron 실시간 전환)
  - 결과 시각화는 Task 013 차트 컴포넌트 재사용
  - **완료 조건**: 마감 전환이 1회만 수행되고(중복 알림 없음), 익명 투표에서 응답자 식별 정보가 어떤 경로로도 노출되지 않음

- **Task 030-1: 알림·투표 통합 테스트 (Playwright MCP)**
  - **## 테스트 체크리스트**
    - 공지 발송 → 멤버 계정 알림센터에 노출 → 클릭 시 공지 상세 이동 및 `read_at`/`clicked_at` 갱신
    - `in_app` 비활성 사용자에게 알림 미생성
    - 미납 상태에서 대시보드 진입 시 리마인드 생성, 주기 내 재진입 시 미생성
    - 투표 생성 → 전원 `vote_start` 알림 → 단일/복수 선택 참여 → 중복 투표 차단
    - 마감일시 경과 후 조회 시 자동 마감 + 결과 집계 + `vote_close` 알림 기록
    - 총무 수동 조기마감 플로우
    - 익명 투표 결과에서 응답자 이름 미노출(네트워크 응답 페이로드까지 검증)
    - 엣지 케이스: 선택지 1개, 과거 마감일시, 마감 직후 투표 시도, 타인 알림 읽음 처리 시도
  - **완료 조건**: 위 시나리오 전부 통과, 익명성 보장 검증 완료

---

### Phase 7: 1차 MVP 품질 확보 및 출시 준비

> **의존성**: Phase 3~6 완료.

- **Task 031: 성능·접근성 최적화**
  - LCP 목표 검증: **모바일 4G(LTE) 2.5초 이내**, **3G 4초 이내** — Cache Components(`"use cache"`)와 정적 프리렌더링 최대 활용
  - **INP 200ms 이내** 검증(투표/회비 상태 변경 등 클릭 액션 기준)
  - 데이터 많은 페이지(회비 대시보드 등) 스켈레톤 UI 적용 확인
  - 사용자 업로드 이미지 `next/image` 최적화 및 클라이언트 리사이즈 동작 재확인(Storage 서버 변환은 Pro 플랜 전용이므로 미사용)
  - 360px 반응형·터치 타겟 44x44px·키보드 내비게이션·대비비 최종 점검
  - **완료 조건**: 주요 5개 화면의 LCP/INP 목표 달성, Lighthouse 접근성 점수 기준선 충족

- **Task 032: 스타터킷 잔재 정리 및 라우팅 최종 정합성 확인**
  - **`/avatars`, `/charts`, `/about`, `/tech-stack` 4개 데모 페이지의 존치 여부 결정 및 반영**(PRD 부록 — 방치 시 미완성 스타터킷 잔재로 노출될 위험). `/icons`, `/gallery`는 PRD 3.8/6.2에 따라 **재사용 확정**
  - `lib/supabase/proxy.ts` allow-list 최종 정리(공개 페이지만 남기고 결정에 따라 제거)
  - 튜토리얼 컴포넌트(`components/tutorial/`) 및 미사용 자산 정리
  - `npm run check-all`(typecheck + lint + format:check) 통과
  - **완료 조건**: 결정 사항이 코드와 allow-list에 반영되고 미사용 라우트 0건, `check-all` 통과

- **Task 033: 전체 사용자 플로우 E2E 회귀 테스트 및 배포**
  - **## 테스트 체크리스트**
    - 신규 가입 → 모임 생성 → 초대 링크 공유 → 두 번째 계정 참여 → 회비 항목 생성 → 납부 처리 → 공지 발송 → 투표 생성/참여/마감 전 구간 통합 시나리오
    - 총무 시점 / 일반회원 시점 권한 분기 회귀
    - 오프라인·네트워크 지연·서버 에러 시 에러 핸들링 및 폴백 UI
    - 360px / 768px / 1280px 3개 뷰포트 회귀
  - Vercel 프로덕션 배포(기존 파이프라인 재사용), 환경 변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, 서버 전용 `service_role`) 최종 확인
  - `get_advisors`(security/performance) 최종 점검 및 경고 해소
  - **완료 조건**: 통합 시나리오 전부 통과, 프로덕션 배포 후 스모크 테스트 통과, security advisor 경고 0건

- **Task 034: 출시 전 운영·법무 준비 및 KPI 계측 기반 구축**
  - **개인정보보호법(PIPA) 대응**: 회비 납부 이력(실명 + 금액) + 전화번호 조합에 대한 개인정보 처리방침 초안 작성 및 회원가입 동의 절차 추가 여부 결정(법률 자문 권장)
  - **금융 정보 취급 고지**: 이용약관에 "회비 송금은 사용자 간 직접 이체이며 본 서비스는 확인·기록만 제공함" 명시 여부 결정(서비스 내 결제/PG 연동은 MVP 범위에서 명시적 제외)
  - **KPI 계측 기반 확인 (PRD 8장 6종 — 순수 SQL 쿼리형 4종 + 설문/베이스라인 병행형 2종으로 구분)**:
    - 쿼리형 4종: WAG(주간 활성 모임 수), 알림 클릭률(`read_at`/`clicked_at`), 투표 참여율, 모임 생성 → 첫 회비 항목 생성 7일 내 전환율 — 산출 쿼리 정의
    - 설문/베이스라인 병행형 2종: 회비 납부율 개선폭("도입 전 자체 신고" 베이스라인이 필요해 순수 쿼리로는 산출 불가 — 도입 전 자체 신고 수치를 설문으로 별도 수집), 총무 1인당 정산 소요시간 감소(PRD 8장 정의상 "설문 기반" 지표 — 도입 전/후 소요시간을 설문으로 수집하는 절차 설계)
  - Free 플랜 운영 모니터링 체크리스트(용량 500MB, 커넥션 풀, 7일 미사용 일시정지) 수립
  - 도메인(`woodong.app`/`woodong.kr` 등) 등록 및 상표 검색은 **개발과 무관한 별도 트랙**으로 마케팅/법무 담당 확인 진행
  - **완료 조건**: 처리방침·약관 관련 결정 기록, KPI 6종 중 쿼리형 4종의 산출 쿼리 검증 + 설문형 2종의 수집 절차(설문 문항/시점) 정의, 운영 모니터링 체크리스트 확정

---

### Phase 8: 2차 확장 (MVP 이후 — PRD 7.2)

> **1차 MVP 출시 이후 착수. 본 Phase의 Task는 1차 4주 일정에 포함하지 않는다.**

- **Task 035: 회비 지출 등록 구현 (3.4-b)**
  - `woodong_expenses` 테이블 생성(1차에서 미생성한 경우) 및 RLS 정책 적용
  - 지출 등록 폼(카테고리, 금액, 담당자, 지출 일자, 비고) — 필수 항목(금액, 카테고리) 누락 시 유효성 에러
  - 영수증 이미지를 `woodong-receipts` **비공개 버킷**에 업로드하고 `receipt_object_path`만 저장(public URL 저장 금지), 조회는 `createSignedUrl()`
  - 지출 목록/상세 UI 및 회비 대시보드의 "잔액" 표기 활성화

- **Task 036: 정산 리포트 발행 및 다운로드 구현 (3.4-b)**
  - `woodong_settlements` / `woodong_settlement_items` 생성 및 발행 시점 **스냅샷** 저장(총 수입/총 지출/잔액 + 항목별 상세)
  - 기간 지정 리포트 생성, 웹 뷰 및 PDF 다운로드
  - 일반회원은 조회만 가능하고 수정/삭제 버튼 미노출(RLS + UI 이중 방어)
  - 발행 시 전체 멤버에게 `settlement_published` 알림 기록
  - **결정 필요**: 정산 리포트 발행 전 "검토 단계"(초안 → 발행) 도입 여부(PRD 9장 "정산 데이터 정확성")

- **Task 037: 실시간 배치 스케줄러(pg_cron) 전환**
  - Supabase Cron(pg_cron) 도입으로 회비 리마인드·투표 마감/집계·정산 발행 알림을 **lazy 처리에서 실시간 발송으로 전환**
  - 기존 lazy 로직과의 중복 발송 방지 전략 수립 및 전환 절차 정의

- **Task 038: 외부 알림 채널 연동**
  - 카카오톡 알림톡: 비즈니스 계정 신청, 발신 프로필 등록, **템플릿 사전 검수(영업일 수일 소요)**, **발송대행사(솔라피/알리고/NHN Cloud 등) 계약** — 리드타임 확보를 위해 조기 착수
  - Slack Webhook/API, 이메일(Resend) 연동
  - **재시도/폴백 정책**(PRD 4.4): 최대 3회, 지수 백오프(1분 → 5분 → 15분), 최종 실패 시 앱 내 알림으로 폴백하고 `woodong_notifications.status`에 `pending`/`sent`/`failed`/`fallback_sent` 기록
  - 착수 전 예상 발송량 기준 **비용 시뮬레이션** 및 채널별 발송 우선순위 정책(앱내 우선, 외부채널 옵트인) 결정

- **Task 039: Naver 스파이크 및 Apple 로그인 검토**
  - **Naver: 1~2일 스파이크(PoC)** — Custom OAuth 설정 또는 Route Handler + `auth.admin` API 자체 콜백 구현의 적합성 검증(네이버가 표준 OIDC discovery를 제공하지 않아 불확실). **스파이크 결과에 따라 구현 여부 결정**
  - Apple: iOS 앱 래핑 계획이 구체화되는 시점에 재검토(App Store 심사 정책상 타 소셜 로그인 제공 시 Apple 로그인 필수, 이메일 릴레이(Hide My Email) 대응 필요)
  - Facebook: 국내 타겟 사용률 낮아 보류 유지

- **Task 040: 운영 고도화 및 잔여 확장 항목**
  - 계정 자동 연결 발생 시 **이메일 알림 발송**(PRD 3.6.2 정책 5번, 1차는 인앱 토스트만)
  - Supabase Storage **Pro 플랜 업그레이드 시 서버 사이드 이미지 변환으로 전환**(1차 클라이언트 리사이즈 대체)
  - 모임 유형 다양화(스터디, 취미모임 템플릿)에 따른 UI 커스터마이징
  - 알림센터 고급 필터링(채널별/유형별)
  - **총무 교체 대비 정산 데이터 CSV 내보내기**(PRD 9장 "정산 데이터 이관 부재")
  - i18n 실제 번역 진행(1차 스텁으로 채운 en/ja/zh 3개 언어)

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

| 리스크                                                                         | 상태                                                                                  | 로드맵 반영 위치                                     |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Supabase 프로젝트 공유(무료 슬롯 부족)                                         | 해결 — `woodong_` 접두어 격리 + 기존 테이블 무변경                                    | Task 001, 002 / 잔여: 용량·커넥션 모니터링(Task 034) |
| Naver OAuth 네이티브 미지원                                                    | 1차 제외 확정, 2차 스파이크 후 결정                                                   | Task 016(제외 명시), Task 039(스파이크)              |
| 계정 자동 연결(끌 수 없는 플랫폼 기본 동작)                                    | 결정 완료 — 자동 연결 수용 + 사후 고지                                                | Task 016 / 이메일 알림은 Task 040                    |
| **Kakao Biz App 미등록 시 이메일 미제공**                                      | 착수 시점 결정 필요 — "Allow users without an email" 활성화 및 Biz App 등록 일정 확인 | Task 001(옵션 결정), Task 016(예외 플로우)           |
| 카카오톡 알림톡 리드타임(템플릿 검수 + 대행사 계약)                            | 1차 제외, 2차에서 조기 착수                                                           | Task 038                                             |
| Storage 서버 사이드 변환 Pro 플랜 전용                                         | 1차는 클라이언트 리사이즈로 대체                                                      | Task 004 / 전환은 Task 040                           |
| Free 플랜 7일 미사용 시 프로젝트 일시정지                                      | 운영 루틴으로 대응                                                                    | Task 001, Task 034                                   |
| 개인정보보호법(PIPA) 대응                                                      | 출시 전 처리방침·동의 절차 결정 필요(법률 자문 권장)                                  | Task 034                                             |
| 금융 정보 취급 법적 고지                                                       | 이용약관 문구 결정 필요, PG 연동은 MVP 명시적 제외                                    | Task 034                                             |
| **총무 단일 실패점**                                                           | 결정 완료 — 마지막 총무 역할 변경/탈퇴 차단을 1차에 포함                              | Task 003(트리거), Task 021(UI 이중 방어)             |
| 초대 코드 유출                                                                 | 설계 완료 — 만료·최대 사용 횟수 필수화 + 재발급 시 기존 코드 무효화                   | Task 020                                             |
| 정산 데이터 정확성(수동 입력 의존)                                             | 2차 발행 전 "검토 단계" 도입 여부 결정 필요                                           | Task 036                                             |
| 정산 데이터 이관 부재(총무 교체)                                               | 1차 제외, 2차 CSV 내보내기                                                            | Task 040                                             |
| 알림 발송 비용(건당 과금)                                                      | 2차 착수 전 비용 시뮬레이션 및 채널 우선순위 정책 필요                                | Task 038                                             |
| 스타터킷 데모 페이지(`/avatars`, `/charts`, `/about`, `/tech-stack`) 존치 여부 | 개발 착수 전 결정 필요                                                                | Task 032                                             |
| 1차 MVP 공수 초과(163~212h vs 4주 160h)                                        | 해결 — 3.4-b·스케줄러·Naver/Apple을 2차로 이동해 범위 축소                            | Phase 8 격리                                         |

---

## 품질 기준 (모든 Task 공통 완료 조건)

- `npm run check-all`(typecheck + lint + format:check) 통과
- pre-commit 훅(lint-staged + `tsc --noEmit`) 및 commitlint(이모지 + 컨벤셔널 커밋) 통과
- 신규 UI 문자열이 `Dictionary` 타입과 4개 언어 파일에 모두 반영됨
- request-time API 사용 컴포넌트가 `<Suspense>` 경계 안에 있고 dev 오버레이 `blocking-route` 에러 0건
- API 연동·비즈니스 로직 Task는 **Playwright MCP E2E 테스트 통과** 후 완료 처리
- 기존 공유 테이블(`profiles` 등)에 대한 `ALTER`/`DROP`/`TRUNCATE` 0건

---

**📅 최종 업데이트**: 2026-08-24
**📊 진행 상황**: Phase 0·1·2 완료, Phase 3 대기 중 (14/44 Tasks 완료)
