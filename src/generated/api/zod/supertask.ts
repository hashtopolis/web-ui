import * as z from 'zod';

export const zSupertaskCreate = z.object({
  data: z.object({
    type: z.literal('supertask'),
    attributes: z.object({
      pretasks: z.array(z.int()),
      supertaskName: z.string()
    })
  })
});

export const zSupertaskPatch = z.object({
  data: z.object({
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string().optional()
    })
  })
});

export const zSupertaskResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/supertasks?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/supertasks?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/supertasks?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/supertasks?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/supertasks?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.object({
    id: z.int(),
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string()
    })
  }),
  relationships: z
    .object({
      pretasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/supertasks/relationships/pretasks'),
          related: z.string().default('/api/v2/ui/supertasks/pretasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('preTask'),
              id: z.int()
            })
          )
          .optional()
      })
    })
    .optional(),
  included: z
    .array(
      z.object({
        id: z.int(),
        type: z.literal('preTask'),
        attributes: z.object({
          taskName: z.string(),
          attackCmd: z.string(),
          chunkTime: z.int(),
          statusTimer: z.int(),
          color: z.string(),
          isSmall: z.boolean(),
          isCpuTask: z.boolean(),
          useNewBench: z.boolean(),
          priority: z.int(),
          maxAgents: z.int(),
          isMaskImport: z.boolean(),
          crackerBinaryTypeId: z.int()
        })
      })
    )
    .optional()
});

export const zSupertaskSingleResponse = z.object({
  data: z.object({
    id: z.int(),
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string()
    })
  }),
  relationships: z
    .object({
      pretasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/supertasks/relationships/pretasks'),
          related: z.string().default('/api/v2/ui/supertasks/pretasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('preTask'),
              id: z.int()
            })
          )
          .optional()
      })
    })
    .optional(),
  included: z
    .array(
      z.object({
        id: z.int(),
        type: z.literal('preTask'),
        attributes: z.object({
          taskName: z.string(),
          attackCmd: z.string(),
          chunkTime: z.int(),
          statusTimer: z.int(),
          color: z.string(),
          isSmall: z.boolean(),
          isCpuTask: z.boolean(),
          useNewBench: z.boolean(),
          priority: z.int(),
          maxAgents: z.int(),
          isMaskImport: z.boolean(),
          crackerBinaryTypeId: z.int()
        })
      })
    )
    .optional()
});

export const zSupertaskPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string()
    })
  })
});

export const zSupertaskListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/supertasks?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/supertasks?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/supertasks?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/supertasks?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/supertasks?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('supertask'),
      attributes: z.object({
        supertaskName: z.string()
      })
    })
  ),
  relationships: z
    .object({
      pretasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/supertasks/relationships/pretasks'),
          related: z.string().default('/api/v2/ui/supertasks/pretasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('preTask'),
              id: z.int()
            })
          )
          .optional()
      })
    })
    .optional(),
  included: z
    .array(
      z.object({
        id: z.int(),
        type: z.literal('preTask'),
        attributes: z.object({
          taskName: z.string(),
          attackCmd: z.string(),
          chunkTime: z.int(),
          statusTimer: z.int(),
          color: z.string(),
          isSmall: z.boolean(),
          isCpuTask: z.boolean(),
          useNewBench: z.boolean(),
          priority: z.int(),
          maxAgents: z.int(),
          isMaskImport: z.boolean(),
          crackerBinaryTypeId: z.int()
        })
      })
    )
    .optional()
});

export const zSupertaskRelationPretasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('pretasks'),
      id: z.int().default(1)
    })
  )
});

export const zSupertaskRelationPretasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('pretasks'),
      id: z.int().default(1)
    })
  )
});

export const zDeleteSupertasksData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zGetSupertasksData = z.object({
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
export const zGetSupertasksResponse = zSupertaskListResponse;

export const zPatchSupertasksData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zPostSupertasksData = z.object({
  body: zSupertaskCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostSupertasksResponse = zSupertaskPostPatchResponse;

export const zGetSupertasksCountData = z.object({
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
export const zGetSupertasksCountResponse = zSupertaskListResponse;

export const zGetSupertasksByIdByRelationData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetSupertasksByIdByRelationResponse = zSupertaskRelationPretasksGetResponse;

export const zDeleteSupertasksByIdRelationshipsByRelationData = z.object({
  body: zSupertaskRelationPretasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteSupertasksByIdRelationshipsByRelationResponse = z.void();

export const zGetSupertasksByIdRelationshipsByRelationData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetSupertasksByIdRelationshipsByRelationResponse = zSupertaskResponse;

export const zPatchSupertasksByIdRelationshipsByRelationData = z.object({
  body: zSupertaskRelationPretasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchSupertasksByIdRelationshipsByRelationResponse = z.void();

export const zPostSupertasksByIdRelationshipsByRelationData = z.object({
  body: z.record(z.string(), z.unknown()),
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully created
 */
export const zPostSupertasksByIdRelationshipsByRelationResponse = z.void();

export const zDeleteSupertasksByIdData = z.object({
  body: z.record(z.string(), z.unknown()),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteSupertasksByIdResponse = z.void();

export const zGetSupertasksByIdData = z.object({
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
export const zGetSupertasksByIdResponse = zSupertaskResponse;

export const zPatchSupertasksByIdData = z.object({
  body: zSupertaskPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchSupertasksByIdResponse = zSupertaskPostPatchResponse;
