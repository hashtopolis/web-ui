import * as z from 'zod';

export const zAgentErrorResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/agenterrors?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/agenterrors?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/agenterrors?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/agenterrors?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/agenterrors?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.object({
    id: z.int(),
    type: z.literal('agentError'),
    attributes: z.object({
      agentId: z.int(),
      taskId: z.int(),
      chunkId: z.int().nullable(),
      time: z.number(),
      error: z.string()
    })
  }),
  relationships: z
    .object({
      task: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agenterrors/relationships/task'),
          related: z.string().default('/api/v2/ui/agenterrors/task')
        }),
        data: z
          .object({
            type: z.literal('task'),
            id: z.int()
          })
          .nullish()
      })
    })
    .optional(),
  included: z
    .array(
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
    )
    .optional()
});

export const zAgentErrorListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/agenterrors?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/agenterrors?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/agenterrors?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/agenterrors?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/agenterrors?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('agentError'),
      attributes: z.object({
        agentId: z.int(),
        taskId: z.int(),
        chunkId: z.int().nullable(),
        time: z.number(),
        error: z.string()
      })
    })
  ),
  relationships: z
    .object({
      task: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agenterrors/relationships/task'),
          related: z.string().default('/api/v2/ui/agenterrors/task')
        }),
        data: z
          .object({
            type: z.literal('task'),
            id: z.int()
          })
          .nullish()
      })
    })
    .optional(),
  included: z
    .array(
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
    )
    .optional()
});

export const zAgentErrorRelationTask = z.object({
  data: z.object({
    type: z.literal('task'),
    id: z.int().default(1)
  })
});

export const zAgentErrorRelationTaskGetResponse = z.object({
  data: z.object({
    type: z.literal('task'),
    id: z.int().default(1)
  })
});

export const zDeleteAgenterrorsData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zGetAgenterrorsData = z.object({
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
export const zGetAgenterrorsResponse = zAgentErrorListResponse;

export const zGetAgenterrorsCountData = z.object({
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
export const zGetAgenterrorsCountResponse = zAgentErrorListResponse;

export const zGetAgenterrorsByIdByRelationData = z.object({
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
export const zGetAgenterrorsByIdByRelationResponse = zAgentErrorRelationTaskGetResponse;

export const zGetAgenterrorsByIdRelationshipsByRelationData = z.object({
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
export const zGetAgenterrorsByIdRelationshipsByRelationResponse = zAgentErrorResponse;

export const zPatchAgenterrorsByIdRelationshipsByRelationData = z.object({
  body: zAgentErrorRelationTask,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchAgenterrorsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteAgenterrorsByIdData = z.object({
  body: z.record(z.string(), z.unknown()),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteAgenterrorsByIdResponse = z.void();

export const zGetAgenterrorsByIdData = z.object({
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
export const zGetAgenterrorsByIdResponse = zAgentErrorResponse;
