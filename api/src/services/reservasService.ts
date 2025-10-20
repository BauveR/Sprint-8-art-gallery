import * as reservasRepo from "../repositories/reservasRepo";
import { getObraById } from "./obrasService";

export interface AddToCartRequest {
  id_obra: number;
  userId: string;
  sessionId: string;
}

export interface CartValidationResult {
  available: boolean;
  message: string;
  reservedBy?: "self" | "other";
  expiresAt?: Date;
}

/**
 * Agrega una obra al carrito (crea reserva)
 */
export async function addToCart(data: AddToCartRequest) {
  // 1. Verificar que la obra existe
  const obra = await getObraById(data.id_obra);
  if (!obra) {
    throw new Error("Obra no encontrada");
  }

  // 2. Verificar estado de venta
  if (obra.estado_venta !== "disponible") {
    throw new Error(`Esta obra no está disponible (estado: ${obra.estado_venta})`);
  }

  // 3. Verificar si ya está reservada por este usuario
  const alreadyReserved = await reservasRepo.isObraReservedByUser(
    data.id_obra,
    data.userId,
    data.sessionId
  );

  if (alreadyReserved) {
    // Extender la reserva existente
    await reservasRepo.extendReserva(data.id_obra, data.userId, data.sessionId, 15);
    return { success: true, message: "Reserva extendida", extended: true };
  }

  // 4. Verificar si está reservada por otro usuario
  const reservedByOther = await reservasRepo.isObraReservedByOther(
    data.id_obra,
    data.userId,
    data.sessionId
  );

  if (reservedByOther) {
    throw new Error("Esta obra está en el carrito de otro usuario. Intenta más tarde.");
  }

  // 5. Crear nueva reserva
  const reserva = await reservasRepo.createReserva({
    id_obra: data.id_obra,
    id_user: data.userId,
    session_id: data.sessionId,
    minutes: 15, // 15 minutos de reserva
  });

  return {
    success: true,
    message: "Obra agregada al carrito",
    reserva,
    expiresAt: reserva.expires_at,
  };
}

/**
 * Elimina una obra del carrito (libera reserva)
 */
export async function removeFromCart(data: AddToCartRequest) {
  const deleted = await reservasRepo.deleteReserva(
    data.id_obra,
    data.userId,
    data.sessionId
  );

  if (!deleted) {
    throw new Error("No se encontró la reserva");
  }

  return { success: true, message: "Obra eliminada del carrito" };
}

/**
 * Valida disponibilidad de una obra
 */
export async function validateObraAvailability(
  id_obra: number,
  userId: string,
  sessionId: string
): Promise<CartValidationResult> {
  // 1. Verificar obra
  const obra = await getObraById(id_obra);
  if (!obra) {
    return { available: false, message: "Obra no encontrada" };
  }

  // 2. Verificar estado de venta
  if (obra.estado_venta !== "disponible") {
    return { available: false, message: `Obra ${obra.estado_venta}` };
  }

  // 3. Verificar si está reservada por este usuario
  const reservedByUser = await reservasRepo.isObraReservedByUser(
    id_obra,
    userId,
    sessionId
  );

  if (reservedByUser) {
    return {
      available: true,
      message: "Obra disponible (reservada por ti)",
      reservedBy: "self",
    };
  }

  // 4. Verificar si está reservada por otro usuario
  const reservedByOther = await reservasRepo.isObraReservedByOther(
    id_obra,
    userId,
    sessionId
  );

  if (reservedByOther) {
    return {
      available: false,
      message: "Obra en carrito de otro usuario",
      reservedBy: "other",
    };
  }

  return { available: true, message: "Obra disponible" };
}

/**
 * Valida todas las obras en el carrito antes del checkout
 */
export async function validateCartBeforeCheckout(
  obraIds: number[],
  userId: string,
  sessionId: string
) {
  const results = await Promise.all(
    obraIds.map(async (id) => {
      const validation = await validateObraAvailability(id, userId, sessionId);
      return { id_obra: id, ...validation };
    })
  );

  const unavailable = results.filter((r) => !r.available);

  if (unavailable.length > 0) {
    return {
      valid: false,
      message: `${unavailable.length} obra(s) no disponible(s)`,
      unavailableObras: unavailable,
    };
  }

  // Extender todas las reservas por 10 minutos más
  await Promise.all(
    obraIds.map((id) => reservasRepo.extendReserva(id, userId, sessionId, 10))
  );

  return { valid: true, message: "Todas las obras están disponibles" };
}

/**
 * Obtiene las reservas activas de un usuario
 */
export async function getUserCart(userId: string, sessionId: string) {
  return await reservasRepo.findUserReservas(userId, sessionId);
}

/**
 * Limpia reservas expiradas (cron job)
 */
export async function cleanupExpired() {
  const count = await reservasRepo.cleanupExpiredReservas();
  return { cleaned: count, message: `${count} reservas expiradas eliminadas` };
}

/**
 * Libera todas las reservas de un usuario (al completar compra)
 */
export async function releaseAllReservations(userId: string, sessionId: string) {
  const count = await reservasRepo.releaseAllUserReservas(userId, sessionId);
  return { released: count, message: `${count} reservas liberadas` };
}
