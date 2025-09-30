import * as React from "react";

export type Column<T> = {
  key: keyof T | string;
  header: string | React.ReactNode;
  width?: string;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => React.Key;
  className?: string;
  onSortChange?: (key: string, dir: "asc" | "desc") => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  className = "",
  onSortChange,
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const sorted = React.useMemo(() => {
    if (!sort) return data;
    const { key, dir } = sort;
    return [...data].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av == null && bv != null) return dir === "asc" ? -1 : 1;
      if (av != null && bv == null) return dir === "asc" ? 1 : -1;
      if (av == null && bv == null) return 0;
      if (typeof av === "number" && typeof bv === "number") {
        return dir === "asc" ? av - bv : bv - av;
      }
      return dir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [data, sort]);

  const toggleSort = (key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
    const next = !sort || sort.key !== key ? { key, dir: "asc" } : sort.dir === "asc" ? { key, dir: "desc" } : null;
    if (next && onSortChange) onSortChange(next.key, next.dir);
  };

  return (
    <div className={`bg-white/80 rounded-xl shadow overflow-x-auto ${className}`}>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => {
              const isSorted = sort?.key === c.key;
              const arrow = isSorted ? (sort?.dir === "asc" ? " ▲" : " ▼") : "";
              return (
                <th
                  key={String(c.key)}
                  className="text-left p-2 cursor-pointer select-none"
                  style={{ width: c.width }}
                  onClick={() => c.sortable && toggleSort(String(c.key))}
                >
                  <span className={c.sortable ? "underline decoration-dotted" : ""}>
                    {c.header}
                    {c.sortable && <span className="opacity-70">{arrow}</span>}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={rowKey(row)} className="border-t">
              {columns.map((c) => (
                <td key={String(c.key)} className="p-2">
                  {c.cell ? c.cell(row) : String(row[c.key as keyof T] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr><td className="p-4 text-gray-500" colSpan={columns.length}>Sin resultados</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
