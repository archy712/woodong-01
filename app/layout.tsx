import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { OAuthResultToastSlot } from "@/components/auth/oauth-result-toast-slot";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "우동 (Woodong) — 모임 운영을 한 곳에서",
  description:
    "동호회/모임의 운영, 회비 정산, 투표를 한 곳에서 관리해 총무 1인 부담을 줄이는 모바일 우선 웹 서비스",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 기본 로케일(ko)을 정적 셸에 박아 둔다. 다른 언어는 헤더의 `HtmlLangSync`가 고친다 —
    // 여기서 `getLocale()`을 부르면 문서 전체가 동적이 된다(Task 031 주석 참고).
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="flex min-h-screen flex-col">
              <Suspense fallback={<div className="h-16 w-full border-b" />}>
                <AppHeader />
              </Suspense>
              <main className="flex flex-1 flex-col items-center">
                {children}
              </main>
              <Suspense fallback={null}>
                <AppFooter />
              </Suspense>
            </div>
          </TooltipProvider>
          <Toaster />
          <Suspense fallback={null}>
            <OAuthResultToastSlot />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
