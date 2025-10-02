import { useState } from "react";
import { useTiendas, useCreateTienda } from "../../query/tiendas";
import { TiendaInput } from "../../types";
import { TableCollapsible } from "../common/TableCollapsible";

const empty: TiendaInput = { nombre: "", lat: 0, lng: 0, url_tienda: "" };

export default function TiendasPage() {
  const { data: list = [], isLoading, error } = useTiendas();
  const createTienda = useCreateTienda();
  const [form, setForm] = useState<TiendaInput>(empty);

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createTienda.mutate(
      { ...form, lat: Number(form.lat), lng: Number(form.lng) },
      { onSuccess: () => setForm(empty) }
    );
  };

  const headers = [
    { key: "id", label: "#", className: "w-16" },
    { key: "nombre", label: "Nombre" },
    { key: "url", label: "URL", className: "w-28" },
    { key: "pos", label: "Lat/Lng" },
  ];

  const rows = list.map((t) => ({
    key: t.id_tienda,
    preview: (
      <div className="text-sm">
        <div className="font-medium truncate">{t.nombre}</div>
        <div className="text-xs text-gray-600 truncate">
          {t.lat}, {t.lng}
        </div>
      </div>
    ),
    cells: {
      id: t.id_tienda,
      nombre: t.nombre,
      url: t.url_tienda ? (
        <a className="text-blue-600 underline" href={t.url_tienda} target="_blank">
          link
        </a>
      ) : (
        "—"
      ),
      pos: `${t.lat}, ${t.lng}`,
    },
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Tiendas</h2>

      {/* Alta tienda */}
      <form
        onSubmit={onCreate}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white/80 p-4 rounded-xl shadow"
      >
        <input
          className="border rounded p-2"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="URL"
          value={form.url_tienda ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, url_tienda: e.target.value }))}
        />
        <input
          className="border rounded p-2"
          placeholder="Lat"
          type="number"
          step="0.000001"
          value={form.lat}
          onChange={(e) => setForm((f) => ({ ...f, lat: Number(e.target.value) }))}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Lng"
          type="number"
          step="0.000001"
          value={form.lng}
          onChange={(e) => setForm((f) => ({ ...f, lng: Number(e.target.value) }))}
          required
        />
        <div className="md:col-span-2">
          <button
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-40"
            disabled={createTienda.isPending}
          >
            {createTienda.isPending ? "Creando..." : "Crear tienda"}
          </button>
        </div>
      </form>

      {/* Listado con tabla shadcn + plegable móvil */}
      <div>
        {isLoading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
        {error && (
          <div className="p-3 text-sm text-red-600">Error: {(error as any).message}</div>
        )}
        <TableCollapsible headers={headers} rows={rows} />
      </div>
    </div>
  );
}
