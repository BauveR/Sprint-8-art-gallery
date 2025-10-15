import { Route } from "react-router-dom";
import PublicHome from "../pages/PublicHome";
import LoginPage from "../pages/LoginPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import ShopPage from "../pages/ShopPage";
import CartPage from "../pages/CartPage";
import ObraDetailPage from "../pages/ObraDetailPage";
import MyOrdersPage from "../pages/MyOrdersPage";

/**
 * Rutas públicas - Accesibles sin autenticación
 */
export function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/obra/:id" element={<ObraDetailPage />} />
      <Route path="/my-orders" element={<MyOrdersPage />} />
    </>
  );
}
