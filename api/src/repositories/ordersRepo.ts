import { pool } from "../db/pool";
import { RowDataPacket, ResultSetHeader } from "mysql2";

/**
 * Helper function to safely parse JSON fields
 */
function safeJSONParse(value: any): any {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return value;
    }
  }
  return value;
}

// Enum de estados de orden
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing_shipment"
  | "shipped"
  | "delivered"
  | "pending_return"
  | "never_delivered"
  | "cancelled";

export interface Order {
  id_orden: number;
  order_number: string;
  id_user: string;
  user_email: string;
  user_name: string;
  id_direccion?: number;
  shipping_snapshot: any; // JSON
  items: any[]; // JSON array
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_intent_id?: string;
  tracking_number?: string;
  carrier?: string;
  tracking_link?: string;
  estimated_delivery?: Date;
  delivered_at?: Date;
  admin_notes?: string;
  return_reason?: string;
  customer_notes?: string;
  created_at: Date;
  updated_at: Date;
  paid_at?: Date;
  shipped_at?: Date;
}

export interface CreateOrderInput {
  id_user: string;
  user_email: string;
  user_name: string;
  id_direccion?: number;
  shipping_snapshot: any;
  items: any[];
  subtotal: number;
  shipping_cost?: number;
  tax?: number;
  total: number;
  payment_intent_id?: string;
  customer_notes?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  tracking_number?: string;
  carrier?: string;
  tracking_link?: string;
  estimated_delivery?: Date;
  admin_notes?: string;
  return_reason?: string;
}

export interface OrderStatusHistory {
  id_history: number;
  id_orden: number;
  status_from?: OrderStatus;
  status_to: OrderStatus;
  changed_by?: string;
  notes?: string;
  created_at: Date;
}

/**
 * Genera un número de orden único (ORD-2025-0001)
 */
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();

  // Obtener el último número de orden del año actual
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT order_number FROM ordenes
     WHERE order_number LIKE ?
     ORDER BY order_number DESC
     LIMIT 1`,
    [`ORD-${year}-%`]
  );

  let counter = 1;
  if (rows.length > 0) {
    const lastNumber = rows[0].order_number as string;
    const match = lastNumber.match(/ORD-\d{4}-(\d+)/);
    if (match) {
      counter = parseInt(match[1]) + 1;
    }
  }

  return `ORD-${year}-${counter.toString().padStart(4, '0')}`;
}

/**
 * Crea una nueva orden
 */
export async function create(data: CreateOrderInput): Promise<Order> {
  // Generar número de orden
  const orderNumber = await generateOrderNumber();

  // Asegurar que shipping_snapshot e items sean objetos antes de stringify
  const shippingSnapshot = typeof data.shipping_snapshot === 'string'
    ? data.shipping_snapshot
    : JSON.stringify(data.shipping_snapshot || {});

  const items = typeof data.items === 'string'
    ? data.items
    : JSON.stringify(data.items || []);

  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO ordenes (
      order_number, id_user, user_email, user_name, id_direccion,
      shipping_snapshot, items,
      subtotal, shipping_cost, tax, total,
      payment_intent_id, customer_notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      orderNumber,
      data.id_user,
      data.user_email,
      data.user_name,
      data.id_direccion || null,
      shippingSnapshot,
      items,
      data.subtotal,
      data.shipping_cost || 0,
      data.tax || 0,
      data.total,
      data.payment_intent_id || null,
      data.customer_notes || null,
    ]
  );

  return await findById(result.insertId) as Order;
}

/**
 * Busca una orden por ID
 */
export async function findById(id: number): Promise<Order | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM ordenes WHERE id_orden = ?`,
    [id]
  );

  if (rows.length === 0) return null;

  const order = rows[0] as Order;
  // Parsear JSON fields si son strings
  order.shipping_snapshot = safeJSONParse(order.shipping_snapshot);
  order.items = safeJSONParse(order.items);

  return order;
}

/**
 * Busca una orden por número de orden
 */
export async function findByOrderNumber(orderNumber: string): Promise<Order | null> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM ordenes WHERE order_number = ?`,
    [orderNumber]
  );

  if (rows.length === 0) return null;

  const order = rows[0] as Order;
  order.shipping_snapshot = safeJSONParse(order.shipping_snapshot);
  order.items = safeJSONParse(order.items);

  return order;
}

/**
 * Busca órdenes por email del usuario
 */
export async function findByUserEmail(email: string): Promise<Order[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM ordenes WHERE user_email = ? ORDER BY created_at DESC`,
    [email]
  );

  return rows.map((row) => {
    const order = row as Order;
    order.shipping_snapshot = safeJSONParse(order.shipping_snapshot);
    order.items = safeJSONParse(order.items);
    return order;
  });
}

