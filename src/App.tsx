import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContextFirebase";
import { CartProvider } from "./context/CartContext";
import { PublicRoutes } from "./routes/PublicRoutes";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";

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
            <PublicRoutes />

            {/* Rutas protegidas */}
            <ProtectedRoutes />

            {/* Ruta por defecto - Redirigir al home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
