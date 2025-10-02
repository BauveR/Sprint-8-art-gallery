// src/routes.ts
import { Router } from "express";
import * as obras from "../controllers/obrasController";
import * as tiendas from "../controllers/tiendasController";
import * as expos from "../controllers/exposController";
import {
  upload,
  listByObra as listImgs,
  uploadForObra,
  remove as removeImg,
} from "../controllers/imagesController";
import { pool } from "../db/pool";

const router = Router();

/** ---------- Health DB dentro de /api ---------- */
router.get("/health/db", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: "DB unreachable" });
  }
});

/** ---------- Obras ---------- */
router.get("/obras", obras.list);
router.post("/obras", obras.create);
router.put("/obras/:id", obras.update);
router.delete("/obras/:id", obras.remove);
router.post("/obras/:id/asignar-tienda", obras.asignarTienda);
router.post("/obras/:id/sacar-tienda", obras.sacarTienda);
router.post("/obras/:id/asignar-expo", obras.asignarExpo);
router.post("/obras/:id/quitar-expo", obras.quitarExpo);

/** ---------- Imágenes de obras ---------- */
router.get("/obras/:id/imagenes", listImgs);
router.post("/obras/:id/imagenes", upload.single("file"), uploadForObra);
router.delete("/imagenes/:id", removeImg);

/** ---------- Tiendas ---------- */
router.get("/tiendas", tiendas.list);
router.post("/tiendas", tiendas.create);

/** ---------- Expos ---------- */
router.get("/expos", expos.list);
router.post("/expos", expos.create);

export default router;
