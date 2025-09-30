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
