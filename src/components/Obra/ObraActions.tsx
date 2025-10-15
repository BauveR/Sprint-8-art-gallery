import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check } from "lucide-react";
import { formatPrice } from "../../lib/formatters";
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
        <Badge variant="outline" className="text-lg px-4 py-2">
          Obra en exposición - No disponible para venta
        </Badge>
      </div>
    );
  }

  // Precio y acciones para obras disponibles
  return (
    <div className="space-y-4">
      <div className="border-t pt-4">
        <p className="text-3xl font-bold text-primary">${formatPrice(obra.precio_salida)}</p>
      </div>

      <div className="flex gap-3">
        <Button
          className="flex-1"
          onClick={onAddToCart}
          disabled={!canPurchase || isInCart}
        >
          {isInCart ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              En el carrito
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              {canPurchase ? "Agregar al carrito" : "No disponible"}
            </>
          )}
        </Button>

        {isInCart && (
          <Button variant="outline" onClick={() => navigate("/cart")}>
            Ver carrito
          </Button>
        )}
      </div>
    </div>
  );
}
