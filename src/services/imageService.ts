import { api as apiWithAuth } from "../api/clientWithAuth";
import { api } from "../api/client";
import { ObraImagen } from "../types";
import { CLOUDINARY_CONFIG } from "../config/cloudinary";
import { IMAGE_ERRORS } from "../constants/images";

export const imagenesService = {
  listByObra: (id_obra: number) => api.get<ObraImagen[]>(`/obras/${id_obra}/imagenes`), // Público - sin auth

  /**
   * ⚠️ MÉTODO ORIGINAL - Subida vía backend (requiere Railway/backend corriendo)
   *
   * Este método sube la imagen al backend que la procesa con Multer y la envía a Cloudinary.
   *
   * VENTAJAS:
   * - Control total en el backend
   * - Validación adicional en servidor
   * - Transformaciones personalizadas
   *
   * DESVENTAJAS:
   * - Requiere backend corriendo (Railway = $$$)
   * - Más lento (doble upload: cliente → servidor → Cloudinary)
   *
   * PARA REACTIVAR:
   * 1. Cambia CURRENT_UPLOAD_MODE a 'VIA_BACKEND' en src/config/cloudinary.ts
   * 2. Asegúrate que el backend esté corriendo
   * 3. Este método se usará automáticamente en useObraImages
   */
  uploadForObra: (id_obra: number, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return apiWithAuth.postForm<{ id: number; url: string }>(`/obras/${id_obra}/imagenes`, fd); // Admin - con auth
  },

  /**
   * ✨ NUEVO MÉTODO - Subida directa a Cloudinary (sin backend)
   *
   * Sube la imagen directamente desde el navegador a Cloudinary usando un upload preset.
   *
   * VENTAJAS:
   * - No requiere backend (gratis, sin Railway)
   * - Más rápido (upload directo)
   * - Cloudinary free tier hasta 25GB
   *
   * DESVENTAJAS:
   * - Requiere configurar upload preset "unsigned" en Cloudinary
   * - Menos control sobre validaciones
   *
   * CONFIGURACIÓN REQUERIDA:
   * 1. Crear upload preset en Cloudinary (ver src/config/cloudinary.ts)
   * 2. Agregar VITE_CLOUDINARY_UPLOAD_PRESET en .env.local
   * 3. Agregar VITE_CLOUDINARY_CLOUD_NAME en .env.local
   */
  uploadDirectToCloudinary: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', CLOUDINARY_CONFIG.folder);

    try {
      const response = await fetch(CLOUDINARY_CONFIG.getUploadUrl(), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Cloudinary] Upload error:', errorData);
        throw new Error(IMAGE_ERRORS.CLOUDINARY_UPLOAD_FAILED);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('[Cloudinary] Upload failed:', error);
      throw new Error(IMAGE_ERRORS.CLOUDINARY_UPLOAD_FAILED);
    }
  },

  /**
   * ✨ NUEVO MÉTODO - Guardar URL de imagen en la base de datos
   *
   * Después de subir directamente a Cloudinary, este método guarda la URL en MySQL.
   * Endpoint simple que solo recibe la URL (sin procesamiento de archivos).
   */
  saveImageUrl: (id_obra: number, url: string) => {
    return apiWithAuth.post<{ id: number; url: string }>(`/obras/${id_obra}/imagenes/url`, { url });
  },

  remove: (id: number) => apiWithAuth.del(`/imagenes/${id}`), // Admin - con auth
};
