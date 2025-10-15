import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContextFirebase";
import { api } from "../api/client";
import { sendPaymentConfirmation } from "../config/emailjs";
import { CheckoutFormData } from "../types/forms";

export function useStripePayment() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const processPayment = async (formData: CheckoutFormData) => {
    if (!stripe || !elements) {
      throw new Error("Stripe no está inicializado");
    }

    setIsProcessing(true);

    try {
      // 1. Crear Payment Intent en el backend
      const paymentData = await api.post<{
        clientSecret: string;
        paymentIntentId: string;
        amount: number;
      }>("/payments/create-payment-intent", {
        items: items.map((item) => ({
          id_obra: item.obra.id_obra,
          titulo: item.obra.titulo,
          precio: item.obra.precio_salida,
        })),
      });

      // 2. Confirmar pago con Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.nombre,
              address: {
                line1: formData.direccion,
                city: formData.ciudad,
                postal_code: formData.codigoPostal,
              },
              phone: formData.telefono,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        // 3. Confirmar en el backend y actualizar estado de obras
        await api.post("/payments/confirm", {
          paymentIntentId: paymentData.paymentIntentId,
          obra_ids: items.map((item) => item.obra.id_obra),
          buyer_name: formData.nombre,
          buyer_email: user?.email || "",
        });

        // 4. Enviar email de confirmación de pago
        if (user?.email) {
          try {
            await sendPaymentConfirmation({
              to_email: user.email,
              to_name: formData.nombre,
              order_id: paymentData.paymentIntentId,
              total_amount: totalPrice,
              items: items.map((item) => ({
                titulo: item.obra.titulo,
                precio: Number(item.obra.precio_salida) || 0,
              })),
            });
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
            // No mostrar error al usuario, el pago fue exitoso
          }
        }

        setOrderComplete(true);
        clearCart();
        return true;
      }

      return false;
    } catch (error) {
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processPayment,
    isProcessing,
    orderComplete,
    canProcess: !!stripe && !!elements,
  };
}
