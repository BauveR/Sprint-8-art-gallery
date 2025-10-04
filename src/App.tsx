import { useState } from "react";
import HomePage from "./components/Home/HomePage";
import ObrasPage from "./components/Obras/ObrasPage";
import TiendasPage from "./components/Tiendas/TiendasPage";
import ExposPage from "./components/Expos/ExposPage";
import { ThemeToggle } from "./components/ui/theme-toggle";

type Tab = "admin" | "obras" | "tiendas" | "expos";

export default function App() {
  const [tab, setTab] = useState<Tab>("admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <header className="sticky top-0 bg-white/70 dark:bg-zinc-900/70 backdrop-blur border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <nav className="flex gap-2 flex-wrap justify-center">
              {(["admin","obras","tiendas","expos"] as Tab[]).map(t => (
                <button key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-full text-sm capitalize ${tab===t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {t}
                </button>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {tab === "admin" && <HomePage onNavigate={setTab} />}
        {tab === "obras" && <ObrasPage />}
        {tab === "tiendas" && <TiendasPage />}
        {tab === "expos" && <ExposPage />}
      </main>
    </div>
  );
}
