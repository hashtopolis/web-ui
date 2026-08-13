import * as z from 'zod';

export const zSpeedResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/speeds/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('speed'),
    attributes: z.object({
      agentId: z.string(),
      taskId: z.string(),
      speed: z.number(),
      time: z.number()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/speeds/1')
    }),
    relationships: z.object({
      agent: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/speeds/relationships/agent'),
          related: z.string().default('/api/v2/ui/speeds/agent')
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
          self: z.string().default('/api/v2/ui/speeds/relationships/task'),
          related: z.string().default('/api/v2/ui/speeds/task')
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

export const zSpeedListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/speeds?page[size]=25'),
    first: z.string().default('/api/v2/ui/speeds?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/speeds?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/speeds?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/speeds?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('speed'),
      attributes: z.object({
        agentId: z.string(),
        taskId: z.string(),
        speed: z.number(),
        time: z.number()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/speeds/1')
      }),
      relationships: z.object({
        agent: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/speeds/relationships/agent'),
            related: z.string().default('/api/v2/ui/speeds/agent')
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
            self: z.string().default('/api/v2/ui/speeds/relationships/task'),
            related: z.string().default('/api/v2/ui/speeds/task')
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

export const zSpeedCountResponse = z.object({
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

export const zSpeedRelationTask = z.object({
  data: z.object({
    type: z.literal('task'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zSpeedRelationTaskGetResponse = z.object({
  data: z.object({
    type: z.literal('task'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zGetSpeedsQuery = z.object({
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
export const zGetSpeedsResponse = zSpeedListResponse;

export const zGetSpeedsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetSpeedsCountResponse = zSpeedCountResponse;

export const zGetSpeedsByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetSpeedsByIdByRelationResponse = zSpeedRelationTaskGetResponse;

export const zGetSpeedsByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetSpeedsByIdRelationshipsByRelationResponse = zSpeedResponse;

export const zPatchSpeedsByIdRelationshipsByRelationBody = zSpeedRelationTask;

export const zPatchSpeedsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchSpeedsByIdRelationshipsByRelationResponse = z.void();

export const zGetSpeedsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetSpeedsByIdQuery = z.object({
  include: z.array(z.enum(['agent', 'task'])).optional()
});

/**
 * successful operation
 */
export const zGetSpeedsByIdResponse = zSpeedResponse;
