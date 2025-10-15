import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardElement } from "@stripe/react-stripe-js";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "hsl(var(--foreground))",
      "::placeholder": {
        color: "hsl(var(--muted-foreground))",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default function PaymentForm() {
  return (
    <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
      <CardHeader>
        <CardTitle>Información de Pago</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tarjeta de crédito o débito</label>
          <div className="border rounded-md p-3 bg-background">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-3 rounded-lg text-sm">
          <strong>Modo test:</strong> Usa la tarjeta 4242 4242 4242 4242 con cualquier fecha futura y CVV.
        </div>
      </CardContent>
    </Card>
  );
}
