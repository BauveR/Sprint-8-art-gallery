import * as React from "react";

/**
 * Tipos de entrada
 */
export type TableHeader = {
  key: string;
  label: string;
  className?: string;
};

export type TableRow = {
  key: React.Key;
  /**
   * Contenido que se muestra como "preview" en móvil (fila plegable).
   * Ej: nombre + subtítulo/fechas.
   */
  preview?: React.ReactNode;
  /**
   * Celdas por clave (debe corresponder con headers[key])
   */
  cells: Record<string, React.ReactNode>;
};

export function TableCollapsible({
  headers,
  rows,
  emptyMessage = "Sin datos",
}: {
  headers: TableHeader[];
  rows: TableRow[];
  emptyMessage?: string;
}) {
  // Desktop: tabla estándar
  // Móvil: lista con filas plegables (summary/details)
  return (
    <div className="w-full">
      {/* Desktop */}
      <div className="hidden md:block bg-white/80 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h) => (
                <th key={`th-${h.key}`} className={`text-left p-2 ${h.className ?? ""}`}>
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="p-4 text-gray-500" colSpan={headers.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.key} className="border-t align-top">
                  {headers.map((h) => (
                    <td key={`td-${String(r.key)}-${h.key}`} className="p-2">
                      {r.cells[h.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile (plegable) */}
      <div className="md:hidden space-y-2">
        {rows.length === 0 ? (
          <div className="p-4 rounded-xl border bg-white/80 text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          rows.map((r) => (
            <details
              key={`mob-${r.key}`}
              className="rounded-xl border bg-white/80 open:shadow"
            >
              <summary className="list-none cursor-pointer select-none p-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">{r.preview ?? r.cells[headers[0]?.key]}</div>
                <span className="text-xs text-gray-500">Detalles</span>
              </summary>
              <div className="px-3 pb-3">
                <div className="grid grid-cols-1 gap-2">
                  {headers.map((h) => (
                    <div
                      key={`mob-cell-${String(r.key)}-${h.key}`}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <div className="text-gray-500">{h.label}</div>
                      <div className="text-right">{r.cells[h.key]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </details>
          ))
        )}
      </div>
    </div>
  );
}
