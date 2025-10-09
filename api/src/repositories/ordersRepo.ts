import { pool } from "../db/pool";
import type { ObraEstadoActualRow } from "./obrasRepo";

/**
 * Buscar todas las compras de un usuario por email
 * Retorna obras donde comprador_email coincide
 */
export async function findOrdersByEmail(email: string) {
  const [rows] = await pool.query<ObraEstadoActualRow[]>(
    `SELECT * FROM obras_estado_actual
     WHERE comprador_email = ?
     ORDER BY fecha_compra DESC`,
    [email]
  );
  return rows;
}
