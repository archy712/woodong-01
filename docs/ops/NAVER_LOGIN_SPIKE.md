# 네이버 로그인 연동 스파이크 결과 (Task 039)

- **작성**: Task 039 (2026-08-30)
- **배경**: PRD 우선순위 1(인증)에서 Google/Kakao만 1차에 넣고 **Naver는 "Supabase가 네이티브로 지원하지 않는다"는 이유로 완전 제외**했다(Task 016). 로드맵은 2차에서 "네이버가 표준 OIDC discovery를 제공하지 않아 불확실"하다는 전제로 1~2일 스파이크를 배정했다(Task 039).
- **범위**: 네이버 연동 가능 경로 검증 + 구현 여부 결정. Apple / Facebook은 재검토 시점만 갱신.

---

## 0. 결론 요약

**조건부 GO.** 로드맵이 깔고 있던 전제 두 개가 모두 뒤집혔다.

1. **네이버는 표준 OIDC discovery를 제공한다.** `https://nid.naver.com/.well-known/openid-configuration`이 200으로 응답한다(§1.1 실측).
2. **Supabase Auth가 Custom OAuth/OIDC provider를 정식 지원한다.** 우동 프로젝트의 GoTrue에도 `auth.custom_oauth_providers` 테이블이 이미 있다(§1.2 실측). 무료 플랜에서 3개까지.

즉 **자체 Route Handler + `auth.admin` 구현(로드맵의 두 번째 안)은 필요 없다.** 대시보드 설정 + 앱 코드 몇 줄이면 붙는다.

다만 **딱 하나 남은 미확인 항목이 계정 정책을 좌우**한다 — 네이버 `id_token`에 `email` / `email_verified` 클레임이 실리는가(§3). 여기에 따라 구현 난이도가 "버튼 1개"와 "Edge Function 1개 추가"로 갈린다. 이 값은 **실제 네이버 앱 등록 없이는 확인할 수 없다**(운영자 조치 필요, §4).

| 결정    | 내용                                                                                                                                                              |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **N-1** | 자체 콜백 구현(로드맵 대안 2)은 **채택하지 않는다.** secret key를 Next 앱에 들이고 세션 발급·계정 연결을 재구현해야 하는데, Custom Provider가 같은 일을 해 준다   |
| **N-2** | 1단계는 **Custom OIDC(`custom:naver`, issuer `https://nid.naver.com`)** 로 붙여 `id_token` 클레임을 실측한다                                                      |
| **N-3** | `email`이 없거나 `email_verified`가 없으면 **Custom OAuth2 + userinfo 프록시 Edge Function**(§2 옵션 C)으로 전환한다                                              |
| **N-4** | 실구현 착수는 **운영자 조치 2건(네이버 앱 등록 + 검수) 완료 이후**다. 그 전까지 앱 코드에 네이버 버튼을 넣지 않는다(테스트 불가 상태로 인증 경로를 늘리지 않는다) |

---

## 1. 검증 사실

### 1.1 네이버 OIDC discovery — 실측 (2026-08-30)

```
$ curl https://nid.naver.com/.well-known/openid-configuration
{
  "issuer": "https://nid.naver.com",
  "authorization_endpoint": "https://nid.naver.com/oauth2/authorize",
  "token_endpoint": "https://nid.naver.com/oauth2/token",
  "jwks_uri": "https://nid.naver.com/oauth2/jwks",
  "userinfo_endpoint": "https://openapi.naver.com/v1/nid/me",
  "response_types_supported": ["code"],
  "scopes_supported": ["openid", "profile"],
  "grant_types_supported": ["authorization_code"],
  "token_endpoint_auth_methods_supported": ["client_secret_post", "none"],
  "code_challenge_methods_supported": ["S256"],
  "subject_types_supported": ["pairwise"],
  "id_token_signing_alg_values_supported": ["RS256"]
}
```

읽어야 할 지점 3가지.

