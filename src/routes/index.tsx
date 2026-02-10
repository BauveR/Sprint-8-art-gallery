import { Routes, Route, Navigate } from "react-router-dom";

import PublicHome from "@/pages/PublicHome";
import LoginPage from "@/pages/LoginPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import ShopPage from "@/pages/ShopPage";
import ObraDetailPage from "@/pages/ObraDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/obra/:id" element={<ObraDetailPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
