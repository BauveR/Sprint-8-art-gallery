import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import ObraImage from "../common/ObraImage";
import { motion } from "framer-motion";
import { ObraImageGalleryProps } from "../../types/components";

export default function ObraImageGallery({ images, obraId, obraTitulo }: ObraImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4"
    >
      {/* Imagen principal */}
      <Card className="dark:bg-white/[0.03] dark:backdrop-blur-xl dark:border-white/10">
        <CardContent className="p-0">
          <div className="aspect-square overflow-hidden rounded-lg">
            {images.length > 0 ? (
              <img
                src={images[selectedImageIndex].url}
                alt={obraTitulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <ObraImage
                obraId={obraId}
                alt={obraTitulo}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                selectedImageIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={image.url}
                alt={`${obraTitulo} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
