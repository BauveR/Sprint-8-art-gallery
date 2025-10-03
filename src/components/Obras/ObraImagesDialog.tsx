import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ObraImagen } from "../../types";
import { imagenesService } from "../../services/imageService";

type Props = {
  obra: { id_obra: number; titulo: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ObraImagesDialog({ obra, open, onOpenChange }: Props) {
  const [list, setList] = React.useState<ObraImagen[]>([]);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(async () => {
    if (!obra) return;
    const imgs = await imagenesService.listByObra(obra.id_obra);
    setList(imgs);
  }, [obra]);

  React.useEffect(() => {
    if (open && obra) void load();
  }, [open, obra, load]);

  const onUpload = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0];
    if (!f || !obra) return;

    // Validar tamaño (2MB máximo)
    if (f.size > 2 * 1024 * 1024) {
      alert("La imagen no debe superar 2MB. Por favor, selecciona una imagen más pequeña.");
      ev.target.value = "";
      return;
    }

    setBusy(true);
    try {
      await imagenesService.uploadForObra(obra.id_obra, f);
      await load();
      ev.target.value = "";
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error subiendo imagen";
      alert(msg);
    } finally {
      setBusy(false);
    }
  };

  const onRemove = async (id: number) => {
    if (!obra) return;
    if (!confirm("¿Eliminar imagen?")) return;
    setBusy(true);
    try {
      await imagenesService.remove(id);
      await load();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error eliminando imagen";
      alert(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Imágenes de “{obra?.titulo ?? ""}”</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2">
            <Button size="sm" disabled={busy}>Subir imagen</Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUpload}
              disabled={busy}
            />
          </label>
          {busy && <span className="text-sm text-muted-foreground">Procesando…</span>}
        </div>

        <ScrollArea className="max-h-[60vh] mt-2">
          {list.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6 px-1">Sin imágenes</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
              {list.map(img => (
                <div key={img.id} className="rounded-xl border overflow-hidden">
                  <AspectRatio ratio={4/3}>
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </AspectRatio>
                  <div className="p-2 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onRemove(img.id)}
                      disabled={busy}
                    >
                      Borrar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
