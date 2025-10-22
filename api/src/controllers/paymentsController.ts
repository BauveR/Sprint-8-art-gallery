import { Request, Response } from "express";
import Stripe from "stripe";
import { asyncHandler } from "../utils/helpers";
import * as obrasService from "../services/obrasService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-09-30.clover",
});

/**
 * Crear Payment Intent de Stripe
 * POST /api/payments/create-payment-intent
 * Body: { items: Array<{ id_obra: number, titulo: string, precio: number }> }
 */
export const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items array is required" });
    }

    // Calcular el total
    const amount = items.reduce(
      (sum: number, item: any) => sum + Number(item.precio),
      0
    );

    // Stripe requiere el monto en centavos
    const amountInCents = Math.round(amount * 100);

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd", // Cambia según tu moneda
      metadata: {
        obra_ids: items.map((item: any) => item.id_obra).join(","),
        order_id: `ORDER_${Date.now()}`,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      paymentIntentId: paymentIntent.id,
    });
  }
);

/**
 * Confirmar pago exitoso
 * POST /api/payments/confirm
 * Body: { paymentIntentId: string, obra_ids: number[], buyer_name: string, buyer_email: string, shipping_data: object }
 */
export const confirmPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const { paymentIntentId, obra_ids, buyer_name, buyer_email, shipping_data } = req.body;

    if (!paymentIntentId || !obra_ids || !Array.isArray(obra_ids)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    // Verificar el pago con Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        error: "Payment not completed",
        status: paymentIntent.status,
      });
    }

    // Importar ordersService
    const ordersService = require("../services/ordersService");
    const obrasRepo = require("../repositories/obrasRepo");

    // Obtener información de las obras para la orden
    const obrasData = await Promise.all(
      obra_ids.map(async (id: number) => {
        const obra = await obrasRepo.findObraById(id);
        return {
          id_obra: id,
          titulo: obra?.titulo || "N/A",
          precio: Number(obra?.precio_salida) || 0,
          cantidad: 1,
        };
      })
    );

    const subtotal = obrasData.reduce((sum, item) => sum + item.precio, 0);

    // Obtener el ID del usuario autenticado (si existe)
    const userId = req.user?.uid || "anonymous";

    // Crear la orden en la tabla ordenes
    const order = await ordersService.createOrder({
      id_user: userId,
      user_email: buyer_email,
      user_name: buyer_name,
      subtotal,
      shipping_cost: 0,
      tax: 0,
      total: subtotal,
      payment_method: "stripe",
      payment_id: paymentIntentId,
      shipping_snapshot: shipping_data,
      items: obrasData,
      status: "paid",
    });

    // Actualizar el estado de las obras a "procesando_envio" con info del comprador
    for (const obraId of obra_ids) {
      await obrasService.updateObra(Number(obraId), {
        estado_venta: "procesando_envio",
        comprador_nombre: buyer_name || null,
        comprador_email: buyer_email || null,
        fecha_compra: new Date().toISOString().slice(0, 19).replace('T', ' '),
      });
    }

    res.json({
      success: true,
      message: "Payment confirmed and order created",
      paymentIntent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: paymentIntent.status,
      },
      order: {
        id: order.id_orden,
        order_number: order.order_number,
      },
    });
  }
);

/**
 * Webhook de Stripe para eventos
 * POST /api/payments/webhook
 */
export const stripeWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn("Stripe webhook secret not configured");
      return res.status(200).json({ received: true });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent succeeded:", paymentIntent.id);
        // Aquí puedes actualizar la base de datos, enviar emails, etc.
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent failed:", failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);
