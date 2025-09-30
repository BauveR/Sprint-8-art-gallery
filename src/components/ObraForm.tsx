import { useState } from "react";
import { Api } from "../api";

export default function ObraForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState({ autor: "", titulo: "", anio: "", medidas: "", tecnica: "", precio_salida: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await Api.createObra({
      autor: form.autor.trim(),
      titulo: form.titulo.trim(),
      anio: form.anio ? Number(form.anio) : null,
      medidas: form.medidas || null,
      tecnica: form.tecnica || null,
      precio_salida: form.precio_salida ? Number(form.precio_salida) : null,
    });
    setForm({ autor: "", titulo: "", anio: "", medidas: "", tecnica: "", precio_salida: "" });
    onCreated();
  }

  return (
    <form onSubmit={submit} className="grid gap-3 p-4 border rounded-xl">
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="border rounded-lg px-3 py-2" placeholder="Autor *"
          value={form.autor} onChange={(e) => setForm({ ...form, autor: e.target.value })} required />
        <input className="border rounded-lg px-3 py-2" placeholder="Título *"
          value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <input className="border rounded-lg px-3 py-2" placeholder="Año" type="number"
          value={form.anio} onChange={(e) => setForm({ ...form, anio: e.target.value })} />
        <input className="border rounded-lg px-3 py-2" placeholder="Medidas"
          value={form.medidas} onChange={(e) => setForm({ ...form, medidas: e.target.value })} />
        <input className="border rounded-lg px-3 py-2" placeholder="Técnica"
          value={form.tecnica} onChange={(e) => setForm({ ...form, tecnica: e.target.value })} />
      </div>
      <input className="border rounded-lg px-3 py-2 max-w-xs" placeholder="Precio salida" type="number" step="0.01"
        value={form.precio_salida} onChange={(e) => setForm({ ...form, precio_salida: e.target.value })} />
      <button className="px-4 py-2 rounded-lg bg-black text-white">Crear obra</button>
    </form>
  );
}
