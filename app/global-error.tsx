"use client";

/**
 * 루트 레이아웃 자체가 실패했을 때의 최후 폴백 (Task 033).
 *
 * `app/error.tsx`는 `app/layout.tsx` **안에서** 렌더링되므로 레이아웃이 터지면 잡지 못한다.
 * 이 파일은 그 경우에 쓰이며, 레이아웃을 대체하기 때문에 `<html>`/`<body>`를 직접 그린다.
 * 앱의 CSS 변수·폰트를 기대할 수 없는 상황이라 스타일도 인라인으로만 둔다.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
            화면을 불러오지 못했어요
          </h1>
          <p style={{ color: "#666", fontSize: "0.875rem", margin: 0 }}>
            일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              minHeight: "2.75rem",
              padding: "0 1.25rem",
              borderRadius: "0.375rem",
              border: "1px solid #ccc",
              background: "transparent",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            다시 시도
          </button>
          {error.digest ? (
            <p
              style={{ color: "#999", fontSize: "0.75rem", marginTop: "1rem" }}
            >
              {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
