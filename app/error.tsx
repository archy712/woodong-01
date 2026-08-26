"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

/**
 * 라우트 세그먼트 에러 바운더리 (Task 033).
 *
 * 이게 없으면 서버 컴포넌트가 throw했을 때 Next.js 기본 화면이 뜬다 —
 * "This page couldn't load / A server error occurred." + `ERROR 2821105671@E394` 같은
 * 내부 식별자. **영문이고, 헤더·푸터가 통째로 사라지고, 사용자가 할 수 있는 일이
 * "Reload"뿐이다.** 이 파일은 `app/layout.tsx`의 `<main>` 안에서 렌더링되므로
 * 앱 셸(헤더·언어·테마·푸터)이 그대로 남고, 안내도 우동의 말투로 나간다.
 *
 * 문구를 사전(`getDictionary`)에서 읽지 않는 이유: 에러 바운더리는 클라이언트 컴포넌트라
 * `getLocale()`(쿠키 접근)을 쓸 수 없고, 로케일을 props로 받으려면 이 경계를 감싸는
 * 서버 컴포넌트가 또 필요한데 그쪽이 실패하면 결국 같은 문제가 된다. 언제나 뜨는 화면이
 * 언제나 뜰 수 있어야 해서, 여기서는 기본 로케일 문구를 직접 들고 있는다.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // digest는 서버 로그의 같은 에러를 찾는 열쇠라 콘솔에는 남기되 화면에는 노출하지 않는다.
    console.error("[app/error]", error.digest ?? "(no digest)", error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertTriangleIcon className="size-8 text-muted-foreground" aria-hidden />
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">화면을 불러오지 못했어요</h1>
        <p className="text-sm text-muted-foreground">
          일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.
        </p>
      </div>
      <Button onClick={reset} variant="outline" size="sm" className="min-h-11">
        다시 시도
      </Button>
    </div>
  );
}
