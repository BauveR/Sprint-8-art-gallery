import { auth } from "../config/firebase";

const BASE = import.meta.env.VITE_API_URL || "/api";

// Log para debug en desarrollo
console.log('[API Config WITH AUTH] Base URL:', BASE);
console.log('[API Config WITH AUTH] Environment:', import.meta.env.MODE);
console.log('[API Config WITH AUTH] Version: 2.1');

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    console.error(`[API Error] ${res.status} ${res.statusText}`, msg);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  // Intentar parsear JSON, pero capturar errores si es HTML
  try {
    return res.status === 204 ? (undefined as any) : await res.json();
  } catch (error) {
    const text = await res.text().catch(() => "");
    console.error('[API Error] Failed to parse JSON response:', text.substring(0, 200));
    throw new Error(`Invalid JSON response. Got HTML instead. Check API URL: ${BASE}`);
  }
}

function toQuery(params?: Record<string, any>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of entries) sp.set(k, String(v));
  return `?${sp.toString()}`;
}

// Obtener el token de Firebase
async function getAuthHeaders(): Promise<Record<string, string>> {
  // Esperar a que Firebase cargue el usuario actual si está disponible
  const user = auth.currentUser;

  // Si no hay usuario de inmediato, esperar un momento por si está cargando
  if (!user) {
    console.warn('[Auth] No immediate user, waiting for Firebase to load...');
    // Esperar 100ms por si Firebase está inicializando
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const currentUser = auth.currentUser;
  console.log('[Auth] Current user:', currentUser ? currentUser.email : 'NO USER');

  if (currentUser) {
    try {
      const token = await currentUser.getIdToken(true); // force refresh
      console.log('[Auth] Token obtained, length:', token.length);
      console.log('[Auth] Token (first 20 chars):', token.substring(0, 20) + '...');
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
    } catch (error) {
      console.error("[Auth] Error obteniendo token:", error);
      throw new Error("Failed to get authentication token");
    }
  } else {
    console.error('[Auth] No current user after wait - request will FAIL');
    throw new Error("User not authenticated");
  }
}

export const api = {
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const fullUrl = `${BASE}${url}${toQuery(params)}`;
    console.log(`[API GET] ${fullUrl}`);
    const headers = await getAuthHeaders();
    delete headers["Content-Type"]; // No necesario en GET
    const res = await fetch(fullUrl, { headers });
    console.log(`[API GET] Response status: ${res.status}`);
    return handle<T>(res);
  },

  async post<T>(url: string, body: any): Promise<T> {
    console.log(`[API POST] ${BASE}${url}`, body);
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE}${url}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    console.log(`[API POST] Response status:`, res.status);
    return handle<T>(res);
  },

  async put<T>(url: string, body: any): Promise<T> {
    console.log(`[API PUT] ${BASE}${url}`, body);
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE}${url}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    });
    console.log(`[API PUT] Response status:`, res.status);
    return handle<T>(res);
  },

  async del(url: string): Promise<void> {
    const headers = await getAuthHeaders();
    delete headers["Content-Type"];
    const res = await fetch(`${BASE}${url}`, { method: "DELETE", headers });
    return handle<void>(res);
  },

  async postForm<T>(url: string, form: FormData): Promise<T> {
    // Para FormData, no incluimos Content-Type (el browser lo agrega automáticamente)
    const user = auth.currentUser;
    const headers: Record<string, string> = {};

    if (user) {
      try {
        const token = await user.getIdToken();
        headers["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Error obteniendo token:", error);
      }
    }

    const res = await fetch(`${BASE}${url}`, {
      method: "POST",
      headers,
      body: form,
    });
    return handle<T>(res);
  },
};
