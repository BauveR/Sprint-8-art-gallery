/**
 * Constantes de caché y refetch
 * Centraliza tiempos de actualización para React Query (DRY + KISS)
 */

export const CACHE_TIMES = {
  /** Intervalo de refetch para carrito (1 minuto) */
  CART_REFETCH_INTERVAL: 60 * 1000,

  /** Tiempo de staleness para órdenes (30 segundos) */
  ORDERS_STALE_TIME: 30 * 1000,

  /** Tiempo de staleness para obras (5 minutos) */
  OBRAS_STALE_TIME: 5 * 60 * 1000,

  /** Tiempo de staleness para datos estáticos (10 minutos) */
  STATIC_DATA_STALE_TIME: 10 * 60 * 1000,

  /** Tiempo de retención en caché (30 minutos) */
  DEFAULT_CACHE_TIME: 30 * 60 * 1000,
} as const;
