export type Obra = {
  id_obra: number;
  autor: string;
  titulo: string;
  anio: number | null;
  medidas: string | null;
  tecnica: string | null;
  precio_salida: number | string | null;
  disponibilidad: "en_exposicion" | "en_tienda" | "almacen";
  tienda_nombre?: string | null;
  tienda_url?: string | null;
  expo_nombre?: string | null;
  expo_url?: string | null;
};

export type Tienda = { id_tienda: number; nombre: string; lat: number; lng: number; url_tienda?: string | null; };
export type Expo = { id_expo: number; nombre: string; lat: number; lng: number; fecha_inicio: string; fecha_fin: string; url_expo?: string | null; };

async function json<T>(r: Response): Promise<T> {
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export const Api = {
  // Obras
  listObras: () => fetch("/api/obras").then(json<Obra[]>),
  createObra: (body: any) => fetch("/api/obras", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(json<{ id_obra: number }>,
  ),
  updateObra: (id: number, body: any) =>
    fetch(`/api/obras/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(json<{ ok: true }>),
  deleteObra: (id: number) => fetch(`/api/obras/${id}`, { method: "DELETE" }).then((r) => { if (!r.ok) throw new Error("Error al eliminar"); }),

  // Relaciones
  asignarTienda: (id_obra: number, id_tienda: number, fecha_entrada?: string) =>
    fetch(`/api/obras/${id_obra}/asignar-tienda`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_tienda, fecha_entrada }) }).then(json<{ ok: true }>),
  sacarTienda: (id_obra: number, fecha_salida?: string) =>
    fetch(`/api/obras/${id_obra}/sacar-tienda`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fecha_salida }) }).then(json<{ ok: true }>),
  asignarExpo: (id_obra: number, id_expo: number) =>
    fetch(`/api/obras/${id_obra}/asignar-expo`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_expo }) }).then(json<{ ok: true }>),
  quitarExpo: (id_obra: number, id_expo: number) =>
    fetch(`/api/obras/${id_obra}/quitar-expo`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id_expo }) }).then(json<{ ok: true }>),

  // Catálogos
  listTiendas: () => fetch("/api/tiendas").then(json<Tienda[]>),
  listExpos: () => fetch("/api/expos").then(json<Expo[]>),
};
