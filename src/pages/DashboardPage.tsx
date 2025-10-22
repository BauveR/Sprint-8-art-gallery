import { useState } from "react";
import HomePage from "../components/Home/HomePage";
import ObrasPage from "../components/Obras/ObrasPage";
import TiendasPage from "../components/Tiendas/TiendasPage";
import ExposPage from "../components/Expos/ExposPage";
import OrdersPage from "../components/Orders/OrdersPage";
import AdminNav from "../components/layout/AdminNav";

type Tab = "admin" | "obras" | "tiendas" | "expos" | "orders";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("admin");

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
      <AdminNav activeTab={tab} onTabChange={setTab} />

      <main className="pt-32 md:pt-24">
        {tab === "admin" && <HomePage onNavigate={setTab} />}
        {tab === "obras" && <ObrasPage />}
        {tab === "orders" && <OrdersPage />}
        {tab === "tiendas" && <TiendasPage />}
        {tab === "expos" && <ExposPage />}
      </main>
    </div>
  );
}
