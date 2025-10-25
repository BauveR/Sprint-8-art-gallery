/**
 * Hook para manejar acciones asíncronas con manejo de errores centralizado
 * Elimina código duplicado de try-catch-toast (DRY)
 */

import { useState, useCallback } from "react";
import { useNotifications } from "./useNotifications";

export interface AsyncActionOptions<T> {
  /** Mensaje a mostrar cuando la acción es exitosa */
  successMessage?: string;

  /** Mensaje a mostrar cuando la acción falla */
  errorMessage?: string;

  /** Callback ejecutado al completar exitosamente */
  onSuccess?: (result: T) => void;

  /** Callback ejecutado al fallar */
  onError?: (error: Error) => void;

  /** Si es true, no muestra toast de éxito */
  silent?: boolean;
}

export interface AsyncActionResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * Hook para ejecutar acciones asíncronas con manejo de errores automático
 *
 * @example
 * const { execute, isLoading } = useAsyncAction();
 *
 * const handleSave = async () => {
 *   await execute(
 *     () => updateObra.mutateAsync({ id, data }),
 *     {
 *       successMessage: "Obra actualizada",
 *       errorMessage: "Error al actualizar",
 *     }
 *   );
 * };
 */
export function useAsyncAction<T = void>() {
  const notifications = useNotifications();
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (
      action: () => Promise<T>,
      options?: AsyncActionOptions<T>
    ): Promise<AsyncActionResult<T>> => {
      setIsLoading(true);

      try {
        const result = await action();

        // Mostrar mensaje de éxito si se proporciona y no es silencioso
        if (options?.successMessage && !options?.silent) {
          notifications.success(options.successMessage);
        }

        // Ejecutar callback de éxito
        options?.onSuccess?.(result);

        return { success: true, data: result };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');

        // Mostrar mensaje de error
        notifications.error(
          options?.errorMessage || "Error al ejecutar la acción",
          err.message
        );

        // Ejecutar callback de error
        options?.onError?.(err);

        return { success: false, error: err };
      } finally {
        setIsLoading(false);
      }
    },
    [notifications]
  );

  return { execute, isLoading };
}
