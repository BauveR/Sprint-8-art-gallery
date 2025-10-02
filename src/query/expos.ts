import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Expo, ExpoInput } from "@/types";
import { toast } from "sonner";

export function useExpos() {
  return useQuery<Expo[]>({ queryKey: ["expos"], queryFn: () => api.get("/expos") });
}
export function useCreateExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ExpoInput) => api.post<{ id_expo: number }>("/expos", input),
    onSuccess: () => { toast.success("Exposición creada"); qc.invalidateQueries({ queryKey: ["expos"] }); },
    onError: (e: any) => toast.error(e.message ?? "Error al crear exposición"),
  });
}
