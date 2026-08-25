# Supabase 공유 프로젝트 운영 정책 (Task 001)

- **문서 버전**: v1.0
- **작성일**: 2026-08-23
- **대상 로드맵 Task**: `docs/roadmap/ROADMAP_MVP.md` Task 001

## 1. 공유 프로젝트 현황 스냅샷 (2026-08-23 확인)

`mcp__supabase__list_tables` / `list_extensions` / `list_migrations`로 확인. 프로젝트는 우동 전용이 아니며, 이미 운영 중인 다른 앱(주간업무보고/조직관리 성격)의 테이블 32개가 `public` 스키마에 존재한다.

**기존 `public` 스키마 테이블 (32개, `woodong_` 접두어 없음 — 전부 다른 앱 소유, 변경 금지)**

```
brand_color_types, brand_colors, brand_gender_size_types, brand_gender_sizes, brand_lines,
brands, companies, departments, divisions, item_types, items, menus, notifications,
org_company_divisions, org_group_companies, org_groups, org_section_teams, org_sections,
org_unit_leaders, organizations, products, profiles, small_brands, sub_items,
user_menu_permissions, weekly_log_attachments, weekly_log_change_history,
weekly_log_comment_mentions, weekly_log_comments, weekly_log_reactions, weekly_logs, work_types
```

- `woodong_*` 테이블은 현재 **0개** — 아직 Phase 0 마이그레이션이 적용되지 않은 클린 상태 확인.
- 마이그레이션 이력(`list_migrations`) 106건 전부 다른 앱 소유(예: `create_weekly_logs_table`, `add_organizations_table` 등). 우동 관련 마이그레이션 없음.
- 확장(`list_extensions`) 중 이번 MVP와 관련된 것: `pgcrypto`, `uuid-ossp`(ID 생성), `pg_cron`(이미 `installed_version` 존재 — 2차 확장 Task 037 실시간 스케줄러 전환 시 재사용 가능, 1차에서는 미사용).

## 2. `profiles` / `notifications` 재사용 범위 (코드 규약)

`list_tables(verbose=true)`로 컬럼 직접 확인.

### `public.profiles` (현재 66 rows)

| 컬럼                                                       | 우동에서의 취급                                                                                                                                                                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`, `email`, `name`, `phone_number`, `bio`               | **읽기 전용 재사용 허용** — 화면 표시용으로만 조인해서 읽는다                                                                                                                                                 |
| `role`, `avatar_key`, `notify_on_comment/mention/reminder` | **재사용 금지** — 다른 앱의 권한/알림 로직과 강결합(마지막 관리자 강등 방지 트리거 등). 우동의 모임 역할·알림 채널 설정은 반드시 `woodong_group_members.role`, `woodong_notification_preferences`로 별도 관리 |
| `department_id`, `is_active`                               | 우동과 무관, 참조하지 않음                                                                                                                                                                                    |

- `auth.users`에 대한 `AFTER INSERT` 트리거(`handle_new_user()`)가 모든 신규 가입자에 대해 `profiles` 행을 자동 생성하므로, 우동 가입자도 자동으로 `profiles` 행을 갖게 된다. 별도 프로필 생성 로직 불필요.

### `public.notifications` (현재 62 rows)

**재사용 불가.** `recipient_id`/`weekly_log_id`/`comment_id`/`period_start` 등 다른 앱 도메인에 완전히 결합되어 있고, 컬럼 보호 트리거(`read_at` 외 UPDATE 차단)와 클라이언트 INSERT 정책 부재로 우동 알림에 맞지 않는다. → **Task 002에서 `woodong_notifications`를 신규 생성**하며, 동일한 "본인 수신 레코드만 SELECT, `read_at`/`clicked_at`만 UPDATE" 패턴을 `woodong_notifications` 전용으로 별도 구현한다(기존 트리거 재사용/수정 금지).

## 3. Supabase Auth 설정 결정 (3종)

> **주의**: 아래 3개 옵션은 Supabase MCP 툴셋에 프로그래매틱 설정 API가 없다(Dashboard 전용 설정). **Supabase Dashboard → Authentication → Sign In / Providers에서 사용자가 직접 활성화해야 한다.**

| 옵션                                         | 결정                         | 근거                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kakao provider의 "이메일 없이 가입 허용"** | **활성화 완료 (2026-08-25)** | 전역 설정이 아니라 **provider별 설정**(Supabase Auth 내부적으로 `EmailOptional`). `Sign In / Providers` 메인 화면의 `User Signups` 섹션에는 없고, 같은 페이지 아래 **Auth Providers 목록 → Kakao 아코디언 안**의 "Allow users without an email" 토글이다. ⚠️ 이 옵션은 **KOE205를 해결하지 못한다**(아래 비즈 앱 항목 참고) — 사용자가 **선택 동의**인 이메일 제공을 거부했을 때 가입을 허용하는 용도로만 필요하다.                                     |
| **Manual Linking (베타)**                    | **활성화 완료 (2026-08-23)** | `Sign In / Providers` → `User Signups` 섹션의 **"Allow manual linking"** 토글. Supabase Auth는 계정 탈취 방지를 위해 `linkIdentity()`/`unlinkIdentity()` API를 기본 비활성화(`GOTRUE_SECURITY_MANUAL_LINKING_ENABLED=false`)해 두는데, 이 옵션 없이는 마이페이지 "연동된 계정" 관리(Task 018)에서 사용자가 임의로 다른 provider를 추가 연동할 수 없다. 특히 Kakao 이메일 미제공 계정(아래 참고)이 나중에 이메일 계정과 수동으로 연동하려면 반드시 필요. |
| **OAuth Provider**                           | **Google, Kakao 등록 완료**  | PRD 우선순위: Google/Kakao는 1차 필수, Naver는 1차 완전 제외(2차 스파이크 후 결정, Task 039), Facebook 보류. Task 016에서 provider별 Client ID/Secret과 콜백 URL(`https://<project-ref>.supabase.co/auth/v1/callback`) 등록 완료.                                                                                                                                                                                                                       |

