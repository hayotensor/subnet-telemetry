import { useEffect, useState } from 'react';
import { Metrics, TelemetryEvent } from 'shared';

function App() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [allEvents, setAllEvents] = useState<TelemetryEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [serverPort, setServerPort] = useState(() => {
    // 1. Explicit override via URL (highest priority for debugging)
    const params = new URLSearchParams(window.location.search);
    const portParam = params.get('port');
    if (portParam) return portParam;

    // 2. Production Check: If served via the integrated backend, use the same port
    // Vite usually runs on 5173 or 3000 in dev; if we are on something else,
    // we're likely being served by the telemetry server itself.
    const currentPort = window.location.port;
    if (currentPort && currentPort !== '5173' && currentPort !== '3000') {
      return currentPort;
    }

    // 3. Fallback to storage or default
    return localStorage.getItem('telemetry_port') || '8080';
  });

  useEffect(() => {
    const host = window.location.hostname;
    const wsUrl = `ws://${host}:${serverPort}/dashboard`;
    console.log(`Connecting to telemetry server at ${wsUrl}`);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnected(true);
      localStorage.setItem('telemetry_port', serverPort);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as Metrics;
        setMetrics(data);
        // Append new events to our local history
        if (data.recentEvents && data.recentEvents.length > 0) {
          setAllEvents(prev => {
            const combined = [...data.recentEvents, ...prev];
            return combined.slice(0, 100); // Keep last 100
          });
        }
      } catch (err) {
        console.error("Failed to parse metrics", err);
      }
      if (!connected) {
        setConnected(true);
      }
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [serverPort]);

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerPort(e.target.value);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="dashboard">
      <header className="header">
        <div className="brand">
          <h1>Network Telemetry</h1>
          <p className="subtitle">Real-time p2p network observation</p>
        </div>

        <div className="controls">
          <div className="port-config">
            <span className="label">Server Port:</span>
            <input
              type="text"
              value={serverPort}
              onChange={handlePortChange}
              className="port-input"
              placeholder="8080"
            />
          </div>
          <div className={`status ${connected ? 'connected' : ''}`}>
            <div className="status-dot"></div>
            {connected ? 'Live' : 'Searching...'}
          </div>
        </div>
      </header>

      <section className="overview">
        {metrics ? (
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Peers Online</h3>
              <div className="metric-value live-data">{metrics.peersOnline}</div>
            </div>
            <div className="metric-card">
              <h3>Ingestion Velocity</h3>
              <div className="metric-value live-data">
                {metrics.messagesPerSecond} <span className="metric-unit">msg/s</span>
              </div>
            </div>
            <div className="metric-card">
              <h3>Gossip Outbound</h3>
              <div className="metric-value live-data">
                {formatBytes(metrics.gossipSentBytesPerSec)}<span className="metric-unit">/s</span>
              </div>
              <div className="metric-sub">{metrics.gossipSentRate} msgs/s</div>
            </div>
            <div className="metric-card">
              <h3>Gossip Inbound</h3>
              <div className="metric-value live-data">
                {formatBytes(metrics.gossipReceivedBytesPerSec)}<span className="metric-unit">/s</span>
              </div>
              <div className="metric-sub">{metrics.gossipReceivedRate} msgs/s</div>
            </div>
          </div>
        ) : (
          <div className="loading-state">
            {connected ? (
              <div className="pulse-loader">Waiting for data stream...</div>
            ) : (
              <div className="error-state">
                <p>Not connected to telemetry server.</p>
                <p className="hint">Ensure server is running on port {serverPort}</p>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="event-stream">
        <div className="section-header">
          <h2>Raw Event Stream</h2>
          <span className="event-count">{allEvents.length} events buffered</span>
        </div>

        <div className="event-list">
          {allEvents.length === 0 ? (
            <div className="empty-log">No events captured yet.</div>
          ) : (
            allEvents.map((event, idx) => (
              <div key={idx} className={`event-item event-${event.event}`}>
                <div className="event-meta">
                  <span className="event-time">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  <span className="event-type-badge">{event.event}</span>
                  <span className="event-peer">Peer: {event.peer_id}</span>
                </div>
                <div className="event-payload">
                  <pre>{JSON.stringify(event, null, 2)}</pre>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