- **`scopes_supported`에 `email`이 없다.** OIDC 표준 방식으로 이메일을 요청할 수단이 없다는 뜻이다. 이메일은 scope가 아니라 **네이버 개발자센터의 "제공 정보" 설정**으로 결정되고 `/v1/nid/me` 응답에 실린다.
- **`userinfo_endpoint`가 OIDC 표준 형태가 아니다.** `/v1/nid/me`는 클레임을 평면으로 주지 않고 `{"resultcode":"00","message":"success","response":{"id":…,"email":…,"nickname":…}}` 로 **한 겹 감싸서** 준다(네이버 프로필 API 명세).
- **PKCE(S256)를 지원한다.** OIDC 경로(`/oauth2/authorize`)만이며, 구버전 경로(`/oauth2.0/authorize`)의 파라미터 표에는 `code_challenge`가 없다.

> 네이버 문서상 **토큰 발급 요청에 `state`가 "필수"** 로 적혀 있다(개발가이드 3.4.4 / 3.5.6). 표준 OAuth2에는 없는 요구사항이고 GoTrue(golang.org/x/oauth2)는 토큰 교환에 `state`를 보내지 않는다. 더미 자격증명으로 `state` 유무를 바꿔 호출해 보면 둘 다 `{"error":"invalid_client"}`(401)로 같아서 **client 검증이 먼저 걸린다는 것만 확인**했고, 실제로 state 없이 교환이 통하는지는 **유효한 code가 있어야 판정 가능**하다. → §4 라이브 검증의 확인 항목.

### 1.2 Supabase Custom OAuth/OIDC Provider — 실측

