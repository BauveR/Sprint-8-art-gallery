import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useCheckoutForm } from "../hooks/useCheckoutForm";
import { useStripePayment } from "../hooks/useStripePayment";
import { useAuth } from "../context/AuthContextFirebase";
import PublicLayout from "../components/layout/PublicLayout";
import AddressSelector from "../components/Checkout/AddressSelector";
import ShippingForm from "../components/Checkout/ShippingForm";
import PaymentForm from "../components/Checkout/PaymentForm";
import OrderSummary from "../components/Checkout/OrderSummary";
import OrderSuccess from "../components/Checkout/OrderSuccess";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../config/stripe";
import { toast } from "sonner";

function CheckoutForm() {
  const { items } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formData, selectedAddressId, handleChange, loadAddressData } = useCheckoutForm();
  const { processPayment, isProcessing, orderComplete, canProcess } = useStripePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canProcess) return;

    try {
      await processPayment(formData);
      toast.success("¡Compra realizada con éxito! Revisa tus pedidos para ver el estado de tu compra.");
    } catch (error: any) {
      toast.error(error.message || "Error al procesar el pago");
      console.error("Payment error:", error);
    }
  };

  // Redirigir si el carrito está vacío
  if (items.length === 0 && !orderComplete) {
    navigate("/cart");
    return null;
  }

  // Mostrar pantalla de éxito
  if (orderComplete) {
    return (
      <PublicLayout>
        <OrderSuccess />
      </PublicLayout>
    );
  }

  // Formulario de checkout
  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formularios de envío y pago */}
            <div className="lg:col-span-2 space-y-6">
              {user ? (
                <AddressSelector
                  formData={formData}
                  onChange={handleChange}
                  onSelectAddress={loadAddressData}
                />
              ) : (
                <>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Para guardar direcciones y tener un checkout más rápido, por favor{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="underline font-semibold hover:text-yellow-900 dark:hover:text-yellow-100"
                      >
                        inicia sesión
                      </button>
                    </p>
                  </div>
                  <ShippingForm formData={formData} onChange={handleChange} />
                </>
              )}
              <PaymentForm />
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <OrderSummary isProcessing={isProcessing} onSubmit={() => handleSubmit(new Event("submit") as any)} />
            </div>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
