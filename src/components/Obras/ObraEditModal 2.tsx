import { Expo, Tienda } from "../../types";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type EditState = {
  id: number;
  form: {
    autor: string;
    titulo: string;
    anio: number | null;
    medidas: string | null;
    tecnica: string | null;
    precio_salida: number | null;
    id_tienda: number | null;
    id_expo: number | null;
  };
};

type ObraEditModalProps = {
  edit: EditState | null;
  tiendas: Tienda[];
  expos: Expo[];
  images: Array<{ id: number; url: string }>;
  uploading: boolean;
  canUploadMore: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isUpdating: boolean;
  onSubmit: (ev: React.FormEvent) => void;
  onCancel: () => void;
  onEditChange: (edit: EditState) => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: (imageId: number) => void;
};

export default function ObraEditModal({
  edit,
  tiendas,
  expos,
  images,
  uploading,
  canUploadMore,
  fileInputRef,
  isUpdating,
  onSubmit,
  onCancel,
  onEditChange,
  onUploadImage,
  onDeleteImage,
}: ObraEditModalProps) {
  if (!edit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-card text-card-foreground rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto border dark:bg-white/[0.05] dark:backdrop-blur-2xl dark:border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Editar obra #{edit.id}</h3>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
        </div>

        {/* Sección de imágenes */}
        <div className="mb-6 p-4 border rounded-lg bg-secondary/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">Imágenes ({images.length}/3)</h4>
            {canUploadMore && (
              <label className="flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors text-sm">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Subiendo..." : "Subir imagen"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onUploadImage}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {images.length === 0 ? (
            <div className="text-sm text-muted-foreground py-4 text-center">
              Sin imágenes. Sube hasta 3 imágenes.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt=""
                    className="w-full aspect-square object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => onDeleteImage(img.id)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            className="border rounded p-2 bg-background text-foreground"
            placeholder="Autor"
            value={edit.form.autor}
            onChange={(e) =>
              onEditChange({ ...edit, form: { ...edit.form, autor: e.target.value } })
            }
            required
          />
          <input
            className="border rounded p-2 bg-background text-foreground"
            placeholder="Título"
            value={edit.form.titulo}
            onChange={(e) =>
              onEditChange({ ...edit, form: { ...edit.form, titulo: e.target.value } })
            }
            required
          />
          <input
            className="border rounded p-2 bg-background text-foreground"
            placeholder="Año"
            type="number"
            value={edit.form.anio ?? ""}
            onChange={(e) =>
              onEditChange({
                ...edit,
                form: {
                  ...edit.form,
                  anio: e.target.value === "" ? null : Number(e.target.value),
                },
              })
            }
          />
          <input
            className="border rounded p-2 bg-background text-foreground"
            placeholder="Medidas"
            value={edit.form.medidas ?? ""}
            onChange={(e) =>
              onEditChange({ ...edit, form: { ...edit.form, medidas: e.target.value || null } })
            }
          />
          <input
            className="border rounded p-2 bg-background text-foreground"
            placeholder="Técnica"
            value={edit.form.tecnica ?? ""}
            onChange={(e) =>
              onEditChange({ ...edit, form: { ...edit.form, tecnica: e.target.value || null } })
            }
          />
          <input
            className="border rounded p-2 bg-background text-foreground"
            placeholder="Precio salida"
            type="number"
            step="0.01"
            value={edit.form.precio_salida ?? ""}
            onChange={(e) =>
              onEditChange({
                ...edit,
                form: {
                  ...edit.form,
                  precio_salida: e.target.value === "" ? null : Number(e.target.value),
                },
              })
            }
          />
          <select
            className="border rounded p-2 bg-background text-foreground"
            value={edit.form.id_tienda ?? ""}
            onChange={(e) =>
              onEditChange({
                ...edit,
                form: {
                  ...edit.form,
                  id_tienda: e.target.value ? Number(e.target.value) : null,
                },
              })
            }
          >
            <option value="">Sin tienda</option>
            {tiendas.map((t) => (
              <option key={`tienda-edit-${t.id_tienda}`} value={t.id_tienda}>
                {t.nombre}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2 bg-background text-foreground"
            value={edit.form.id_expo ?? ""}
            onChange={(e) =>
              onEditChange({
                ...edit,
                form: {
                  ...edit.form,
                  id_expo: e.target.value ? Number(e.target.value) : null,
                },
              })
            }
          >
            <option value="">Sin exposición</option>
            {expos.map((x) => (
              <option key={`expo-edit-${x.id_expo}`} value={x.id_expo}>
                {x.nombre}
              </option>
            ))}
          </select>
          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <Button type="button" onClick={onCancel} variant="default">
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
