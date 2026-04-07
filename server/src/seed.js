/**
 * Seed script — populates MongoDB with the initial mock data.
 * Usage: node src/seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Bin } from './models/Bin.js';
import { Worker } from './models/Worker.js';
import { Alert } from './models/Alert.js';
import { CollectionHistory } from './models/CollectionHistory.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-waste-db';

const bins = [
  { id: 'BIN-001', location: 'Park Avenue, Block A',          fillLevel: 15, status: 'empty', lastUpdated: '10 mins ago', coordinates: [40.7589, -73.9851], priority: false },
  { id: 'BIN-002', location: 'Main Street, Downtown',         fillLevel: 48, status: 'half',  lastUpdated: '25 mins ago', coordinates: [40.7614, -73.9776], priority: false },
  { id: 'BIN-003', location: 'Oak Street, Residential Area',  fillLevel: 92, status: 'full',  lastUpdated: '5 mins ago',  coordinates: [40.7549, -73.9840], priority: true  },
  { id: 'BIN-004', location: 'Central Market, Zone 2',        fillLevel: 88, status: 'full',  lastUpdated: '15 mins ago', coordinates: [40.7580, -73.9855], priority: true  },
  { id: 'BIN-005', location: 'River Road, North District',    fillLevel: 22, status: 'empty', lastUpdated: '1 hour ago',  coordinates: [40.7625, -73.9735], priority: false },
  { id: 'BIN-006', location: 'School Street, East Zone',      fillLevel: 55, status: 'half',  lastUpdated: '30 mins ago', coordinates: [40.7570, -73.9810], priority: false },
  { id: 'BIN-007', location: 'Hospital Road, Medical District', fillLevel: 95, status: 'full', lastUpdated: '8 mins ago', coordinates: [40.7595, -73.9765], priority: true  },
  { id: 'BIN-008', location: 'Beach Avenue, Coastal Area',    fillLevel: 10, status: 'empty', lastUpdated: '45 mins ago', coordinates: [40.7560, -73.9890], priority: false },
  { id: 'BIN-009', location: 'Garden Lane, Suburb',           fillLevel: 67, status: 'half',  lastUpdated: '20 mins ago', coordinates: [40.7610, -73.9800], priority: false },
  { id: 'BIN-010', location: 'Station Square, Transport Hub', fillLevel: 78, status: 'half',  lastUpdated: '12 mins ago', coordinates: [40.7555, -73.9820], priority: false },
  { id: 'BIN-011', location: 'Mall Complex, Shopping District', fillLevel: 94, status: 'full', lastUpdated: '3 mins ago', coordinates: [40.7600, -73.9830], priority: true  },
  { id: 'BIN-012', location: 'Library Street, Academic Zone', fillLevel: 35, status: 'half',  lastUpdated: '50 mins ago', coordinates: [40.7575, -73.9795], priority: false },
];

const workers = [
  { id: 'WKR-001', name: 'John Smith',     status: 'available',   assignedBins: [] },
  { id: 'WKR-002', name: 'Maria Garcia',   status: 'in-progress', assignedBins: ['BIN-007', 'BIN-011'] },
  { id: 'WKR-003', name: 'David Lee',      status: 'assigned',    assignedBins: ['BIN-003'] },
  { id: 'WKR-004', name: 'Sarah Johnson',  status: 'available',   assignedBins: [] },
  { id: 'WKR-005', name: 'Ahmed Hassan',   status: 'in-progress', assignedBins: ['BIN-004'] },
];

const alerts = [
  { id: 'ALT-001', binId: 'BIN-003', message: 'Bin BIN-003 at Oak Street is 92% full - Immediate collection required',            severity: 'critical', timestamp: '5 mins ago' },
  { id: 'ALT-002', binId: 'BIN-004', message: 'Bin BIN-004 at Central Market has exceeded 85% capacity',                          severity: 'warning',  timestamp: '15 mins ago' },
  { id: 'ALT-003', binId: 'BIN-007', message: 'Bin BIN-007 near Hospital Road is at 95% - Priority collection needed',            severity: 'critical', timestamp: '8 mins ago' },
  { id: 'ALT-004', binId: 'BIN-011', message: 'Bin BIN-011 at Mall Complex approaching full capacity (94%)',                      severity: 'warning',  timestamp: '3 mins ago' },
];

const history = [
  { binId: 'BIN-001', worker: 'Alice Chen',   status: 'Completed', collectedAt: new Date('2025-12-18T08:12:00Z') },
  { binId: 'BIN-004', worker: 'Bob Kim',      status: 'Completed', collectedAt: new Date('2025-12-18T07:45:00Z') },
  { binId: 'BIN-007', worker: 'Alice Chen',   status: 'Completed', collectedAt: new Date('2025-12-17T16:30:00Z') },
  { binId: 'BIN-003', worker: 'Carlos Ruiz',  status: 'Completed', collectedAt: new Date('2025-12-17T15:08:00Z') },
  { binId: 'BIN-009', worker: 'Bob Kim',      status: 'Completed', collectedAt: new Date('2025-12-17T13:22:00Z') },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅  Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    Bin.deleteMany({}),
    Worker.deleteMany({}),
    Alert.deleteMany({}),
    CollectionHistory.deleteMany({}),
  ]);
  console.log('🗑️   Cleared existing data');

  // Insert seed data
  await Bin.insertMany(bins);
  await Worker.insertMany(workers);
  await Alert.insertMany(alerts);
  await CollectionHistory.insertMany(history);
  console.log('🌱  Seed data inserted successfully');
  console.log(`    Bins: ${bins.length} | Workers: ${workers.length} | Alerts: ${alerts.length} | History: ${history.length}`);

  await mongoose.connection.close();
  console.log('🔌  Disconnected from MongoDB');
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
