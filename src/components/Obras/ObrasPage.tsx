import { useEffect, useMemo, useState } from "react";
import { obrasService } from "../../services/obrasService";
import { exposService } from "../../services/expoService";
import { tiendasService } from "../../services/tiendasService";
import { Expo, Obra, ObraInput, Tienda } from "../../types";

const emptyObra: ObraInput = {
  autor: "",
  titulo: "",
  anio: undefined,
  medidas: "",
  tecnica: "",
  precio_salida: undefined,
};

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [expos, setExpos] = useState<Expo[]>([]);
  const [form, setForm] = useState<ObraInput>(emptyObra);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const [o, t, e] = await Promise.all([
        obrasService.list(),
        tiendasService.list(),
        exposService.list(),
      ]);
      setObras(o);
      setTiendas(t);
      setExpos(e);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const canSubmit = useMemo(
    () => form.autor.trim() !== "" && form.titulo.trim() !== "",
    [form.autor, form.titulo]
  );

  const onCreate = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!canSubmit) return;
    try {
      await obrasService.create({
        ...form,
        anio: form.anio ? Number(form.anio) : null,
        precio_salida: form.precio_salida ? Number(form.precio_salida) : null,
      });
      setForm(emptyObra);
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar la obra?")) return;
    try {
      await obrasService.remove(id);
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onAsignarTienda = async (id_obra: number, id_tienda: number) => {
    try {
      await obrasService.asignarTienda(id_obra, id_tienda, new Date().toISOString().slice(0,10));
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onSacarTienda = async (id_obra: number) => {
    try {
      await obrasService.sacarTienda(id_obra, new Date().toISOString().slice(0,10));
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onAsignarExpo = async (id_obra: number, id_expo: number) => {
    try {
      await obrasService.asignarExpo(id_obra, id_expo);
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const onQuitarExpo = async (id_obra: number, id_expo?: number | null) => {
    if (!id_expo) return;
    try {
      await obrasService.quitarExpo(id_obra, id_expo);
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Obras</h1>

      {/* Form alta obra */}
      <form onSubmit={onCreate} className="grid grid-cols-2 gap-3 bg-white/80 p-4 rounded-xl shadow">
        <input
          className="border rounded p-2"
          placeholder="Autor"
          value={form.autor}
          onChange={e => setForm(f => ({ ...f, autor: e.target.value }))}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Título"
          value={form.titulo}
          onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Año"
          type="number"
          value={form.anio ?? ""}
          onChange={e => setForm(f => ({ ...f, anio: e.target.value === "" ? undefined : Number(e.target.value) }))}
        />
        <input
          className="border rounded p-2"
          placeholder="Medidas"
          value={form.medidas ?? ""}
          onChange={e => setForm(f => ({ ...f, medidas: e.target.value }))}
        />
        <input
          className="border rounded p-2"
          placeholder="Técnica"
          value={form.tecnica ?? ""}
          onChange={e => setForm(f => ({ ...f, tecnica: e.target.value }))}
        />
        <input
          className="border rounded p-2"
          placeholder="Precio salida"
          type="number"
          step="0.01"
          value={form.precio_salida ?? ""}
          onChange={e => setForm(f => ({ ...f, precio_salida: e.target.value === "" ? undefined : Number(e.target.value) }))}
        />
        <div className="col-span-2">
          <button
            disabled={!canSubmit}
            className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-40"
          >
            Crear obra
          </button>
        </div>
      </form>

      {/* Tabla obras */}
      <div className="bg-white/80 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Autor</th>
              <th className="text-left p-2">Título</th>
              <th className="text-left p-2">Disponibilidad</th>
              <th className="text-left p-2">Tienda</th>
              <th className="text-left p-2">Expo</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obras.map(o => (
              <tr key={o.id_obra} className="border-t">
                <td className="p-2">{o.id_obra}</td>
                <td className="p-2">{o.autor}</td>
                <td className="p-2">{o.titulo}</td>
                <td className="p-2">
                  <span className="rounded px-2 py-1 bg-gray-100">
                    {o.disponibilidad ?? "—"}
                  </span>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded p-1"
                      defaultValue=""
                      onChange={e => {
                        const id_tienda = Number(e.target.value);
                        if (id_tienda) onAsignarTienda(o.id_obra, id_tienda);
                        e.currentTarget.value = "";
                      }}
                    >
                      <option value="">Asignar a tienda…</option>
                      {tiendas.map(t => (
                        <option key={t.id_tienda} value={t.id_tienda}>{t.nombre}</option>
                      ))}
                    </select>
                    {o.id_tienda && (
                      <button className="text-blue-600 underline" onClick={() => onSacarTienda(o.id_obra)}>
                        Sacar de tienda
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded p-1"
                      defaultValue=""
                      onChange={e => {
                        const id_expo = Number(e.target.value);
                        if (id_expo) onAsignarExpo(o.id_obra, id_expo);
                        e.currentTarget.value = "";
                      }}
                    >
                      <option value="">Asignar a expo…</option>
                      {expos.map(x => (
                        <option key={x.id_expo} value={x.id_expo}>{x.nombre}</option>
                      ))}
                    </select>
                    {o.id_expo && (
                      <button className="text-blue-600 underline" onClick={() => onQuitarExpo(o.id_obra, o.id_expo)}>
                        Quitar de expo
                      </button>
                    )}
                  </div>
                </td>
                <td className="p-2">
                  <button className="text-red-600 underline" onClick={() => onDelete(o.id_obra)}>
                    eliminar
                  </button>
                </td>
              </tr>
            ))}
            {(!loading && obras.length === 0) && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={7}>Sin obras</td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
        {err && <div className="p-3 text-sm text-red-600">Error: {err}</div>}
      </div>
    </div>
  );
}
