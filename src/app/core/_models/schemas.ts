/**
 * @TODO: temporary stricter validation as Zod inference has some problems if strict mode is turned off
 * Remove this when the strict mode has been turned on.
 */

import { z } from 'zod';

// ── Agent ───────────────────────────────────────────────────────

export const zJAgent = z.object({
  id: z.number(),
  type: z.literal('agent'),
  agentName: z.string(),
  uid: z.string(),
  os: z.number(),
  devices: z.string(),
  cmdPars: z.string(),
  ignoreErrors: z.number().optional(),
  isActive: z.boolean(),
  isTrusted: z.boolean(),
  token: z.string(),
  lastAct: z.string(),
  lastTime: z.number(),
  lastIp: z.string(),
  userId: z.number(),
  cpuOnly: z.boolean(),
  clientSignature: z.string(),
}).passthrough();

// ── Chunk ───────────────────────────────────────────────────────

export const zJChunk = z.object({
  id: z.number(),
  type: z.literal('chunk'),
  taskId: z.number(),
  skip: z.number(),
  length: z.number(),
  agentId: z.number(),
  dispatchTime: z.number(),
  solveTime: z.number(),
  checkpoint: z.number(),
  progress: z.number(),
  state: z.number(),
  cracked: z.number(),
  speed: z.number(),
}).passthrough();

// ── File ────────────────────────────────────────────────────────

export const zJFile = z.object({
  id: z.number(),
  type: z.literal('file'),
  filename: z.string(),
  size: z.number(),
  isSecret: z.boolean(),
  fileType: z.number(),
  accessGroupId: z.number(),
  lineCount: z.number(),
}).passthrough();

// ── Health Check ────────────────────────────────────────────────

export const zJHealthCheck = z.object({
  id: z.number(),
  type: z.literal('healthCheck'),
  attackCmd: z.string(),
  checkType: z.number(),
  crackerBinaryId: z.number(),
  expectedCracks: z.number(),
  hashtypeId: z.number(),
  status: z.number(),
  time: z.number(),
}).passthrough();

// ── Health Check Agent ──────────────────────────────────────────

export const zJHealthCheckAgent = z.object({
  id: z.number(),
  type: z.literal('healthCheckAgent'),
  healthCheckId: z.number(),
  agentId: z.number(),
  status: z.number(),
  cracked: z.number(),
  numGpus: z.number(),
  start: z.number(),
  end: z.number(),
  errors: z.string(),
}).passthrough();

// ── Notification Setting ────────────────────────────────────────

export const zJNotification = z.object({
  id: z.number(),
  type: z.literal('notificationSetting'),
  action: z.string(),
  isActive: z.boolean(),
  notification: z.string(),
  receiver: z.string(),
  userId: z.number(),
  objectId: z.number().optional(),
}).passthrough();
