"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryEventSchema = exports.GossipReceivedEventSchema = exports.GossipSentEventSchema = exports.HeartbeatEventSchema = void 0;
const zod_1 = require("zod");
exports.HeartbeatEventSchema = zod_1.z.object({
    type: zod_1.z.literal('heartbeat'),
    peerId: zod_1.z.string(),
    timestamp: zod_1.z.number(),
});
exports.GossipSentEventSchema = zod_1.z.object({
    type: zod_1.z.literal('gossip_sent'),
    peerId: zod_1.z.string(),
    topic: zod_1.z.string(),
    messageSize: zod_1.z.number(),
    timestamp: zod_1.z.number(),
});
exports.GossipReceivedEventSchema = zod_1.z.object({
    type: zod_1.z.literal('gossip_received'),
    peerId: zod_1.z.string(),
    topic: zod_1.z.string(),
    messageSize: zod_1.z.number(),
    timestamp: zod_1.z.number(),
});
exports.TelemetryEventSchema = zod_1.z.union([
    exports.HeartbeatEventSchema,
    exports.GossipSentEventSchema,
    exports.GossipReceivedEventSchema,
]);
__exportStar(require("./config"), exports);
