import { api as apiWithAuth } from "../api/clientWithAuth";
import { api } from "../api/client";
import { Expo, ExpoInput } from "../types";

export const exposService = {
  list: () => api.get<Expo[]>("/expos"), // Público - sin auth
  create: (input: ExpoInput) => apiWithAuth.post<{ id_expo: number }>("/expos", input), // Admin - con auth
  update: (id: number, input: ExpoInput) => apiWithAuth.put<{ ok: true }>(`/expos/${id}`, input), // Admin - con auth
  remove: (id: number) => apiWithAuth.del(`/expos/${id}`), // Admin - con auth
};
