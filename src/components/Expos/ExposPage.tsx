import { useState } from "react";
import { useExpos, useCreateExpo, useUpdateExpo, useRemoveExpo } from "../../query/expos";
import { Expo, ExpoInput } from "../../types";
import { EditState } from "../../types/forms";
import { DatePicker } from "@/components/ui/date-picker";
import LocationForm from "../shared/LocationForm";
import LocationTable from "../shared/LocationTable";
import LocationEditModal from "../shared/LocationEditModal";
import Model3D from "../3D/Model3D";

const empty: ExpoInput = {
  nombre: "",
  lat: 0,
  lng: 0,
  fecha_inicio: "",
  fecha_fin: "",
  url_expo: null,
};

export default function ExposPage() {
  const { data: list = [], isLoading, error } = useExpos();
  const createExpo = useCreateExpo();
  const updateExpo = useUpdateExpo();
  const removeExpo = useRemoveExpo();

  const [form, setForm] = useState<ExpoInput>(empty);
  const [edit, setEdit] = useState<EditState<ExpoInput>>(null);

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createExpo.mutate(
      { ...form, lat: Number(form.lat), lng: Number(form.lng) },
      { onSuccess: () => setForm(empty) }
    );
  };

  const onDelete = (id: number) => {
    if (!confirm("¿Eliminar la exposición?")) return;
    removeExpo.mutate(id);
  };

  const startEdit = (x: Expo) => {
    setEdit({
      id: x.id_expo,
      form: {
        nombre: x.nombre,
        lat: x.lat,
        lng: x.lng,
        fecha_inicio: x.fecha_inicio,
        fecha_fin: x.fecha_fin,
        url_expo: x.url_expo ?? null,
      },
    });
  };

  const cancelEdit = () => setEdit(null);

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    updateExpo.mutate(
      {
        id: edit.id,
        input: { ...edit.form, lat: Number(edit.form.lat), lng: Number(edit.form.lng) },
      },
      { onSuccess: () => setEdit(null) }
    );
  };

  return (
    <div className="px-4 md:px-[5%] py-6 space-y-6">
      <h2 className="text-xl font-semibold">Exposiciones</h2>

      {/* Modelo 3D centrado */}
      <div className="w-full flex justify-center py-4">
        <div className="w-full max-w-md h-[35vh]">
          <Model3D
            modelPath="https://res.cloudinary.com/dmweipuof/image/upload/v1760910655/Screenshot_final_j6nnfu.glb"
            autoRotate={true}
            rotationSpeed={0.3}
            scale={18}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Formulario de creación con campos de fecha */}
      <LocationForm
        form={form}
        onSubmit={onCreate}
        onChange={setForm}
        isSubmitting={createExpo.isPending}
        submitLabel="Crear exposición"
      >
        <DatePicker
          value={form.fecha_inicio}
          onChange={(date) => setForm((f) => ({ ...f, fecha_inicio: date }))}
          placeholder="Fecha de inicio"
        />
        <DatePicker
          value={form.fecha_fin}
          onChange={(date) => setForm((f) => ({ ...f, fecha_fin: date }))}
          placeholder="Fecha de fin"
        />
      </LocationForm>

      {/* Tabla usando componente genérico */}
      <LocationTable
        items={list}
        isLoading={isLoading}
        error={error}
        emptyMessage="Sin expos"
        onEdit={startEdit}
        onDelete={onDelete}
        isDeleting={removeExpo.isPending}
        getItemId={(x) => x.id_expo}
        headers={["#", "Nombre", "Fechas", "URL"]}
        renderRow={(x) => (
          <>
            <td className="p-2">{x.id_expo}</td>
            <td className="p-2">{x.nombre}</td>
            <td className="p-2">
              {x.fecha_inicio} → {x.fecha_fin}
            </td>
            <td className="p-2">
              {x.url_expo ? (
                <a className="text-blue-600 underline" href={x.url_expo} target="_blank" rel="noreferrer">
                  link
                </a>
              ) : (
                "—"
              )}
            </td>
          </>
        )}
      />

      {/* Modal de edición con campos de fecha */}
      {edit && (
        <LocationEditModal
          isOpen={!!edit}
          onClose={cancelEdit}
          onSubmit={saveEdit}
          form={edit.form}
          onChange={(updatedForm) => setEdit({ ...edit, form: updatedForm })}
          isSubmitting={updateExpo.isPending}
          title={`Editar exposición #${edit.id}`}
        >
          <DatePicker
            value={edit.form.fecha_inicio}
            onChange={(date) => setEdit({ ...edit, form: { ...edit.form, fecha_inicio: date } })}
            placeholder="Fecha de inicio"
          />
          <DatePicker
            value={edit.form.fecha_fin}
            onChange={(date) => setEdit({ ...edit, form: { ...edit.form, fecha_fin: date } })}
            placeholder="Fecha de fin"
          />
        </LocationEditModal>
      )}
    </div>
  );
}
