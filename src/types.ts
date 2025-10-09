export type ObraImagen = {
  id: number;
  id_obra: number;
  url: string;
  created_at: string;
};

// ---------- Tiendas ----------
export type Tienda = {
  id_tienda: number;
  nombre: string;
  lat: number;
  lng: number;
  url_tienda?: string | null;
};

export type TiendaInput = {
  nombre: string;
  lat: number;
  lng: number;
  url_tienda?: string | null;
};

// ---------- Expos ----------
export type Expo = {
  id_expo: number;
  nombre: string;
  lat: number;
  lng: number;
  fecha_inicio: string; // "YYYY-MM-DD"
  fecha_fin: string;    // "YYYY-MM-DD"
  url_expo?: string | null;
};

export type ExpoInput = {
  nombre: string;
  lat: number;
  lng: number;
  fecha_inicio: string;
  fecha_fin: string;
  url_expo?: string | null;
};

// ---------- Obras ----------
export type EstadoVenta =
  | "disponible"
  | "en_carrito"
  | "procesando_envio"
  | "enviado"
  | "entregado"
  | "pendiente_devolucion"
  | "nunca_entregado";

export type Ubicacion = "en_exposicion" | "en_tienda" | "tienda_online" | "almacen";

export type Obra = {
  id_obra: number;
  autor: string;
  titulo: string;
  anio?: number | null;
  medidas?: string | null;
  tecnica?: string | null;

  // En MySQL DECIMAL puede venir como string; lo dejamos flexible
  precio_salida?: number | string | null;

  // Estado de venta (editable)
  estado_venta: EstadoVenta;

  // Ubicación física calculada por la VIEW (no editable)
  ubicacion?: Ubicacion | null;

  // Tracking de envío
  numero_seguimiento?: string | null;
  link_seguimiento?: string | null;

  // Información del comprador
  comprador_nombre?: string | null;
  comprador_email?: string | null;
  fecha_compra?: string | null;

  id_tienda?: number | null;
  tienda_nombre?: string | null;
  tienda_lat?: number | null;
  tienda_lng?: number | null;
  tienda_url?: string | null;

  id_expo?: number | null;
  expo_nombre?: string | null;
  expo_lat?: number | null;
  expo_lng?: number | null;
  expo_url?: string | null;
};

export type ObraInput = {
  autor: string;
  titulo: string;
  anio?: number | null;
  medidas?: string | null;
  tecnica?: string | null;
  precio_salida?: number | null;
  estado_venta?: EstadoVenta;
  numero_seguimiento?: string | null;
  link_seguimiento?: string | null;
  id_tienda?: number | null;
  id_expo?: number | null;
};
