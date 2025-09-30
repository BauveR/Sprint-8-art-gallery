import { api } from "../lib/api";
import { Expo, ExpoInput } from "../types";

export const exposService = {
  list: () => api.get<Expo[]>("/expos"),
  create: (input: ExpoInput) => api.post<{ id_expo: number }>("/expos", input),
};
