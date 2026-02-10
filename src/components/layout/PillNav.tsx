import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Store } from "lucide-react";

export default function PillNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const navItems = [
    { path: "/", label: "Inicio", icon: null },
    { path: "/shop", label: "Tienda", icon: Store },
  ];

  // Actualizar indicador cuando cambia la ruta
  useEffect(() => {
    const currentIndex = navItems.findIndex((item) => item.path === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
      updateIndicator(currentIndex);
    }
  }, [location.pathname]);

  const updateIndicator = (index: number) => {
    const item = itemsRef.current[index];
    if (item) {
      setIndicatorStyle({
        left: item.offsetLeft,
        width: item.offsetWidth,
      });
    }
  };

  const handleNavClick = (path: string, index: number) => {
    setActiveIndex(index);
    navigate(path);
  };

  return (
    <header className="fixed top-4 md:top-[72px] left-0 right-0 z-40 transition-all duration-300">
      <nav className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16 relative">
          {/* Right side actions */}
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
                    className={`relative z-10 px-4 py-1 md:py-2 rounded-full font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
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

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
