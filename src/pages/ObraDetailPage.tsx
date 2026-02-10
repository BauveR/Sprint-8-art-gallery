import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useObras } from "../query/obras";
import PublicLayout from "../components/layout/PublicLayout";
import ObraImageGallery from "../components/Obra/ObraImageGallery";
import ObraInfo from "../components/Obra/ObraInfo";
import { Button } from "@/components/ui/button";
import { imagenesService } from "../services/imageService";
import type { ObraImagen } from "../types";

export default function ObraDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 100 });
  const [images, setImages] = useState<ObraImagen[]>([]);

  const obra = data?.data.find((o) => o.id_obra === Number(id));

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

  const isAvailable = obra.estado_venta === "disponible";
  const isInExhibition = obra.ubicacion === "en_exposicion";

  return (
    <PublicLayout backgroundColor="#ffffff" noPadding={true}>
      <div className="max-w-7xl mx-auto px-4 pt-20 md:pt-36 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ObraImageGallery images={images} obraId={obra.id_obra} obraTitulo={obra.titulo} />

          <div className="space-y-6">
            <ObraInfo obra={obra} isAvailable={isAvailable} />

            {isInExhibition && (
              <div className="border-t pt-4">
                <a href="mailto:jesus.velazquez.bau500@gmail.com?subject=Consulta sobre obra en exposición">
                  <Button
                    variant="glass"
                    className="text-xl md:text-xl px-16 md:px-6 py-3 md:py-1.5 border-0 mb-0 w-full md:w-[40%]"
                    style={{ backgroundColor: '#8FDF00' }}
                  >
                    Disponible para colecciones
                  </Button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
