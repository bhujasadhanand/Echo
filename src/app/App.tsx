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
import { useEffect, useState } from 'react';
import { bins as initialBins, type Bin } from './data/mockData';

type LiveNodeData = Partial<Record<'A' | 'B' | 'C', { fillLevel: number; timestamp?: string }>>;

type TelemetryItem = {
  binId: string;
  fillLevel: number;
  timestamp?: string;
  node?: string;
};

const DEFAULT_TELEMETRY_URL: string =
  typeof window !== 'undefined'
    ? `http://${window.location.hostname}:3001/api/telemetry`
    : 'http://localhost:3001/api/telemetry';

const TELEMETRY_URL: string =
  (import.meta as any).env?.VITE_TELEMETRY_URL ?? DEFAULT_TELEMETRY_URL;

function statusFromFill(fillLevel: number): Bin['status'] {
  if (fillLevel <= 30) return 'empty';
  if (fillLevel <= 80) return 'half';
  return 'full';
}

function formatLastUpdated(timestamp?: string): string {
  if (!timestamp) return 'Just now';
  const t = Date.parse(timestamp);
  if (Number.isNaN(t)) return 'Just now';

  const diffMs = Date.now() - t;
  const diffMin = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMin === 0) return 'Just now';
  if (diffMin === 1) return '1 min ago';
  return `${diffMin} mins ago`;
}

export default function App() {
  const [bins, setBins] = useState<Bin[]>(() => initialBins);
  const [espData, setEspData] = useState<LiveNodeData>({});

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(TELEMETRY_URL, { cache: 'no-store' });
        if (!res.ok) {
          console.warn('Telemetry fetch failed', res.status, res.statusText);
          return;
        }
        const data: unknown = await res.json();
        if (!Array.isArray(data)) {
          console.warn('Telemetry response is not an array');
          return;
        }

        const updates = new Map<string, TelemetryItem>();
        const nodes: LiveNodeData = {};
        for (const item of data) {
          if (!item || typeof item !== 'object') continue;
          const obj = item as Record<string, unknown>;
          if (typeof obj.binId !== 'string') continue;
          const fillLevel = Number(obj.fillLevel);
          if (!Number.isFinite(fillLevel)) continue;

          const timestamp = typeof obj.timestamp === 'string' ? obj.timestamp : undefined;

          const node =
            typeof obj.node === 'string' ? (obj.node as string).trim().toUpperCase() : undefined;
          if (node === 'A' || node === 'B' || node === 'C') {
            nodes[node] = {
              fillLevel: Math.max(0, Math.min(100, Math.round(fillLevel))),
              timestamp,
            };
          }
          updates.set(obj.binId, {
            binId: obj.binId,
            fillLevel,
            timestamp,
            node,
          });
        }

        if (cancelled) return;
        if (updates.size === 0) return;

        setEspData((prev) => {
          const next: LiveNodeData = { ...prev };
          if (nodes.A) next.A = nodes.A;
          if (nodes.B) next.B = nodes.B;
          if (nodes.C) next.C = nodes.C;
          return next;
        });

        setBins((prev) =>
          prev.map((bin) => {
            const u = updates.get(bin.id);
            if (!u) return bin;
            const fill = Math.max(0, Math.min(100, Math.round(u.fillLevel)));
            return {
              ...bin,
              fillLevel: fill,
              status: statusFromFill(fill),
              lastUpdated: formatLastUpdated(u.timestamp),
              priority: fill >= 85,
            };
          }),
        );
      } catch (e) {
        console.warn('Telemetry poll error', e);
      }
    };

    poll();
    const id = window.setInterval(poll, 2000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            {/* Dashboard Overview Section */}
            <section id="dashboard">
              <StatusCards bins={bins} />
              <div className="mt-6">
                <EspLiveDataTable data={espData} />
              </div>
            </section>

            {/* Bin Status Section */}
            <section id="status">
              <BinList bins={bins} />
            </section>

            <section id="map">
              <MapView bins={bins} />
            </section>

            <section id="workers">
              <WorkerAssignment bins={bins} />
            </section>

            <section id="history">
              <Card>
                <CardHeader>
                  <CardTitle>Collection History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { id: 'BIN-001', worker: 'Alice Chen', time: '2025-12-18 08:12', status: 'Completed' },
                      { id: 'BIN-004', worker: 'Bob Kim', time: '2025-12-18 07:45', status: 'Completed' },
                      { id: 'BIN-007', worker: 'Alice Chen', time: '2025-12-17 16:30', status: 'Completed' },
                      { id: 'BIN-003', worker: 'Carlos Ruiz', time: '2025-12-17 15:08', status: 'Completed' },
                      { id: 'BIN-009', worker: 'Bob Kim', time: '2025-12-17 13:22', status: 'Completed' },
                    ].map((entry) => (
                      <div key={`${entry.id}-${entry.time}`} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-gray-900">{entry.id}</div>
                          <div className="text-sm text-gray-600">{entry.worker}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-xs text-gray-500">{entry.time}</div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            {entry.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Analytics Section */}
            <section id="analytics">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Reports & Analytics</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Collection performance metrics and insights
                </p>
              </div>
              <Analytics />
            </section>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 pb-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>
                </div>
                <div className="flex items-center gap-4">
                  <span>Last sync: Just now</span>
                  <span className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
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