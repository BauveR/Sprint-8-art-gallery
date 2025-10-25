/**
 * Types relacionados con pedidos/órdenes
 */

/**
 * Estados posibles de una orden
 */
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing_shipment"
  | "shipped"
  | "delivered"
  | "pending_return"
  | "never_delivered"
  | "cancelled";

/**
 * Información completa de un pedido/orden
 */
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

/**
 * Historial de cambios de estado de una orden
 */
export interface OrderStatusHistory {
  id_history: number;
  id_orden: number;
  status_from?: OrderStatus;
  status_to: OrderStatus;
  changed_by?: string;
  notes?: string;
  created_at: Date;
}

/**
 * Filtros para búsqueda de órdenes
 */
export interface OrdersFilters {
  status?: OrderStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

/**
 * Estadísticas de órdenes
 */
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
