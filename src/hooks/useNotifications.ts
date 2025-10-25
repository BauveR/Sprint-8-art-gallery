/**
 * Hook para abstraer el sistema de notificaciones
 * Implementa SOLID - Dependency Inversion Principle
 * Los componentes dependen de la abstracción, no de la implementación concreta
 */

import { useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";

/**
 * Interface del servicio de notificaciones
 */
export interface NotificationService {
  success(message: string, description?: string): void;
  error(message: string, description?: string): void;
  info(message: string, description?: string): void;
  warning(message: string, description?: string): void;
}

/**
 * Implementación usando Shadcn/UI Toast
 */
class ToastNotificationService implements NotificationService {
  constructor(private toast: any) {}

  success(message: string, description?: string) {
    this.toast({
      title: `✓ ${message}`,
      description,
    });
  }

  error(message: string, description?: string) {
    this.toast({
      title: `✗ ${message}`,
      description,
      variant: "destructive",
    });
  }

  info(message: string, description?: string) {
    this.toast({
      title: message,
      description,
    });
  }

  warning(message: string, description?: string) {
    this.toast({
      title: `⚠ ${message}`,
      description,
      variant: "destructive",
    });
  }
}

/**
 * Hook que provee el servicio de notificaciones
 * Los componentes usan esto en lugar de useToast directamente
 */
export function useNotifications(): NotificationService {
  const { toast } = useToast();

  return useMemo(() => new ToastNotificationService(toast), [toast]);
}
