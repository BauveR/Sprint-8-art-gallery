import { Router } from "express";
import * as obras from "../controllers/obrasController";
import * as tiendas from "../controllers/tiendasController";
import * as expos from "../controllers/exposController";

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

// Tiendas
router.get("/tiendas", tiendas.list);
router.post("/tiendas", tiendas.create);

// Expos
router.get("/expos", expos.list);
router.post("/expos", expos.create);

export default router;
