import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Obra, ObraInput } from "@/types";

type Sort = { key: string; dir: "asc" | "desc" };
type Paged<T> = { data: T[]; total: number; page: number; pageSize: number };

function normalizePaged<T>(raw: any): Paged<T> {
  if (Array.isArray(raw)) return { data: raw as T[], total: raw.length, page: 1, pageSize: raw.length || 10 };
  if (raw && Array.isArray(raw.data)) return raw as Paged<T>;
  return { data: [], total: 0, page: 1, pageSize: 10 };
}

export function useObras(opts?: { sort?: Sort; page?: number; pageSize?: number }) {
  const sort = opts?.sort; const page = opts?.page ?? 1; const pageSize = opts?.pageSize ?? 10;
  return useQuery({
    queryKey: ["obras", sort?.key ?? "id_obra", sort?.dir ?? "asc", page, pageSize],
    queryFn: async () => normalizePaged<Obra>(await api.get("/obras", { sort: sort?.key, dir: sort?.dir, page, pageSize })),
  });
}

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
    mutationFn: (p: { id: number; input: ObraInput }) => api.put<{ ok: true }>(`/obras/${p.id}`, p.input),
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
