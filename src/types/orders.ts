/**
 * Types relacionados con pedidos/órdenes
 */

/**
 * Información de un pedido/orden
 */
export interface Order {
  id_obra: number;
  titulo: string;
  autor: string;
  estado_venta: string;
  numero_seguimiento?: string | null;
  link_seguimiento?: string | null;
  fecha_compra?: string | null;
  precio_salida?: string | number | null;
}
