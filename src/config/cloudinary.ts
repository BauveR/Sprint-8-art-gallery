/**
 * Configuración de Cloudinary para upload directo desde frontend
 *
 * IMPORTANTE: Antes de usar, debes crear un "Upload Preset" en Cloudinary:
 * 1. Ve a https://console.cloudinary.com/settings/upload
 * 2. Scroll hasta "Upload presets"
 * 3. Clic en "Add upload preset"
 * 4. Configuración:
 *    - Signing Mode: Unsigned (IMPORTANTE)
 *    - Upload preset name: art-gallery-unsigned (copia este nombre)
 *    - Folder: art-gallery/obras
 *    - Transformation: c_limit,w_1200,h_1200 / q_auto:good
 * 5. Guarda y copia el "Upload preset name"
 * 6. Pégalo en VITE_CLOUDINARY_UPLOAD_PRESET en .env.local
 */

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dmweipuof',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'art-gallery-unsigned',
  folder: 'art-gallery/obras',

  // URL de la API de Cloudinary para uploads
  getUploadUrl: () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dmweipuof';
    return `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  },
} as const;

/**
 * Modos de upload disponibles
 *
 * DIRECT_TO_CLOUDINARY: Sube directamente desde el frontend a Cloudinary
 *   - Ventajas: No requiere backend de Railway, más rápido, gratis
 *   - Desventajas: Requiere configurar upload preset en Cloudinary
 *
 * VIA_BACKEND: Sube a través del backend (método original con Multer)
 *   - Ventajas: Más control, validación en backend
 *   - Desventajas: Requiere Railway/backend corriendo
 */
export type UploadMode = 'DIRECT_TO_CLOUDINARY' | 'VIA_BACKEND';

/**
 * Cambia este valor para alternar entre modos
 *
 * DESARROLLO LOCAL: Usa 'VIA_BACKEND' si tienes el backend corriendo localmente
 * PRODUCCIÓN SIN RAILWAY: Usa 'DIRECT_TO_CLOUDINARY'
 */
export const CURRENT_UPLOAD_MODE: UploadMode = 'DIRECT_TO_CLOUDINARY';
