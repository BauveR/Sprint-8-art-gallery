import { api as apiWithAuth } from "../api/clientWithAuth";
import { api } from "../api/client";
import { ObraImagen } from "../types";

export const imagenesService = {
  listByObra: (id_obra: number) => api.get<ObraImagen[]>(`/obras/${id_obra}/imagenes`), // Público - sin auth
  uploadForObra: (id_obra: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiWithAuth.postForm<{ id: number; url: string }>(`/obras/${id_obra}/imagenes`, fd); // Admin - con auth
  },
  remove: (id: number) => apiWithAuth.del(`/imagenes/${id}`), // Admin - con auth
};
