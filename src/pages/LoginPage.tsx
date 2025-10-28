import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextFirebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, loginWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // La redirección se hará cuando el user cambie
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      await loginWithGoogle();
      // La redirección se hará cuando el user cambie
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión con Google");
      setIsGoogleLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  // Redirigir cuando el usuario esté autenticado
  if (user) {
    if (user.role === "admin") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
    return null;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 md:py-0 relative overflow-hidden"
      style={{ backgroundColor: '#5F6D9A' }}
    >
      {/* Logo loop de fondo - Responsive height */}
      <div className="absolute inset-0 flex items-center pointer-events-none opacity-20 md:opacity-100">
        <div className="w-full overflow-hidden">
          <div className="flex animate-logo-scroll">
            {/* Duplicamos el contenido para el efecto de loop infinito */}
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-center gap-8 md:gap-16 pr-8 md:pr-16 shrink-0">
                <img
                  src="/Piedra art home page-17.svg"
                  alt="Piedra logo"
                  className="w-auto object-contain shrink-0 h-[40rem] md:h-[100rem]"
                />
                <img
                  src="/Piedra art home page-17.svg"
                  alt="Piedra logo"
                  className="w-auto object-contain shrink-0 h-[40rem] md:h-[100rem]"
                />
                <img
                  src="/Piedra art home page-17.svg"
                  alt="Piedra logo"
                  className="w-auto object-contain shrink-0 h-[40rem] md:h-[100rem]"
                />
                <img
                  src="/Piedra art home page-17.svg"
                  alt="Piedra logo"
                  className="w-auto object-contain shrink-0 h-[40rem] md:h-[100rem]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Botón de cerrar - Better positioning for mobile */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 md:-top-4 md:-right-4 z-50 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        <Card className="w-full bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4 md:pb-6">
            <CardTitle className="text-xl md:text-2xl text-white">Iniciar Sesión</CardTitle>

            {/* Logo giratorio - Smaller on mobile */}
            <motion.img
              src="/piedra  svgs-05.svg"
              alt="Decorative rotating element"
              className="w-24 h-24 md:w-40 md:h-40 mx-auto my-4 md:my-6 object-contain brightness-0 invert"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              transition={{
                opacity: { duration: 1 },
                scale: { duration: 1 },
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            />

            <CardDescription className="text-sm text-white/80">Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-white/30 rounded-lg p-2.5 md:p-2 bg-white/5 text-white placeholder:text-white/50 text-base focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="email@ejemplo.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-white">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-white/30 rounded-lg p-2.5 md:p-2 bg-white/5 text-white placeholder:text-white/50 text-base focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-white p-2.5 md:p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full h-11 md:h-10 bg-white text-[#5F6D9A] hover:bg-white/90 font-semibold" disabled={isLoading || isGoogleLoading}>
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <div className="mt-3 md:mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-white/70">
                  O continúa con
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-3 md:mt-4 h-11 md:h-10 bg-white/5 border-white/30 text-white hover:bg-white/10"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                "Conectando..."
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="hidden sm:inline">Continuar con Google</span>
                  <span className="sm:hidden">Google</span>
                </>
              )}
            </Button>
          </div>

          {/* Credenciales de prueba - Glassmorphism */}
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg text-xs md:text-sm space-y-1 md:space-y-2">
            <p className="font-semibold text-sm md:text-base text-white">Credenciales de prueba:</p>
            <p className="leading-relaxed text-white/80"><strong>Admin:</strong> admin@gallery.com / admin123</p>
            <p className="leading-relaxed text-white/80"><strong>Usuario:</strong> user@gallery.com / user123</p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
