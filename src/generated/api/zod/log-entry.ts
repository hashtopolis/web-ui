import * as z from 'zod';

export const zLogEntryCreate = z.object({
  data: z.object({
    type: z.literal('logEntry'),
    attributes: z.record(z.string(), z.unknown())
  })
});

export const zLogEntryPatch = z.object({
  data: z.object({
    type: z.literal('logEntry'),
    attributes: z.record(z.string(), z.unknown())
  })
});

export const zLogEntryResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/logentries?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/logentries?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/logentries?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/logentries?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/logentries?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.object({
    id: z.int(),
    type: z.literal('logEntry'),
    attributes: z.object({
      issuer: z.union([z.literal('API'), z.literal('User')]),
      issuerId: z.string(),
      level: z.union([z.literal('warning'), z.literal('error'), z.literal('fatal error'), z.literal('information')]),
      message: z.string(),
      time: z.number()
    })
  }),
  relationships: z.record(z.string(), z.unknown()).optional(),
  included: z.array(z.unknown()).optional()
});

export const zLogEntryPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('logEntry'),
    attributes: z.object({
      issuer: z.union([z.literal('API'), z.literal('User')]),
      issuerId: z.string(),
      level: z.union([z.literal('warning'), z.literal('error'), z.literal('fatal error'), z.literal('information')]),
      message: z.string(),
      time: z.number()
    })
  })
});

export const zLogEntryListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/logentries?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/logentries?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/logentries?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/logentries?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/logentries?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('logEntry'),
      attributes: z.object({
        issuer: z.union([z.literal('API'), z.literal('User')]),
        issuerId: z.string(),
        level: z.union([z.literal('warning'), z.literal('error'), z.literal('fatal error'), z.literal('information')]),
        message: z.string(),
        time: z.number()
      })
    })
  ),
  relationships: z.record(z.string(), z.unknown()).optional(),
  included: z.array(z.unknown()).optional()
});

export const zDeleteLogentriesData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zGetLogentriesData = z.object({
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
export const zGetLogentriesResponse = zLogEntryListResponse;

export const zPatchLogentriesData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zPostLogentriesData = z.object({
  body: zLogEntryCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostLogentriesResponse = zLogEntryPostPatchResponse;

export const zGetLogentriesCountData = z.object({
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
export const zGetLogentriesCountResponse = zLogEntryListResponse;

export const zDeleteLogentriesByIdData = z.object({
  body: z.record(z.string(), z.unknown()),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteLogentriesByIdResponse = z.void();

export const zGetLogentriesByIdData = z.object({
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
export const zGetLogentriesByIdResponse = zLogEntryResponse;

export const zPatchLogentriesByIdData = z.object({
  body: zLogEntryPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchLogentriesByIdResponse = zLogEntryPostPatchResponse;
