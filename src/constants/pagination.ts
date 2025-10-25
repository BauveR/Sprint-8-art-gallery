/**
 * Constantes de paginación
 * Centraliza los tamaños de página para evitar números mágicos (DRY + KISS)
 */

export const PAGINATION = {
  /** Tamaño de página por defecto */
  DEFAULT_PAGE_SIZE: 10,

  /** Tamaño de página para lista de órdenes */
  ORDERS_PAGE_SIZE: 20,

  /** Tamaño de página para lista de obras */
  OBRAS_PAGE_SIZE: 8,

  /** Tamaño máximo permitido de página */
  MAX_PAGE_SIZE: 200,

  /** Página inicial */
  INITIAL_PAGE: 1,
} as const;
