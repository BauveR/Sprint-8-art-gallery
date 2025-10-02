// src/routes/health.ts
import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

// Health básico: GET /api/health
router.get("/", (_req, res) => {
  res.json({ ok: true });
});

// Health DB: GET /api/health/db
router.get("/db", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch {
    res.status(500).json({ ok: false, error: "DB unreachable" });
  }
});

export default router;
