import { z } from 'zod';

import { uiConfigDefault } from '@models/config-ui.model';

/**
 * Server config values that get cached into the `uis` localStorage key.
 * This is the single source of truth — `UIConfigService.cachevar` should
 * reference this list rather than duplicating it.
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

/** Internal metadata keys appended by `UIConfigService.storeDefault()`. */
export const uisMetaNames = ['_timestamp', '_expiresin'] as const;

/** All valid `name` values for a `uis` entry. */
export const uisNames = [...uisCacheNames, ...uisMetaNames] as const;

export type UiSettingName = (typeof uisNames)[number];

/**
 * Zod schema for a single entry in the `uis` localStorage key.
 * Each entry is a name-value pair cached from the server config API.
 */
export const uisEntrySchema = z.object({
  name: z.enum(uisNames),
  value: z.unknown()
});

export const uisSchema = z.array(uisEntrySchema);

export type UiSetting = z.infer<typeof uisEntrySchema>;

/**
 * Zod schema for the Sorting / TableOrder shape.
 * Uses passthrough to preserve any extra fields that components may add.
 * Numeric fields use `z.coerce.number()` to handle values stored as strings.
 */
export const sortingSchema = z
  .object({
    id: z.coerce.number(),
    dataKey: z.string(),
    isSortable: z.boolean(),
    direction: z.enum(['asc', 'desc'])
  })
  .passthrough();

/**
 * Zod schema for a single table configuration entry.
 * - `start` is optional because defaults use `undefined` (omitted in JSON).
 * @TYPING -> maybe look into who order accepts a single sorting object or an array?
 * - `order` accepts a single Sorting object OR an array (components may store either).
 * - Uses passthrough so dynamic fields like `before`, `index` survive validation.
 * @TODO -> The numeric field conversion exists for the moment to not break first introduction of this schema.
 * Maybe remove if we want to migrate certain user data, otherwise just change to number and let the local storage data be reset.
 * - Numeric fields use coercion to tolerate string representations in stored data.
 */
export const tableConfigSchema = z
  .object({
    columns: z.array(z.coerce.number()),
    start: z.coerce.number().optional(),
    order: z.union([sortingSchema, z.array(sortingSchema)]).optional(),
    page: z.coerce.number(),
    search: z.union([z.string(), z.array(z.unknown())])
  })
  .passthrough();

/**
 * Zod schema for the full tableSettings record.
 * Compile-time table name typing is handled by the `TableSettingsKey` union in config-ui.model.ts.
 * The runtime schema intentionally stays permissive (z.record) to tolerate stale/extra keys in localStorage.
 */
export const tableSettingsSchema = z.record(z.string(), z.union([z.array(z.coerce.number()), tableConfigSchema]));

/**
 * Zod schema for the top-level UIConfig.
 * Each field has a default so that when we add new entries the existing data is not replaced but each
 * missing field (due to adding a new value) automatically is set to the default provided.
 */
export const uiConfigSchema = z.object({
  layout: z.enum(['full', 'fixed']).default(uiConfigDefault.layout),
  theme: z.enum(['light', 'dark']).default(uiConfigDefault.theme),
  // Cast needed: `.passthrough()` adds `[x: string]: unknown` to inferred types,
  // which is incompatible with the `Sorting`/`TableConfig` interfaces that lack
  // index signatures. The default value itself is correct — `.default()` stores
  // it as-is without re-validating.
  tableSettings: tableSettingsSchema.default(uiConfigDefault.tableSettings as z.output<typeof tableSettingsSchema>),
  timefmt: z.string().default(uiConfigDefault.timefmt),
  refreshPage: z.boolean().default(uiConfigDefault.refreshPage),
  refreshInterval: z.coerce.number().default(uiConfigDefault.refreshInterval)
});
