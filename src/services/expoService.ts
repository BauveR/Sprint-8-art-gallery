import { Expo, Obra } from "../types";

export const exposService = {
  list: async (): Promise<Expo[]> => {
    const res = await fetch("/data/obras.json");
    if (!res.ok) throw new Error("Error cargando exposiciones");
    const obras: Obra[] = await res.json();
    const map = new Map<number, Expo>();
    for (const o of obras) {
      if (o.id_expo && o.expo_nombre) {
        map.set(o.id_expo, {
          id_expo: o.id_expo,
          nombre: o.expo_nombre,
          lat: 0,
          lng: 0,
          fecha_inicio: "",
          fecha_fin: "",
        });
      }
    }
    return Array.from(map.values());
  },
};
