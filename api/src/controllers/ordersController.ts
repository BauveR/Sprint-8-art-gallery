import { Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import * as ordersService from "../services/ordersService";

/**
 * Obtener compras de un usuario
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
