import { useState } from "react";
import ObrasPage from "./components/Obras/ObrasPage";
import TiendasPage from "./components/Tiendas/TiendasPage";
import ExposPage from "./components/Expos/ExposPage";
import { ThemeToggle } from "./components/ui/theme-toggle";

type Tab = "obras" | "tiendas" | "expos";

export default function App() {
  const [tab, setTab] = useState<Tab>("obras");

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <header className="sticky top-0 bg-white/70 dark:bg-zinc-900/70 backdrop-blur border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Art Gallery · Admin</h1>
          <div className="flex items-center gap-4">
            <nav className="flex gap-2">
              {(["obras","tiendas","expos"] as Tab[]).map(t => (
                <button key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-full text-sm ${tab===t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {t}
                </button>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        {tab === "obras" && <ObrasPage />}
        {tab === "tiendas" && <TiendasPage />}
        {tab === "expos" && <ExposPage />}
      </main>
    </div>
  );
}
