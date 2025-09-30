import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { obrasService } from "../services/obrasService";
import { Obra, ObraInput } from "../types";
import { toast } from "sonner";

export const obrasKeys = {
  all: ["obras"] as const,
};

export function useObras() {
  return useQuery<Obra[]>({
    queryKey: obrasKeys.all,
    queryFn: obrasService.list,
  });
}

export function useCreateObra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: obrasService.create,
    onSuccess: () => {
      toast.success("Obra creada");
      qc.invalidateQueries({ queryKey: obrasKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al crear obra"),
  });
}

export function useUpdateObra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ObraInput }) =>
      obrasService.update(id, input),
    onSuccess: () => {
      toast.success("Obra actualizada");
      qc.invalidateQueries({ queryKey: obrasKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al actualizar"),
  });
}

export function useRemoveObra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => obrasService.remove(id),
    onSuccess: () => {
      toast.success("Obra eliminada");
      qc.invalidateQueries({ queryKey: obrasKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al eliminar"),
  });
}

export function useAsignarTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id_obra, id_tienda, fecha_entrada }:
      { id_obra: number; id_tienda: number; fecha_entrada?: string | null }) =>
      obrasService.asignarTienda(id_obra, id_tienda, fecha_entrada),
    onSuccess: () => {
      toast.success("Asignada a tienda");
      qc.invalidateQueries({ queryKey: obrasKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al asignar tienda"),
  });
}

export function useSacarTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id_obra, fecha_salida }:
      { id_obra: number; fecha_salida?: string | null }) =>
      obrasService.sacarTienda(id_obra, fecha_salida),
    onSuccess: () => {
      toast.success("Sacada de tienda");
      qc.invalidateQueries({ queryKey: obrasKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al sacar de tienda"),
  });
}

export function useAsignarExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id_obra, id_expo }:{ id_obra: number; id_expo: number }) =>
      obrasService.asignarExpo(id_obra, id_expo),
    onSuccess: () => {
      toast.success("Asignada a exposición");
      qc.invalidateQueries({ queryKey: obrasKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al asignar expo"),
  });
}

export function useQuitarExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id_obra, id_expo }:{ id_obra: number; id_expo: number }) =>
      obrasService.quitarExpo(id_obra, id_expo),
    onSuccess: () => {
      toast.success("Quitada de exposición");
      qc.invalidateQueries({ queryKey: obrasKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al quitar expo"),
  });
}
