import * as z from 'zod';

export const zLogEntryResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/logentries/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('logEntry'),
    attributes: z.object({
      issuer: z.union([z.literal('API'), z.literal('User')]),
      issuerId: z.string(),
      level: z.union([z.literal('warning'), z.literal('error'), z.literal('fatal error'), z.literal('information')]),
      message: z.string(),
      time: z.number()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/logentries/1')
    })
  })
});

export const zLogEntryListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/logentries?page[size]=25'),
    first: z.string().default('/api/v2/ui/logentries?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/logentries?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/logentries?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/logentries?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      )
  }),
  meta: z.object({
    page: z.object({
      total_elements: z.int()
    })
  }),
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('logEntry'),
      attributes: z.object({
        issuer: z.union([z.literal('API'), z.literal('User')]),
        issuerId: z.string(),
        level: z.union([z.literal('warning'), z.literal('error'), z.literal('fatal error'), z.literal('information')]),
        message: z.string(),
        time: z.number()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/logentries/1')
      })
    })
  )
});

export const zLogEntryCountResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    count: z.int(),
    total_count: z.int().optional()
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zGetLogentriesQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.string()).optional()
});

/**
 * successful operation
 */
export const zGetLogentriesResponse = zLogEntryListResponse;

export const zGetLogentriesCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetLogentriesCountResponse = zLogEntryCountResponse;

export const zGetLogentriesByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetLogentriesByIdQuery = z.object({
  include: z.array(z.string()).optional()
});

/**
 * successful operation
 */
export const zGetLogentriesByIdResponse = zLogEntryResponse;
