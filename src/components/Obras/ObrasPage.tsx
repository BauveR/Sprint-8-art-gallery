import React, { useMemo, useState } from "react";
import { Expo, Obra, ObraInput, Tienda, EstadoVenta } from "../../types";
import {
  useObras,
  useCreateObra,
  useRemoveObra,
  useUpdateObra,
} from "../../query/obras";
import { useTiendas } from "../../query/tiendas";
import { useExpos } from "../../query/expos";
import { imagenesService } from "../../services/imageService";
import {
  sendShipmentNotification,
  sendDeliveryConfirmation,
  sendThankYouEmail,
} from "../../lib/emailjs";
import { ESTADO_CONFIG } from "../../lib/estadoConfig";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ObrasUbicacionChart from "./ObrasUbicacionChart";
import ObrasVentasChart from "./ObrasVentasChart";
import LocationsMap from "./LocationsMap";
import { Search, Upload } from "lucide-react";

const emptyObra: ObraInput = {
  autor: "",
  titulo: "",
  anio: null,
  medidas: null,
  tecnica: null,
  precio_salida: null,
  estado_venta: "disponible",
  numero_seguimiento: null,
  link_seguimiento: null,
  id_tienda: null,
  id_expo: null,
};

type EditState = { id: number; form: ObraInput } | null;
type Sort = { key: keyof Obra | "ubicacion" | "expo_nombre" | "tienda_nombre"; dir: "asc" | "desc" };

