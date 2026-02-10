import { Obra } from "../types";

export const obrasService = {
  list: async (): Promise<Obra[]> => {
    const res = await fetch("/data/obras.json");
    if (!res.ok) throw new Error("Error cargando obras");
    return res.json();
  },
};
