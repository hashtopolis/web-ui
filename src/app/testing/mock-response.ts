import { ResponseWrapper } from '@models/response.model';

/**
 * Creates a ResponseWrapper with sensible defaults for use in tests.
 * Override any field by passing it in the overrides object.
 */
export function mockResponse(overrides: Record<string, unknown> = {}): ResponseWrapper {
  return {
    data: [],
    links: { self: '/test' },
    meta: { page: { total_elements: 0 } },
    ...overrides
  } as ResponseWrapper;
}
