import * as repo from "../repositories/imagesRepo";

export async function getByObra(id_obra: number) {
  return repo.listImagenesByObra(id_obra);
}

export async function addImagen(id_obra: number, url: string) {
  const id = await repo.insertImagen(id_obra, url);
  return { id, url };
}

export async function deleteImagen(id: number) {
  const row = await repo.getImageById(id);
  if (row?.url) {
    return { id, url: row.url };
  }
  return { id, url: null };
}
