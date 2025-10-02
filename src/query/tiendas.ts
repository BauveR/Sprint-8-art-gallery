import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tiendasService } from "../services/tiendasService";
import { Tienda, TiendaInput } from "../types";
import { toast } from "sonner";

export const tiendasKeys = { all: ["tiendas"] as const };

export function useTiendas() {
  return useQuery<Tienda[]>({
    queryKey: tiendasKeys.all,
    queryFn: tiendasService.list,
  });
}

export function useCreateTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TiendaInput) => tiendasService.create(input),
    onSuccess: () => {
      toast.success("Tienda creada");
      qc.invalidateQueries({ queryKey: tiendasKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al crear tienda"),
  });
}

export function useUpdateTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TiendaInput }) => tiendasService.update(id, input),
    onSuccess: () => {
      toast.success("Tienda actualizada");
      qc.invalidateQueries({ queryKey: tiendasKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al actualizar tienda"),
  });
}

export function useRemoveTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => tiendasService.remove(id),
    onSuccess: () => {
      toast.success("Tienda eliminada");
      qc.invalidateQueries({ queryKey: tiendasKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al eliminar tienda"),
  });
}
