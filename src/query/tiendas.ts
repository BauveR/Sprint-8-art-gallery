import { useQuery } from "@tanstack/react-query";
import { tiendasService } from "../services/tiendasService";
import { Tienda } from "../types";

export const tiendasKeys = { all: ["tiendas"] as const };

export function useTiendas() {
  return useQuery<Tienda[]>({
    queryKey: tiendasKeys.all,
    queryFn: tiendasService.list,
  });
}
