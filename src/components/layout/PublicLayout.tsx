import { ReactNode, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import LogoLoop from "./LogoLoop";
import PillNav from "./PillNav";
import Footer from "./Footer";
import MobileDock from "@/components/ui/mobile-dock";
import { Home, Store } from "lucide-react";

interface PublicLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
  backgroundColor?: string;
}

export default function PublicLayout({ children, noPadding = false, backgroundColor }: PublicLayoutProps) {
  const navigate = useNavigate();

  const mobileDockItems = useMemo(() => [
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
  ], [navigate]);

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundColor: backgroundColor || undefined,
        ...(!backgroundColor && {
          background: 'linear-gradient(to bottom right, rgb(250 250 250), rgb(244 244 245))'
        })
      }}
    >
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
