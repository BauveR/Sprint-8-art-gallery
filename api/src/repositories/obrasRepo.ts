import { pool } from "../db/pool";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import type { ObraInput } from "../domain/types";

/** Claves válidas para ordenar sobre la vista `obras_estado_actual` */
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

/** Fila de la tabla `obras` */
export interface ObraRow extends RowDataPacket {
  id_obra: number;
  autor: string;
  titulo: string;
  anio: number | null;
  medidas: string | null;
  tecnica: string | null;
  // DECIMAL llega como string por defecto en mysql2; lo tipamos string|null
  precio_salida: string | null;
}

/** Fila de la vista `obras_estado_actual` */
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

/** Mapa de columnas seguras para ORDER BY */
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

/** Listado simple (sin ordenar) de la vista */
export async function listObrasEstadoActual() {
  const [rows] = await pool.query<ObraEstadoActualRow[]>(
    "SELECT * FROM obras_estado_actual"
  );
  return rows;
}

/** Listado con ordenamiento whitelisteado */
export async function listObrasEstadoActualSorted(sort?: SortKey, dir?: SortDir) {
  const col = sort ? SORTABLE[sort] : "id_obra";
  const direction = dir === "desc" ? "DESC" : "ASC";
  const sql = `SELECT * FROM obras_estado_actual ORDER BY ${col} ${direction}`;
  const [rows] = await pool.query<ObraEstadoActualRow[]>(sql);
  return rows;
}

/** Busca obra por id */
export async function findObraById(id_obra: number) {
  const [rows] = await pool.query<ObraRow[]>(
    "SELECT * FROM obras WHERE id_obra = ?",
    [id_obra]
  );
  return rows[0] ?? null;
}

/** Inserta obra y devuelve id */
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

/** Actualiza obra */
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

/** Elimina obra */
export async function deleteObra(id_obra: number) {
  await pool.query("DELETE FROM obras WHERE id_obra = ?", [id_obra]);
}

/** Asigna obra a tienda (abre estancia) — garantiza 1 sola estancia abierta */
export async function asignarTienda(
  id_obra: number,
  id_tienda: number,
  fecha_entrada?: string | null
) {
  // Cierra cualquier estancia abierta previa para esa obra
  await pool.query(
    "UPDATE obra_tienda SET fecha_salida = COALESCE(?, CURRENT_DATE()) WHERE id_obra = ? AND fecha_salida IS NULL",
    [fecha_entrada ?? null, id_obra]
  );

  // Abre la nueva estancia
  await pool.query(
    "INSERT INTO obra_tienda (id_obra, id_tienda, fecha_entrada) VALUES (?,?,?)",
    [id_obra, id_tienda, fecha_entrada ?? null]
  );
}

/** Cierra la estancia en tienda (fecha_salida) */
export async function sacarDeTienda(id_obra: number, fecha_salida?: string | null) {
  await pool.query(
    "UPDATE obra_tienda SET fecha_salida = ? WHERE id_obra = ? AND fecha_salida IS NULL",
    [fecha_salida ?? null, id_obra]
  );
}

/** Relaciona obra con expo */
export async function asignarExpo(id_obra: number, id_expo: number) {
  await pool.query(
    "INSERT INTO obra_exposicion (id_obra, id_expo) VALUES (?,?)",
    [id_obra, id_expo]
  );
}

/** Quita relación obra—expo */
export async function quitarExpo(id_obra: number, id_expo: number) {
  await pool.query(
    "DELETE FROM obra_exposicion WHERE id_obra = ? AND id_expo = ?",
    [id_obra, id_expo]
  );
}
