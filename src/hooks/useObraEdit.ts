import { useState } from "react";
import { Obra, ObraInput } from "../types";
import { useUpdateObra } from "../query/obras";
import {
  sendShipmentNotification,
  sendDeliveryConfirmation,
  sendThankYouEmail,
} from "../lib/emailjs";

type EditState = { id: number; form: ObraInput } | null;

type EditSuccessCallback = () => void;
type EditErrorCallback = (error: Error) => void;
type EmailSuccessCallback = (message: string) => void;
type EmailErrorCallback = (message: string) => void;

export function useObraEdit(obras: Obra[]) {
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
        estado_venta: o.estado_venta ?? "disponible",
        numero_seguimiento: o.numero_seguimiento ?? null,
        link_seguimiento: o.link_seguimiento ?? null,
        id_tienda: o.id_tienda ?? null,
        id_expo: o.id_expo ?? null,
      },
    });
  };

  const cancelEdit = () => {
    setEdit(null);
  };

  const handleEmailNotifications = async (
    obraOriginal: Obra | undefined,
    nuevoEstado: string,
    estadoAnterior: string | undefined,
    numeroSeguimiento: string | null | undefined,
    linkSeguimiento: string | null | undefined,
    onEmailSuccess: EmailSuccessCallback,
    onEmailError: EmailErrorCallback
  ) => {
    if (!obraOriginal?.comprador_email) return;

    try {
      // Email de envío (cuando cambia a "enviado")
      if (nuevoEstado === "enviado" && estadoAnterior !== "enviado") {
        if (numeroSeguimiento && linkSeguimiento) {
          await sendShipmentNotification({
            to_email: obraOriginal.comprador_email,
            to_name: obraOriginal.comprador_nombre || "Cliente",
            order_id: `ORD-${obraOriginal.id_obra}`,
            tracking_number: numeroSeguimiento,
            tracking_link: linkSeguimiento,
            items: [{ titulo: obraOriginal.titulo }],
          });
          onEmailSuccess("Se ha notificado al cliente sobre el envío");
        } else {
          onEmailError("Agrega número y link de seguimiento para notificar al cliente");
        }
      }

      // Email de entrega (cuando cambia a "entregado")
      if (nuevoEstado === "entregado" && estadoAnterior !== "entregado") {
        await sendDeliveryConfirmation({
          to_email: obraOriginal.comprador_email,
          to_name: obraOriginal.comprador_nombre || "Cliente",
          order_id: `ORD-${obraOriginal.id_obra}`,
          items: [{ titulo: obraOriginal.titulo }],
        });

        // También enviar email de agradecimiento
        await sendThankYouEmail({
          to_email: obraOriginal.comprador_email,
          to_name: obraOriginal.comprador_nombre || "Cliente",
          items: [{ titulo: obraOriginal.titulo }],
        });

        onEmailSuccess("Se ha notificado al cliente sobre la entrega");
      }
    } catch (emailError) {
      console.error("Error enviando email:", emailError);
      onEmailError("La obra se actualizó pero no se pudo enviar el email");
    }
  };

  const saveEdit = async (
    ev: React.FormEvent,
    onSuccess: EditSuccessCallback,
    onError: EditErrorCallback,
    onEmailSuccess: EmailSuccessCallback,
    onEmailError: EmailErrorCallback
  ) => {
    ev.preventDefault();
    if (!edit) return;

    const { id, form } = edit;
    console.log("Guardando obra:", { id, input: form });

    // Buscar la obra original para comparar el estado
    const obraOriginal = obras.find((o) => o.id_obra === id);
    const estadoAnterior = obraOriginal?.estado_venta;
    const nuevoEstado = form.estado_venta;

    updateObra.mutate(
      { id, input: form },
      {
        onSuccess: async () => {
          console.log("Obra actualizada exitosamente, esperando refresh...");

          // Enviar emails según el cambio de estado
          await handleEmailNotifications(
            obraOriginal,
            nuevoEstado,
            estadoAnterior,
            form.numero_seguimiento,
            form.link_seguimiento,
            onEmailSuccess,
            onEmailError
          );

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
