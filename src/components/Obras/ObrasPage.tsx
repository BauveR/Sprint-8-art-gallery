import { useMemo, useState } from "react";

import { Button } from "../ui/button";
import { Combobox, type ComboItem } from "../ui/Combobox";
import { DataTable, type Column } from "../ui/DataTable";
import { Pagination } from "../ui/Pagination";

import {  Obra, ObraInput } from "../../types";
import {
  useObras,
  useCreateObra,
  useRemoveObra,
  useUpdateObra,
  useAsignarExpo,
  useAsignarTienda,
  useQuitarExpo,
  useSacarTienda,
} from "../../query/obras";
import { useTiendas } from "../../query/tiendas";
import { useExpos } from "../../query/expos";

const emptyObra: ObraInput = {
  autor: "",
  titulo: "",
  anio: undefined,
  medidas: "",
  tecnica: "",
  precio_salida: undefined,
};

type EditState = { id: number; form: ObraInput } | null;

export default function ObrasPage() {
  const { data: obras = [], isLoading, error } = useObras();
  const { data: tiendas = [] } = useTiendas();
  const { data: expos = [] } = useExpos();

  const createObra = useCreateObra();
  const removeObra = useRemoveObra();
  const updateObra = useUpdateObra();
  const asignarTienda = useAsignarTienda();
  const sacarTienda = useSacarTienda();
  const asignarExpo = useAsignarExpo();
  const quitarExpo = useQuitarExpo();

  const [form, setForm] = useState<ObraInput>(emptyObra);
  const [edit, setEdit] = useState<EditState>(null);

  // --- Paginación client-side ---
  const [page, setPage] = useState(1);       // 1-based
  const [pageSize, setPageSize] = useState(10);
  const total = obras.length;

  const canSubmit = useMemo(
    () => form.autor.trim() !== "" && form.titulo.trim() !== "",
    [form.autor, form.titulo]
  );

  const onCreate = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!canSubmit) return;
    createObra.mutate(
      {
        ...form,
        anio: form.anio ? Number(form.anio) : null,
        precio_salida: form.precio_salida ? Number(form.precio_salida) : null,
      },
      {
        onSuccess: () => {
          setForm(emptyObra);
          // regresar a la primera página para ver el alta fácilmente
          setPage(1);
        },
      }
    );
  };

  const onDelete = (id: number) => {
    if (!confirm("¿Eliminar la obra?")) return;
    removeObra.mutate(id);
  };

  const onAsignarTienda = (id_obra: number, id_tienda: number) => {
    if (!id_tienda) return;
    asignarTienda.mutate({
      id_obra,
      id_tienda,
      fecha_entrada: new Date().toISOString().slice(0, 10),
    });
  };

  const onSacarTienda = (id_obra: number) => {
    sacarTienda.mutate({
      id_obra,
      fecha_salida: new Date().toISOString().slice(0, 10),
    });
  };

  const onAsignarExpo = (id_obra: number, id_expo: number) => {
    if (!id_expo) return;
    asignarExpo.mutate({ id_obra, id_expo });
  };

  const onQuitarExpo = (id_obra: number, id_expo?: number | null) => {
    if (!id_expo) return;
    quitarExpo.mutate({ id_obra, id_expo });
  };

  // edición
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

  const saveEdit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!edit) return;
    const { id, form } = edit;
    updateObra.mutate(
      {
        id,
        input: {
          ...form,
          anio: form.anio ? Number(form.anio) : null,
          precio_salida:
            form.precio_salida === undefined ||
            form.precio_salida === null ||
            (form.precio_salida as any) === ""
              ? null
              : Number(form.precio_salida),
        },
      },
      { onSuccess: () => setEdit(null) }
    );
  };

  const tiendaItems: ComboItem[] = tiendas.map((t) => ({
    value: t.id_tienda,
    label: `${t.nombre} · (${t.lat}, ${t.lng})`,
  }));

  const expoItems: ComboItem[] = expos.map((x) => ({
    value: x.id_expo,
    label: `${x.nombre} · ${x.fecha_inicio} → ${x.fecha_fin}`,
  }));

  // --- Definición de columnas para DataTable ---
  const columns: Column<Obra>[] = [
    { key: "id_obra", header: "#", width: "60px", sortable: true },
    { key: "autor", header: "Autor", sortable: true },
    { key: "titulo", header: "Título", sortable: true },
    {
      key: "disponibilidad",
      header: "Disponibilidad",
      sortable: true,
      cell: (o) => (
        <span className="rounded px-2 py-1 bg-gray-100">
          {o.disponibilidad ?? "—"}
        </span>
      ),
    },
    {
      key: "tienda",
      header: "Tienda",
      cell: (o) => (
        <div className="flex items-center gap-2">
          <Combobox
            disabled={asignarTienda.isPending}
            items={tiendaItems}
            placeholder="Buscar tienda…"
            onSelect={(it) => onAsignarTienda(o.id_obra, Number(it.value))}
          />
          {o.id_tienda && (
            <Button
              variant="link"
              disabled={sacarTienda.isPending}
              onClick={() => onSacarTienda(o.id_obra)}
            >
              Sacar de tienda
            </Button>
          )}
        </div>
      ),
    },
    {
      key: "expo",
      header: "Expo",
      cell: (o) => (
        <div className="flex items-center gap-2">
          <Combobox
            disabled={asignarExpo.isPending}
            items={expoItems}
            placeholder="Buscar expo…"
            onSelect={(it) => onAsignarExpo(o.id_obra, Number(it.value))}
          />
          {o.id_expo && (
            <Button
              variant="link"
              disabled={quitarExpo.isPending}
              onClick={() => onQuitarExpo(o.id_obra, o.id_expo)}
            >
              Quitar de expo
            </Button>
          )}
        </div>
      ),
    },
    {
      key: "acciones",
      header: "Acciones",
      width: "160px",
      cell: (o) => (
        <div className="space-x-3">
          <Button variant="link" onClick={() => startEdit(o)}>editar</Button>
          <Button
            variant="link"
            className="text-red-600"
            disabled={removeObra.isPending}
            onClick={() => onDelete(o.id_obra)}
          >
            eliminar
          </Button>
        </div>
      ),
    },
  ];

  // --- Slice de paginación ---
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const pageData = obras.slice(startIdx, endIdx);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Obras</h1>

        {/* Controles de paginación (arriba a la derecha) */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">
            Tamaño de página:&nbsp;
            <select
              className="border rounded-lg px-2 py-1 text-sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <Pagination
            page={safePage}
            pageSize={pageSize}
            total={total}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>

      {/* Form alta obra */}
      <form onSubmit={onCreate} className="grid grid-cols-2 gap-3 bg-white/80 p-4 rounded-xl shadow">
        <input
          className="border rounded p-2"
          placeholder="Autor"
          value={form.autor}
          onChange={(e) => setForm((f) => ({ ...f, autor: e.target.value }))}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Título"
          value={form.titulo}
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
          required
        />
        <input
          className="border rounded p-2"
          placeholder="Año"
          type="number"
          value={form.anio ?? ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              anio: e.target.value === "" ? undefined : Number(e.target.value),
            }))
          }
        />
        <input
          className="border rounded p-2"
          placeholder="Medidas"
          value={form.medidas ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, medidas: e.target.value }))}
        />
        <input
          className="border rounded p-2"
          placeholder="Técnica"
          value={form.tecnica ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, tecnica: e.target.value }))}
        />
        <input
          className="border rounded p-2"
          placeholder="Precio salida"
          type="number"
          step="0.01"
          value={form.precio_salida ?? ""}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              precio_salida: e.target.value === "" ? undefined : Number(e.target.value),
            }))
          }
        />
        <div className="col-span-2">
          <Button disabled={!canSubmit || createObra.isPending}>
            {createObra.isPending ? "Creando..." : "Crear obra"}
          </Button>
        </div>
      </form>

      {/* DataTable con ordenamiento client-side + paginación client-side */}
      <DataTable
        columns={columns}
        data={pageData}
        rowKey={(row) => `obra-${row.id_obra}`}
      />
      {isLoading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
      {error && <div className="p-3 text-sm text-red-600">Error: {(error as any).message}</div>}

      {/* Modal edición */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editar obra #{edit.id}</h3>
              <button onClick={cancelEdit} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>
            <form onSubmit={saveEdit} className="grid grid-cols-2 gap-3">
              <input
                className="border rounded p-2"
                placeholder="Autor"
                value={edit.form.autor}
                onChange={(e) =>
                  setEdit((s) => (s ? { ...s, form: { ...s.form, autor: e.target.value } } : s))
                }
                required
              />
              <input
                className="border rounded p-2"
                placeholder="Título"
                value={edit.form.titulo}
                onChange={(e) =>
                  setEdit((s) => (s ? { ...s, form: { ...s.form, titulo: e.target.value } } : s))
                }
                required
              />
              <input
                className="border rounded p-2"
                placeholder="Año"
                type="number"
                value={edit.form.anio ?? ""}
                onChange={(e) =>
                  setEdit((s) =>
                    s
                      ? {
                          ...s,
                          form: {
                            ...s.form,
                            anio: e.target.value === "" ? undefined : Number(e.target.value),
                          },
                        }
                      : s
                  )
                }
              />
              <input
                className="border rounded p-2"
                placeholder="Medidas"
                value={edit.form.medidas ?? ""}
                onChange={(e) =>
                  setEdit((s) => (s ? { ...s, form: { ...s.form, medidas: e.target.value } } : s))
                }
              />
              <input
                className="border rounded p-2"
                placeholder="Técnica"
                value={edit.form.tecnica ?? ""}
                onChange={(e) =>
                  setEdit((s) => (s ? { ...s, form: { ...s.form, tecnica: e.target.value } } : s))
                }
              />
              <input
                className="border rounded p-2"
                placeholder="Precio salida"
                type="number"
                step="0.01"
                value={edit.form.precio_salida ?? ""}
                onChange={(e) =>
                  setEdit((s) =>
                    s
                      ? {
                          ...s,
                          form: {
                            ...s.form,
                            precio_salida:
                              e.target.value === "" ? undefined : Number(e.target.value),
                          },
                        }
                      : s
                  )
                }
              />
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <Button type="button" variant="secondary" onClick={cancelEdit}>
                  Cancelar
                </Button>
                <Button disabled={updateObra.isPending}>
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
