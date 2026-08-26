import type { LegalDocument } from "@/lib/legal/types";

/**
 * 개인정보 처리방침·이용약관 공용 렌더러.
 *
 * 본문은 한국어 정본 하나뿐이라(Task 034 결정 D-3) 이 컴포넌트는 번역을 받지 않고,
 * 페이지가 로케일에 맞춰 옮긴 머리말(`localizedHeading`)만 위에 얹어 준다.
 */
export function LegalDocumentView({
  doc,
  localizedHeading,
  localizedDescription,
  effectiveDateLabel,
  canonicalNotice,
}: {
  doc: LegalDocument;
  localizedHeading: string;
  localizedDescription: string;
  effectiveDateLabel: string;
  /** 비한국어 로케일에서 "정본은 한국어"임을 알리는 안내. 한국어면 null. */
  canonicalNotice: string | null;
}) {
  return (
    <div className="flex w-full max-w-3xl flex-col gap-10 px-5 py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold">{localizedHeading}</h1>
        <p className="text-muted-foreground">{localizedDescription}</p>
        <p className="text-sm text-muted-foreground">
          {effectiveDateLabel}: {doc.effectiveDate} · v{doc.version}
        </p>
        {canonicalNotice && (
          <p className="rounded-md border border-dashed px-4 py-3 text-sm text-muted-foreground">
            {canonicalNotice}
          </p>
        )}
      </header>

      <article lang="ko" className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          {doc.preamble.map((text) => (
            <p key={text} className="leading-relaxed">
              {text}
            </p>
          ))}
        </div>

        {doc.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">{section.heading}</h2>

            {section.paragraphs?.map((text) => (
              <p key={text} className="leading-relaxed">
                {text}
              </p>
            ))}

            {section.list && (
              <ul className="flex list-outside list-disc flex-col gap-2 pl-5">
                {section.list.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {section.table && (
              // 표는 모바일에서 가장 먼저 넘치는 요소라 자체 스크롤 컨테이너에 가둔다.
              <div className="w-full overflow-x-auto rounded-md border">
                <table className="w-full min-w-[36rem] border-collapse text-sm">
                  {section.table.caption && (
                    <caption className="px-4 py-2 text-left text-muted-foreground">
                      {section.table.caption}
                    </caption>
                  )}
                  <thead className="bg-muted/50">
                    <tr>
                      {section.table.headers.map((header) => (
                        <th
                          key={header}
                          scope="col"
                          className="border-b px-4 py-3 text-left font-medium"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr
                        key={row.join("|")}
                        className="border-b last:border-0"
                      >
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3 align-top">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section.notes?.map((text) => (
              <p key={text} className="leading-relaxed text-muted-foreground">
                {text}
              </p>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
