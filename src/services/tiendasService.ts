import { api } from "../lib/api";
import { Tienda, TiendaInput } from "../types";

export const tiendasService = {
  list: () => api.get<Tienda[]>("/tiendas"),
  create: (input: TiendaInput) => api.post<{ id_tienda: number }>("/tiendas", input),
};
