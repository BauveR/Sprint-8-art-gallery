import * as repo from "../respositories/obrasRepo";
import * as tiendasRepo from "../respositories/tiendasRepo";
import * as exposRepo from "../respositories/expos.Repo";
import { ObraInput } from "../domain/types";

export function getObras() {
  return repo.listObrasEstadoActual();
}

export async function createObra(input: ObraInput) {
  if (!input.autor || !input.titulo) {
    throw new Error("autor y titulo son obligatorios");
  }
  return repo.insertObra(input);
}

export async function updateObra(id_obra: number, input: ObraInput) {
  const exists = await repo.findObraById(id_obra);
  if (!exists) throw new Error("obra no encontrada");
  await repo.updateObra(id_obra, input);
}

export async function removeObra(id_obra: number) {
  const exists = await repo.findObraById(id_obra);
  if (!exists) return;
  await repo.deleteObra(id_obra);
}

export async function linkTienda(
  id_obra: number,
  id_tienda: number,
  fecha_entrada?: string | null
) {
  const obra = await repo.findObraById(id_obra);
  if (!obra) throw new Error("obra no encontrada");

  const tienda = await tiendasRepo.findTiendaById(id_tienda);
  if (!tienda) throw new Error("tienda no encontrada");

  await repo.asignarTienda(id_obra, id_tienda, fecha_entrada ?? null);
}

export async function unlinkTienda(id_obra: number, fecha_salida?: string | null) {
  const obra = await repo.findObraById(id_obra);
  if (!obra) throw new Error("obra no encontrada");
  await repo.sacarDeTienda(id_obra, fecha_salida ?? null);
}

export async function linkExpo(id_obra: number, id_expo: number) {
  const obra = await repo.findObraById(id_obra);
  if (!obra) throw new Error("obra no encontrada");

  const expo = await exposRepo.findExpoById(id_expo);
  if (!expo) throw new Error("exposición no encontrada");

  await repo.asignarExpo(id_obra, id_expo);
}

export async function unlinkExpo(id_obra: number, id_expo: number) {
  const obra = await repo.findObraById(id_obra);
  if (!obra) throw new Error("obra no encontrada");
  await repo.quitarExpo(id_obra, id_expo);
}
