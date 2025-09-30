import { useEffect, useState } from "react";
import { crearObra, fetchObras, type Obra } from "./api";

export default function App() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [autor, setAutor] = useState("");
  const [titulo, setTitulo] = useState("");
  const [anio, setAnio] = useState<number | "">("");
  const [medidas, setMedidas] = useState("");
  const [tecnica, setTecnica] = useState("");
  const [precio, setPrecio] = useState<number | "">("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchObras();
        setObras(data);
      } catch (e: any) {
        setError(e?.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await crearObra({
        autor: autor.trim(),
        titulo: titulo.trim(),
        anio: anio === "" ? null : Number(anio),
        medidas: medidas.trim() || null,
        tecnica: tecnica.trim() || null,
        precio_salida: precio === "" ? null : Number(precio),
      });
      // refrescar lista
      const data = await fetchObras();
      setObras(data);

      // limpiar form
      setAutor("");
      setTitulo("");
      setAnio("");
      setMedidas("");
      setTecnica("");
      setPrecio("");
      alert(`Obra creada con id ${res.id_obra}`);
    } catch (e: any) {
      alert(e?.message ?? "Error al crear");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Galería — Obras</h1>

      {/* FORM NUEVA OBRA */}
      <form onSubmit={onSubmit} className="grid gap-3 p-4 border rounded-xl">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Autor *</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              required
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Título *</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </label>
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Año</span>
            <input
              className="border rounded-lg px-3 py-2"
              type="number"
              value={anio}
              onChange={(e) => setAnio(e.target.value === "" ? "" : Number(e.target.value))}
              min={0}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Medidas</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={medidas}
              onChange={(e) => setMedidas(e.target.value)}
              placeholder="60x80 cm"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Técnica</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={tecnica}
              onChange={(e) => setTecnica(e.target.value)}
              placeholder="Óleo"
            />
          </label>
        </div>
        <label className="grid gap-1 max-w-xs">
          <span className="text-sm text-gray-600">Precio de salida</span>
          <input
            className="border rounded-lg px-3 py-2"
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value === "" ? "" : Number(e.target.value))}
            min={0}
          />
        </label>
        <div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-85"
          >
            Crear obra
          </button>
        </div>
      </form>

      {/* LISTA */}
      {loading ? (
        <div>Cargando…</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : (
        <ul className="space-y-3">
          {obras.map((o) => (
            <li key={o.id_obra} className="p-4 border rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-lg">{o.titulo}</div>
                  <div className="text-sm text-gray-600">{o.autor}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-gray-100">
                  {o.disponibilidad}
                </span>
              </div>
              <div className="mt-2 text-sm">
                {o.disponibilidad === "en_tienda" && o.tienda_nombre ? (
                  <a className="text-blue-600 underline" href={o.tienda_url ?? "#"} target="_blank">
                    En tienda: {o.tienda_nombre}
                  </a>
                ) : o.disponibilidad === "en_exposicion" && o.expo_nombre ? (
                  <a className="text-blue-600 underline" href={o.expo_url ?? "#"} target="_blank">
                    En exposición: {o.expo_nombre}
                  </a>
                ) : (
                  "Almacén"
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
