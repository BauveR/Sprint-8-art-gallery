import { useEffect, useState } from "react";
import { Api, type Obra } from "./api";
import ObraForm from "./components/ObraForm";
import ObrasList from "./components/ObraList";

export default function App() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setObras(await Api.listObras());
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Galería — Obras</h1>
      <ObraForm onCreated={load} />

      {loading ? <div>Cargando…</div> : error ? <div className="text-red-600">{error}</div> : <ObrasList data={obras} reload={load} />}
    </div>
  );
}
