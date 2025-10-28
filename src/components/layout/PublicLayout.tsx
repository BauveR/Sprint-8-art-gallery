import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContextFirebase";
import LogoLoop from "./LogoLoop";
import PillNav from "./PillNav";
import Footer from "./Footer";
import MobileDock from "@/components/ui/mobile-dock";
import { Home, Store, ShoppingCart, Package, Settings, LogOut, User } from "lucide-react";

interface PublicLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

export default function PublicLayout({ children, noPadding = false }: PublicLayoutProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Mobile Dock Items
  const mobileDockItems = [
    {
      icon: <Home size={20} />,
      label: "Inicio",
      onClick: () => navigate("/")
    },
    {
      icon: <Store size={20} />,
      label: "Tienda",
      onClick: () => navigate("/shop")
    },
    {
      icon: <ShoppingCart size={20} />,
      label: "Carrito",
      onClick: () => navigate("/cart")
    },
    ...(isAuthenticated
      ? [
          {
            icon: <Package size={20} />,
            label: "Mis Compras",
            onClick: () => navigate("/my-orders")
          },
          ...(user?.role === 'admin'
            ? [
                {
                  icon: <Settings size={20} />,
                  label: "Admin",
                  onClick: () => navigate("/dashboard")
                }
              ]
            : []),
          {
            icon: <LogOut size={20} />,
            label: "Logout",
            onClick: handleLogout
          }
        ]
      : [
          {
            icon: <User size={20} />,
            label: "Login",
            onClick: () => navigate("/login")
          }
        ])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 flex flex-col relative">
      <LogoLoop />
      <PillNav />
      <main className={`flex-1 ${noPadding ? "" : "pt-40 md:pt-44 pb-24 md:pb-0"}`}>
        {children}
      </main>
      <Footer />

      {/* Mobile Dock - Fixed at bottom, only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileDock items={mobileDockItems} />
      </div>
    </div>
  );
}
