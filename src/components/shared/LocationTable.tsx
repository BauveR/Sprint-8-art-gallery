import { Button } from "@/components/ui/button";
import { LocationTableProps } from "../../types/components";

export default function LocationTable<T>({
  items,
  isLoading,
  error,
  emptyMessage,
  onEdit,
  onDelete,
  isDeleting,
  getItemId,
  renderRow,
  headers,
}: LocationTableProps<T>) {
  return (
    <div className="bg-card text-card-foreground rounded-xl shadow overflow-x-auto border dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="text-left p-2">
                {header}
              </th>
            ))}
            <th className="text-left p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={getItemId(item)} className="border-t">
              {renderRow(item)}
              <td className="p-2 space-x-2">
                <Button variant="ghost" onClick={() => onEdit(item)}>
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDelete(getItemId(item))}
                  disabled={isDeleting}
                  className="text-red-600"
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {!isLoading && items.length === 0 && (
            <tr>
              <td className="p-4 text-gray-500" colSpan={headers.length + 1}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isLoading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
      {error && <div className="p-3 text-sm text-red-600">Error: {error.message}</div>}
    </div>
  );
}
