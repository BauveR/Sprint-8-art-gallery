import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api as apiClient } from "@/api/clientWithAuth";

export interface DireccionEnvio {
  id_direccion: number;
  id_user: string;
  nombre_completo: string;
  telefono: string;
  email?: string;
  direccion: string;
  numero_exterior: string;
  numero_interior?: string;
  colonia: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
  pais: string;
  referencias?: string;
  es_predeterminada: boolean;
  alias?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDireccionInput {
  nombre_completo: string;
  telefono: string;
  email?: string;
  direccion: string;
  numero_exterior: string;
  numero_interior?: string;
  colonia: string;
  codigo_postal: string;
  ciudad: string;
  estado: string;
  pais?: string;
  referencias?: string;
  es_predeterminada?: boolean;
  alias?: string;
}

interface ApiResponse<T> {
  data: T;
}

/**
 * Hook para obtener todas las direcciones del usuario
 */
export function useDirecciones() {
  return useQuery({
    queryKey: ["direcciones"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<ApiResponse<DireccionEnvio[]>>("/direcciones");
        return response?.data || [];
      } catch (error) {
        console.error("Error fetching direcciones:", error);
        return [];
      }
    },
  });
}

/**
 * Hook para obtener la dirección predeterminada
 */
export function useDireccionPredeterminada() {
  return useQuery({
    queryKey: ["direcciones", "default"],
    queryFn: async () => {
      try {
        const response = await apiClient.get<ApiResponse<DireccionEnvio | null>>("/direcciones/default");
        return response?.data || null;
      } catch (error) {
        console.error("Error fetching default direccion:", error);
        return null;
      }
    },
  });
}

/**
 * Hook para obtener una dirección por ID
 */
export function useDireccion(id: number) {
  return useQuery({
    queryKey: ["direcciones", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<DireccionEnvio>>(`/direcciones/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook para crear una dirección
 */
export function useCreateDireccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (direccionData: CreateDireccionInput) => {
      const response = await apiClient.post<ApiResponse<DireccionEnvio>>("/direcciones", direccionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}

/**
 * Hook para actualizar una dirección
 */
export function useUpdateDireccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...direccionData
    }: Partial<CreateDireccionInput> & { id: number }) => {
      const response = await apiClient.put<ApiResponse<DireccionEnvio>>(`/direcciones/${id}`, direccionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}

/**
 * Hook para eliminar una dirección
 */
export function useDeleteDireccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.del(`/direcciones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}

/**
 * Hook para establecer una dirección como predeterminada
 */
export function useSetDefaultDireccion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.post<ApiResponse<DireccionEnvio>>(`/direcciones/${id}/set-default`, {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["direcciones"] });
    },
  });
}
