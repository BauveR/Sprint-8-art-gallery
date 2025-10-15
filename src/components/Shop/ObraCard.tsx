import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import ObraImage from "../common/ObraImage";
import { formatPrice } from "../../lib/formatters";
import { useIsInCart } from "../../hooks/useIsInCart";
import { ObraCardProps } from "../../types/components";

export default function ObraCard({ obra, onAddToCart, onViewDetails }: ObraCardProps) {
  const isInCart = useIsInCart(obra.id_obra);

  return (
    <div className="group cursor-pointer" onClick={onViewDetails}>
      {/* Imagen */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
        <ObraImage
          obraId={obra.id_obra}
          alt={obra.titulo}
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
        />
      </div>

      {/* Información del producto */}
      <div className="space-y-2 px-1">
        {/* Título y Autor */}
        <div className="space-y-1">
          <h3 className="font-medium text-base tracking-wide uppercase text-foreground/90">
            {obra.titulo}
          </h3>
          <p className="text-sm text-muted-foreground tracking-wide">{obra.autor}</p>
        </div>

        {/* Técnica si existe */}
        {obra.tecnica && (
          <p className="text-xs text-muted-foreground/70 tracking-wide">{obra.tecnica}</p>
        )}

        {/* Precio */}
        <div className="pt-2">
          <p className="text-lg font-light tracking-wide text-foreground">
            ${formatPrice(obra.precio_salida)}
          </p>
        </div>

        {/* Botón de agregar al carrito */}
        <div className="pt-3">
          <Button
            variant="outline"
            className="w-full border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300"
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
