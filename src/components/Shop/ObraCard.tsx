import ObraImage from "../common/ObraImage";
import { formatPrice } from "../../utils/formatters";
import { Obra } from "../../types";

interface ObraCardProps {
  obra: Obra;
  onViewDetails: () => void;
}

export default function ObraCard({ obra, onViewDetails }: ObraCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onViewDetails}>
      {/* Imagen */}
      <div className="aspect-[3/4] overflow-hidden mb-4">
        <ObraImage
          obraId={obra.id_obra}
          alt={obra.titulo}
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
        />
      </div>

      {/* Información del producto */}
      <div className="space-y-1 px-1">
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm tracking-wide uppercase text-white">
            {obra.titulo}
          </h3>
          <p className="text-xs text-white font-bold tracking-wide">{obra.autor}</p>
        </div>

        {obra.tecnica && (
          <p className="text-xs text-white/80 font-bold tracking-wide">{obra.tecnica}</p>
        )}

        <div className="pt-1">
          <p className="text-base font-bold tracking-wide text-white">
            ${formatPrice(obra.precio_salida)}
          </p>
        </div>
      </div>
    </div>
  );
}
