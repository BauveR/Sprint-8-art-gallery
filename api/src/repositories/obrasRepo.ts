import { pool } from "../db/pool";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { ObraInput } from "../domain/types";

export type SortKey =
  | "id_obra"
  | "autor"
  | "titulo"
  | "anio"
  | "medidas"
  | "tecnica"
  | "precio_salida"
  | "disponibilidad"
  | "expo_nombre"
  | "tienda_nombre";

export type SortDir = "asc" | "desc";

export interface ObraRow extends RowDataPacket {
  id_obra: number;
  autor: string;
  titulo: string;
  anio: number | null;
  medidas: string | null;
  tecnica: string | null;
  precio_salida: string | null; // DECIMAL como string
}

export interface ObraEstadoActualRow extends RowDataPacket {
  id_obra: number;
  autor: string;
  titulo: string;
  anio: number | null;
  medidas: string | null;
  tecnica: string | null;
  precio_salida: string | null;
  disponibilidad: "en_exposicion" | "en_tienda" | "almacen";
  id_expo: number | null;
  expo_nombre: string | null;
  expo_lat: number | null;
  expo_lng: number | null;
  expo_url: string | null;
  id_tienda: number | null;
  tienda_nombre: string | null;
  tienda_lat: number | null;
  tienda_lng: number | null;
  tienda_url: string | null;
}

const SORTABLE: Record<SortKey, string> = {
  id_obra: "id_obra",
  autor: "autor",
  titulo: "titulo",
  anio: "anio",
  medidas: "medidas",
  tecnica: "tecnica",
  precio_salida: "precio_salida",
  disponibilidad: "disponibilidad",
  expo_nombre: "expo_nombre",
  tienda_nombre: "tienda_nombre",
};

export async function listObrasEstadoActual() {
  const [rows] = await pool.query<ObraEstadoActualRow[]>(
    "SELECT * FROM obras_estado_actual"
  );
  return rows;
}

export async function countObrasEstadoActual(): Promise<number> {
  const [rows] = await pool.query<Array<{ total: number } & RowDataPacket>>(
    "SELECT COUNT(*) AS total FROM obras_estado_actual"
  );
  return Number(rows[0]?.total ?? 0);
}

export async function listObrasEstadoActualPagedSorted(
  sort: SortKey | undefined,
  dir: SortDir | undefined,
  page: number,
  pageSize: number
) {
  const col = sort ? SORTABLE[sort] : "id_obra";
  const direction = dir === "desc" ? "DESC" : "ASC";
  const limit = Math.max(1, Math.min(pageSize || 10, 200));
  const offset = Math.max(0, (page - 1) * limit);

  const sql = `SELECT * FROM obras_estado_actual ORDER BY ${col} ${direction} LIMIT ? OFFSET ?`;
  const [rows] = await pool.query<ObraEstadoActualRow[]>(sql, [limit, offset]);
  return rows;
}

export async function listObrasEstadoActualSorted(sort?: SortKey, dir?: SortDir) {
  const col = sort ? SORTABLE[sort] : "id_obra";
  const direction = dir === "desc" ? "DESC" : "ASC";
  const sql = `SELECT * FROM obras_estado_actual ORDER BY ${col} ${direction}`;
  const [rows] = await pool.query<ObraEstadoActualRow[]>(sql);
  return rows;
}

export async function findObraById(id_obra: number) {
  const [rows] = await pool.query<ObraRow[]>(
    "SELECT * FROM obras WHERE id_obra = ?",
    [id_obra]
  );
  return rows[0] ?? null;
}

export async function insertObra(input: ObraInput) {
  const [res] = await pool.query<ResultSetHeader>(
    `INSERT INTO obras (autor, titulo, anio, medidas, tecnica, precio_salida)
     VALUES (?,?,?,?,?,?)`,
    [
      input.autor,
      input.titulo,
      input.anio ?? null,
      input.medidas ?? null,
      input.tecnica ?? null,
      input.precio_salida ?? null,
    ]
  );
  return res.insertId;
}

export async function updateObra(id_obra: number, input: ObraInput) {
  await pool.query(
    `UPDATE obras
     SET autor = ?, titulo = ?, anio = ?, medidas = ?, tecnica = ?, precio_salida = ?
     WHERE id_obra = ?`,
    [
      input.autor,
      input.titulo,
      input.anio ?? null,
      input.medidas ?? null,
      input.tecnica ?? null,
      input.precio_salida ?? null,
      id_obra,
    ]
  );
}

export async function deleteObra(id_obra: number) {
  await pool.query("DELETE FROM obras WHERE id_obra = ?", [id_obra]);
}

export async function asignarTiendaTx(
  id_obra: number,
  id_tienda: number,
  fecha_entrada?: string | null
) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE obra_tienda
       SET fecha_salida = COALESCE(?, CURRENT_DATE())
       WHERE id_obra = ? AND fecha_salida IS NULL`,
      [fecha_entrada ?? null, id_obra]
    );

    await conn.query(
      `INSERT INTO obra_tienda (id_obra, id_tienda, fecha_entrada)
       VALUES (?,?,?)`,
      [id_obra, id_tienda, fecha_entrada ?? null]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function sacarDeTiendaTx(id_obra: number, fecha_salida?: string | null) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE obra_tienda
       SET fecha_salida = COALESCE(?, CURRENT_DATE())
       WHERE id_obra = ? AND fecha_salida IS NULL`,
      [fecha_salida ?? null, id_obra]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function asignarExpo(id_obra: number, id_expo: number) {
  await pool.query(
    `INSERT IGNORE INTO obra_exposicion (id_obra, id_expo) VALUES (?,?)`,
    [id_obra, id_expo]
  );
}

export async function quitarExpo(id_obra: number, id_expo: number) {
  await pool.query(
    "DELETE FROM obra_exposicion WHERE id_obra = ? AND id_expo = ?",
    [id_obra, id_expo]
  );
}
