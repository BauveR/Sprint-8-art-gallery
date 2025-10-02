import * as repo from "../repositories/obrasRepo";
import {
  obraInputSchema,
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

export async function createObra(body: unknown) {
  console.log("[createObra] Recibido body:", body);
  const input = obraInputSchema.parse(body) as ObraInput;
  console.log("[createObra] Input validado:", input);

  const id = await repo.insertObra(input);
  console.log("[createObra] Obra creada con ID:", id);

  // Asignar tienda si se especificó
  if (input.id_tienda) {
    console.log("[createObra] Asignando tienda:", input.id_tienda);
    await repo.asignarTiendaTx(id, input.id_tienda, null);
  }

  // Asignar expo si se especificó
  if (input.id_expo) {
    console.log("[createObra] Asignando expo:", input.id_expo);
    await repo.asignarExpo(id, input.id_expo);
  }

  console.log("[createObra] Obra creada completamente con ID:", id);
  return id;
}

export async function updateObra(id_obra: number, body: unknown) {
  console.log("[updateObra] ID:", id_obra, "Body:", body);
  const input = obraInputSchema.parse(body) as ObraInput;
  console.log("[updateObra] Input validado:", input);

  const exists = await repo.findObraById(id_obra);
  if (!exists) throw new Error("Obra no encontrada");

  // Obtener estado actual de la obra (solo esta obra)
  const estadoActual = await repo.listObrasEstadoActualSorted();
  const obraActual = estadoActual.find((o) => o.id_obra === id_obra);
  console.log("[updateObra] Estado actual:", { tienda: obraActual?.id_tienda, expo: obraActual?.id_expo });

  await repo.updateObra(id_obra, input);
  console.log("[updateObra] Obra actualizada en tabla obras");

  // Manejar cambios de tienda
  if (input.id_tienda !== undefined) {
    const tiendaActual = obraActual?.id_tienda;
    console.log("[updateObra] Tienda - Actual:", tiendaActual, "Nueva:", input.id_tienda);

    if (input.id_tienda === null && tiendaActual) {
      console.log("[updateObra] Sacando de tienda");
      await repo.sacarDeTiendaTx(id_obra, null);
    } else if (input.id_tienda !== null && input.id_tienda !== tiendaActual) {
      console.log("[updateObra] Cambiando a tienda:", input.id_tienda);
      await repo.asignarTiendaTx(id_obra, input.id_tienda, null);
    }
  }

  // Manejar cambios de expo
  if (input.id_expo !== undefined) {
    const expoActual = obraActual?.id_expo;
    console.log("[updateObra] Expo - Actual:", expoActual, "Nueva:", input.id_expo);

    if (input.id_expo === null && expoActual) {
      console.log("[updateObra] Quitando de expo");
      await repo.quitarExpo(id_obra, expoActual);
    } else if (input.id_expo !== null && input.id_expo !== expoActual) {
      if (expoActual) {
        console.log("[updateObra] Quitando de expo anterior:", expoActual);
        await repo.quitarExpo(id_obra, expoActual);
      }
      console.log("[updateObra] Asignando nueva expo:", input.id_expo);
      await repo.asignarExpo(id_obra, input.id_expo);
    }
  }

  console.log("[updateObra] Actualización completada");
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
