/**
 * Constantes relacionadas con órdenes
 * Centraliza estados, labels y opciones de órdenes (DRY + KISS)
 */

import type { OrderStatus } from "@/types/orders";

/**
 * Labels legibles para cada estado de orden
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  processing_shipment: "Procesando envío",
  shipped: "Enviado",
  delivered: "Entregado",
  pending_return: "Devolución pendiente",
  never_delivered: "No entregado",
  cancelled: "Cancelado",
} as const;

/**
 * Opciones para selector de estado (incluye "Todos")
 */
export const STATUS_FILTER_OPTIONS = [
  { value: "all" as const, label: "Todos los estados" },
  ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
    value: value as OrderStatus,
    label,
  })),
] as const;

/**
 * Colores/variantes para cada estado
 */
export const ORDER_STATUS_VARIANTS: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  paid: "secondary",
  processing_shipment: "default",
  shipped: "default",
  delivered: "default",
  pending_return: "destructive",
  never_delivered: "destructive",
  cancelled: "destructive",
} as const;

/**
 * Estados que requieren notificación por email
 */
export const NOTIFIABLE_STATUSES: OrderStatus[] = [
  "shipped",
  "delivered",
] as const;
