import { Request, Response } from "express";
import * as reservasService from "../services/reservasService";

/**
 * POST /api/reservas/add
 * Agrega una obra al carrito (crea reserva)
 */
export async function addToCart(req: Request, res: Response) {
  try {
    const { id_obra } = req.body;
    const userId = req.user?.uid || "anonymous";
    const sessionId = req.headers["x-session-id"] as string || req.sessionID;

    if (!id_obra) {
      return res.status(400).json({ error: "id_obra es requerido" });
    }

    const result = await reservasService.addToCart({
      id_obra: Number(id_obra),
      userId,
      sessionId,
    });

    res.json(result);
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    res.status(400).json({ error: error.message || "Error al agregar al carrito" });
  }
}

/**
 * DELETE /api/reservas/remove/:id_obra
 * Elimina una obra del carrito (libera reserva)
 */
export async function removeFromCart(req: Request, res: Response) {
  try {
    const { id_obra } = req.params;
    const userId = req.user?.uid || "anonymous";
    const sessionId = req.headers["x-session-id"] as string || req.sessionID;

    const result = await reservasService.removeFromCart({
      id_obra: Number(id_obra),
      userId,
      sessionId,
    });

    res.json(result);
  } catch (error: any) {
    console.error("Error removing from cart:", error);
    res.status(400).json({ error: error.message || "Error al eliminar del carrito" });
  }
}

/**
 * POST /api/reservas/validate
 * Valida disponibilidad de una obra
 */
export async function validateAvailability(req: Request, res: Response) {
  try {
    const { id_obra } = req.body;
    const userId = req.user?.uid || "anonymous";
    const sessionId = req.headers["x-session-id"] as string || req.sessionID;

    if (!id_obra) {
      return res.status(400).json({ error: "id_obra es requerido" });
    }

    const result = await reservasService.validateObraAvailability(
      Number(id_obra),
      userId,
      sessionId
    );

    res.json(result);
  } catch (error: any) {
    console.error("Error validating availability:", error);
    res.status(500).json({ error: "Error al validar disponibilidad" });
  }
}

/**
 * POST /api/reservas/validate-cart
 * Valida todas las obras en el carrito antes del checkout
 */
export async function validateCart(req: Request, res: Response) {
  try {
    const { obra_ids } = req.body;
    const userId = req.user?.uid || "anonymous";
    const sessionId = req.headers["x-session-id"] as string || req.sessionID;

    if (!Array.isArray(obra_ids) || obra_ids.length === 0) {
      return res.status(400).json({ error: "obra_ids debe ser un array no vacío" });
    }

    const result = await reservasService.validateCartBeforeCheckout(
      obra_ids.map(Number),
      userId,
      sessionId
    );

    if (!result.valid) {
      return res.status(409).json(result); // 409 Conflict
    }

    res.json(result);
  } catch (error: any) {
    console.error("Error validating cart:", error);
    res.status(500).json({ error: "Error al validar carrito" });
  }
}

/**
 * GET /api/reservas/my-cart
 * Obtiene las reservas activas del usuario
 */
export async function getMyCart(req: Request, res: Response) {
  try {
    const userId = req.user?.uid || "anonymous";
    const sessionId = req.headers["x-session-id"] as string || req.sessionID;

    const reservas = await reservasService.getUserCart(userId, sessionId);

    res.json({ reservas });
  } catch (error: any) {
    console.error("Error getting cart:", error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
}

/**
 * POST /api/reservas/cleanup
 * Limpia reservas expiradas (solo admin)
 */
export async function cleanupExpired(req: Request, res: Response) {
  try {
    // Verificar que el usuario sea admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const result = await reservasService.cleanupExpired();
    res.json(result);
  } catch (error: any) {
    console.error("Error cleaning up:", error);
    res.status(500).json({ error: "Error al limpiar reservas" });
  }
}

/**
 * DELETE /api/reservas/release-all
 * Libera todas las reservas del usuario
 */
export async function releaseAll(req: Request, res: Response) {
  try {
    const userId = req.user?.uid || "anonymous";
    const sessionId = req.headers["x-session-id"] as string || req.sessionID;

    const result = await reservasService.releaseAllReservations(userId, sessionId);

    res.json(result);
  } catch (error: any) {
    console.error("Error releasing reservations:", error);
    res.status(500).json({ error: "Error al liberar reservas" });
  }
}
