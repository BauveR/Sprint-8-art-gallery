import { Request, Response, NextFunction } from "express";

/**
 * Extrae y valida un ID numérico desde req.params
 */
export function parseIdParam(req: Request, paramName = "id"): number {
  const id = Number(req.params[paramName]);
  if (Number.isNaN(id) || id <= 0) {
    throw new Error("ID inválido");
  }
  return id;
}

/**
 * Wrapper para rutas async que maneja errores automáticamente
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
