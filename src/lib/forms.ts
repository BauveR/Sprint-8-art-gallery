import { z } from "zod";

export const fechaSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const obraFormSchema = z.object({
  autor: z.string().min(1, "Autor requerido"),
  titulo: z.string().min(1, "Título requerido"),
  anio: z.union([z.string().length(0), z.coerce.number().int().min(0).max(3000)]).optional(),
  medidas: z.string().optional(),
  tecnica: z.string().optional(),
  precio_salida: z.union([z.string().length(0), z.coerce.number().nonnegative()]).optional(),
});
export type ObraFormValues = z.infer<typeof obraFormSchema>;
