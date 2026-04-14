import { z } from 'zod';
export declare const HeartbeatEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"heartbeat">;
    peerId: z.ZodString;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "heartbeat";
    peerId: string;
    timestamp: number;
}, {
    type: "heartbeat";
    peerId: string;
    timestamp: number;
}>;
export declare const GossipSentEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"gossip_sent">;
    peerId: z.ZodString;
    topic: z.ZodString;
    messageSize: z.ZodNumber;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "gossip_sent";
    peerId: string;
    timestamp: number;
    topic: string;
    messageSize: number;
}, {
    type: "gossip_sent";
    peerId: string;
    timestamp: number;
    topic: string;
    messageSize: number;
}>;
export declare const GossipReceivedEventSchema: z.ZodObject<{
    type: z.ZodLiteral<"gossip_received">;
    peerId: z.ZodString;
    topic: z.ZodString;
    messageSize: z.ZodNumber;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "gossip_received";
    peerId: string;
    timestamp: number;
    topic: string;
    messageSize: number;
}, {
    type: "gossip_received";
    peerId: string;
    timestamp: number;
    topic: string;
    messageSize: number;
}>;
export declare const TelemetryEventSchema: z.ZodUnion<[z.ZodObject<{
    type: z.ZodLiteral<"heartbeat">;
    peerId: z.ZodString;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "heartbeat";
    peerId: string;
    timestamp: number;
}, {
    type: "heartbeat";
    peerId: string;
    timestamp: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"gossip_sent">;
    peerId: z.ZodString;
    topic: z.ZodString;
    messageSize: z.ZodNumber;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "gossip_sent";
    peerId: string;
    timestamp: number;
    topic: string;
    messageSize: number;
}, {
    type: "gossip_sent";
    peerId: string;
    timestamp: number;
    topic: string;
    messageSize: number;
}>, z.ZodObject<{
    type: z.ZodLiteral<"gossip_received">;
    peerId: z.ZodString;
    topic: z.ZodString;
    messageSize: z.ZodNumber;
    timestamp: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    type: "gossip_received";
    peerId: string;
    timestamp: number;
    topic: string;
    messageSize: number;
}, {
    type: "gossip_received";
    peerId: string;
    timestamp: number;
    topic: string;
    messageSize: number;
}>]>;
export type TelemetryEvent = z.infer<typeof TelemetryEventSchema>;
export interface PeerMetrics {
    topicGossipSent: Record<string, number>;
    topicGossipReceived: Record<string, number>;
    lastSeen: number;
}
export interface Metrics {
    peersOnline: number;
    messagesPerSecond: number;
    gossipSentRate: number;
    gossipReceivedRate: number;
    gossipSentBytesPerSec: number;
    gossipReceivedBytesPerSec: number;
    recentEvents: TelemetryEvent[];
    timestamp: number;
}
export * from './config';
