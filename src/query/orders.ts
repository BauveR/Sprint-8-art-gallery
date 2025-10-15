import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import type { Obra } from "../types";

/**
 * Hook para obtener las compras de un usuario por email
 */
export function useOrders(email?: string | null) {
  return useQuery({
    queryKey: ["orders", email],
    queryFn: async () => {
      if (!email) return [];
      return api.get<Obra[]>("/orders", { email });
    },
    enabled: !!email,
  });
}
