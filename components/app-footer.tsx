import Link from "next/link";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";

export async function AppFooter() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  // 개발자/QA용 내부 문서 페이지(아이콘·컴포넌트·차트·아바타 갤러리)도 별도 그룹/라벨 없이
  // 일반 링크와 한 줄에 나란히 배치한다. 스타터킷 소개(/about) 링크는 노출하지 않는다.
  const links = [
    { label: dict.home.footer.techStack, href: "/tech-stack" },
    { label: dict.home.footer.iconGallery, href: "/icons" },
    { label: dict.home.footer.componentGallery, href: "/gallery" },
    { label: dict.home.footer.chartGallery, href: "/charts" },
    { label: dict.home.footer.avatarGallery, href: "/avatars" },
  ];

  // 법적 고지는 데모 페이지와 성격이 달라 같은 줄에 섞지 않고 별도 행에 둔다(Task 034).
  const legalLinks = [
    { label: dict.home.footer.termsOfService, href: "/terms" },
    { label: dict.home.footer.privacyPolicy, href: "/privacy" },
  ];

  return (
    <footer className="flex w-full flex-col items-center gap-6 border-t py-10 text-center text-sm text-muted-foreground">
      <nav className="flex flex-wrap items-center justify-center divide-x divide-muted-foreground/25">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center px-4 underline-offset-4 first:pl-0 last:pr-0 hover:text-foreground hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <nav className="flex flex-wrap items-center justify-center divide-x divide-muted-foreground/25">
        {legalLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center px-4 font-medium text-foreground/70 underline-offset-4 first:pl-0 last:pr-0 hover:text-foreground hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <p className="text-xs">
        Developed by{" "}
        <a
          href="mailto:archy712@gmail.com"
          className="inline-flex min-h-11 items-center font-medium underline-offset-4 hover:underline"
        >
          archy712@gmail.com
        </a>
      </p>
    </footer>
  );
}
