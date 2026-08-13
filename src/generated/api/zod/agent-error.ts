import * as z from 'zod';

export const zAgentErrorDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('agentError')
    })
  )
});

export const zAgentErrorResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agenterrors/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('agentError'),
    attributes: z.object({
      agentId: z.string(),
      taskId: z.string(),
      chunkId: z.string().nullable(),
      time: z.number(),
      error: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/agenterrors/1')
    }),
    relationships: z.object({
      task: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agenterrors/relationships/task'),
          related: z.string().default('/api/v2/ui/agenterrors/task')
        }),
        data: z
          .object({
            type: z.literal('task'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9]+$/),
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
          crackerBinaryId: z.string(),
          crackerBinaryTypeId: z.string().nullable(),
          taskWrapperId: z.string(),
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
  links: z.object({
    self: z.string().default('/api/v2/ui/agenterrors?page[size]=25'),
    first: z.string().default('/api/v2/ui/agenterrors?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agenterrors?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agenterrors?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agenterrors?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('agentError'),
      attributes: z.object({
        agentId: z.string(),
        taskId: z.string(),
        chunkId: z.string().nullable(),
        time: z.number(),
        error: z.string()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/agenterrors/1')
      }),
      relationships: z.object({
        task: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/agenterrors/relationships/task'),
            related: z.string().default('/api/v2/ui/agenterrors/task')
          }),
          data: z
            .object({
              type: z.literal('task'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        })
      })
    })
  ),
  included: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9]+$/),
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
          crackerBinaryId: z.string(),
          crackerBinaryTypeId: z.string().nullable(),
          taskWrapperId: z.string(),
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

export const zAgentErrorCountResponse = z.object({
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

export const zAgentErrorRelationTask = z.object({
  data: z.object({
    type: z.literal('task'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zAgentErrorRelationTaskGetResponse = z.object({
  data: z.object({
    type: z.literal('task'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zDeleteAgenterrorsBody = zAgentErrorDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteAgenterrorsResponse = z.void();

export const zGetAgenterrorsQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['task'])).optional()
});

/**
 * successful operation
 */
export const zGetAgenterrorsResponse = zAgentErrorListResponse;

export const zGetAgenterrorsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetAgenterrorsCountResponse = zAgentErrorCountResponse;

export const zGetAgenterrorsByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetAgenterrorsByIdByRelationResponse = zAgentErrorRelationTaskGetResponse;

export const zGetAgenterrorsByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetAgenterrorsByIdRelationshipsByRelationResponse = zAgentErrorResponse;

export const zPatchAgenterrorsByIdRelationshipsByRelationBody = zAgentErrorRelationTask;

export const zPatchAgenterrorsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchAgenterrorsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteAgenterrorsByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAgenterrorsByIdResponse = z.void();

export const zGetAgenterrorsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetAgenterrorsByIdQuery = z.object({
  include: z.array(z.enum(['task'])).optional()
});

/**
 * successful operation
 */
export const zGetAgenterrorsByIdResponse = zAgentErrorResponse;
