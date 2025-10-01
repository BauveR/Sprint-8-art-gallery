import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import dotenv from "dotenv";
import path from "path";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
app.use(cors());
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
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
