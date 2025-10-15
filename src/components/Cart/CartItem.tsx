import ObraImage from "../common/ObraImage";
import { formatPrice } from "../../lib/formatters";
import { Trash2, Plus, Minus } from "lucide-react";
import { Obra } from "../../types";

interface CartItemProps {
  obra: Obra;
  quantity: number;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ obra, quantity, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-6 pb-8 border-b border-foreground/5">
      {/* Imagen */}
      <div className="w-32 h-40 flex-shrink-0 bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <ObraImage obraId={obra.id_obra} alt={obra.titulo} className="w-full h-full object-cover" />
      </div>

      {/* Información */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-medium text-lg tracking-wide uppercase">{obra.titulo}</h3>
          <p className="text-sm text-muted-foreground tracking-wide">{obra.autor}</p>
          {obra.tecnica && (
            <p className="text-xs text-muted-foreground/70 tracking-wide">{obra.tecnica}</p>
          )}
        </div>

        <div className="flex items-end justify-between mt-4">
          <p className="text-lg font-light tracking-wide">${formatPrice(obra.precio_salida)}</p>

          <div className="flex items-center gap-6">
            {/* Cantidad */}
            <div className="flex items-center gap-3 border border-foreground/20 px-3 py-2">
              <button
                onClick={() => onUpdateQuantity(obra.id_obra, quantity - 1)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center text-sm">{quantity}</span>
              <button
                onClick={() => onUpdateQuantity(obra.id_obra, quantity + 1)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            {/* Eliminar */}
            <button
              onClick={() => onRemove(obra.id_obra)}
              className="text-muted-foreground hover:text-foreground"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
