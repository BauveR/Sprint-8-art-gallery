import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
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

// Security: Helmet - Configure security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Permite imágenes de Cloudinary
  })
);

// Security: Rate Limiting - Prevent brute force and DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 requests por IP
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Solo 5 intentos de login por IP
  message: "Too many login attempts, please try again later.",
  skipSuccessfulRequests: true,
});

app.use("/api/", limiter);
app.use("/api/auth/", authLimiter); // Más restrictivo para auth

// CORS Configuration - Whitelist específica de dominios
const allowedOrigins = [
  "http://localhost:5173", // Vite dev
  "http://localhost:5174", // Vite dev alternate
  "http://localhost:5175", // Vite dev alternate
  "http://localhost:5176", // Vite dev alternate
  "http://localhost:3000", // Local testing
  process.env.FRONTEND_URL || "", // URL de producción configurada
  // Agregar URLs específicas de Vercel aquí (no wildcards)
  "https://sprint-8-art-gallery.vercel.app",
  "https://sprint-8-art-gallery-git-main.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir requests sin origin solo en desarrollo
      if (!origin && process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      // Verificar whitelist estricta
      if (allowedOrigins.includes(origin || "")) {
        return callback(null, true);
      }

      // Permitir URLs de preview de Vercel (formato: sprint-8-art-gallery-*.vercel.app)
      if (origin && /^https:\/\/sprint-8-art-gallery-[a-z0-9-]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      console.warn(`[CORS] Blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" })); // Limitar tamaño de payload

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
