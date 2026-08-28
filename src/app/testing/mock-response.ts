import { TJsonApiData } from 'jsona/lib/JsonaTypes';

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
