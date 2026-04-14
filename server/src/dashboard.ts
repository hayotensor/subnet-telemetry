import { WebSocket } from 'ws';
import { Metrics } from 'shared';

const clients = new Set<WebSocket>();

export function handleDashboardConnection(ws: WebSocket) {
  console.log('Dashboard client connected');
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });

  ws.on('error', (err: any) => {
    console.error('Dashboard ws error', err);
    clients.delete(ws);
  });
}

export function broadcastMetrics(metrics: Metrics) {
  const data = JSON.stringify(metrics);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}
