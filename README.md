# Subnet Telemetry Monorepo

This repository contains a high-performance, single-process telemetry server and a React dashboard designed for real-time monitoring of p2p network nodes.

## Quick Start

### 1. Setup

```bash
# Install dependencies across the monorepo
npm install

# Build shared types and configuration logic
npm run build:shared
```

### 2. Running the System

**Start Backend Server:**

```bash
# Default (port 8080)
npm run dev:server

# Custom Port via CLI
npm run dev:server -- --port 9000
```

The server handles P2P node WebSocket ingestion on `/ingest` and dashboard data broadcasting on `/dashboard`.

**Start React Dashboard:**

```bash
npm run dev:dashboard
```

The UI typically orbits `http://localhost:5173`.

> [!TIP]
> **Custom Port Integration**: If your server is on a different port (e.g., 9000), the dashboard won't automatically connect. Either:
>
> 1. Open the URL with a parameter: `http://localhost:5173/?port=9000`
> 2. Change the **"Server Port"** field in the dashboard UI once it loads.

## Production Deployment & Integrated Hosting

For a professional deployment, you can host both the server and the dashboard on a single port. This eliminates CORS issues and simplifies infrastructure.

### 1. Unified Build

Build all packages and the frontend distribution files:

```bash
npm run build
```

### 2. Start the Integrated Server

The server will automatically detect the `dist` folder and serve the dashboard.

```bash
# Dashboard will be available at http://localhost:8080
npm run dev:server
```

### 3. Automatic Connection

When hosted this way, the dashboard **automatically detects** the backend port and host. No manual configuration is required from the user or in the URL.

---

## Configuration & Port Discovery

The system is designed to be highly flexible with decoupled frontend and backend components.

### Server Configuration

The server uses a universal configuration utility that resolves settings in this order:

1. **CLI Arguments**: Use `--port <number>` or `-p <number>`.
2. **Environment Variables**: Set `PORT` in your environment or a `.env` file.
3. **Defaults**: Port `8080`.

### Dashboard Port Discovery

If you run the server on a custom port (e.g., `9000`), the dashboard needs to know where to find it. You can connect it in three ways:

1. **Dashboard UI**: Enter the port directly in the **"Server Port"** field in the dashboard header.
2. **URL Parameter**: Append `?port=9000` to your dashboard URL: `http://localhost:5173/?port=9000`.
3. **Persistence**: The dashboard remembers your last successful connection in `localStorage`.

---

## Features

### Real-time Metrics

- **Peers Online**: tracks active nodes with a 30s heartbeat timeout.
- **Ingestion Velocity**: monitors the raw message rate flowing into the system.
- **Gossip Bandwidth**: visualizes throughput (bytes/sec) for gossip propagation.

### Raw Event Stream

The dashboard includes a **Universal Event Log** that displays every single message received by the server.

- **Type-agnostic**: Displays any valid `TelemetryEvent` automatically.
- **Detailed Inspection**: Click or view the raw JSON payload for every heartbeat or gossip event.
- **Live Buffer**: Keeps a rolling history of the most recent 100 events for deep debugging.

## Architecture

- `packages/shared`: Shared Zod schemas and TypeScript interfaces ensuring end-to-to type safety.
- `server/src/state.ts`: The central state engine. It performs 1s aggregation ticks and broadcasts metrics + raw events.
- `server/src/index.ts`: Unified HTTP/WS server using route-based handshake upgrades.
- `apps/dashboard`: A high-performance React (Vite) app built with vanilla CSS. It uses pure WebSocket streams for zero-latency updates.
