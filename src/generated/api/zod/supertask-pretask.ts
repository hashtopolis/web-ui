import * as z from 'zod';

export const zSupertaskPretaskPatch = z.object({
  data: z.object({
    type: z.literal('supertaskPretask'),
    attributes: z.object({
      priority: z.int().optional()
    })
  })
});

export const zSupertaskPretaskPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('supertaskPretask'),
      attributes: z.object({
        priority: z.int().optional()
      })
    })
  )
});

export const zSupertaskPretaskResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/supertaskpretasks/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('supertaskPretask'),
    attributes: z.object({
      supertaskId: z.int(),
      pretaskId: z.int(),
      priority: z.int()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/supertaskpretasks/1')
    })
  })
});

export const zSupertaskPretaskPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/supertaskpretasks/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('supertaskPretask'),
    attributes: z.object({
      supertaskId: z.int(),
      pretaskId: z.int(),
      priority: z.int()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/supertaskpretasks/1')
    })
  })
});

export const zSupertaskPretaskListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/supertaskpretasks?page[size]=25'),
    first: z.string().default('/api/v2/ui/supertaskpretasks?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/supertaskpretasks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/supertaskpretasks?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/supertaskpretasks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      )
  }),
  meta: z.object({
    page: z.object({
      total_elements: z.int()
    })
  }),
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('supertaskPretask'),
      attributes: z.object({
        supertaskId: z.int(),
        pretaskId: z.int(),
        priority: z.int()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/supertaskpretasks/1')
      })
    })
  )
});

export const zSupertaskPretaskCountResponse = z.object({
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

export const zGetSupertaskpretasksQuery = z.object({
  'page[after]': z
    .string()
    .regex(/^[A-Za-z0-9+\/]*={0,2}$/)
    .optional(),
  'page[before]': z
    .string()
    .regex(/^[A-Za-z0-9+\/]*={0,2}$/)
    .optional(),
  'page[size]': z
    .int()
    .gte(1)
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.string()).optional()
});

/**
 * successful operation
 */
export const zGetSupertaskpretasksResponse = zSupertaskPretaskListResponse;

export const zPatchSupertaskpretasksBody = zSupertaskPretaskPatchMultiple;

/**
 * successfully updated
 */
export const zPatchSupertaskpretasksResponse = z.void();

export const zGetSupertaskpretasksCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetSupertaskpretasksCountResponse = zSupertaskPretaskCountResponse;

export const zGetSupertaskpretasksByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetSupertaskpretasksByIdQuery = z.object({
  include: z.array(z.string()).optional()
});

/**
 * successful operation
 */
export const zGetSupertaskpretasksByIdResponse = zSupertaskPretaskResponse;

export const zPatchSupertaskpretasksByIdBody = zSupertaskPretaskPatch;

export const zPatchSupertaskpretasksByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchSupertaskpretasksByIdResponse = zSupertaskPretaskPostPatchResponse;
