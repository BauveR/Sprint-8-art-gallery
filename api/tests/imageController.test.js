// tests/imageController.test.ts
import express from "express";
import request from "supertest";
import path from "path";
import fs from "fs";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock SOLO del servicio
vi.mock("../src/services/imagesService", () => ({
  getByObra: vi.fn(),
  addImagen: vi.fn(),
  deleteImagen: vi.fn(),
}));

// ❌ NO mockeamos el repo aquí
// vi.mock("../src/repositories/imageRepo", () => ({ deleteImagen: vi.fn() }));

import { upload, listByObra, uploadForObra, remove } from "../src/controllers/imagesController";
import * as imagesService from "../src/services/imagesService";
import * as imageRepo from "../src/repositories/imageRepo"; // ← mismo módulo que el controller

describe("imagesController", () => {
  const app = express();
  app.get("/api/obras/:id/imagenes", listByObra);
  app.post("/api/obras/:id/imagenes", upload.single("file"), uploadForObra);
  app.delete("/api/imagenes/:id", remove);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/obras/:id/imagenes devuelve listado", async () => {
    vi.mocked(imagesService.getByObra).mockResolvedValue([
      { id: 1, id_obra: 10, url: "/uploads/a.jpg", created_at: "2025-01-01 10:00:00" },
    ]);

    const res = await request(app).get("/api/obras/10/imagenes");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(imagesService.getByObra).toHaveBeenCalledWith(10);
  });

  it("POST /api/obras/:id/imagenes sube imagen y devuelve id+url", async () => {
    vi.mocked(imagesService.addImagen).mockResolvedValue({ id: 99, url: "/uploads/xx.jpg" });

    const fixturesDir = path.resolve(__dirname, "tests-fixtures");
    if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir, { recursive: true });
    const fakeImgPath = path.join(fixturesDir, "tiny.png");
    if (!fs.existsSync(fakeImgPath)) {
      fs.writeFileSync(fakeImgPath, Buffer.from([0x89, 0x50, 0x4E, 0x47]));
    }

    const res = await request(app)
      .post("/api/obras/5/imagenes")
      .attach("file", fakeImgPath);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 99, url: expect.stringMatching(/^\/uploads\//) });
    expect(imagesService.addImagen).toHaveBeenCalledWith(5, expect.stringMatching(/^\/uploads\//));
  });

  it("DELETE /api/imagenes/:id borra DB y archivo", async () => {
    vi.mocked(imagesService.deleteImagen).mockResolvedValue({
      id: 77,
      url: "/uploads/a.jpg",
    });

    // ✅ espía la función del repo y evita SQL real
    const delSpy = vi.spyOn(imageRepo, "deleteImagen").mockResolvedValue();

    // evita fallo si el archivo no existe
    vi.spyOn(fs.promises, "unlink").mockResolvedValueOnce();

    const res = await request(app).delete("/api/imagenes/77");
    expect(res.status).toBe(204);

    expect(imagesService.deleteImagen).toHaveBeenCalledWith(77);
    expect(delSpy).toHaveBeenCalledWith(77); 
  });
});
