import { WebSocket } from 'ws';
import { TelemetryEventSchema } from 'shared';
import { state } from './state';

export function handleIngestionConnection(ws: WebSocket) {
  ws.on('message', (message) => {
    try {
      const parsed = JSON.parse(message.toString());
      const event = TelemetryEventSchema.parse(parsed); // Validation
      state.processEvent(event);
    } catch (e) {
      // Invalid event, ignoring
      console.error("Validation error", e);
    }
  });

  ws.on('error', console.error);
}
