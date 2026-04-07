/**
 * api.ts — Centralised API service layer.
 * All calls go through /api (proxied to Express on port 3001 by Vite dev server).
 */

const BASE = "/api";

async function request(path, init) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Bins ──────────────────────────────────────────────────────────────────
export const binsApi = {
  getAll: () => request("/bins"),
  getOne: (id) => request(`/bins/${id}`),
  update: (id, data) =>
    request(`/bins/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

// ── Workers ───────────────────────────────────────────────────────────────
export const workersApi = {
  getAll: () => request("/workers"),
  assign: (workerId, binIds) =>
    request("/workers/assign", {
      method: "POST",
      body: JSON.stringify({ workerId, binIds }),
    }),
  complete: (workerId, binIds) =>
    request("/workers/complete", {
      method: "POST",
      body: JSON.stringify({ workerId, binIds }),
    }),
};

// ── Alerts ────────────────────────────────────────────────────────────────
export const alertsApi = {
  getAll: () => request("/alerts"),
  resolve: (id) => request(`/alerts/${id}/resolve`, { method: "PUT" }),
  delete: (id) => request(`/alerts/${id}`, { method: "DELETE" }),
};

// ── Telemetry ─────────────────────────────────────────────────────────────
export const telemetryApi = {
  getLatest: () => request("/telemetry", { cache: "no-store" }),
  post: (data) =>
    request("/telemetry", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ── Collection History ────────────────────────────────────────────────────
export const historyApi = {
  getRecent: (limit = 20) => request(`/history?limit=${limit}`),
};

// ── Status ────────────────────────────────────────────────────────────────
export const statusApi = {
  get: () => request("/status"),
};
