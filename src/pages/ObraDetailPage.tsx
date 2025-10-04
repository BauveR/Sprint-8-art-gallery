import { useParams, useNavigate } from "react-router-dom";
import { useObras } from "../query/obras";
import { useCart } from "../context/CartContext";
import PublicNavbar from "../components/layout/PublicNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function ObraDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 100 });
  const { addToCart, items } = useCart();

  const obra = data?.data.find((o) => o.id_obra === Number(id));

  if (!obra) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
        <PublicNavbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Obra no encontrada</h2>
          <Button onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  const isInCart = items.some((item) => item.obra.id_obra === obra.id_obra);
  const isAvailable = obra.estado_venta === "disponible";

  const handleAddToCart = () => {
    if (isAvailable) {
      addToCart(obra);
      toast.success(`${obra.titulo} agregado al carrito`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón de regreso */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
              <CardContent className="p-0">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src="/piedra-arte-02.svg"
                    alt={obra.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Información */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold">{obra.titulo}</h1>
                <Badge variant={isAvailable ? "default" : "secondary"}>
                  {isAvailable ? "Disponible" : "No disponible"}
                </Badge>
              </div>
              <p className="text-2xl text-muted-foreground">{obra.autor}</p>
            </div>

            <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Detalles</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {obra.anio && (
                    <div>
                      <span className="text-muted-foreground">Año:</span>
                      <p className="font-medium">{obra.anio}</p>
                    </div>
                  )}
                  {obra.tecnica && (
                    <div>
                      <span className="text-muted-foreground">Técnica:</span>
                      <p className="font-medium">{obra.tecnica}</p>
                    </div>
                  )}
                  {obra.medidas && (
                    <div>
                      <span className="text-muted-foreground">Medidas:</span>
                      <p className="font-medium">{obra.medidas}</p>
                    </div>
                  )}
                  {obra.ubicacion && (
                    <div>
                      <span className="text-muted-foreground">Ubicación:</span>
                      <p className="font-medium capitalize">
                        {obra.ubicacion === "en_exposicion" && "En exposición"}
                        {obra.ubicacion === "en_tienda" && "En tienda"}
                        {obra.ubicacion === "almacen" && "Almacén"}
                      </p>
                    </div>
                  )}
                  {obra.tienda_nombre && (
                    <div>
                      <span className="text-muted-foreground">Tienda:</span>
                      <p className="font-medium">{obra.tienda_nombre}</p>
                    </div>
                  )}
                  {obra.expo_nombre && (
                    <div>
                      <span className="text-muted-foreground">Exposición:</span>
                      <p className="font-medium">{obra.expo_nombre}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Precio y acciones */}
            <div className="space-y-4">
              <div className="border-t pt-4">
                <p className="text-3xl font-bold text-primary">
                  ${obra.precio_salida?.toLocaleString("es-ES") ?? "N/A"}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!isAvailable || isInCart}
                >
                  {isInCart ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      En el carrito
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {isAvailable ? "Agregar al carrito" : "No disponible"}
                    </>
                  )}
                </Button>

                {isInCart && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/cart")}
                  >
                    Ver carrito
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
