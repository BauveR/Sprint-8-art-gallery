import { api } from "../api/client";
import { Expo, ExpoInput } from "../types";

export const exposService = {
  list: () => api.get<Expo[]>("/expos"),
  create: (input: ExpoInput) => api.post<{ id_expo: number }>("/expos", input),
  update: (id: number, input: ExpoInput) => api.put<{ ok: true }>(`/expos/${id}`, input),
  remove: (id: number) => api.del(`/expos/${id}`),
};
