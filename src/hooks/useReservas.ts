/**
 * Hooks para manejo de reservas (carrito de compras)
 * Refactorizado para usar utilidades centralizadas (DRY)
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api as apiClient } from "@/api/client";
import type { Reserva } from "@/types/domain";
import { getOrCreateSessionId, clearSessionId } from "@/utils/session";
import { CACHE_TIMES } from "@/constants/cache";

/**
 * Hook para obtener el carrito (reservas) del usuario
 */
export function useMyCart() {
  return useQuery({
    queryKey: ["reservas", "my-cart"],
    queryFn: async () => {
      const sessionId = getOrCreateSessionId();
      const data = await apiClient.get<{ data: Reserva[] }>(
        "/reservas/my-cart",
        undefined,
        { "x-session-id": sessionId }
      );
      return data.data as Reserva[];
    },
    refetchInterval: CACHE_TIMES.CART_REFETCH_INTERVAL,
  });
}

/**
 * Hook para agregar una obra al carrito (crear reserva)
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id_obra: number) => {
      const sessionId = getOrCreateSessionId();
      const data = await apiClient.post<{ data: any }>(
        "/reservas/add",
        { id_obra },
        { "x-session-id": sessionId }
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      queryClient.invalidateQueries({ queryKey: ["obras"] });
    },
  });
}

/**
 * Hook para remover una obra del carrito (eliminar reserva)
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id_obra: number) => {
      const sessionId = getOrCreateSessionId();
      const data = await apiClient.del(
        `/reservas/remove/${id_obra}`,
        { "x-session-id": sessionId }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
    },
  });
}

/**
 * Hook para validar disponibilidad de una obra
 */
export function useValidateAvailability() {
  return useMutation({
    mutationFn: async (id_obra: number) => {
      const sessionId = getOrCreateSessionId();
      const data = await apiClient.post<{ data: any }>(
        "/reservas/validate",
        { id_obra },
        { "x-session-id": sessionId }
      );
      return data.data;
    },
  });
}

/**
 * Hook para validar todo el carrito antes del checkout
 */
export function useValidateCart() {
  return useMutation({
    mutationFn: async (items: number[]) => {
      const sessionId = getOrCreateSessionId();
      const data = await apiClient.post<{ data: any }>(
        "/reservas/validate-cart",
        { items },
        { "x-session-id": sessionId }
      );
      return data.data;
    },
  });
}

/**
 * Hook para liberar todas las reservas (al completar compra o abandonar)
 */
export function useReleaseAllReservas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const sessionId = getOrCreateSessionId();
      const data = await apiClient.del(
        "/reservas/release-all",
        { "x-session-id": sessionId }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      // Limpiar session ID después de liberar (usar utility)
      clearSessionId();
    },
  });
}

/**
 * Hook para limpiar reservas expiradas (admin)
 */
export function useCleanupExpired() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const data = await apiClient.post<{ data: any }>("/reservas/cleanup", {});
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
    },
  });
}
