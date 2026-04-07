import express from 'express';
import { Alert } from '../models/Alert.js';

const router = express.Router();

// GET /api/alerts — list active (unresolved) alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ resolved: false }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts', details: err.message });
  }
});

// PUT /api/alerts/:id/resolve — mark alert as resolved
router.put('/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { id: req.params.id },
      { $set: { resolved: true } },
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve alert', details: err.message });
  }
});

// DELETE /api/alerts/:id — delete an alert
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({ id: req.params.id });
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete alert', details: err.message });
  }
});

export default router;
