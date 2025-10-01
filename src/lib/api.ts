const BASE = "/api";

function toQuery(params?: Record<string, any>) {
  if (!params) return "";
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") usp.set(k, String(v));
  });
  const s = usp.toString();
  return s ? `?${s}` : "";
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    // intenta parsear JSON con {error: "..."} por si tu API lo envía
    try {
      const maybe = JSON.parse(msg);
      if (maybe?.error) throw new Error(maybe.error);
    } catch {}
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as any) : await res.json();
}

export const api = {
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const res = await fetch(`${BASE}${url}${toQuery(params)}`);
    return handle<T>(res);
  },
  async post<T>(url: string, body: any): Promise<T> {
    const res = await fetch(`${BASE}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return handle<T>(res);
  },
  async put<T>(url: string, body: any): Promise<T> {
    const res = await fetch(`${BASE}${url}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
