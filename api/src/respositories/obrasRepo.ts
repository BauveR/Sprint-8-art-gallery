import { pool } from "../db/pool";

export type SortKey =
  | "id_obra"
  | "autor"
  | "titulo"
  | "disponibilidad"
  | "id_tienda"
  | "id_expo";

export type SortDir = "asc" | "desc";

const SORTABLE: Record<SortKey, string> = {
  id_obra: "id_obra",
  autor: "autor",
  titulo: "titulo",
  disponibilidad: "disponibilidad",
  id_tienda: "id_tienda",
  id_expo: "id_expo",
};

export async function listObrasEstadoActualSorted(sort?: SortKey, dir?: SortDir) {
  const col = sort && SORTABLE[sort] ? SORTABLE[sort] : "id_obra";
  const direction = dir === "desc" ? "DESC" : "ASC";
  // ⚠️ El ORDER BY no puede parametrizarse: VALIDAMOS la columna y la dir antes
  const sql = `SELECT * FROM obras_estado_actual ORDER BY ${col} ${direction}`;
  const [rows] = await pool.query(sql);
  return rows as any[];
}
