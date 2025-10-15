import { Route } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardPage from "../pages/DashboardPage";
import CheckoutPage from "../pages/CheckoutPage";

/**
 * Rutas protegidas - Requieren autenticación
 */
export function ProtectedRoutes() {
  return (
    <>
      {/* Rutas para usuarios autenticados */}
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={["admin", "user"]}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas solo para administradores */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </>
  );
}
