import { useEffect, useState } from "react";
import { Api, Tienda, Expo } from "../api";

export default function VincularTiendaExpo({ idObra, onChanged }: { idObra: number; onChanged: () => void }) {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [expos, setExpos] = useState<Expo[]>([]);
  const [idTienda, setIdTienda] = useState<number | "">("");
  const [idExpo, setIdExpo] = useState<number | "">("");

  useEffect(() => {
    (async () => {
      setTiendas(await Api.listTiendas());
      setExpos(await Api.listExpos());
    })();
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      <select className="border rounded px-2 py-1" value={idTienda} onChange={(e) => setIdTienda(e.target.value ? Number(e.target.value) : "")}>
        <option value="">— Tienda —</option>
        {tiendas.map(t => <option key={t.id_tienda} value={t.id_tienda}>{t.nombre}</option>)}
      </select>
      <button
        className="px-3 py-1 rounded bg-gray-900 text-white disabled:opacity-50"
        disabled={idTienda === ""}
        onClick={async () => { await Api.asignarTienda(idObra, Number(idTienda)); setIdTienda(""); onChanged(); }}
      >Asignar tienda</button>

      <button
        className="px-3 py-1 rounded bg-gray-200"
        onClick={async () => { await Api.sacarTienda(idObra); onChanged(); }}
      >Sacar de tienda</button>

      <select className="border rounded px-2 py-1" value={idExpo} onChange={(e) => setIdExpo(e.target.value ? Number(e.target.value) : "")}>
        <option value="">— Expo —</option>
        {expos.map(x => <option key={x.id_expo} value={x.id_expo}>{x.nombre}</option>)}
      </select>
      <button
        className="px-3 py-1 rounded bg-blue-700 text-white disabled:opacity-50"
        disabled={idExpo === ""}
        onClick={async () => { await Api.asignarExpo(idObra, Number(idExpo)); setIdExpo(""); onChanged(); }}
      >Asignar expo</button>

      <button
        className="px-3 py-1 rounded bg-blue-200"
        onClick={async () => { if (idExpo !== "") { await Api.quitarExpo(idObra, Number(idExpo)); setIdExpo(""); onChanged(); } }}
      >Quitar de expo</button>
    </div>
  );
}
