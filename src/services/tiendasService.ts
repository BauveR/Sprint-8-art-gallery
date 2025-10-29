import { api as apiWithAuth } from "../api/clientWithAuth";
import { api } from "../api/client";
import { Tienda, TiendaInput } from "../types";

export const tiendasService = {
  list: () => api.get<Tienda[]>("/tiendas"), // Público - sin auth
  create: (input: TiendaInput) => apiWithAuth.post<{ id_tienda: number }>("/tiendas", input), // Admin - con auth
  update: (id: number, input: TiendaInput) => apiWithAuth.put<{ ok: true }>(`/tiendas/${id}`, input), // Admin - con auth
  remove: (id: number) => apiWithAuth.del(`/tiendas/${id}`), // Admin - con auth
};
