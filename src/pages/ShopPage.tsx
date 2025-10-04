import { useState, useMemo } from "react";
import { useObras } from "../query/obras";
import { useCart } from "../context/CartContext";
import PublicNavbar from "../components/layout/PublicNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Check } from "lucide-react";
import { toast } from "sonner";

export default function ShopPage() {
  const { data, isLoading } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 100 });
  const { addToCart, items } = useCart();
  const [searchQuery, setSearchQuery] = useState("");

  const obras = data?.data ?? [];

  // Filtrar solo obras disponibles
  const availableObras = useMemo(() => {
    const filtered = obras.filter((obra) => obra.estado_venta === "disponible");

    if (!searchQuery.trim()) return filtered;

    const query = searchQuery.toLowerCase();
    return filtered.filter(
      (obra) =>
        obra.autor?.toLowerCase().includes(query) ||
        obra.titulo?.toLowerCase().includes(query) ||
        obra.tecnica?.toLowerCase().includes(query)
    );
  }, [obras, searchQuery]);

  const handleAddToCart = (obra: any) => {
    addToCart(obra);
    toast.success(`${obra.titulo} agregado al carrito`);
  };

  const isInCart = (obraId: number) => {
    return items.some((item) => item.obra.id_obra === obraId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <PublicNavbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold">Tienda de Arte</h1>
          <p className="text-muted-foreground">
            Explora nuestra colección de obras disponibles
          </p>

          {/* Buscador */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por autor, título o técnica..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Grid de obras */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando obras...</p>
          </div>
        ) : availableObras.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "No se encontraron obras con ese criterio" : "No hay obras disponibles"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableObras.map((obra) => (
              <Card
                key={obra.id_obra}
                className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{obra.titulo}</CardTitle>
                      <CardDescription className="truncate">{obra.autor}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      Disponible
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1 text-sm">
                    {obra.anio && (
                      <p className="text-muted-foreground">Año: {obra.anio}</p>
                    )}
                    {obra.tecnica && (
                      <p className="text-muted-foreground">Técnica: {obra.tecnica}</p>
                    )}
                    {obra.medidas && (
                      <p className="text-muted-foreground">Medidas: {obra.medidas}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-2xl font-bold text-primary">
                      ${obra.precio_salida?.toLocaleString("es-ES") ?? "N/A"}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(obra)}
                    disabled={isInCart(obra.id_obra)}
                  >
                    {isInCart(obra.id_obra) ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        En el carrito
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Agregar al carrito
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
