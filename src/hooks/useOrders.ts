import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api as apiClient } from "@/api/clientWithAuth";

interface ApiResponse<T> {
  data: T;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing_shipment"
  | "shipped"
  | "delivered"
  | "pending_return"
  | "never_delivered"
  | "cancelled";

export interface Order {
  id_orden: number;
  order_number: string;
  id_user: string;
  user_email: string;
  user_name: string;
  id_direccion?: number;
  shipping_snapshot: any;
  items: any[];
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_intent_id?: string;
  tracking_number?: string;
  carrier?: string;
  tracking_link?: string;
  estimated_delivery?: Date;
  delivered_at?: Date;
  admin_notes?: string;
  return_reason?: string;
  customer_notes?: string;
  created_at: Date;
  updated_at: Date;
  paid_at?: Date;
  shipped_at?: Date;
}

export interface OrderStatusHistory {
  id_history: number;
  id_orden: number;
  status_from?: OrderStatus;
  status_to: OrderStatus;
  changed_by?: string;
  notes?: string;
  created_at: Date;
}

export interface OrdersFilters {
  status?: OrderStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

/**
 * Hook para obtener todas las órdenes (admin)
 */
export function useOrders(filters?: OrdersFilters) {
  return useQuery({
    queryKey: ["orders", "all", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.append("status", filters.status);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters?.dateTo) params.append("dateTo", filters.dateTo);
      if (filters?.limit) params.append("limit", filters.limit.toString());
      if (filters?.offset) params.append("offset", filters.offset.toString());

      const response = await apiClient.get<{
        success: boolean;
        data: Order[];
        total: number;
        page: number;
        pages: number;
      }>(`/orders/all?${params.toString()}`);
      return response || { data: [], total: 0, page: 1, pages: 1 };
    },
  });
}

export interface OrderStats {
  total: number;
  pending: number;
  paid: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total_revenue: number;
  recent_orders: Order[];
}

/**
 * Hook para obtener estadísticas de órdenes (admin)
 */
export function useOrderStats() {
  return useQuery({
    queryKey: ["orders", "stats"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: OrderStats }>("/orders/stats");
      return response?.data || {
        total: 0,
        pending: 0,
        paid: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        total_revenue: 0,
        recent_orders: [],
      };
    },
  });
}

/**
 * Hook para obtener una orden por ID
 */
export function useOrder(id: number) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Order>>(`/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para obtener el historial de una orden
 */
export function useOrderHistory(id: number) {
  return useQuery({
    queryKey: ["orders", id, "history"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<OrderStatusHistory[]>>(`/orders/${id}/history`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para obtener órdenes del usuario autenticado
 */
export function useMyOrders(enabled = true) {
  return useQuery({
    queryKey: ["orders", "my-orders"],
    queryFn: async () => {
      const response = await apiClient.get<{ data: Order[] }>("/orders/my-orders");
      return response?.data || [];
    },
    enabled,
  });
}

/**
 * Hook para actualizar el estado de una orden
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      tracking_number,
      carrier,
      estimated_delivery,
      admin_notes,
      return_reason,
    }: {
      id: number;
      status: OrderStatus;
      tracking_number?: string;
      carrier?: string;
      estimated_delivery?: string;
      admin_notes?: string;
      return_reason?: string;
    }) => {
      const response = await apiClient.put<ApiResponse<Order>>(`/orders/${id}/status`, {
        status,
        tracking_number,
        carrier,
        estimated_delivery,
        admin_notes,
        return_reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/**
 * Hook para cancelar una orden
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason?: string }) => {
      const response = await apiClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

/**
 * Hook para crear una orden
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiClient.post<ApiResponse<Order>>("/orders", orderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
