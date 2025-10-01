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
