import { pool } from "../db/pool";

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
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Verificar que la obra existe y está disponible
    const obraCheck = await client.query(
      `SELECT estado_venta FROM obras WHERE id_obra = $1`,
      [data.id_obra]
    );

    if (obraCheck.rows.length === 0) {
      throw new Error('Obra no encontrada');
    }

    if (obraCheck.rows[0].estado_venta !== 'disponible') {
      throw new Error('Obra no disponible');
    }

    // 2. Verificar que no existe una reserva activa
    const reservaCheck = await client.query(
      `SELECT id_reserva FROM reservas
       WHERE id_obra = $1 AND expires_at > NOW()`,
      [data.id_obra]
    );

    if (reservaCheck.rows.length > 0) {
      throw new Error('Obra ya reservada por otro usuario');
    }

    // 3. Crear la reserva
    const minutes = data.minutes || 15;
    const result = await client.query(
      `INSERT INTO reservas (id_obra, id_user, session_id, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '${minutes} minutes')
       RETURNING *`,
      [data.id_obra, data.id_user, data.session_id]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Libera una reserva (cuando se elimina del carrito)
 */
export async function deleteReserva(id_obra: number, userId: string, sessionId: string): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM reservas
     WHERE id_obra = $1 AND (id_user = $2 OR session_id = $3)
     RETURNING id_reserva`,
    [id_obra, userId, sessionId]
  );

  return result.rows.length > 0;
}

/**
 * Obtiene todas las reservas activas de un usuario
 */
export async function findUserReservas(userId: string, sessionId: string): Promise<Reserva[]> {
  const result = await pool.query(
    `SELECT r.*, o.titulo, o.precio_salida
     FROM reservas r
     JOIN obras o ON r.id_obra = o.id_obra
     WHERE (r.id_user = $1 OR r.session_id = $2) AND r.expires_at > NOW()
     ORDER BY r.created_at DESC`,
    [userId, sessionId]
  );

  return result.rows;
}

/**
 * Verifica si una obra está reservada por OTRO usuario
 */
export async function isObraReservedByOther(
  id_obra: number,
  userId: string,
  sessionId: string
): Promise<boolean> {
  const result = await pool.query(
    `SELECT id_reserva FROM reservas
     WHERE id_obra = $1
       AND expires_at > NOW()
       AND id_user != $2
       AND session_id != $3`,
    [id_obra, userId, sessionId]
  );

  return result.rows.length > 0;
}

/**
 * Verifica si una obra está reservada por ESTE usuario
 */
export async function isObraReservedByUser(
  id_obra: number,
  userId: string,
  sessionId: string
): Promise<boolean> {
  const result = await pool.query(
    `SELECT id_reserva FROM reservas
     WHERE id_obra = $1
       AND expires_at > NOW()
       AND (id_user = $2 OR session_id = $3)`,
    [id_obra, userId, sessionId]
  );

  return result.rows.length > 0;
}

/**
 * Limpia reservas expiradas (llamado periódicamente)
 */
export async function cleanupExpiredReservas(): Promise<number> {
  const result = await pool.query(
    `DELETE FROM reservas WHERE expires_at < NOW() RETURNING id_reserva`
  );

  return result.rows.length;
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
  const result = await pool.query(
    `UPDATE reservas
     SET expires_at = NOW() + INTERVAL '${additionalMinutes} minutes'
     WHERE id_obra = $1 AND (id_user = $2 OR session_id = $3) AND expires_at > NOW()
     RETURNING id_reserva`,
    [id_obra, userId, sessionId]
  );

  return result.rows.length > 0;
}

/**
 * Libera todas las reservas de un usuario/sesión (al completar compra o abandonar)
 */
export async function releaseAllUserReservas(userId: string, sessionId: string): Promise<number> {
  const result = await pool.query(
    `DELETE FROM reservas
     WHERE (id_user = $1 OR session_id = $2)
     RETURNING id_reserva`,
    [userId, sessionId]
  );

  return result.rows.length;
}
