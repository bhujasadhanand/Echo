import { createServer } from 'http';
import { parse } from 'url';

const PORT = process.env.PORT || 3001;

const nodeToBinId = {
  A: 'BIN-001',
  B: 'BIN-002',
  C: 'BIN-003',
};

const allowedBinIds = new Set(Object.values(nodeToBinId));

/** @type {Map<string, {binId: string, fillLevel: number, timestamp: string, node?: string}>} */
const latestTelemetry = new Map();

function normalizeBinId(raw) {
  if (!raw) return undefined;
  const s = String(raw).trim();
  if (!s) return undefined;

  const m = /^BIN[-_]?0*(\d+)$/i.exec(s);
  if (m) {
    const n = String(Number(m[1])).padStart(3, '0');
    return `BIN-${n}`;
  }
  return s;
}

function toIsoTimestamp(raw) {
  if (typeof raw === 'string') {
    const t = Date.parse(raw);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }
  return new Date().toISOString();
}

function ingestTelemetryItem(obj) {
  if (!obj || typeof obj !== 'object') return;
  /** @type {any} */
  const o = obj;

  const nodeRaw = typeof o.node === 'string' ? o.node.trim().toUpperCase() : undefined;
  const node = nodeRaw === 'A' || nodeRaw === 'B' || nodeRaw === 'C' ? nodeRaw : undefined;

  const binId = normalizeBinId(o.binId) ?? (node ? nodeToBinId[node] : undefined);
  if (!binId) return;
  if (!allowedBinIds.has(binId)) return;

  const fill = Number(o.fillLevel ?? o.fill ?? o.level);
  if (!Number.isFinite(fill)) return;
  const fillLevel = Math.max(0, Math.min(100, Math.round(fill)));

  const timestamp = toIsoTimestamp(o.timestamp);

  latestTelemetry.set(binId, { binId, fillLevel, timestamp, node });
}

// Simple HTTP server to receive waste management data
const server = createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = parse(req.url, true);
  const path = parsedUrl.pathname;

  try {
    if ((path === '/api/waste-data' || path === '/api/telemetry') && req.method === 'POST') {
      // Handle waste data submissions
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          console.log('Received waste data:', data);

          if (Array.isArray(data)) {
            for (const item of data) ingestTelemetryItem(item);
          } else if (data && typeof data === 'object' && Array.isArray(data.items)) {
            for (const item of data.items) ingestTelemetryItem(item);
          } else {
            ingestTelemetryItem(data);
          }
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            message: 'Data received successfully',
            timestamp: new Date().toISOString()
          }));
        } catch (error) {
          console.error('Error parsing JSON:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: 'Invalid JSON data' 
          }));
        }
      });
    } else if (path === '/api/telemetry' && req.method === 'GET') {
      // Telemetry endpoint (frontend expects an array)
      const telemetry = Array.from(latestTelemetry.values()).filter((t) => allowedBinIds.has(t.binId));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(telemetry));
    } else if (path === '/api/status' && req.method === 'GET') {
      // Health check endpoint
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'running',
        timestamp: new Date().toISOString(),
        version: '0.0.1'
      }));
    } else {
      // 404 for unknown routes
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Endpoint not found' 
      }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Internal server error' 
    }));
  }
});

server.listen(PORT, () => {
  console.log(`Smart Waste Management Receiver Server running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  POST /api/waste-data - Receive waste management data`);
  console.log(`  GET  /api/telemetry - System and waste management telemetry`);
  console.log(`  GET  /api/status - Health check`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
