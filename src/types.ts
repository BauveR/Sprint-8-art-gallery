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
  url_tienda?: string;
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
  url_expo?: string;
};

// ---------- Obras ----------
export type Obra = {
  id_obra: number;
  autor: string;
  titulo: string;
  anio?: number | null;
  medidas?: string | null;
  tecnica?: string | null;

  // En MySQL DECIMAL puede venir como string; lo dejamos flexible
  precio_salida?: number | string | null;

  // Campos “derivados” del view obras_estado_actual (si los tienes)
  disponibilidad?: "en_taller" | "en_tienda" | "en_exposicion" | string | null;

  id_tienda?: number | null;
  tienda_nombre?: string | null;

  id_expo?: number | null;
  expo_nombre?: string | null;
};

export type ObraInput = {
  autor: string;
  titulo: string;
  anio?: number | null;
  medidas?: string;
  tecnica?: string;
  precio_salida?: number | null;
};
