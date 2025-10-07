import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen bg-gradient-to-t from-orange-500 via-yellow-200 to-white dark:from-slate-950 dark:via-blue-700 dark:to-blue-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8 items-center min-h-[80vh]">
          {/* Modelo 3D */}
          <motion.div
            className="flex items-center justify-center h-[80vh]"
            style={{ transform: 'translate(-30%, 30%)' }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-full max-w-2xl h-full overflow-hidden relative">
              <iframe
                title="piedra artwork"
                allowFullScreen
                allow="autoplay; fullscreen;"
                className="w-full h-full border-0 absolute pointer-events-none"
                style={{
                  clipPath: 'inset(5% 0 5% 0)',
                  top: '9%',
                  left: '-10%',
                }}
                src="https://sketchfab.com/models/1bc52cbae36e4c019ff06585c06ed287/embed?autospin=1&autostart=1&camera=0&preload=1&transparent=1&ui_hint=0"
              />
              <div className="absolute inset-0 z-10" style={{ pointerEvents: 'all' }} />
            </div>
          </motion.div>

          {/* Contenido */}
          <motion.div
            className="space-y-6 text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-8xl font-bold"
              initial={{ opacity: 0, y: 20 }}

              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                MATCHLESS
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Each stone unrepeatable, each piece matchless—for everyday rituals. 
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                onClick={() => navigate("/shop")}
                className="text-lg px-8 py-6"
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
