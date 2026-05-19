import { z } from 'zod';

import { uiConfigDefault } from '@models/config-ui.model';

/**
 * Server config values that get cached into the `uis` localStorage key.
 */
export const uisCacheNames = [
  'hashcatBrainEnable',
  'hashlistAlias',
  'blacklistChars',
  'chunktime',
  'agentStatLimit',
  'agentStatTension',
  'agentTempThreshold1',
  'agentTempThreshold2',
  'agentUtilThreshold1',
  'agentUtilThreshold2',
  'statustimer',
  'agenttimeout',
  'maxSessionLength'
] as const;

export type UisCacheName = (typeof uisCacheNames)[number];

/**
 * Preprocess: migrates old [{name, value}, ...] array format to flat object.
 * Existing object data passes through unchanged.
 * Having an object instead of an array with name, value entries makes it easier to type them
 */
const migrateUisFormat = (val: unknown): unknown => {
  if (Array.isArray(val)) {
    const obj: Record<string, unknown> = {};
    for (const entry of val) {
      if (entry && typeof entry === 'object' && 'name' in entry && 'value' in entry) {
        obj[String(entry.name)] = entry.value;
      }
    }
    return obj;
  }
  return val;
};

/**
 * Zod schema for the `uis` localStorage key as a flat typed object.
 * z.preprocess handles migration from the old [{name, value}] array format.
 * z.coerce.number() / z.coerce.string() handle API string→number conversion.
 */
export const uisSettingsSchema = z.preprocess(
  migrateUisFormat,
  z.object({
    // Numeric (API returns strings, coerce to number)
    // Each field has a .default() so partial/migrated data fills in safe values
    // instead of failing validation entirely. Zeros are safe because storeDefault()
    // will overwrite them with real API values once the expiry check triggers.
    chunktime: z.coerce.number().default(0),
    agentStatLimit: z.coerce.number().default(0),
    agentStatTension: z.coerce.number().default(0),
    agentTempThreshold1: z.coerce.number().default(0),
    agentTempThreshold2: z.coerce.number().default(0),
    agentUtilThreshold1: z.coerce.number().default(0),
    agentUtilThreshold2: z.coerce.number().default(0),
    statustimer: z.coerce.number().default(0),
    agenttimeout: z.coerce.number().default(0),
    maxSessionLength: z.coerce.number().default(0),
    hashcatBrainEnable: z.coerce.number().default(0),
    // String (already strings from API)
    hashlistAlias: z.coerce.string().default('#HL#'),
    blacklistChars: z.coerce.string().default(''),
    _timestamp: z.number().default(0),
    _expiresin: z.number().default(72 * 60 * 60 * 1000)
  })
);

export type UiSettings = z.infer<typeof uisSettingsSchema>;

/**
 * Zod schema for the Sorting / TableOrder shape.
 * Numeric fields use `z.coerce.number()` to handle values stored as strings.
 */
export const sortingSchema = z.object({
  id: z.coerce.number(),
  dataKey: z.string(),
  isSortable: z.boolean(),
  direction: z.enum(['asc', 'desc', '']),
  parent: z.string().optional()
});

/**
 * Zod schema for a single table configuration entry.
 * - `start` is optional because defaults use `undefined` (omitted in JSON).
 * @TYPING -> maybe look into who order accepts a single sorting object or an array?
 * - `order` accepts a single Sorting object OR an array (components may store either).
 * - Uses passthrough so dynamic fields like `before`, `index` survive validation.
 * @TODO -> The numeric field conversion exists for the moment to not break first introduction of this schema.
 * Maybe remove if we want to migrate certain user data, otherwise just change to number and let the local storage data be reset.
 * - Numeric fields use coercion to tolerate string representations in stored data.
 *
 * NOTE: If you add a *required* field here, also add it to every entry in
 * `uiConfigDefault.tableSettings` (config-ui.model.ts). Otherwise the defaults themselves
 * fail `tableEntrySchema`, the per-entry repair below cannot heal stored data, and the whole
 * `ui-config` ends up wiped by `LocalStorageService`'s self-heal.
 */
export const tableConfigSchema = z.object({
  columns: z.array(z.coerce.number()),
  start: z.union([z.coerce.number(), z.string()]).optional(),
  order: z.union([sortingSchema, z.array(sortingSchema)]).optional(),
  page: z.coerce.number(),
  search: z.union([z.string(), z.array(z.unknown())]),
  before: z.union([z.coerce.number(), z.string()]).optional(),
  index: z.coerce.number().optional()
});

/**
 * @TODO -> can probably be refactored so that we only have the new tableConfigSchema?
 * Shape of a single tableSettings entry: either a legacy column-id array or a full TableConfig.
 */
const tableEntrySchema = z.union([z.array(z.coerce.number()), tableConfigSchema]);

/**
 * Full tableSettings record.
 *
 * The preprocess seeds defaults for missing keys and overlays only stored entries that pass
 * `tableEntrySchema`. Invalid entries with a matching default stay defaulted; invalid entries
 * without a default are dropped. Non-object inputs fall through so the outer record rejects
 * them, triggering `LocalStorageService`'s self-heal for fully-corrupt data.
 */
export const tableSettingsSchema = z.preprocess(
  (val) => {
    if (!val || typeof val !== 'object' || Array.isArray(val)) {
      return val;
    }
    const result: Record<string, unknown> = { ...uiConfigDefault.tableSettings };
    for (const [k, v] of Object.entries(val)) {
      if (tableEntrySchema.safeParse(v).success) {
        result[k] = v;
      }
    }
    return result;
  },
  z.record(z.string(), tableEntrySchema)
);

/**
 * Zod schema for the top-level UIConfig.
 * Each field has a default so that when we add new entries the existing data is not replaced but each
 * missing field (due to adding a new value) automatically is set to the default provided.
 */
export const uiConfigSchema = z.object({
  layout: z.enum(['full', 'fixed']).default(uiConfigDefault.layout),
  theme: z.enum(['light', 'dark']).default(uiConfigDefault.theme),
  tableSettings: tableSettingsSchema.default(uiConfigDefault.tableSettings as z.output<typeof tableSettingsSchema>),
  timefmt: z.string().default(uiConfigDefault.timefmt),
  refreshPage: z.boolean().default(uiConfigDefault.refreshPage),
  refreshInterval: z.coerce.number().default(uiConfigDefault.refreshInterval)
});
