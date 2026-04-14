import { z } from 'zod';

// Arbitrary raw event schema object
export const BaseEventSchema = z.object({
  event: z.string(),
  timestamp: z.number(),
  host: z.string(),
  subnet_id: z.number(),
  subnet_node_id: z.number(),
  peer_id: z.string(),
  data: z.any(),
});

//
// --- Example of how to add more schemas ---
//

// export const HeartbeatSentEventSchema = z.object({
//   type: z.literal('heartbeat_sent'),
//   epoch: z.number(),
//   subnet_id: z.string(),
//   subnet_node_id: z.string(),
//   peer_id: z.string(),
// });

// export const HeartbeatReceivedEventSchema = z.object({
//   type: z.literal('heartbeat_received'),
//   peerId: z.string(),
//   timestamp: z.number(),
// });

// export const GossipSentEventSchema = z.object({
//   type: z.literal('gossip_sent'),
//   peerId: z.string(),
//   topic: z.string(),
//   messageSize: z.number(),
//   timestamp: z.number(),
// });

// export const GossipReceivedEventSchema = z.object({
//   type: z.literal('gossip_received'),
//   peerId: z.string(),
//   topic: z.string(),
//   messageSize: z.number(),
//   timestamp: z.number(),
// });

export const TelemetryEventSchema = BaseEventSchema;

//
// --- Format for adding multiple schemas ---
//

// export const TelemetryEventSchema = z.union([
//   BaseEventSchema,
//   HeartbeatSentEventSchema,
//   HeartbeatReceivedEventSchema,
//   GossipSentEventSchema,
//   GossipReceivedEventSchema,
// ]);

export type TelemetryEvent = z.infer<typeof TelemetryEventSchema>;

export interface PeerMetrics {
  topicGossipSent: Record<string, number>;
  topicGossipReceived: Record<string, number>;
  lastSeen: number;
}

export interface Metrics {
  peersOnline: number;
  messagesPerSecond: number;
  gossipSentRate: number;    // msgs per sec
  gossipReceivedRate: number; // msgs per sec
  gossipSentBytesPerSec: number;
  gossipReceivedBytesPerSec: number;
  recentEvents: TelemetryEvent[];
  timestamp: number;
}
export * from './config';
