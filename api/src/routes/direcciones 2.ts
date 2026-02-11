import { Router } from "express";
import * as direccionesController from "../controllers/direccionesController";
import { verifyFirebaseToken } from "../middleware/authMiddleware";

const router = Router();

// Todas las rutas de direcciones requieren autenticación
router.use(verifyFirebaseToken);

// Obtener estadísticas (debe ir antes de /:id para evitar conflicto)
router.get("/stats", direccionesController.getAddressStats);

// Obtener dirección predeterminada (debe ir antes de /:id)
router.get("/default", direccionesController.getDefaultAddress);

// CRUD de direcciones
router.get("/", direccionesController.getUserAddresses);
router.get("/:id", direccionesController.getAddressById);
router.post("/", direccionesController.createAddress);
router.put("/:id", direccionesController.updateAddress);
router.delete("/:id", direccionesController.deleteAddress);

// Establecer dirección predeterminada
router.post("/:id/set-default", direccionesController.setDefaultAddress);

export default router;
