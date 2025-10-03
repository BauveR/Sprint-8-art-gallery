import { useState } from "react";
import { useExpos, useCreateExpo, useUpdateExpo, useRemoveExpo } from "../../query/expos";
import { Expo, ExpoInput } from "../../types";
import { Button } from "@/components/ui/button";

const empty: ExpoInput = {
  nombre: "", lat: 0, lng: 0, fecha_inicio: "", fecha_fin: "", url_expo: null
};

type EditState = { id: number; form: ExpoInput } | null;

export default function ExposPage() {
  const { data: list = [], isLoading, error } = useExpos();
  const createExpo = useCreateExpo();
  const updateExpo = useUpdateExpo();
  const removeExpo = useRemoveExpo();

  const [form, setForm] = useState<ExpoInput>(empty);
  const [edit, setEdit] = useState<EditState>(null);

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createExpo.mutate(
      { ...form, lat: Number(form.lat), lng: Number(form.lng) },
      { onSuccess: () => setForm(empty) }
    );
  };

  const onDelete = (id: number) => {
    if (!confirm("¿Eliminar la exposición?")) return;
    removeExpo.mutate(id);
  };

  const startEdit = (x: Expo) => {
    setEdit({
      id: x.id_expo,
      form: {
        nombre: x.nombre,
        lat: x.lat,
        lng: x.lng,
        fecha_inicio: x.fecha_inicio,
        fecha_fin: x.fecha_fin,
        url_expo: x.url_expo ?? null,
      },
    });
  };

  const cancelEdit = () => setEdit(null);

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    updateExpo.mutate(
      { id: edit.id, input: { ...edit.form, lat: Number(edit.form.lat), lng: Number(edit.form.lng) } },
      { onSuccess: () => setEdit(null) }
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Exposiciones</h2>

      <form onSubmit={onCreate} className="grid grid-cols-2 gap-3 bg-white/80 p-4 rounded-xl shadow">
        <input className="border rounded p-2" placeholder="Nombre" value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
        <input className="border rounded p-2" placeholder="URL" value={form.url_expo ?? ""}
          onChange={e => setForm(f => ({ ...f, url_expo: e.target.value || null }))} />
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
              <th className="text-left p-2">Acciones</th>
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
                <td className="p-2 space-x-2">
                  <Button variant="ghost" onClick={() => startEdit(x)}>Editar</Button>
                  <Button variant="ghost" onClick={() => onDelete(x.id_expo)} disabled={removeExpo.isPending} className="text-red-600">
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
            {(!isLoading && list.length === 0) && (
              <tr><td className="p-4 text-gray-500" colSpan={5}>Sin expos</td></tr>
            )}
          </tbody>
        </table>
        {isLoading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
        {error && <div className="p-3 text-sm text-red-600">Error: {(error as any).message}</div>}
      </div>

      {/* Modal edición */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editar exposición #{edit.id}</h3>
              <button onClick={cancelEdit} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <form onSubmit={saveEdit} className="grid grid-cols-2 gap-3">
              <input className="border rounded p-2" placeholder="Nombre" value={edit.form.nombre}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, nombre: e.target.value } })} required />
              <input className="border rounded p-2" placeholder="URL" value={edit.form.url_expo ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, url_expo: e.target.value || null } })} />
              <input className="border rounded p-2" placeholder="Lat" type="number" step="0.000001" value={edit.form.lat}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, lat: Number(e.target.value) } })} required />
              <input className="border rounded p-2" placeholder="Lng" type="number" step="0.000001" value={edit.form.lng}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, lng: Number(e.target.value) } })} required />
              <input className="border rounded p-2" placeholder="Inicio (YYYY-MM-DD)" value={edit.form.fecha_inicio}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, fecha_inicio: e.target.value } })} required />
              <input className="border rounded p-2" placeholder="Fin (YYYY-MM-DD)" value={edit.form.fecha_fin}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, fecha_fin: e.target.value } })} required />
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-lg bg-gray-100">Cancelar</button>
                <Button disabled={updateExpo.isPending}>
                  {updateExpo.isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
