import { Metrics, PeerMetrics, TelemetryEvent } from 'shared';

const PEER_TIMEOUT_MS = 30000;

export class TelemetryState {
  private peers: Map<string, PeerMetrics> = new Map();

  // Rolling counters for the current 1s tick
  private currentEventCount = 0;
  private currentGossipSentCount = 0;
  private currentGossipReceivedCount = 0;
  private currentGossipSentBytes = 0;
  private currentGossipReceivedBytes = 0;
  private recentEvents: TelemetryEvent[] = [];

  // Last computed metrics
  private lastMetrics: Metrics = {
    peersOnline: 0,
    messagesPerSecond: 0,
    gossipSentRate: 0,
    gossipReceivedRate: 0,
    gossipSentBytesPerSec: 0,
    gossipReceivedBytesPerSec: 0,
    recentEvents: [],
    timestamp: Date.now(),
  };

  public processEvent(telemetryEvent: TelemetryEvent) {
    console.log('Processing event:', telemetryEvent);
    this.currentEventCount++;
    this.recentEvents.push(telemetryEvent);
    // Keep only last 50 events to avoid bloating memory if multiple ticks happen
    if (this.recentEvents.length > 50) this.recentEvents.shift();

    const now = Date.now();

    let peer = this.peers.get(telemetryEvent.peer_id);
    if (!peer) {
      peer = { topicGossipSent: {}, topicGossipReceived: {}, lastSeen: now };
      this.peers.set(telemetryEvent.peer_id, peer);
    }
    peer.lastSeen = now;

    if (telemetryEvent.event === 'gossip_sent') {
      this.currentGossipSentCount++;
      this.currentGossipSentBytes += telemetryEvent?.data?.message_size ?? 0;
      peer.topicGossipSent[telemetryEvent.event] = (peer.topicGossipSent[telemetryEvent.event] || 0) + 1;
    } else if (telemetryEvent.event === 'gossip_received') {
      this.currentGossipReceivedCount++;
      this.currentGossipReceivedBytes += telemetryEvent?.data?.message_size ?? 0;
      peer.topicGossipReceived[telemetryEvent.event] = (peer.topicGossipReceived[telemetryEvent.event] || 0) + 1;
    }
  }

  public tick(): Metrics {
    const now = Date.now();
    let peersOnline = 0;

    // Prune inactive peers
    for (const [peerId, metrics] of this.peers.entries()) {
      if (now - metrics.lastSeen > PEER_TIMEOUT_MS) {
        this.peers.delete(peerId);
      } else {
        peersOnline++;
      }
    }

    this.lastMetrics = {
      peersOnline,
      messagesPerSecond: this.currentEventCount,
      gossipSentRate: this.currentGossipSentCount,
      gossipReceivedRate: this.currentGossipReceivedCount,
      gossipSentBytesPerSec: this.currentGossipSentBytes,
      gossipReceivedBytesPerSec: this.currentGossipReceivedBytes,
      recentEvents: [...this.recentEvents],
      timestamp: now,
    };

    // Reset counters for next tick
    this.currentEventCount = 0;
    this.currentGossipSentCount = 0;
    this.currentGossipReceivedCount = 0;
    this.currentGossipSentBytes = 0;
    this.currentGossipReceivedBytes = 0;
    this.recentEvents = [];

    return this.lastMetrics;
  }
}

export const state = new TelemetryState();
