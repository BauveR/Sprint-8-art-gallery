import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut, User, ShoppingCart, Store } from "lucide-react";

export default function PublicNavbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? "shadow-[0_8px_16px_-4px_rgba(0,0,0,0.1)]"
        : "bg-white/70 dark:bg-zinc-900/70 backdrop-blur border-b border-gray-200 dark:border-zinc-800"
    }`}>
      {scrolled && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-transparent dark:from-zinc-900/90 dark:via-zinc-900/70 dark:to-transparent pointer-events-none" />
      )}
      <div className="max-w-7xl mx-auto px-4 py-1 relative z-10">
        <div className="flex items-center justify-between">
          <Link to="/" className="h-20 md:h-24 flex items-center">
            <img
              src="/piedra  svgs-01.svg"
              alt="Logo"
              className="h-full w-auto"
            />
          </Link>

          <div className="flex items-center gap-3">
            {/* Link Tienda */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/shop")}
              className="flex items-center gap-2"
            >
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Tienda</span>
            </Button>

            {/* Carrito */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="hidden sm:inline">Carrito</span>
            </Button>

            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                    {user?.role}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                className="md:rounded-md rounded-full md:px-4 px-2"
              >
                <User className="h-4 w-4 md:hidden" />
                <span className="hidden md:inline">Iniciar Sesión</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
