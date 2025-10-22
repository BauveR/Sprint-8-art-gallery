import { pool } from "../db/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface DireccionEnvio {
  id_direccion: number;
  id_user: string;
  nombre_completo: string;
  telefono: string;
  email?: string;
  direccion: string;
  numero_exterior: string;
  numero_interior?: string;
  colonia: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
  pais: string;
  referencias?: string;
  es_predeterminada: boolean;
  alias?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDireccionInput {
  id_user: string;
  nombre_completo: string;
  telefono: string;
  email?: string;
  direccion: string;
  numero_exterior: string;
  numero_interior?: string;
  colonia: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
  pais?: string;
  referencias?: string;
  es_predeterminada?: boolean;
  alias?: string;
}

/**
 * Obtiene todas las direcciones de un usuario
 */
export async function findByUserId(userId: string): Promise<DireccionEnvio[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM direcciones_envio
     WHERE id_user = ?
     ORDER BY es_predeterminada DESC, created_at DESC`,
    [userId]
  );

  return rows as DireccionEnvio[];
}

/**
 * Obtiene una dirección por ID (verificando que pertenezca al usuario)
 */
export async function findById(id: number, userId: string): Promise<DireccionEnvio | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM direcciones_envio
     WHERE id_direccion = ? AND id_user = ?`,
    [id, userId]
  );

  return (rows[0] as DireccionEnvio) || null;
}

/**
 * Obtiene la dirección predeterminada de un usuario
 */
export async function findDefaultByUserId(userId: string): Promise<DireccionEnvio | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM direcciones_envio
     WHERE id_user = ? AND es_predeterminada = true
     LIMIT 1`,
    [userId]
  );

  return (rows[0] as DireccionEnvio) || null;
}

/**
 * Crea una nueva dirección
 */
export async function create(data: CreateDireccionInput): Promise<DireccionEnvio> {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO direcciones_envio (
      id_user, nombre_completo, telefono, email,
      direccion, numero_exterior, numero_interior, colonia,
      codigo_postal, ciudad, estado, pais, referencias,
      es_predeterminada, alias
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.id_user,
      data.nombre_completo,
      data.telefono,
      data.email || null,
      data.direccion,
      data.numero_exterior,
      data.numero_interior || null,
      data.colonia,
      data.codigo_postal,
      data.ciudad,
      data.estado,
      data.pais || "México",
      data.referencias || null,
      data.es_predeterminada || false,
      data.alias || null,
    ]
  );

  // Obtener la dirección recién creada
  return await findById(result.insertId, data.id_user) as DireccionEnvio;
}

/**
 * Actualiza una dirección existente
 */
export async function update(
  id: number,
  userId: string,
  data: Partial<CreateDireccionInput>
): Promise<DireccionEnvio | null> {
  const fields: string[] = [];
  const values: any[] = [];

  // Construir query dinámicamente solo con campos proporcionados
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== "id_user") {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  });

  if (fields.length === 0) {
    return findById(id, userId);
  }

  values.push(id, userId);

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE direcciones_envio
     SET ${fields.join(", ")}
     WHERE id_direccion = ? AND id_user = ?`,
    values
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return await findById(id, userId);
}

/**
 * Quita el flag de predeterminada de todas las direcciones de un usuario
 */
export async function clearDefaultFlag(userId: string): Promise<void> {
  await pool.query<ResultSetHeader>(
    `UPDATE direcciones_envio
     SET es_predeterminada = false
     WHERE id_user = ?`,
    [userId]
  );
}

/**
 * Establece una dirección como predeterminada
 */
export async function setAsDefault(id: number, userId: string): Promise<boolean> {
  // Primero, quitar el flag de todas las direcciones del usuario
  await clearDefaultFlag(userId);

  // Luego, establecer esta dirección como predeterminada
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE direcciones_envio
     SET es_predeterminada = true
     WHERE id_direccion = ? AND id_user = ?`,
    [id, userId]
  );

  return result.affectedRows > 0;
}

/**
 * Elimina una dirección
 */
export async function remove(id: number, userId: string): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `DELETE FROM direcciones_envio
     WHERE id_direccion = ? AND id_user = ?`,
    [id, userId]
  );

  return result.affectedRows > 0;
}

/**
 * Cuenta las direcciones de un usuario
 */
export async function countByUserId(userId: string): Promise<number> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as count FROM direcciones_envio WHERE id_user = ?`,
    [userId]
  );

  return rows[0].count as number;
}
