import express from "express";
import request from "supertest";
import { describe, it, expect, vi, beforeEach } from "vitest";
import routes from "../src/routes";

// Mockeamos obrasService para controlar la respuesta
vi.mock("../src/services/obrasService", () => ({
  getObrasSorted: vi.fn().mockResolvedValue([{ id_obra: 1, autor: "A", titulo: "T" }]),
  getObrasPaged: vi.fn().mockResolvedValue({
    data: [{ id_obra: 1, autor: "A", titulo: "T" }],
    total: 1,
    page: 1,
    pageSize: 10,
  }),
}));

describe("API routes (integration-lite)", () => {
  const app = express();
  app.use(express.json());
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", routes);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/health -> ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });

  it("GET /api/obras sin paginación devuelve array", async () => {
    const res = await request(app).get("/api/obras");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id_obra: 1, autor: "A", titulo: "T" }]);
  });

  it("GET /api/obras con paginación devuelve objeto", async () => {
    const res = await request(app).get("/api/obras?page=1&pageSize=10");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [{ id_obra: 1, autor: "A", titulo: "T" }],
      total: 1,
      page: 1,
      pageSize: 10,
    });
  });
});
