import { pool } from "../db/pool";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { TiendaInput } from "../domain/types";

export async function listTiendas() {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM tiendas ORDER BY id_tienda DESC");
  return rows;
}

export async function findTiendaById(id_tienda: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM tiendas WHERE id_tienda = ?",
    [id_tienda]
  );
  return rows[0] ?? null;
}

export async function insertTienda(input: TiendaInput): Promise<number> {
  const [res] = await pool.query<ResultSetHeader>(
    "INSERT INTO tiendas (nombre, lat, lng, url_tienda) VALUES (?,?,?,?)",
    [input.nombre, input.lat, input.lng, input.url_tienda ?? null]
  );
  return res.insertId;
}
