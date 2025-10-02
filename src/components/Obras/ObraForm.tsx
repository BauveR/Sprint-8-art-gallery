import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { obraFormSchema, type ObraFormValues } from "@/lib/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ObraForm({
  defaultValues, onSubmit, submitLabel="Guardar", loading,
}: { defaultValues?: Partial<ObraFormValues>; onSubmit: (v: ObraFormValues) => void; submitLabel?: string; loading?: boolean; }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ObraFormValues>({
    resolver: zodResolver(obraFormSchema),
    defaultValues: { autor: "", titulo: "", medidas: "", tecnica: "", ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3 bg-white/80 p-4 rounded-xl shadow">
      <div><Label>Autor</Label><Input {...register("autor")} placeholder="Autor"/>{errors.autor && <p className="text-xs text-red-600">{errors.autor.message}</p>}</div>
      <div><Label>Título</Label><Input {...register("titulo")} placeholder="Título"/>{errors.titulo && <p className="text-xs text-red-600">{errors.titulo.message}</p>}</div>
      <div><Label>Año</Label><Input type="number" {...register("anio")} placeholder="YYYY"/></div>
      <div><Label>Medidas</Label><Input {...register("medidas")} placeholder="Ej. 30×20 cm"/></div>
      <div><Label>Técnica</Label><Input {...register("tecnica")} placeholder="Óleo sobre lienzo"/></div>
      <div><Label>Precio salida</Label><Input type="number" step="0.01" {...register("precio_salida")} placeholder="0.00"/></div>
      <div className="col-span-2"><Button disabled={loading}>{loading ? "Guardando..." : submitLabel}</Button></div>
    </form>
  );
}
