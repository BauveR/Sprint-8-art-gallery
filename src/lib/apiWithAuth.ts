import { auth } from "./firebase";

const BASE = import.meta.env.VITE_API_URL || "/api";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as any) : await res.json();
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
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
    } catch (error) {
      console.error("Error obteniendo token:", error);
    }
  }
  return { "Content-Type": "application/json" };
}

export const api = {
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const headers = await getAuthHeaders();
    delete headers["Content-Type"]; // No necesario en GET
    const res = await fetch(`${BASE}${url}${toQuery(params)}`, { headers });
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
