"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
const routes_1 = __importDefault(require("../src/routes"));
// Mockeamos obrasService para controlar la respuesta
vitest_1.vi.mock("../src/services/obrasService", () => ({
    getObrasSorted: vitest_1.vi.fn().mockResolvedValue([{ id_obra: 1, autor: "A", titulo: "T" }]),
    getObrasPaged: vitest_1.vi.fn().mockResolvedValue({
        data: [{ id_obra: 1, autor: "A", titulo: "T" }],
        total: 1,
        page: 1,
        pageSize: 10,
    }),
}));
(0, vitest_1.describe)("API routes (integration-lite)", () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.get("/api/health", (_req, res) => res.json({ ok: true }));
    app.use("/api", routes_1.default);
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("GET /api/health -> ok", async () => {
        const res = await (0, supertest_1.default)(app).get("/api/health");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({ ok: true });
    });
    (0, vitest_1.it)("GET /api/obras sin paginación devuelve array", async () => {
        const res = await (0, supertest_1.default)(app).get("/api/obras");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual([{ id_obra: 1, autor: "A", titulo: "T" }]);
    });
    (0, vitest_1.it)("GET /api/obras con paginación devuelve objeto", async () => {
        const res = await (0, supertest_1.default)(app).get("/api/obras?page=1&pageSize=10");
        (0, vitest_1.expect)(res.status).toBe(200);
        (0, vitest_1.expect)(res.body).toEqual({
            data: [{ id_obra: 1, autor: "A", titulo: "T" }],
            total: 1,
            page: 1,
            pageSize: 10,
        });
    });
});
