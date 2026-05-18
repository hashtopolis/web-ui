import { TJsonApiLinks } from 'jsona/lib/JsonaTypes';
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
 * Properties injected by jsona at runtime on every deserialized object.
 */
type JsonaRuntimeProps = {
  links?: TJsonApiLinks;
  relationshipNames?: string[];
};

// ── Relationship resolution types ────────────────────────────────

/** Extract the typed relationships object from a JSON:API envelope. */
type ExtractRelationships<T> = T extends { relationships?: infer R } ? NonNullable<R> : Record<string, never>;

/** Extract the union of included resource types from a JSON:API envelope. */
type ExtractIncludedUnion<T> = T extends { included?: (infer I)[] } ? I : never;

/**
 * Resolve a relationship to its flattened type.
 * Matches by relationship key name = included type literal.
 * To-many (array data) → FlattenItem<Match>[]
 * To-one  (single data) → FlattenItem<Match> | null
 */
type ResolveRel<K extends string, Rel, IncUnion> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  NonNullable<Rel extends { data?: infer D } ? D : never> extends readonly any[]
    ? FlattenItem<Extract<IncUnion, { type: K }>>[]
    : FlattenItem<Extract<IncUnion, { type: K }>> | null;

/** Map all relationship keys to optional resolved types. */
type RelationshipMap<Rels, IncUnion> = {
  [K in keyof Rels & string]?: ResolveRel<K, Rels[K], IncUnion>;
};

/** Make specified keys required (no-op when K is never). */
type RequireKeys<T, K extends string> = [K] extends [never] ? T : Omit<T, K & keyof T> & Required<Pick<T, K & keyof T>>;

// ── Flatten types ────────────────────────────────────────────────

/**
 * Flatten a JSON:API resource object: merge attributes into the root,
 * strip the `attributes` and `relationships` wrappers.
 *
 * { id, type, attributes: { name } } → { id, type, name }
 */
type FlattenItem<D> = D extends { attributes?: infer A }
  ? Omit<D, 'attributes' | 'relationships'> & Required<NonNullable<A>> & JsonaRuntimeProps
  : D & JsonaRuntimeProps;

/** Flatten data item + attach resolved relationship properties. */
type FlattenItemWithRels<D, Rels, IncUnion> = D extends { attributes?: infer A }
  ? Omit<D, 'attributes' | 'relationships'> &
      Required<NonNullable<A>> &
      RelationshipMap<Rels, IncUnion> &
      JsonaRuntimeProps
  : D & JsonaRuntimeProps;

// ── Main types ───────────────────────────────────────────────────

type JsonApiPayloadInner<T, IncKeys extends string = never> = [IncKeys] extends [never]
  ? T extends { data: (infer D)[] }
    ? FlattenItem<D>[]
    : T extends { data: infer D }
      ? FlattenItem<D>
      : T
  : T extends { data: (infer D)[] }
    ? RequireKeys<FlattenItemWithRels<D, ExtractRelationships<T>, ExtractIncludedUnion<T>>, IncKeys>[]
    : T extends { data: infer D }
      ? RequireKeys<FlattenItemWithRels<D, ExtractRelationships<T>, ExtractIncludedUnion<T>>, IncKeys>
      : T;

/**
 * Transform a JSON:API envelope type into the flat model type
 * that jsona's `deserialize()` produces at runtime.
 *
 * Handles: optional data/attributes, relationships from included,
 * both array and single-object data.
 *
 * Pass IncKeys to make specific relationship properties required
 * (reflecting that those relationships were requested via `include`).
 */
export type JsonApiPayload<T, IncKeys extends string = never> = JsonApiPayloadInner<NormalizeEnvelope<T>, IncKeys>;

/**
 * Shorthand: extract JsonApiPayload directly from a Zod envelope schema.
 */
export type JsonApiPayloadOf<TSchema extends z.ZodTypeAny, IncKeys extends string = never> = JsonApiPayload<
  z.infer<TSchema>,
  IncKeys
>;

/** Valid relationship key names from an envelope type. */
export type RelationshipKeysOf<T> = keyof ExtractRelationships<T> & string;

/** Valid relationship key names from a Zod envelope schema. */
export type RelationshipKeysOfSchema<TSchema extends z.ZodTypeAny> = RelationshipKeysOf<z.infer<TSchema>>;
