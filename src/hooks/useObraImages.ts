import { useState, useRef } from "react";
import { imagenesService } from "../services/imageService";

type ObraImagen = {
  id: number;
  url: string;
};

const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export function useObraImages() {
  const [images, setImages] = useState<ObraImagen[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImages = async (obraId: number) => {
    try {
      const loadedImages = await imagenesService.listByObra(obraId);
      setImages(loadedImages);
    } catch (error) {
      console.error("Error cargando imágenes:", error);
      setImages([]);
    }
  };

  const uploadImage = async (obraId: number, file: File) => {
    // Validar tamaño
    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("La imagen no debe superar 2MB. Por favor, selecciona una imagen más pequeña.");
    }

    // Validar límite de imágenes
    if (images.length >= MAX_IMAGES) {
      throw new Error(`Solo puedes tener un máximo de ${MAX_IMAGES} imágenes por obra.`);
    }

    setUploading(true);
    try {
      await imagenesService.uploadForObra(obraId, file);
      await loadImages(obraId);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (obraId: number, imageId: number) => {
    try {
      await imagenesService.remove(imageId);
      await loadImages(obraId);
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      throw new Error("Error al eliminar la imagen");
    }
  };

  const resetImages = () => {
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
    images,
    uploading,
    fileInputRef,
    loadImages,
    uploadImage,
    deleteImage,
    resetImages,
    canUploadMore: images.length < MAX_IMAGES,
  };
}
