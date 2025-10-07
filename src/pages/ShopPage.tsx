import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useObras } from "../query/obras";
import { useCart } from "../context/CartContext";
import { useIsInCart } from "../hooks/useIsInCart";
import { formatPrice } from "../lib/formatters";
import PublicLayout from "../components/layout/PublicLayout";
import ObraImage from "../components/common/ObraImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search, Check } from "lucide-react";
import { toast } from "sonner";

export default function ShopPage() {
  const { data, isLoading } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 100 });
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const obras = data?.data ?? [];

  // Filtrar solo obras disponibles en tienda
  const availableObras = useMemo(() => {
    const filtered = obras.filter(
      (obra) => obra.estado_venta === "disponible" && obra.ubicacion === "en_tienda"
    );

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

  return (
    <PublicLayout>
      <div className="max-w-[1600px] mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-16 space-y-6 max-w-3xl">
          <h1 className="text-5xl font-light tracking-wide">Colección de Arte</h1>
          <p className="text-muted-foreground text-lg tracking-wide">
            Explora nuestra selección exclusiva de obras disponibles
          </p>

          {/* Buscador */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por autor, título o técnica..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 border-foreground/10 focus:border-foreground/30 rounded-none"
            />
          </div>
        </div>

        {/* Grid de obras */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg tracking-wide">Cargando obras...</p>
          </div>
        ) : availableObras.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg tracking-wide">
              {searchQuery ? "No se encontraron obras con ese criterio" : "No hay obras disponibles"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {availableObras.map((obra) => (
              <ObraCard
                key={obra.id_obra}
                obra={obra}
                onAddToCart={handleAddToCart}
                onViewDetails={() => navigate(`/obra/${obra.id_obra}`)}
              />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

function ObraCard({ obra, onAddToCart, onViewDetails }: { obra: any; onAddToCart: (obra: any) => void; onViewDetails: () => void }) {
  const isInCart = useIsInCart(obra.id_obra);

  return (
    <div className="group cursor-pointer" onClick={onViewDetails}>
      {/* Imagen */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
        <ObraImage
          obraId={obra.id_obra}
          alt={obra.titulo}
          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
        />
      </div>

      {/* Información del producto */}
      <div className="space-y-2 px-1">
        {/* Título y Autor */}
        <div className="space-y-1">
          <h3 className="font-medium text-base tracking-wide uppercase text-foreground/90">
            {obra.titulo}
          </h3>
          <p className="text-sm text-muted-foreground tracking-wide">
            {obra.autor}
          </p>
        </div>

        {/* Técnica si existe */}
        {obra.tecnica && (
          <p className="text-xs text-muted-foreground/70 tracking-wide">
            {obra.tecnica}
          </p>
        )}

        {/* Precio */}
        <div className="pt-2">
          <p className="text-lg font-light tracking-wide text-foreground">
            ${formatPrice(obra.precio_salida)}
          </p>
        </div>

        {/* Botón de agregar al carrito */}
        <div className="pt-3">
          <Button
            variant="outline"
            className="w-full border-foreground/20 hover:bg-foreground hover:text-background transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(obra);
            }}
            disabled={isInCart}
          >
            {isInCart ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                En el carrito
              </>
            ) : (
              "Agregar al carrito"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
