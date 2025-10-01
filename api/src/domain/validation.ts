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

export const obraInputSchema = z.object({
  autor: z.string().min(1),
  titulo: z.string().min(1),
  anio: z.number().int().min(0).max(3000).nullable().optional(),
  medidas: z.string().min(1).nullable().optional(),
  tecnica: z.string().min(1).nullable().optional(),
  precio_salida: z.number().nonnegative().nullable().optional(),
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
