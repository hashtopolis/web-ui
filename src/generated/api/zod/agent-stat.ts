import * as z from 'zod';

export const zAgentStatDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('agentStat')
    })
  )
});

export const zAgentStatResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agentstats/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('agentStat'),
    attributes: z.object({
      agentId: z.string(),
      statType: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      time: z.number(),
      value: z.array(z.int())
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/agentstats/1')
    })
  })
});

export const zAgentStatListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agentstats?page[size]=25'),
    first: z.string().default('/api/v2/ui/agentstats?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agentstats?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agentstats?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agentstats?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('agentStat'),
      attributes: z.object({
        agentId: z.string(),
        statType: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        time: z.number(),
        value: z.array(z.int())
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/agentstats/1')
      })
    })
  )
});

export const zAgentStatCountResponse = z.object({
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

export const zDeleteAgentstatsBody = zAgentStatDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteAgentstatsResponse = z.void();

export const zGetAgentstatsQuery = z.object({
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
export const zGetAgentstatsResponse = zAgentStatListResponse;

export const zGetAgentstatsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetAgentstatsCountResponse = zAgentStatCountResponse;

export const zDeleteAgentstatsByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAgentstatsByIdResponse = z.void();

export const zGetAgentstatsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetAgentstatsByIdQuery = z.object({
  include: z.array(z.string()).optional()
});

/**
 * successful operation
 */
export const zGetAgentstatsByIdResponse = zAgentStatResponse;
