import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Obra } from "../../types";
import ObraImage from "../common/ObraImage";

interface GallerySectionProps {
  obras: Obra[];
}

export default function GallerySection({ obras }: GallerySectionProps) {
  const navigate = useNavigate();

  // Filtrar solo obras en exposición
  const obrasEnExposicion = obras.filter((obra) => obra.ubicacion === "en_exposicion");

  return (
    <section className="py-16 bg-white/50 dark:bg-zinc-900/50">
      <div className="w-full mx-auto px-[10%]">
        <div className="grid grid-cols-1 lg:grid-cols-[20%_60%] gap-[10%]">
          {/* Título */}
          <motion.div
            className="flex flex-col justify-center items-center text-center space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Nuestra Galería
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Descubre obras maestras de artistas destacados. Cada pieza cuenta una historia única.
            </p>
          </motion.div>

          {/* Grid de imágenes */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {obrasEnExposicion.slice(0, 15).map((obra, index) => (
              <motion.div
                key={obra.id_obra}
                className="aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/obra/${obra.id_obra}`)}
              >
                <ObraImage
                  obraId={obra.id_obra}
                  alt={obra.titulo}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
