import { useEffect, useState } from "react";
import { tiendasService } from "../../services/tiendasService";
import { Tienda, TiendaInput } from "../../types";

const empty: TiendaInput = { nombre: "", lat: 0, lng: 0, url_tienda: "" };

export default function TiendasPage() {
  const [list, setList] = useState<Tienda[]>([]);
  const [form, setForm] = useState<TiendaInput>(empty);

  const load = async () => setList(await tiendasService.list());
  useEffect(() => { load(); }, []);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await tiendasService.create({ ...form, lat: Number(form.lat), lng: Number(form.lng) });
    setForm(empty);
    await load();
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Tiendas</h2>

      <form onSubmit={onCreate} className="grid grid-cols-2 gap-3 bg-white/80 p-4 rounded-xl shadow">
        <input className="border rounded p-2" placeholder="Nombre" value={form.nombre}
          onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} required />
        <input className="border rounded p-2" placeholder="URL" value={form.url_tienda ?? ""}
          onChange={e => setForm(f => ({ ...f, url_tienda: e.target.value }))} />
        <input className="border rounded p-2" placeholder="Lat" type="number" step="0.000001" value={form.lat}
          onChange={e => setForm(f => ({ ...f, lat: Number(e.target.value) }))} required />
        <input className="border rounded p-2" placeholder="Lng" type="number" step="0.000001" value={form.lng}
          onChange={e => setForm(f => ({ ...f, lng: Number(e.target.value) }))} required />
        <div className="col-span-2">
          <button className="px-4 py-2 rounded-lg bg-black text-white">Crear tienda</button>
        </div>
      </form>

      <div className="bg-white/80 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">#</th><th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">URL</th><th className="text-left p-2">Lat/Lng</th>
            </tr>
          </thead>
          <tbody>
            {list.map(t => (
              <tr key={t.id_tienda} className="border-t">
                <td className="p-2">{t.id_tienda}</td>
                <td className="p-2">{t.nombre}</td>
                <td className="p-2">
                  {t.url_tienda ? <a className="text-blue-600 underline" href={t.url_tienda} target="_blank">link</a> : "—"}
                </td>
                <td className="p-2">{t.lat}, {t.lng}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={4}>Sin tiendas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
