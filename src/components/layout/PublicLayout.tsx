import { ReactNode } from "react";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";

interface PublicLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

export default function PublicLayout({ children, noPadding = false }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 flex flex-col">
      <PublicNavbar />
      <main className={`flex-1 ${noPadding ? "" : "pt-24 md:pt-28"}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
