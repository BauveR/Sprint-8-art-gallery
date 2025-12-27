import { useState, useRef } from "react";
import { imagenesService } from "../services/imageService";
import { CURRENT_UPLOAD_MODE } from "../config/cloudinary";
import { IMAGE_LIMITS, IMAGE_ERRORS } from "../constants/images";

type ObraImagen = {
  id: number;
  url: string;
};

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

  /**
   * ✨ NUEVO - Upload con soporte para dos modos
   *
   * Dependiendo de CURRENT_UPLOAD_MODE en src/config/cloudinary.ts:
   *
   * 1. DIRECT_TO_CLOUDINARY (actual):
   *    - Sube directamente desde navegador a Cloudinary
   *    - Luego guarda la URL en la base de datos
   *    - No requiere Railway/backend para el upload
   *
   * 2. VIA_BACKEND (original, comentado abajo):
   *    - Sube al backend que procesa con Multer
   *    - Backend sube a Cloudinary
   *    - Requiere Railway/backend corriendo
   */
  const uploadImage = async (obraId: number, file: File) => {
    // Validar tamaño
    if (file.size > IMAGE_LIMITS.MAX_SIZE_BYTES) {
      throw new Error(IMAGE_ERRORS.MAX_SIZE);
    }

    // Validar límite de imágenes
    if (images.length >= IMAGE_LIMITS.MAX_COUNT) {
      throw new Error(IMAGE_ERRORS.MAX_COUNT);
    }

    setUploading(true);
    try {
      if (CURRENT_UPLOAD_MODE === 'DIRECT_TO_CLOUDINARY') {
        // ✨ MODO NUEVO - Upload directo a Cloudinary
        console.log('[Upload] Modo: DIRECT_TO_CLOUDINARY');

        // 1. Subir archivo directamente a Cloudinary
        const cloudinaryUrl = await imagenesService.uploadDirectToCloudinary(file);
        console.log('[Upload] Imagen subida a Cloudinary:', cloudinaryUrl);

        // 2. Guardar la URL en la base de datos
        await imagenesService.saveImageUrl(obraId, cloudinaryUrl);
        console.log('[Upload] URL guardada en base de datos');

        // 3. Recargar lista de imágenes
        await loadImages(obraId);
      } else {
        // ⚠️ MODO ORIGINAL - Upload vía backend (requiere Railway)
        console.log('[Upload] Modo: VIA_BACKEND');
        await imagenesService.uploadForObra(obraId, file);
        await loadImages(obraId);
      }

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
    canUploadMore: images.length < IMAGE_LIMITS.MAX_COUNT,
  };
}
