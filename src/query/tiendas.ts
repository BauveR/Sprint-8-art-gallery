import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Tienda, TiendaInput } from "@/types";
import { toast } from "sonner";

export function useTiendas() {
  return useQuery<Tienda[]>({ queryKey: ["tiendas"], queryFn: () => api.get("/tiendas") });
}
export function useCreateTienda() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TiendaInput) => api.post<{ id_tienda: number }>("/tiendas", input),
    onSuccess: () => { toast.success("Tienda creada"); qc.invalidateQueries({ queryKey: ["tiendas"] }); },
    onError: (e: any) => toast.error(e.message ?? "Error al crear tienda"),
  });
}
