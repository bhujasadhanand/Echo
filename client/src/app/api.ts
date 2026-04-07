/**
 * api.ts — Centralised API service layer.
 * All calls go through /api (proxied to Express on port 3001 by Vite dev server).
 */

import type {
  Bin,
  Worker,
  Alert,
  TelemetryItem,
  CollectionHistoryEntry,
} from './types';

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Bins ──────────────────────────────────────────────────────────────────
export const binsApi = {
  getAll: () => request<Bin[]>('/bins'),
  getOne: (id: string) => request<Bin>(`/bins/${id}`),
  update: (id: string, data: Partial<Bin>) =>
    request<Bin>(`/bins/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ── Workers ───────────────────────────────────────────────────────────────
export const workersApi = {
  getAll: () => request<Worker[]>('/workers'),
  assign: (workerId: string, binIds: string[]) =>
    request<{ success: boolean; worker: Worker }>('/workers/assign', {
      method: 'POST',
      body: JSON.stringify({ workerId, binIds }),
    }),
  complete: (workerId: string, binIds: string[]) =>
    request<{ success: boolean; message: string }>('/workers/complete', {
      method: 'POST',
      body: JSON.stringify({ workerId, binIds }),
    }),
};

// ── Alerts ────────────────────────────────────────────────────────────────
export const alertsApi = {
  getAll: () => request<Alert[]>('/alerts'),
  resolve: (id: string) =>
    request<{ success: boolean; alert: Alert }>(`/alerts/${id}/resolve`, { method: 'PUT' }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/alerts/${id}`, { method: 'DELETE' }),
};

// ── Telemetry ─────────────────────────────────────────────────────────────
export const telemetryApi = {
  getLatest: () => request<TelemetryItem[]>('/telemetry', { cache: 'no-store' }),
  post: (data: TelemetryItem | TelemetryItem[]) =>
    request<{ success: boolean }>('/telemetry', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ── Collection History ────────────────────────────────────────────────────
export const historyApi = {
  getRecent: (limit = 20) =>
    request<CollectionHistoryEntry[]>(`/history?limit=${limit}`),
};

// ── Status ────────────────────────────────────────────────────────────────
export const statusApi = {
  get: () =>
    request<{ status: string; db: string; timestamp: string; version: string }>('/status'),
};
