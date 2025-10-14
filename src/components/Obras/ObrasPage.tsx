import { useObras, useRemoveObra } from "../../query/obras";
import { useTiendas } from "../../query/tiendas";
import { useExpos } from "../../query/expos";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";

// Hooks personalizados
import { useObraSort } from "../../hooks/useObraSort";
import { useObraSearch } from "../../hooks/useObraSearch";
import { useObraEdit } from "../../hooks/useObraEdit";
import { useObraImages } from "../../hooks/useObraImages";

// Componentes
import ObrasUbicacionChart from "./ObrasUbicacionChart";
import ObrasVentasChart from "./ObrasVentasChart";
import LocationsMap from "./LocationsMap";
import ObraFormCreate from "./ObraFormCreate";
import ObrasTable from "./ObrasTable";
import ObraEditModal from "./ObraEditModal";

export default function ObrasPage() {
  const { toast } = useToast();

  // Sort y paginación
  const { sort, page, pageSize, setPage, headerBtn } = useObraSort(10);

  // Datos del servidor
  const { data, isLoading, error } = useObras({
    sort: { key: String(sort.key), dir: sort.dir },
    page,
    pageSize,
  });
  const obras = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const { data: tiendas = [] } = useTiendas();
  const { data: expos = [] } = useExpos();

  // Búsqueda
  const { searchQuery, setSearchQuery, filteredObras } = useObraSearch(obras);

  // Edición
  const obraEdit = useObraEdit(obras);

  // Imágenes para el modal de edición
  const editImages = useObraImages();

  // Eliminar obra
  const removeObra = useRemoveObra();

  const handleDelete = (id: number) => {
    if (!confirm("¿Eliminar la obra?")) return;
    removeObra.mutate(id);
  };

  const handleStartEdit = async (obra: typeof obras[0]) => {
    obraEdit.startEdit(obra);
    await editImages.loadImages(obra.id_obra);
  };

  const handleCancelEdit = () => {
    obraEdit.cancelEdit();
    editImages.resetImages();
  };

  const handleEditSubmit = (ev: React.FormEvent) => {
    obraEdit.saveEdit(
      ev,
      () => {
        editImages.resetImages();
      },
      (error) => {
        toast({
          title: "Error al actualizar obra",
          description: error.message,
          variant: "destructive",
        });
      },
      (message) => {
        toast({
          title: "Email enviado",
          description: message,
        });
      },
      (message) => {
        toast({
          title: "Error al enviar email",
          description: message,
          variant: "destructive",
        });
      }
    );
  };

  const handleUploadEditImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!obraEdit.edit) return;
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await editImages.uploadImage(obraEdit.edit.id, file);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al subir la imagen");
      e.target.value = "";
    }
  };

  const handleDeleteEditImage = async (imageId: number) => {
    if (!obraEdit.edit) return;
    if (!confirm("¿Eliminar imagen?")) return;

    try {
      await editImages.deleteImage(obraEdit.edit.id, imageId);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al eliminar la imagen");
    }
  };

  return (
    <div className="px-4 md:px-[5%] py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] gap-6">
        {/* Columna izquierda: Charts */}
        <div className="space-y-6">
          <ObrasUbicacionChart obras={obras} />
          <ObrasVentasChart obras={obras} />
          <LocationsMap tiendas={tiendas} expos={expos} />
        </div>

        {/* Columna derecha: Formulario + Tabla */}
        <div className="space-y-6">
          {/* Formulario de creación */}
          <ObraFormCreate
            tiendas={tiendas}
            expos={expos}
            onSuccess={() => {
              toast({
                title: "✓ Obra creada exitosamente",
                description: "La obra ha sido agregada a la galería",
                variant: "default",
              });
            }}
            onError={(error) => {
              toast({
                title: "Error al crear obra",
                description: error.message,
                variant: "destructive",
              });
            }}
          />

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por autor, título, técnica, tienda o exposición..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabla de obras */}
          <ObrasTable
            obras={filteredObras}
            isLoading={isLoading}
            error={error}
            searchQuery={searchQuery}
            headerBtn={headerBtn}
            onEdit={handleStartEdit}
            onDelete={handleDelete}
            isDeleting={removeObra.isPending}
          />

          {/* Paginación */}
          <div className="flex items-center justify-between text-sm">
            <div>
              Página {page} de {totalPages} · {total} obras
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Anterior
              </Button>
              <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Siguiente →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <ObraEditModal
        edit={obraEdit.edit}
        tiendas={tiendas}
        expos={expos}
        images={editImages.images}
        uploading={editImages.uploading}
        canUploadMore={editImages.canUploadMore}
        fileInputRef={editImages.fileInputRef}
        isUpdating={obraEdit.isUpdating}
        onSubmit={handleEditSubmit}
        onCancel={handleCancelEdit}
        onEditChange={obraEdit.setEdit}
        onUploadImage={handleUploadEditImage}
        onDeleteImage={handleDeleteEditImage}
      />
    </div>
  );
}
