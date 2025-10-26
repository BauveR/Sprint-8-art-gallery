import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Obra } from "../../types";
import ObraImage from "../common/ObraImage";

interface GallerySectionProps {
  obras: Obra[];
}

export default function GallerySection({ obras }: GallerySectionProps) {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Filtrar solo obras en exposición
  const obrasEnExposicion = obras.filter((obra) => obra.ubicacion === "en_exposicion");

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Activar cuando el 40% de la sección es visible desde arriba
        const visibleHeight = windowHeight - rect.top;
        const sectionHeight = rect.height;
        const visibilityRatio = visibleHeight / sectionHeight;

        if (visibilityRatio >= 0.4 && rect.top <= windowHeight) {
          setIsVisible(true);
        } else if (rect.top > windowHeight || rect.bottom < 0) {
          // Desactivar cuando la sección está completamente fuera de la vista
          setIsVisible(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-screen py-16 transition-colors duration-1000 overflow-x-hidden"
      style={{ backgroundColor: isVisible ? '#ffffff' : '#FF1E56' }}
    >
      {/* Grid de 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 h-full">

        {/* Columna Izquierda - 2 SVG */}
        <div className="relative h-screen flex flex-col overflow-hidden">
          {/* SVG Superior */}
          <motion.div
            className="flex-1 flex items-center justify-center p-4"
            initial={{ x: '-100%', opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : { x: '-100%', opacity: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img
              src="/Piedra art home page-18.svg"
              alt="Piedra decorative"
              className="w-[80%] h-auto object-contain"
            />
          </motion.div>

          {/* SVG Inferior */}
          <motion.div
            className="flex-1 flex items-center justify-center p-4"
            initial={{ x: '-100%', opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : { x: '-100%', opacity: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img
              src="/Piedra art home page-19.svg"
              alt="Piedra decorative"
              className="w-[80%] h-auto object-contain"
            />
          </motion.div>
        </div>

        {/* Columna Derecha - Texto y Galería */}
        <div className="flex flex-col justify-center space-y-12 pr-[5%]">
          {/* Texto alineado a la derecha */}
          <motion.div
            className="flex flex-col items-end text-right space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-3xl md:text-4xl font-bold max-w-2xl" style={{ color: '#919191' }}>
              P_I_E_D_R_A explores this relationship through various disciplines, creating unique experiences and objects. After all, no two stones are alike.
            </p>
          </motion.div>

          {/* Slider Horizontal */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth',
              }}
            >
              {obrasEnExposicion.map((obra, index) => (
                <motion.div
                  key={obra.id_obra}
                  className="relative flex-none w-[85vw] md:w-[70vw] lg:w-[40vw] h-[60vh] snap-center cursor-pointer overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl"
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
        </div>
      </div>
    </section>
  );
}
