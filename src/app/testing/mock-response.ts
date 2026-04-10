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
