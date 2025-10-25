/**
 * Tipos relacionados con navegación y rutas
 */

/**
 * Tabs disponibles en la aplicación
 */
export type Tab = "admin" | "obras" | "tiendas" | "expos" | "orders";

/**
 * Tabs del Home page (sin orders)
 */
export type HomeTab = Exclude<Tab, "orders">;
