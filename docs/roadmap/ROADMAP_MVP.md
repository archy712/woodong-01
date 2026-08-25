# 우동(Woodong) 1차 MVP 개발 로드맵

동호회/모임의 운영·회비 정산·투표를 한 곳에서 관리해 "총무 1인 부담"을 줄이는 모바일 우선 웹 서비스.

- **문서 버전**: v1.6 (알림 매체 로드맵 변경 — 카카오톡 알림톡/Slack/이메일 제외, 웹 푸시로 대체)
- **기준 PRD**: `docs/prd/PRD_MVP.md` (v1.5, 2026-08-24)
- **레포지토리(코드네임)**: `moim-ops` / 작업 디렉토리 `woodong-01`
- **사용자 노출명**: 우동 (Woodong)
- **1차 MVP 목표 기간**: 4주 (약 160h, 1인 개발 기준)

**📅 최종 업데이트**: 2026-08-25
**📊 진행 상황**: Phase 0·1·2·3·4 완료, Phase 5 착수 예정 (23/44 Tasks 완료)

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
  - ✅ 확장성 컬럼 반영: `woodong_groups.type`(자유 값), `woodong_due_cycles.due_type`(`regular`/`extra`), `woodong_notification_preferences.channel`의 `CHECK(channel in ('kakao','slack','email','in_app'))` — 그 외 열거형 컬럼에도 CHECK 제약 동일 적용 (⚠️ v1.6: 알림 매체 로드맵이 `web_push`/`in_app`으로 변경되어 이 CHECK 제약은 실제 DB 기준으로 아직 예전 값이다. Task 038에서 `ALTER TABLE ... DROP CONSTRAINT` + 재생성으로 `('web_push','in_app')`로 갱신 필요)
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

> **1차 범위**: 앱 내 알림만 구현. 외부 채널(웹 푸시)과 실시간 pg_cron 스케줄러는 **2차 확장**(v1.6, 카카오톡 알림톡/Slack/이메일은 로드맵에서 완전히 제외). 회비 리마인드와 투표 마감은 **조회 시점 lazy 처리**로 대체한다.
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
  - `woodong_notification_preferences` 기반 채널별 on/off UI(`web_push`/`in_app`) — **1차에서 실제 발송은 `in_app`만**, `web_push`는 설정만 저장하고 "2차 지원 예정" 안내 표기
  - `web_push`는 사용자가 브라우저 알림을 허용하면 Push 구독 정보(endpoint/keys)가 자동으로 `destination`에 JSON으로 저장됨(카카오/Slack/이메일처럼 사용자가 직접 입력하는 방식이 아님, v1.6) — 2차 발송에 사용
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

- **Task 038: 웹 푸시(Web Push) 알림 연동** (v1.6 — 카카오톡 알림톡/Slack/이메일 대체)
  - **선행 작업**: Task 002에서 이미 적용된 `woodong_notification_preferences.channel`의 `CHECK(channel in ('kakao','slack','email','in_app'))` 제약을 `CHECK(channel in ('web_push','in_app'))`로 마이그레이션(기존 `woodong_notifications.channel`도 동일하게 갱신). 기존에 `kakao`/`slack`/`email`로 저장된 행이 있다면 `in_app`으로 백필하거나 삭제하는 정리 전략 필요
  - VAPID 키 발급, Service Worker 등록, `web-push` 라이브러리로 서버 발송 로직 구현
  - 브라우저 알림 권한 요청 UX 설계 — 사용자가 허용하면 Push 구독 정보를 `woodong_notification_preferences.destination`에 JSON으로 저장
  - iOS Safari는 홈 화면에 추가(PWA 설치)한 경우에만 웹 푸시가 동작하므로, iOS 사용자에게 "홈 화면에 추가" 온보딩 안내 UI 제공
  - **재시도/폴백 정책**(PRD 4.4): 최대 3회, 지수 백오프(1분 → 5분 → 15분), 최종 실패 시 앱 내 알림으로 폴백하고 `woodong_notifications.status`에 `pending`/`sent`/`failed`/`fallback_sent` 기록
  - 만료·무효화된 Push 구독 정리 로직 구현(웹 푸시는 발송 건당 과금이 없어 별도 비용 시뮬레이션은 불필요)

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

| 리스크                                                                             | 상태                                                                                  | 로드맵 반영 위치                                     |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Supabase 프로젝트 공유(무료 슬롯 부족)                                             | 해결 — `woodong_` 접두어 격리 + 기존 테이블 무변경                                    | Task 001, 002 / 잔여: 용량·커넥션 모니터링(Task 034) |
| Naver OAuth 네이티브 미지원                                                        | 1차 제외 확정, 2차 스파이크 후 결정                                                   | Task 016(제외 명시), Task 039(스파이크)              |
| 계정 자동 연결(끌 수 없는 플랫폼 기본 동작)                                        | 결정 완료 — 자동 연결 수용 + 사후 고지                                                | Task 016 / 이메일 알림은 Task 040                    |
| **Kakao Biz App 미등록 시 이메일 미제공**                                          | 착수 시점 결정 필요 — "Allow users without an email" 활성화 및 Biz App 등록 일정 확인 | Task 001(옵션 결정), Task 016(예외 플로우)           |
| 웹 푸시 iOS 지원 제약(홈 화면 추가 필요) (v1.6, 카카오톡 알림톡/Slack/이메일 대체) | 1차 제외, 2차 도입 시 iOS 온보딩 UI로 대응                                            | Task 038                                             |
| Storage 서버 사이드 변환 Pro 플랜 전용                                             | 1차는 클라이언트 리사이즈로 대체                                                      | Task 004 / 전환은 Task 040                           |
| Free 플랜 7일 미사용 시 프로젝트 일시정지                                          | 운영 루틴으로 대응                                                                    | Task 001, Task 034                                   |
| 개인정보보호법(PIPA) 대응                                                          | 출시 전 처리방침·동의 절차 결정 필요(법률 자문 권장)                                  | Task 034                                             |
| 금융 정보 취급 법적 고지                                                           | 이용약관 문구 결정 필요, PG 연동은 MVP 명시적 제외                                    | Task 034                                             |
| **총무 단일 실패점**                                                               | 결정 완료 — 마지막 총무 역할 변경/탈퇴 차단을 1차에 포함                              | Task 003(트리거), Task 021(UI 이중 방어)             |
| 초대 코드 유출                                                                     | 설계 완료 — 만료·최대 사용 횟수 필수화 + 재발급 시 기존 코드 무효화                   | Task 020                                             |
| 정산 데이터 정확성(수동 입력 의존)                                                 | 2차 발행 전 "검토 단계" 도입 여부 결정 필요                                           | Task 036                                             |
| 정산 데이터 이관 부재(총무 교체)                                                   | 1차 제외, 2차 CSV 내보내기                                                            | Task 040                                             |
| 알림 발송 비용 (v1.6 갱신 — 웹 푸시는 무료)                                        | 리스크 해소, 별도 비용 시뮬레이션 불필요                                              | Task 038                                             |
| 스타터킷 데모 페이지(`/avatars`, `/charts`, `/about`, `/tech-stack`) 존치 여부     | 개발 착수 전 결정 필요                                                                | Task 032                                             |
| 1차 MVP 공수 초과(163~212h vs 4주 160h)                                            | 해결 — 3.4-b·스케줄러·Naver/Apple을 2차로 이동해 범위 축소                            | Phase 8 격리                                         |

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
