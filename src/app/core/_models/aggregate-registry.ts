/**
 * Type-level registry that tells the JSON:API deserializer which attributes of a given resource are
 * on-demand "aggregate" fields.
 * Using this registry we can create a type with only the fields included that are actually requested with aggregate param.
 *
 */
import { z } from 'zod';

import { JAgentAggregates } from '@models/agent.model';
import { JPretaskAggregates } from '@models/pretask.model';
import { JTaskAggregates, JTaskWrapperDisplayAggregates } from '@models/task.model';
import { JSuperTaskAggregates } from './supertask.model';

/** Extract the JSON:API resource `type` literal from an envelope type (handles both list and single `data`). */
type ResourceTypeLiteral<T> = T extends { data: readonly (infer D)[] }
  ? D extends { type: infer Ty extends string }
    ? Ty
    : never
  : T extends { data: infer D }
    ? D extends { type: infer Ty extends string }
      ? Ty
      : never
    : never;

/**
 * Maps each JSON:API resource `type` literal to its aggregate-field key union.
 * Extend this when a new entity gains aggregate fields. Entities absent here have no aggregates.
 */
export interface ResourceAggregateMap {
  task: JTaskAggregates;
  agent: JAgentAggregates;
  preTask: JPretaskAggregates;
  taskWrapperDisplay: JTaskWrapperDisplayAggregates;
  superTask: JSuperTaskAggregates;
}

/** Full aggregate-key union for the entity a Zod envelope schema describes (`never` if it has none). */
export type AggregatesOfSchema<TSchema extends z.ZodTypeAny> =
  ResourceTypeLiteral<z.infer<TSchema>> extends keyof ResourceAggregateMap
    ? ResourceAggregateMap[ResourceTypeLiteral<z.infer<TSchema>>]
    : never;
