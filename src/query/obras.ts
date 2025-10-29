import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { obrasService } from "../services/obrasService";
import { Obra, ObraInput } from "../types";

type Sort = { key: string; dir: "asc" | "desc" };
type Paged<T> = { data: T[]; total: number; page: number; pageSize: number };

function normalizePaged<T>(raw: any): Paged<T> {
  // Caso 1: el backend devuelve array plano (legacy)
  if (Array.isArray(raw)) {
    const data = raw as T[];
    return { data, total: data.length, page: 1, pageSize: data.length || 10 };
  }
  // Caso 2: objeto paginado
  if (raw && Array.isArray(raw.data)) {
    return raw as Paged<T>;
  }
  // Caso inesperado
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
    mutationFn: (input: ObraInput) => obrasService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useUpdateObra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id: number; input: ObraInput }) =>
      obrasService.update(p.id, p.input),
    onSuccess: async () => {
      console.log("[useUpdateObra] Invalidando queries...");
      await qc.invalidateQueries({ queryKey: ["obras"] });
      await qc.refetchQueries({ queryKey: ["obras"] });
      console.log("[useUpdateObra] Queries actualizadas");
    },
    onError: (error: any) => {
      console.error("[useUpdateObra] Error updating obra:", error);
    },
  });
}

export function useRemoveObra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => obrasService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useAsignarTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; id_tienda: number; fecha_entrada?: string | null }) =>
      obrasService.asignarTienda(p.id_obra, p.id_tienda, p.fecha_entrada),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useSacarTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; fecha_salida?: string | null }) =>
      obrasService.sacarTienda(p.id_obra, p.fecha_salida),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useAsignarExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; id_expo: number }) =>
      obrasService.asignarExpo(p.id_obra, p.id_expo),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}

export function useQuitarExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { id_obra: number; id_expo: number }) =>
      obrasService.quitarExpo(p.id_obra, p.id_expo),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["obras"] }),
  });
}
