import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/formatters";
import PublicLayout from "../components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe";
import { api } from "../lib/api";
import { sendPaymentConfirmation } from "../lib/emailjs";

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

function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.name || "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Crear Payment Intent en el backend
      const paymentData = await api.post<{
        clientSecret: string;
        paymentIntentId: string;
        amount: number;
      }>("/payments/create-payment-intent", {
        items: items.map((item) => ({
          id_obra: item.obra.id_obra,
          titulo: item.obra.titulo,
          precio: item.obra.precio_salida,
        })),
      });

      // 2. Confirmar pago con Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.nombre,
              address: {
                line1: formData.direccion,
                city: formData.ciudad,
                postal_code: formData.codigoPostal,
              },
              phone: formData.telefono,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        // 3. Confirmar en el backend y actualizar estado de obras
        await api.post("/payments/confirm", {
          paymentIntentId: paymentData.paymentIntentId,
          obra_ids: items.map((item) => item.obra.id_obra),
          buyer_name: formData.nombre,
          buyer_email: user?.email || "",
        });

        // 4. Enviar email de confirmación de pago
        if (user?.email) {
          try {
            await sendPaymentConfirmation({
              to_email: user.email,
              to_name: formData.nombre,
              order_id: paymentData.paymentIntentId,
              total_amount: totalPrice,
              items: items.map((item) => ({
                titulo: item.obra.titulo,
                precio: Number(item.obra.precio_salida) || 0,
              })),
            });
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
            // No mostrar error al usuario, el pago fue exitoso
          }
        }

        setIsProcessing(false);
        setOrderComplete(true);
        clearCart();
        toast.success("¡Compra realizada con éxito!");

        // Redirigir al home después de 3 segundos
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast.error(error.message || "Error al procesar el pago");
      console.error("Payment error:", error);
    }
  };

  if (items.length === 0 && !orderComplete) {
    navigate("/cart");
    return null;
  }

  if (orderComplete) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <CheckCircle className="h-24 w-24 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">¡Compra exitosa!</h1>
          <p className="text-muted-foreground mb-6">
            Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación pronto.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/my-orders")} variant="default">
              Ver mis compras
            </Button>
            <Button onClick={() => navigate("/")} variant="outline">
              Volver al inicio
            </Button>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información de envío */}
              <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
                <CardHeader>
                  <CardTitle>Información de Envío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre completo</label>
                    <Input
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Dirección</label>
                    <Input
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ciudad</label>
                      <Input
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Código Postal</label>
                      <Input
                        name="codigoPostal"
                        value={formData.codigoPostal}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono</label>
                    <Input
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Información de pago */}
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
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
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
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Procesando..." : "Confirmar Compra"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
