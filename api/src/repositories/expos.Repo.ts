import { pool } from "../db/pool";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { ExpoInput } from "../domain/types";

export async function listExpos() {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM exposiciones ORDER BY fecha_inicio DESC"
  );
  return rows;
}

export async function findExpoById(id_expo: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM exposiciones WHERE id_expo = ?",
    [id_expo]
  );
  return rows[0] ?? null;
}

export async function insertExpo(input: ExpoInput): Promise<number> {
  const [res] = await pool.query<ResultSetHeader>(
    `INSERT INTO exposiciones (nombre, lat, lng, fecha_inicio, fecha_fin, url_expo)
     VALUES (?,?,?,?,?,?)`,
    [
      input.nombre,
      input.lat,
      input.lng,
      input.fecha_inicio,
      input.fecha_fin,
      input.url_expo ?? null,
    ]
  );
  return res.insertId;
}
