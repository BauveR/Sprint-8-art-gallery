import { useEffect, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ObraImagen } from "@/types";
import { deleteImage, listImagesByObra, uploadImage } from "@/query/images";
import { toast } from "sonner";

export default function ObraImagesDialog({ obra, open, onOpenChange }:
  { obra: { id_obra: number; titulo: string } | null; open: boolean; onOpenChange: (o: boolean)=>void }) {

  const [list, setList] = useState<ObraImagen[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!obra) return;
    setList(await listImagesByObra(obra.id_obra));
  }, [obra]);

  useEffect(() => { if (open && obra) void load(); }, [open, obra, load]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f || !obra) return;
    setBusy(true);
    try { await uploadImage(obra.id_obra, f); await load(); e.target.value=""; }
    catch (err:any) { toast.error(err.message ?? "Error subiendo imagen"); }
    finally { setBusy(false); }
  };

  const onRemove = async (id: number) => {
    if (!obra) return;
    if (!confirm("¿Eliminar imagen?")) return;
    setBusy(true);
    try { await deleteImage(id); await load(); }
    catch (err:any) { toast.error(err.message ?? "Error eliminando imagen"); }
    finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader><DialogTitle>Imágenes de “{obra?.titulo ?? ""}”</DialogTitle></DialogHeader>
        <div className="flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2">
            <Button size="sm" disabled={busy}>Subir imagen</Button>
            <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={busy}/>
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
                  <AspectRatio ratio={4/3}><img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy"/></AspectRatio>
                  <div className="p-2 text-right">
                    <Button variant="destructive" size="sm" onClick={() => onRemove(img.id)} disabled={busy}>Borrar</Button>
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
