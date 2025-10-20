import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "hsl(var(--foreground))",
      fontFamily: 'system-ui, -apple-system, sans-serif',
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
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardBrand, setCardBrand] = useState<string>("");

  const handleCardChange = (event: any) => {
    setCardError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
    setCardBrand(event.brand || "");
  };

  const getBrandDisplay = (brand: string) => {
    const brands: { [key: string]: string } = {
      visa: "Visa",
      mastercard: "Mastercard",
      amex: "American Express",
      discover: "Discover",
      diners: "Diners Club",
      jcb: "JCB",
      unionpay: "UnionPay",
    };
    return brands[brand] || "";
  };

  return (
    <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Información de Pago</span>
          {cardComplete && (
            <span className="flex items-center text-green-600 dark:text-green-400 text-sm font-normal">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Tarjeta válida
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Tarjeta de crédito o débito *
            {cardBrand && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({getBrandDisplay(cardBrand)})
              </span>
            )}
          </label>
          <div className={`border rounded-md p-3 bg-background transition-colors ${
            cardError
              ? "border-red-500 bg-red-50 dark:bg-red-900/10"
              : cardComplete
              ? "border-green-500 bg-green-50 dark:bg-green-900/10"
              : "border-input"
          }`}>
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleCardChange}
            />
          </div>
          {cardError && (
            <div className="flex items-center mt-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {cardError}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-3 rounded-lg text-sm">
            <strong>Modo test:</strong> Usa la tarjeta 4242 4242 4242 4242 con cualquier fecha futura y CVV.
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-xs space-y-1">
            <p className="font-medium">Tarjetas de prueba adicionales:</p>
            <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
              <li>Visa: 4242 4242 4242 4242</li>
              <li>Mastercard: 5555 5555 5555 4444</li>
              <li>Amex: 3782 822463 10005</li>
              <li>Rechazada: 4000 0000 0000 0002</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
