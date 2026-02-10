import { ObraImagen } from "../types";

export const imagenesService = {
  listByObra: async (id_obra: number): Promise<ObraImagen[]> => {
    const res = await fetch("/data/imagenes.json");
    if (!res.ok) throw new Error("Error cargando imágenes");
    const all: ObraImagen[] = await res.json();
    return all.filter((img) => img.id_obra === id_obra);
  },
};
