import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen
     bg-gradient-to-t
     from-transparent from-0% via-white via-60% to-transparent to-90%
      dark:from-slate-950 dark:from-10% dark:via-blue-700 dark:via-50% dark:to-blue-800 dark:to-90%">

      {/* Capa de degradado adicional blanco */}
      <div className="absolute inset-0 bg-gradient-to-b from-white from-0% via-transparent via-50% to-white to-100% dark:from-slate-950 dark:to-slate-950 z-[1]" />

      {/* Capa de modelo 3D de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[15]" style={{ transform: 'translate(-250px, 350px)' }}>
        <div className="w-[1100px] h-[1100px] overflow-hidden bg-transparent">
          <iframe
            title="simple grass"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            className="w-full h-full border-0 bg-transparent"
            style={{
              clipPath: 'circle(600px at center)',
              boxShadow: 'none',
            }}
            src="https://sketchfab.com/models/fabdf00820a640b8bd0c144660724987/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1&ui_controls=0&ui_infos=0&ui_watermark=0"
          />
        </div>
      </div>

      <div className="relative z-[20] max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8 items-center min-h-[80vh]">
          {/* Modelo 3D */}
          <motion.div
            className="flex items-center justify-center h-[80vh] bg-transparent"
            style={{ transform: 'translate(-30%, 30%)' }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full max-w-2xl h-full overflow-hidden relative bg-transparent">
              <iframe
                title="piedra artwork"
                allowFullScreen
                allow="autoplay; fullscreen;"
                className="w-full h-full border-0 absolute pointer-events-none bg-transparent"
                style={{
                  clipPath: 'inset(5% 0 5% 0)',
                  top: '9%',
                  left: '-10%',
                }}
                src="https://sketchfab.com/models/1bc52cbae36e4c019ff06585c06ed287/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1&ui_hint=0&ui_controls=0&ui_infos=0&ui_watermark=0"
              />
              <div className="absolute inset-0 z-10 bg-transparent" style={{ pointerEvents: 'all' }} />
            </div>
          </motion.div>

          {/* Contenido */}
          <motion.div
            className="space-y-0 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}

          >
            <motion.p
              className="font-semibold text-lg md:text-xl lg:text-3xl text-muted-foreground leading-relaxed mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Each stone
            </motion.p>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-8xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}

              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-700 to-green-500 bg-clip-text text-transparent">
              unrepeatable,
              </span>
            </motion.h1>

            <motion.p
              className="font-semibold text-lg md:text-xl lg:text-3xl text-muted-foreground leading-relaxed whitespace-nowrap mb-15"
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
              <Button
                variant="glass"
                onClick={() => navigate("/shop")}
                className="text-2xl px-15 py-2"
              >
                Add to cart
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
