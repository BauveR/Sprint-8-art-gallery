import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useObras } from "../query/obras";
import { useCart } from "../context/CartContext";
import PublicLayout from "../components/layout/PublicLayout";
import ObraCard from "../components/Shop/ObraCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";

export default function ShopPage() {
  const { data, isLoading } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 100 });
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const obras = data?.data ?? [];

  // Filtrar solo obras disponibles en tienda online
  const availableObras = useMemo(() => {
    const filtered = obras.filter(
      (obra) => obra.estado_venta === "disponible" && obra.ubicacion === "tienda_online"
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
