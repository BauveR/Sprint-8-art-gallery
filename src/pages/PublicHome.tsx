import { useNavigate } from "react-router-dom";
import { useObras } from "../query/obras";
import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PublicHome() {
  const navigate = useNavigate();
  const { data } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 15 });
  const obras = data?.data ?? [];

  // Configuración de SVGs del Welcome Section
  const svgElements = [
    {
      src: "/piedra-arte-02.svg",
      position: "top-10 left-20",
      size: "w-96 h-96",
      opacity: "opacity-100",
      animation: { type: "rotate", from: -180, delay: 0.2 },
    },
    {
      src: "/piedra-arte-03.svg",
      position: "top-50 right-20",
      size: "w-120 h-120",
      opacity: "opacity-100",
      animation: { type: "rotate", from: 180, delay: 0.4 },
    },
    {
      src: "/piedra-arte-04.svg",
      position: "top-1/3 left-5",
      size: "w-144 h-144",
      opacity: "opacity-100",
      animation: { type: "slideX", from: -100, delay: 0.6 },
    },
    {
      src: "/piedra-arte-05.svg",
      position: "top-1/2 right-10",
      size: "w-108 h-108",
      opacity: "opacity-100",
      animation: { type: "slideX", from: 100, delay: 0.8 },
    },
    {
      src: "/piedra-arte-06.svg",
      position: "top-1/4 left-1/3",
      size: "w-84 h-84",
      opacity: "opacity-100",
      animation: { type: "slideY", from: -50, delay: 1 },
    },
    {
      src: "/piedra-arte-07.svg",
      position: "top-2/3 right-1/4",
      size: "w-96 h-96",
      opacity: "opacity-100",
      animation: { type: "slideY", from: 50, delay: 1.2 },
    },
    {
      src: "/piedra-arte-08.svg",
      position: "bottom-20 left-1/4",
      size: "w-132 h-132",
      opacity: "opacity-100",
      animation: { type: "scale", from: 0, delay: 1.4 },
    },
    {
      src: "/piedra-arte-09.svg",
      position: "bottom-32 right-1/3",
      size: "w-108 h-108",
      opacity: "opacity-100",
      animation: { type: "rotate", from: -90, delay: 1.6 },
    },
    {
      src: "/piedra-arte-10.svg",
      position: "bottom-10 left-1/2",
      size: "w-120 h-120",
      opacity: "opacity-100",
      animation: { type: "scale", from: 0.5, delay: 1.8 },
    },
  ];

  const getAnimationProps = (animation: any) => {
    switch (animation.type) {
      case "rotate":
        return {
          initial: { opacity: 0, scale: 0, rotate: animation.from },
          whileInView: { opacity: 1, scale: 1, rotate: 0 },
        };
      case "slideX":
        return {
          initial: { opacity: 0, x: animation.from },
          whileInView: { opacity: 1, x: 0 },
        };
      case "slideY":
        return {
          initial: { opacity: 0, y: animation.from },
          whileInView: { opacity: 1, y: 0 },
        };
      case "scale":
        return {
          initial: { opacity: 0, scale: animation.from },
          whileInView: { opacity: 1, scale: 1 },
        };
      default:
        return {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <PublicNavbar />

      {/* Welcome Section */}
      <section className="relative min-h-screen overflow-hidden bg-white dark:bg-white">
        {/* SVG Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {svgElements.map((element, index) => {
            const animationProps = getAnimationProps(element.animation);
            return (
              <motion.img
                key={index}
                src={element.src}
                alt=""
                className={`absolute ${element.position} ${element.size} ${element.opacity}`}
                {...animationProps}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: element.animation.delay }}
              />
            );
          })}
        </div>
      </section>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8 items-center min-h-[80vh]">
            {/* Lado izquierdo - Imagen */}
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/piedra-arte-02.svg"
                alt="Arte Piedra"
                className="w-full max-w-2xl h-auto"
              />
            </motion.div>

            {/* Lado derecho - Contenido */}
            <motion.div
              className="space-y-6 text-center lg:text-left"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Arte que Inspira
                </span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Explora nuestra colección exclusiva de obras de arte. Cada pieza es una ventana a nuevas emociones y perspectivas.
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
                  Ver Colección
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white/50 dark:bg-zinc-900/50">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-8">
            {/* Lado izquierdo - Título y texto */}
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

            {/* Lado derecho - Grid de imágenes 3x5 */}
            <motion.div
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {obras.slice(0, 15).map((obra, index) => (
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
                  <img
                    src="/piedra-arte-02.svg"
                    alt={obra.titulo}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
