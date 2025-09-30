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
  get: <T>(u: string) => http<T>(u),
  post: <T>(u: string, body?: any) =>
    http<T>(u, { method: "POST", body: JSON.stringify(body ?? {}) }),
  put: <T>(u: string, body?: any) =>
    http<T>(u, { method: "PUT", body: JSON.stringify(body ?? {}) }),
  del: (u: string) => http<void>(u, { method: "DELETE" }),
};
