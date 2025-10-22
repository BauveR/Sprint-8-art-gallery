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
import { optionalAuth, verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();

// Obras
router.get("/obras", obras.list);
router.post("/obras", obras.create);
router.put("/obras/:id", obras.update);
router.delete("/obras/:id", obras.remove);
router.post("/obras/:id/asignar-tienda", obras.asignarTienda);
router.post("/obras/:id/sacar-tienda", obras.sacarTienda);
router.post("/obras/:id/asignar-expo", obras.asignarExpo);
router.post("/obras/:id/quitar-expo", obras.quitarExpo);

// Imágenes de obras
router.get("/obras/:id/imagenes", listImgs);
router.post("/obras/:id/imagenes", upload.single("file"), uploadForObra);
router.delete("/imagenes/:id", removeImg);

// Tiendas
router.get("/tiendas", tiendas.list);
router.post("/tiendas", tiendas.create);
router.put("/tiendas/:id", tiendas.update);
router.delete("/tiendas/:id", tiendas.remove);

// Expos
router.get("/expos", expos.list);
router.post("/expos", expos.create);
router.put("/expos/:id", expos.update);
router.delete("/expos/:id", expos.remove);

// Payments (Stripe)
router.post("/payments/create-payment-intent", optionalAuth, payments.createPaymentIntent);
router.post("/payments/confirm", optionalAuth, payments.confirmPayment);
router.post("/payments/webhook", payments.stripeWebhook);

// Orders (User purchases)
router.get("/orders", orders.getOrdersByEmail); // Legacy endpoint
router.post("/orders", verifyFirebaseToken, orders.createOrder);
router.get("/orders/all", orders.getAllOrders); // Admin - must be before /:id
router.get("/orders/stats", orders.getOrderStats); // Admin - must be before /:id
router.get("/orders/my-orders", verifyFirebaseToken, orders.getMyOrders);
router.get("/orders/number/:orderNumber", orders.getOrderByNumber);
router.get("/orders/:id", orders.getOrderById);
router.get("/orders/:id/history", orders.getOrderHistory);
router.get("/orders/:id/summary", orders.getOrderSummary);
router.put("/orders/:id/status", orders.updateOrderStatus); // Admin
router.post("/orders/:id/cancel", orders.cancelOrder);
router.post("/orders/:id/mark-paid", orders.markOrderAsPaid); // Webhook

// Reservas (Cart management)
router.use("/reservas", reservasRoutes);

// Direcciones (Shipping addresses)
router.use("/direcciones", direccionesRoutes);

export default router;
