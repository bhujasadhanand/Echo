import express from 'express';
import { CollectionHistory } from '../models/CollectionHistory.js';

const router = express.Router();

// GET /api/history — collection history (most recent first)
router.get('/', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const history = await CollectionHistory.find()
      .sort({ collectedAt: -1 })
      .limit(Number(limit));
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history', details: err.message });
  }
});

export default router;
