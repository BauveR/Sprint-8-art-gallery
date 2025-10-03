import React, { useMemo, useState } from "react";
import { Expo, Obra, ObraInput, Tienda, EstadoVenta } from "../../types";
import {
  useObras,
  useCreateObra,
  useRemoveObra,
  useUpdateObra,
} from "../../query/obras";
import { useTiendas } from "../../query/tiendas";
import { useExpos } from "../../query/expos";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ObraImagesDialog from "./ObraImagesDialog";
import ObraThumb from "./ObraThumb";
import ObrasUbicacionChart from "./ObrasUbicacionChart";
import ObrasVentasChart from "./ObrasVentasChart";
import LocationsMap from "./LocationsMap";

const emptyObra: ObraInput = {
  autor: "",
  titulo: "",
  anio: null,
  medidas: null,
  tecnica: null,
  precio_salida: null,
  estado_venta: "disponible",
  id_tienda: null,
  id_expo: null,
};

type EditState = { id: number; form: ObraInput } | null;
type ImgState = { id_obra: number; titulo: string } | null;
type Sort = { key: keyof Obra | "ubicacion" | "expo_nombre" | "tienda_nombre"; dir: "asc" | "desc" };

export default function ObrasPage() {
  // Estado de sort/paginación
  const [sort, setSort] = useState<Sort>({ key: "id_obra", dir: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useObras({ sort: { key: String(sort.key), dir: sort.dir }, page, pageSize });
  const obras = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const { data: tiendas = [] } = useTiendas();
  const { data: expos = [] } = useExpos();

  const createObra = useCreateObra();
  const removeObra = useRemoveObra();
  const updateObra = useUpdateObra();

  const [form, setForm] = useState<ObraInput>(emptyObra);
  const [edit, setEdit] = useState<EditState>(null);

  const [imgState, setImgState] = useState<ImgState>(null);
  const [imgOpen, setImgOpen] = useState(false);

  const canSubmit = useMemo(
    () => form.autor.trim() !== "" && form.titulo.trim() !== "",
    [form.autor, form.titulo]
  );

  const onCreate = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!canSubmit) return;
    console.log("Creando obra con:", form);
    createObra.mutate(form, {
      onSuccess: (data) => {
        console.log("Obra creada exitosamente:", data);
        setForm(emptyObra);
      },
      onError: (error) => {
        console.error("Error al crear obra:", error);
      }
    });
  };

  const onDelete = (id: number) => {
    if (!confirm("¿Eliminar la obra?")) return;
    removeObra.mutate(id);
  };

  const startEdit = (o: Obra) => {
    setEdit({
      id: o.id_obra,
      form: {
        autor: o.autor ?? "",
        titulo: o.titulo ?? "",
        anio: o.anio ?? null,
        medidas: o.medidas ?? null,
        tecnica: o.tecnica ?? null,
        precio_salida:
          o.precio_salida != null
            ? (typeof o.precio_salida === "string" ? Number(o.precio_salida) : o.precio_salida)
            : null,
        estado_venta: o.estado_venta ?? "disponible",
        id_tienda: o.id_tienda ?? null,
        id_expo: o.id_expo ?? null,
      },
    });
  };

  const cancelEdit = () => setEdit(null);

  const saveEdit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!edit) return;
    const { id, form } = edit;
    console.log("Guardando obra:", { id, input: form });

    updateObra.mutate({ id, input: form }, {
      onSuccess: async () => {
        console.log("Obra actualizada exitosamente, esperando refresh...");
        // Esperar un momento para que las queries se actualicen
        await new Promise(resolve => setTimeout(resolve, 500));
        setEdit(null);
      },
      onError: (error) => {
        console.error("Error al actualizar obra:", error);
      }
    });
  };

  const toggleSort = (key: Sort["key"]) => {
    setPage(1); // reset paginación al cambiar sort
    setSort((s) => {
      if (s.key === key) {
        return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  const headerBtn = (label: string, key: Sort["key"]) => {
    const active = sort.key === key;
    return (
      <button
        className={`inline-flex items-center gap-1 ${active ? "font-semibold" : ""}`}
        onClick={() => toggleSort(key)}
        title="Ordenar"
      >
        {label}
        {active && (sort.dir === "asc" ? "▲" : "▼")}
      </button>
    );
  };

  return (
    <div className="px-4 md:px-[5%] py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Obras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] gap-6">
        {/* Columna izquierda: Charts */}
        <div className="space-y-6">
          <ObrasUbicacionChart obras={obras} />
          <ObrasVentasChart obras={obras} />
          <LocationsMap tiendas={tiendas} expos={expos} />
        </div>

        {/* Columna derecha: Formulario + Tabla */}
        <div className="space-y-6">
          {/* Form alta obra */}
          <form onSubmit={onCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/80 p-4 rounded-xl shadow">
        <input className="border rounded p-2" placeholder="Autor" value={form.autor}
          onChange={(e) => setForm((f) => ({ ...f, autor: e.target.value }))} required />
        <input className="border rounded p-2" placeholder="Título" value={form.titulo}
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} required />
        <input className="border rounded p-2" placeholder="Año" type="number" value={form.anio ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, anio: e.target.value === "" ? null : Number(e.target.value) }))} />
        <input className="border rounded p-2" placeholder="Medidas" value={form.medidas ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, medidas: e.target.value || null }))} />
        <input className="border rounded p-2" placeholder="Técnica" value={form.tecnica ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, tecnica: e.target.value || null }))} />
        <input className="border rounded p-2" placeholder="Precio salida" type="number" step="0.01"
          value={form.precio_salida ?? ""}
          onChange={(e) => setForm((f) => ({
            ...f,
            precio_salida: e.target.value === "" ? null : Number(e.target.value),
          }))} />
        <select
          className="border rounded p-2"
          value={form.estado_venta ?? "disponible"}
          onChange={(e) => setForm((f) => ({ ...f, estado_venta: e.target.value as EstadoVenta }))}
        >
          <option value="disponible">Disponible</option>
          <option value="en_carrito">En carrito</option>
          <option value="procesando_envio">Procesando envío</option>
          <option value="enviado">Enviado</option>
          <option value="entregado">Entregado</option>
        </select>
        <select
          className="border rounded p-2"
          value={form.id_tienda ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, id_tienda: e.target.value ? Number(e.target.value) : null }))}
        >
          <option value="">Sin tienda</option>
          {tiendas.map((t: Tienda) => (
            <option key={`tienda-create-${t.id_tienda}`} value={t.id_tienda}>
              {t.nombre}
            </option>
          ))}
        </select>
        <select
          className="border rounded p-2"
          value={form.id_expo ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, id_expo: e.target.value ? Number(e.target.value) : null }))}
        >
          <option value="">Sin exposición</option>
          {expos.map((x: Expo) => (
            <option key={`expo-create-${x.id_expo}`} value={x.id_expo}>
              {x.nombre}
            </option>
          ))}
        </select>
        <div className="col-span-2">
          <Button disabled={!canSubmit || createObra.isPending} className="w-fit">
            {createObra.isPending ? "Creando..." : "Crear obra"}
          </Button>
        </div>
      </form>

      {/* Tabla obras */}
      <div className="bg-white/80 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">{headerBtn("#", "id_obra")}</th>
              <th className="text-left p-2">Imagen</th>
              <th className="text-left p-2">{headerBtn("Autor", "autor")}</th>
              <th className="text-left p-2">{headerBtn("Título", "titulo")}</th>
              <th className="text-left p-2">{headerBtn("Estado", "estado_venta")}</th>
              <th className="text-left p-2">{headerBtn("Ubicación", "ubicacion")}</th>
              <th className="text-left p-2">{headerBtn("Tienda", "tienda_nombre")}</th>
              <th className="text-left p-2">{headerBtn("Expo", "expo_nombre")}</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obras.map((o) => (
              <tr key={`obra-${o.id_obra}`} className="border-t align-top">
                <td className="p-2">{o.id_obra}</td>
                <td className="p-2 w-[96px]"><ObraThumb id_obra={o.id_obra} /></td>
                <td className="p-2">{o.autor}</td>
                <td className="p-2">{o.titulo}</td>
                <td className="p-2">
                  <Badge variant="secondary">
                    {o.estado_venta === "disponible" && "Disponible"}
                    {o.estado_venta === "en_carrito" && "En carrito"}
                    {o.estado_venta === "procesando_envio" && "Procesando"}
                    {o.estado_venta === "enviado" && "Enviado"}
                    {o.estado_venta === "entregado" && "Entregado"}
                  </Badge>
                </td>
                <td className="p-2">
                  <Badge variant="outline">
                    {o.ubicacion === "en_exposicion" && "Exposición"}
                    {o.ubicacion === "en_tienda" && "Tienda"}
                    {o.ubicacion === "almacen" && "Almacén"}
                  </Badge>
                </td>
                <td className="p-2">{o.tienda_nombre ?? "—"}</td>
                <td className="p-2">{o.expo_nombre ?? "—"}</td>
                <td className="p-2 space-x-2">
                  <Button variant="ghost" onClick={() => { setImgState({ id_obra: o.id_obra, titulo: o.titulo }); setImgOpen(true); }}>
                    Imágenes
                  </Button>
                  <Button variant="ghost" onClick={() => startEdit(o)}>Editar</Button>
                  <Button variant="ghost" onClick={() => onDelete(o.id_obra)} disabled={removeObra.isPending} className="text-red-600">
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && obras.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={9}>Sin obras</td></tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex items-center justify-between p-3 text-sm">
          <div>
            Página {page} de {totalPages} · {total} obras
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              ← Anterior
            </Button>
            <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Siguiente →
            </Button>
          </div>
        </div>

        {isLoading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
        {error && <div className="p-3 text-sm text-red-600">Error: {error instanceof Error ? error.message : String(error)}</div>}
      </div>
        </div>
      </div>

      {/* Dialog imágenes */}
      <ObraImagesDialog
        obra={imgState}
        open={imgOpen}
        onOpenChange={(next: boolean) => {
          setImgOpen(next);
          if (!next) setImgState(null);
        }}
      />

      {/* Modal edición */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editar obra #{edit.id}</h3>
              <button onClick={cancelEdit} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <form onSubmit={saveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="border rounded p-2" placeholder="Autor" value={edit.form.autor}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, autor: e.target.value } })} required />
              <input className="border rounded p-2" placeholder="Título" value={edit.form.titulo}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, titulo: e.target.value } })} required />
              <input className="border rounded p-2" placeholder="Año" type="number" value={edit.form.anio ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, anio: e.target.value === "" ? null : Number(e.target.value) } })} />
              <input className="border rounded p-2" placeholder="Medidas" value={edit.form.medidas ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, medidas: e.target.value || null } })} />
              <input className="border rounded p-2" placeholder="Técnica" value={edit.form.tecnica ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, tecnica: e.target.value || null } })} />
              <input className="border rounded p-2" placeholder="Precio salida" type="number" step="0.01" value={edit.form.precio_salida ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, precio_salida: e.target.value === "" ? null : Number(e.target.value) } })} />
              <select
                className="border rounded p-2"
                value={edit.form.estado_venta ?? "disponible"}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, estado_venta: e.target.value as EstadoVenta } })}
              >
                <option value="disponible">Disponible</option>
                <option value="en_carrito">En carrito</option>
                <option value="procesando_envio">Procesando envío</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
              </select>
              <select
                className="border rounded p-2"
                value={edit.form.id_tienda ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, id_tienda: e.target.value ? Number(e.target.value) : null } })}
              >
                <option value="">Sin tienda</option>
                {tiendas.map((t: Tienda) => (
                  <option key={`tienda-edit-${t.id_tienda}`} value={t.id_tienda}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              <select
                className="border rounded p-2"
                value={edit.form.id_expo ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, id_expo: e.target.value ? Number(e.target.value) : null } })}
              >
                <option value="">Sin exposición</option>
                {expos.map((x: Expo) => (
                  <option key={`expo-edit-${x.id_expo}`} value={x.id_expo}>
                    {x.nombre}
                  </option>
                ))}
              </select>
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <button type="button" onClick={cancelEdit} className="px-4 py-2 rounded-lg bg-gray-100">Cancelar</button>
                <Button type="submit" disabled={updateObra.isPending}>
                  {updateObra.isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
