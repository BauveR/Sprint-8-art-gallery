import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Model3D from "../3D/Model3D";
import Magnet from "../animations/Magnet";

export default function HeroSection() {
  const navigate = useNavigate();


  return (
    <section
      className="relative min-h-[90vh] bg-white
      dark:bg-gradient-to-t dark:from-slate-950 dark:from-10% dark:via-blue-700 dark:via-50% dark:to-blue-800 dark:to-90%
      grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 items-center px-4 py-3">

      {/* Capa de degradado adicional - solo modo oscuro */}
      <div className="absolute inset-0 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-950 z-[1]" />
          {/* Columna Izquierda - Available in stores */}
          <motion.div
            className="relative z-[20] flex flex-col items-center md:items-end justify-center space-y-3"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex flex-col items-center md:items-start space-y-3">
              <h3 className="text-xl md:text-xl font-semibold text-gray-300 dark:text-gray-200 text-center md:text-left">
                available now in stores CDMX:
              </h3>
              <div className="flex flex-row gap-2 md:gap-4 justify-center md:justify-start items-start flex-wrap md:flex-nowrap">
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
                />
              </a>
            </div>
            </div>
          </motion.div>

          {/* Columna Central - Modelo 3D */}
          <motion.div
            className="relative z-[20] flex items-center justify-center h-[60vh] md:h-[80vh] mb-0 md:mb-0 bg-transparent dark:bg-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="w-full h-full relative bg-transparent dark:bg-transparent -ml-8 md:-ml-16">
              <Model3D
                modelPath="https://res.cloudinary.com/dmweipuof/image/upload/v1760810430/piedra-draco_r3razb.glb"
                autoRotate={true}
                rotationSpeed={0.5}
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Columna Derecha - SVG animado con scroll */}
          <div className="relative z-[50] flex flex-col items-center md:items-start justify-start h-full min-h-[60vh] text-center md:text-left -mt-12 md:mt-0">
            {/* Contenedor con límites para el SVG */}
            <div className="flex items-center justify-start w-full relative">
              <motion.img
                src="/each pebble unrepeatable-14.svg"
                alt="Each pebble unrepeatable"
                className="w-[180%] max-w-none h-auto object-contain -ml-12 md:-ml-16"
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </div>

            {/* Botón fijo al final */}
            <motion.div
              className="flex justify-center md:justify-start w-full relative z-[60] mt-4 md:mt-0 ms-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Magnet padding={100} strength={0.4}>
                <Button
                  variant="glass"
                  onClick={() => navigate("/shop")}
                  className="text-lg md:text-2xl px-10 md:px-15 py-1.5 md:py-2 border-0"
                  style={{ backgroundColor: '#8FDF00' }}
                >
                  BUY NOW!
                  <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Magnet>
            </motion.div>
          </div>
    </section>
  );
}
