import { Router } from "express";
import * as obras from "../controllers/obrasController";
import * as tiendas from "../controllers/tiendasController";
import * as expos from "../controllers/exposController";
import * as payments from "../controllers/paymentsController";
import * as orders from "../controllers/ordersController";
import {
  upload,
  listByObra as listImgs,
  uploadForObra,
  remove as removeImg,
} from "../controllers/imagesController";
import reservasRoutes from "./reservas";
import direccionesRoutes from "./direcciones";
import adminSetupRoutes from "./admin-setup";
import { optionalAuth, verifyFirebaseToken, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// Obras - Public: GET (list), Admin: POST/PUT/DELETE
router.get("/obras", obras.list); // Público - ver obras
router.post("/obras", verifyFirebaseToken, requireAdmin, obras.create); // Solo admin
router.put("/obras/:id", verifyFirebaseToken, requireAdmin, obras.update); // Solo admin
router.delete("/obras/:id", verifyFirebaseToken, requireAdmin, obras.remove); // Solo admin
router.post("/obras/:id/asignar-tienda", verifyFirebaseToken, requireAdmin, obras.asignarTienda); // Solo admin
router.post("/obras/:id/sacar-tienda", verifyFirebaseToken, requireAdmin, obras.sacarTienda); // Solo admin
router.post("/obras/:id/asignar-expo", verifyFirebaseToken, requireAdmin, obras.asignarExpo); // Solo admin
router.post("/obras/:id/quitar-expo", verifyFirebaseToken, requireAdmin, obras.quitarExpo); // Solo admin

// Imágenes de obras - Admin only
router.get("/obras/:id/imagenes", listImgs); // Público - ver imágenes
router.post("/obras/:id/imagenes", verifyFirebaseToken, requireAdmin, upload.single("file"), uploadForObra); // Solo admin
router.delete("/imagenes/:id", verifyFirebaseToken, requireAdmin, removeImg); // Solo admin

// Tiendas - Public: GET (list), Admin: POST/PUT/DELETE
router.get("/tiendas", tiendas.list); // Público - ver tiendas
router.post("/tiendas", verifyFirebaseToken, requireAdmin, tiendas.create); // Solo admin
router.put("/tiendas/:id", verifyFirebaseToken, requireAdmin, tiendas.update); // Solo admin
router.delete("/tiendas/:id", verifyFirebaseToken, requireAdmin, tiendas.remove); // Solo admin

// Expos - Public: GET (list), Admin: POST/PUT/DELETE
router.get("/expos", expos.list); // Público - ver exposiciones
router.post("/expos", verifyFirebaseToken, requireAdmin, expos.create); // Solo admin
router.put("/expos/:id", verifyFirebaseToken, requireAdmin, expos.update); // Solo admin
router.delete("/expos/:id", verifyFirebaseToken, requireAdmin, expos.remove); // Solo admin

// Payments (Stripe)
router.post("/payments/create-payment-intent", optionalAuth, payments.createPaymentIntent);
router.post("/payments/confirm", optionalAuth, payments.confirmPayment);
router.post("/payments/webhook", payments.stripeWebhook);

// Orders (User purchases)
router.get("/orders", orders.getOrdersByEmail); // Legacy endpoint - deprecar
router.post("/orders", verifyFirebaseToken, orders.createOrder); // Usuario autenticado
router.get("/orders/all", verifyFirebaseToken, requireAdmin, orders.getAllOrders); // Solo admin
router.get("/orders/stats", verifyFirebaseToken, requireAdmin, orders.getOrderStats); // Solo admin
router.get("/orders/my-orders", verifyFirebaseToken, orders.getMyOrders); // Usuario ve sus órdenes
router.get("/orders/number/:orderNumber", orders.getOrderByNumber); // Público (para tracking)
router.get("/orders/:id", verifyFirebaseToken, orders.getOrderById); // Usuario autenticado
router.get("/orders/:id/history", verifyFirebaseToken, requireAdmin, orders.getOrderHistory); // Solo admin
router.get("/orders/:id/summary", orders.getOrderSummary); // Público (para checkout)
router.put("/orders/:id/status", verifyFirebaseToken, requireAdmin, orders.updateOrderStatus); // Solo admin
router.post("/orders/:id/cancel", verifyFirebaseToken, orders.cancelOrder); // Usuario puede cancelar
router.post("/orders/:id/mark-paid", orders.markOrderAsPaid); // Webhook interno (sin auth)

// Reservas (Cart management)
router.use("/reservas", reservasRoutes);

// Direcciones (Shipping addresses)
router.use("/direcciones", direccionesRoutes);

// TEMPORAL: Admin Setup (solo para configuración inicial)
// ⚠️ ELIMINAR después de configurar el primer admin
router.use("/admin-setup", adminSetupRoutes);

export default router;
