import * as ordersRepo from "../repositories/ordersRepo";
import * as direccionesRepo from "../repositories/direccionesRepo";
import * as obrasService from "./obrasService";
import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderStatus,
} from "../repositories/ordersRepo";

/**
 * Valida la transición de estado
 */
function isValidStatusTransition(from: OrderStatus, to: OrderStatus): boolean {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ["paid", "cancelled"],
    paid: ["processing_shipment", "cancelled"],
    processing_shipment: ["shipped", "cancelled"],
    shipped: ["delivered", "never_delivered", "pending_return"],
    delivered: ["pending_return"],
    pending_return: ["cancelled"],
    never_delivered: ["processing_shipment", "cancelled"],
    cancelled: [], // No se puede cambiar desde cancelado
  };

  return validTransitions[from]?.includes(to) || false;
}

/**
 * Mapea el estado de la orden al estado de venta de la obra
 * Sincronización Orden → Obra
 */
function getObraStatusFromOrderStatus(orderStatus: OrderStatus): string | null {
  const statusMap: Record<OrderStatus, string | null> = {
    pending: null, // No actualizar obras si está pendiente
    paid: "procesando_envio",
    processing_shipment: "procesando_envio",
    shipped: "enviado",
    delivered: "entregado", // Corregido: era "vendido" pero el enum es "entregado"
    never_delivered: "nunca_entregado",
    pending_return: "pendiente_devolucion",
    cancelled: "disponible",
  };

  return statusMap[orderStatus];
}

/**
 * Mapea el estado de venta de la obra al estado de la orden
 * Sincronización Obra → Orden
 */
export function getOrderStatusFromObraStatus(obraStatus: string): OrderStatus | null {
  const statusMap: Record<string, OrderStatus | null> = {
    disponible: "cancelled", // Si una obra vuelve a disponible, la orden se cancela
    en_carrito: null, // No sincronizar desde carrito
    procesando_envio: "processing_shipment",
    enviado: "shipped",
    entregado: "delivered",
    pendiente_devolucion: "pending_return",
    nunca_entregado: "never_delivered",
  };

  return statusMap[obraStatus] || null;
}

/**
 * Crea una nueva orden
 */
export async function createOrder(data: CreateOrderInput) {
  // Validar que los items no estén vacíos
  if (!data.items || data.items.length === 0) {
    throw new Error("La orden debe contener al menos un item");
  }

  // Validar que el total sea correcto
  const calculatedSubtotal = data.items.reduce(
    (sum, item) => sum + item.precio * (item.cantidad || 1),
    0
  );

  if (Math.abs(calculatedSubtotal - data.subtotal) > 0.01) {
    throw new Error("El subtotal no coincide con los items");
  }

  const expectedTotal = data.subtotal + (data.shipping_cost || 0) + (data.tax || 0);
  if (Math.abs(expectedTotal - data.total) > 0.01) {
    throw new Error("El total no coincide con subtotal + envío + impuestos");
  }

  // Si se proporciona id_direccion, verificar que la dirección existe y pertenece al usuario
  if (data.id_direccion) {
    const direccion = await direccionesRepo.findById(data.id_direccion, data.id_user);
    if (!direccion) {
      throw new Error("Dirección de envío no encontrada o no pertenece al usuario");
    }
    // Usar la dirección completa como snapshot si no se proporcionó
    if (!data.shipping_snapshot) {
      data.shipping_snapshot = direccion;
    }
  }

  // Crear la orden
  const order = await ordersRepo.create(data);

  return order;
}

/**
 * Obtiene una orden por ID
 */
export async function getOrderById(id: number) {
  const order = await ordersRepo.findById(id);

  if (!order) {
    throw new Error("Orden no encontrada");
  }

  return order;
}

/**
 * Obtiene una orden por número
 */
export async function getOrderByNumber(orderNumber: string) {
  const order = await ordersRepo.findByOrderNumber(orderNumber);

  if (!order) {
    throw new Error("Orden no encontrada");
  }

  return order;
}

/**
 * Obtiene órdenes de un usuario
 */
export async function getUserOrders(userId: string) {
  return await ordersRepo.findByUserId(userId);
}

/**
 * Obtiene órdenes por email (legacy compatibility)
 */
export async function getOrdersByEmail(email: string) {
  return await ordersRepo.findByUserEmail(email);
}

/**
 * Obtiene todas las órdenes con filtros (admin)
 */
export async function getAllOrders(filters?: Parameters<typeof ordersRepo.findAll>[0]) {
  return await ordersRepo.findAll(filters);
}

/**
 * Actualiza el estado de una orden
 */
