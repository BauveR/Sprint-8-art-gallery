import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useObras } from "../query/obras";
import { useCart } from "../context/CartContext";
import { useIsInCart } from "../hooks/useIsInCart";
import PublicLayout from "../components/layout/PublicLayout";
import ObraImageGallery from "../components/Obra/ObraImageGallery";
import ObraInfo from "../components/Obra/ObraInfo";
import ObraActions from "../components/Obra/ObraActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { imagenesService } from "../services/imageService";
import { ObraImagen } from "../types";

export default function ObraDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 100 });
  const { addToCart } = useCart();
  const [images, setImages] = useState<ObraImagen[]>([]);

  const obra = data?.data.find((o) => o.id_obra === Number(id));

  // Cargar imágenes de la obra
  useEffect(() => {
    if (obra) {
      imagenesService.listByObra(obra.id_obra).then(setImages);
    }
  }, [obra]);

  if (!obra) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Obra no encontrada</h2>
          <Button onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
      </PublicLayout>
    );
  }

  const isInCart = useIsInCart(obra.id_obra);
  const isAvailable = obra.estado_venta === "disponible";
  const isInExhibition = obra.ubicacion === "en_exposicion";
  const canPurchase = !isInExhibition && isAvailable;

  const handleAddToCart = () => {
    if (isAvailable) {
      addToCart(obra);
      toast.success(`${obra.titulo} agregado al carrito`);
    }
  };

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón de regreso */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <ObraImageGallery images={images} obraId={obra.id_obra} obraTitulo={obra.titulo} />

          {/* Información */}
          <div className="space-y-6">
            <ObraInfo obra={obra} isAvailable={isAvailable} />
            <ObraActions
              obra={obra}
              isInCart={isInCart}
              isAvailable={isAvailable}
              isInExhibition={isInExhibition}
              canPurchase={canPurchase}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
