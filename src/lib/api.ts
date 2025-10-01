export const apiBase = "/api";

async function r(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || res.statusText);
  }
  return res.headers.get("content-type")?.includes("application/json")
    ? res.json()
    : res.text();
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) => {
    const url = new URL(apiBase + path, window.location.origin);
    Object.entries(params ?? {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
    return r(url.toString()) as Promise<T>;
  },
  post: <T>(path: string, body?: any) =>
    r(apiBase + path, { method: "POST", body: JSON.stringify(body ?? {}) }) as Promise<T>,
  put:  <T>(path: string, body?: any) =>
    r(apiBase + path, { method: "PUT", body: JSON.stringify(body ?? {}) }) as Promise<T>,
  del:  (path: string) =>
    r(apiBase + path, { method: "DELETE" }),
};
