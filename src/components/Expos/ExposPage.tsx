import { useState } from "react";
import { useExpos, useCreateExpo } from "../../query/expos";
import { ExpoInput } from "../../types";

const empty: ExpoInput = {
  nombre: "", lat: 0, lng: 0, fecha_inicio: "", fecha_fin: "", url_expo: ""
};

export default function ExposPage() {
  const { data: list = [], isLoading, error } = useExpos();
  const createExpo = useCreateExpo();

  const [form, setForm] = useState<ExpoInput>(empty);

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createExpo.mutate(
      { ...form, lat: Number(form.lat), lng: Number(form.lng) },
      { onSuccess: () => setForm(empty) }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Exposiciones</h2>

      <form onSubmit={onCreate} className="grid grid-cols-2 gap-3 bg-white/80 p-4 rounded-xl shadow">
        <input className="border rounded p-2" placeholder="Nombre" value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
        <input className="border rounded p-2" placeholder="URL" value={form.url_expo ?? ""}
          onChange={e => setForm(f => ({ ...f, url_expo: e.target.value }))} />
        <input className="border rounded p-2" placeholder="Lat" type="number" step="0.000001" value={form.lat}
          onChange={e => setForm(f => ({ ...f, lat: Number(e.target.value) }))} required />
        <input className="border rounded p-2" placeholder="Lng" type="number" step="0.000001" value={form.lng}
          onChange={e => setForm(f => ({ ...f, lng: Number(e.target.value) }))} required />
        <input className="border rounded p-2" placeholder="Inicio (YYYY-MM-DD)" value={form.fecha_inicio}
          onChange={e => setForm(f => ({ ...f, fecha_inicio: e.target.value }))} required />
        <input className="border rounded p-2" placeholder="Fin (YYYY-MM-DD)" value={form.fecha_fin}
          onChange={e => setForm(f => ({ ...f, fecha_fin: e.target.value }))} required />
        <div className="col-span-2">
          <button
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-40"
            disabled={createExpo.isPending}
          >
            {createExpo.isPending ? "Creando..." : "Crear exposición"}
          </button>
        </div>
      </form>

      <div className="bg-white/80 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">#</th><th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Fechas</th><th className="text-left p-2">URL</th>
            </tr>
          </thead>
          <tbody>
            {list.map(x => (
              <tr key={`expo-${x.id_expo}`} className="border-t">
                <td className="p-2">{x.id_expo}</td>
                <td className="p-2">{x.nombre}</td>
                <td className="p-2">{x.fecha_inicio} → {x.fecha_fin}</td>
                <td className="p-2">
                  {x.url_expo ? <a className="text-blue-600 underline" href={x.url_expo} target="_blank">link</a> : "—"}
                </td>
              </tr>
            ))}
            {(!isLoading && list.length === 0) && (
              <tr><td className="p-4 text-gray-500" colSpan={4}>Sin expos</td></tr>
            )}
          </tbody>
        </table>
        {isLoading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
        {error && <div className="p-3 text-sm text-red-600">Error: {(error as any).message}</div>}
      </div>
    </div>
  );
}
