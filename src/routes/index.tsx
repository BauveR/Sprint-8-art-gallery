/**
 * Configuración centralizada de rutas
 * Separa la definición de rutas de la lógica de App.tsx (SoC - Separation of Concerns)
 */

import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Páginas públicas
import PublicHome from "@/pages/PublicHome";
import LoginPage from "@/pages/LoginPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import ShopPage from "@/pages/ShopPage";
import CartPage from "@/pages/CartPage";
import ObraDetailPage from "@/pages/ObraDetailPage";
import MyOrdersPage from "@/pages/MyOrdersPage";

// Páginas protegidas
import DashboardPage from "@/pages/DashboardPage";
import CheckoutPage from "@/pages/CheckoutPage";
import EmailTest from "@/pages/EmailTest";

/**
 * Componente de rutas de la aplicación
 * Centraliza todas las rutas públicas y protegidas
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/obra/:id" element={<ObraDetailPage />} />
      <Route path="/my-orders" element={<MyOrdersPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/email-test"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <EmailTest />
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto - Redirigir al home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
