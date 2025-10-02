import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Obra, ObraInput } from "../types";
import { toast } from "sonner";

type Sort = { key: string; dir: "asc" | "desc" };
type Paged<T> = { data: T[]; total: number; page: number; pageSize: number };

function normalizePaged<T>(raw: any): Paged<T> {
  if (Array.isArray(raw)) {
    const data = raw as T[];
    return { data, total: data.length, page: 1, pageSize: data.length || 10 };
  }
  if (raw && Array.isArray(raw.data)) return raw as Paged<T>;
  return { data: [], total: 0, page: 1, pageSize: 10 };
}

export function useObras(opts?: { sort?: Sort; page?: number; pageSize?: number }) {
  const sort = opts?.sort;
  const page = opts?.page ?? 1;
  const pageSize = opts?.pageSize ?? 10;

  return useQuery({
    queryKey: ["obras", sort?.key ?? "id_obra", sort?.dir ?? "asc", page, pageSize],
    queryFn: async () => {
      const res = await api.get<any>("/obras", {
        sort: sort?.key,
        dir: sort?.dir,
        page,
        pageSize,
      });
      return normalizePaged<Obra>(res);
    },
  });
}

export function useCreateObra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ObraInput) => api.post<{ id_obra: number }>("/obras", input),
    onSuccess: () => {
      toast.success("Obra creada");
      qc.invalidateQueries({ queryKey: ["obras"] });
    },
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
      api.post<{ ok: true }>(`/obras/${p.id_obra}/asignar-tienda`, {
        id_tienda: p.id_tienda,
        fecha_entrada: p.fecha_entrada ?? null,
      }),
    onSuccess: () => {
      toast.success("Asignada a tienda");
      qc.invalidateQueries({ queryKey: ["obras"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Error al asignar a tienda"),
  });
}

export function useSacarTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; fecha_salida?: string | null }) =>
      api.post<{ ok: true }>(`/obras/${p.id_obra}/sacar-tienda`, {
        fecha_salida: p.fecha_salida ?? null,
      }),
    onSuccess: () => {
      toast.success("Sacada de tienda");
      qc.invalidateQueries({ queryKey: ["obras"] });
    },
  });
}

export function useAsignarExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; id_expo: number }) =>
      api.post<{ ok: true }>(`/obras/${p.id_obra}/asignar-expo`, { id_expo: p.id_expo }),
    onSuccess: () => {
      toast.success("Obra asignada a exposición");
      qc.invalidateQueries({ queryKey: ["obras"] });
    },
    onError: (e: any) => {
      const msg = String(e?.message ?? "");
      if (msg.includes("Duplicate entry") || msg.includes("uniq_obra_expo")) {
        toast.info("La obra ya está asignada a esa exposición.");
      } else {
        toast.error(msg || "Error al asignar a expo");
      }
    },
  });
}

export function useQuitarExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; id_expo: number }) =>
      api.post<{ ok: true }>(`/obras/${p.id_obra}/quitar-expo`, { id_expo: p.id_expo }),
    onSuccess: () => {
      toast.success("Obra quitada de la exposición");
      qc.invalidateQueries({ queryKey: ["obras"] });
    },
  });
}
