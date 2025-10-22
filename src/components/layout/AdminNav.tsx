import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContextFirebase";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LogOut, Home, User, Package, Store, Calendar, ShoppingCart } from "lucide-react";

type Tab = "admin" | "obras" | "tiendas" | "expos" | "orders";

interface AdminNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function AdminNav({ activeTab, onTabChange }: AdminNavProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Navigation items para admin
  const navItems = [
    { tab: "admin" as Tab, label: "Dashboard", icon: Home },
    { tab: "obras" as Tab, label: "Obras", icon: Package },
    { tab: "orders" as Tab, label: "Órdenes", icon: ShoppingCart },
    { tab: "tiendas" as Tab, label: "Tiendas", icon: Store },
    { tab: "expos" as Tab, label: "Exposiciones", icon: Calendar },
  ];

  // Actualizar indicador cuando cambia el tab activo
  useEffect(() => {
    const currentIndex = navItems.findIndex((item) => item.tab === activeTab);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
      updateIndicator(currentIndex);
    }
  }, [activeTab]);

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

  const handleNavClick = (tab: Tab, index: number) => {
    setActiveIndex(index);
    onTabChange(tab);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-zinc-800/50">
      <nav className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo - Solo para admin */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-16">
            <img
              src="/piedra-arte-03.svg"
              alt="Piedra Arte"
              className="h-32 w-auto dark:invert transition-all duration-300"
            />
          </div>

          {/* Center - Pill Navigation (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div
              ref={navRef}
              className="flex relative bg-gray-100 dark:bg-gray-800 rounded-full p-1.5 shadow-inner"
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
                    key={item.tab}
                    ref={(el) => { itemsRef.current[index] = el; }}
                    onClick={() => handleNavClick(item.tab, index)}
                    className={`relative z-10 px-4 py-2 rounded-full font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                      isActive
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {/* Home Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHomeClick}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Ir al inicio"
            >
              <Home className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Info */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">
                {user?.role}
              </span>
            </div>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden xl:inline ml-2">Cerrar Sesión</span>
            </Button>
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHomeClick}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Home className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3 flex justify-center items-center">
          <div className="flex gap-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = item.tab === activeTab;

              return (
                <button
                  key={item.tab}
                  onClick={() => handleNavClick(item.tab, index)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
