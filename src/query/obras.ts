import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Obra, ObraInput } from "../types";

// ===== List con sort =====
export function useObras(sort?: { key: string; dir: "asc" | "desc" }) {
  return useQuery({
    queryKey: ["obras", sort?.key ?? "id_obra", sort?.dir ?? "asc"],
    queryFn: () =>
      api.get<Obra[]>("/obras", {
        sort: sort?.key,
        dir: sort?.dir,
      }),
  });
}

// ===== Mutaciones =====
export function useCreateObra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ObraInput) => api.post<{ id_obra: number }>("/obras", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useUpdateObra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: number; input: ObraInput }) =>
      api.put<{ ok: true }>(`/obras/${p.id}`, p.input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useRemoveObra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.del(`/obras/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useAsignarTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; id_tienda: number; fecha_entrada?: string | null }) =>
      api.post<{ ok: true }>(`/obras/${p.id_obra}/asignar-tienda`, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useSacarTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; fecha_salida?: string | null }) =>
      api.post<{ ok: true }>(`/obras/${p.id_obra}/sacar-tienda`, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useAsignarExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; id_expo: number }) =>
      api.post<{ ok: true }>(`/obras/${p.id_obra}/asignar-expo`, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useQuitarExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; id_expo: number }) =>
      api.post<{ ok: true }>(`/obras/${p.id_obra}/quitar-expo`, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}
