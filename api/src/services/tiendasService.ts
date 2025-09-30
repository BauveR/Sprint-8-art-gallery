import * as repo from "../respositories/tiendasRepo";
import { TiendaInput } from "../domain/types";

export function listTiendas() {
  return repo.listTiendas();
}

export async function createTienda(input: TiendaInput) {
  if (!input.nombre || input.lat === undefined || input.lng === undefined) {
    throw new Error("nombre, lat y lng son obligatorios");
  }
  return repo.insertTienda(input);
}
