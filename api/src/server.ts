import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import routes from "./routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api", routes);

// Error handler tipado correctamente y sin warnings por parámetros no usados
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // marcar como “usados” para no chocar con noUnusedParameters
  void _req;
  void _next;

  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
};

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
