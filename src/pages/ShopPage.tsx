import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useObras } from "../query/obras";
import { useCart } from "../context/CartContext";
import PublicLayout from "../components/layout/PublicLayout";
import ObraCard from "../components/Shop/ObraCard";

export default function ShopPage() {
  const { data, isLoading } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 100 });
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const obras = data?.data ?? [];

  // Filtrar solo obras disponibles en tienda online
  const availableObras = useMemo(() => {
    return obras.filter(
      (obra) => obra.estado_venta === "disponible" && obra.ubicacion === "tienda_online"
    );
  }, [obras]);

  const handleAddToCart = (obra: any) => {
    addToCart(obra);
  };

  return (
    <PublicLayout noPadding={true}>
      <div className="w-screen flex flex-col" style={{ backgroundColor: '#5F6D9A' }}>

        {/* FILA SUPERIOR - Cards de tienda con scroll horizontal */}
        <div className="px-[10%] pt-42 pb-8 md:pb-0">
          {/* Scroll horizontal de obras */}
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-white/80 text-lg tracking-wide">Cargando obras...</p>
            </div>
          ) : availableObras.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/80 text-lg tracking-wide">
                No hay obras disponibles
              </p>
            </div>
          ) : (
            <div className="relative">
              <div
                className="flex gap-8 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 scrollbar-hide"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  scrollBehavior: 'smooth',
                }}
              >
                {availableObras.map((obra) => (
                  <div key={obra.id_obra} className="flex-none w-[300px] md:w-[350px] lg:w-[400px] snap-center">
                    <ObraCard
                      obra={obra}
                      onAddToCart={handleAddToCart}
                      onViewDetails={() => navigate(`/obra/${obra.id_obra}`)}
                    />
                  </div>
                ))}
              </div>
              {/* Degradado de derecha indicando más contenido */}
              <div
                className="absolute top-0 right-0 bottom-8 w-32 md:w-48 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, transparent 0%, #5F6D9A 100%)'
                }}
              />
            </div>
          )}
        </div>

        {/* FILA INFERIOR - Logo loop */}
        <div className="w-full overflow-hidden py-6 md:py-12 bg-[#5F6D9A]">
          <div className="flex animate-logo-scroll">
            {/* Duplicamos el contenido para el efecto de loop infinito */}
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-center gap-16 pr-16 shrink-0">
                <img
                  src="/Piedra art home page-17.svg"
                  alt="Piedra logo"
                  className="h-80 md:h-[25rem] w-auto object-contain shrink-0"
                />
                <img
                  src="/Piedra art home page-17.svg"
                  alt="Piedra logo"
                  className="h-80 md:h-[25rem] w-auto object-contain shrink-0"
                />
                <img
                  src="/Piedra art home page-17.svg"
                  alt="Piedra logo"
                  className="h-80 md:h-[25rem] w-auto object-contain shrink-0"
                />
                <img
                  src="/Piedra art home page-17.svg"
                  alt="Piedra logo"
                  className="h-80 md:h-[25rem] w-auto object-contain shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
