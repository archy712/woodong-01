"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type GroupNavTabsLabels = {
  home: string;
  announcements: string;
  dues: string;
  votes: string;
  settings: string;
};

export function GroupNavTabs({
  groupId,
  labels,
}: {
  groupId: string;
  labels: GroupNavTabsLabels;
}) {
  const pathname = usePathname();
  const base = `/protected/groups/${groupId}`;

  const tabs = [
    { href: base, label: labels.home, isActive: pathname === base },
    {
      href: `${base}/announcements`,
      label: labels.announcements,
      isActive: pathname.startsWith(`${base}/announcements`),
    },
    {
      href: `${base}/dues`,
      label: labels.dues,
      isActive: pathname.startsWith(`${base}/dues`),
    },
    {
      href: `${base}/votes`,
      label: labels.votes,
      isActive: pathname.startsWith(`${base}/votes`),
    },
    {
      href: `${base}/settings`,
      label: labels.settings,
      isActive: pathname.startsWith(`${base}/settings`),
    },
  ];

  return (
    <nav className="sticky top-16 z-30 w-full overflow-x-auto border-b bg-background">
      <div className="flex w-full min-w-max items-center gap-1 px-5">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex h-12 min-w-11 items-center justify-center border-b-2 px-3 text-sm font-medium whitespace-nowrap transition-colors",
              tab.isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
