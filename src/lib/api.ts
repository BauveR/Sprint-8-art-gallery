// src/lib/api.ts
const BASE = (import.meta as any)?.env?.VITE_API_URL?.replace(/\/+$/, "") || "/api";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // Intenta parsear JSON de error del backend; si no, texto plano
    let msg = "";
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const j = await res.json();
        msg = j.message || j.error || JSON.stringify(j);
      } else {
        msg = await res.text();
      }
    } catch {/* noop */}
    throw new Error(msg || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as any;
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? await res.json() : (await res.text()) as any;
}

function toQuery(params?: Record<string, any>): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `?${q}` : "";
}

export const api = {
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const res = await fetch(`${BASE}${url}${toQuery(params)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      // credentials: "include", // ← actívalo si usas cookies/sesión
    });
    return handle<T>(res);
  },
  async post<T>(url: string, body: any): Promise<T> {
    const res = await fetch(`${BASE}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      // credentials: "include",
    });
    return handle<T>(res);
  },
  async put<T>(url: string, body: any): Promise<T> {
    const res = await fetch(`${BASE}${url}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      // credentials: "include",
    });
    return handle<T>(res);
  },
  async del(url: string): Promise<void> {
    const res = await fetch(`${BASE}${url}`, { method: "DELETE" });
    return handle<void>(res);
  },
  async postForm<T>(url: string, form: FormData): Promise<T> {
    const res = await fetch(`${BASE}${url}`, { method: "POST", body: form });
    return handle<T>(res);
  },
};
