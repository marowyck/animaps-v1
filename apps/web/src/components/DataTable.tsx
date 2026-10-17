import type { KeyboardEvent, ReactNode } from "react";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  caption?: string;
};

/** Table from `md` up; stacked list on small screens (first column is the title). */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  empty,
  caption,
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) return <>{empty}</>;

  const activate = (row: T) => (e: KeyboardEvent<HTMLElement>) => {
    if (!onRowClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick(row);
    }
  };
  const [lead, ...restColumns] = columns;

  return (
    <>
      <ul className="space-y-2.5 md:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li key={getRowId(row)}>
            <div
              role={onRowClick ? "button" : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={activate(row)}
              className={[
                "rounded-2xl border border-border-subtle bg-surface p-4 shadow-sm",
                onRowClick
                  ? "cursor-pointer transition-colors duration-(--duration-fast) hover:border-primary/30 hover:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  : "",
              ].join(" ")}
            >
              {lead ? <div className="text-body font-semibold text-text">{lead.cell(row)}</div> : null}
              <dl className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border-subtle/70 pt-2.5">
                {restColumns.map((column) => (
                  <div key={column.id} className="min-w-0">
                    <dt className="text-caption text-text-muted">{column.header}</dt>
                    <dd className="mt-0.5 text-body-sm text-text">{column.cell(row)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-2xl border border-border-subtle bg-surface md:block">
        <table className="w-full border-collapse text-left">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-border-subtle bg-background/60">
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={[
                    "px-4 py-3 text-caption font-semibold uppercase tracking-wider text-text-secondary",
                    column.className ?? "",
                  ].join(" ")}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const id = getRowId(row);
              return (
                <tr
                  key={id}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={activate(row)}
                  className={[
                    "border-b border-border-subtle last:border-0",
                    onRowClick
                      ? "cursor-pointer transition-colors duration-(--duration-fast) hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                      : "",
                  ].join(" ")}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={["px-4 py-3.5 text-body-sm text-text", column.className ?? ""].join(" ")}
                    >
                      {column.cell(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
