import { loadStripe } from '@stripe/stripe-js';

// Cargar Stripe con la public key
export const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY || ''
);
