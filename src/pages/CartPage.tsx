import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextFirebase";
import { formatPrice } from "../lib/formatters";
import PublicLayout from "../components/layout/PublicLayout";
import ObraImage from "../components/common/ObraImage";
import { Button } from "@/components/ui/button";
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
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-8 py-24 text-center">
          <ShoppingBag className="h-32 w-32 mx-auto text-muted-foreground/30 mb-8 stroke-[0.5]" />
          <h2 className="text-3xl font-light tracking-wide mb-4">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-10 text-lg tracking-wide">Descubre nuestra colección de obras de arte</p>
          <Button
            onClick={() => navigate("/shop")}
            variant="outline"
            className="px-8 py-6 text-base border-foreground/20 hover:bg-foreground hover:text-background rounded-none tracking-wide"
          >
            Explorar la colección
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Lista de items */}
          <div className="space-y-8">
            <div className="flex items-center justify-between pb-8 border-b border-foreground/10">
              <h1 className="text-4xl font-light tracking-wide">Mi carrito</h1>
              <button
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-foreground tracking-wide underline underline-offset-4"
              >
                Vaciar carrito
              </button>
            </div>

            <div className="space-y-8">
              {items.map((item) => (
                <div
                  key={item.obra.id_obra}
                  className="flex gap-6 pb-8 border-b border-foreground/5"
                >
                  {/* Imagen */}
                  <div className="w-32 h-40 flex-shrink-0 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <ObraImage
                      obraId={item.obra.id_obra}
                      alt={item.obra.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Información */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-medium text-lg tracking-wide uppercase">
                        {item.obra.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground tracking-wide">
                        {item.obra.autor}
                      </p>
                      {item.obra.tecnica && (
                        <p className="text-xs text-muted-foreground/70 tracking-wide">
                          {item.obra.tecnica}
                        </p>
                      )}
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <p className="text-lg font-light tracking-wide">
                        ${formatPrice(item.obra.precio_salida)}
                      </p>

                      <div className="flex items-center gap-6">
                        {/* Cantidad */}
                        <div className="flex items-center gap-3 border border-foreground/20 px-3 py-2">
                          <button
                            onClick={() => updateQuantity(item.obra.id_obra, item.quantity - 1)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.obra.id_obra, item.quantity + 1)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Eliminar */}
                        <button
                          onClick={() => removeFromCart(item.obra.id_obra)}
                          className="text-muted-foreground hover:text-foreground"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="border border-foreground/10 p-8 space-y-6">
              <h2 className="text-2xl font-light tracking-wide">Resumen</h2>

              <div className="space-y-4 py-6 border-y border-foreground/10">
                <div className="flex justify-between text-sm tracking-wide">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm tracking-wide">
                  <span className="text-muted-foreground">Envío</span>
                  <span>Gratis</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-light tracking-wide">
                <span>Total</span>
                <span>${formatPrice(totalPrice)}</span>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-none tracking-wide"
                  onClick={handleCheckout}
                >
                  {isAuthenticated ? "Proceder al pago" : "Iniciar sesión"}
                </Button>

                <button
                  onClick={() => navigate("/shop")}
                  className="w-full text-sm text-muted-foreground hover:text-foreground tracking-wide underline underline-offset-4"
                >
                  Continuar comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
