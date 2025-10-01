import { pool } from "../db/pool";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

/** Fila base de obra_imagenes */
export interface ObraImagenRow extends RowDataPacket {
  id: number;
  id_obra: number;
  url: string;
  created_at: string; // TIMESTAMP como string
}

/** Lista imágenes de una obra (más recientes primero) */
export async function listImagenesByObra(id_obra: number) {
  const [rows] = await pool.query<ObraImagenRow[]>(
    `SELECT id, id_obra, url, created_at
     FROM obra_imagenes
     WHERE id_obra = ?
     ORDER BY created_at DESC, id DESC`,
    [id_obra]
  );
  return rows;
}

/** Inserta una imagen para una obra y devuelve el id */
export async function insertImagen(id_obra: number, url: string): Promise<number> {
  const [res] = await pool.query<ResultSetHeader>(
    "INSERT INTO obra_imagenes (id_obra, url) VALUES (?,?)",
    [id_obra, url]
  );
  return res.insertId;
}

/** Borra una imagen por id */
export async function deleteImagen(id: number) {
  await pool.query("DELETE FROM obra_imagenes WHERE id = ?", [id]);
}

/** Devuelve la URL “principal” (última subida) o null si no hay */
export async function getPrimaryImageUrl(id_obra: number): Promise<string | null> {
  // Tipamos como RowDataPacket con un campo url para evitar el error de Pick<>
  const [rows] = await pool.query<Array<{ url: string } & RowDataPacket>>(
    `SELECT url
     FROM obra_imagenes
     WHERE id_obra = ?
     ORDER BY created_at DESC, id DESC
     LIMIT 1`,
    [id_obra]
  );
  return rows[0]?.url ?? null;
}
