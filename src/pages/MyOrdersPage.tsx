import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../query/orders";
import { formatPrice } from "../lib/formatters";
import { ESTADO_CONFIG } from "../lib/estadoConfig";
import PublicLayout from "../components/layout/PublicLayout";
import ObraImage from "../components/common/ObraImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, ExternalLink } from "lucide-react";

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
          <Button
            onClick={() => navigate("/login")}
            className="px-8 py-6 text-base"
          >
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
            <h2 className="text-3xl font-light tracking-wide mb-4">
              No tienes compras aún
            </h2>
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
            {orders.map((order) => {
              const estadoConfig = ESTADO_CONFIG[order.estado_venta];
              const Icon = estadoConfig.icon;
              const showTracking = order.estado_venta === "enviado" || order.estado_venta === "entregado";

              return (
                <Card
                  key={order.id_obra}
                  className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
                      {/* Imagen */}
                      <div
                        className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer"
                        onClick={() => navigate(`/obra/${order.id_obra}`)}
                      >
                        <ObraImage
                          obraId={order.id_obra}
                          alt={order.titulo}
                          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                      </div>

                      {/* Información */}
                      <div className="flex flex-col justify-between">
                        <div className="space-y-4">
                          {/* Título y Autor */}
                          <div>
                            <h3
                              className="text-2xl font-medium tracking-wide uppercase cursor-pointer hover:text-primary transition-colors"
                              onClick={() => navigate(`/obra/${order.id_obra}`)}
                            >
                              {order.titulo}
                            </h3>
                            <p className="text-muted-foreground tracking-wide mt-1">
                              {order.autor}
                            </p>
                          </div>

                          {/* Estado */}
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${estadoConfig.iconColor}`} />
                            <Badge className={`text-sm font-medium border ${estadoConfig.badgeClass}`}>
                              {estadoConfig.label}
                            </Badge>
                          </div>

                          {/* Tracking Info */}
                          {showTracking && order.numero_seguimiento && (
                            <div className={`${estadoConfig.bgColor} border ${estadoConfig.badgeClass.split(' ').find(c => c.includes('border-'))} rounded-lg p-4 space-y-2`}>
                              <p className={`text-sm font-medium ${estadoConfig.iconColor}`}>
                                Información de Envío
                              </p>
                              <div className={`flex items-center gap-2 text-sm ${estadoConfig.iconColor}`}>
                                <span className="font-mono">{order.numero_seguimiento}</span>
                              </div>
                              {order.link_seguimiento && (
                                <a
                                  href={order.link_seguimiento}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`inline-flex items-center gap-2 text-sm ${estadoConfig.iconColor} hover:underline`}
                                >
                                  Rastrear paquete
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Fecha de compra */}
                          {order.fecha_compra && (
                            <p className="text-sm text-muted-foreground">
                              Comprado el{" "}
                              {new Date(order.fecha_compra).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          )}
                        </div>

                        {/* Precio */}
                        <div className="mt-4 pt-4 border-t border-foreground/10">
                          <p className="text-2xl font-light tracking-wide">
                            ${formatPrice(order.precio_salida)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
