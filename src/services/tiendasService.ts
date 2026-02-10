import { Tienda, Obra } from "../types";

export const tiendasService = {
  list: async (): Promise<Tienda[]> => {
    const res = await fetch("/data/obras.json");
    if (!res.ok) throw new Error("Error cargando tiendas");
    const obras: Obra[] = await res.json();
    const map = new Map<number, Tienda>();
    for (const o of obras) {
      if (o.id_tienda && o.tienda_nombre) {
        map.set(o.id_tienda, {
          id_tienda: o.id_tienda,
          nombre: o.tienda_nombre,
          lat: 0,
          lng: 0,
        });
      }
    }
    return Array.from(map.values());
  },
};
