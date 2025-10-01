"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const obrasService = __importStar(require("../src/services/obrasService"));
const obrasRepo = __importStar(require("../src/repositories/obrasRepo"));
vitest_1.vi.mock("../src/repositories/obrasRepo", () => ({
    insertObra: vitest_1.vi.fn(),
    findObraById: vitest_1.vi.fn(),
    listObrasEstadoActualPagedSorted: vitest_1.vi.fn(),
    countObrasEstadoActual: vitest_1.vi.fn(),
    listObrasEstadoActualSorted: vitest_1.vi.fn(),
    asignarTiendaTx: vitest_1.vi.fn(),
    sacarDeTiendaTx: vitest_1.vi.fn(),
    asignarExpo: vitest_1.vi.fn(),
    quitarExpo: vitest_1.vi.fn(),
}));
(0, vitest_1.describe)("obrasService", () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)("createObra lanza error si payload inválido (Zod)", async () => {
        await (0, vitest_1.expect)(obrasService.createObra({ autor: "", titulo: "" })).rejects.toThrow();
        (0, vitest_1.expect)(obrasRepo.insertObra).not.toHaveBeenCalled();
    });
    (0, vitest_1.it)("createObra delega en repo.insertObra con payload válido", async () => {
        obrasRepo.insertObra.mockResolvedValue(123);
        const id = await obrasService.createObra({
            autor: "Picasso",
            titulo: "Guernica",
            anio: 1937,
            medidas: "349x776 cm",
            tecnica: "Óleo",
            precio_salida: 12345.67,
        });
        (0, vitest_1.expect)(id).toBe(123);
        (0, vitest_1.expect)(obrasRepo.insertObra).toHaveBeenCalledWith({
            autor: "Picasso",
            titulo: "Guernica",
            anio: 1937,
            medidas: "349x776 cm",
            tecnica: "Óleo",
            precio_salida: 12345.67,
        });
    });
});
