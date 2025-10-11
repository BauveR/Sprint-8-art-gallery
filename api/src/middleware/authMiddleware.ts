import { Request, Response, NextFunction } from "express";
import { getAuth } from "../config/firebase-admin";

// Extender el tipo Request para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        role?: string;
      };
    }
  }
}

/**
 * Middleware para verificar el token de Firebase
 * El token debe venir en el header Authorization como "Bearer <token>"
 */
export async function verifyFirebaseToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "No authentication token provided" });
      return;
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      res.status(401).json({ error: "Invalid token format" });
      return;
    }

    // Verificar el token con Firebase Admin SDK
    const decodedToken = await getAuth().verifyIdToken(token);

    // Agregar información del usuario al request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || "user", // Puedes agregar custom claims en Firebase
    };

    next();
  } catch (error) {
    console.error("[Auth Middleware] Error verifying token:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Middleware opcional: solo verifica si hay token, pero no falla si no hay
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split("Bearer ")[1];
      const decodedToken = await getAuth().verifyIdToken(token);

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: decodedToken.role || "user",
      };
    }
  } catch (error) {
    console.error("[Optional Auth] Error verifying token:", error);
    // No fallar, simplemente continuar sin usuario
  }

  next();
}

/**
 * Middleware para verificar que el usuario es admin
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
}
