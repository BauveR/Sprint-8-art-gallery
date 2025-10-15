import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    const flattened = err.format();
    console.error("[ERROR] Validación fallida:", JSON.stringify(flattened, null, 2));

    // Crear mensaje más amigable
    const issues = err.issues;
    let friendlyMessage = "Error de validación";

    if (issues && issues.length > 0) {
      const firstError = issues[0];
      const field = firstError.path.join(".");
      const message = firstError.message;
      friendlyMessage = `${field}: ${message}`;
    }

    return res.status(400).json({
      error: friendlyMessage,
      details: flattened,
      validation_errors: issues
    });
  }

  const msg = err instanceof Error ? err.message : "Error interno";
  const code = msg.includes("no encontrada") ? 404 : 400;
  console.error(`[ERROR] ${code}:`, msg, err);
  return res.status(code).json({ error: msg });
}
