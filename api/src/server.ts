import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import dotenv from "dotenv";
import path from "path";
import { errorHandler } from "./middleware/errorHandler";
import { initializeFirebaseAdmin } from "./config/firebase-admin";

dotenv.config();

// Initialize Firebase Admin SDK
try {
  initializeFirebaseAdmin();
  console.log("[Server] Firebase Admin initialized successfully");
} catch (error) {
  console.error("[Server] Failed to initialize Firebase Admin:", error);
  // En desarrollo puedes continuar sin Firebase, en producción deberías fallar
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
}

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "http://localhost:5174", // Vite dev alternate
  "http://localhost:5175", // Vite dev alternate
  "http://localhost:5176", // Vite dev alternate
  "http://localhost:3000", // Local testing
  process.env.FRONTEND_URL || "", // URL de producción (configurar en Railway)
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin (como mobile apps o curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Servir /uploads como estático
const UPLOAD_DIR = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(UPLOAD_DIR));

// Healthcheck
app.get("/api/health", (_req: Request, res: Response) => res.json({ ok: true }));

// API routes
app.use("/api", routes);

// 404 para API (opcional)
app.use("/api", (_req, res) => res.status(404).json({ error: "Ruta no encontrada" }));

// Manejador de errores tipado (Zod + genérico)
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] Listening on 0.0.0.0:${PORT}`);
  console.log(`[Server] Health check: /api/health`);
});
