// src/api.ts
export type Obra = {
    id_obra: number;
    autor: string;
    titulo: string;
    anio: number | null;
    medidas: string | null;
    tecnica: string | null;
    precio_salida: string | number | null;
    disponibilidad: "en_exposicion" | "en_tienda" | "almacen";
    tienda_nombre?: string | null;
    tienda_url?: string | null;
    expo_nombre?: string | null;
    expo_url?: string | null;
  };
  
  export async function fetchObras(): Promise<Obra[]> {
    const r = await fetch("/api/obras");
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }
  
  export async function crearObra(payload: {
    autor: string;
    titulo: string;
    anio?: number | null;
    medidas?: string | null;
    tecnica?: string | null;
    precio_salida?: number | null;
  }): Promise<{ id_obra: number }> {
    const r = await fetch("/api/obras", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const msg = await r.text();
      throw new Error(msg || `HTTP ${r.status}`);
    }
    return r.json();
  }
  