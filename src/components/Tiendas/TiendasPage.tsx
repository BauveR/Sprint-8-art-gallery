import { useState } from "react";
import { useTiendas, useCreateTienda, useUpdateTienda, useRemoveTienda } from "../../query/tiendas";
import { Tienda, TiendaInput } from "../../types";
import LocationForm from "../shared/LocationForm";
import LocationTable from "../shared/LocationTable";
import LocationEditModal from "../shared/LocationEditModal";

const empty: TiendaInput = { nombre: "", lat: 0, lng: 0, url_tienda: null };

type EditState = { id: number; form: TiendaInput } | null;

export default function TiendasPage() {
  const { data: list = [], isLoading, error } = useTiendas();
  const createTienda = useCreateTienda();
  const updateTienda = useUpdateTienda();
  const removeTienda = useRemoveTienda();

  const [form, setForm] = useState<TiendaInput>(empty);
  const [edit, setEdit] = useState<EditState>(null);

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createTienda.mutate(
      { ...form, lat: Number(form.lat), lng: Number(form.lng) },
      { onSuccess: () => setForm(empty) }
    );
  };

  const onDelete = (id: number) => {
    if (!confirm("¿Eliminar la tienda?")) return;
    removeTienda.mutate(id);
  };

  const startEdit = (t: Tienda) => {
    setEdit({
      id: t.id_tienda,
      form: {
        nombre: t.nombre,
        lat: t.lat,
        lng: t.lng,
        url_tienda: t.url_tienda ?? null,
      },
    });
  };

  const cancelEdit = () => setEdit(null);

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    updateTienda.mutate(
      { id: edit.id, input: { ...edit.form, lat: Number(edit.form.lat), lng: Number(edit.form.lng) } },
      { onSuccess: () => setEdit(null) }
    );
  };

  return (
    <div className="px-4 md:px-[5%] py-6 space-y-6">
      <h2 className="text-xl font-semibold">Tiendas</h2>

      {/* Formulario de creación usando componente genérico */}
      <LocationForm
        form={form}
        onSubmit={onCreate}
        onChange={setForm}
        isSubmitting={createTienda.isPending}
        submitLabel="Crear tienda"
      />

      {/* Tabla usando componente genérico */}
      <LocationTable
        items={list}
        isLoading={isLoading}
        error={error}
        emptyMessage="Sin tiendas"
        onEdit={startEdit}
        onDelete={onDelete}
        isDeleting={removeTienda.isPending}
        getItemId={(t) => t.id_tienda}
        headers={["#", "Nombre", "URL", "Lat/Lng"]}
        renderRow={(t) => (
          <>
            <td className="p-2">{t.id_tienda}</td>
            <td className="p-2">{t.nombre}</td>
            <td className="p-2">
              {t.url_tienda ? (
                <a className="text-blue-600 underline" href={t.url_tienda} target="_blank" rel="noreferrer">
                  link
                </a>
              ) : (
                "—"
              )}
            </td>
            <td className="p-2">
              {t.lat}, {t.lng}
            </td>
          </>
        )}
      />

      {/* Modal de edición usando componente genérico */}
      {edit && (
        <LocationEditModal
          isOpen={!!edit}
          onClose={cancelEdit}
          onSubmit={saveEdit}
          form={edit.form}
          onChange={(updatedForm) => setEdit({ ...edit, form: updatedForm })}
          isSubmitting={updateTienda.isPending}
          title={`Editar tienda #${edit.id}`}
        />
      )}
    </div>
  );
}
