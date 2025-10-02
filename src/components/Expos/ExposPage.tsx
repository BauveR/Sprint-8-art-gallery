import { useState } from "react";
import { useExpos, useCreateExpo } from "../../query/expos";
import { ExpoInput } from "../../types";
import ExposCalendarDots from "./ExposCalendarDots";
import { TableCollapsible } from "../common/TableCollapsible";

const emptyExpo: ExpoInput = {
  nombre: "",
  lat: 0,
  lng: 0,
  fecha_inicio: "",
  fecha_fin: "",
  url_expo: "",
};

export default function ExposPage() {
  const { data: list = [], isLoading, error } = useExpos();
  const createExpo = useCreateExpo();
  const [form, setForm] = useState<ExpoInput>(emptyExpo);

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createExpo.mutate(
      { ...form, lat: Number(form.lat), lng: Number(form.lng) },
      { onSuccess: () => setForm(emptyExpo) }
    );
  };

  const headers = [
    { key: "id", label: "#", className: "w-16" },
    { key: "nombre", label: "Nombre" },
    { key: "fechas", label: "Fechas" },
    { key: "url", label: "URL", className: "w-28" },
  ];

  const rows = list.map((x) => ({
    key: x.id_expo,
    preview: (
      <div className="text-sm">
        <div className="font-medium truncate">{x.nombre}</div>
        <div className="text-xs text-gray-600">
          {x.fecha_inicio} → {x.fecha_fin}
        </div>
      </div>
    ),
    cells: {
      id: x.id_expo,
      nombre: x.nombre,
      fechas: `${x.fecha_inicio} → ${x.fecha_fin}`,
      url: x.url_expo ? (
        <a className="text-blue-600 underline" href={x.url_expo} target="_blank">
          link
        </a>
      ) : (
        "—"
      ),
    },
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Exposiciones</h2>

      {/* Calendario con indicadores */}
      <ExposCalendarDots expos={list} />

      {/* Alta expo */}
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
          value={form.url_expo ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, url_expo: e.target.value }))}
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
        <input
          className="border rounded p-2"
          placeholder="Inicio (YYYY-MM-DD)"
          value={form.fecha_inicio}
          onChange={(e) => setForm((f) => ({ ...f, fecha_inicio: e.target.value }))}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Fin (YYYY-MM-DD)"
          value={form.fecha_fin}
          onChange={(e) => setForm((f) => ({ ...f, fecha_fin: e.target.value }))}
          required
        />
        <div className="md:col-span-2">
          <button
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-40"
            disabled={createExpo.isPending}
          >
            {createExpo.isPending ? "Creando..." : "Crear exposición"}
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
