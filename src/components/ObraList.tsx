import { Obra, Api } from "../api";
import VincularTiendaExpo from "./VincularTiendaExpo";

export default function ObrasList({ data, reload }: { data: Obra[]; reload: () => void }) {
  return (
    <ul className="space-y-3">
      {data.map((o) => (
        <li key={o.id_obra} className="p-4 border rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-lg">{o.titulo}</div>
              <div className="text-sm text-gray-600">{o.autor} {o.anio ? `· ${o.anio}` : ""}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded bg-gray-100">{o.disponibilidad}</span>
              <button className="text-red-700 text-sm"
                onClick={async () => { if (confirm("¿Eliminar obra?")) { await Api.deleteObra(o.id_obra); reload(); } }}
              >Eliminar</button>
            </div>
          </div>
          <div className="text-sm">
            {o.disponibilidad === "en_tienda" && o.tienda_nombre ? (
              <a className="text-blue-600 underline" href={o.tienda_url ?? "#"} target="_blank">En tienda: {o.tienda_nombre}</a>
            ) : o.disponibilidad === "en_exposicion" && o.expo_nombre ? (
              <a className="text-blue-600 underline" href={o.expo_url ?? "#"} target="_blank">En exposición: {o.expo_nombre}</a>
            ) : ("Almacén")}
          </div>

          <VincularTiendaExpo idObra={o.id_obra} onChanged={reload} />
        </li>
      ))}
    </ul>
  );
}
