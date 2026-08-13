import * as z from 'zod';

export const zChunkResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/chunks/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('chunk'),
    attributes: z.object({
      taskId: z.string(),
      skip: z.int(),
      length: z.int(),
      agentId: z.string(),
      dispatchTime: z.number(),
      solveTime: z.number(),
      checkpoint: z.number(),
      progress: z.int(),
      state: z.union([
        z.literal(0),
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
        z.literal(7),
        z.literal(8),
        z.literal(9),
        z.literal(10)
      ]),
      cracked: z.int(),
      speed: z.number()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/chunks/1')
    }),
    relationships: z.object({
      agent: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/chunks/relationships/agent'),
          related: z.string().default('/api/v2/ui/chunks/agent')
        }),
        data: z
          .object({
            type: z.literal('agent'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      task: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/chunks/relationships/task'),
          related: z.string().default('/api/v2/ui/chunks/task')
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
      z.union([
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agent'),
          attributes: z.object({
            agentName: z.string(),
            uid: z.string(),
            os: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            devices: z.string(),
            cmdPars: z.string(),
            ignoreErrors: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            isActive: z.boolean(),
            isTrusted: z.boolean(),
            token: z.string(),
            lastAct: z.string(),
            lastTime: z.number(),
            lastIp: z.string(),
            userId: z.string().nullable(),
            cpuOnly: z.boolean(),
            clientSignature: z.string()
          })
        }),
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
      ])
    )
    .optional()
});

export const zChunkListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/chunks?page[size]=25'),
    first: z.string().default('/api/v2/ui/chunks?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/chunks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/chunks?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/chunks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('chunk'),
      attributes: z.object({
        taskId: z.string(),
        skip: z.int(),
        length: z.int(),
        agentId: z.string(),
        dispatchTime: z.number(),
        solveTime: z.number(),
        checkpoint: z.number(),
        progress: z.int(),
        state: z.union([
          z.literal(0),
          z.literal(1),
          z.literal(2),
          z.literal(3),
          z.literal(4),
          z.literal(5),
          z.literal(6),
          z.literal(7),
          z.literal(8),
          z.literal(9),
          z.literal(10)
        ]),
        cracked: z.int(),
        speed: z.number()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/chunks/1')
      }),
      relationships: z.object({
        agent: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/chunks/relationships/agent'),
            related: z.string().default('/api/v2/ui/chunks/agent')
          }),
          data: z
            .object({
              type: z.literal('agent'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        }),
        task: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/chunks/relationships/task'),
            related: z.string().default('/api/v2/ui/chunks/task')
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
      z.union([
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agent'),
          attributes: z.object({
            agentName: z.string(),
            uid: z.string(),
            os: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            devices: z.string(),
            cmdPars: z.string(),
            ignoreErrors: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            isActive: z.boolean(),
            isTrusted: z.boolean(),
            token: z.string(),
            lastAct: z.string(),
            lastTime: z.number(),
            lastIp: z.string(),
            userId: z.string().nullable(),
            cpuOnly: z.boolean(),
            clientSignature: z.string()
          })
        }),
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
      ])
    )
    .optional()
});

export const zChunkCountResponse = z.object({
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

export const zChunkRelationTask = z.object({
  data: z.object({
    type: z.literal('task'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zChunkRelationTaskGetResponse = z.object({
  data: z.object({
    type: z.literal('task'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zGetChunksQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['agent', 'task'])).optional()
});

/**
 * successful operation
 */
export const zGetChunksResponse = zChunkListResponse;

export const zGetChunksCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetChunksCountResponse = zChunkCountResponse;

export const zGetChunksByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetChunksByIdByRelationResponse = zChunkRelationTaskGetResponse;

export const zGetChunksByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetChunksByIdRelationshipsByRelationResponse = zChunkResponse;

export const zPatchChunksByIdRelationshipsByRelationBody = zChunkRelationTask;

export const zPatchChunksByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchChunksByIdRelationshipsByRelationResponse = z.void();

export const zGetChunksByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetChunksByIdQuery = z.object({
  include: z.array(z.enum(['agent', 'task'])).optional()
});

/**
 * successful operation
 */
export const zGetChunksByIdResponse = zChunkResponse;
