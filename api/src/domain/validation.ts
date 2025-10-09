import { z } from "zod";

export const idParamSchema = z.number().int().positive();

export const fechaSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD");

export const urlSchema = z.string().url().optional().nullable();

export const tiendaInputSchema = z.object({
  nombre: z.string().min(1),
  lat: z.number().finite(),
  lng: z.number().finite(),
  url_tienda: z.string().url().optional().nullable(),
});

export const expoInputSchema = z.object({
  nombre: z.string().min(1),
  lat: z.number().finite(),
  lng: z.number().finite(),
  fecha_inicio: fechaSchema,
  fecha_fin: fechaSchema,
  url_expo: z.string().url().optional().nullable(),
});

export const estadoVentaSchema = z.enum([
  "disponible",
  "en_carrito",
  "procesando_envio",
  "enviado",
  "entregado",
  "pendiente_devolucion",
  "nunca_entregado",
]);

export const obraInputSchema = z.object({
  autor: z.string().min(1),
  titulo: z.string().min(1),
  anio: z.number().int().min(0).max(3000).nullable().optional(),
  medidas: z.string().nullable().optional(),
  tecnica: z.string().nullable().optional(),
  precio_salida: z.number().nonnegative().nullable().optional(),
  estado_venta: estadoVentaSchema.optional(),
  numero_seguimiento: z.string().nullable().optional(),
  link_seguimiento: z.string().nullable().optional(),
  comprador_nombre: z.string().nullable().optional(),
  comprador_email: z.string().email().nullable().optional(),
  fecha_compra: z.string().nullable().optional(),
  id_tienda: z.number().int().positive().nullable().optional(),
  id_expo: z.number().int().positive().nullable().optional(),
});

// Schema para actualizaciones parciales (todos los campos opcionales)
export const obraUpdateSchema = z.object({
  autor: z.string().min(1).optional(),
  titulo: z.string().min(1).optional(),
  anio: z.number().int().min(0).max(3000).nullable().optional(),
  medidas: z.string().nullable().optional(),
  tecnica: z.string().nullable().optional(),
  precio_salida: z.number().nonnegative().nullable().optional(),
  estado_venta: estadoVentaSchema.optional(),
  numero_seguimiento: z.string().nullable().optional(),
  link_seguimiento: z.string().nullable().optional(),
  comprador_nombre: z.string().nullable().optional(),
  comprador_email: z.string().email().nullable().optional(),
  fecha_compra: z.string().nullable().optional(),
  id_tienda: z.number().int().positive().nullable().optional(),
  id_expo: z.number().int().positive().nullable().optional(),
});

export const asignarTiendaSchema = z.object({
  id_tienda: z.number().int().positive(),
  fecha_entrada: fechaSchema.nullable().optional(),
});

export const sacarTiendaSchema = z.object({
  fecha_salida: fechaSchema.nullable().optional(),
});

export const asignarExpoSchema = z.object({
  id_expo: z.number().int().positive(),
});
