import Link from "next/link";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

export async function AppFooter() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const generalLinks = [
    { label: dict.home.footer.about, href: "/about" },
    { label: dict.home.footer.techStack, href: "/tech-stack" },
  ];

  // PRD 3.8: 개발자/QA용 내부 문서 페이지(아이콘 검색, 컴포넌트 갤러리)만 이 그룹에 넣는다.
  // /avatars, /charts는 /about 페이지의 갤러리 카드에서 계속 접근 가능하다.
  const devDocsLinks = [
    { label: dict.home.footer.iconGallery, href: "/icons" },
    { label: dict.home.footer.componentGallery, href: "/gallery" },
  ];

  return (
    <footer className="flex w-full flex-col items-center gap-6 border-t py-10 text-center text-sm text-muted-foreground">
      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {generalLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col items-center gap-1.5">
        <span className="text-xs font-medium tracking-wide text-muted-foreground/70 uppercase">
          {dict.nav.devDocsLabel}
        </span>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {devDocsLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs underline-offset-4 hover:text-foreground hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <p className="text-xs">
        Developed by{" "}
        <a
          href="mailto:archy712@gmail.com"
          className="font-medium underline-offset-4 hover:underline"
        >
          archy712@gmail.com
        </a>
      </p>
    </footer>
  );
}
