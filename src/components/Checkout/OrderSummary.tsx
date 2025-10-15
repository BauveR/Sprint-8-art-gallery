import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "../../lib/formatters";
import { useCart } from "../../context/CartContext";
import { OrderSummaryProps } from "../../types/components";

export default function OrderSummary({ isProcessing, onSubmit }: OrderSummaryProps) {
  const { items, totalPrice } = useCart();

  return (
    <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 sticky top-24">
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.obra.id_obra} className="flex justify-between text-sm">
              <span className="truncate mr-2">
                {item.obra.titulo} x{item.quantity}
              </span>
              <span className="font-medium">
                ${formatPrice((Number(item.obra.precio_salida) || 0) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Envío</span>
            <span>Gratis</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-primary">${formatPrice(totalPrice)}</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={onSubmit}
          className="w-full"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? "Procesando..." : "Confirmar Compra"}
        </Button>
      </CardContent>
    </Card>
  );
}
