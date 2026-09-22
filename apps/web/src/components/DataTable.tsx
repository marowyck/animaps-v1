import type { ReactNode } from "react";

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

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  onRowClick,
  empty,
  caption,
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) return <>{empty}</>;

  return (
    <div className="overflow-hidden rounded-2xl border border-border-subtle bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-border-subtle bg-background">
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={[
                    "px-4 py-3 text-caption font-semibold uppercase tracking-wide text-text-muted",
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
                  className={[
                    "border-b border-border-subtle last:border-0",
                    onRowClick ? "cursor-pointer hover:bg-surface-hover" : "",
                  ].join(" ")}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={["px-4 py-3 text-body-sm text-text", column.className ?? ""].join(" ")}
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
    </div>
  );
}
