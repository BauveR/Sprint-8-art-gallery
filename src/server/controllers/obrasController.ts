// src/controllers/obrasController.ts
import type { Request, Response } from 'express'
import { pool } from '../config/database'

type Disponibilidad =
  | 'disponible' | 'vendido' | 'reservado'
  | 'no disponible' | 'en_exposicion' | 'en_tienda'

type TipoObra = 'pintura' | 'escultura' | 'fotografia' | 'digital' | 'mixta' | 'otros'

export interface ObraRow {
  id_obra: number
  autor: string
  titulo: string
  anio: number | null
  medidas: string | null
  tecnica: string | null
  disponibilidad: Disponibilidad
  precio_salida: number | null
  ubicacion: string | null
  tipo: TipoObra
  links: unknown
  descripcion: string | null
  created_at: string
  updated_at: string
  lat: number | null
  lng: number | null
}

export interface ObraArteCreate {
  autor: string
  titulo: string
  anio: number
  medidas?: string
  tecnica?: string
  disponibilidad?: Disponibilidad
  precio_salida: number
  ubicacion?: string
  tipo?: TipoObra
  links?: unknown
  descripcion?: string
}

export type ObraUpdatePayload = Partial<ObraArteCreate> & {
  año?: number | string
  lat?: number
  lng?: number
}

const toNumberOrNull = (v: unknown): number | null => {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export const getObras = async (_req: Request, res: Response) => {
  try {
    const sql = `
      SELECT id_obra, autor, titulo, anio AS anio, medidas, tecnica, disponibilidad,
             precio_salida, ubicacion, tipo, links, descripcion, created_at, updated_at,
             lat, lng
      FROM obras_arte
      ORDER BY created_at DESC
    `
    const result = await pool.query<ObraRow>(sql)
    res.json(result.rows)
  } catch (e) {
    console.error('GET /obras:', (e as Error).message)
    res.status(500).json({ error: 'Error obteniendo obras' })
  }
}

export const getObraById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const sql = `
      SELECT id_obra, autor, titulo, anio AS anio, medidas, tecnica, disponibilidad,
             precio_salida, ubicacion, tipo, links, descripcion, created_at, updated_at,
             lat, lng
      FROM obras_arte
      WHERE id_obra = $1
    `
    const result = await pool.query<ObraRow>(sql, [id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Obra no encontrada' })
    res.json(result.rows[0])
  } catch (e) {
    console.error('GET /obras/:id:', (e as Error).message)
    res.status(500).json({ error: 'Error obteniendo obra' })
  }
}

export const createObra = async (
  req: Request<unknown, unknown, ObraArteCreate | (ObraArteCreate & { año?: number })>,
  res: Response
) => {
  try {
    const body = req.body
    const anio = (body as any).anio ?? (body as any).año
    const sql = `
      INSERT INTO obras_arte 
        (autor, titulo, anio, medidas, tecnica, disponibilidad, precio_salida, ubicacion, tipo, links, descripcion)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING 
        id_obra, autor, titulo, anio AS anio, medidas, tecnica, disponibilidad,
        precio_salida, ubicacion, tipo, links, descripcion, created_at, updated_at,
        lat, lng
    `
    const vals = [
      body.autor,
      body.titulo,
      anio,
      body.medidas ?? null,
      body.tecnica ?? null,
      body.disponibilidad ?? 'disponible',
      body.precio_salida,
      body.ubicacion ?? null,
      body.tipo ?? 'pintura',
      JSON.stringify(body.links ?? {}),
      body.descripcion ?? null,
    ]
    const result = await pool.query<ObraRow>(sql, vals)
    res.status(201).json(result.rows[0])
  } catch (e) {
    console.error('POST /obras:', (e as Error).message)
    res.status(500).json({ error: 'Error creando obra' })
  }
}

export const getObrasConUbicacion = async (_req: Request, res: Response) => {
  try {
    const sql = `
      SELECT 
        o.id_obra, o.autor, o.titulo, o.anio AS anio, o.medidas, o.tecnica, o.disponibilidad,
        o.precio_salida, o.ubicacion, o.tipo, o.links, o.descripcion, o.created_at, o.updated_at,
        o.lat, o.lng,
        COALESCE(
          (SELECT t.nombre FROM obras_tiendas ot 
           JOIN tiendas t ON ot.id_tienda = t.id_tienda 
           WHERE ot.id_obra = o.id_obra AND ot.stock > 0 LIMIT 1),
          (SELECT e.titulo FROM obras_exposiciones oe 
           JOIN exposiciones e ON oe.id_exposicion = e.id_exposicion
           WHERE oe.id_obra = o.id_obra 
           AND CURRENT_DATE BETWEEN e.fecha_inicio AND e.fecha_fin LIMIT 1),
          o.ubicacion
        ) AS ubicacion_actual
      FROM obras_arte o
      ORDER BY o.created_at DESC
    `
    const result = await pool.query<(ObraRow & { ubicacion_actual: string | null })>(sql)
    res.json(result.rows)
  } catch (e) {
    console.error('GET /obras/ubicacion:', (e as Error).message)
    res.status(500).json({ error: 'Error obteniendo obras con ubicación' })
  }
}

export const deleteObra = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const r = await pool.query<{ id_obra: number }>(
      'DELETE FROM obras_arte WHERE id_obra = $1 RETURNING id_obra',
      [id]
    )
    if (r.rowCount === 0) return res.status(404).json({ error: 'Obra no encontrada' })
    res.json({ ok: true, id: r.rows[0].id_obra })
  } catch (e) {
    console.error('DELETE /obras/:id:', (e as Error).message)
    res.status(500).json({ error: 'Error borrando obra' })
  }
}

