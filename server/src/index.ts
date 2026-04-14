import * as http from 'http';
import { WebSocketServer } from 'ws';
import { handleIngestionConnection } from './ingestion';
import { handleDashboardConnection, broadcastMetrics } from './dashboard';
import { state } from './state';
import * as fs from 'fs';
import * as path from 'path';

import { getConfig } from 'shared';

const config = getConfig({ port: 8080 });
const PORT = config.port;

const DASHBOARD_DIST = path.resolve(process.cwd(), '..', 'apps', 'dashboard', 'dist');

const server = http.createServer((req: any, res: any) => {
  console.log('Received request:', req.url);
  const url = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(DASHBOARD_DIST, url);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimeTypes: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpg',
      '.svg': 'image/svg+xml',
    };

    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // Fallback for non-file routes or if dist doesn't exist
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <body style="background: #0f172a; color: #94a3b8; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="text-align: center; border: 1px dashed #334155; padding: 2rem; border-radius: 1rem;">
            <h1 style="color: #f8fafc; margin-bottom: 0.5rem;">Telemetry Server Alive</h1>
            <p>Static dashboard build not found at <code>apps/dashboard/dist</code></p>
            <p style="font-size: 0.8rem; opacity: 0.7;">Run <code>npm run build</code> to enable integrated hosting.</p>
          </div>
        </body>
      </html>
    `);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const wssIngest = new WebSocketServer({ noServer: true });
const wssDashboard = new WebSocketServer({ noServer: true });

wssIngest.on('connection', handleIngestionConnection);
wssDashboard.on('connection', handleDashboardConnection);

server.on('upgrade', (request: any, socket: any, head: any) => {
  console.log('Received upgrade request:', request.url);
  if (request.url === '/ingest') {
    wssIngest.handleUpgrade(request, socket, head, (ws: any) => {
      wssIngest.emit('connection', ws, request);
    });
  } else if (request.url === '/dashboard') {
    wssDashboard.handleUpgrade(request, socket, head, (ws) => {
      wssDashboard.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// 1s aggregation tick
setInterval(() => {
  console.log('Tick');
  const metrics = state.tick();
  broadcastMetrics(metrics);
}, 1000);

server.listen(PORT, () => {
  console.log(`Telemetry server listening on port ${PORT}`);
});
