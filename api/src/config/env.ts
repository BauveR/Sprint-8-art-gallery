// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_HOST: z.string().default("127.0.0.1"),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_NAME: z.string(),
  // opcional para futuros cors, etc.
  CORS_ORIGIN: z.string().optional(),
});

export const env = EnvSchema.parse(process.env);
