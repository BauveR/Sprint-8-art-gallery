// tests/setup.ts
import { afterAll, beforeEach, vi } from "vitest";
import { pool } from "../src/db/pool";

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(async () => {
  try {
    await pool.end();
  } catch {
    // ignoramos errores de cierre si el pool ya no existe
  }
});
