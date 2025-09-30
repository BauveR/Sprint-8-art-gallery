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
