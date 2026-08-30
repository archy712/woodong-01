"use client";

import { DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EXPORT_DATASETS } from "@/lib/woodong/exports";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * 회비·지출·정산 CSV 내보내기 메뉴 (Task 040).
 *
 * 항목이 **평범한 `<a>` 링크**인 것이 핵심이다. 다운로드는 Route Handler가 붙이는
 * `Content-Disposition`으로 브라우저가 처리하므로, 파일 내용을 클라이언트로 가져와 Blob을
 * 만들거나 `URL.createObjectURL()`을 해제할 일이 없다. 그래서 이 컴포넌트에는 상태가 없다.
 *
 * `download` 속성은 일부러 붙이지 않는다. 붙이면 브라우저가 URL 끝(`export`)을 파일명으로 삼아
 * 서버가 지정한 한글 파일명을 덮어쓴다.
 */
export function ExportMenu({
  groupId,
  labels,
}: {
  groupId: string;
  labels: Dictionary["exports"];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <DownloadIcon />
          {labels.menuLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-72">
        <DropdownMenuLabel className="text-xs font-normal whitespace-normal text-muted-foreground">
          {labels.menuDescription}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {EXPORT_DATASETS.map((dataset) => (
          <DropdownMenuItem key={dataset} asChild>
            <a
              href={`/protected/groups/${groupId}/dues/export?dataset=${dataset}`}
            >
              {labels.datasetLabel[dataset]}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
