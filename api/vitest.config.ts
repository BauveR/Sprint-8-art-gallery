import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.{test,spec}.ts"], // ← detecta .test.ts y .spec.ts
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