- ~~**Kakao Biz App 미등록 전제 확정 (2026-08-23)**~~ → **철회. 개인 개발자 비즈 앱으로 전환 (2026-08-25, Task 016)**

  Task 016 구현 중 **Supabase 내장 Kakao provider로는 비즈 앱 없이 로그인이 아예 불가능**하다는 사실이 확인되어 전제를 뒤집었다.

  - **원인**: GoTrue의 `internal/api/provider/kakao.go`가 기본 scope에 `account_email`을 **하드코딩**한다. 클라이언트의 `options.scopes`는 이 기본값을 교체하지 않고 **덧붙이기만** 하므로(`internal/api/external.go`) 제거 경로가 없다. 반면 `account_email`은 비즈 앱이어야 카카오 동의항목에 등록할 수 있어, 미등록 앱은 인가 단계에서 **KOE205**("설정하지 않은 동의 항목: account_email")로 실패한다.
  - **대시보드의 "이메일 없이 가입 허용"(`EmailOptional`)으로는 해결되지 않는다.** 이 옵션은 사용자 생성 시점에만 적용되는데 KOE205는 그 이전 단계에서 발생한다. Supabase 공식 문서의 "account_email을 빼고 EmailOptional을 켜면 된다"는 안내는 현재 내장 provider 기준으로 **사실과 다르다**(upstream: supabase/auth#2574, PR #2579 미머지, #2397은 "custom provider를 쓰라"며 클로즈).
  - **선택한 해결책**: 카카오 **개인 개발자 비즈 앱** 전환(사업자등록번호 불필요, 소유자 휴대폰 본인인증만 필요). `카카오계정(이메일)`을 **선택 동의** 항목으로 등록했다. 코드 변경 없이 내장 `provider: "kakao"` 경로를 그대로 쓰며, 이메일을 정상 수신한다(실계정 검증 시 `email_verified: true` 확인).
  - **대안으로 검토했으나 채택하지 않음**: Custom OIDC provider(`custom:kakao`, issuer `https://kauth.kakao.com`) — 비즈 앱 없이도 scope를 직접 지정할 수 있지만, 카카오 사용자가 **항상 이메일 없는 별도 계정**이 되어 자동 계정 연결이 무력화된다. 비즈 앱 전환이 막히는 환경(해외 번호 등)에서는 이 경로로 폴백할 수 있다.
  - **"이메일 없는 Kakao 계정" 경로는 여전히 유효하다**: 이메일이 **선택 동의**이므로 사용자가 거부하면 이메일 없이 가입된다. 따라서 `EmailOptional` 활성화와 마이페이지 수동 연동 안내(PRD 3.6.2)는 예외 경로로 계속 유지한다.

## 4. Free 플랜 제약 및 운영 방침

| 제약                            | 대응 방침                                                                                                                                                        |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DB 용량 500MB 공유              | 우동 테이블은 전부 `numeric(14,0)`/짧은 text 위주로 설계되어 있어 용량 압박 낮음. Task 033·034에서 `get_advisors`(performance)로 정기 점검                       |
| 커넥션 풀 공유                  | `lib/supabase/server.ts` 컨벤션(요청마다 신규 클라이언트, 전역 저장 금지)을 지켜 커넥션 누수 방지. 대량 팬아웃(Task 025 공지 발송)은 Edge Function에서 배치 처리 |
| 7일 미사용 시 프로젝트 일시정지 | 개발/QA 기간 중 **최소 주 1회** 프로젝트에 쿼리 요청(대시보드 접속 또는 `list_tables` 호출)을 보내는 루틴 수립. Task 034에서 최종 운영 체크리스트로 재확인       |

## 5. `service_role` 키 서버 전용 환경 변수 등록

- `.env.local`에 `SUPABASE_SERVICE_ROLE_KEY` 등록 완료 (2026-08-23, `NEXT_PUBLIC_` 접두사 없음, `.gitignore`의 `.env*.local`로 커밋 대상 제외 확인됨).
- **잔여 조치**: Vercel 배포 시 동일 키를 Vercel 프로젝트 환경 변수(Server-only, Production/Preview)에도 등록 필요 — Task 033(배포)에서 재확인.
- 용도: Task 025 공지 팬아웃 등 클라이언트 RLS로 불가능한 전체 멤버 INSERT를 수행하는 Edge Function 전용(PRD 4.2). 클라이언트 번들에 노출되지 않도록 `NEXT_PUBLIC_` 접두사를 절대 붙이지 않는다.

## 완료 조건 체크

- [x] 공유 프로젝트 현황 스냅샷 문서화 완료 (§1)
- [x] Auth 옵션 3종 결정 기록 및 적용 완료 (§3) — Manual Linking 활성화 완료, Kakao "이메일 없이 가입 허용" 및 Google/Kakao provider 등록 완료(2026-08-25, Task 016)
- [x] 서버 전용 환경 변수(`SUPABASE_SERVICE_ROLE_KEY`) 등록 완료 (§5, `.env.local`) — Vercel 등록은 Task 033에서 재확인
