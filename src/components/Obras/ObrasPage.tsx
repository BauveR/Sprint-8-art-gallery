import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ObraThumb from "./ObraThumb";
import ObraImagesDialog from "./ObraImagesDialog";
import { ObraForm } from "./ObraForm";
import { Pagination } from "@/components/common/Pagination";
import { useObras, useCreateObra, useRemoveObra, useUpdateObra, useAsignarExpo, useAsignarTienda, useQuitarExpo, useSacarTienda } from "@/query/obras";
import { useTiendas } from "@/query/tiendas";
import { useExpos } from "@/query/expos";
import type { Expo, Obra, Tienda } from "@/types";

const ThSort = ({ label, active, dir, onClick }:{label:string;active:boolean;dir:"asc"|"desc";onClick:()=>void}) => (
  <button className={`inline-flex items-center gap-1 ${active ? "font-semibold" : ""}`} onClick={onClick} title="Ordenar">
    {label}{active && (dir==="asc"?"▲":"▼")}
  </button>
);

export default function ObrasPage() {
  const [sortKey, setSortKey] = useState<keyof Obra | "disponibilidad" | "expo_nombre" | "tienda_nombre">("id_obra");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useObras({ sort: { key: String(sortKey), dir: sortDir }, page, pageSize });
  const obras = data?.data ?? []; const total = data?.total ?? 0;
  const { data: tiendas = [] } = useTiendas();
  const { data: expos = [] } = useExpos();

  const createObra = useCreateObra();
  const removeObra = useRemoveObra();
  const updateObra = useUpdateObra();
  const asignarTienda = useAsignarTienda();
  const sacarTienda = useSacarTienda();
  const asignarExpo = useAsignarExpo();
  const quitarExpo = useQuitarExpo();

  const [imgState, setImgState] = useState<{ id_obra: number; titulo: string } | null>(null);
  const [imgOpen, setImgOpen] = useState(false);
  const [editing, setEditing] = useState<Obra | null>(null);

  const toggleSort = (key: typeof sortKey) => {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  };

  const obrasUnique = useMemo(() => {
    const seen = new Set<number>(), out: Obra[] = [];
    for (const o of obras) if (!seen.has(o.id_obra)) { seen.add(o.id_obra); out.push(o); }
    return out;
  }, [obras]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Obras</h1>

      {/* Alta rápida */}
      <ObraForm
        onSubmit={(v) => createObra.mutate({
          ...v,
          anio: v.anio ? Number(v.anio) : null,
          precio_salida: v.precio_salida ? Number(v.precio_salida) : null,
        })}
        submitLabel="Crear obra"
        loading={createObra.isPending}
      />

      {/* Tabla */}
      <div className="bg-white/80 rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2"><ThSort label="#" active={sortKey==="id_obra"} dir={sortDir} onClick={() => toggleSort("id_obra")} /></th>
              <th className="text-left p-2">Imagen</th>
              <th className="text-left p-2"><ThSort label="Autor" active={sortKey==="autor"} dir={sortDir} onClick={() => toggleSort("autor")} /></th>
              <th className="text-left p-2"><ThSort label="Título" active={sortKey==="titulo"} dir={sortDir} onClick={() => toggleSort("titulo")} /></th>
              <th className="text-left p-2"><ThSort label="Disponibilidad" active={sortKey==="disponibilidad"} dir={sortDir} onClick={() => toggleSort("disponibilidad")} /></th>
              <th className="text-left p-2"><ThSort label="Tienda" active={sortKey==="tienda_nombre"} dir={sortDir} onClick={() => toggleSort("tienda_nombre")} /></th>
              <th className="text-left p-2"><ThSort label="Expo" active={sortKey==="expo_nombre"} dir={sortDir} onClick={() => toggleSort("expo_nombre")} /></th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {obrasUnique.map(o => (
              <tr key={o.id_obra} className="border-t align-top">
                <td className="p-2">{o.id_obra}</td>
                <td className="p-2 w-[96px]"><ObraThumb id_obra={o.id_obra} /></td>
                <td className="p-2">{o.autor}</td>
                <td className="p-2">{o.titulo}</td>
                <td className="p-2"><Badge variant="secondary">{o.disponibilidad ?? "—"}</Badge></td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <Select
                      onValueChange={(val) => {
                        const id_tienda = Number(val);
                        if (id_tienda) asignarTienda.mutate({ id_obra: o.id_obra, id_tienda, fecha_entrada: new Date().toISOString().slice(0,10) });
                      }}
                    >
                      <SelectTrigger className="w-[180px]"><SelectValue placeholder="Asignar a tienda…" /></SelectTrigger>
                      <SelectContent>
                        {tiendas.map((t: Tienda) => (
                          <SelectItem key={t.id_tienda} value={String(t.id_tienda)}>{t.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {o.id_tienda && (
                      <Button variant="link" className="px-0" disabled={sacarTienda.isPending}
                        onClick={() => sacarTienda.mutate({ id_obra: o.id_obra, fecha_salida: new Date().toISOString().slice(0,10) })}>
                        Sacar de tienda
                      </Button>
                    )}
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <Select
                      onValueChange={(val) => {
                        const id_expo = Number(val);
                        if (id_expo) asignarExpo.mutate({ id_obra: o.id_obra, id_expo });
                      }}
                    >
                      <SelectTrigger className="w-[180px]"><SelectValue placeholder="Asignar a expo…" /></SelectTrigger>
                      <SelectContent>
                        {expos.map((x: Expo) => (
                          <SelectItem key={x.id_expo} value={String(x.id_expo)}>{x.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {o.id_expo && (
                      <Button variant="link" className="px-0" disabled={quitarExpo.isPending}
                        onClick={() => quitarExpo.mutate({ id_obra: o.id_obra, id_expo: o.id_expo! })}>
                        Quitar de expo
                      </Button>
                    )}
                  </div>
                </td>
                <td className="p-2 space-x-2">
                  <Button variant="ghost" onClick={() => { setImgState({ id_obra: o.id_obra, titulo: o.titulo }); setImgOpen(true); }}>Imágenes</Button>
                  <Button variant="ghost" onClick={() => setEditing(o)}>Editar</Button>
                  <Button variant="ghost" className="text-red-600" disabled={removeObra.isPending} onClick={() => { if (confirm("¿Eliminar la obra?")) removeObra.mutate(o.id_obra); }}>Eliminar</Button>
                </td>
              </tr>
            ))}
            {!isLoading && obrasUnique.length === 0 && (<tr><td className="p-4 text-gray-500" colSpan={8}>Sin obras</td></tr>)}
          </tbody>
        </table>

        <Pagination page={page} total={total} pageSize={pageSize} onPageChange={setPage}/>
        {isLoading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
        {error && <div className="p-3 text-sm text-red-600">Error: {error instanceof Error ? error.message : String(error)}</div>}
      </div>

      <ObraImagesDialog obra={imgState} open={imgOpen} onOpenChange={(next)=>{ setImgOpen(next); if(!next) setImgState(null); }}/>
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editar obra #{editing.id_obra}</h3>
              <button onClick={() => setEditing(null)} className="text-gray-500 hover:text-black">✕</button>
            </div>
            <ObraForm
              defaultValues={{
                autor: editing.autor, titulo: editing.titulo,
                anio: editing.anio ?? undefined, medidas: editing.medidas ?? "",
                tecnica: editing.tecnica ?? "", precio_salida: typeof editing.precio_salida === "string" ? Number(editing.precio_salida) : editing.precio_salida ?? undefined,
              }}
              onSubmit={(v) => updateObra.mutate({
                id: editing.id_obra,
                input: {
                  ...v,
                  anio: v.anio ? Number(v.anio) : null,
                  precio_salida: v.precio_salida === undefined ? null : Number(v.precio_salida),
                },
              }, { onSuccess: () => setEditing(null) })}
              submitLabel="Guardar cambios"
              loading={updateObra.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}
