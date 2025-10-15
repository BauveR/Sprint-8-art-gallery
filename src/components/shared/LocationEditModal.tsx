import { Button } from "@/components/ui/button";
import { LocationEditModalProps } from "../../types/components";

export default function LocationEditModal<T extends { nombre: string; lat: number; lng: number; url_tienda?: string | null; url_expo?: string | null }>({
  isOpen,
  onClose,
  onSubmit,
  form,
  onChange,
  isSubmitting,
  title,
  children,
}: LocationEditModalProps<T>) {
  if (!isOpen) return null;

  const urlKey = 'url_tienda' in form ? 'url_tienda' : 'url_expo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-card text-card-foreground rounded-2xl shadow-xl p-6 border dark:bg-white/[0.05] dark:backdrop-blur-2xl dark:border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-3">
          <input
            className="border rounded p-2 bg-background text-foreground"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => onChange({ ...form, nombre: e.target.value })}
            required
          />
          <input
            className="border rounded p-2 bg-background text-foreground"
            placeholder="URL"
            value={(form[urlKey as keyof T] as string) ?? ""}
            onChange={(e) => onChange({ ...form, [urlKey]: e.target.value || null } as T)}
          />
          <input
            className="border rounded p-2 bg-background text-foreground"
            placeholder="Lat (-90 a 90)"
            type="number"
            step="any"
            min="-90"
            max="90"
            value={form.lat}
            onChange={(e) => onChange({ ...form, lat: Number(e.target.value) })}
            onFocus={(e) => e.target.select()}
            required
          />
          <input
            className="border rounded p-2 bg-background text-foreground"
            placeholder="Lng (-180 a 180)"
            type="number"
            step="any"
            min="-180"
            max="180"
            value={form.lng}
            onChange={(e) => onChange({ ...form, lng: Number(e.target.value) })}
            onFocus={(e) => e.target.select()}
            required
          />
          {children}
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Cancelar
            </button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