export const getRelaciones = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const [tiendas, expos] = await Promise.all([
      pool.query<{
        id_relacion: number; id_tienda: number; nombre: string; stock: number | null;
        precio_venta: number | null; codigo_inventario: string | null; fecha_ingreso: string | null;
      }>(`
        SELECT ot.id_relacion, t.id_tienda, t.nombre, ot.stock, ot.precio_venta, ot.codigo_inventario, ot.fecha_ingreso
        FROM obras_tiendas ot
        JOIN tiendas t ON t.id_tienda = ot.id_tienda
        WHERE ot.id_obra = $1
        ORDER BY t.nombre
      `, [id]),
      pool.query<{
        id_relacion: number; id_exposicion: number; titulo: string; lugar: string;
        fecha_inicio: string; fecha_fin: string; fecha_incorporacion: string | null; ubicacion_en_exposicion: string | null;
      }>(`
        SELECT oe.id_relacion, e.id_exposicion, e.titulo, e.lugar, e.fecha_inicio, e.fecha_fin, oe.fecha_incorporacion, oe.ubicacion_en_exposicion
        FROM obras_exposiciones oe
        JOIN exposiciones e ON e.id_exposicion = oe.id_exposicion
        WHERE oe.id_obra = $1
        ORDER BY e.fecha_inicio DESC
      `, [id]),
    ])
  res.json({ tiendas: tiendas.rows, exposiciones: expos.rows })
  } catch (e) {
    console.error('GET /obras/:id/relaciones:', (e as Error).message)
    res.status(500).json({ error: 'Error obteniendo relaciones' })
  }
}

export const vincularTienda = async (
  req: Request<{ id: string }, unknown, { id_tienda: number; stock?: number; precio_venta?: number; codigo_inventario?: string }>,
  res: Response
) => {
  try {
    const { id } = req.params
    const { id_tienda, stock = 1, precio_venta, codigo_inventario } = req.body
    const r = await pool.query(`
      INSERT INTO obras_tiendas (id_obra, id_tienda, stock, precio_venta, codigo_inventario)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id_obra, id_tienda) DO UPDATE
        SET stock = EXCLUDED.stock,
            precio_venta = COALESCE(EXCLUDED.precio_venta, obras_tiendas.precio_venta),
            codigo_inventario = COALESCE(EXCLUDED.codigo_inventario, obras_tiendas.codigo_inventario),
            updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `, [id, id_tienda, stock, precio_venta ?? null, codigo_inventario ?? null])
    res.status(201).json(r.rows[0])
  } catch (e) {
    console.error('POST /obras/:id/vincular/tienda:', (e as Error).message)
    res.status(500).json({ error: 'Error vinculando tienda' })
  }
}

