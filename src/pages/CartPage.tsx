import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
        <PublicNavbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">Agrega obras a tu carrito para continuar</p>
          <Button onClick={() => navigate("/shop")}>
            Ir a la Tienda
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Carrito de Compras</h1>
              <Button variant="outline" size="sm" onClick={clearCart}>
                Vaciar carrito
              </Button>
            </div>

            {items.map((item) => (
              <Card key={item.obra.id_obra} className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.obra.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{item.obra.autor}</p>
                      {item.obra.tecnica && (
                        <p className="text-sm text-muted-foreground">{item.obra.tecnica}</p>
                      )}
                      <p className="text-primary font-bold mt-2">
                        ${item.obra.precio_salida?.toLocaleString("es-ES")}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.obra.id_obra)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.obra.id_obra, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.obra.id_obra, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Resumen del pedido</h2>

                <div className="space-y-2 border-b pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalPrice.toLocaleString("es-ES")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span>Gratis</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toLocaleString("es-ES")}</span>
                </div>

                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  {isAuthenticated ? "Proceder al pago" : "Iniciar sesión para comprar"}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/shop")}
                >
                  Seguir comprando
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
