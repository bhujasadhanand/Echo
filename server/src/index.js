import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import binRoutes from './routes/bins.js';
import workerRoutes from './routes/workers.js';
import alertRoutes from './routes/alerts.js';
import telemetryRoutes from './routes/telemetry.js';
import historyRoutes from './routes/history.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-waste-db';

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/bins', binRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/waste-data', telemetryRoutes);   // legacy alias for ESP32
app.use('/api/history', historyRoutes);

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    stack: 'MERN',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// ── 404 catch-all ──────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── MongoDB connection & start ─────────────────────────────────────────────
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`✅  MongoDB connected: ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`🚀  Smart Waste API server running on port ${PORT}`);
      console.log(`    GET  /api/status`);
      console.log(`    GET  /api/bins`);
      console.log(`    GET  /api/workers`);
      console.log(`    GET  /api/alerts`);
      console.log(`    POST /api/telemetry`);
      console.log(`    GET  /api/history`);
    });
  })
  .catch((err) => {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  });

// ── Graceful shutdown ───────────────────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\nReceived ${signal}, shutting down gracefully…`);
  await mongoose.connection.close();
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
