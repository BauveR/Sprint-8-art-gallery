import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { formatPrice } from "../../utils/formatters";
import { ObraActionsProps } from "../../types/components";

export default function ObraActions({
  obra,
  isInCart,
  isAvailable,
  isInExhibition,
  canPurchase,
  onAddToCart,
}: ObraActionsProps) {
  const navigate = useNavigate();

  // Mensaje para obras en exposición
  if (isInExhibition) {
    return (
      <div className="border-t pt-4">
        <a
          href="mailto:jesus.velazquez.bau500@gmail.com?subject=Consulta sobre obra en exposición"
        >
          <Button
            variant="glass"
            className="text-xl md:text-3xl px-16 md:px-10 py-3 md:py-2 border-0 mb-0 w-full"
            style={{ backgroundColor: '#8FDF00' }}
          >
            Disponible para colecciones
          </Button>
        </a>
      </div>
    );
  }

  // Precio y acciones para obras disponibles
  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        <p className="text-3xl font-bold text-primary">${formatPrice(obra.precio_salida)}</p>
      </div>

      <div className="flex flex-col gap-3">
        <Button
          variant="glass"
          className="text-xl md:text-3xl px-16 md:px-10 py-3 md:py-2 border-0 mb-0 w-full"
          style={{ backgroundColor: '#8FDF00' }}
          onClick={onAddToCart}
          disabled={!canPurchase || isInCart}
        >
          {isInCart ? (
            <>
              <Check className="h-6 w-6 md:h-5 md:w-5 mr-2" />
              En el carrito
            </>
          ) : (
            <>
              <ShoppingCart className="h-6 w-6 md:h-5 md:w-5 mr-2" />
              {canPurchase ? "Agregar al carrito" : "No disponible"}
            </>
          )}
        </Button>

        {isInCart && (
          <Button
            variant="glass"
            className="text-xl md:text-3xl px-16 md:px-10 py-3 md:py-2 border-0 mb-0 w-full"
            style={{ backgroundColor: '#8FDF00' }}
            onClick={() => navigate("/cart")}
          >
            Ver carrito
          </Button>
        )}
      </div>
    </div>
  );
}