export const desvincularTienda = async (
  req: Request<{ id: string }, unknown, { id_tienda: number }>,
  res: Response
) => {
  try {
    const { id } = req.params
    const { id_tienda } = req.body
    const r = await pool.query('DELETE FROM obras_tiendas WHERE id_obra = $1 AND id_tienda = $2', [id, id_tienda])
    res.json({ ok: true, deleted: r.rowCount })
  } catch (e) {
    console.error('DELETE /obras/:id/vincular/tienda:', (e as Error).message)
    res.status(500).json({ error: 'Error desvinculando tienda' })
  }
}

export const vincularExposicion = async (
  req: Request<{ id: string }, unknown, { id_exposicion: number; ubicacion_en_exposicion?: string }>,
  res: Response
) => {
  try {
    const { id } = req.params
    const { id_exposicion, ubicacion_en_exposicion } = req.body
    const r = await pool.query(`
      INSERT INTO obras_exposiciones (id_obra, id_exposicion, ubicacion_en_exposicion)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_obra, id_exposicion) DO NOTHING
      RETURNING *;
    `, [id, id_exposicion, ubicacion_en_exposicion ?? null])
    res.status(201).json(r.rows[0] ?? { ok: true, conflict: true })
  } catch (e) {
    console.error('POST /obras/:id/vincular/exposicion:', (e as Error).message)
    res.status(500).json({ error: 'Error vinculando exposición' })
  }
}

export const desvincularExposicion = async (
  req: Request<{ id: string }, unknown, { id_exposicion: number }>,
  res: Response
) => {
  try {
    const { id } = req.params
    const { id_exposicion } = req.body
    const r = await pool.query(
      'DELETE FROM obras_exposiciones WHERE id_obra = $1 AND id_exposicion = $2',
      [id, id_exposicion]
    )
    res.json({ ok: true, deleted: r.rowCount })
  } catch (e) {
    console.error('DELETE /obras/:id/vincular/exposicion:', (e as Error).message)
    res.status(500).json({ error: 'Error desvinculando exposición' })
  }
}

export const updateObra = async (
  req: Request<{ id: string }, unknown, ObraUpdatePayload>,
  res: Response
) => {
  try {
    const { id } = req.params
    const body = req.body
    const anio = toNumberOrNull(body.anio ?? body.año)

    const values: any[] = [
      body.autor ?? null,
      body.titulo ?? null,
      anio,
      body.medidas ?? null,
      body.tecnica ?? null,
      body.disponibilidad ?? null,
      body.precio_salida ?? null,
      body.ubicacion ?? null,
      body.tipo ?? null,
      body.links ? JSON.stringify(body.links) : null,
      body.descripcion ?? null,
      body.lat ?? null,
      body.lng ?? null,
      id,
    ]

    const sql = `
      UPDATE obras_arte
      SET autor = COALESCE($1, autor),
          titulo = COALESCE($2, titulo),
          anio = COALESCE($3, anio),
          medidas = COALESCE($4, medidas),
          tecnica = COALESCE($5, tecnica),
          disponibilidad = COALESCE($6, disponibilidad),
          precio_salida = COALESCE($7, precio_salida),
          ubicacion = COALESCE($8, ubicacion),
          tipo = COALESCE($9, tipo),
          links = COALESCE($10, links),
          descripcion = COALESCE($11, descripcion),
          lat = COALESCE($12, lat),
          lng = COALESCE($13, lng),
          updated_at = CURRENT_TIMESTAMP
      WHERE id_obra = $14
      RETURNING id_obra, autor, titulo, anio AS anio, medidas, tecnica, disponibilidad,
                precio_salida, ubicacion, tipo, links, descripcion, created_at, updated_at,
                lat, lng
    `
    const result = await pool.query<ObraRow>(sql, values)
    if (result.rowCount === 0) return res.status(404).json({ error: 'Obra no encontrada' })
    res.json(result.rows[0])
  } catch (e: any) {
    console.error('UPDATE /obras/:id error:', e?.message || e)
    res.status(500).json({ error: e?.detail || e?.message || 'Error actualizando obra' })
  }
}
