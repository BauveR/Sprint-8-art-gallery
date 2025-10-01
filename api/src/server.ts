import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import routes from "./routes";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// === NUEVO: servir /uploads como estático ===
const UPLOAD_DIR = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/api/health", (_req: Request, res: Response) => res.json({ ok: true }));
app.use("/api", routes);

// Manejador de errores por defecto
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
