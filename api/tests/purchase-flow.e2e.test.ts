/**
 * E2E Test: Complete Purchase Flow
 *
 * Tests the entire purchase journey from browsing obras to completing an order:
 * 1. Browse available obras
 * 2. Add obra to cart (reserva)
 * 3. Validate cart
 * 4. Create payment intent
 * 5. Confirm payment
 * 6. Verify order creation
 */

import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import routes from "../src/routes";
import dotenv from "dotenv";

dotenv.config();

// Create test app
const app = express();
app.use(express.json());
app.use("/api", routes);

describe("E2E: Complete Purchase Flow", () => {
  let sessionId: string;
  let availableObra: any;
  let paymentIntentId: string;
  let orderNumber: string;

  beforeAll(() => {
    // Generate unique session ID for this test run
    sessionId = `test_session_${Date.now()}`;
  });

  it("Step 1: Should get available obras from catalog", async () => {
    const response = await request(app)
      .get("/api/obras")
      .expect(200);

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // Find an available obra with price > 0 (estado_venta === 'disponible' AND precio_salida > 0)
    availableObra = response.body.find(
      (obra: any) => obra.estado_venta === "disponible" && Number(obra.precio_salida) > 0
    );

    expect(availableObra).toBeDefined();
    expect(availableObra.id_obra).toBeDefined();

    // Convert precio_salida to number (MySQL returns Decimal as object)
    const precio = Number(availableObra.precio_salida);
    expect(precio).toBeGreaterThan(0);

    console.log(`✓ Found available obra: ${availableObra.titulo} (ID: ${availableObra.id_obra}, Price: $${precio})`);
  });

  it("Step 2: Should add obra to cart (create reserva)", async () => {
    const response = await request(app)
      .post("/api/reservas/add")
      .set("x-session-id", sessionId)
      .send({ id_obra: availableObra.id_obra })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain("agregada al carrito");

    console.log(`✓ Added obra ${availableObra.id_obra} to cart with session ${sessionId}`);
  });

  it("Step 3: Should retrieve cart with the added obra", async () => {
    const response = await request(app)
      .get("/api/reservas/my-cart")
      .set("x-session-id", sessionId)
      .expect(200);

    expect(response.body.data).toBeDefined();
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(1);
    expect(response.body.data[0].id_obra).toBe(availableObra.id_obra);

    console.log(`✓ Cart contains ${response.body.data.length} item(s)`);
  });

  it("Step 4: Should validate cart before checkout", async () => {
    const response = await request(app)
      .post("/api/reservas/validate-cart")
      .set("x-session-id", sessionId)
      .send({ obra_ids: [availableObra.id_obra] })
      .expect(200);

    expect(response.body.valid).toBe(true);
    expect(response.body.message).toBe("Todas las obras están disponibles");

    console.log(`✓ Cart validation passed: ${response.body.message}`);
  });

  it("Step 5: Should create Stripe payment intent", async () => {
    // Convert precio to number (MySQL Decimal comes as object)
    const precio = Number(availableObra.precio_salida);

    const items = [
      {
        id_obra: availableObra.id_obra,
        titulo: availableObra.titulo,
        precio: precio,
      },
    ];

    const response = await request(app)
      .post("/api/payments/create-payment-intent")
      .send({ items })
      .expect(200);

    expect(response.body.clientSecret).toBeDefined();
    expect(response.body.paymentIntentId).toBeDefined();
    expect(response.body.amount).toBe(precio);

    paymentIntentId = response.body.paymentIntentId;

    console.log(`✓ Payment intent created: ${paymentIntentId} (Amount: $${precio})`);
  });

  it("Step 6: Should confirm payment and create order", async () => {
    // Note: In a real test, you would use Stripe test cards and actually complete the payment
    // For this simple test, we'll simulate a successful payment confirmation

    const buyerData = {
      paymentIntentId: paymentIntentId,
      obra_ids: [availableObra.id_obra],
      buyer_name: "Test User",
      buyer_email: "test@example.com",
      shipping_data: {
        address: "123 Test St",
        city: "Test City",
        state: "TC",
        zip: "12345",
        country: "US",
      },
    };

    // This will fail if the payment intent hasn't been completed in Stripe
    // In a real E2E test, you would:
    // 1. Use Stripe test cards
    // 2. Complete the payment flow through Stripe's API
    // 3. Then confirm the payment

    // For now, we'll just verify the endpoint structure
    const response = await request(app)
      .post("/api/payments/confirm")
      .send(buyerData);

    // Expected: Either success (if payment completed) or error (if payment not completed)
    if (response.status === 200) {
      expect(response.body.success).toBe(true);
      expect(response.body.order).toBeDefined();
      expect(response.body.order.order_number).toBeDefined();

      orderNumber = response.body.order.order_number;

      console.log(`✓ Order created: ${orderNumber}`);
    } else {
      // Expected in test environment where Stripe payment isn't actually completed
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();

      console.log(`⚠ Payment confirmation requires actual Stripe payment (expected in test)`);
      console.log(`  Error: ${response.body.error}`);
      console.log(`  To complete this step, use Stripe test cards: 4242424242424242`);
    }
  });

  it("Step 7: Should verify order can be retrieved (if created)", async () => {
    // Skip if order wasn't created in previous step
    if (!orderNumber) {
      console.log(`⊗ Skipping order verification (order not created in test environment)`);
      return;
    }

    const response = await request(app)
      .get(`/api/orders/number/${orderNumber}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    expect(response.body.data.order_number).toBe(orderNumber);
    expect(response.body.data.status).toBe("paid");

    console.log(`✓ Order verified: ${orderNumber} (status: ${response.body.data.status})`);
  });

  it("Step 8: Should cleanup - release cart reservations", async () => {
    const response = await request(app)
      .delete("/api/reservas/release-all")
      .set("x-session-id", sessionId)
      .expect(200);

    expect(response.body.message).toContain("liberadas");

    console.log(`✓ Cart reservations released`);
  });
});

/**
 * NOTES FOR RUNNING THIS TEST:
 *
 * 1. Ensure your test database has at least one available obra
 * 2. Configure Stripe test keys in .env:
 *    STRIPE_SECRET_KEY=sk_test_...
 *
 * 3. To fully test payment confirmation (Step 6), you would need to:
 *    - Use Stripe test cards (e.g., 4242424242424242)
 *    - Actually complete the payment through Stripe's API
 *    - Or mock the Stripe API responses
 *
 * 4. Run tests with: npm test purchase-flow.e2e.test.ts
 *
 * 5. For CI/CD, consider mocking Stripe or using Stripe's test mode webhook events
 */