- 공식 문서: [Custom OAuth/OIDC Providers](https://supabase.com/docs/guides/auth/custom-oauth-providers). `oauth2`(엔드포인트 직접 입력) / `oidc`(issuer만 주면 discovery 자동) 두 타입. 식별자는 `custom:` 접두어 필수. **무료 플랜 3개 제한.**
- 우동 프로젝트(`ybhluyzkmpjmrxyhkolt`)에서 직접 확인:

  ```sql
  select count(*) from auth.custom_oauth_providers;  -- 0
  ```

  컬럼도 최신 스펙 그대로 존재한다: `provider_type, identifier, client_id, client_secret, scopes, pkce_enabled, attribute_mapping, authorization_params, email_optional, issuer, discovery_url, skip_nonce_check, authorization_url, token_url, userinfo_url, jwks_uri, custom_claims_allowlist, …`
  → **이 프로젝트의 GoTrue는 이미 Custom Provider를 지원한다.** 플랜 업그레이드도, 마이그레이션도 필요 없다.

- 앱 쪽 의존성도 준비돼 있다. 설치된 `@supabase/supabase-js` **2.112.3**의 `Provider` 타입이 이미 `| \`custom:${string}\``를 포함한다(`node_modules/@supabase/auth-js/dist/module/lib/types.d.ts`). 즉 `signInWithOAuth({ provider: "custom:naver" })`가 **패키지 업그레이드 없이 타입 통과**한다.

- 로그인 진입점도 기존과 동일하다: `https://ybhluyzkmpjmrxyhkolt.supabase.co/auth/v1/authorize?provider=custom:naver` → 앱 콜백 `{origin}/auth/callback`. **`app/auth/callback/route.ts`는 한 줄도 안 고쳐도 된다**(provider 중립적으로 짜여 있다).

### 1.3 GoTrue가 사용자 정보를 뽑는 순서 — 소스 확인

`supabase/auth` `internal/api/provider/custom_oauth.go`(master) 기준.

- **`oidc` 타입**: `id_token`이 있으면 **거기서만** 사용자 정보를 만들고 **userinfo 엔드포인트를 아예 호출하지 않는다.** `id_token`이 없을 때만 userinfo로 폴백한다.
- 이슈어가 알려진 provider(Google/Kakao/Apple/Azure/…)가 아니면 `parseGenericIDToken()`이 표준 클레임을 그대로 읽는다. 이메일 검증 여부는 **`email_verified` 클레임을 그대로** 쓴다(`Verified: data.Metadata.EmailVerified`).
- **`attribute_mapping`은 평면(top-level) 키만 다룬다.** `applyAttributeMapping()`이 클레임을 `map[string]interface{}`로 펴 놓고 `mapping[대상] = claims[원본]`을 할 뿐이라 **`response.email` 같은 중첩 경로를 쓸 수 없다.**
- **`oauth2` 타입**: 항상 userinfo를 `GET`하고(`oauth2.Config.Client()`가 `Authorization: Bearer <access_token>` 부착), 받은 JSON을 표준 클레임 구조체로 언마샬한다. 즉 **`sub`/`email`/`email_verified`가 최상위에 평면으로 있어야 한다.**
- PKCE는 기본 on(`pkce_enabled: true`), 인가 URL의 `state`·`code_challenge`·`nonce`는 서버가 관리해 `authorization_params`로 덮어쓸 수 없다.

**이 세 줄이 §2 옵션 비교의 근거 전부다.**

### 1.4 네이버 쪽 운영 제약

- **검수(사전 검수 요청) 전에는 앱에 등록된 개발자/테스터 아이디로만 로그인된다.** 승인 후에야 일반 사용자가 쓸 수 있다(개발가이드 3.1.4).
- **제공 정보는 "필수 제공"과 "추가 제공"으로 나뉘고, 추가 제공은 사용자가 거부할 수 있다**(3.3.4/3.3.5). 카카오에서 겪은 "이메일 없이 가입되는 계정"이 네이버에도 그대로 존재한다 → 기존 `no_email` 토스트·마이페이지 안내(Task 016)를 재사용하면 된다.
- 사용자 식별자는 애플리케이션마다 다른 `id`(pairwise)다. 네이버 아이디 자체는 주지 않는다.

---

## 2. 옵션 비교

| 옵션                                     | 구성                                                                                                                                                                                                   | 판정                                                                                                                                                                                                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Custom OIDC**                       | `provider_type: "oidc"`, `issuer: https://nid.naver.com`, `scopes: ["openid","profile"]`                                                                                                               | **가장 싸다(설정 5분, 코드 0줄).** 단 §1.3에 따라 `id_token` 클레임만 쓰인다 → `email`이 없으면 **모든 네이버 사용자가 이메일 없는 별도 계정**이 되고 자동 계정 연결이 무력화된다. `email_optional: true` 필수                                              |
| **B. Custom OAuth2 → `/v1/nid/me` 직결** | `userinfo_url`을 네이버 프로필 API로 지정                                                                                                                                                              | **불가.** 응답이 `response` 아래로 한 겹 감싸여 있어 `sub`/`email`이 최상위에 없고, `attribute_mapping`은 평면만 지원한다(§1.3)                                                                                                                             |
| **C. Custom OAuth2 + userinfo 프록시**   | authorize/token은 네이버 OIDC 경로 그대로, `userinfo_url`만 Edge Function(`woodong-naver-userinfo`)으로. 함수가 `/v1/nid/me`를 호출해 `{sub, email, email_verified, name, nickname, picture}`로 평탄화 | **이메일이 필요하면 이 경로.** 우동은 이미 Edge Function 운영 경험이 있다(`woodong-push-dispatch`). 함수는 `verify_jwt: false`(들어오는 Bearer가 Supabase JWT가 아니라 네이버 토큰이므로). 구버전 authorize 경로를 쓰면 PKCE가 없으니 `pkce_enabled: false` |
| **D. 자체 Route Handler + `auth.admin`** | 네이버 왕복을 앱이 직접 구현하고 `auth.admin`으로 사용자 생성·세션 발급                                                                                                                                | **비추천.** secret key를 Next 앱에 들여야 하고(현재 앱은 publishable key만 씀), 세션 발급·identity 연결·자동 연결 판정을 전부 재구현해야 한다. A/C가 되는 이상 감수할 이유가 없다                                                                           |

**권장: A로 한 번 붙여 실측 → 결과에 따라 A 확정 또는 C로 전환.**

### 옵션 C를 택할 때의 보안 결정 (미결)

프록시가 `email_verified: true`를 선언하면 **기존 Google/Kakao 계정에 자동 연결**된다(GoTrue는 verified 이메일만 연결한다). 편리하지만 "네이버가 내려주는 연락처 이메일은 검증된 것"이라는 가정에 계정 접근 권한을 거는 셈이다. 안전한 기본값은 `false`(자동 연결 없음 → 마이페이지에서 수동 연동)이며, **착수 시 결정하고 PRD 3.6.2에 반영해야 한다.**

---

## 3. 남은 미확인 항목 (라이브 1회로 전부 결판)

| #   | 확인할 것                                       | 확인 방법                                          | 영향                                          |
| --- | ----------------------------------------------- | -------------------------------------------------- | --------------------------------------------- |
| U-1 | `id_token`에 `email`이 있는가                   | 로그인 1회 후 `auth.identities.identity_data` 확인 | 없으면 A → C 전환                             |
| U-2 | `email_verified`가 있는가                       | 위와 동일                                          | 없으면 자동 연결 불가(A에서는 해결 수단 없음) |
| U-3 | GoTrue의 토큰 교환(`state` 미전송)이 통과하는가 | 콜백이 세션까지 도달하는지                         | 실패하면 A·C 모두 막히고 D만 남는다           |
| U-4 | `sub`(pairwise)가 안정적으로 같은 값인가        | 재로그인 시 identity 재사용 여부                   | 흔들리면 로그인마다 새 계정이 생긴다          |

---

## 4. 착수 조건 — 운영자 조치 2건

1. **네이버 개발자센터 애플리케이션 등록** (https://developers.naver.com/apps)
   - 사용 API: **네이버 로그인** 선택
   - 서비스 환경: **PC웹 / 모바일웹**, 서비스 URL은 배포 도메인
   - **Callback URL**: `https://ybhluyzkmpjmrxyhkolt.supabase.co/auth/v1/callback` ← Google/Kakao와 같은 주소다
   - 제공 정보: **이메일주소·이름(또는 별명)을 "필수 제공"으로** 신청(추가 제공으로 두면 거부 가능 → 이메일 없는 계정 발생)
   - 발급받은 **Client ID / Client Secret**을 전달
2. **사전 검수 요청** — 승인 전에는 등록된 아이디로만 로그인된다. E2E는 검수 전에도 개발자 계정으로 가능하다.

받은 자격증명으로 실행할 등록 명령(관리자 권한 필요, `service_role`/secret key로만 호출):

```js
await supabase.auth.admin.customProviders.createProvider({
  provider_type: "oidc",
  identifier: "custom:naver",
  name: "Naver",
  client_id: NAVER_CLIENT_ID,
  client_secret: NAVER_CLIENT_SECRET,
  issuer: "https://nid.naver.com",
  scopes: ["openid", "profile"],
  email_optional: true, // U-1/U-2 결과 확인 전까지는 반드시 true
});
```

검증 후 정리(옵션 A를 버릴 경우):

```js
await supabase.auth.admin.customProviders.deleteProvider("custom:naver");
```

> ⚠️ 이 Supabase 프로젝트는 다른 앱과 **공유**한다(`SUPABASE_SHARED_PROJECT.md`). Custom Provider는 프로젝트 전역 설정이고 무료 플랜 쿼터가 3개다. 등록·삭제 시 남의 앱 provider를 건드리지 않도록 `identifier`를 반드시 확인한다.

### 라이브 검증 절차 (30분)

1. 위 명령으로 `custom:naver` 등록
2. 로컬에서 `supabase.auth.signInWithOAuth({ provider: "custom:naver", options: { redirectTo: "http://localhost:3000/auth/callback" } })` 한 번 호출(임시 버튼 또는 콘솔)
3. 세션이 발급되면 **U-3 통과**. 이어서 클레임 확인:

   ```sql
   select provider, identity_data
   from auth.identities
   where provider = 'custom:naver';
   ```

   `identity_data`에 `email` / `email_verified` / `sub`가 있는지가 **U-1/U-2/U-4의 답**이다.

4. 재로그인해서 `identities` 행이 늘지 않으면 U-4 통과
5. 판정 후 테스트 계정을 `auth.users`에서 삭제(Task 016~018 때와 동일한 정리 규칙)

### 구현으로 넘어갈 때 손댈 곳

- `components/auth/provider-icons.tsx` — 네이버 아이콘(`#03C75A`) 추가
- `components/social-auth-buttons.tsx` — `SocialProvider` 유니온에 `"custom:naver"` 추가, 버튼 1개
- `lib/i18n/dictionaries/types.ts` + `{ko,en,ja,zh}.ts` — `auth.loginWithNaver` 4개 언어
- 옵션 C일 때만: `supabase/functions/woodong-naver-userinfo/`
- `app/auth/callback/route.ts`, `lib/supabase/proxy.ts` — **변경 없음**
- 검수 대비: 네이버 로그인 버튼 이미지·문구 가이드(개발가이드 3.2) 준수 필요

---

## 5. Apple / Facebook 재검토 (2026-08-30 기준)

### Apple — 계속 보류. 트리거는 "iOS 앱 래핑 착수"

- Supabase가 **네이티브로 지원**하므로 기술 리스크는 없다. 붙이는 순간의 비용은 **Apple Developer Program 연 $99**와 유지 부담이다.
- App Store 심사 지침 4.8은 **앱을 스토어에 낼 때** 걸린다. 우동은 현재 **PWA(Task 038의 "홈 화면에 추가")** 라 심사 대상이 아니다 → **지금 붙일 이유가 없다.**
- 붙일 때 준비물: Services ID, Sign in with Apple 키(ES256), **최대 6개월마다 갱신해야 하는 client secret JWT**(운영 루틴 추가), 그리고 **Hide My Email 릴레이 주소**(`@privaterelay.appleid.com`) 대응 — 릴레이 주소는 verified로 오지만 실주소가 아니어서 **이메일 기반 자동 계정 연결이 사실상 무력화**된다(Task 040의 "자동 연결 이메일 알림"과도 충돌).
- **재검토 조건**: iOS 네이티브/래핑 앱을 스토어에 올리기로 결정하는 시점. 그 전에는 재검토하지 않는다.

### Facebook — 보류 유지

국내 타겟 사용률이 낮다는 1차 판단이 그대로다. Supabase 네이티브 지원이라 필요해지면 언제든 30분이면 붙는다. **재평가 트리거: 가입 이탈 분석에서 "지원 소셜 없음"이 유의미하게 잡힐 때**(Task 034 KPI K1/K2와 연계).

---

## 참고

- [Supabase — Custom OAuth/OIDC Providers](https://supabase.com/docs/guides/auth/custom-oauth-providers)
- [네이버 로그인 개발가이드](https://developers.naver.com/docs/login/devguide/devguide.md) — 3.1.4 사전 검수, 3.3.4 선택적 제공, 3.5 OIDC 연동
- [네이버 회원 프로필 조회 API 명세](https://developers.naver.com/docs/login/profile/profile.md)
- `supabase/auth` `internal/api/provider/custom_oauth.go`, `oidc.go` — 클레임 처리 순서의 근거
- `docs/ops/SUPABASE_SHARED_PROJECT.md` §3 — Kakao 비즈 앱 전환 경위(Custom OIDC를 대안으로 검토했던 기록)
