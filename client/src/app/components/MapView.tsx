import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Navigation } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import type { Bin } from '../types';

const markerPositions = [
  { x: 20, y: 15 }, { x: 60, y: 25 }, { x: 30, y: 45 }, { x: 75, y: 35 },
  { x: 15, y: 60 }, { x: 50, y: 55 }, { x: 70, y: 70 }, { x: 85, y: 20 },
  { x: 40, y: 80 }, { x: 45, y: 40 }, { x: 80, y: 65 }, { x: 25, y: 75 },
];

export function MapView({ bins = [] }: { bins?: Bin[] }) {
  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
  const [hoveredBinId, setHoveredBinId] = useState<string | null>(null);

  const fullBinRoutePoints = bins
    .map((bin, index) => ({ bin, index }))
    .filter(({ bin }) => bin.status === 'full')
    .map(({ index }) => markerPositions[index])
    .filter((p): p is { x: number; y: number } => Boolean(p));

  const rightAngleRoutePoints = (() => {
    if (fullBinRoutePoints.length <= 1) return fullBinRoutePoints;
    const points: { x: number; y: number }[] = [fullBinRoutePoints[0]];
    for (let i = 1; i < fullBinRoutePoints.length; i++) {
      const prev = points[points.length - 1];
      const next = fullBinRoutePoints[i];
      const mid = { x: next.x, y: prev.y };
      if (mid.x !== prev.x || mid.y !== prev.y) points.push(mid);
      const last = points[points.length - 1];
      if (next.x !== last.x || next.y !== last.y) points.push(next);
    }
    return points;
  })();

  const routePathD = rightAngleRoutePoints
    .map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'empty': return 'bg-green-500';
      case 'half':  return 'bg-yellow-500';
      case 'full':  return 'bg-red-500';
      default:      return 'bg-gray-500';
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'empty': return 'bg-green-100 text-green-800';
      case 'half':  return 'bg-yellow-100 text-yellow-800';
      case 'full':  return 'bg-red-100 text-red-800';
      default:      return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="size-5" />
          Map View - GPS Bin Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="relative h-[75vh] min-h-[520px] rounded-lg overflow-visible border-2 border-gray-200 bg-gradient-to-br from-blue-50 via-green-50 to-blue-50"
          onClick={() => { setSelectedBinId(null); setHoveredBinId(null); }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-300" />
              ))}
            </div>
          </div>

          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <filter id="routeGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g opacity="0.38" strokeLinecap="round" strokeLinejoin="round">
              <line x1="0" y1="18" x2="100" y2="18" stroke="#94a3b8" strokeWidth="1.4" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#94a3b8" strokeWidth="1.2" />
              <line x1="0" y1="66" x2="100" y2="66" stroke="#94a3b8" strokeWidth="1.3" />
              <line x1="18" y1="0" x2="18" y2="100" stroke="#a1a1aa" strokeWidth="1.0" />
              <line x1="42" y1="0" x2="42" y2="100" stroke="#a1a1aa" strokeWidth="1.0" />
              <line x1="68" y1="0" x2="68" y2="100" stroke="#a1a1aa" strokeWidth="1.0" />
              <line x1="10" y1="28" x2="92" y2="28" stroke="#cbd5e1" strokeWidth="0.9" />
              <line x1="8" y1="54" x2="96" y2="54" stroke="#cbd5e1" strokeWidth="0.9" />
            </g>
            {routePathD.length > 0 && (
              <g>
                <path d={routePathD} fill="none" stroke="#3a588aff" strokeOpacity="0.22" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <path className="map-route-animate" d={routePathD} fill="none" stroke="#0501806e" strokeWidth="1.2" strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </svg>

          {/* Zone labels */}
          <div className="absolute top-4 left-4 text-xs text-gray-500 font-medium">North District</div>
          <div className="absolute bottom-4 right-4 text-xs text-gray-500 font-medium">South District</div>
          <div className="absolute top-1/2 left-4 text-xs text-gray-500 font-medium -rotate-90">West Zone</div>
          <div className="absolute top-1/2 right-4 text-xs text-gray-500 font-medium rotate-90">East Zone</div>

          {/* Bin markers */}
          {bins.map((bin, index) => {
            const pos = markerPositions[index] || { x: 50, y: 50 };
            const isVisible = selectedBinId === bin.id || (!selectedBinId && hoveredBinId === bin.id);
            const preferBelow = pos.y < 22;
            const preferLeft  = pos.x < 22;
            const preferRight = pos.x > 78;
            const popupVerticalClass = preferBelow ? 'top-full mt-2' : 'bottom-full mb-2';
            const popupAlignClass = preferLeft ? 'left-0' : preferRight ? 'right-0 left-auto' : 'left-1/2 -translate-x-1/2';

            return (
              <div
                key={bin.id}
                className={`absolute group cursor-pointer ${isVisible ? 'z-50' : 'z-10'}`}
                style={{ top: `${pos.y}%`, left: `${pos.x}%` }}
                onMouseEnter={() => { if (!selectedBinId) setHoveredBinId(bin.id); }}
                onMouseLeave={() => { if (!selectedBinId) setHoveredBinId(null); }}
                onClick={(e) => { e.stopPropagation(); setHoveredBinId(null); setSelectedBinId((prev) => (prev === bin.id ? null : bin.id)); }}
              >
                <div className="relative">
                  <div className={`w-8 h-8 ${getStatusColor(bin.status)} rounded-full border-4 border-white shadow-lg transform transition-transform hover:scale-125 flex items-center justify-center`}>
                    <MapPin className="size-4 text-white" />
                  </div>
                  {bin.status === 'full' && (
                    <span className="absolute inset-0 w-8 h-8">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    </span>
                  )}
                  <div
                    className={`absolute ${popupVerticalClass} ${popupAlignClass} transition-opacity ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} z-50`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[220px]">
                      <div className="font-semibold text-gray-900 mb-2">{bin.id}</div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <div className="text-gray-900 text-xs">{bin.location}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Fill Level:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div className={`h-full rounded-full ${getStatusColor(bin.status)}`} style={{ width: `${bin.fillLevel}%` }} />
                            </div>
                            <span className="font-medium text-xs">{bin.fillLevel}%</span>
                          </div>
                        </div>
                        <Badge className={`${getBadgeColor(bin.status)} text-xs`}>
                          {bin.status === 'full' ? 'Full' : bin.status === 'half' ? 'Half Filled' : 'Empty'}
                        </Badge>
                        <Button
                          size="sm"
                          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs h-7"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            try { sessionStorage.setItem('workerAssignment.preselectBinId', bin.id); } catch { /* ignore */ }
                            setSelectedBinId(null); setHoveredBinId(null);
                            document.getElementById('workers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            toast(`Assign a worker for ${bin.id}`);
                          }}
                        >
                          Assign Worker
                        </Button>
                      </div>
                      {preferBelow ? (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1">
                          <div className="w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45" />
                        </div>
                      ) : (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                          <div className="w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Compass */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 border border-gray-200">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 flex items-center justify-center">
                <Navigation className="size-6 text-blue-600" style={{ transform: 'rotate(45deg)' }} />
              </div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700">N</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-400">S</div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">W</div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">E</div>
            </div>
          </div>

          {/* Coordinates */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded px-3 py-1.5 text-xs text-gray-600 font-mono border border-gray-200">
            40.7589°N, 73.9851°W
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 px-2">
          {[['bg-green-500', 'Empty (0–30%)'], ['bg-yellow-500', 'Half Filled (31–80%)'], ['bg-red-500', 'Full (81–100%)']].map(([color, label]) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-sm text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
