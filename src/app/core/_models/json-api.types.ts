import { z } from 'zod';
import { TJsonApiLinks } from 'jsona/lib/JsonaTypes';

// ── Helpers ──────────────────────────────────────────────────────

/**
 * Make optional `data` required so conditional type matching works.
 * Guard: only activates when T actually has a `data` key
 * (preserves backward compat for flat schemas).
 */
type NormalizeEnvelope<T> = 'data' extends keyof T
  ? T extends { data?: infer D }
    ? Omit<T, 'data'> & { data: NonNullable<D> }
    : T
  : T;

/**
 * Properties injected by jsona at runtime on every deserialized object.
 */
type JsonaRuntimeProps = {
  links?: TJsonApiLinks;
  relationshipNames?: string[];
};

/**
 * Flatten a JSON:API resource object: merge attributes into the root,
 * strip the `attributes` and `relationships` wrappers.
 *
 * { id, type, attributes: { name } } → { id, type, name }
 */
type FlattenItem<D> = D extends { attributes?: infer A }
  ? Omit<D, 'attributes' | 'relationships'> & NonNullable<A> & JsonaRuntimeProps
  : D & JsonaRuntimeProps;

// ── Main types ───────────────────────────────────────────────────

type JsonApiPayloadInner<T> = T extends { data: (infer D)[] }
  ? FlattenItem<D>[]
  : T extends { data: infer D }
    ? FlattenItem<D>
    : T;

/**
 * Transform a JSON:API envelope type into the flat model type
 * that jsona's `deserialize()` produces at runtime.
 *
 * Handles: optional data/attributes, relationships from included,
 * both array and single-object data.
 */
export type JsonApiPayload<T> = JsonApiPayloadInner<NormalizeEnvelope<T>>;

/**
 * Shorthand: extract JsonApiPayload directly from a Zod envelope schema.
 */
export type JsonApiPayloadOf<TSchema extends z.ZodTypeAny> = JsonApiPayload<
  z.infer<TSchema>
>;

