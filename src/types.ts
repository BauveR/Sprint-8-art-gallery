// Dominios
export type Obra = {
  id_obra: number;
  autor: string;
  titulo: string;
  anio: number | null;
  medidas: string | null;
  tecnica: string | null;
  precio_salida: number | string | null;

  // Campos “vista” opcionales
  disponibilidad?: string | null;
  id_tienda?: number | null;
  tienda_nombre?: string | null;
  id_expo?: number | null;
  expo_nombre?: string | null;
};

export type ObraInput = {
  autor: string;
  titulo: string;
  anio?: number | null;
  medidas?: string | null;
  tecnica?: string | null;
  precio_salida?: number | null;
};

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

export type Expo = {
  id_expo: number;
  nombre: string;
  lat: number;
  lng: number;
  fecha_inicio: string; // YYYY-MM-DD
  fecha_fin: string;    // YYYY-MM-DD
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
