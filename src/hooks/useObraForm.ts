import { useState, useMemo, useRef } from "react";
import { ObraInput } from "../types";
import { useCreateObra } from "../query/obras";
import { imagenesService } from "../services/imageService";

const emptyObra: ObraInput = {
  autor: "",
  titulo: "",
  anio: null,
  medidas: null,
  tecnica: null,
  precio_salida: null,
  estado_venta: "disponible",
  numero_seguimiento: null,
  link_seguimiento: null,
  id_tienda: null,
  id_expo: null,
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

type CreateSuccessCallback = () => void;
type CreateErrorCallback = (error: Error) => void;

export function useObraForm() {
  const [form, setForm] = useState<ObraInput>(emptyObra);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createObra = useCreateObra();

  const canSubmit = useMemo(
    () => form.autor.trim() !== "" && form.titulo.trim() !== "",
    [form.autor, form.titulo]
  );

  const handleImageSelect = (file: File | null) => {
    if (!file) {
      setSelectedImage(null);
      return;
    }

    // Validar tamaño (2MB máximo)
    if (file.size > MAX_IMAGE_SIZE) {
      alert("La imagen no debe superar 2MB. Por favor, selecciona una imagen más pequeña.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedImage(file);
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const reset = () => {
    setForm(emptyObra);
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (
    ev: React.FormEvent,
    onSuccess: CreateSuccessCallback,
    onError: CreateErrorCallback
  ) => {
    ev.preventDefault();
    if (!canSubmit) return;

    console.log("Creando obra con:", form);

    createObra.mutate(form, {
      onSuccess: async (data) => {
        console.log("Obra creada exitosamente:", data);

        // Si hay imagen seleccionada, subirla
        if (selectedImage && data.id_obra) {
          try {
            await imagenesService.uploadForObra(data.id_obra, selectedImage);
            console.log("Imagen subida exitosamente");
          } catch (error) {
            console.error("Error al subir imagen:", error);
            reset();
            onError(new Error("La obra se creó correctamente pero hubo un error al subir la imagen"));
            return;
          }
        }

        reset();
        onSuccess();
      },
      onError: (error) => {
        console.error("Error al crear obra:", error);
        onError(error instanceof Error ? error : new Error("Ocurrió un error inesperado"));
      },
    });
  };

  return {
    form,
    setForm,
    selectedImage,
    fileInputRef,
    canSubmit,
    isSubmitting: createObra.isPending,
    handleImageSelect,
    clearImage,
    reset,
    onSubmit,
  };
}
