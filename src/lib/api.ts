const BASE = "/api";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as any) : await res.json();
}

export const api = {
  async get<T>(url: string): Promise<T> {
    const res = await fetch(`${BASE}${url}`);
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
  // === NUEVO: multipart ===
  async postForm<T>(url: string, form: FormData): Promise<T> {
    const res = await fetch(`${BASE}${url}`, {
      method: "POST",
      body: form, // NO setear Content-Type: el navegador lo hace con boundary
    });
    return handle<T>(res);
  },
};
