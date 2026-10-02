import * as z from 'zod';

export const zAgentAssignmentCreate = z.object({
  data: z.object({
    type: z.literal('agentAssignment'),
    attributes: z.object({
      taskId: z.int(),
      agentId: z.int(),
      benchmark: z.string()
    })
  })
});

export const zAgentAssignmentPatch = z.object({
  data: z.object({
    type: z.literal('agentAssignment'),
    attributes: z.object({
      benchmark: z.string().optional()
    })
  })
});

export const zAgentAssignmentPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('agentAssignment'),
      attributes: z.object({
        benchmark: z.string().optional()
      })
    })
  )
});

export const zAgentAssignmentDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('agentAssignment')
    })
  )
});

export const zAgentAssignmentResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agentassignments/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('agentAssignment'),
    attributes: z.object({
      taskId: z.int(),
      agentId: z.int(),
      benchmark: z.string(),
      crackingTime: z.int().optional(),
      cracked: z.int().optional(),
      currentSpeed: z.int().optional(),
      currentChunkId: z.int().optional(),
      searched: z.int().optional()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/agentassignments/1')
    }),
    relationships: z.object({
      agent: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agentassignments/relationships/agent'),
          related: z.string().default('/api/v2/ui/agentassignments/agent')
        }),
        data: z
          .object({
            type: z.literal('agent'),
            id: z.int()
          })
          .nullish()
      }),
      task: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agentassignments/relationships/task'),
          related: z.string().default('/api/v2/ui/agentassignments/task')
        }),
        data: z
          .object({
            type: z.literal('task'),
            id: z.int()
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
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
            userId: z.int().nullable(),
            cpuOnly: z.boolean(),
            clientSignature: z.string()
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

export const zAgentAssignmentPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agentassignments/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('agentAssignment'),
    attributes: z.object({
      taskId: z.int(),
      agentId: z.int(),
      benchmark: z.string(),
      crackingTime: z.int().optional(),
      cracked: z.int().optional(),
      currentSpeed: z.int().optional(),
      currentChunkId: z.int().optional(),
      searched: z.int().optional()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/agentassignments/1')
    }),
    relationships: z.object({
      agent: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agentassignments/relationships/agent'),
          related: z.string().default('/api/v2/ui/agentassignments/agent')
        }),
        data: z
          .object({
            type: z.literal('agent'),
            id: z.int()
          })
          .nullish()
      }),
      task: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agentassignments/relationships/task'),
          related: z.string().default('/api/v2/ui/agentassignments/task')
        }),
        data: z
          .object({
            type: z.literal('task'),
            id: z.int()
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
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
            userId: z.int().nullable(),
            cpuOnly: z.boolean(),
            clientSignature: z.string()
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

export const zAgentAssignmentListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agentassignments?page[size]=25'),
    first: z.string().default('/api/v2/ui/agentassignments?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agentassignments?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agentassignments?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agentassignments?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('agentAssignment'),
      attributes: z.object({
        taskId: z.int(),
        agentId: z.int(),
        benchmark: z.string(),
        crackingTime: z.int().optional(),
        cracked: z.int().optional(),
        currentSpeed: z.int().optional(),
        currentChunkId: z.int().optional(),
        searched: z.int().optional()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/agentassignments/1')
      }),
      relationships: z.object({
        agent: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/agentassignments/relationships/agent'),
            related: z.string().default('/api/v2/ui/agentassignments/agent')
          }),
          data: z
            .object({
              type: z.literal('agent'),
              id: z.int()
            })
            .nullish()
        }),
        task: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/agentassignments/relationships/task'),
            related: z.string().default('/api/v2/ui/agentassignments/task')
          }),
          data: z
            .object({
              type: z.literal('task'),
              id: z.int()
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
          id: z.int(),
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
            userId: z.int().nullable(),
            cpuOnly: z.boolean(),
            clientSignature: z.string()
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

export const zAgentAssignmentCountResponse = z.object({
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

export const zAgentAssignmentRelationTask = z.object({
  data: z.object({
    type: z.literal('task'),
    id: z.int()
  })
});

export const zAgentAssignmentRelationTaskGetResponse = z.object({
  data: z.object({
    type: z.literal('task'),
    id: z.int()
  })
});

export const zDeleteAgentassignmentsData = z.object({
  body: zAgentAssignmentDeleteMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteAgentassignmentsResponse = z.void();

export const zGetAgentassignmentsData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z
    .object({
      'page[after]': z.string().optional(),
      'page[before]': z.string().optional(),
      'page[size]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      filter: z.record(z.string(), z.string()).optional(),
      include: z.array(z.enum(['agent', 'task'])).optional(),
      aggregate: z.record(z.string(), z.string()).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetAgentassignmentsResponse = zAgentAssignmentListResponse;

export const zPatchAgentassignmentsData = z.object({
  body: zAgentAssignmentPatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchAgentassignmentsResponse = z.void();

export const zPostAgentassignmentsData = z.object({
  body: zAgentAssignmentCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostAgentassignmentsResponse = zAgentAssignmentPostPatchResponse;

export const zGetAgentassignmentsCountData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z
    .object({
      filter: z.record(z.string(), z.string()).optional(),
      include_total: z.boolean().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetAgentassignmentsCountResponse = zAgentAssignmentCountResponse;

export const zGetAgentassignmentsByIdByRelationData = z.object({
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
export const zGetAgentassignmentsByIdByRelationResponse = zAgentAssignmentRelationTaskGetResponse;

export const zGetAgentassignmentsByIdRelationshipsByRelationData = z.object({
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
export const zGetAgentassignmentsByIdRelationshipsByRelationResponse = zAgentAssignmentResponse;

export const zPatchAgentassignmentsByIdRelationshipsByRelationData = z.object({
  body: zAgentAssignmentRelationTask,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchAgentassignmentsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteAgentassignmentsByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteAgentassignmentsByIdResponse = z.void();

export const zGetAgentassignmentsByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.array(z.enum(['agent', 'task'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetAgentassignmentsByIdResponse = zAgentAssignmentResponse;

export const zPatchAgentassignmentsByIdData = z.object({
  body: zAgentAssignmentPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchAgentassignmentsByIdResponse = zAgentAssignmentPostPatchResponse;