export async function updateOrderStatus(id: number, data: UpdateOrderStatusInput) {
  // Obtener la orden actual
  const order = await ordersRepo.findById(id);

  if (!order) {
    throw new Error("Orden no encontrada");
  }

  // Validación de transición de estado deshabilitada para permitir flexibilidad
  // La sincronización bidireccional orden-obra manejará la consistencia
  // if (!isValidStatusTransition(order.status, data.status)) {
  //   throw new Error(
  //     `Transición de estado inválida: ${order.status} → ${data.status}`
  //   );
  // }

  // Validaciones específicas por estado
  if (data.status === "shipped") {
    if (!data.tracking_number) {
      throw new Error("El número de seguimiento es requerido para marcar como enviado");
    }
    if (!data.carrier) {
      throw new Error("El transportista es requerido para marcar como enviado");
    }
  }

  if (data.status === "pending_return") {
    if (!data.return_reason) {
      throw new Error("La razón de devolución es requerida");
    }
  }

  // Actualizar el estado
  const updatedOrder = await ordersRepo.updateStatus(id, data);

  if (!updatedOrder) {
    throw new Error("No se pudo actualizar la orden");
  }

  // Sincronizar el estado de las obras con el nuevo estado de la orden
  const newObraStatus = getObraStatusFromOrderStatus(data.status);
  if (newObraStatus && updatedOrder.items && Array.isArray(updatedOrder.items)) {
    try {
      // Actualizar cada obra del pedido
      const updatePromises = updatedOrder.items.map((item: any) => {
        if (item.id_obra) {
          return obrasService.updateObra(Number(item.id_obra), {
            estado_venta: newObraStatus,
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updatePromises);
      console.log(`[Order ${updatedOrder.order_number}] Obras actualizadas a estado: ${newObraStatus}`);
    } catch (error) {
      console.error(`Error actualizando estado de obras para orden ${updatedOrder.order_number}:`, error);
      // No lanzar error para no fallar la actualización de la orden
    }
  }

  // TODO: Enviar notificación por email según el nuevo estado
  // await sendOrderStatusEmail(updatedOrder);

  return updatedOrder;
}

/**
 * Marca una orden como pagada
 */
export async function markOrderAsPaid(id: number, paymentIntentId: string) {
  const order = await ordersRepo.findById(id);

  if (!order) {
    throw new Error("Orden no encontrada");
  }

  if (order.status !== "pending") {
    throw new Error(`No se puede marcar como pagada una orden con estado: ${order.status}`);
  }

  const updatedOrder = await ordersRepo.markAsPaid(id, paymentIntentId);

  // TODO: Enviar email de confirmación de pago
  // await sendPaymentConfirmationEmail(updatedOrder);

  return updatedOrder;
}

/**
 * Obtiene el historial de una orden
 */
export async function getOrderHistory(id: number) {
  // Verificar que la orden existe
  await getOrderById(id);

  return await ordersRepo.getStatusHistory(id);
}

/**
 * Obtiene estadísticas de órdenes
 */
export async function getOrderStats() {
  return await ordersRepo.getStats();
}

/**
 * Cancela una orden
 */
export async function cancelOrder(id: number, reason?: string) {
  const order = await ordersRepo.findById(id);

  if (!order) {
    throw new Error("Orden no encontrada");
  }

  // Solo se pueden cancelar órdenes que no han sido enviadas
  if (["shipped", "delivered"].includes(order.status)) {
    throw new Error("No se puede cancelar una orden que ya fue enviada o entregada");
  }

  const updatedOrder = await ordersRepo.cancelOrder(id, reason);

  // TODO: Enviar email de cancelación
  // await sendCancellationEmail(updatedOrder);

  return updatedOrder;
}

/**
 * Valida que una orden puede ser creada con los items especificados
 */
export async function validateOrderItems(items: any[]): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  if (!items || items.length === 0) {
    errors.push("Debe incluir al menos un item");
    return { valid: false, errors };
  }

  for (const item of items) {
    if (!item.id_obra) {
      errors.push("Cada item debe tener un id_obra");
    }
    if (!item.precio || item.precio <= 0) {
      errors.push(`Item ${item.id_obra || "desconocido"} debe tener un precio válido`);
    }
    if (!item.titulo) {
      errors.push(`Item ${item.id_obra || "desconocido"} debe tener un título`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Placeholder para envío de emails según estado
 * TODO: Implementar con EmailJS
 */
async function sendOrderStatusEmail(order: any) {
  // Esta función se implementará cuando configuremos EmailJS
  console.log(`[Email] Enviando notificación de estado ${order.status} para orden ${order.order_number}`);
}

/**
 * Obtiene el resumen de una orden para mostrar al usuario
 */
export async function getOrderSummary(id: number) {
  const order = await getOrderById(id);
  const history = await ordersRepo.getStatusHistory(id);

  return {
    ...order,
    history,
  };
}

/**
 * Sincroniza el estado de las órdenes cuando cambia el estado de una obra
 * Sincronización Obra → Orden (bidireccional)
 */
export async function syncOrdersFromObraStatus(obraId: number, newObraStatus: string) {
  try {
    // Obtener el nuevo estado de orden basado en el estado de obra
    const newOrderStatus = getOrderStatusFromObraStatus(newObraStatus);

    if (!newOrderStatus) {
      // No hay mapeo para este estado de obra, no sincronizar
      return;
    }

    // Buscar todas las órdenes que contienen esta obra
    const orders = await ordersRepo.findOrdersByObraId(obraId);

    if (orders.length === 0) {
      return;
    }

    // Actualizar cada orden encontrada
    const updatePromises = orders.map(async (order) => {
      // Solo actualizar si el estado es diferente
      if (order.status !== newOrderStatus) {
        console.log(`[Sync Obra→Orden] Actualizando orden ${order.order_number} de ${order.status} a ${newOrderStatus} (obra ${obraId} cambió a ${newObraStatus})`);

        await ordersRepo.updateStatus(order.id_orden, {
          status: newOrderStatus,
        });
      }
    });

    await Promise.all(updatePromises);

    console.log(`[Sync Obra→Orden] ${orders.length} orden(es) sincronizada(s) para obra ${obraId}`);
  } catch (error) {
    console.error(`[Sync Obra→Orden] Error sincronizando órdenes para obra ${obraId}:`, error);
    // No lanzar error para no fallar la actualización de la obra
  }
}
