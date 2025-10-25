/**
 * Tipos relacionados con llamadas a API
 */

/**
 * Respuesta genérica de la API
 */
export interface ApiResponse<T> {
  data: T;
}

/**
 * Respuesta de API con paginación
 */
export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pages: number;
}

/**
 * Respuesta de error de la API
 */
export interface ApiError {
  error: string;
  message?: string;
  details?: any;
}
