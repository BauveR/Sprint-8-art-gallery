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
    <section className="h-screen w-screen flex flex-col justify-center bg-white dark:bg-zinc-900/50 py-16 overflow-hidden">
      <div className="w-full px-[5%] mb-12">
        {/* Título */}
        <motion.div
          className="flex flex-col justify-center items-center text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-primary/60 bg-clip-text text-transparent">
              Nuestra Galería
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Descubre obras maestras de artistas destacados. Cada pieza cuenta una historia única.
          </p>
        </motion.div>
      </div>

      {/* Slider Horizontal */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-[5%] pb-8 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollBehavior: 'smooth',
          }}
        >
          {obrasEnExposicion.map((obra, index) => (
            <motion.div
              key={obra.id_obra}
              className="relative flex-none w-[85vw] md:w-[70vw] lg:w-[50vw] h-[60vh] snap-center cursor-pointer overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              onClick={() => navigate(`/obra/${obra.id_obra}`)}
            >
              <ObraImage
                obraId={obra.id_obra}
                alt={obra.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h3 className="text-white text-xl md:text-2xl font-bold">{obra.titulo}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
