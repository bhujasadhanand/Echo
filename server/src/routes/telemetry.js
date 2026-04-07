import express from 'express';
import { Telemetry } from '../models/Telemetry.js';
import { Bin } from '../models/Bin.js';
import { Alert } from '../models/Alert.js';

const router = express.Router();

const nodeToBinId = { A: 'BIN-001', B: 'BIN-002', C: 'BIN-003' };
const allowedBinIds = new Set(Object.values(nodeToBinId));

function normalizeBinId(raw) {
  if (!raw) return undefined;
  const s = String(raw).trim();
  if (!s) return undefined;
  const m = /^BIN[-_]?0*(\d+)$/i.exec(s);
  if (m) return `BIN-${String(Number(m[1])).padStart(3, '0')}`;
  return s;
}

function statusFromFill(fillLevel) {
  if (fillLevel <= 30) return 'empty';
  if (fillLevel <= 80) return 'half';
  return 'full';
}

function formatLastUpdated(timestamp) {
  if (!timestamp) return 'Just now';
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMin = Math.max(0, Math.floor(diffMs / 60000));
  if (diffMin === 0) return 'Just now';
  if (diffMin === 1) return '1 min ago';
  return `${diffMin} mins ago`;
}

// POST /api/telemetry — receive data from ESP32 nodes
router.post('/', async (req, res) => {
  try {
    const raw = req.body;
    const items = Array.isArray(raw) ? raw : Array.isArray(raw?.items) ? raw.items : [raw];

    for (const item of items) {
      if (!item || typeof item !== 'object') continue;

      const nodeRaw = typeof item.node === 'string' ? item.node.trim().toUpperCase() : undefined;
      const node = ['A', 'B', 'C'].includes(nodeRaw) ? nodeRaw : undefined;
      const binId = normalizeBinId(item.binId) ?? (node ? nodeToBinId[node] : undefined);
      if (!binId || !allowedBinIds.has(binId)) continue;

      const fill = Number(item.fillLevel ?? item.fill ?? item.level);
      if (!Number.isFinite(fill)) continue;
      const fillLevel = Math.max(0, Math.min(100, Math.round(fill)));
      const timestamp = item.timestamp ? new Date(item.timestamp) : new Date();

      // Persist telemetry reading
      await Telemetry.create({ binId, fillLevel, node: node ?? null, timestamp });

      // Update bin document
      await Bin.findOneAndUpdate(
        { id: binId },
        {
          $set: {
            fillLevel,
            status: statusFromFill(fillLevel),
            priority: fillLevel >= 85,
            lastUpdated: formatLastUpdated(timestamp),
          },
        }
      );

      // Auto-alert on high fill
      if (fillLevel >= 85) {
        const bin = await Bin.findOne({ id: binId });
        const severity = fillLevel >= 95 ? 'critical' : 'warning';
        await Alert.findOneAndUpdate(
          { binId, resolved: false },
          {
            $setOnInsert: {
              id: `ALT-${Date.now()}`,
              binId,
              message: `Bin ${binId} at ${bin?.location ?? 'unknown'} is ${fillLevel}% full`,
              severity,
              timestamp: 'Just now',
              resolved: false,
            },
          },
          { upsert: true }
        );
      }
    }

    res.json({ success: true, message: 'Telemetry received', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Telemetry POST error:', err);
    res.status(500).json({ error: 'Failed to process telemetry', details: err.message });
  }
});

// GET /api/telemetry — latest reading per bin (for frontend polling)
router.get('/', async (req, res) => {
  try {
    // Get the most recent reading for each binId
    const latest = await Telemetry.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: '$binId', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
    ]);
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch telemetry', details: err.message });
  }
});

// GET /api/telemetry/history — last N readings for a bin (for charts)
router.get('/history', async (req, res) => {
  try {
    const { binId, limit = 50 } = req.query;
    const filter = binId ? { binId } : {};
    const history = await Telemetry.find(filter)
      .sort({ timestamp: -1 })
      .limit(Number(limit));
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history', details: err.message });
  }
});

export default router;
