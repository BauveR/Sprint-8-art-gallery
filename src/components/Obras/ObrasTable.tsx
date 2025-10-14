import { Obra } from "../../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ESTADO_CONFIG } from "../../lib/estadoConfig";

type ObrasTableProps = {
  obras: Obra[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  headerBtn: (label: string, key: string) => {
    label: string;
    active: boolean;
    dir: "asc" | "desc";
    onClick: () => void;
  };
  onEdit: (obra: Obra) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
};

export default function ObrasTable({
  obras,
  isLoading,
  error,
  searchQuery,
  headerBtn,
  onEdit,
  onDelete,
  isDeleting,
}: ObrasTableProps) {
  return (
    <div className="bg-card text-card-foreground rounded-xl shadow overflow-x-auto border dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
      <table className="min-w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {[
              { label: "#", key: "id_obra" },
              { label: "Autor", key: "autor" },
              { label: "Título", key: "titulo" },
              { label: "Estado", key: "estado_venta" },
              { label: "Ubicación", key: "ubicacion" },
              { label: "Tienda", key: "tienda_nombre" },
              { label: "Expo", key: "expo_nombre" },
            ].map(({ label, key }) => {
              const btn = headerBtn(label, key);
              return (
                <th key={key} className="text-left p-2">
                  <button
                    className={`inline-flex items-center gap-1 ${btn.active ? "font-semibold" : ""}`}
                    onClick={btn.onClick}
                    title="Ordenar"
                  >
                    {label}
                    {btn.active && (btn.dir === "asc" ? "▲" : "▼")}
                  </button>
                </th>
              );
            })}
            <th className="text-left p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {obras.map((o) => (
            <tr key={`obra-${o.id_obra}`} className="border-t align-top">
              <td className="p-2">{o.id_obra}</td>
              <td className="p-2">{o.autor}</td>
              <td className="p-2">{o.titulo}</td>
              <td className="p-2">
                <Badge
                  className={`text-xs font-medium border ${
                    ESTADO_CONFIG[o.estado_venta].badgeClass
                  }`}
                >
                  {ESTADO_CONFIG[o.estado_venta].label}
                </Badge>
              </td>
              <td className="p-2">
                <Badge variant="outline">
                  {o.ubicacion === "en_exposicion" && "Exposición"}
                  {o.ubicacion === "en_tienda" && "Tienda Física"}
                  {o.ubicacion === "tienda_online" && "Tienda Online"}
                  {o.ubicacion === "almacen" && "Almacén"}
                </Badge>
              </td>
              <td className="p-2">{o.tienda_nombre ?? "—"}</td>
              <td className="p-2">{o.expo_nombre ?? "—"}</td>
              <td className="p-2 space-x-2">
                <Button variant="ghost" onClick={() => onEdit(o)}>
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onDelete(o.id_obra)}
                  disabled={isDeleting}
                  className="text-red-600"
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {!isLoading && obras.length === 0 && (
            <tr>
              <td className="p-4 text-gray-500" colSpan={8}>
                {searchQuery ? "No se encontraron obras con ese criterio" : "Sin obras"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isLoading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
      {error && (
        <div className="p-3 text-sm text-red-600">
          Error: {error instanceof Error ? error.message : String(error)}
        </div>
      )}
    </div>
  );
}
