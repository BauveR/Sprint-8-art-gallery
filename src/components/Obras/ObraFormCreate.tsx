import { Expo, Tienda, EstadoVenta } from "../../types";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useObraForm } from "../../hooks/useObraForm";

type ObraFormCreateProps = {
  tiendas: Tienda[];
  expos: Expo[];
  onSuccess: () => void;
  onError: (error: Error) => void;
};

export default function ObraFormCreate({ tiendas, expos, onSuccess, onError }: ObraFormCreateProps) {
  const obraForm = useObraForm();

  const handleSubmit = (ev: React.FormEvent) => {
    obraForm.onSubmit(ev, onSuccess, onError);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-card text-card-foreground p-4 rounded-xl shadow border dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10"
    >
      <input
        className="border rounded p-2 bg-background text-foreground"
        placeholder="Autor"
        value={obraForm.form.autor}
        onChange={(e) => obraForm.setForm((f) => ({ ...f, autor: e.target.value }))}
        required
      />
      <input
        className="border rounded p-2 bg-background text-foreground"
        placeholder="Título"
        value={obraForm.form.titulo}
        onChange={(e) => obraForm.setForm((f) => ({ ...f, titulo: e.target.value }))}
        required
      />
      <input
        className="border rounded p-2 bg-background text-foreground"
        placeholder="Año"
        type="number"
        value={obraForm.form.anio ?? ""}
        onChange={(e) =>
          obraForm.setForm((f) => ({
            ...f,
            anio: e.target.value === "" ? null : Number(e.target.value),
          }))
        }
      />
      <input
        className="border rounded p-2 bg-background text-foreground"
        placeholder="Medidas"
        value={obraForm.form.medidas ?? ""}
        onChange={(e) => obraForm.setForm((f) => ({ ...f, medidas: e.target.value || null }))}
      />
      <input
        className="border rounded p-2 bg-background text-foreground"
        placeholder="Técnica"
        value={obraForm.form.tecnica ?? ""}
        onChange={(e) => obraForm.setForm((f) => ({ ...f, tecnica: e.target.value || null }))}
      />
      <input
        className="border rounded p-2 bg-background text-foreground"
        placeholder="Precio salida"
        type="number"
        step="0.01"
        value={obraForm.form.precio_salida ?? ""}
        onChange={(e) =>
          obraForm.setForm((f) => ({
            ...f,
            precio_salida: e.target.value === "" ? null : Number(e.target.value),
          }))
        }
      />
      <select
        className="border rounded p-2 bg-background text-foreground"
        value={obraForm.form.estado_venta ?? "disponible"}
        onChange={(e) =>
          obraForm.setForm((f) => ({ ...f, estado_venta: e.target.value as EstadoVenta }))
        }
      >
        <option value="disponible">Disponible</option>
        <option value="en_carrito">En carrito</option>
        <option value="procesando_envio">Procesando envío</option>
        <option value="enviado">Enviado</option>
        <option value="entregado">Entregado</option>
        <option value="pendiente_devolucion">Pendiente devolución</option>
        <option value="nunca_entregado">Nunca entregado</option>
      </select>
      <select
        className="border rounded p-2 bg-background text-foreground"
        value={obraForm.form.id_tienda ?? ""}
        onChange={(e) =>
          obraForm.setForm((f) => ({
            ...f,
            id_tienda: e.target.value ? Number(e.target.value) : null,
          }))
        }
      >
        <option value="">Sin tienda</option>
        {tiendas.map((t) => (
          <option key={`tienda-create-${t.id_tienda}`} value={t.id_tienda}>
            {t.nombre}
          </option>
        ))}
      </select>
      <select
        className="border rounded p-2 bg-background text-foreground"
        value={obraForm.form.id_expo ?? ""}
        onChange={(e) =>
          obraForm.setForm((f) => ({
            ...f,
            id_expo: e.target.value ? Number(e.target.value) : null,
          }))
        }
      >
        <option value="">Sin exposición</option>
        {expos.map((x) => (
          <option key={`expo-create-${x.id_expo}`} value={x.id_expo}>
            {x.nombre}
          </option>
        ))}
      </select>
      <div className="col-span-2 space-y-3">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
            <Upload className="h-4 w-4" />
            <span className="text-sm">
              {obraForm.selectedImage ? obraForm.selectedImage.name : "Seleccionar imagen"}
            </span>
            <input
              ref={obraForm.fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => obraForm.handleImageSelect(e.target.files?.[0] || null)}
            />
          </label>
          {obraForm.selectedImage && (
            <button
              type="button"
              onClick={obraForm.clearImage}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Quitar
            </button>
          )}
        </div>
        <Button
          type="submit"
          disabled={!obraForm.canSubmit || obraForm.isSubmitting}
          className="w-fit"
        >
          {obraForm.isSubmitting ? "Creando..." : "Crear obra"}
        </Button>
      </div>
    </form>
  );
}
