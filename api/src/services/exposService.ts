import * as repo from "../repositories/expos.Repo";
import { expoInputSchema } from "../domain/validation";
import type { ExpoInput } from "../domain/types";

export async function listExpos() {
  return repo.listExpos();
}

export async function createExpo(body: unknown) {
  const input = expoInputSchema.parse(body) as ExpoInput;
  return repo.insertExpo(input);
}

export async function updateExpo(id_expo: number, body: unknown) {
  const input = expoInputSchema.parse(body) as ExpoInput;
  const exists = await repo.findExpoById(id_expo);
  if (!exists) throw new Error("Exposición no encontrada");
  await repo.updateExpo(id_expo, input);
}

export async function removeExpo(id_expo: number) {
  await repo.deleteExpo(id_expo);
}
