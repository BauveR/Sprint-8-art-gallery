import React, { useMemo, useState } from "react";
import { Expo, Obra, ObraInput, Tienda } from "../../types";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ObraImagesDialog from "./ObraImagesDialog";
import ObraThumb from "./ObraThumb";

const emptyObra: ObraInput = {
  autor: "",
  titulo: "",
  anio: undefined,
  medidas: "",
  tecnica: "",
  precio_salida: undefined,
};

type EditState = { id: number; form: ObraInput } | null;
type ImgState = { id_obra: number; titulo: string } | null;
type Sort = { key: keyof Obra | "disponibilidad" | "expo_nombre" | "tienda_nombre"; dir: "asc" | "desc" };

// ——— helpers robustos ———
function toNumOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isNaN(v) ? null : v;
  const s = String(v).trim().toLowerCase();
  if (s === "" || s === "null" || s === "undefined") return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}
function hasExpo(o: Obra): boolean {
  return toNumOrNull((o as any).id_expo) !== null;
}

export default function ObrasPage() {
  const [sort, setSort] = useState<Sort>({ key: "id_obra", dir: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useObras({
    sort: { key: String(sort.key), dir: sort.dir },
    page,
    pageSize,
  });
  const obras = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
  const [imgState, setImgState] = useState<ImgState>(null);
  const [imgOpen, setImgOpen] = useState(false);

  const canSubmit = useMemo(
    () => form.autor.trim() !== "" && form.titulo.trim() !== "",
    [form.autor, form.titulo]
  );

  // Dedupe defensivo por si el backend repite filas
  const obrasUnique = useMemo(() => {
    const seen = new Set<number>();
    const arr: typeof obras = [];
    for (const it of obras) {
      if (!seen.has(it.id_obra)) {
        seen.add(it.id_obra);
        arr.push(it);
      }
    }
    return arr;
  }, [obras]);

  // ——— acciones CRUD ———
  const onCreate = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!canSubmit) return;
    createObra.mutate(
      {
        ...form,
        anio: form.anio ? Number(form.anio) : null,
        precio_salida: form.precio_salida ? Number(form.precio_salida) : null,
      },
      { onSuccess: () => setForm(emptyObra) }
    );
  };

  const onDelete = (id: number) => {
    if (!confirm("¿Eliminar la obra?")) return;
    removeObra.mutate(id);
  };

  // ——— tienda ———
  const onAsignarTienda = (o: Obra, id_tienda: number) => {
    if (!id_tienda) return;
    if ((o.id_tienda ?? null) === id_tienda) return; // evita llamada inútil
    asignarTienda.mutate({
      id_obra: o.id_obra,
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

  // ——— expo ———
  const onAsignarExpo = (o: Obra, id_expo: number) => {
    if (!id_expo) return;
    const current = toNumOrNull((o as any).id_expo);
    if (current !== null && current === id_expo) return; // evita “Duplicate entry”
    asignarExpo.mutate({ id_obra: o.id_obra, id_expo });
  };
  const onQuitarExpo = (o: Obra) => {
    const current = toNumOrNull((o as any).id_expo);
    if (current === null) return;
    quitarExpo.mutate({ id_obra: o.id_obra, id_expo: current });
  };

  const toggleSort = (key: Sort["key"]) => {
    setPage(1);
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Obras</h1>

      {/* Alta obra */}
      <form
        onSubmit={onCreate}
        className="grid grid-cols-2 gap-3 bg-white/80 p-4 rounded-xl shadow"
      >
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
              precio_salida:
                e.target.value === "" ? undefined : Number(e.target.value),
            }))
          }
        />
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
              <th className="text-left p-2">
                {headerBtn("Disponibilidad", "disponibilidad")}
              </th>
              <th className="text-left p-2">{headerBtn("Tienda", "tienda_nombre")}</th>
              <th className="text-left p-2">{headerBtn("Expo", "expo_nombre")}</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obrasUnique.map((o) => {
              const expoId = toNumOrNull((o as any).id_expo);
              const tieneExpo = expoId !== null;

              return (
                <tr key={`obra-${o.id_obra}`} className="border-t align-top">
                  <td className="p-2">{o.id_obra}</td>
                  <td className="p-2 w-[96px]">
                    <ObraThumb id_obra={o.id_obra} />
                  </td>
                  <td className="p-2">{o.autor}</td>
                  <td className="p-2">{o.titulo}</td>
                  <td className="p-2">
                    <Badge variant="secondary">{o.disponibilidad ?? "—"}</Badge>
                  </td>

                  {/* Tienda */}
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <select
                        className="border rounded p-1"
                        defaultValue=""
                        disabled={asignarTienda.isPending}
                        onChange={(e) => {
                          const id_tienda = Number(e.target.value);
                          if (id_tienda) onAsignarTienda(o, id_tienda);
                          e.currentTarget.value = "";
                        }}
                      >
                        <option value="">Asignar a tienda…</option>
                        {tiendas.map((t: Tienda) => (
                          <option
                            key={`tienda-opt-${t.id_tienda}`}
                            value={t.id_tienda}
                          >
                            {t.nombre}
                          </option>
                        ))}
                      </select>
                      {o.id_tienda != null && (
                        <Button
                          variant="link"
                          className="px-0"
                          disabled={sacarTienda.isPending}
                          onClick={() => onSacarTienda(o.id_obra)}
                        >
                          Sacar de tienda
                        </Button>
                      )}
                    </div>
                  </td>

                  {/* Expo */}
                  <td className="p-2">
                    <div className="flex items-center gap-2">
                      <select
                        className="border rounded p-1"
                        defaultValue=""
                        disabled={asignarExpo.isPending}
                        onChange={(e) => {
                          const id_expo = Number(e.target.value);
                          if (id_expo) onAsignarExpo(o, id_expo);
                          e.currentTarget.value = "";
                        }}
                      >
                        <option value="">Asignar a expo…</option>
                        {expos.map((x: Expo) => (
                          <option key={`expo-opt-${x.id_expo}`} value={x.id_expo}>
                            {x.nombre}
                          </option>
                        ))}
                      </select>
                      {tieneExpo && (
                        <Button
                          variant="link"
                          className="px-0"
                          disabled={quitarExpo.isPending}
                          onClick={() => onQuitarExpo(o)}
                        >
                          Quitar de expo
                        </Button>
                      )}
                    </div>
                  </td>

                  {/* Acciones */}
                  <td className="p-2 space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setImgState({ id_obra: o.id_obra, titulo: o.titulo });
                        setImgOpen(true);
                      }}
                    >
                      Imágenes
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setEdit({
                          id: o.id_obra,
                          form: {
                            autor: o.autor ?? "",
                            titulo: o.titulo ?? "",
                            anio: o.anio ?? undefined,
                            medidas: o.medidas ?? "",
                            tecnica: o.tecnica ?? "",
                            precio_salida:
                              o.precio_salida != null
                                ? typeof o.precio_salida === "string"
                                  ? Number(o.precio_salida)
                                  : o.precio_salida
                                : undefined,
                          },
                        })
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(o.id_obra)}
                      disabled={removeObra.isPending}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })}
            {!isLoading && obrasUnique.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={8}>
                  Sin obras
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex items-center justify-between p-3 text-sm">
          <div>
            Página {page} de {totalPages} · {total} obras
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Anterior
            </Button>
            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente →
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="p-3 text-sm text-gray-500">Cargando…</div>
        )}
        {error && (
          <div className="p-3 text-sm text-red-600">
            Error: {error instanceof Error ? error.message : String(error)}
          </div>
        )}
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
    </div>
  );
}
