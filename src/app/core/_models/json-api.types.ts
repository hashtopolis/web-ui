import { z } from 'zod';

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
 * Flatten a JSON:API resource object: merge attributes into the root,
 * strip the `attributes` and `relationships` wrappers.
 *
 * { id, type, attributes: { name } } → { id, type, name }
 */
type FlattenItem<D> = D extends { attributes?: infer A }
  ? Omit<D, 'attributes' | 'relationships'> & NonNullable<A>
  : D;

/**
 * Extract and flatten the included resource type from an envelope.
 */
type ExtractIncluded<T> = 'included' extends keyof T
  ? T extends { included?: (infer I)[] }
    ? FlattenItem<I>
    : unknown
  : unknown;

/**
 * Extract relationship key names from a type that has a `relationships` property.
 */
type ExtractRelKeys<T> = 'relationships' extends keyof T
  ? T extends { relationships?: infer R }
    ? keyof NonNullable<R>
    : never
  : never;

/**
 * Collect relationship keys from both the data item (correct JSON:API)
 * and the response level (current backend spec) so types work
 * before and after the backend fix.
 */
type AllRelKeys<TEnvelope, TDataItem> =
  | ExtractRelKeys<TDataItem>
  | ExtractRelKeys<TEnvelope>;

/**
 * Map relationship keys to their resolved included types.
 * Jsona can produce: single object, array, or null.
 */
type RelationshipMap<Keys extends PropertyKey, TIncluded> =
  [Keys] extends [never]
    ? {}
    : { [K in Keys]?: TIncluded | TIncluded[] | null };

// ── Main types ───────────────────────────────────────────────────

type JsonApiPayloadInner<T> = T extends { data: (infer D)[] }
  ? (FlattenItem<D> & RelationshipMap<AllRelKeys<T, D>, ExtractIncluded<T>>)[]
  : T extends { data: infer D }
    ? FlattenItem<D> & RelationshipMap<AllRelKeys<T, D>, ExtractIncluded<T>>
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
