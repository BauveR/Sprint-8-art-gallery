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
router.post("/payments/create-payment-intent", payments.createPaymentIntent);
router.post("/payments/confirm", payments.confirmPayment);
router.post("/payments/webhook", payments.stripeWebhook);

// Orders (User purchases)
router.get("/orders", orders.getOrdersByEmail);

export default router;
