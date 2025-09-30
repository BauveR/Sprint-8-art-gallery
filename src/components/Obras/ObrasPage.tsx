import { useEffect, useMemo, useState } from "react";
import { obrasService } from "../../services/obrasService";
import { exposService } from "../../services/expoService";
import { tiendasService } from "../../services/tiendasService";
import { Expo, Obra, ObraInput, Tienda } from "../../types";
import { toast } from "sonner";

const emptyObra: ObraInput = {
  autor: "",
  titulo: "",
  anio: undefined,
  medidas: "",
  tecnica: "",
  precio_salida: undefined,
};

type EditState = {
  id: number;
  form: ObraInput;
} | null;

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [expos, setExpos] = useState<Expo[]>([]);
  const [form, setForm] = useState<ObraInput>(emptyObra);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [edit, setEdit] = useState<EditState>(null);
  const isEditing = !!edit;

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
      toast.error("No se pudieron cargar los datos", { description: e.message });
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
      toast.success("Obra creada");
      await load();
    } catch (e: any) {
      toast.error("Error al crear obra", { description: e.message });
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar la obra?")) return;
    try {
      await obrasService.remove(id);
      toast.success("Obra eliminada");
      await load();
    } catch (e: any) {
      toast.error("Error al eliminar", { description: e.message });
    }
  };

  const onAsignarTienda = async (id_obra: number, id_tienda: number) => {
    try {
      await obrasService.asignarTienda(id_obra, id_tienda, new Date().toISOString().slice(0,10));
      toast.success("Asignada a tienda");
      await load();
    } catch (e: any) {
      toast.error("No se pudo asignar a tienda", { description: e.message });
    }
  };

  const onSacarTienda = async (id_obra: number) => {
    try {
      await obrasService.sacarTienda(id_obra, new Date().toISOString().slice(0,10));
      toast.success("Sacada de tienda");
      await load();
    } catch (e: any) {
      toast.error("No se pudo sacar de tienda", { description: e.message });
    }
  };

  const onAsignarExpo = async (id_obra: number, id_expo: number) => {
    try {
      await obrasService.asignarExpo(id_obra, id_expo);
      toast.success("Asignada a exposición");
      await load();
    } catch (e: any) {
      toast.error("No se pudo asignar a expo", { description: e.message });
    }
  };

  const onQuitarExpo = async (id_obra: number, id_expo?: number | null) => {
    if (!id_expo) return;
    try {
      await obrasService.quitarExpo(id_obra, id_expo);
      toast.success("Quitada de exposición");
      await load();
    } catch (e: any) {
      toast.error("No se pudo quitar de expo", { description: e.message });
    }
  };

  // === Edición ===
  const startEdit = (o: Obra) => {
    setEdit({
      id: o.id_obra,
      form: {
        autor: o.autor ?? "",
        titulo: o.titulo ?? "",
        anio: o.anio ?? undefined,
        medidas: o.medidas ?? "",
        tecnica: o.tecnica ?? "",
        precio_salida: o.precio_salida != null ? Number(o.precio_salida as any) : undefined,
      },
    });
  };

  const cancelEdit = () => setEdit(null);

  const saveEdit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!edit) return;
    const { id, form } = edit;
    try {
      await obrasService.update(id, {
        ...form,
        anio: form.anio ? Number(form.anio) : null,
        precio_salida:
          form.precio_salida === undefined || form.precio_salida === null || (form as any).precio_salida === ""
            ? null
            : Number(form.precio_salida),
      });
      setEdit(null);
      toast.success("Cambios guardados");
      await load();
    } catch (e: any) {
      toast.error("No se pudo guardar", { description: e.message });
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
                <td className="p-2 space-x-3">
                  <button className="text-blue-700 underline" onClick={() => startEdit(o)}>
                    editar
                  </button>
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

      {/* Modal edición */}
      {isEditing && edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editar obra #{edit.id}</h3>
              <button onClick={cancelEdit} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <form onSubmit={saveEdit} className="grid grid-cols-2 gap-3">
              <input
                className="border rounded p-2"
                placeholder="Autor"
                value={edit.form.autor}
                onChange={e => setEdit(s => s ? ({ ...s, form: { ...s.form, autor: e.target.value } }) : s)}
                required
              />
              <input
                className="border rounded p-2"
                placeholder="Título"
                value={edit.form.titulo}
                onChange={e => setEdit(s => s ? ({ ...s, form: { ...s.form, titulo: e.target.value } }) : s)}
                required
              />
              <input
                className="border rounded p-2"
                placeholder="Año"
                type="number"
                value={edit.form.anio ?? ""}
                onChange={e => setEdit(s => s ? ({
                  ...s, form: { ...s.form, anio: e.target.value === "" ? undefined : Number(e.target.value) }
                }) : s)}
              />
              <input
                className="border rounded p-2"
                placeholder="Medidas"
                value={edit.form.medidas ?? ""}
                onChange={e => setEdit(s => s ? ({ ...s, form: { ...s.form, medidas: e.target.value } }) : s)}
              />
              <input
                className="border rounded p-2"
                placeholder="Técnica"
                value={edit.form.tecnica ?? ""}
                onChange={e => setEdit(s => s ? ({ ...s, form: { ...s.form, tecnica: e.target.value } }) : s)}
              />
              <input
                className="border rounded p-2"
                placeholder="Precio salida"
                type="number"
                step="0.01"
                value={edit.form.precio_salida ?? ""}
                onChange={e => setEdit(s => s ? ({
                  ...s,
                  form: {
                    ...s.form,
                    precio_salida: e.target.value === "" ? undefined : Number(e.target.value)
                  }
                }) : s)}
              />
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-lg bg-gray-100">
                  Cancelar
                </button>
                <button className="px-4 py-2 rounded-lg bg-black text-white">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
