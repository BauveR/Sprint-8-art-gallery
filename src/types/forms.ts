/**
 * Types relacionados con formularios y checkout
 */

/**
 * Datos del formulario de checkout
 */
export interface CheckoutFormData {
  email: string;
  nombre: string;
  telefono: string;
  direccion: string;
  numeroExterior: string;
  numeroInterior?: string;
  colonia: string;
  codigoPostal: string;
  ciudad: string;
  estado: string;
  pais: string;
  referencias?: string;
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
