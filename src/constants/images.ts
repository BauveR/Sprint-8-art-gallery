/**
 * Constantes para manejo de imágenes
 * Centraliza límites y configuración de imágenes (DRY + KISS)
 */

export const IMAGE_LIMITS = {
  /** Número máximo de imágenes por obra */
  MAX_COUNT: 3,

  /** Tamaño máximo en bytes (2MB) */
  MAX_SIZE_BYTES: 2 * 1024 * 1024,

  /** Tamaño máximo en MB para mostrar al usuario */
  MAX_SIZE_MB: 2,

  /** Tipos de archivo permitidos */
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,

  /** Extensiones permitidas */
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'] as const,
} as const;

/**
 * Mensajes de error para validación de imágenes
 */
export const IMAGE_ERRORS = {
  MAX_SIZE: `La imagen no debe superar ${IMAGE_LIMITS.MAX_SIZE_MB}MB. Por favor, selecciona una imagen más pequeña.`,
  MAX_COUNT: `Solo puedes tener un máximo de ${IMAGE_LIMITS.MAX_COUNT} imágenes por obra.`,
  INVALID_TYPE: 'Tipo de archivo no permitido. Usa JPG, PNG, WEBP o GIF.',
  UPLOAD_FAILED: 'Error al subir la imagen. Inténtalo de nuevo.',
  DELETE_FAILED: 'Error al eliminar la imagen.',
} as const;
