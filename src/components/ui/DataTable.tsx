import { useMemo, useState } from "react";

export type Column<T> = {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  // Si usas serverSort, no se aplica sort local y solo se llama onSortChange
  cell?: (row: T) => React.ReactNode;
};

export type SortState = { key: string; dir: "asc" | "desc" } | null;

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  // --- Ordenamiento controlado ---
  sort?: SortState;
  onSortChange?: (next: SortState) => void;
  serverSort?: boolean; // si true, NO ordena localmente
};

export function DataTable<T>({
  columns,
  data,
  rowKey,
  sort,
  onSortChange,
  serverSort = false,
}: Props<T>) {
  const [localSort, setLocalSort] = useState<SortState>(null);

  const activeSort = sort ?? localSort;

  const sorted = useMemo(() => {
    if (serverSort) return data; // el servidor ya mandó ordenado
    if (!activeSort) return data;
    const col = activeSort.key;
    const dir = activeSort.dir === "desc" ? -1 : 1;
    return [...data].sort((a: any, b: any) => {
      const av = a[col];
      const bv = b[col];
      if (av == null && bv == null) return 0;
      if (av == null) return -1 * dir;
      if (bv == null) return 1 * dir;
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }, [data, activeSort, serverSort]);

  const handleHeaderClick = (c: Column<T>) => {
    if (!c.sortable) return;
    const current = activeSort?.key === c.key ? activeSort.dir : null;
    const nextDir = current === "asc" ? "desc" : "asc";
    const next: SortState = { key: c.key, dir: nextDir ?? "asc" };
    if (onSortChange) onSortChange(next);
    else setLocalSort(next);
  };

  return (
    <div className="bg-white/80 rounded-xl shadow overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => {
              const isActive = activeSort?.key === c.key;
              return (
                <th
                  key={c.key}
                  style={c.width ? { width: c.width } : undefined}
                  className={`text-left p-2 ${c.sortable ? "cursor-pointer select-none" : ""}`}
                  onClick={() => handleHeaderClick(c)}
                >
                  <div className="inline-flex items-center gap-1">
                    {c.header}
                    {c.sortable && (
                      <span className="text-xs text-gray-500">
                        {isActive ? (activeSort?.dir === "asc" ? "▲" : "▼") : "↕"}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={rowKey(row)} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="p-2">
                  {c.cell ? c.cell(row) : (row as any)[c.key]}
                </td>
              ))}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td className="p-4 text-gray-500" colSpan={columns.length}>
                Sin datos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
