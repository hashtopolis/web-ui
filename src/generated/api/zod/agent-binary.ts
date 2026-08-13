import * as z from 'zod';

export const zAgentBinaryCreate = z.object({
  data: z.object({
    type: z.literal('agentBinary'),
    attributes: z.object({
      binaryType: z.string(),
      version: z.string(),
      operatingSystems: z.string(),
      filename: z.string(),
      updateTrack: z.string()
    })
  })
});

export const zAgentBinaryPatch = z.object({
  data: z.object({
    type: z.literal('agentBinary'),
    attributes: z.object({
      binaryType: z.string().optional(),
      filename: z.string().optional(),
      operatingSystems: z.string().optional(),
      updateTrack: z.string().optional(),
      version: z.string().optional()
    })
  })
});

export const zAgentBinaryPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('agentBinary'),
      attributes: z.object({
        binaryType: z.string().optional(),
        filename: z.string().optional(),
        operatingSystems: z.string().optional(),
        updateTrack: z.string().optional(),
        version: z.string().optional()
      })
    })
  )
});

export const zAgentBinaryDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('agentBinary')
    })
  )
});

export const zAgentBinaryResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agentbinaries/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('agentBinary'),
    attributes: z.object({
      binaryType: z.string(),
      version: z.string(),
      operatingSystems: z.string(),
      filename: z.string(),
      updateTrack: z.string(),
      updateAvailable: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/agentbinaries/1')
    })
  })
});

export const zAgentBinaryPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agentbinaries/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('agentBinary'),
    attributes: z.object({
      binaryType: z.string(),
      version: z.string(),
      operatingSystems: z.string(),
      filename: z.string(),
      updateTrack: z.string(),
      updateAvailable: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/agentbinaries/1')
    })
  })
});

export const zAgentBinaryListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agentbinaries?page[size]=25'),
    first: z.string().default('/api/v2/ui/agentbinaries?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agentbinaries?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agentbinaries?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agentbinaries?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('agentBinary'),
      attributes: z.object({
        binaryType: z.string(),
        version: z.string(),
        operatingSystems: z.string(),
        filename: z.string(),
        updateTrack: z.string(),
        updateAvailable: z.string()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/agentbinaries/1')
      })
    })
  )
});

export const zAgentBinaryCountResponse = z.object({
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

export const zDeleteAgentbinariesBody = zAgentBinaryDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteAgentbinariesResponse = z.void();

export const zGetAgentbinariesQuery = z.object({
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
export const zGetAgentbinariesResponse = zAgentBinaryListResponse;

export const zPatchAgentbinariesBody = zAgentBinaryPatchMultiple;

/**
 * successfully updated
 */
export const zPatchAgentbinariesResponse = z.void();

export const zPostAgentbinariesBody = zAgentBinaryCreate;

/**
 * successful operation
 */
export const zPostAgentbinariesResponse = zAgentBinaryPostPatchResponse;

export const zGetAgentbinariesCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetAgentbinariesCountResponse = zAgentBinaryCountResponse;

export const zDeleteAgentbinariesByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAgentbinariesByIdResponse = z.void();

export const zGetAgentbinariesByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetAgentbinariesByIdQuery = z.object({
  include: z.array(z.string()).optional()
});

/**
 * successful operation
 */
export const zGetAgentbinariesByIdResponse = zAgentBinaryResponse;

export const zPatchAgentbinariesByIdBody = zAgentBinaryPatch;

export const zPatchAgentbinariesByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchAgentbinariesByIdResponse = zAgentBinaryPostPatchResponse;
