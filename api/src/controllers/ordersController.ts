import { Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import * as ordersService from "../services/ordersService";

/**
 * Obtener compras de un usuario por email (legacy)
 * GET /api/orders?email=user@example.com
 */
export const getOrdersByEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.query;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Email is required" });
    }

    const orders = await ordersService.getOrdersByEmail(email);
    res.json(orders);
  }
);

/**
 * Crear una nueva orden
 * POST /api/orders
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.uid;

  if (!userId) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const orderData = {
    ...req.body,
    id_user: userId,
  };

  const order = await ordersService.createOrder(orderData);

  res.status(201).json({
    success: true,
    message: "Orden creada exitosamente",
    data: order,
  });
});

/**
 * Obtener todas las órdenes con filtros (admin)
 * GET /api/orders/all
 */
export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    status: req.query.status as any,
    userId: req.query.userId as string,
    search: req.query.search as string,
    dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
    dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
    offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
  };

  const result = await ordersService.getAllOrders(filters);

  res.json({
    success: true,
    data: result.orders,
    total: result.total,
    page: Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1,
    pages: Math.ceil(result.total / (filters.limit || 50)),
  });
});

/**
 * Obtener una orden por ID
 * GET /api/orders/:id
 */
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: "ID de orden inválido" });
  }

  const order = await ordersService.getOrderById(orderId);

  res.json({
    success: true,
    data: order,
  });
});

/**
 * Obtener una orden por número
 * GET /api/orders/number/:orderNumber
 */
export const getOrderByNumber = asyncHandler(async (req: Request, res: Response) => {
  const { orderNumber } = req.params;

  const order = await ordersService.getOrderByNumber(orderNumber);

  res.json({
    success: true,
    data: order,
  });
});

/**
 * Obtener órdenes del usuario autenticado
 * GET /api/orders/my-orders
 */
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.uid;

  if (!userId) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  const orders = await ordersService.getUserOrders(userId);

  res.json({
    success: true,
    data: orders,
    count: orders.length,
  });
});

/**
 * Actualizar el estado de una orden (admin)
 * PUT /api/orders/:id/status
 */
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: "ID de orden inválido" });
  }

  const { status, tracking_number, carrier, estimated_delivery, admin_notes, return_reason } =
    req.body;

  if (!status) {
    return res.status(400).json({ error: "Estado es requerido" });
  }

  const order = await ordersService.updateOrderStatus(orderId, {
    status,
    tracking_number,
    carrier,
    estimated_delivery: estimated_delivery ? new Date(estimated_delivery) : undefined,
    admin_notes,
    return_reason,
  });

  res.json({
    success: true,
    message: "Estado de orden actualizado",
    data: order,
  });
});

/**
 * Obtener historial de cambios de estado de una orden
 * GET /api/orders/:id/history
 */
export const getOrderHistory = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: "ID de orden inválido" });
  }

  const history = await ordersService.getOrderHistory(orderId);

  res.json({
    success: true,
    data: history,
  });
});

/**
 * Obtener resumen de una orden con historial
 * GET /api/orders/:id/summary
 */
export const getOrderSummary = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: "ID de orden inválido" });
  }

  const summary = await ordersService.getOrderSummary(orderId);

  res.json({
    success: true,
    data: summary,
  });
});

/**
 * Obtener estadísticas de órdenes (admin)
 * GET /api/orders/stats
 */
export const getOrderStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await ordersService.getOrderStats();

  res.json({
    success: true,
    data: stats,
  });
});

/**
 * Cancelar una orden
 * POST /api/orders/:id/cancel
 */
export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: "ID de orden inválido" });
  }

  const { reason } = req.body;

  const order = await ordersService.cancelOrder(orderId, reason);

  res.json({
    success: true,
    message: "Orden cancelada exitosamente",
    data: order,
  });
});

/**
 * Marcar orden como pagada (webhook de Stripe)
 * POST /api/orders/:id/mark-paid
 */
export const markOrderAsPaid = asyncHandler(async (req: Request, res: Response) => {
  const orderId = parseInt(req.params.id);

  if (isNaN(orderId)) {
    return res.status(400).json({ error: "ID de orden inválido" });
  }

  const { payment_intent_id } = req.body;

  if (!payment_intent_id) {
    return res.status(400).json({ error: "payment_intent_id es requerido" });
  }

  const order = await ordersService.markOrderAsPaid(orderId, payment_intent_id);

  res.json({
    success: true,
    message: "Orden marcada como pagada",
    data: order,
  });
});
