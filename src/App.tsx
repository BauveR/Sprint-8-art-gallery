import { useState } from "react";
import ObrasPage from "./components/Obras/ObrasPage";
import TiendasPage from "./components/Tiendas/TiendasPage";
import ExposPage from "./components/Expos/ExposPage";

type Tab = "obras" | "tiendas" | "expos";

export default function App() {
  const [tab, setTab] = useState<Tab>("obras");

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100">
      <header className="sticky top-0 bg-white/70 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Art Gallery · Admin</h1>
          <nav className="flex gap-2">
            {(["obras","tiendas","expos"] as Tab[]).map(t => (
              <button key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-full text-sm ${tab===t ? "bg-black text-white" : "bg-gray-100"}`}>
                {t}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === "obras" && <ObrasPage />}
        {tab === "tiendas" && <TiendasPage />}
        {tab === "expos" && <ExposPage />}
      </main>
    </div>
  );
}
