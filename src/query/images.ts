import { useQuery } from "@tanstack/react-query";
import { imagenesService } from "../services/imageService";

/** Devuelve la URL de la imagen principal (la más reciente) o null */
export function usePrimaryImage(id_obra?: number) {
  return useQuery({
    enabled: !!id_obra,
    queryKey: ["obra-primary-img", id_obra],
    queryFn: async () => {
      const list = await imagenesService.listByObra(id_obra!);
      return (list[0]?.url ?? null) as string | null;
    },
    staleTime: 60_000,
  });
}
