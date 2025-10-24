import { pool } from "../db/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface Reserva {
  id_reserva: number;
  id_obra: number;
  id_user: string;
  session_id: string;
  expires_at: Date;
  created_at: Date;
}

export interface CreateReservaInput {
  id_obra: number;
  id_user: string;
  session_id: string;
  minutes?: number; // Duración de la reserva en minutos (default: 15)
}

/**
 * Crea una reserva temporal para una obra
 * Falla si la obra ya está reservada o vendida
 */
export async function createReserva(data: CreateReservaInput): Promise<Reserva> {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Verificar que no existe una reserva activa
    const [reservaCheck] = await connection.query<RowDataPacket[]>(
      `SELECT id_reserva FROM reservas
       WHERE id_obra = ? AND expires_at > NOW()`,
      [data.id_obra]
    );

    if (reservaCheck.length > 0) {
      throw new Error('Obra ya reservada por otro usuario');
    }

    // 2. Crear la reserva
    const minutes = data.minutes || 15;
    const [result] = await connection.query<ResultSetHeader>(
      `INSERT INTO reservas (id_obra, id_user, session_id, expires_at)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? MINUTE))`,
      [data.id_obra, data.id_user, data.session_id, minutes]
    );

    // 3. Obtener la reserva creada
    const [newReserva] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM reservas WHERE id_reserva = ?`,
      [result.insertId]
    );

    await connection.commit();
    return newReserva[0] as Reserva;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Libera una reserva (cuando se elimina del carrito)
 */
export async function deleteReserva(id_obra: number, userId: string, sessionId: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM reservas
     WHERE id_obra = ? AND (id_user = ? OR session_id = ?)`,
    [id_obra, userId, sessionId]
  );

  return result.affectedRows > 0;
}

/**
 * Obtiene todas las reservas activas de un usuario
 */
export async function findUserReservas(userId: string, sessionId: string): Promise<Reserva[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT r.*, o.titulo, o.precio_salida
     FROM reservas r
     JOIN obras o ON r.id_obra = o.id_obra
     WHERE (r.id_user = ? OR r.session_id = ?) AND r.expires_at > NOW()
     ORDER BY r.created_at DESC`,
    [userId, sessionId]
  );

  return rows as Reserva[];
}

/**
 * Verifica si una obra está reservada por OTRO usuario
 */
export async function isObraReservedByOther(
  id_obra: number,
  userId: string,
  sessionId: string
): Promise<boolean> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id_reserva FROM reservas
     WHERE id_obra = ?
       AND expires_at > NOW()
       AND id_user != ?
       AND session_id != ?`,
    [id_obra, userId, sessionId]
  );

  return rows.length > 0;
}

/**
 * Verifica si una obra está reservada por ESTE usuario
 */
export async function isObraReservedByUser(
  id_obra: number,
  userId: string,
  sessionId: string
): Promise<boolean> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id_reserva FROM reservas
     WHERE id_obra = ?
       AND expires_at > NOW()
       AND (id_user = ? OR session_id = ?)`,
    [id_obra, userId, sessionId]
  );

  return rows.length > 0;
}

/**
 * Limpia reservas expiradas (llamado periódicamente)
 */
export async function cleanupExpiredReservas(): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM reservas WHERE expires_at < NOW()`
  );

  return result.affectedRows;
}

/**
 * Extiende el tiempo de una reserva (útil en checkout)
 */
export async function extendReserva(
  id_obra: number,
  userId: string,
  sessionId: string,
  additionalMinutes: number = 10
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE reservas
     SET expires_at = DATE_ADD(NOW(), INTERVAL ? MINUTE)
     WHERE id_obra = ? AND (id_user = ? OR session_id = ?) AND expires_at > NOW()`,
    [additionalMinutes, id_obra, userId, sessionId]
  );

  return result.affectedRows > 0;
}

/**
 * Libera todas las reservas de un usuario/sesión (al completar compra o abandonar)
 */
export async function releaseAllUserReservas(userId: string, sessionId: string): Promise<number> {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM reservas
     WHERE (id_user = ? OR session_id = ?)`,
    [userId, sessionId]
  );

  return result.affectedRows;
}
