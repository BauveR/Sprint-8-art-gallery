import { useObras, useRemoveObra } from "../../query/obras";
import { useTiendas } from "../../query/tiendas";
import { useExpos } from "../../query/expos";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const { sort, page, pageSize, setPage, headerBtn } = useObraSort(8);

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
  const obraEdit = useObraEdit();

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
        toast({
          title: "Obra actualizada",
          description: "La obra se actualizó correctamente",
        });
      },
      (error) => {
        toast({
          title: "Error al actualizar obra",
          description: error.message,
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
    <div className="px-4 md:px-[5%] py-6 space-y-6">
      {/* Versión móvil: Accordion desplegable */}
      <div className="lg:hidden">
        <Accordion type="single" collapsible className="space-y-4">
          {/* Sección Subir piedra */}
          <AccordionItem value="subir" className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subir piedra</h2>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
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
            </AccordionContent>
          </AccordionItem>

          {/* Sección Inventario */}
          <AccordionItem value="inventario" className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventario</h2>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 space-y-4">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Versión desktop: Layout en grid */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] gap-6">
        {/* Columna izquierda: Formulario de alta */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4 flex flex-col h-full">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Subir piedra</h2>
          <div className="flex-1">
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
          </div>
        </div>

        {/* Columna derecha: Container de Inventario */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventario</h2>

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

      {/* Sección inferior: Charts horizontales (fijos) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        {/* Espacio vacío para alinear con el formulario */}
        <div></div>

        {/* Charts alineados con la tabla de inventario */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <ObrasUbicacionChart obras={obras} />
          <ObrasVentasChart obras={obras} />
          <LocationsMap tiendas={tiendas} expos={expos} />
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
