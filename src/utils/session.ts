/**
 * Utilidades para manejo de sesión del carrito
 * Centraliza la lógica de sessionId para evitar duplicación (DRY)
 */

export const SESSION_KEY = 'cart_session_id';

/**
 * Genera un ID de sesión único
 */
function generateSessionId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 11);
  return `session_${timestamp}_${randomPart}`;
}

/**
 * Obtiene el sessionId del localStorage o crea uno nuevo si no existe
 */
export function getOrCreateSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Limpia el sessionId del localStorage
 * Útil al completar una compra o cerrar sesión
 */
export function clearSessionId(): void {
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Verifica si existe un sessionId
 */
export function hasSessionId(): boolean {
  return localStorage.getItem(SESSION_KEY) !== null;
}
