import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useObras } from "../query/obras";
import PublicNavbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PublicHome() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { data } = useObras({ sort: { key: "id_obra", dir: "desc" }, page: 1, pageSize: 15 });
  const obras = data?.data ?? [];

  // Animaciones para el texto
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const typingVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-73px)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8 items-center">
            {/* Imagen - 65% */}
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="relative w-full aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/piedra-arte-02.svg"
                  alt="Art Gallery Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>

            {/* Contenido - 35% */}
            <motion.div
              className="order-1 lg:order-2 space-y-6 text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={textVariants} className="overflow-hidden">
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold"
                  variants={typingVariants}
                  style={{ whiteSpace: "nowrap" }}
                >
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Descubre el Arte
                  </span>
                </motion.h1>
              </motion.div>

              <motion.p
                variants={textVariants}
                className="text-lg md:text-xl text-muted-foreground"
              >
                Explora nuestra colección de obras únicas. Gestiona tu galería con las herramientas más avanzadas.
              </motion.p>

              <motion.div
                variants={textVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  onClick={() => navigate("/shop")}
                  className="flex items-center gap-2"
                >
                  Explorar Tienda
                  <ArrowRight className="h-5 w-5" />
                </Button>

                {isAuthenticated && user?.role === "admin" ? (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                  >
                    Ir al Dashboard
                  </Button>
                ) : !isAuthenticated ? (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/login")}
                  >
                    Iniciar Sesión
                  </Button>
                ) : null}
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
