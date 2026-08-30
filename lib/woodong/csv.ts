/**
 * CSV 직렬화 (Task 040, PRD 9장 "정산 데이터 이관 부재").
 *
 * 총무가 바뀔 때 회비·지출·정산 기록을 통째로 넘길 수 있어야 한다는 요구에서 나왔다.
 * 받는 쪽은 대부분 **엑셀 / 구글 시트**이므로, RFC 4180만 지키면 되는 게 아니라 그 두 도구가
 * 실제로 어떻게 읽는지에 맞춰야 한다. 아래 3가지가 그 대응이다.
 */

/**
 * UTF-8 BOM.
 *
 * 붙이지 않으면 **한글 Windows의 엑셀이 CSV를 CP949로 읽어** 모든 한글이 깨진다(가장 흔한
 * 사용자 신고 1순위). 구글 시트·macOS Numbers는 BOM이 있어도 정상이라 붙이는 쪽이 항상 안전하다.
 */
const BOM = "﻿";

/** RFC 4180이 규정한 줄바꿈. 엑셀이 LF만 있는 파일의 마지막 줄을 흘리는 경우가 있어 CRLF로 쓴다. */
const CRLF = "\r\n";

/**
 * 수식 주입(CSV injection) 방지 접두 문자.
 *
 * 메모·비고는 사용자가 자유롭게 쓰는 값이라 `=cmd|...`, `+HYPERLINK(...)` 같은 문자열이
 * 들어올 수 있다. 그대로 내보내면 **파일을 여는 사람의 엑셀에서 수식으로 실행**된다.
 * 값 자체는 보존해야 하므로 지우지 않고 작은따옴표를 앞에 붙여 텍스트로 고정한다.
 */
const FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"];

function escapeCell(value: string): string {
  const guarded = FORMULA_PREFIXES.some((prefix) => value.startsWith(prefix))
    ? `'${value}`
    : value;

  // 따옴표·쉼표·줄바꿈이 있으면 전체를 따옴표로 감싸고 내부 따옴표는 두 번 반복한다(RFC 4180).
  if (/["\n\r,]/.test(guarded)) {
    return `"${guarded.replaceAll('"', '""')}"`;
  }
  return guarded;
}

/** 셀 하나로 쓸 수 있는 값. `null`/`undefined`는 빈 칸이 된다. */
export type CsvValue = string | number | null | undefined;

/**
 * 헤더 + 행들을 CSV 본문 문자열로 만든다(BOM 포함).
 *
 * 금액은 **숫자 그대로** 넘긴다. `formatWon()`으로 "12,000원"을 만들어 넣으면 받는 쪽에서
 * 합계를 낼 수 없다 — 화면용 포맷과 데이터용 포맷을 구분하는 게 이 함수의 전제다.
 */
export function toCsv(headers: string[], rows: CsvValue[][]): string {
  const lines = [headers, ...rows].map((row) =>
    row
      .map((cell) =>
        escapeCell(cell === null || cell === undefined ? "" : String(cell)),
      )
      .join(","),
  );

  return BOM + lines.join(CRLF) + CRLF;
}

/**
 * 파일 이름에 쓸 수 없는 문자를 정리한다.
 *
 * 모임 이름이 그대로 들어가는데(`우동/회비.csv` 같은 값이 실재한다) 경로 구분자와 제어문자는
 * 브라우저·OS에 따라 저장 자체가 실패한다. 공백은 남겨도 되지만 헤더 인코딩 사고를 줄이려고
 * 밑줄로 바꾼다.
 */
function sanitizeFilename(value: string): string {
  const cleaned = value
    .replace(/[\u0000-\u001f\u007f/\\:*?"<>|]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 60)
    .trim();

  return cleaned || "export";
}

/**
 * `Content-Disposition` 헤더 값.
 *
 * 한글 파일명은 ASCII만 담을 수 있는 `filename=`으로 전달되지 않으므로 RFC 5987의
 * `filename*=UTF-8''...`를 함께 낸다. 구형 클라이언트를 위해 ASCII 폴백(`woodong-export.csv`)을
 * 앞에 두는 순서도 규격이 요구하는 대로다.
 */
export function csvContentDisposition(filename: string): string {
  const safe = sanitizeFilename(filename);
  return `attachment; filename="woodong-export.csv"; filename*=UTF-8''${encodeURIComponent(`${safe}.csv`)}`;
}

/** CSV 응답 공통 헤더. `text/csv`에 charset을 명시해야 브라우저가 BOM을 다시 해석하지 않는다. */
export function csvResponseHeaders(filename: string): HeadersInit {
  return {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": csvContentDisposition(filename),
    // 내보내기 결과는 요청 시점의 장부다. 중간 캐시가 남기면 총무가 갱신 후 받은 파일이
    // 예전 내용일 수 있다.
    "Cache-Control": "no-store",
  };
}
