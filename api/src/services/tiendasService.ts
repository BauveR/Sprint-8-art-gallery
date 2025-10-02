import * as repo from "../repositories/tiendasRepo";
import { tiendaInputSchema } from "../domain/validation";
import type { TiendaInput } from "../domain/types";

export async function listTiendas() {
  return repo.listTiendas();
}

export async function createTienda(body: unknown) {
  const input = tiendaInputSchema.parse(body) as TiendaInput;
  return repo.insertTienda(input);
}

export async function updateTienda(id_tienda: number, body: unknown) {
  const input = tiendaInputSchema.parse(body) as TiendaInput;
  const exists = await repo.findTiendaById(id_tienda);
  if (!exists) throw new Error("Tienda no encontrada");
  await repo.updateTienda(id_tienda, input);
}

export async function removeTienda(id_tienda: number) {
  await repo.deleteTienda(id_tienda);
}
