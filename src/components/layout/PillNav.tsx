import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContextFirebase";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut, User, ShoppingCart, Store, Package } from "lucide-react";

export default function PillNav() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Navegación items
  const navItems = [
    { path: "/", label: "Inicio", icon: null },
    { path: "/shop", label: "Tienda", icon: Store },
    ...(isAuthenticated
      ? [{ path: "/my-orders", label: "Mis Compras", icon: Package }]
      : []),
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Actualizar indicador cuando cambia la ruta
  useEffect(() => {
    const currentIndex = navItems.findIndex((item) => item.path === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
      updateIndicator(currentIndex);
    }
  }, [location.pathname, navItems.length]);

  const updateIndicator = (index: number) => {
    const item = itemsRef.current[index];
    if (item) {
      setIndicatorStyle({
        left: item.offsetLeft,
        width: item.offsetWidth,
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (path: string, index: number) => {
    setActiveIndex(index);
    navigate(path);
  };

  return (
    <header className="fixed top-[72px] left-0 right-0 z-40 transition-all duration-300">
      <nav className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16 relative">
          {/* Right side actions - Posicionado a la derecha */}
          <div className="hidden md:flex items-center gap-2">
            {/* Pill Navigation */}
            <div
              ref={navRef}
              className="flex relative bg-gray-70 dark:bg-gray-800 rounded-full p-1.5 shadow-inner"
            >
              {/* Animated indicator */}
              <div
                className="absolute top-1.5 h-[calc(100%-0.75rem)] bg-white dark:bg-gray-700 rounded-full shadow-md transition-all duration-300 ease-out"
                style={{
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                }}
              />

              {/* Nav Items */}
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeIndex === index;

                return (
                  <button
                    key={item.path}
                    ref={(el) => { itemsRef.current[index] = el; }}
                    onClick={() => handleNavClick(item.path, index)}
                    className={`relative z-10 px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                      isActive
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
              className="relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">
                    {user?.role}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2">Cerrar Sesión</span>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                className="rounded-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <User className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Iniciar Sesión</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 flex justify-between items-center">
          {/* Nav items mobile centrados */}
          <div className="flex justify-center gap-2 flex-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Mobile actions a la derecha */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
              className="relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
