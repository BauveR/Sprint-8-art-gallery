import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextFirebase";
import { useOrders } from "../query/orders";
import PublicLayout from "../components/layout/PublicLayout";
import OrderCard from "../components/Orders/OrderCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export default function MyOrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { data: orders = [], isLoading } = useOrders(user?.email);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <PublicLayout>
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground/30 mb-8" />
          <h2 className="text-3xl font-light tracking-wide mb-4">Acceso Restringido</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Inicia sesión para ver tus compras
          </p>
          <Button onClick={() => navigate("/login")} className="px-8 py-6 text-base">
            Iniciar Sesión
          </Button>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="max-w-[1200px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-light tracking-wide mb-4">Mis Compras</h1>
          <p className="text-muted-foreground text-lg tracking-wide">
            Rastrea el estado de tus pedidos
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg tracking-wide">Cargando compras...</p>
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <ShoppingBag className="h-32 w-32 mx-auto text-muted-foreground/30 mb-8 stroke-[0.5]" />
            <h2 className="text-3xl font-light tracking-wide mb-4">No tienes compras aún</h2>
            <p className="text-muted-foreground mb-10 text-lg tracking-wide">
              Explora nuestra colección y encuentra tu próxima obra de arte
            </p>
            <Button
              onClick={() => navigate("/shop")}
              variant="outline"
              className="px-8 py-6 text-base border-foreground/20 hover:bg-foreground hover:text-background rounded-none tracking-wide"
            >
              Explorar la colección
            </Button>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id_obra} order={order} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
