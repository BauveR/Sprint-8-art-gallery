import { api as apiWithAuth } from "../api/clientWithAuth";
import { api } from "../api/client";
import { Obra, ObraInput } from "../types";

// Debug: verificar que apiWithAuth está definido
console.log('[obrasService] apiWithAuth loaded:', !!apiWithAuth);
console.log('[obrasService] apiWithAuth.post type:', typeof apiWithAuth?.post);

export const obrasService = {
  list: () => api.get<Obra[]>("/obras"), // Público - sin auth
  create: (input: ObraInput) => {
    console.log('[obrasService] create called with:', input);
    console.log('[obrasService] using apiWithAuth.post');
    return apiWithAuth.post<{ id_obra: number }>("/obras", input);
  }, // Admin - con auth
  update: (id: number, input: ObraInput) => apiWithAuth.put<{ ok: true }>(`/obras/${id}`, input), // Admin - con auth
  remove: (id: number) => apiWithAuth.del(`/obras/${id}`), // Admin - con auth

  asignarTienda: (id_obra: number, id_tienda: number, fecha_entrada?: string | null) =>
    apiWithAuth.post<{ ok: true }>(`/obras/${id_obra}/asignar-tienda`, { id_tienda, fecha_entrada }), // Admin - con auth
  sacarTienda: (id_obra: number, fecha_salida?: string | null) =>
    apiWithAuth.post<{ ok: true }>(`/obras/${id_obra}/sacar-tienda`, { fecha_salida }), // Admin - con auth

  asignarExpo: (id_obra: number, id_expo: number) =>
    apiWithAuth.post<{ ok: true }>(`/obras/${id_obra}/asignar-expo`, { id_expo }), // Admin - con auth
  quitarExpo: (id_obra: number, id_expo: number) =>
    apiWithAuth.post<{ ok: true }>(`/obras/${id_obra}/quitar-expo`, { id_expo }), // Admin - con auth
};
