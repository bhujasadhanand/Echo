import express from 'express';
import { Worker } from '../models/Worker.js';
import { CollectionHistory } from '../models/CollectionHistory.js';
import { Bin } from '../models/Bin.js';

const router = express.Router();

// GET /api/workers — list all workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find().sort({ id: 1 });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workers', details: err.message });
  }
});

// GET /api/workers/:id — single worker
router.get('/:id', async (req, res) => {
  try {
    const worker = await Worker.findOne({ id: req.params.id });
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    res.json(worker);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch worker', details: err.message });
  }
});

// POST /api/workers/assign — assign bins to a worker
router.post('/assign', async (req, res) => {
  try {
    const { workerId, binIds } = req.body;
    if (!workerId || !Array.isArray(binIds) || binIds.length === 0) {
      return res.status(400).json({ error: 'workerId and binIds[] are required' });
    }

    const worker = await Worker.findOneAndUpdate(
      { id: workerId },
      { $set: { status: 'assigned', assignedBins: binIds } },
      { new: true }
    );
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    res.json({ success: true, worker });
  } catch (err) {
    res.status(500).json({ error: 'Assignment failed', details: err.message });
  }
});

// POST /api/workers/complete — mark collection as complete & log history
router.post('/complete', async (req, res) => {
  try {
    const { workerId, binIds } = req.body;
    if (!workerId || !Array.isArray(binIds) || binIds.length === 0) {
      return res.status(400).json({ error: 'workerId and binIds[] are required' });
    }

    const worker = await Worker.findOne({ id: workerId });
    if (!worker) return res.status(404).json({ error: 'Worker not found' });

    // Reset bins to empty
    await Bin.updateMany(
      { id: { $in: binIds } },
      { $set: { fillLevel: 5, status: 'empty', priority: false, lastUpdated: 'Just now' } }
    );

    // Log collection history
    const historyDocs = binIds.map((binId) => ({
      binId,
      worker: worker.name,
      status: 'Completed',
      collectedAt: new Date(),
    }));
    await CollectionHistory.insertMany(historyDocs);

    // Reset worker
    await Worker.findOneAndUpdate(
      { id: workerId },
      { $set: { status: 'available', assignedBins: [] } }
    );

    res.json({ success: true, message: `Completed collection for ${binIds.length} bin(s)` });
  } catch (err) {
    res.status(500).json({ error: 'Completion failed', details: err.message });
  }
});

export default router;
