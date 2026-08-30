import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/get-locale";
import { csvResponseHeaders, toCsv, type CsvValue } from "@/lib/woodong/csv";
import {
  buildDuesTable,
  buildExpensesTable,
  buildPaymentsTable,
  buildSettlementsTable,
  isExportDataset,
  type CsvTable,
} from "@/lib/woodong/exports";
import { getDuesOverview } from "@/lib/woodong/queries/dues";
import { listGroupExpensesForExport } from "@/lib/woodong/queries/expenses";
import { getGroupDetail, listGroupMembers } from "@/lib/woodong/queries/groups";
import { listSettlementsWithItems } from "@/lib/woodong/queries/settlements";

/**
 * 회비·지출·정산 CSV 내보내기 (Task 040, PRD 9장 "정산 데이터 이관 부재").
 *
 * **왜 Server Action이 아니라 Route Handler인가**: 결과물이 화면 갱신이 아니라 *파일*이다.
 * Server Action은 응답 헤더(`Content-Disposition`)를 정할 수 없어서 브라우저에 다운로드로
 * 넘기려면 문자열을 클라이언트까지 실어 보내 Blob으로 다시 만들어야 한다 — 장부 전체를
 * 번들 payload에 담게 되고, 링크 하나면 되는 일에 클라이언트 코드가 붙는다.
 *
 * **총무 전용**이다. RLS는 회비·지출 조회를 멤버 전원에게 열어 두지만(화면이 그렇게 동작한다),
 * 이 엔드포인트는 멤버별 납부 상태와 사용자 id가 한 파일로 통째로 나가는 경로다. 인수인계라는
 * 목적 자체가 총무의 일이므로 앱에서 역할을 한 번 더 확인한다. RLS를 대체하는 게 아니라
 * 그 위에 얹는 방어다 — 총무가 아닌 사람이 URL을 직접 열어도 403으로 끝난다.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { groupId } = await params;
  const { searchParams } = new URL(request.url);
  const dataset = searchParams.get("dataset") ?? "";
  const settlementId = searchParams.get("settlementId") ?? undefined;

  if (!isExportDataset(dataset)) {
    return NextResponse.json({ error: "Unknown dataset" }, { status: 400 });
  }

  const detail = await getGroupDetail(supabase, groupId, claimsData.claims.sub);

  // 비멤버(0행)와 일반회원을 같은 403으로 처리한다. "멤버는 아니지만 모임은 존재한다"를
  // 응답 코드로 알려 줄 이유가 없다.
  if (!detail || detail.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const groupName = detail.group.name;
  const unnamedMemberLabel = dict.groups.members.unnamedMemberLabel;

  let table: CsvTable;

  switch (dataset) {
    case "dues":
    case "payments": {
      // 두 데이터셋 모두 같은 묶음(회차·청구·납부)에서 나온다. 멤버 이름 해석에는 멤버 목록이
      // 필요한데 서로의 결과를 쓰지 않으므로 나란히 읽는다.
      const [overview, members] = await Promise.all([
        getDuesOverview(supabase, groupId),
        listGroupMembers(supabase, groupId, claimsData.claims.sub),
      ]);

      table =
        dataset === "dues"
          ? buildDuesTable({
              overview,
              members,
              labels: dict.exports,
              statusLabels: dict.dues.status,
              dueTypeLabels: dict.dues.type,
              unnamedMemberLabel,
              groupName,
            })
          : buildPaymentsTable({
              overview,
              members,
              labels: dict.exports,
              unnamedMemberLabel,
              groupName,
            });
      break;
    }

    case "expenses": {
      const [expenses, members] = await Promise.all([
        listGroupExpensesForExport(supabase, groupId),
        listGroupMembers(supabase, groupId, claimsData.claims.sub),
      ]);

      table = buildExpensesTable({
        expenses,
        members,
        labels: dict.exports,
        categoryLabels: dict.expenses.category,
        unnamedMemberLabel,
        groupName,
      });
      break;
    }

    case "settlements": {
      const details = await listSettlementsWithItems(
        supabase,
        groupId,
        settlementId,
      );

      table = buildSettlementsTable({
        details,
        labels: dict.exports,
        statusLabels: {
          draft: dict.settlements.statusDraft,
          published: dict.settlements.statusPublished,
        },
        // 항목 카테고리 문구는 화면과 같은 사전을 쓴다. 파일에만 다른 이름이 찍히면
        // 리포트 화면과 대조할 수 없다.
        categoryLabels: {
          dueType: dict.dues.type,
          expense: dict.expenses.category,
        },
        groupName,
      });
      break;
    }
  }

  const body = toCsv(table.headers, table.rows as CsvValue[][]);

  return new NextResponse(body, {
    headers: csvResponseHeaders(table.filename),
  });
}
