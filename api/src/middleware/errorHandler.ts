import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    console.error("[ERROR] Validación fallida:", err.flatten());
    return res
      .status(400)
      .json({ error: "Validación fallida", details: err.flatten() });
  }
  const msg = err instanceof Error ? err.message : "Error interno";
  const code = msg.includes("no encontrada") ? 404 : 400;
  console.error(`[ERROR] ${code}:`, msg, err);
  return res.status(code).json({ error: msg });
}
