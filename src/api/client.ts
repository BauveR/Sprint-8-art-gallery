const BASE = import.meta.env.VITE_API_URL || "/api";

// Log para debug en desarrollo
console.log('[API Config] Base URL:', BASE);
console.log('[API Config] Environment:', import.meta.env.MODE);

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    try {
      const errorData = await res.json();
      const errorMessage = errorData.error || errorData.message || `HTTP ${res.status}`;
      console.error(`[API Error] ${res.status} ${res.statusText}`, errorData);
      throw new Error(errorMessage);
    } catch (jsonError) {
      // Si no es JSON, usar el texto plano
      const msg = await res.text().catch(() => "");
      console.error(`[API Error] ${res.status} ${res.statusText}`, msg);
      throw new Error(msg || `HTTP ${res.status}`);
    }
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

export const api = {
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const fullUrl = `${BASE}${url}${toQuery(params)}`;
    console.log(`[API GET] ${fullUrl}`);
    const res = await fetch(fullUrl);
    console.log(`[API GET] Response status: ${res.status}`);
    return handle<T>(res);
  },
  async post<T>(url: string, body: any): Promise<T> {
    console.log(`[API POST] ${BASE}${url}`, body);
    const res = await fetch(`${BASE}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(`[API POST] Response status:`, res.status);
    return handle<T>(res);
  },
  async put<T>(url: string, body: any): Promise<T> {
    console.log(`[API PUT] ${BASE}${url}`, body);
    const res = await fetch(`${BASE}${url}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    console.log(`[API PUT] Response status:`, res.status);
    return handle<T>(res);
  },
  async del(url: string): Promise<void> {
    const res = await fetch(`${BASE}${url}`, { method: "DELETE" });
    return handle<void>(res);
  },
  async postForm<T>(url: string, form: FormData): Promise<T> {
    const res = await fetch(`${BASE}${url}`, {
      method: "POST",
      body: form,
    });
    return handle<T>(res);
  },
};
