import { useState } from "react";
import { Obra, ObraInput } from "../types";
import { useUpdateObra } from "../query/obras";

type EditState = { id: number; form: Omit<ObraInput, 'estado_venta' | 'numero_seguimiento' | 'link_seguimiento'> } | null;

type EditSuccessCallback = () => void;
type EditErrorCallback = (error: Error) => void;

export function useObraEdit() {
  const [edit, setEdit] = useState<EditState>(null);
  const updateObra = useUpdateObra();

  const startEdit = (o: Obra) => {
    setEdit({
      id: o.id_obra,
      form: {
        autor: o.autor ?? "",
        titulo: o.titulo ?? "",
        anio: o.anio ?? null,
        medidas: o.medidas ?? null,
        tecnica: o.tecnica ?? null,
        precio_salida:
          o.precio_salida != null
            ? (typeof o.precio_salida === "string" ? Number(o.precio_salida) : o.precio_salida)
            : null,
        id_tienda: o.id_tienda ?? null,
        id_expo: o.id_expo ?? null,
      },
    });
  };

  const cancelEdit = () => {
    setEdit(null);
  };

  const saveEdit = async (
    ev: React.FormEvent,
    onSuccess: EditSuccessCallback,
    onError: EditErrorCallback
  ) => {
    ev.preventDefault();
    if (!edit) return;

    const { id, form } = edit;
    console.log("Guardando obra:", { id, input: form });

    updateObra.mutate(
      { id, input: form },
      {
        onSuccess: async () => {
          console.log("Obra actualizada exitosamente");
          // Esperar un momento para que las queries se actualicen
          await new Promise((resolve) => setTimeout(resolve, 500));
          setEdit(null);
          onSuccess();
        },
        onError: (error) => {
          console.error("Error al actualizar obra:", error);
          onError(error instanceof Error ? error : new Error("Error al actualizar obra"));
        },
      }
    );
  };

  return {
    edit,
    setEdit,
    isUpdating: updateObra.isPending,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}
