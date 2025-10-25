import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContextFirebase";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes";

/**
 * App principal con configuración de proveedores
 * Las rutas están centralizadas en src/routes/index.tsx
 */
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
