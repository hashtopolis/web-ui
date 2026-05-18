import * as z from 'zod';

export const zConfigSectionResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/configsections?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/configsections?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/configsections?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/configsections?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/configsections?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.object({
    id: z.int(),
    type: z.literal('configSection'),
    attributes: z.object({
      sectionName: z.string()
    })
  }),
  relationships: z.record(z.string(), z.unknown()).optional(),
  included: z.array(z.unknown()).optional()
});

export const zConfigSectionListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/configsections?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/configsections?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/configsections?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/configsections?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/configsections?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('configSection'),
      attributes: z.object({
        sectionName: z.string()
      })
    })
  ),
  relationships: z.record(z.string(), z.unknown()).optional(),
  included: z.array(z.unknown()).optional()
});

export const zGetConfigsectionsData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z
    .object({
      'page[after]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[before]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[size]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      filter: z.record(z.string(), z.unknown()).optional(),
      include: z.string().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetConfigsectionsResponse = zConfigSectionListResponse;

export const zGetConfigsectionsCountData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z
    .object({
      'page[after]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[before]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[size]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      filter: z.record(z.string(), z.unknown()).optional(),
      include: z.string().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetConfigsectionsCountResponse = zConfigSectionListResponse;

export const zGetConfigsectionsByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.string().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetConfigsectionsByIdResponse = zConfigSectionResponse;
