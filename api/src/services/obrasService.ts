import * as repo from "../repositories/obrasRepo";
import {
  obraInputSchema,
  obraUpdateSchema,
  asignarTiendaSchema,
  sacarTiendaSchema,
  asignarExpoSchema,
} from "../domain/validation";
import type { ObraInput } from "../domain/types";

export async function getObrasSorted(sort?: repo.SortKey, dir?: repo.SortDir) {
  return repo.listObrasEstadoActualSorted(sort, dir);
}

export async function getObrasPaged(
  sort: repo.SortKey | undefined,
  dir: repo.SortDir | undefined,
  page: number,
  pageSize: number
) {
  const [data, total] = await Promise.all([
    repo.listObrasEstadoActualPagedSorted(sort, dir, page, pageSize),
    repo.countObrasEstadoActual(),
  ]);
  return { data, total, page, pageSize };
}

async function assignTiendaIfNeeded(obraId: number, tiendaId?: number | null) {
  if (tiendaId) {
    await repo.asignarTiendaTx(obraId, tiendaId, null);
  }
}

async function assignExpoIfNeeded(obraId: number, expoId?: number | null) {
  if (expoId) {
    await repo.asignarExpo(obraId, expoId);
  }
}

export async function createObra(body: unknown) {
  const input = obraInputSchema.parse(body) as ObraInput;
  const id = await repo.insertObra(input);

  await Promise.all([
    assignTiendaIfNeeded(id, input.id_tienda),
    assignExpoIfNeeded(id, input.id_expo),
  ]);

  return id;
}

async function handleTiendaUpdate(
  obraId: number,
  newTiendaId: number | null | undefined,
  currentTiendaId: number | null | undefined
) {
  if (newTiendaId === undefined) return;

  if (newTiendaId === null && currentTiendaId) {
    await repo.sacarDeTiendaTx(obraId, null);
  } else if (newTiendaId !== null && newTiendaId !== currentTiendaId) {
    await repo.asignarTiendaTx(obraId, newTiendaId, null);
  }
}

async function handleExpoUpdate(
  obraId: number,
  newExpoId: number | null | undefined,
  currentExpoId: number | null | undefined
) {
  if (newExpoId === undefined) return;

  if (newExpoId === null && currentExpoId) {
    // Eliminar TODAS las expos asignadas
    await repo.quitarTodasExpos(obraId);
  } else if (newExpoId !== null && newExpoId !== currentExpoId) {
    // Eliminar TODAS las expos previas antes de asignar la nueva
    await repo.quitarTodasExpos(obraId);
    await repo.asignarExpo(obraId, newExpoId);
  }
}

export async function updateObra(id_obra: number, body: unknown) {
  const input = obraUpdateSchema.parse(body) as Partial<ObraInput>;

  const exists = await repo.findObraById(id_obra);
  if (!exists) throw new Error("Obra no encontrada");

  const estadoActual = await repo.listObrasEstadoActualSorted();
  const obraActual = estadoActual.find((o) => o.id_obra === id_obra);

  await repo.updateObra(id_obra, input);

  await Promise.all([
    handleTiendaUpdate(id_obra, input.id_tienda, obraActual?.id_tienda),
    handleExpoUpdate(id_obra, input.id_expo, obraActual?.id_expo),
  ]);
}

export async function removeObra(id_obra: number) {
  await repo.deleteObra(id_obra);
}

export async function linkTienda(id_obra: number, id_tienda: number, fecha_entrada?: string | null) {
  asignarTiendaSchema.parse({ id_tienda, fecha_entrada });
  const exists = await repo.findObraById(id_obra);
  if (!exists) throw new Error("Obra no encontrada");
  await repo.asignarTiendaTx(id_obra, id_tienda, fecha_entrada ?? null);
}

export async function unlinkTienda(id_obra: number, fecha_salida?: string | null) {
  sacarTiendaSchema.parse({ fecha_salida });
  const exists = await repo.findObraById(id_obra);
  if (!exists) throw new Error("Obra no encontrada");
  await repo.sacarDeTiendaTx(id_obra, fecha_salida ?? null);
}

export async function linkExpo(id_obra: number, id_expo: number) {
  asignarExpoSchema.parse({ id_expo });
  const exists = await repo.findObraById(id_obra);
  if (!exists) throw new Error("Obra no encontrada");
  await repo.asignarExpo(id_obra, id_expo);
}

export async function unlinkExpo(id_obra: number, id_expo: number) {
  asignarExpoSchema.parse({ id_expo });
  const exists = await repo.findObraById(id_obra);
  if (!exists) throw new Error("Obra no encontrada");
  await repo.quitarExpo(id_obra, id_expo);
}
