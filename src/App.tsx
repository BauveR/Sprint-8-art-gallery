import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicHome from "./pages/PublicHome";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ObraDetailPage from "./pages/ObraDetailPage";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<PublicHome />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/obra/:id" element={<ObraDetailPage />} />

            {/* Rutas protegidas - Usuarios autenticados */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={["admin", "user"]}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas - Solo Admin */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Ruta por defecto - Redirigir al home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
