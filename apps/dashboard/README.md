# Dashboard Application

This is a Vite + React application for real-time telemetry visualization.

## Startup

```bash
npm run dev
```

By default, the dashboard runs on `http://localhost:5173`.

## Connecting to the Telemetry Server

The dashboard connects to the telemetry server via WebSockets. If your server is running on a port other than the default `8080`, the dashboard provides three ways to integrate:

### 1. Zero-Config URL (Recommended for Dev)

You can specify the port directly in the URL when opening the dashboard. This is the easiest way to jump between multiple server instances.

- **Example**: `http://localhost:5173/?port=9000`

### 2. In-App Configuration

Once the dashboard is loaded, you can update the **"Server Port"** input field in the top header.

- Changing this value will trigger an immediate reconnection attempt.
- The dashboard will save this port to your browser's `localStorage` and use it as the default for future sessions.

### 3. Automatic Detection

If no port is specified, the dashboard defaults to **8080**. It always attempts to connect to the same hostname that is serving the dashboard (e.g., `localhost` if running locally).

## Integration Details

- **Protocol**: `ws://` (WebSocket)
- **Endpoint**: `/dashboard`
- **Data Schema**: Expects a `Metrics` object as defined in `packages/shared`.

## Features

- **Live Metrics**: Aggregated peer count and message velocities.
- **Raw Event Stream**: Real-time log of every event entering the system.
- **Port Management**: Dynamic reconnection logic for flexible dev environments.
