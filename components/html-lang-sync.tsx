"use client";

import { useEffect } from "react";

import type { Locale } from "@/lib/i18n/config";

/**
 * `<html lang>`을 실제 사용 중인 로케일과 맞춘다 (Task 031).
 *
 * 루트 레이아웃에서 `getLocale()`을 부를 수는 없다 — 그러면 쿠키/헤더를 읽는 순간
 * **문서 전체가 동적**이 되어 `cacheComponents`의 정적 셸이 통째로 사라지고, `<html>`은
 * `<Suspense>`로 감쌀 수도 없다. 그래서 정적 셸에는 이 앱의 기본값인 `ko`를 박아 두고
 * (지원 언어 4종 중 `getLocale()`의 기본값), 다른 언어를 쓰는 사용자에 한해 이미 로케일을
 * 알고 있는 헤더 경계에서 클라이언트가 속성만 고쳐 준다.
 *
 * lang이 틀리면 스크린리더가 한국어 문장을 영어 음성 엔진으로 읽는다 — 눈에 보이지 않지만
 * 실제로 내용을 알아들을 수 없게 만드는 결함이라, 정적 셸 기본값을 바로잡는 쪽이 먼저다.
 */
export function HtmlLangSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (document.documentElement.lang !== locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  return null;
}
