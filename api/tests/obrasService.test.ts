import { describe, it, expect, vi, beforeEach } from "vitest";
import * as obrasService from "../src/services/obrasService";
import * as obrasRepo from "../src/repositories/obrasRepo";

vi.mock("../src/repositories/obrasRepo", () => ({
  insertObra: vi.fn(),
  findObraById: vi.fn(),
  listObrasEstadoActualPagedSorted: vi.fn(),
  countObrasEstadoActual: vi.fn(),
  listObrasEstadoActualSorted: vi.fn(),
  asignarTiendaTx: vi.fn(),
  sacarDeTiendaTx: vi.fn(),
  asignarExpo: vi.fn(),
  quitarExpo: vi.fn(),
}));

describe("obrasService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createObra lanza error si payload inválido (Zod)", async () => {
    await expect(
      obrasService.createObra({ autor: "", titulo: "" })
    ).rejects.toThrow();

    expect(obrasRepo.insertObra).not.toHaveBeenCalled();
  });

  it("createObra delega en repo.insertObra con payload válido", async () => {
    (obrasRepo.insertObra as unknown as vi.Mock).mockResolvedValue(123);

    const id = await obrasService.createObra({
      autor: "Picasso",
      titulo: "Guernica",
      anio: 1937,
      medidas: "349x776 cm",
      tecnica: "Óleo",
      precio_salida: 12345.67,
    });

    expect(id).toBe(123);
    expect(obrasRepo.insertObra).toHaveBeenCalledWith({
      autor: "Picasso",
      titulo: "Guernica",
      anio: 1937,
      medidas: "349x776 cm",
      tecnica: "Óleo",
      precio_salida: 12345.67,
    });
  });
});
