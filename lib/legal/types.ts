/**
 * 법적 고지 문서(개인정보 처리방침·이용약관)의 공통 표현 형식.
 *
 * 본문은 **한국어 정본 하나만** 둔다(Task 034 결정 D-3). 법적 효력을 갖는 문장을
 * 기계 번역 품질로 4개 언어에 복제하면 오역이 곧 법적 리스크가 되기 때문이다.
 * 페이지 제목·정본 고지 같은 UI 문구만 `Dictionary["legal"]`로 4개 언어를 유지한다.
 */
export type LegalSection = {
  heading: string;
  /** 소제목 바로 아래에 오는 도입 문단. */
  paragraphs?: string[];
  list?: string[];
  table?: {
    caption?: string;
    headers: string[];
    rows: string[][];
  };
  /** 목록·표 **뒤에** 붙는 마무리 문단(단서 조항 등). */
  notes?: string[];
};

export type LegalDocument = {
  /** 문서 정식 명칭(한국어 정본). */
  title: string;
  /** 시행일 `YYYY-MM-DD`. 개정 시 갱신한다. */
  effectiveDate: string;
  /** 문서 버전. 개정 이력 추적용. */
  version: string;
  /** 목차 위에 놓이는 도입 문단. */
  preamble: string[];
  sections: LegalSection[];
};
