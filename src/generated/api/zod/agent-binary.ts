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

export const zAgentBinaryResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/agentbinaries?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/agentbinaries?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/agentbinaries?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/agentbinaries?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/agentbinaries?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.object({
    id: z.int(),
    type: z.literal('agentBinary'),
    attributes: z.object({
      binaryType: z.string(),
      version: z.string(),
      operatingSystems: z.string(),
      filename: z.string(),
      updateTrack: z.string(),
      updateAvailable: z.string()
    })
  }),
  relationships: z.record(z.string(), z.unknown()).optional(),
  included: z.array(z.unknown()).optional()
});

export const zAgentBinaryPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('agentBinary'),
    attributes: z.object({
      binaryType: z.string(),
      version: z.string(),
      operatingSystems: z.string(),
      filename: z.string(),
      updateTrack: z.string(),
      updateAvailable: z.string()
    })
  })
});

export const zAgentBinaryListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/agentbinaries?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/agentbinaries?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/agentbinaries?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/agentbinaries?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/agentbinaries?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('agentBinary'),
      attributes: z.object({
        binaryType: z.string(),
        version: z.string(),
        operatingSystems: z.string(),
        filename: z.string(),
        updateTrack: z.string(),
        updateAvailable: z.string()
      })
    })
  ),
  relationships: z.record(z.string(), z.unknown()).optional(),
  included: z.array(z.unknown()).optional()
});

export const zDeleteAgentbinariesData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zGetAgentbinariesData = z.object({
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
export const zGetAgentbinariesResponse = zAgentBinaryListResponse;

export const zPatchAgentbinariesData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zPostAgentbinariesData = z.object({
  body: zAgentBinaryCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostAgentbinariesResponse = zAgentBinaryPostPatchResponse;

export const zGetAgentbinariesCountData = z.object({
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
export const zGetAgentbinariesCountResponse = zAgentBinaryListResponse;

export const zDeleteAgentbinariesByIdData = z.object({
  body: z.record(z.string(), z.unknown()),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteAgentbinariesByIdResponse = z.void();

export const zGetAgentbinariesByIdData = z.object({
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
export const zGetAgentbinariesByIdResponse = zAgentBinaryResponse;

export const zPatchAgentbinariesByIdData = z.object({
  body: zAgentBinaryPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchAgentbinariesByIdResponse = zAgentBinaryPostPatchResponse;
