import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PublicNavbar from "../components/layout/PublicNavbar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PublicHome() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-73px)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-8 items-center">
            {/* Imagen - 65% */}
            <div className="order-2 lg:order-1">
              <div className="relative w-full aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/piedra-arte-02.svg"
                  alt="Art Gallery Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>

            {/* Contenido - 35% */}
            <div className="order-1 lg:order-2 space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Descubre el Arte
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Explora nuestra colección de obras únicas. Gestiona tu galería con las herramientas más avanzadas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
