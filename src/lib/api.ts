const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = await res.json();
      msg = j?.error ?? msg;
    } catch {}
    throw new Error(`${res.status} ${msg}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

export const api = {
  async get<T>(path: string): Promise<T> {
    const r = await fetch(`/api${path}`);
    if (!r.ok) throw await parseError(r);
    return (await r.json()) as T;
  },
  async post<T>(path: string, body?: unknown): Promise<T> {
    const r = await fetch(`/api${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) throw await parseError(r);
    return (await r.json()) as T;
  },
  async put<T>(path: string, body?: unknown): Promise<T> {
    const r = await fetch(`/api${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) throw await parseError(r);
    return (await r.json()) as T;
  },
  async del(path: string): Promise<void> {
    const r = await fetch(`/api${path}`, { method: "DELETE" });
    if (!r.ok) throw await parseError(r);
  },
};

async function parseError(r: Response) {
  const t = await r.text().catch(() => "");
  try {
    const j = JSON.parse(t);
    return new Error(j?.error || j?.message || `HTTP ${r.status}`);
  } catch {
    return new Error(t || `HTTP ${r.status}`);
  }
}
