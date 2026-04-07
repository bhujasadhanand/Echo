import express from 'express';
import { Bin } from '../models/Bin.js';
import { Alert } from '../models/Alert.js';

const router = express.Router();

function statusFromFill(fillLevel) {
  if (fillLevel <= 30) return 'empty';
  if (fillLevel <= 80) return 'half';
  return 'full';
}

// GET /api/bins — list all bins
router.get('/', async (req, res) => {
  try {
    const bins = await Bin.find().sort({ id: 1 });
    res.json(bins);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bins', details: err.message });
  }
});

// GET /api/bins/:id — single bin
router.get('/:id', async (req, res) => {
  try {
    const bin = await Bin.findOne({ id: req.params.id });
    if (!bin) return res.status(404).json({ error: 'Bin not found' });
    res.json(bin);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bin', details: err.message });
  }
});

// PUT /api/bins/:id — update a bin's fill level (e.g. from manual input)
router.put('/:id', async (req, res) => {
  try {
    const { fillLevel, location, coordinates, priority } = req.body;
    const update = {};

    if (fillLevel !== undefined) {
      const fill = Math.max(0, Math.min(100, Math.round(Number(fillLevel))));
      update.fillLevel = fill;
      update.status = statusFromFill(fill);
      update.priority = fill >= 85;
      update.lastUpdated = 'Just now';

      // Auto-create alert if fill is critical
      if (fill >= 90) {
        const alertId = `ALT-${Date.now()}`;
        const bin = await Bin.findOne({ id: req.params.id });
        const severity = fill >= 95 ? 'critical' : 'warning';
        await Alert.findOneAndUpdate(
          { binId: req.params.id, resolved: false },
          {
            $setOnInsert: {
              id: alertId,
              binId: req.params.id,
              message: `Bin ${req.params.id} at ${bin?.location ?? 'unknown'} is ${fill}% full`,
              severity,
              timestamp: 'Just now',
              resolved: false,
            },
          },
          { upsert: true }
        );
      }
    }
    if (location !== undefined) update.location = location;
    if (coordinates !== undefined) update.coordinates = coordinates;
    if (priority !== undefined) update.priority = priority;

    const updated = await Bin.findOneAndUpdate({ id: req.params.id }, { $set: update }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Bin not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update bin', details: err.message });
  }
});

export default router;
