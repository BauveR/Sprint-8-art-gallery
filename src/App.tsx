import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContextFirebase";
import { CartProvider } from "./context/CartContext";
import AppRoutes from "./routes";

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
