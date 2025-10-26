import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Model3D from "../3D/Model3D";
import Magnet from "../animations/Magnet";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col" style={{ backgroundColor: '#5F6D9A' }}>

      {/* FILA SUPERIOR - 2 columnas */}
      <div className="relative z-[20] flex-1 grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8 items-center px-4 pt-2 pb-8">

        {/* Columna Izquierda - Available in stores */}
        <motion.div
          className="flex flex-col items-center lg:items-end justify-center space-y-4"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h3 className="text-xl md:text-2xl font-semibold text-gray-300 dark:text-gray-200 text-center lg:text-right">
            available now in stores CDMX:
          </h3>
          <div className="flex flex-row gap-4 justify-center lg:justify-end items-center flex-wrap">
            {/* Logo 1 - Compas 88 */}
            <a
              href="https://compas88.bigcartel.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            >
              <img
                src="/piedra  shops mexico city-11.svg"
                alt="Compas 88"
                className="w-full h-full object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>
            {/* Logo 2 - en el 14 */}
            <a
              href="https://www.instagram.com/en_el_14/?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            >
              <img
                src="/piedra  shops mexico city-12.svg"
                alt="en el 14"
                className="w-full h-full object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>
            {/* Logo 3 - Marsella 68 */}
            <a
              href="https://www.marsella68.store/?srsltid=AfmBOoomtDxZZcukO53uUXAxCycUBSDUQoJBFWL6bwkTcqkto9fjRCqO"
              target="_blank"
              rel="noopener noreferrer"
              className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
            >
              <img
                src="/piedra  shops mexico city-13.svg"
                alt="marsella 68"
                className="w-full h-full object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>
          </div>
        </motion.div>

        {/* Columna Derecha - Modelo 3D y Botón */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Modelo 3D */}
          <motion.div
            className="w-[120%] md:w-full h-[80vh] md:h-[50vh] flex items-center justify-center overflow-visible"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="w-[100%] md:w-[100%] h-[200%]" style={{ transform: 'rotate(-90deg) translateX(-5%) translateY(-5%)' }}>
              <Model3D
                modelPath="https://res.cloudinary.com/dmweipuof/image/upload/v1760810430/piedra-draco_r3razb.glb"
                autoRotate={true}
                rotationSpeed={0.5}
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Botón */}
          <motion.div
            className="flex justify-center w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Magnet padding={100} strength={0.4}>
              <Button
                variant="glass"
                onClick={() => navigate("/shop")}
                className="text-lg md:text-3xl px-12 md:px-10 py-1.5 md:py-2 border-0 mb-20"
                style={{ backgroundColor: '#8FDF00' }}
              >
                BUY NOW!
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </Magnet>
          </motion.div>
        </div>
      </div>

      {/* FILA INFERIOR - Logo loop con SVG */}
      <div className="relative z-[20] w-full overflow-hidden py-12" style={{ backgroundColor: '#5F6D9A' }}>
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
    </section>
  );
}
