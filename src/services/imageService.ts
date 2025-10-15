import { api } from "../api/client";
import { ObraImagen } from "../types";

export const imagenesService = {
  listByObra: (id_obra: number) => api.get<ObraImagen[]>(`/obras/${id_obra}/imagenes`),
  uploadForObra: (id_obra: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.postForm<{ id: number; url: string }>(`/obras/${id_obra}/imagenes`, fd);
  },
  remove: (id: number) => api.del(`/imagenes/${id}`),
};
