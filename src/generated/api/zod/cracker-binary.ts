import * as z from 'zod';

export const zCrackerBinaryCreate = z.object({
  data: z.object({
    type: z.literal('crackerBinary'),
    attributes: z.object({
      crackerBinaryTypeId: z.int(),
      version: z.string(),
      downloadUrl: z.string(),
      binaryName: z.string()
    })
  })
});

export const zCrackerBinaryPatch = z.object({
  data: z.object({
    type: z.literal('crackerBinary'),
    attributes: z.object({
      binaryName: z.string().optional(),
      downloadUrl: z.string().optional(),
      version: z.string().optional()
    })
  })
});

export const zCrackerBinaryResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/crackers?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/crackers?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/crackers?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/crackers?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/crackers?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.object({
    id: z.int(),
    type: z.literal('crackerBinary'),
    attributes: z.object({
      crackerBinaryTypeId: z.int(),
      version: z.string(),
      downloadUrl: z.string(),
      binaryName: z.string()
    })
  }),
  relationships: z
    .object({
      crackerBinaryType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/crackerBinaryType'),
          related: z.string().default('/api/v2/ui/crackers/crackerBinaryType')
        }),
        data: z
          .object({
            type: z.literal('crackerBinaryType'),
            id: z.int()
          })
          .nullish()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/tasks'),
          related: z.string().default('/api/v2/ui/crackers/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.int()
            })
          )
          .optional()
      })
    })
    .optional(),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('task'),
          attributes: z.object({
            taskName: z.string(),
            attackCmd: z.string(),
            chunkTime: z.int(),
            statusTimer: z.int(),
            keyspace: z.number(),
            keyspaceProgress: z.number(),
            priority: z.int(),
            maxAgents: z.int(),
            color: z.string().nullable(),
            isSmall: z.boolean(),
            isCpuTask: z.boolean(),
            useNewBench: z.boolean(),
            skipKeyspace: z.number(),
            crackerBinaryId: z.int(),
            crackerBinaryTypeId: z.int().nullable(),
            taskWrapperId: z.int(),
            isArchived: z.boolean(),
            notes: z.string(),
            staticChunks: z.int(),
            chunkSize: z.number(),
            forcePipe: z.boolean(),
            preprocessorId: z.int(),
            preprocessorCommand: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zCrackerBinaryPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('crackerBinary'),
    attributes: z.object({
      crackerBinaryTypeId: z.int(),
      version: z.string(),
      downloadUrl: z.string(),
      binaryName: z.string()
    })
  })
});

export const zCrackerBinaryListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/crackers?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/crackers?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/crackers?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/crackers?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/crackers?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('crackerBinary'),
      attributes: z.object({
        crackerBinaryTypeId: z.int(),
        version: z.string(),
        downloadUrl: z.string(),
        binaryName: z.string()
      })
    })
  ),
  relationships: z
    .object({
      crackerBinaryType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/crackerBinaryType'),
          related: z.string().default('/api/v2/ui/crackers/crackerBinaryType')
        }),
        data: z
          .object({
            type: z.literal('crackerBinaryType'),
            id: z.int()
          })
          .nullish()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/tasks'),
          related: z.string().default('/api/v2/ui/crackers/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.int()
            })
          )
          .optional()
      })
    })
    .optional(),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('task'),
          attributes: z.object({
            taskName: z.string(),
            attackCmd: z.string(),
            chunkTime: z.int(),
            statusTimer: z.int(),
            keyspace: z.number(),
            keyspaceProgress: z.number(),
            priority: z.int(),
            maxAgents: z.int(),
            color: z.string().nullable(),
            isSmall: z.boolean(),
            isCpuTask: z.boolean(),
            useNewBench: z.boolean(),
            skipKeyspace: z.number(),
            crackerBinaryId: z.int(),
            crackerBinaryTypeId: z.int().nullable(),
            taskWrapperId: z.int(),
            isArchived: z.boolean(),
            notes: z.string(),
            staticChunks: z.int(),
            chunkSize: z.number(),
            forcePipe: z.boolean(),
            preprocessorId: z.int(),
            preprocessorCommand: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zCrackerBinaryRelationTasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.int().default(1)
    })
  )
});

export const zCrackerBinaryRelationTasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.int().default(1)
    })
  )
});

export const zDeleteCrackersData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zGetCrackersData = z.object({
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
export const zGetCrackersResponse = zCrackerBinaryListResponse;

export const zPatchCrackersData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zPostCrackersData = z.object({
  body: zCrackerBinaryCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostCrackersResponse = zCrackerBinaryPostPatchResponse;

export const zGetCrackersCountData = z.object({
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
export const zGetCrackersCountResponse = zCrackerBinaryListResponse;

export const zGetCrackersByIdByRelationData = z.object({
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
export const zGetCrackersByIdByRelationResponse = zCrackerBinaryRelationTasksGetResponse;

export const zDeleteCrackersByIdRelationshipsByRelationData = z.object({
  body: zCrackerBinaryRelationTasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteCrackersByIdRelationshipsByRelationResponse = z.void();

export const zGetCrackersByIdRelationshipsByRelationData = z.object({
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
export const zGetCrackersByIdRelationshipsByRelationResponse = zCrackerBinaryResponse;

export const zPatchCrackersByIdRelationshipsByRelationData = z.object({
  body: zCrackerBinaryRelationTasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchCrackersByIdRelationshipsByRelationResponse = z.void();

export const zPostCrackersByIdRelationshipsByRelationData = z.object({
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
export const zPostCrackersByIdRelationshipsByRelationResponse = z.void();

export const zDeleteCrackersByIdData = z.object({
  body: z.record(z.string(), z.unknown()),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteCrackersByIdResponse = z.void();

export const zGetCrackersByIdData = z.object({
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
export const zGetCrackersByIdResponse = zCrackerBinaryResponse;

export const zPatchCrackersByIdData = z.object({
  body: zCrackerBinaryPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchCrackersByIdResponse = zCrackerBinaryPostPatchResponse;
