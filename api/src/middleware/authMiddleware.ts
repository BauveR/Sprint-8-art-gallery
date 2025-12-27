import { Request, Response, NextFunction } from "express";
import { getAuth } from "../config/firebase-admin";

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

    
    const decodedToken = await getAuth().verifyIdToken(token);

    
    const role = (decodedToken.role as string) || "user";

    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: role,
    };

    console.log(`[Auth] User ${decodedToken.email} authenticated with role: ${role}`);

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
    
  }

  next();
}

/**
 * Middleware para verificar que el usuario es admin
 * Debe usarse DESPUÉS de verifyFirebaseToken
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
    console.warn(`[Security] Non-admin user ${req.user.email} attempted to access admin endpoint`);
    res.status(403).json({
      error: "Admin access required",
      message: "You don't have permission to access this resource"
    });
    return;
  }

  console.log(`[Auth] Admin access granted to ${req.user.email}`);
  next();
}
