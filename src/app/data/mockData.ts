// Mock data for the Smart Waste Management Dashboard

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
}

// Generate realistic bin data
export const bins: Bin[] = [
  { id: 'BIN-001', location: 'Park Avenue, Block A', fillLevel: 15, status: 'empty', lastUpdated: '10 mins ago', coordinates: [40.7589, -73.9851], priority: false },
  { id: 'BIN-002', location: 'Main Street, Downtown', fillLevel: 48, status: 'half', lastUpdated: '25 mins ago', coordinates: [40.7614, -73.9776], priority: false },
  { id: 'BIN-003', location: 'Oak Street, Residential Area', fillLevel: 92, status: 'full', lastUpdated: '5 mins ago', coordinates: [40.7549, -73.9840], priority: true },
  { id: 'BIN-004', location: 'Central Market, Zone 2', fillLevel: 88, status: 'full', lastUpdated: '15 mins ago', coordinates: [40.7580, -73.9855], priority: true },
  { id: 'BIN-005', location: 'River Road, North District', fillLevel: 22, status: 'empty', lastUpdated: '1 hour ago', coordinates: [40.7625, -73.9735], priority: false },
  { id: 'BIN-006', location: 'School Street, East Zone', fillLevel: 55, status: 'half', lastUpdated: '30 mins ago', coordinates: [40.7570, -73.9810], priority: false },
  { id: 'BIN-007', location: 'Hospital Road, Medical District', fillLevel: 95, status: 'full', lastUpdated: '8 mins ago', coordinates: [40.7595, -73.9765], priority: true },
  { id: 'BIN-008', location: 'Beach Avenue, Coastal Area', fillLevel: 10, status: 'empty', lastUpdated: '45 mins ago', coordinates: [40.7560, -73.9890], priority: false },
  { id: 'BIN-009', location: 'Garden Lane, Suburb', fillLevel: 67, status: 'half', lastUpdated: '20 mins ago', coordinates: [40.7610, -73.9800], priority: false },
  { id: 'BIN-010', location: 'Station Square, Transport Hub', fillLevel: 78, status: 'half', lastUpdated: '12 mins ago', coordinates: [40.7555, -73.9820], priority: false },
  { id: 'BIN-011', location: 'Mall Complex, Shopping District', fillLevel: 94, status: 'full', lastUpdated: '3 mins ago', coordinates: [40.7600, -73.9830], priority: true },
  { id: 'BIN-012', location: 'Library Street, Academic Zone', fillLevel: 35, status: 'half', lastUpdated: '50 mins ago', coordinates: [40.7575, -73.9795], priority: false },
];

export const workers: Worker[] = [
  { id: 'WKR-001', name: 'John Smith', status: 'available' },
  { id: 'WKR-002', name: 'Maria Garcia', status: 'in-progress', assignedBins: ['BIN-007', 'BIN-011'] },
  { id: 'WKR-003', name: 'David Lee', status: 'assigned', assignedBins: ['BIN-003'] },
  { id: 'WKR-004', name: 'Sarah Johnson', status: 'available' },
  { id: 'WKR-005', name: 'Ahmed Hassan', status: 'in-progress', assignedBins: ['BIN-004'] },
];

export const alerts: Alert[] = [
  { id: 'ALT-001', binId: 'BIN-003', message: 'Bin BIN-003 at Oak Street is 92% full - Immediate collection required', severity: 'critical', timestamp: '5 mins ago' },
  { id: 'ALT-002', binId: 'BIN-004', message: 'Bin BIN-004 at Central Market has exceeded 85% capacity', severity: 'warning', timestamp: '15 mins ago' },
  { id: 'ALT-003', binId: 'BIN-007', message: 'Bin BIN-007 near Hospital Road is at 95% - Priority collection needed', severity: 'critical', timestamp: '8 mins ago' },
  { id: 'ALT-004', binId: 'BIN-011', message: 'Bin BIN-011 at Mall Complex approaching full capacity (94%)', severity: 'warning', timestamp: '3 mins ago' },
];

// Statistics data for charts
export const dailyFillData = [
  { day: 'Mon', count: 34 },
  { day: 'Tue', count: 42 },
  { day: 'Wed', count: 38 },
  { day: 'Thu', count: 45 },
  { day: 'Fri', count: 52 },
  { day: 'Sat', count: 48 },
  { day: 'Sun', count: 41 },
];

export const fillLevelDistribution = [
  { name: 'Empty (0-30%)', value: 3, color: '#22c55e' },
  { name: 'Half (31-70%)', value: 5, color: '#eab308' },
  { name: 'Full (71-100%)', value: 4, color: '#ef4444' },
];

export const collectionEfficiency = {
  todayCollected: 28,
  pendingCollection: 4,
  avgResponseTime: '24 mins',
  efficiency: 87,
};

export const cities = [
  'New York City',
  'Los Angeles',
  'Chicago',
  'Houston',
  'Phoenix',
  'San Francisco',
];
