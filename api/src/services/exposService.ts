import * as repo from "../repositories/expos.Repo";
import { ExpoInput } from "../domain/types";

export function listExpos() {
  return repo.listExpos();
}

export async function createExpo(input: ExpoInput) {
  if (!input.nombre || !input.fecha_inicio || !input.fecha_fin) {
    throw new Error("nombre, fecha_inicio y fecha_fin son obligatorios");
  }
  return repo.insertExpo(input);
}
