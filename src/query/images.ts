import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ObraImagen } from "@/types";

export function listImagesByObra(id_obra: number) {
  return api.get<ObraImagen[]>(`/obras/${id_obra}/imagenes`);
}

export function usePrimaryImage(id_obra?: number) {
  return useQuery({
    enabled: !!id_obra,
    queryKey: ["obra-primary-img", id_obra],
    queryFn: async () => {
      const list = await listImagesByObra(id_obra!);
      return (list[0]?.url ?? null) as string | null;
    },
    staleTime: 60_000,
  });
}

export function uploadImage(id_obra: number, file: File) {
  const fd = new FormData();
  fd.append("file", file);
  return api.postForm<{ id: number; url: string }>(`/obras/${id_obra}/imagenes`, fd);
}
export const deleteImage = (id: number) => api.del(`/imagenes/${id}`);
