import { pool } from "../db/pool";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export interface ObraImagenRow extends RowDataPacket {
  id: number;
  id_obra: number;
  url: string;
  created_at: string;
}

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

export async function insertImagen(id_obra: number, url: string): Promise<number> {
  const [res] = await pool.query<ResultSetHeader>(
    "INSERT INTO obra_imagenes (id_obra, url) VALUES (?,?)",
    [id_obra, url]
  );
  return res.insertId;
}

export async function deleteImagen(id: number) {
  await pool.query("DELETE FROM obra_imagenes WHERE id = ?", [id]);
}

export async function getPrimaryImageUrl(id_obra: number): Promise<string | null> {
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

export async function getImageById(id: number): Promise<ObraImagenRow | null> {
  const [rows] = await pool.query<ObraImagenRow[]>(
    `SELECT id, id_obra, url, created_at
     FROM obra_imagenes WHERE id = ?`,
    [id]
  );
  return rows[0] ?? null;
}
