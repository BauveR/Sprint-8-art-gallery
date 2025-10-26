/**
 * E2E Test: Upload Obra (Artwork)
 *
 * Tests the complete flow of creating an artwork:
 * 1. Admin authentication
 * 2. Create obra with valid data
 * 3. Verify obra was created
 * 4. Retrieve the created obra
 * 5. Cleanup: delete the created obra
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import express from "express";
import routes from "../src/routes";
import dotenv from "dotenv";

dotenv.config();

// Mock Firebase Admin Auth
vi.mock("../src/config/firebase-admin", () => ({
  initializeFirebaseAdmin: vi.fn(),
  getAuth: vi.fn(() => ({
    verifyIdToken: vi.fn().mockResolvedValue({
      uid: "test-admin-uid",
      email: "admin@test.com",
      role: "admin", // Custom claim
    }),
    getUserByEmail: vi.fn(),
    setCustomUserClaims: vi.fn(),
    getUser: vi.fn(),
  })),
}));

// Create test app
const app = express();
app.use(express.json());
app.use("/api", routes);

describe("E2E: Upload Obra", () => {
  let createdObraId: number;
  const adminToken = "fake-admin-token-for-testing";

  const testObra = {
    autor: "Test Artist",
    titulo: `Test Artwork ${Date.now()}`,
    anio: 2024,
    medidas: "100x80 cm",
    tecnica: "Óleo sobre lienzo",
    precio_salida: 5000,
    estado_venta: "disponible",
  };

  it("Step 1: Should create a new obra as admin", async () => {
    const response = await request(app)
      .post("/api/obras")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(testObra)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id_obra).toBeDefined();
    expect(typeof response.body.id_obra).toBe("number");
    expect(response.body.id_obra).toBeGreaterThan(0);

    createdObraId = response.body.id_obra;

    console.log(`✓ Obra created successfully with ID: ${createdObraId}`);
  });

  it("Step 2: Should retrieve the created obra from catalog", async () => {
    const response = await request(app)
      .get("/api/obras")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    const createdObra = response.body.find(
      (obra: { id_obra: number }) => obra.id_obra === createdObraId
    );

    expect(createdObra).toBeDefined();
    expect(createdObra.autor).toBe(testObra.autor);
    expect(createdObra.titulo).toBe(testObra.titulo);
    expect(Number(createdObra.anio)).toBe(testObra.anio);
    expect(createdObra.medidas).toBe(testObra.medidas);
    expect(createdObra.tecnica).toBe(testObra.tecnica);
    expect(Number(createdObra.precio_salida)).toBe(testObra.precio_salida);
    expect(createdObra.estado_venta).toBe(testObra.estado_venta);

    console.log(`✓ Verified obra in catalog: ${createdObra.titulo}`);
  });

  it("Step 3: Should update the created obra as admin", async () => {
    const updatedData = {
      precio_salida: 6000,
      tecnica: "Acrílico sobre lienzo",
    };

    const response = await request(app)
      .put(`/api/obras/${createdObraId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(updatedData)
      .expect(200);

    expect(response.body).toEqual({ ok: true });

    // Verify the update
    const getResponse = await request(app).get("/api/obras").expect(200);

    const updatedObra = getResponse.body.find(
      (obra: { id_obra: number }) => obra.id_obra === createdObraId
    );

    expect(updatedObra).toBeDefined();
    expect(Number(updatedObra.precio_salida)).toBe(updatedData.precio_salida);
    expect(updatedObra.tecnica).toBe(updatedData.tecnica);

    console.log(`✓ Updated obra: new price $${updatedData.precio_salida}`);
  });

  it("Step 4: Should fail to create obra without admin token", async () => {
    const response = await request(app)
      .post("/api/obras")
      .send(testObra)
      .expect(401);

    expect(response.body.error).toBeDefined();

    console.log(`✓ Non-authenticated request blocked: ${response.body.error}`);
  });

  it("Step 5: Should fail to create obra with invalid data", async () => {
    const invalidObra = {
      autor: "", // Invalid: empty string
      titulo: "Test",
    };

    const response = await request(app)
      .post("/api/obras")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(invalidObra);

    // Should return error status (400 or 500)
    expect(response.status).toBeGreaterThanOrEqual(400);

    console.log(`✓ Invalid data rejected with status: ${response.status}`);
  });

  it("Step 6: Cleanup - Delete the created obra as admin", async () => {
    await request(app)
      .delete(`/api/obras/${createdObraId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(204);

    console.log(`✓ Obra ${createdObraId} deleted successfully`);

    // Verify it's deleted
    const getResponse = await request(app).get("/api/obras").expect(200);

    const deletedObra = getResponse.body.find(
      (obra: { id_obra: number }) => obra.id_obra === createdObraId
    );

    expect(deletedObra).toBeUndefined();

    console.log(`✓ Verified obra is no longer in catalog`);
  });
});

/**
 * NOTES FOR RUNNING THIS TEST:
 *
 * 1. This test uses mocked Firebase Admin authentication
 * 2. The test creates a real obra in the database and cleans it up after
 * 3. Run with: npm test obra-upload.e2e.test.ts
 * 4. Ensure your test database is configured properly
 */
