/**
 * Types relacionados con formularios y checkout
 */

/**
 * Datos del formulario de checkout
 */
export interface CheckoutFormData {
  nombre: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
}

/**
 * State genérico para edición de entidades
 */
export type EditState<T> = { id: number; form: T } | null;

/**
 * Configuración de sorting
 */
export interface SortConfig {
  key: string;
  dir: "asc" | "desc";
}
