import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { StatusCards } from './components/StatusCards';
import { BinList } from './components/BinList';
import { MapView } from './components/MapView';
import { WorkerAssignment } from './components/WorkerAssignment';
import { Analytics } from './components/Analytics';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Toaster } from 'sonner';
import { EspLiveDataTable } from './components/EspLiveDataTable';
import { useEffect, useState, useCallback } from 'react';
import { binsApi, telemetryApi, historyApi } from './api';
import type { Bin, TelemetryItem, CollectionHistoryEntry } from './types';

type LiveNodeData = Partial<Record<'A' | 'B' | 'C', { fillLevel: number; timestamp?: string }>>;

export default function App() {
  const [bins, setBins] = useState<Bin[]>([]);
  const [espData, setEspData] = useState<LiveNodeData>({});
  const [history, setHistory] = useState<CollectionHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Load initial bins from MongoDB ─────────────────────────────────────
  useEffect(() => {
    binsApi.getAll()
      .then((data) => setBins(data))
      .catch((err) => console.warn('Failed to load bins:', err))
      .finally(() => setLoading(false));
  }, []);

  // ── Load collection history ────────────────────────────────────────────
  useEffect(() => {
    historyApi.getRecent(10)
      .then(setHistory)
      .catch((err) => console.warn('Failed to load history:', err));
  }, []);

  // ── Poll telemetry every 2 seconds ────────────────────────────────────
  const applyTelemetry = useCallback((items: TelemetryItem[]) => {
    const nodes: LiveNodeData = {};
    const updates = new Map<string, TelemetryItem>();

    for (const item of items) {
      if (typeof item.binId !== 'string') continue;
      const fill = Number(item.fillLevel);
      if (!Number.isFinite(fill)) continue;
      const node = typeof item.node === 'string'
        ? (item.node.trim().toUpperCase() as 'A' | 'B' | 'C')
        : undefined;
      if (node === 'A' || node === 'B' || node === 'C') {
        nodes[node] = { fillLevel: Math.max(0, Math.min(100, Math.round(fill))), timestamp: item.timestamp };
      }
      updates.set(item.binId, item);
    }

    if (Object.keys(nodes).length > 0) {
      setEspData((prev) => ({ ...prev, ...nodes }));
    }

    if (updates.size > 0) {
      setBins((prev) =>
        prev.map((bin) => {
          const u = updates.get(bin.id);
          if (!u) return bin;
          const fill = Math.max(0, Math.min(100, Math.round(Number(u.fillLevel))));
          const status: Bin['status'] = fill <= 30 ? 'empty' : fill <= 80 ? 'half' : 'full';
          return { ...bin, fillLevel: fill, status, priority: fill >= 85, lastUpdated: 'Just now' };
        })
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const data = await telemetryApi.getLatest();
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          applyTelemetry(data);
        }
      } catch {
        // silently ignore poll errors
      }
    };
    poll();
    const id = window.setInterval(poll, 2000);
    return () => { cancelled = true; window.clearInterval(id); };
  }, [applyTelemetry]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const formatCollectedAt = (iso: string) => {
    try {
      return new Date(iso).toLocaleString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false,
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar onNavigate={scrollToSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Dashboard Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">

            {/* Dashboard Overview */}
            <section id="dashboard">
              {loading ? (
                <div className="text-center py-10 text-gray-500 animate-pulse">Loading bin data…</div>
              ) : (
                <>
                  <StatusCards bins={bins} />
                  <div className="mt-6">
                    <EspLiveDataTable data={espData} />
                  </div>
                </>
              )}
            </section>

            {/* Bin Status */}
            <section id="status">
              <BinList bins={bins} />
            </section>

            {/* Map */}
            <section id="map">
              <MapView bins={bins} />
            </section>

            {/* Worker Assignment */}
            <section id="workers">
              <WorkerAssignment bins={bins} onCollectionComplete={() => {
                binsApi.getAll().then(setBins).catch(console.warn);
                historyApi.getRecent(10).then(setHistory).catch(console.warn);
              }} />
            </section>

            {/* Collection History */}
            <section id="history">
              <Card>
                <CardHeader>
                  <CardTitle>Collection History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {history.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-4">No collection history yet.</div>
                    ) : (
                      history.map((entry, i) => (
                        <div
                          key={entry._id ?? i}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-sm font-medium text-gray-900">{entry.binId}</div>
                            <div className="text-sm text-gray-600">{entry.worker}</div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-xs text-gray-500">{formatCollectedAt(entry.collectedAt)}</div>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                              {entry.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Analytics */}
            <section id="analytics">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Reports &amp; Analytics</h2>
                <p className="text-sm text-gray-600 mt-1">Collection performance metrics and insights</p>
              </div>
              <Analytics bins={bins} />
            </section>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 pb-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div />
                <div className="flex items-center gap-4">
                  <span>Last sync: Just now</span>
                  <span className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    System Online
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}
