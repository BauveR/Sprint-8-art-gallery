import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Model3D from "../3D/Model3D";
import Magnet from "../animations/Magnet";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen
     bg-gradient-to-t
     from-transparent from-0% via-white via-60% to-transparent to-90%
      dark:from-slate-950 dark:from-10% dark:via-blue-700 dark:via-50% dark:to-blue-800 dark:to-90%">

      {/* Capa de degradado adicional blanco */}
      <div className="absolute inset-0 bg-gradient-to-b from-white from-0% via-transparent via-50% to-white to-100% dark:from-slate-950 dark:to-slate-950 z-[1]" />

      <div className="relative z-[20] max-w-7xl mx-auto px-0 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-[80vh]">
          {/* Columna Izquierda - Available in stores */}
          <motion.div
            className="flex flex-col items-center justify-center space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Available in stores:
            </h3>
            <div className="flex flex-col gap-4">
              {/* Logo 1 */}
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-sm text-gray-500">Logo 1</span>
              </div>
              {/* Logo 2 */}
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-sm text-gray-500">Logo 2</span>
              </div>
              {/* Logo 3 */}
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-sm text-gray-500">Logo 3</span>
              </div>
            </div>
          </motion.div>

          {/* Columna Central - Modelo 3D */}
          <motion.div
            className="flex items-center justify-center h-[70vh] bg-transparent dark:bg-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full h-full relative bg-transparent dark:bg-transparent">
              <Model3D
                modelPath="/piedra destapador cdmx pebble art.glb"
                autoRotate={true}
                rotationSpeed={0.5}
                className="w-full h-full"
              />
            </div>
          </motion.div>

          {/* Columna Derecha - Contenido */}
          <motion.div
            className="space-y-0 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="font-semibold text-lg md:text-xl lg:text-3xl text-muted-foreground leading-tight mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              each stone
            </motion.p>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-8xl font-bold leading-none mb-0 -mt-5"
              initial={{ opacity: 0, y: 20 }}

              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-lime-400 bg-clip-text text-transparent">
              unrepeatable!
              </span>
            </motion.h1>

            <motion.p
              className="font-semibold text-lg md:text-xl lg:text-3xl text-muted-foreground leading-tight whitespace-nowrap mt-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              each piece matchless—for everyday rituals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Magnet padding={120} strength={0.4}>
                <Button
                  variant="glass"
                  onClick={() => navigate("/shop")}
                  className="text-2xl px-15 py-2"
                >
                  Add to cart
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Magnet>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
