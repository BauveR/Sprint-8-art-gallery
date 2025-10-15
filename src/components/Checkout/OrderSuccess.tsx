import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-6 animate-in fade-in zoom-in duration-500">
        <CheckCircle className="h-32 w-32 mx-auto text-green-500 mb-6 drop-shadow-lg" />
      </div>

      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
        ¡Compra exitosa!
      </h1>

      <p className="text-lg text-muted-foreground mb-3">
        Tu pedido ha sido procesado correctamente.
      </p>

      <p className="text-sm text-muted-foreground mb-8">
        Recibirás un correo de confirmación en breve con los detalles de tu compra.
      </p>

      <Card className="max-w-md mx-auto mb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
        <CardContent className="pt-6">
          <p className="text-sm font-medium mb-2">
            💡 Puedes seguir el estado de tu pedido
          </p>
          <p className="text-xs text-muted-foreground">
            Revisa "Mis Compras" para ver actualizaciones sobre tu envío
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => navigate("/my-orders")} size="lg" className="text-base px-8">
          📦 Ver mis compras
        </Button>
        <Button onClick={() => navigate("/")} variant="outline" size="lg" className="text-base">
          Volver al inicio
        </Button>
      </div>
    </div>
  );
}
