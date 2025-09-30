import { useCallback } from "react";

// Implementación ultra simple estilo shadcn: useToast() -> { toast({...}) }
// Internamente usa un EventTarget global para comunicar con <Toaster />.

type Variant = "default" | "destructive";
export type ToastOpts = {
  title?: string;
  description?: string;
  duration?: number; // ms
  variant?: Variant;
};

export type ToastEventDetail = ToastOpts & { id: string };

const emitter = new EventTarget();
const EVT_NAME = "app-toast";

export function useToast() {
  const toast = useCallback((opts: ToastOpts) => {
    const detail: ToastEventDetail = {
      id: Math.random().toString(36).slice(2),
      duration: opts.duration ?? 3500,
      variant: opts.variant ?? "default",
      title: opts.title,
      description: opts.description,
    };
    emitter.dispatchEvent(new CustomEvent<ToastEventDetail>(EVT_NAME, { detail }));
  }, []);

  return { toast };
}

// Suscripción util para el Toaster
export function subscribeToToasts(cb: (t: ToastEventDetail) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<ToastEventDetail>).detail);
  emitter.addEventListener(EVT_NAME, handler);
  return () => emitter.removeEventListener(EVT_NAME, handler);
}
