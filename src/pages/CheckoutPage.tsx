import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    nombre: user?.name || "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    telefono: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulación de procesamiento de pago
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
      toast.success("¡Compra realizada con éxito!");

      // Redirigir al home después de 3 segundos
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }, 2000);
  };

  if (items.length === 0 && !orderComplete) {
    navigate("/cart");
    return null;
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
        <PublicNavbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <CheckCircle className="h-24 w-24 mx-auto text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">¡Compra exitosa!</h1>
          <p className="text-muted-foreground mb-6">
            Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación pronto.
          </p>
          <Button onClick={() => navigate("/")}>
            Volver al inicio
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <PublicNavbar />

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
                    <label className="block text-sm font-medium mb-2">Número de tarjeta</label>
                    <Input
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      maxLength={19}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Fecha de expiración</label>
                      <Input
                        name="cardExpiry"
                        placeholder="MM/AA"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <Input
                        name="cardCvv"
                        placeholder="123"
                        value={formData.cardCvv}
                        onChange={handleChange}
                        maxLength={4}
                        type="password"
                        required
                      />
                    </div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg text-sm">
                    <strong>Nota:</strong> Este es un sistema de demostración. No se procesarán pagos reales.
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
                          ${((item.obra.precio_salida ?? 0) * item.quantity).toLocaleString("es-ES")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${totalPrice.toLocaleString("es-ES")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Envío</span>
                      <span>Gratis</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">${totalPrice.toLocaleString("es-ES")}</span>
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

      <Footer />
    </div>
  );
}
