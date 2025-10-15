import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContextFirebase";
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Páginas públicas
import PublicHome from "./pages/PublicHome";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import ObraDetailPage from "./pages/ObraDetailPage";
import MyOrdersPage from "./pages/MyOrdersPage";

// Páginas protegidas
import DashboardPage from "./pages/DashboardPage";
import CheckoutPage from "./pages/CheckoutPage";

/**
 * App principal con configuración de proveedores y enrutamiento
 */
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

            {/* Ruta por defecto - Redirigir al home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
