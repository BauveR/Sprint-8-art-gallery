import { pool } from "../db/pool";
import { ObraInput, ObraState } from "../domain/types";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function listObrasEstadoActual(): Promise<ObraState[]> {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM obras_estado_actual");
  return rows as unknown as ObraState[];
}

export async function findObraById(id_obra: number) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM obras WHERE id_obra = ?",
    [id_obra]
  );
  return (rows as RowDataPacket[])[0] ?? null;
}

export async function insertObra(input: ObraInput): Promise<number> {
  const [res] = await pool.query<ResultSetHeader>(
    "INSERT INTO obras (autor, titulo, anio, medidas, tecnica, precio_salida) VALUES (?,?,?,?,?,?)",
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

export async function updateObra(id_obra: number, input: ObraInput): Promise<void> {
  await pool.query<ResultSetHeader>(
    "UPDATE obras SET autor=?, titulo=?, anio=?, medidas=?, tecnica=?, precio_salida=? WHERE id_obra=?",
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

export async function deleteObra(id_obra: number): Promise<void> {
  await pool.query<ResultSetHeader>("DELETE FROM obras WHERE id_obra = ?", [id_obra]);
}

export async function asignarTienda(
  id_obra: number,
  id_tienda: number,
  fecha_entrada?: string | null
): Promise<void> {
  await pool.query<ResultSetHeader>(
    "INSERT INTO obra_tienda (id_obra, id_tienda, fecha_entrada) VALUES (?,?,?)",
    [id_obra, id_tienda, fecha_entrada ?? null]
  );
}

export async function sacarDeTienda(
  id_obra: number,
  fecha_salida?: string | null
): Promise<void> {
  await pool.query<ResultSetHeader>(
    "UPDATE obra_tienda SET fecha_salida = ? WHERE id_obra = ? AND fecha_salida IS NULL",
    [fecha_salida ?? null, id_obra]
  );
}

export async function asignarExpo(id_obra: number, id_expo: number): Promise<void> {
  await pool.query<ResultSetHeader>(
    "INSERT INTO obra_exposicion (id_obra, id_expo) VALUES (?,?)",
    [id_obra, id_expo]
  );
}

export async function quitarExpo(id_obra: number, id_expo: number): Promise<void> {
  await pool.query<ResultSetHeader>(
    "DELETE FROM obra_exposicion WHERE id_obra=? AND id_expo=?",
    [id_obra, id_expo]
  );
}
