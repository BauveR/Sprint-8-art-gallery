import { Button } from "@/components/ui/button";
import { LocationFormProps } from "../../types/components";

export default function LocationForm<T extends { nombre: string; lat: number; lng: number; url_tienda?: string | null; url_expo?: string | null }>({
  form,
  onSubmit,
  onChange,
  isSubmitting,
  submitLabel,
  children,
}: LocationFormProps<T>) {
  const urlKey = 'url_tienda' in form ? 'url_tienda' : 'url_expo';

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-2 gap-3 bg-card text-card-foreground p-4 rounded-xl shadow border dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10"
    >
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
      <div className="col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
