// Shared TypeScript types — mirror the Mongoose schemas on the server

export interface Bin {
  id: string;
  location: string;
  fillLevel: number;
  status: 'empty' | 'half' | 'full';
  lastUpdated: string;
  coordinates: [number, number];
  priority: boolean;
}

export interface Worker {
  id: string;
  name: string;
  status: 'available' | 'assigned' | 'in-progress';
  assignedBins?: string[];
}

export interface Alert {
  id: string;
  binId: string;
  message: string;
  severity: 'warning' | 'critical';
  timestamp: string;
  resolved?: boolean;
}

export interface TelemetryItem {
  binId: string;
  fillLevel: number;
  node?: string;
  timestamp?: string;
}

export interface CollectionHistoryEntry {
  _id?: string;
  binId: string;
  worker: string;
  status: string;
  collectedAt: string;
}

// Statistics types (still computed client-side from bin data)
export interface DailyFillData {
  day: string;
  count: number;
}

export interface FillLevelDistribution {
  name: string;
  value: number;
  color: string;
}

export interface CollectionEfficiency {
  todayCollected: number;
  pendingCollection: number;
  avgResponseTime: string;
  efficiency: number;
}
