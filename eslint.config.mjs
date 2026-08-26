import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

// eslint-config-prettier는 반드시 배열 마지막에 위치해야 함
// (포맷팅은 Prettier가 전담하도록 ESLint의 스타일 관련 규칙을 끔)
const eslintConfig = [
  {
    // Supabase Edge Function(Deno 런타임)은 앱과 다른 전역·모듈 해석 규칙을 쓴다.
    // public/sw.js도 마찬가지로 Service Worker 전역(self, clients)에서 동작한다.
    ignores: ["supabase/functions/**", "public/sw.js"],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  eslintConfigPrettier,
  {
    // shadcn CLI가 생성하는 벤더 코드는 직접 수정하지 않으므로,
    // 최신 react-hooks strict 규칙(set-state-in-effect, purity)의 예외로 둔다.
    files: ["components/ui/**/*.tsx", "hooks/use-mobile.ts"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
    },
  },
];

export default eslintConfig;
