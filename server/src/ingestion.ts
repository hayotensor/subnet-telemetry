import { WebSocket } from 'ws';
import { TelemetryEventSchema } from 'shared';
import { state } from './state';

export function handleIngestionConnection(ws: WebSocket) {
  ws.on('message', (message) => {
    try {
      console.log('Received message:', message.toString());
      const parsed = JSON.parse(message.toString());
      console.log('Parsed message:', parsed);
      const event = TelemetryEventSchema.parse(parsed); // Validation
      console.log('Validated event:', event);
      state.processEvent(event);
    } catch (e) {
      // Invalid event, ignoring
      console.error("Validation error", e);
    }
  });

  ws.on('error', console.error);
}