/**
 * Busca órdenes por user ID
 */
export async function findByUserId(userId: string): Promise<Order[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM ordenes WHERE id_user = ? ORDER BY created_at DESC`,
    [userId]
  );

  return rows.map((row) => {
    const order = row as Order;
    order.shipping_snapshot = safeJSONParse(order.shipping_snapshot);
    order.items = safeJSONParse(order.items);
    return order;
  });
}

/**
 * Busca órdenes con filtros (para admin)
 */
export async function findAll(filters?: {
  status?: OrderStatus;
  userId?: string;
  search?: string; // Busca por order_number, user_email, user_name
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}): Promise<{ orders: Order[]; total: number }> {
  let query = `SELECT * FROM ordenes WHERE 1=1`;
  let countQuery = `SELECT COUNT(*) as total FROM ordenes WHERE 1=1`;
  const params: any[] = [];

  if (filters?.status) {
    query += ` AND status = ?`;
    countQuery += ` AND status = ?`;
    params.push(filters.status);
  }

  if (filters?.userId) {
    query += ` AND id_user = ?`;
    countQuery += ` AND id_user = ?`;
    params.push(filters.userId);
  }

  if (filters?.search) {
    query += ` AND (order_number LIKE ? OR user_email LIKE ? OR user_name LIKE ?)`;
    countQuery += ` AND (order_number LIKE ? OR user_email LIKE ? OR user_name LIKE ?)`;
    const searchTerm = `%${filters.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  if (filters?.dateFrom) {
    query += ` AND created_at >= ?`;
    countQuery += ` AND created_at >= ?`;
    params.push(filters.dateFrom);
  }

  if (filters?.dateTo) {
    query += ` AND created_at <= ?`;
    countQuery += ` AND created_at <= ?`;
    params.push(filters.dateTo);
  }

  // Get total count
  const [countRows] = await pool.query<RowDataPacket[]>(countQuery, params);
  const total = countRows[0].total;

  // Add ordering and pagination
  query += ` ORDER BY created_at DESC`;

  if (filters?.limit) {
    query += ` LIMIT ?`;
    params.push(filters.limit);
  }

  if (filters?.offset) {
    query += ` OFFSET ?`;
    params.push(filters.offset);
  }

  const [rows] = await pool.query<RowDataPacket[]>(query, params);

  const orders = rows.map((row) => {
    const order = row as Order;
    order.shipping_snapshot = safeJSONParse(order.shipping_snapshot);
    order.items = safeJSONParse(order.items);
    return order;
  });

  return { orders, total };
}

/**
 * Actualiza el estado de una orden
 */
export async function updateStatus(
  id: number,
  data: UpdateOrderStatusInput
): Promise<Order | null> {
  // Obtener el estado actual para registrar el cambio
  const currentOrder = await findById(id);
  if (!currentOrder) {
    return null;
  }

  const fields: string[] = ["status = ?"];
  const values: any[] = [data.status];

  // Actualizar timestamps según el nuevo estado
  if (data.status === "paid") {
    fields.push("paid_at = NOW()");
  } else if (data.status === "shipped") {
    fields.push("shipped_at = NOW()");
  } else if (data.status === "delivered") {
    fields.push("delivered_at = NOW()");
  }

  if (data.tracking_number !== undefined) {
    fields.push("tracking_number = ?");
    values.push(data.tracking_number);
  }

  if (data.carrier !== undefined) {
    fields.push("carrier = ?");
    values.push(data.carrier);
  }

  if (data.tracking_link !== undefined) {
    fields.push("tracking_link = ?");
    values.push(data.tracking_link);
  }

  if (data.estimated_delivery !== undefined) {
    fields.push("estimated_delivery = ?");
    values.push(data.estimated_delivery);
  }

  if (data.admin_notes !== undefined) {
    fields.push("admin_notes = ?");
    values.push(data.admin_notes);
  }

  if (data.return_reason !== undefined) {
    fields.push("return_reason = ?");
    values.push(data.return_reason);
  }

  values.push(id);

  // Actualizar la orden
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE ordenes SET ${fields.join(", ")} WHERE id_orden = ?`,
    values
  );

  if (result.affectedRows === 0) {
    return null;
  }

  // Registrar cambio de estado en el historial (solo si el estado cambió)
  if (currentOrder.status !== data.status) {
    await pool.query<ResultSetHeader>(
      `INSERT INTO order_status_history (id_orden, status_from, status_to, changed_by, notes)
       VALUES (?, ?, ?, 'system', ?)`,
      [id, currentOrder.status, data.status, data.admin_notes || null]
    );
  }

  return await findById(id);
}

/**
 * Marca una orden como pagada
 */
export async function markAsPaid(
  id: number,
  paymentIntentId: string
): Promise<Order | null> {
  // Obtener el estado actual
  const currentOrder = await findById(id);
  if (!currentOrder) {
    return null;
  }

  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE ordenes
     SET status = 'paid', payment_intent_id = ?, paid_at = NOW()
     WHERE id_orden = ?`,
    [paymentIntentId, id]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  // Registrar cambio de estado en el historial
  await pool.query<ResultSetHeader>(
    `INSERT INTO order_status_history (id_orden, status_from, status_to, changed_by, notes)
     VALUES (?, ?, 'paid', 'system', 'Pago confirmado')`,
    [id, currentOrder.status]
  );

  return await findById(id);
}

/**
 * Obtiene el historial de cambios de estado de una orden
 */
export async function getStatusHistory(orderId: number): Promise<OrderStatusHistory[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM order_status_history
     WHERE id_orden = ?
     ORDER BY created_at DESC`,
    [orderId]
  );

  return rows as OrderStatusHistory[];
}

/**
 * Obtiene estadísticas de órdenes (para dashboard admin)
 */
export async function getStats(): Promise<{
  total: number;
  pending: number;
  paid: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  total_revenue: number;
  recent_orders: Order[];
}> {
  // Total de órdenes
  const [totalRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as count FROM ordenes`
  );

  // Órdenes por estado
  const [statusRows] = await pool.query<RowDataPacket[]>(
    `SELECT status, COUNT(*) as count FROM ordenes GROUP BY status`
  );

  // Revenue total (solo órdenes pagadas y completadas)
  const [revenueRows] = await pool.query<RowDataPacket[]>(
    `SELECT COALESCE(SUM(total), 0) as total_revenue
     FROM ordenes
     WHERE status IN ('paid', 'processing_shipment', 'shipped', 'delivered')`
  );

  // Órdenes recientes (últimas 10)
  const [recentRows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM ordenes ORDER BY created_at DESC LIMIT 10`
  );

  const stats = {
    total: totalRows[0].count,
    pending: 0,
    paid: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    total_revenue: revenueRows[0].total_revenue,
    recent_orders: recentRows.map((row) => {
      const order = row as Order;
      order.shipping_snapshot = safeJSONParse(order.shipping_snapshot);
      order.items = safeJSONParse(order.items);
      return order;
    }),
  };

  // Mapear contadores por estado
  statusRows.forEach((row: any) => {
    const status = row.status;
    const count = row.count;

    switch (status) {
      case "pending":
        stats.pending = count;
        break;
      case "paid":
        stats.paid = count;
        break;
      case "processing_shipment":
        stats.processing = count;
        break;
      case "shipped":
        stats.shipped = count;
        break;
      case "delivered":
        stats.delivered = count;
        break;
      case "cancelled":
        stats.cancelled = count;
        break;
    }
  });

  return stats;
}

/**
 * Actualiza payment intent ID
 */
export async function updatePaymentIntent(
  id: number,
  paymentIntentId: string
): Promise<boolean> {
  const [result] = await pool.query<ResultSetHeader>(
    `UPDATE ordenes SET payment_intent_id = ? WHERE id_orden = ?`,
    [paymentIntentId, id]
  );

  return result.affectedRows > 0;
}

/**
 * Cancela una orden
 */
export async function cancelOrder(id: number, reason?: string): Promise<Order | null> {
  return await updateStatus(id, {
    status: "cancelled",
    admin_notes: reason,
  });
}

/**
 * Buscar todas las compras de un usuario por email (legacy - mantener por compatibilidad)
 */
export async function findOrdersByEmail(email: string) {
  return await findByUserEmail(email);
}

/**
 * Busca órdenes que contengan una obra específica
 * Útil para sincronización bidireccional orden-obra
 */
export async function findOrdersByObraId(obraId: number): Promise<Order[]> {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT * FROM ordenes
     WHERE JSON_SEARCH(items, 'one', ?, NULL, '$[*].id_obra') IS NOT NULL
     AND status NOT IN ('cancelled', 'delivered')
     ORDER BY created_at DESC`,
    [obraId.toString()]
  );

  return rows.map((row) => {
    const order = row as Order;
    order.shipping_snapshot = safeJSONParse(order.shipping_snapshot);
    order.items = safeJSONParse(order.items);
    return order;
  });
}
