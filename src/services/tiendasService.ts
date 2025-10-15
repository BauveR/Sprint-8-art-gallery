import { api } from "../api/client";
import { Tienda, TiendaInput } from "../types";

export const tiendasService = {
  list: () => api.get<Tienda[]>("/tiendas"),
  create: (input: TiendaInput) => api.post<{ id_tienda: number }>("/tiendas", input),
  update: (id: number, input: TiendaInput) => api.put<{ ok: true }>(`/tiendas/${id}`, input),
  remove: (id: number) => api.del(`/tiendas/${id}`),
};
