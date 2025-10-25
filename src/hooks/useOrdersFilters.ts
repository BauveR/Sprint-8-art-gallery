/**
 * Hook para manejar filtros y paginación de órdenes
 * Simplifica la lógica de filtros (KISS) y evita duplicación (DRY)
 */

import { useState, useCallback, useMemo } from "react";
import type { OrdersFilters, OrderStatus } from "@/types/orders";
import { PAGINATION } from "@/constants/pagination";

export interface UseOrdersFiltersOptions {
  /** Tamaño de página inicial */
  initialPageSize?: number;

  /** Estado inicial del filtro de status */
  initialStatus?: OrderStatus | "all";

  /** Búsqueda inicial */
  initialSearch?: string;
}

export interface UseOrdersFiltersResult {
  /** Filtros actuales */
  filters: OrdersFilters & { statusFilter: OrderStatus | "all" };

  /** Actualiza un filtro específico */
  updateFilter: <K extends keyof OrdersFilters>(key: K, value: OrdersFilters[K]) => void;

  /** Actualiza el filtro de status (incluyendo "all") */
  setStatusFilter: (status: OrderStatus | "all") => void;

  /** Actualiza la búsqueda */
  setSearch: (search: string) => void;

  /** Cambia la página */
  setPage: (page: number) => void;

  /** Reinicia todos los filtros */
  resetFilters: () => void;

  /** Parámetros listos para pasar a useOrders */
  queryParams: {
    status?: OrderStatus;
    search?: string;
    limit: number;
    offset: number;
  };

  /** Información de paginación */
  pagination: {
    page: number;
    pageSize: number;
    getTotalPages: (total: number) => number;
  };
}

/**
 * Hook para manejar filtros de órdenes de forma centralizada
 *
 * @example
 * const { filters, setStatusFilter, setSearch, setPage, queryParams } = useOrdersFilters();
 * const { data } = useOrders(queryParams);
 */
export function useOrdersFilters(
  options: UseOrdersFiltersOptions = {}
): UseOrdersFiltersResult {
  const {
    initialPageSize = PAGINATION.ORDERS_PAGE_SIZE,
    initialStatus = "all",
    initialSearch = "",
  } = options;

  const [statusFilter, setStatusFilterState] = useState<OrderStatus | "all">(initialStatus);
  const [search, setSearchState] = useState(initialSearch);
  const [page, setPageState] = useState(PAGINATION.INITIAL_PAGE);
  const [pageSize] = useState(initialPageSize);

  // Actualizar status y resetear página
  const setStatusFilter = useCallback((status: OrderStatus | "all") => {
    setStatusFilterState(status);
    setPageState(PAGINATION.INITIAL_PAGE);
  }, []);

  // Actualizar búsqueda y resetear página
  const setSearch = useCallback((newSearch: string) => {
    setSearchState(newSearch);
    setPageState(PAGINATION.INITIAL_PAGE);
  }, []);

  // Cambiar página
  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  // Actualizar filtro genérico
  const updateFilter = useCallback(<K extends keyof OrdersFilters>(
    key: K,
    value: OrdersFilters[K]
  ) => {
    if (key === "status") {
      setStatusFilter(value as OrderStatus | "all");
    } else if (key === "search") {
      setSearch(value as string);
    } else if (key === "offset") {
      // Calcular página desde offset
      const newPage = Math.floor((value as number) / pageSize) + 1;
      setPageState(newPage);
    }
  }, [pageSize, setStatusFilter, setSearch]);

  // Reiniciar filtros
  const resetFilters = useCallback(() => {
    setStatusFilterState(initialStatus);
    setSearchState(initialSearch);
    setPageState(PAGINATION.INITIAL_PAGE);
  }, [initialStatus, initialSearch]);

  // Filtros combinados
  const filters = useMemo(() => ({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: search || undefined,
    limit: pageSize,
    offset: (page - 1) * pageSize,
    statusFilter,
  }), [statusFilter, search, page, pageSize]);

  // Parámetros para el query
  const queryParams = useMemo(() => ({
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: search || undefined,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  }), [statusFilter, search, page, pageSize]);

  // Info de paginación
  const pagination = useMemo(() => ({
    page,
    pageSize,
    getTotalPages: (total: number) => Math.max(1, Math.ceil(total / pageSize)),
  }), [page, pageSize]);

  return {
    filters,
    updateFilter,
    setStatusFilter,
    setSearch,
    setPage,
    resetFilters,
    queryParams,
    pagination,
  };
}
