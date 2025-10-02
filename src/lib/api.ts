const BASE = "/api";

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.status === 204 ? (undefined as any) : await res.json();
}

function toQuery(params?: Record<string, any>): string {
  if (!params) return "";
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k,v]) => {
    if (v !== undefined && v !== null && v !== "") sp.set(k, String(v));
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const api = {
  get: async <T>(url: string, params?: Record<string, any>) =>
    handle<T>(await fetch(`${BASE}${url}${toQuery(params)}`)),
  post: async <T>(url: string, body: any) =>
    handle<T>(await fetch(`${BASE}${url}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })),
  put: async <T>(url: string, body: any) =>
    handle<T>(await fetch(`${BASE}${url}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })),
  del: async (url: string) =>
    handle<void>(await fetch(`${BASE}${url}`, { method: "DELETE" })),
  postForm: async <T>(url: string, form: FormData) =>
    handle<T>(await fetch(`${BASE}${url}`, { method: "POST", body: form })),
};