export default function ObrasPage() {
  // Estado de sort/paginación
  const [sort, setSort] = useState<Sort>({ key: "id_obra", dir: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useObras({ sort: { key: String(sort.key), dir: sort.dir }, page, pageSize });
  const obras = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const { data: tiendas = [] } = useTiendas();
  const { data: expos = [] } = useExpos();

  const createObra = useCreateObra();
  const removeObra = useRemoveObra();
  const updateObra = useUpdateObra();
  const { toast } = useToast();

  const [form, setForm] = useState<ObraInput>(emptyObra);
  const [edit, setEdit] = useState<EditState>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");

  // Estado para imágenes en el modal de edición
  const [editImages, setEditImages] = useState<Array<{id: number; url: string}>>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const editFileInputRef = React.useRef<HTMLInputElement>(null);

  const canSubmit = useMemo(
    () => form.autor.trim() !== "" && form.titulo.trim() !== "",
    [form.autor, form.titulo]
  );

  // Filtrar obras basado en la búsqueda
  const filteredObras = useMemo(() => {
    if (!searchQuery.trim()) return obras;

    const query = searchQuery.toLowerCase();
    return obras.filter((obra) =>
      obra.autor?.toLowerCase().includes(query) ||
      obra.titulo?.toLowerCase().includes(query) ||
      obra.tecnica?.toLowerCase().includes(query) ||
      obra.tienda_nombre?.toLowerCase().includes(query) ||
      obra.expo_nombre?.toLowerCase().includes(query)
    );
  }, [obras, searchQuery]);

  const onCreate = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!canSubmit) return;
    console.log("Creando obra con:", form);
    createObra.mutate(form, {
      onSuccess: async (data) => {
        console.log("Obra creada exitosamente:", data);

        // Si hay imagen seleccionada, subirla
        if (selectedImage && data.id_obra) {
          try {
            await imagenesService.uploadForObra(data.id_obra, selectedImage);
            console.log("Imagen subida exitosamente");
          } catch (error) {
            console.error("Error al subir imagen:", error);
            toast({
              title: "Obra creada",
              description: "La obra se creó correctamente pero hubo un error al subir la imagen",
              variant: "default"
            });
            setForm(emptyObra);
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          }
        }

        // Mostrar toast de éxito
        toast({
          title: "✓ Obra creada exitosamente",
          description: `"${form.titulo}" de ${form.autor} ha sido agregada a la galería`,
          variant: "default"
        });

        setForm(emptyObra);
        setSelectedImage(null);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      onError: (error) => {
        console.error("Error al crear obra:", error);
        toast({
          title: "Error al crear obra",
          description: error instanceof Error ? error.message : "Ocurrió un error inesperado",
          variant: "destructive"
        });
      }
    });
  };

  const onDelete = (id: number) => {
    if (!confirm("¿Eliminar la obra?")) return;
    removeObra.mutate(id);
  };

  const startEdit = async (o: Obra) => {
    setEdit({
      id: o.id_obra,
      form: {
        autor: o.autor ?? "",
        titulo: o.titulo ?? "",
        anio: o.anio ?? null,
        medidas: o.medidas ?? null,
        tecnica: o.tecnica ?? null,
        precio_salida:
          o.precio_salida != null
            ? (typeof o.precio_salida === "string" ? Number(o.precio_salida) : o.precio_salida)
            : null,
        estado_venta: o.estado_venta ?? "disponible",
        numero_seguimiento: o.numero_seguimiento ?? null,
        link_seguimiento: o.link_seguimiento ?? null,
        id_tienda: o.id_tienda ?? null,
        id_expo: o.id_expo ?? null,
      },
    });

    // Cargar imágenes de la obra
    try {
      const images = await imagenesService.listByObra(o.id_obra);
      setEditImages(images);
    } catch (error) {
      console.error("Error cargando imágenes:", error);
      setEditImages([]);
    }
  };

  const handleUploadEditImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!edit) return;
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (2MB máximo)
    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen no debe superar 2MB. Por favor, selecciona una imagen más pequeña.");
      e.target.value = "";
      return;
    }

    // Validar límite de 3 imágenes
    if (editImages.length >= 3) {
      alert("Solo puedes tener un máximo de 3 imágenes por obra.");
      e.target.value = "";
      return;
    }

    setUploadingImage(true);
    try {
      await imagenesService.uploadForObra(edit.id, file);
      const images = await imagenesService.listByObra(edit.id);
      setEditImages(images);
      e.target.value = "";
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      alert("Error al subir la imagen");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteEditImage = async (imageId: number) => {
    if (!edit) return;
    if (!confirm("¿Eliminar imagen?")) return;

    try {
      await imagenesService.remove(imageId);
      const images = await imagenesService.listByObra(edit.id);
      setEditImages(images);
    } catch (error) {
      console.error("Error eliminando imagen:", error);
      alert("Error al eliminar la imagen");
    }
  };

  const cancelEdit = () => {
    setEdit(null);
    setEditImages([]);
  };

  const saveEdit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!edit) return;
    const { id, form } = edit;
    console.log("Guardando obra:", { id, input: form });

    // Buscar la obra original para comparar el estado
    const obraOriginal = obras.find((o) => o.id_obra === id);
    const estadoAnterior = obraOriginal?.estado_venta;
    const nuevoEstado = form.estado_venta;

    updateObra.mutate({ id, input: form }, {
      onSuccess: async () => {
        console.log("Obra actualizada exitosamente, esperando refresh...");

        // Enviar emails según el cambio de estado
        if (obraOriginal?.comprador_email) {
          try {
            // Email de envío (cuando cambia a "enviado")
            if (nuevoEstado === "enviado" && estadoAnterior !== "enviado") {
              if (form.numero_seguimiento && form.link_seguimiento) {
                await sendShipmentNotification({
                  to_email: obraOriginal.comprador_email,
                  to_name: obraOriginal.comprador_nombre || "Cliente",
                  order_id: `ORD-${id}`,
                  tracking_number: form.numero_seguimiento,
                  tracking_link: form.link_seguimiento,
                  items: [{ titulo: obraOriginal.titulo }],
                });
                toast({
                  title: "Email enviado",
                  description: "Se ha notificado al cliente sobre el envío",
                });
              } else {
                toast({
                  title: "Falta información de tracking",
                  description: "Agrega número y link de seguimiento para notificar al cliente",
                  variant: "destructive",
                });
              }
            }

            // Email de entrega (cuando cambia a "entregado")
            if (nuevoEstado === "entregado" && estadoAnterior !== "entregado") {
              await sendDeliveryConfirmation({
                to_email: obraOriginal.comprador_email,
                to_name: obraOriginal.comprador_nombre || "Cliente",
                order_id: `ORD-${id}`,
                items: [{ titulo: obraOriginal.titulo }],
              });

              // También enviar email de agradecimiento
              await sendThankYouEmail({
                to_email: obraOriginal.comprador_email,
                to_name: obraOriginal.comprador_nombre || "Cliente",
                items: [{ titulo: obraOriginal.titulo }],
              });

              toast({
                title: "Emails enviados",
                description: "Se ha notificado al cliente sobre la entrega",
              });
            }
          } catch (emailError) {
            console.error("Error enviando email:", emailError);
            toast({
              title: "Error al enviar email",
              description: "La obra se actualizó pero no se pudo enviar el email",
              variant: "destructive",
            });
          }
        }

        // Esperar un momento para que las queries se actualicen
        await new Promise(resolve => setTimeout(resolve, 500));
        setEdit(null);
      },
      onError: (error) => {
        console.error("Error al actualizar obra:", error);
      }
    });
  };

  const toggleSort = (key: Sort["key"]) => {
    setPage(1); // reset paginación al cambiar sort
    setSort((s) => {
      if (s.key === key) {
        return { key, dir: s.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  };

  const headerBtn = (label: string, key: Sort["key"]) => {
    const active = sort.key === key;
    return (
      <button
        className={`inline-flex items-center gap-1 ${active ? "font-semibold" : ""}`}
        onClick={() => toggleSort(key)}
        title="Ordenar"
      >
        {label}
        {active && (sort.dir === "asc" ? "▲" : "▼")}
      </button>
    );
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
          <form onSubmit={onCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-card text-card-foreground p-4 rounded-xl shadow border dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
        <input className="border rounded p-2 bg-background text-foreground" placeholder="Autor" value={form.autor}
          onChange={(e) => setForm((f) => ({ ...f, autor: e.target.value }))} required />
        <input className="border rounded p-2 bg-background text-foreground" placeholder="Título" value={form.titulo}
          onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))} required />
        <input className="border rounded p-2 bg-background text-foreground" placeholder="Año" type="number" value={form.anio ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, anio: e.target.value === "" ? null : Number(e.target.value) }))} />
        <input className="border rounded p-2 bg-background text-foreground" placeholder="Medidas" value={form.medidas ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, medidas: e.target.value || null }))} />
        <input className="border rounded p-2 bg-background text-foreground" placeholder="Técnica" value={form.tecnica ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, tecnica: e.target.value || null }))} />
        <input className="border rounded p-2 bg-background text-foreground" placeholder="Precio salida" type="number" step="0.01"
          value={form.precio_salida ?? ""}
          onChange={(e) => setForm((f) => ({
            ...f,
            precio_salida: e.target.value === "" ? null : Number(e.target.value),
          }))} />
        <select
          className="border rounded p-2 bg-background text-foreground"
          value={form.estado_venta ?? "disponible"}
          onChange={(e) => setForm((f) => ({ ...f, estado_venta: e.target.value as EstadoVenta }))}
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
          value={form.id_tienda ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, id_tienda: e.target.value ? Number(e.target.value) : null }))}
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
          value={form.id_expo ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, id_expo: e.target.value ? Number(e.target.value) : null }))}
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
              <span className="text-sm">{selectedImage ? selectedImage.name : "Seleccionar imagen"}</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validar tamaño (2MB máximo)
                    if (file.size > 2 * 1024 * 1024) {
                      alert("La imagen no debe superar 2MB. Por favor, selecciona una imagen más pequeña.");
                      e.target.value = "";
                      return;
                    }
                    setSelectedImage(file);
                  } else {
                    setSelectedImage(null);
                  }
                }}
              />
            </label>
            {selectedImage && (
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Quitar
              </button>
            )}
          </div>
          <Button type="submit" disabled={!canSubmit || createObra.isPending} className="w-fit">
            {createObra.isPending ? "Creando..." : "Crear obra"}
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
              <th className="text-left p-2">{headerBtn("#", "id_obra")}</th>
              <th className="text-left p-2">{headerBtn("Autor", "autor")}</th>
              <th className="text-left p-2">{headerBtn("Título", "titulo")}</th>
              <th className="text-left p-2">{headerBtn("Estado", "estado_venta")}</th>
              <th className="text-left p-2">{headerBtn("Ubicación", "ubicacion")}</th>
              <th className="text-left p-2">{headerBtn("Tienda", "tienda_nombre")}</th>
              <th className="text-left p-2">{headerBtn("Expo", "expo_nombre")}</th>
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
                  <Badge className={`text-xs font-medium border ${ESTADO_CONFIG[o.estado_venta].badgeClass}`}>
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
                  <Button variant="ghost" onClick={() => startEdit(o)}>Editar</Button>
                  <Button variant="ghost" onClick={() => onDelete(o.id_obra)} disabled={removeObra.isPending} className="text-red-600">
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
            {!isLoading && filteredObras.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={8}>
                {searchQuery ? "No se encontraron obras con ese criterio" : "Sin obras"}
              </td></tr>
            )}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex items-center justify-between p-3 text-sm">
          <div>
            Página {page} de {totalPages} · {total} obras
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              ← Anterior
            </Button>
            <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Siguiente →
            </Button>
          </div>
        </div>

        {isLoading && <div className="p-3 text-sm text-gray-500">Cargando…</div>}
        {error && <div className="p-3 text-sm text-red-600">Error: {error instanceof Error ? error.message : String(error)}</div>}
      </div>
        </div>
      </div>

      {/* Modal edición */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-card text-card-foreground rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto border dark:bg-white/[0.05] dark:backdrop-blur-2xl dark:border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Editar obra #{edit.id}</h3>
              <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            {/* Sección de imágenes */}
            <div className="mb-6 p-4 border rounded-lg bg-secondary/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold">Imágenes ({editImages.length}/3)</h4>
                {editImages.length < 3 && (
                  <label className="flex items-center gap-2 px-3 py-1.5 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors text-sm">
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingImage ? "Subiendo..." : "Subir imagen"}
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadEditImage}
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>

              {editImages.length === 0 ? (
                <div className="text-sm text-muted-foreground py-4 text-center">
                  Sin imágenes. Sube hasta 3 imágenes.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {editImages.map((img) => (
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

            <form onSubmit={saveEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="border rounded p-2 bg-background text-foreground" placeholder="Autor" value={edit.form.autor}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, autor: e.target.value } })} required />
              <input className="border rounded p-2 bg-background text-foreground" placeholder="Título" value={edit.form.titulo}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, titulo: e.target.value } })} required />
              <input className="border rounded p-2 bg-background text-foreground" placeholder="Año" type="number" value={edit.form.anio ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, anio: e.target.value === "" ? null : Number(e.target.value) } })} />
              <input className="border rounded p-2 bg-background text-foreground" placeholder="Medidas" value={edit.form.medidas ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, medidas: e.target.value || null } })} />
              <input className="border rounded p-2 bg-background text-foreground" placeholder="Técnica" value={edit.form.tecnica ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, tecnica: e.target.value || null } })} />
              <input className="border rounded p-2 bg-background text-foreground" placeholder="Precio salida" type="number" step="0.01" value={edit.form.precio_salida ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, precio_salida: e.target.value === "" ? null : Number(e.target.value) } })} />
              <select
                className="border rounded p-2 bg-background text-foreground"
                value={edit.form.estado_venta ?? "disponible"}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, estado_venta: e.target.value as EstadoVenta } })}
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
              {(edit.form.estado_venta === "enviado" || edit.form.estado_venta === "entregado") && (
                <>
                  <input
                    className="border rounded p-2 bg-background text-foreground col-span-2"
                    placeholder="Número de seguimiento"
                    value={edit.form.numero_seguimiento ?? ""}
                    onChange={(e) => setEdit({ ...edit, form: { ...edit.form, numero_seguimiento: e.target.value || null } })}
                  />
                  <input
                    className="border rounded p-2 bg-background text-foreground col-span-2"
                    placeholder="Link de seguimiento (URL completa)"
                    value={edit.form.link_seguimiento ?? ""}
                    onChange={(e) => setEdit({ ...edit, form: { ...edit.form, link_seguimiento: e.target.value || null } })}
                  />
                </>
              )}
              <select
                className="border rounded p-2 bg-background text-foreground"
                value={edit.form.id_tienda ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, id_tienda: e.target.value ? Number(e.target.value) : null } })}
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
                value={edit.form.id_expo ?? ""}
                onChange={(e) => setEdit({ ...edit, form: { ...edit.form, id_expo: e.target.value ? Number(e.target.value) : null } })}
              >
                <option value="">Sin exposición</option>
                {expos.map((x: Expo) => (
                  <option key={`expo-edit-${x.id_expo}`} value={x.id_expo}>
                    {x.nombre}
                  </option>
                ))}
              </select>
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <Button type="button" onClick={cancelEdit} variant="default">Cancelar</Button>
                <Button type="submit" disabled={updateObra.isPending}>
                  {updateObra.isPending ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
