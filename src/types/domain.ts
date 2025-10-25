/**
 * Tipos de dominio - Modelos de datos de la aplicación
 */

/**
 * Información de una obra de arte
 */
export interface Obra {
  id_obra: number;
  autor: string;
  titulo: string;
  anio: number | null;
  medidas: string | null;
  tecnica: string | null;
  precio_salida: string | number | null;
  estado_venta: "disponible" | "en_carrito" | "procesando_envio" | "enviado" | "entregado" | "pendiente_devolucion" | "nunca_entregado";
  numero_seguimiento?: string | null;
  link_seguimiento?: string | null;
  comprador_nombre?: string | null;
  comprador_email?: string | null;
  fecha_compra?: string | null;
}

/**
 * Input para crear o actualizar una obra
 */
export interface ObraInput {
  autor: string;
  titulo: string;
  anio?: number | null;
  medidas?: string | null;
  tecnica?: string | null;
  precio_salida?: number | null;
  estado_venta?: Obra['estado_venta'];
  numero_seguimiento?: string | null;
  link_seguimiento?: string | null;
  comprador_nombre?: string | null;
  comprador_email?: string | null;
  fecha_compra?: string | null;
}

/**
 * Imagen de una obra
 */
export interface ObraImagen {
  id_imagen: number;
  id_obra: number;
  url: string;
  orden: number;
  es_principal: boolean;
  created_at?: Date;
}

/**
 * Reserva temporal de una obra en el carrito
 */
export interface Reserva {
  id_reserva: number;
  id_obra: number;
  id_user: string;
  session_id: string;
  expires_at: Date;
  created_at: Date;
  // Campos adicionales cuando se hace JOIN con obras
  titulo?: string;
  precio_salida?: string | number;
}

/**
 * Dirección de envío
 */
export interface DireccionEnvio {
  id_direccion: number;
  id_user: string;
  nombre_completo: string;
  telefono: string;
  email?: string;
  direccion: string;
  numero_exterior: string;
  numero_interior?: string;
  colonia: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
  pais: string;
  referencias?: string;
  es_predeterminada: boolean;
  alias?: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Input para crear una dirección de envío
 */
export interface CreateDireccionInput {
  nombre_completo: string;
  telefono: string;
  email?: string;
  direccion: string;
  numero_exterior: string;
  numero_interior?: string;
  colonia: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
  pais?: string;
  referencias?: string;
  es_predeterminada?: boolean;
  alias?: string;
}

/**
 * Tienda física u online
 */
export interface Tienda {
  id_tienda: number;
  nombre: string;
  direccion?: string;
  lat?: number;
  lng?: number;
  url?: string;
  es_online: boolean;
}

/**
 * Exposición
 */
export interface Exposicion {
  id_expo: number;
  nombre: string;
  ubicacion?: string;
  lat?: number;
  lng?: number;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  url?: string;
}
