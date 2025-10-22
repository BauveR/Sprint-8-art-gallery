import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api as apiClient } from "@/api/client";

export interface Reserva {
  id_reserva: number;
  id_obra: number;
  id_user: string;
  session_id: string;
  expires_at: Date;
  created_at: Date;
  titulo?: string;
  precio_salida?: number;
}

/**
 * Hook para obtener el carrito (reservas) del usuario
 */
export function useMyCart() {
  // Obtener o crear session_id para usuarios anónimos
  const getSessionId = () => {
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
  };

  return useQuery({
    queryKey: ["reservas", "my-cart"],
    queryFn: async () => {
      const sessionId = getSessionId();
      const data = await apiClient.get<{ data: Reserva[] }>(
        "/reservas/my-cart",
        undefined,
        { "x-session-id": sessionId }
      );
      return data.data as Reserva[];
    },
    refetchInterval: 60000, // Refetch cada minuto para verificar expiración
  });
}

/**
 * Hook para agregar una obra al carrito (crear reserva)
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  const getSessionId = () => {
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
  };

  return useMutation({
    mutationFn: async (id_obra: number) => {
      const sessionId = getSessionId();
      const data = await apiClient.post<{ data: any }>(
        "/reservas/add",
        { id_obra },
        { "x-session-id": sessionId }
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
    },
  });
}

/**
 * Hook para remover una obra del carrito (eliminar reserva)
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  const getSessionId = () => {
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
  };

  return useMutation({
    mutationFn: async (id_obra: number) => {
      const sessionId = getSessionId();
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
  const getSessionId = () => {
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
  };

  return useMutation({
    mutationFn: async (id_obra: number) => {
      const sessionId = getSessionId();
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
  const getSessionId = () => {
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
  };

  return useMutation({
    mutationFn: async (items: number[]) => {
      const sessionId = getSessionId();
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

  const getSessionId = () => {
    let sessionId = localStorage.getItem("cart_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart_session_id", sessionId);
    }
    return sessionId;
  };

  return useMutation({
    mutationFn: async () => {
      const sessionId = getSessionId();
      const data = await apiClient.del(
        "/reservas/release-all",
        { "x-session-id": sessionId }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservas"] });
      // Limpiar session ID después de liberar
      localStorage.removeItem("cart_session_id");
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
