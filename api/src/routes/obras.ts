import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET /api/obras
router.get("/", async (_req, res) => {
  const [rows] = await pool.query("SELECT * FROM obras_estado_actual");
  res.json(rows);
});

// GET /api/obras/:id
router.get("/:id", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT * FROM obras_estado_actual WHERE id_obra = ?",
    [req.params.id]
  );
  const list = rows as any[];
  if (list.length === 0) return res.status(404).json({ error: "No encontrada" });
  res.json(list[0]);
});

// POST /api/obras
router.post("/", async (req, res) => {
  const { autor, titulo, anio, medidas, tecnica, precio_salida } = req.body || {};
  if (!autor || !titulo) return res.status(400).json({ error: "autor y titulo son obligatorios" });

  const [result]: any = await pool.query(
    "INSERT INTO obras (autor, titulo, anio, medidas, tecnica, precio_salida) VALUES (?,?,?,?,?,?)",
    [autor, titulo, anio ?? null, medidas ?? null, tecnica ?? null, precio_salida ?? null]
  );
  res.status(201).json({ id_obra: result.insertId });
});

export default router;
