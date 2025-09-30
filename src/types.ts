export type Obra = {
    id_obra: number;
    autor: string;
    titulo: string;
    anio: number | null;
    medidas: string | null;
    tecnica: string | null;
    precio_salida: string | number | null;
    disponibilidad?: "en_exposicion" | "en_tienda" | "almacen";
    id_expo?: number | null;
    expo_nombre?: string | null;
    expo_lat?: number | null;
    expo_lng?: number | null;
    expo_url?: string | null;
    id_tienda?: number | null;
    tienda_nombre?: string | null;
    tienda_lat?: number | null;
    tienda_lng?: number | null;
    tienda_url?: string | null;
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
  
  export type TiendaInput = Omit<Tienda, "id_tienda">;
  
  export type Expo = {
    id_expo: number;
    nombre: string;
    lat: number;
    lng: number;
    fecha_inicio: string; // YYYY-MM-DD
    fecha_fin: string;    // YYYY-MM-DD
    url_expo?: string | null;
  };
  
  export type ExpoInput = Omit<Expo, "id_expo">;
  