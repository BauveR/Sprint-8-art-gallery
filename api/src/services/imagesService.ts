import * as repo from "../repositories/imagesRepo";

export async function getByObra(id_obra: number) {
  return repo.listImagenesByObra(id_obra);
}

export async function addImagen(id_obra: number, url: string) {
  const id = await repo.insertImagen(id_obra, url);
  return { id };
}

export async function deleteImagen(id: number) {
  await repo.deleteImagen(id);
}
