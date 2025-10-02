import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { exposService } from "../services/expoService";
import { Expo, ExpoInput } from "../types";
import { toast } from "sonner";

export const exposKeys = { all: ["expos"] as const };

export function useExpos() {
  return useQuery<Expo[]>({
    queryKey: exposKeys.all,
    queryFn: exposService.list,
  });
}

export function useCreateExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ExpoInput) => exposService.create(input),
    onSuccess: () => {
      toast.success("Exposición creada");
      qc.invalidateQueries({ queryKey: exposKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al crear expo"),
  });
}

export function useUpdateExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: ExpoInput }) => exposService.update(id, input),
    onSuccess: () => {
      toast.success("Exposición actualizada");
      qc.invalidateQueries({ queryKey: exposKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al actualizar expo"),
  });
}

export function useRemoveExpo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => exposService.remove(id),
    onSuccess: () => {
      toast.success("Exposición eliminada");
      qc.invalidateQueries({ queryKey: exposKeys.all });
    },
    onError: (e: any) => toast.error(e.message ?? "Error al eliminar expo"),
  });
}
