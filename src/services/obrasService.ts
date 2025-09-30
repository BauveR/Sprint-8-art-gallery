import { api } from "../lib/api";
import { Obra, ObraInput } from "../types";

export const obrasService = {
  list: () => api.get<Obra[]>("/obras"),
  create: (input: ObraInput) => api.post<{ id_obra: number }>("/obras", input),
  update: (id: number, input: ObraInput) => api.put<{ ok: true }>(`/obras/${id}`, input),
  remove: (id: number) => api.del(`/obras/${id}`),

  asignarTienda: (id_obra: number, id_tienda: number, fecha_entrada?: string | null) =>
    api.post<{ ok: true }>(`/obras/${id_obra}/asignar-tienda`, { id_tienda, fecha_entrada }),
  sacarTienda: (id_obra: number, fecha_salida?: string | null) =>
    api.post<{ ok: true }>(`/obras/${id_obra}/sacar-tienda`, { fecha_salida }),

  asignarExpo: (id_obra: number, id_expo: number) =>
    api.post<{ ok: true }>(`/obras/${id_obra}/asignar-expo`, { id_expo }),
  quitarExpo: (id_obra: number, id_expo: number) =>
    api.post<{ ok: true }>(`/obras/${id_obra}/quitar-expo`, { id_expo }),
};
