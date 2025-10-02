// src/server.ts
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";
import { pool } from "./db/pool";

const app = express();
app.use(cors());
app.use(express.json());

// --- 🔒 Guardián: intercepta /api/health/db ANTES de todo ---
app.use(async (req: Request, res: Response, next: NextFunction) => {
  // Normaliza por si viene con querystring
  const pathname = req.path;               // e.g. "/api/health/db"
  const baseUrl  = req.baseUrl || "";      // por si lo monta un router
  const fullPath = (baseUrl + pathname) || req.originalUrl;

  if (req.method === "GET" && (pathname === "/api/health/db" || fullPath === "/api/health/db")) {
    try {
      await pool.query("SELECT 1");
      return res.json({ ok: true });
    } catch {
      return res.status(500).json({ ok: false, error: "DB unreachable" });
    }
  }
  next();
});

// Servir /uploads como estático
const UPLOAD_DIR = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(UPLOAD_DIR));

/** ---------- Health básico ---------- */
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

/** ---------- API principal ---------- */
app.use("/api", routes);

/** ---------- 404 SOLO para /api ---------- */
app.use("/api", (_req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

/** ---------- Manejador de errores ---------- */
app.use(errorHandler);

/** ---------- Arranque + apagado limpio ---------- */
const PORT = env.PORT;
const server = app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT}`);
});

async function shutdown(signal: string) {
  console.log(`\nRecibido ${signal}. Cerrando...`);
  try {
    await new Promise<void>((resolve, reject) =>
      server.close(err => (err ? reject(err) : resolve()))
    );
    await pool.end();
    console.log("Cierre OK.");
    process.exit(0);
  } catch (err) {
    console.error("Error al cerrar:", err);
    process.exit(1);
  }
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
