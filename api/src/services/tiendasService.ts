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
