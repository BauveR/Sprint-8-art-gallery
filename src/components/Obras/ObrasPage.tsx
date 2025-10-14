import { Expo, Tienda, EstadoVenta } from "../../types";
import { useObras, useRemoveObra } from "../../query/obras";
import { useTiendas } from "../../query/tiendas";
import { useExpos } from "../../query/expos";
import { ESTADO_CONFIG } from "../../lib/estadoConfig";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ObrasUbicacionChart from "./ObrasUbicacionChart";
import ObrasVentasChart from "./ObrasVentasChart";
import LocationsMap from "./LocationsMap";
import { Search, Upload } from "lucide-react";

// Hooks personalizados
import { useObraSort } from "../../hooks/useObraSort";
import { useObraSearch } from "../../hooks/useObraSearch";
import { useObraForm } from "../../hooks/useObraForm";
import { useObraEdit } from "../../hooks/useObraEdit";
import { useObraImages } from "../../hooks/useObraImages";

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

  // Formulario de creación
  const obraForm = useObraForm();

  // Edición
  const obraEdit = useObraEdit(obras);

  // Imágenes para el modal de edición
  const editImages = useObraImages();

  // Eliminar obra
  const removeObra = useRemoveObra();

  const onDelete = (id: number) => {
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

  const handleCreateSubmit = (ev: React.FormEvent) => {
    obraForm.onSubmit(
      ev,
      () => {
        toast({
          title: "✓ Obra creada exitosamente",
          description: `"${obraForm.form.titulo}" de ${obraForm.form.autor} ha sido agregada a la galería`,
          variant: "default",
        });
      },
      (error) => {
        toast({
          title: "Error al crear obra",
          description: error.message,
          variant: "destructive",
        });
      }
    );
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
          {/* Form alta obra */}
          <form
            onSubmit={handleCreateSubmit}
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
              {tiendas.map((t: Tienda) => (
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
              {expos.map((x: Expo) => (
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

          {/* Tabla obras */}
          <div className="bg-card text-card-foreground rounded-xl shadow overflow-x-auto border dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
            <table className="min-w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-2">
                    <button
                      className={`inline-flex items-center gap-1 ${
                        headerBtn("#", "id_obra").active ? "font-semibold" : ""
                      }`}
                      onClick={headerBtn("#", "id_obra").onClick}
                      title="Ordenar"
                    >
                      #
                      {headerBtn("#", "id_obra").active &&
                        (headerBtn("#", "id_obra").dir === "asc" ? "▲" : "▼")}
                    </button>
                  </th>
                  <th className="text-left p-2">
                    <button
                      className={`inline-flex items-center gap-1 ${
                        headerBtn("Autor", "autor").active ? "font-semibold" : ""
                      }`}
                      onClick={headerBtn("Autor", "autor").onClick}
                      title="Ordenar"
                    >
                      Autor
                      {headerBtn("Autor", "autor").active &&
                        (headerBtn("Autor", "autor").dir === "asc" ? "▲" : "▼")}
                    </button>
                  </th>
                  <th className="text-left p-2">
                    <button
                      className={`inline-flex items-center gap-1 ${
                        headerBtn("Título", "titulo").active ? "font-semibold" : ""
                      }`}
                      onClick={headerBtn("Título", "titulo").onClick}
                      title="Ordenar"
                    >
                      Título
                      {headerBtn("Título", "titulo").active &&
                        (headerBtn("Título", "titulo").dir === "asc" ? "▲" : "▼")}
                    </button>
                  </th>
                  <th className="text-left p-2">
                    <button
                      className={`inline-flex items-center gap-1 ${
                        headerBtn("Estado", "estado_venta").active ? "font-semibold" : ""
                      }`}
                      onClick={headerBtn("Estado", "estado_venta").onClick}
                      title="Ordenar"
                    >
                      Estado
                      {headerBtn("Estado", "estado_venta").active &&
                        (headerBtn("Estado", "estado_venta").dir === "asc" ? "▲" : "▼")}
                    </button>
                  </th>
                  <th className="text-left p-2">
                    <button
                      className={`inline-flex items-center gap-1 ${
                        headerBtn("Ubicación", "ubicacion").active ? "font-semibold" : ""
                      }`}
                      onClick={headerBtn("Ubicación", "ubicacion").onClick}
                      title="Ordenar"
                    >
                      Ubicación
                      {headerBtn("Ubicación", "ubicacion").active &&
                        (headerBtn("Ubicación", "ubicacion").dir === "asc" ? "▲" : "▼")}
                    </button>
                  </th>
                  <th className="text-left p-2">
                    <button
                      className={`inline-flex items-center gap-1 ${
                        headerBtn("Tienda", "tienda_nombre").active ? "font-semibold" : ""
                      }`}
                      onClick={headerBtn("Tienda", "tienda_nombre").onClick}
                      title="Ordenar"
                    >
                      Tienda
                      {headerBtn("Tienda", "tienda_nombre").active &&
                        (headerBtn("Tienda", "tienda_nombre").dir === "asc" ? "▲" : "▼")}
                    </button>
                  </th>
                  <th className="text-left p-2">
                    <button
                      className={`inline-flex items-center gap-1 ${
                        headerBtn("Expo", "expo_nombre").active ? "font-semibold" : ""
                      }`}
                      onClick={headerBtn("Expo", "expo_nombre").onClick}
                      title="Ordenar"
                    >
                      Expo
                      {headerBtn("Expo", "expo_nombre").active &&
                        (headerBtn("Expo", "expo_nombre").dir === "asc" ? "▲" : "▼")}
                    </button>
                  </th>
                  <th className="text-left p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredObras.map((o) => (
                  <tr key={`obra-${o.id_obra}`} className="border-t align-top">
                    <td className="p-2">{o.id_obra}</td>
                    <td className="p-2">{o.autor}</td>
                    <td className="p-2">{o.titulo}</td>
                    <td className="p-2">
                      <Badge
                        className={`text-xs font-medium border ${
                          ESTADO_CONFIG[o.estado_venta].badgeClass
                        }`}
                      >
                        {ESTADO_CONFIG[o.estado_venta].label}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Badge variant="outline">
                        {o.ubicacion === "en_exposicion" && "Exposición"}
                        {o.ubicacion === "en_tienda" && "Tienda Física"}
                        {o.ubicacion === "tienda_online" && "Tienda Online"}
                        {o.ubicacion === "almacen" && "Almacén"}
                      </Badge>
                    </td>
                    <td className="p-2">{o.tienda_nombre ?? "—"}</td>
                    <td className="p-2">{o.expo_nombre ?? "—"}</td>
                    <td className="p-2 space-x-2">
                      <Button variant="ghost" onClick={() => handleStartEdit(o)}>
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => onDelete(o.id_obra)}
                        disabled={removeObra.isPending}
                        className="text-red-600"
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
                {!isLoading && filteredObras.length === 0 && (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={8}>
                      {searchQuery ? "No se encontraron obras con ese criterio" : "Sin obras"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Paginación */}
            <div className="flex items-center justify-between p-3 text-sm">
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

            {isLoading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
            {error && (
              <div className="p-3 text-sm text-red-600">
                Error: {error instanceof Error ? error.message : String(error)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal edición */}
      {obraEdit.edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-card text-card-foreground rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto border dark:bg-white/[0.05] dark:backdrop-blur-2xl dark:border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editar obra #{obraEdit.edit.id}</h3>
              <button
                onClick={handleCancelEdit}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            {/* Sección de imágenes */}
            <div className="mb-6 p-4 border rounded-lg bg-secondary/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Imágenes ({editImages.images.length}/3)</h4>
                {editImages.canUploadMore && (
                  <label className="flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors text-sm">
                    <Upload className="h-3.5 w-3.5" />
                    {editImages.uploading ? "Subiendo..." : "Subir imagen"}
                    <input
                      ref={editImages.fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadEditImage}
                      disabled={editImages.uploading}
                    />
                  </label>
                )}
              </div>

              {editImages.images.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center">
                  Sin imágenes. Sube hasta 3 imágenes.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {editImages.images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.url}
                        alt=""
                        className="w-full aspect-square object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteEditImage(img.id)}
                        className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="border rounded p-2 bg-background text-foreground"
                placeholder="Autor"
                value={obraEdit.edit.form.autor}
                onChange={(e) =>
                  obraEdit.setEdit({
                    ...obraEdit.edit!,
                    form: { ...obraEdit.edit!.form, autor: e.target.value },
                  })
                }
                required
              />
              <input
                className="border rounded p-2 bg-background text-foreground"
                placeholder="Título"
                value={obraEdit.edit.form.titulo}
                onChange={(e) =>
                  obraEdit.setEdit({
                    ...obraEdit.edit!,
                    form: { ...obraEdit.edit!.form, titulo: e.target.value },
                  })
                }
                required
              />
              <input
                className="border rounded p-2 bg-background text-foreground"
                placeholder="Año"
                type="number"
                value={obraEdit.edit.form.anio ?? ""}
                onChange={(e) =>
                  obraEdit.setEdit({
                    ...obraEdit.edit!,
                    form: {
                      ...obraEdit.edit!.form,
                      anio: e.target.value === "" ? null : Number(e.target.value),
                    },
                  })
                }
              />
              <input
                className="border rounded p-2 bg-background text-foreground"
                placeholder="Medidas"
                value={obraEdit.edit.form.medidas ?? ""}
                onChange={(e) =>
                  obraEdit.setEdit({
                    ...obraEdit.edit!,
                    form: { ...obraEdit.edit!.form, medidas: e.target.value || null },
                  })
                }
              />
              <input
                className="border rounded p-2 bg-background text-foreground"
                placeholder="Técnica"
                value={obraEdit.edit.form.tecnica ?? ""}
                onChange={(e) =>
                  obraEdit.setEdit({
                    ...obraEdit.edit!,
                    form: { ...obraEdit.edit!.form, tecnica: e.target.value || null },
                  })
                }
              />
              <input
                className="border rounded p-2 bg-background text-foreground"
                placeholder="Precio salida"
                type="number"
                step="0.01"
                value={obraEdit.edit.form.precio_salida ?? ""}
                onChange={(e) =>
                  obraEdit.setEdit({
                    ...obraEdit.edit!,
                    form: {
                      ...obraEdit.edit!.form,
                      precio_salida: e.target.value === "" ? null : Number(e.target.value),
                    },
                  })
                }
              />
              <select
                className="border rounded p-2 bg-background text-foreground"
                value={obraEdit.edit.form.estado_venta ?? "disponible"}
                onChange={(e) =>
                  obraEdit.setEdit({
                    ...obraEdit.edit!,
                    form: { ...obraEdit.edit!.form, estado_venta: e.target.value as EstadoVenta },
                  })
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

              {/* Campos de tracking - Solo visible si está enviado o entregado */}
              {(obraEdit.edit.form.estado_venta === "enviado" ||
                obraEdit.edit.form.estado_venta === "entregado") && (
                <>
                  <input
                    className="border rounded p-2 bg-background text-foreground col-span-2"
                    placeholder="Número de seguimiento"
                    value={obraEdit.edit.form.numero_seguimiento ?? ""}
                    onChange={(e) =>
                      obraEdit.setEdit({
                        ...obraEdit.edit!,
                        form: { ...obraEdit.edit!.form, numero_seguimiento: e.target.value || null },
                      })
                    }
                  />
                  <input
                    className="border rounded p-2 bg-background text-foreground col-span-2"
                    placeholder="Link de seguimiento (URL completa)"
                    value={obraEdit.edit.form.link_seguimiento ?? ""}
                    onChange={(e) =>
                      obraEdit.setEdit({
                        ...obraEdit.edit!,
                        form: { ...obraEdit.edit!.form, link_seguimiento: e.target.value || null },
                      })
                    }
                  />
                </>
              )}
              <select
                className="border rounded p-2 bg-background text-foreground"
                value={obraEdit.edit.form.id_tienda ?? ""}
                onChange={(e) =>
                  obraEdit.setEdit({
                    ...obraEdit.edit!,
                    form: {
                      ...obraEdit.edit!.form,
                      id_tienda: e.target.value ? Number(e.target.value) : null,
                    },
                  })
                }
              >
                <option value="">Sin tienda</option>
                {tiendas.map((t: Tienda) => (
                  <option key={`tienda-edit-${t.id_tienda}`} value={t.id_tienda}>
                    {t.nombre}
                  </option>
                ))}
              </select>
              <select
                className="border rounded p-2 bg-background text-foreground"
                value={obraEdit.edit.form.id_expo ?? ""}
                onChange={(e) =>
                  obraEdit.setEdit({
                    ...obraEdit.edit!,
                    form: {
                      ...obraEdit.edit!.form,
                      id_expo: e.target.value ? Number(e.target.value) : null,
                    },
                  })
                }
              >
                <option value="">Sin exposición</option>
                {expos.map((x: Expo) => (
                  <option key={`expo-edit-${x.id_expo}`} value={x.id_expo}>
                    {x.nombre}
                  </option>
                ))}
              </select>
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <Button type="button" onClick={handleCancelEdit} variant="default">
                  Cancelar
                </Button>
                <Button type="submit" disabled={obraEdit.isUpdating}>
                  {obraEdit.isUpdating ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
