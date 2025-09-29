// src/services/api.ts
import axios from 'axios'
import type { ObraArte, ObraCreate, Tienda } from '../types/ObraArte'

// Usa .env si existe, si no fallback al localhost
const API_BASE_URL =
  (import.meta as any)?.env?.VITE_API_URL?.toString() ||
  'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

/* ============================
   Interceptors (debug/diagnóstico)
   ============================ */
api.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL ?? ''}${config.url ?? ''}`
  // eslint-disable-next-line no-console
  console.log('[API-REQ]', (config.method || 'get').toUpperCase(), fullUrl, {
    data: config.data,
  })
  return config
})

api.interceptors.response.use(
  (res) => {
    // eslint-disable-next-line no-console
    console.log('[API-RES]', res.status, res.config?.url)
    return res
  },
  (err) => {
    const status = err?.response?.status
    const url = err?.config?.url
    const payload = err?.response?.data || err?.message
    // eslint-disable-next-line no-console
    console.warn('[API-ERR]', status, url, payload)
    return Promise.reject(err)
  }
)

/* ============================
   Recursos: Obras
   ============================ */
export const obrasAPI = {
  getAll: () => api.get<ObraArte[]>('/obras'),
  getById: (id: number) => api.get<ObraArte>(`/obras/${id}`),
  getWithLocation: () => api.get<ObraArte[]>('/obras/ubicacion'),

  create: (obra: ObraCreate) => api.post<ObraArte>('/obras', obra),

  // ⚠️ IMPORTANTE: ruta correcta con el id interpolado
  update: (id: number, obra: Partial<ObraCreate>) =>
    api.put<ObraArte>(`/obras/${id}`, obra),

  delete: (id: number) =>
    api.delete<{ ok: boolean; id: number }>(`/obras/${id}`),

  getRelations: (id: number) =>
    api.get<{ tiendas: any[]; exposiciones: any[] }>(`/obras/${id}/relaciones`),

  linkStore: (
    id: number,
    payload: {
      id_tienda: number
      stock?: number
      precio_venta?: number
      codigo_inventario?: string
    }
  ) => api.post(`/obras/${id}/vincular/tienda`, payload),

  unlinkStore: (id: number, payload: { id_tienda: number }) =>
    api.delete(`/obras/${id}/vincular/tienda`, { data: payload }),

  linkExpo: (
    id: number,
    payload: { id_exposicion: number; ubicacion_en_exposicion?: string }
  ) => api.post(`/obras/${id}/vincular/exposicion`, payload),

  unlinkExpo: (id: number, payload: { id_exposicion: number }) =>
    api.delete(`/obras/${id}/vincular/exposicion`, { data: payload }),
}

/* ============================
   Recursos: Tiendas
   ============================ */
export const tiendasAPI = {
  getAll: () => api.get<Tienda[]>('/tiendas'),
  getOnline: () => api.get<Tienda[]>('/tiendas/online'),
}
