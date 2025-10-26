import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import ObraImage from "../common/ObraImage";
import { formatPrice } from "../../utils/formatters";
import { useIsInCart } from "../../hooks/useIsInCart";
import { ObraCardProps } from "../../types/components";

export default function ObraCard({ obra, onAddToCart, onViewDetails }: ObraCardProps) {
  const isInCart = useIsInCart(obra.id_obra);

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
        {/* Título y Autor */}
        <div className="space-y-0.5">
          <h3 className="font-bold text-sm tracking-wide uppercase text-white">
            {obra.titulo}
          </h3>
          <p className="text-xs text-white font-bold tracking-wide">{obra.autor}</p>
        </div>

        {/* Técnica si existe */}
        {obra.tecnica && (
          <p className="text-xs text-white/80 font-bold tracking-wide">{obra.tecnica}</p>
        )}

        {/* Precio */}
        <div className="pt-1">
          <p className="text-base font-bold tracking-wide text-white">
            ${formatPrice(obra.precio_salida)}
          </p>
        </div>

        {/* Botón de agregar al carrito */}
        <div className="pt-2">
          <Button
            className="w-full font-bold transition-colors duration-300"
            style={{ backgroundColor: '#8ADA00', color: '#191E2C' }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(obra);
            }}
            disabled={isInCart}
          >
            {isInCart ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                En el carrito
              </>
            ) : (
              "Agregar al carrito"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
