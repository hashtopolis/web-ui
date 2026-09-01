import { TJsonApiData } from 'jsona/lib/JsonaTypes';
import type { ZodType } from 'zod';

import { ResponseWrapper } from '@models/response.model';

/**
 * Creates a ResponseWrapper with sensible defaults for use in tests.
 * Override any field by passing it in the overrides object.
 *
 * Defaults provided:
 *  - data: []
 *  - included: []
 *  - jsonapi: { version: '1.1', ext: [] }
 *  - links: { self: '/test' }
 *  - meta: { page: { total_elements: 0 } }
 */
export function mockResponse(overrides: Record<string, unknown> = {}): ResponseWrapper {
  return {
    data: [],
    included: [],
    jsonapi: { version: '1.1', ext: [] },
    links: { self: '/test' },
    meta: { page: { total_elements: 0 } },
    ...overrides
  } as ResponseWrapper;
}

/**
 * Builds a JSON:API-compliant resource object (a `data`/`included` item) carrying the plumbing
 * the server always emits: `links`, plus `relationships` for models that declare them (see the
 * server's AbstractBaseAPI::obj2Resource() — permission stripping only drops non-public attributes,
 * never the plumbing). Centralising this keeps fixtures aligned with the compliant contract, so a
 * future envelope-shape change is a one-file update rather than a hunt through every spec.
 *
 * The empty inner objects rely on the generated Zod schemas' defaults to fill `links.self` etc.
 *
 * @param type              JSON:API resource type, e.g. 'user'
 * @param id                resource id
 * @param attributes        resource attributes (only the public ones need be present)
 * @param relationshipNames names of the relationships the model declares, e.g. ['accessGroups', 'globalPermissionGroup']
 */
export function mockResource(
  type: string,
  id: number,
  attributes: Record<string, unknown>,
  relationshipNames: readonly string[] = []
): TJsonApiData {
  const resource: TJsonApiData = { id, type, attributes, links: {} };
  if (relationshipNames.length > 0) {
    resource.relationships = Object.fromEntries(relationshipNames.map((name) => [name, { links: {} }]));
  }
  return resource;
}

/** A resource object as a fixture author writes it: only the parts they care about. */
export interface ResourceInput {
  id: number;
  type: string;
  attributes?: Record<string, unknown>;
  /** Relationship data keyed by relationship name; merged over the auto-generated `{ links: {} }` stubs. */
  relationships?: Record<string, unknown>;
  links?: Record<string, unknown>;
}

interface ValidResponseBody {
  data?: ResourceInput | ResourceInput[];
  included?: ResourceInput[];
  [key: string]: unknown;
}

// Zod's runtime introspection surface is deliberately untyped here; we only ever read shapes.
/* eslint-disable @typescript-eslint/no-explicit-any */

/** Peel ZodDefault/ZodOptional/ZodNullable (and friends) down to the wrapped schema. */
function unwrap(schema: any): any {
  let s = schema;
  while (s?.def?.innerType) {
    s = s.def.innerType;
  }
  return s;
}

/** Resolve the resource-object schema (the `data` item) of a response schema, array or single. */
function itemSchemaOf(responseSchema: any): any {
  const obj = unwrap(responseSchema);
  let data = obj?.shape?.data;
  if (!data) return undefined;
  data = unwrap(data);
  if (data?.def?.type === 'array') {
    data = unwrap(data.def.element ?? data.element);
  }
  return data;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Builds a fully schema-valid `ResponseWrapper` from a minimal fixture body.
 *
 * The compliant JSON:API contract requires every primary resource object to carry `links` and a
 * `relationships` object listing *all* the relationships the model declares (each at least
 * `{ links: {} }`). Rather than hand-maintaining those lists in every spec, this reads the required
 * relationship names straight from the generated Zod schema, so fixtures stay minimal and remain
 * correct as the contract evolves. Authors only supply the attributes (and any relationship data)
 * their test actually exercises; the plumbing is filled in automatically.
 *
 * `included` items are passed through unchanged: the generated schemas type them as plain
 * `{ id, type, attributes }` and never require the plumbing.
 *
 * @param schema the generated response schema the fixture will be validated against
 * @param body   the minimal fixture: `data` (single or array), optional `included`, and any
 *               envelope overrides (`meta`, `links`, ...)
 */
export function mockValidResponse(schema: ZodType, body: ValidResponseBody = {}): ResponseWrapper {
  const itemSchema = itemSchemaOf(schema);
  const shape = itemSchema?.shape ?? {};
  const hasLinks = 'links' in shape;
  const relShape = shape.relationships ? unwrap(shape.relationships).shape : undefined;
  const relNames: string[] = relShape ? Object.keys(relShape) : [];

  const plumb = (item: ResourceInput): TJsonApiData => {
    const resource: TJsonApiData = { id: item.id, type: item.type, attributes: item.attributes ?? {} };
    if (hasLinks) {
      resource.links = item.links ?? {};
    }
    if (relNames.length > 0) {
      resource.relationships = Object.fromEntries(
        relNames.map((name) => {
          const provided = (item.relationships?.[name] as Record<string, unknown> | undefined) ?? {};
          return [name, { links: {}, ...provided }];
        })
      );
    }
    return resource;
  };

  const { data, included, ...envelope } = body;
  const overrides: Record<string, unknown> = { ...envelope };
  if (data !== undefined) {
    overrides['data'] = Array.isArray(data) ? data.map(plumb) : plumb(data);
  }
  if (included !== undefined) {
    overrides['included'] = included;
  }

  return mockResponse(overrides);
}
