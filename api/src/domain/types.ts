// ----------- Obras -----------
export interface ObraInput {
  autor: string;
  titulo: string;
  anio?: number | null;
  medidas?: string | null;
  tecnica?: string | null;
  precio_salida?: number | null;
}

export interface ObraState {
  id_obra: number;
  autor: string;
  titulo: string;
  anio: number | null;
  medidas: string | null;
  tecnica: string | null;
  precio_salida: string | number | null; // MySQL puede devolver string en DECIMAL
  disponibilidad: "en_exposicion" | "en_tienda" | "almacen";
  id_expo: number | null;
  expo_nombre: string | null;
  expo_lat: number | null;
  expo_lng: number | null;
  expo_url: string | null;
  id_tienda: number | null;
  tienda_nombre: string | null;
  tienda_lat: number | null;
  tienda_lng: number | null;
  tienda_url: string | null;
}

// ----------- Tiendas -----------
export interface TiendaInput {
  nombre: string;
  lat: number;
  lng: number;
  url_tienda?: string | null;
}

// ----------- Expos -----------
export interface ExpoInput {
  nombre: string;
  lat: number;
  lng: number;
  fecha_inicio: string; // 'YYYY-MM-DD'
  fecha_fin: string;    // 'YYYY-MM-DD'
  url_expo?: string | null;
}
