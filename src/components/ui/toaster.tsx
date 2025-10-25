/**
 * Componente Toaster para mostrar notificaciones toast
 * Trabaja en conjunto con useToast hook
 */

import { useEffect, useState } from "react";
import { subscribeToToasts, type ToastEventDetail } from "./use-toast";

export function Toaster() {
  const [toasts, setToasts] = useState<ToastEventDetail[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast) => {
      setToasts((prev) => [...prev, toast]);

      // Auto-remove after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration);
    });

    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto
            max-w-md rounded-lg border p-4 shadow-lg
            animate-in slide-in-from-right-full
            ${
              toast.variant === "destructive"
                ? "bg-red-600 text-white border-red-700"
                : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
            }
          `}
        >
          {toast.title && (
            <div className="font-semibold mb-1">
              {toast.title}
            </div>
          )}
          {toast.description && (
            <div className={`text-sm ${toast.variant === "destructive" ? "text-white/90" : "text-gray-600 dark:text-gray-400"}`}>
              {toast.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
