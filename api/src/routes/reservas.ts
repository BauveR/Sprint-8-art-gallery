import { Router } from "express";
import * as reservasController from "../controllers/reservasController";
import { verifyFirebaseToken, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// Rutas públicas (no requieren autenticación, pero usan session)
router.post("/add", reservasController.addToCart);
router.delete("/remove/:id_obra", reservasController.removeFromCart);
router.post("/validate", reservasController.validateAvailability);
router.post("/validate-cart", reservasController.validateCart);
router.get("/my-cart", reservasController.getMyCart);
router.delete("/release-all", reservasController.releaseAll);

// Rutas protegidas (solo admin)
router.post("/cleanup", verifyFirebaseToken, requireAdmin, reservasController.cleanupExpired);

export default router;
