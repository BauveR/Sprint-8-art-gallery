const BASE = "/api";

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
    const res = await fetch(`${BASE}${url}`, {
      method: "POST",
      body: form,
    });
    return handle<T>(res);
  },
};
