import * as z from 'zod';

export const zAgentPatch = z.object({
  data: z.object({
    type: z.literal('agent'),
    attributes: z.object({
      agentName: z.string().optional(),
      cmdPars: z.string().optional(),
      cpuOnly: z.boolean().optional(),
      ignoreErrors: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
      isActive: z.boolean().optional(),
      isTrusted: z.boolean().optional(),
      os: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
      uid: z.string().optional(),
      userId: z.int().nullish()
    })
  })
});

export const zAgentResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/agents?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/agents?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/agents?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/agents?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/agents?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.object({
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
  relationships: z
    .object({
      accessGroups: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/accessGroups'),
          related: z.string().default('/api/v2/ui/agents/accessGroups')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('accessGroup'),
              id: z.int()
            })
          )
          .optional()
      }),
      agentErrors: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/agentErrors'),
          related: z.string().default('/api/v2/ui/agents/agentErrors')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agentError'),
              id: z.int()
            })
          )
          .optional()
      }),
      agentStats: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/agentStats'),
          related: z.string().default('/api/v2/ui/agents/agentStats')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agentStat'),
              id: z.int()
            })
          )
          .optional()
      }),
      assignments: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/assignments'),
          related: z.string().default('/api/v2/ui/agents/assignments')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agentAssignment'),
              id: z.int()
            })
          )
          .optional()
      }),
      chunks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/chunks'),
          related: z.string().default('/api/v2/ui/agents/chunks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('chunk'),
              id: z.int()
            })
          )
          .optional()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/tasks'),
          related: z.string().default('/api/v2/ui/agents/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.int()
            })
          )
          .optional()
      }),
      user: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/user'),
          related: z.string().default('/api/v2/ui/agents/user')
        }),
        data: z
          .object({
            type: z.literal('user'),
            id: z.int()
          })
          .nullish()
      })
    })
    .optional(),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('user'),
          attributes: z.object({
            name: z.string(),
            email: z.string(),
            isValid: z.boolean(),
            isComputedPassword: z.boolean(),
            lastLoginDate: z.number(),
            registeredSince: z.number(),
            sessionLifetime: z.int(),
            globalPermissionGroupId: z.int(),
            yubikey: z.string(),
            otp1: z.string(),
            otp2: z.string(),
            otp3: z.string(),
            otp4: z.string()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('agentStat'),
          attributes: z.object({
            agentId: z.int(),
            statType: z.union([z.literal(1), z.literal(2), z.literal(3)]),
            time: z.number(),
            value: z.array(z.int())
          })
        }),
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
        }),
        z.object({
          id: z.int(),
          type: z.literal('chunk'),
          attributes: z.object({
            taskId: z.int(),
            skip: z.int(),
            length: z.int(),
            agentId: z.int(),
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
        }),
        z.object({
          id: z.int(),
          type: z.literal('agentAssignment'),
          attributes: z.object({
            taskId: z.int(),
            agentId: z.int(),
            benchmark: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zAgentPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.object({
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
  })
});

export const zAgentListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/agents?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/agents?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/agents?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/agents?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/agents?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.array(
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
    })
  ),
  relationships: z
    .object({
      accessGroups: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/accessGroups'),
          related: z.string().default('/api/v2/ui/agents/accessGroups')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('accessGroup'),
              id: z.int()
            })
          )
          .optional()
      }),
      agentErrors: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/agentErrors'),
          related: z.string().default('/api/v2/ui/agents/agentErrors')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agentError'),
              id: z.int()
            })
          )
          .optional()
      }),
      agentStats: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/agentStats'),
          related: z.string().default('/api/v2/ui/agents/agentStats')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agentStat'),
              id: z.int()
            })
          )
          .optional()
      }),
      assignments: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/assignments'),
          related: z.string().default('/api/v2/ui/agents/assignments')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agentAssignment'),
              id: z.int()
            })
          )
          .optional()
      }),
      chunks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/chunks'),
          related: z.string().default('/api/v2/ui/agents/chunks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('chunk'),
              id: z.int()
            })
          )
          .optional()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/tasks'),
          related: z.string().default('/api/v2/ui/agents/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.int()
            })
          )
          .optional()
      }),
      user: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/user'),
          related: z.string().default('/api/v2/ui/agents/user')
        }),
        data: z
          .object({
            type: z.literal('user'),
            id: z.int()
          })
          .nullish()
      })
    })
    .optional(),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('user'),
          attributes: z.object({
            name: z.string(),
            email: z.string(),
            isValid: z.boolean(),
            isComputedPassword: z.boolean(),
            lastLoginDate: z.number(),
            registeredSince: z.number(),
            sessionLifetime: z.int(),
            globalPermissionGroupId: z.int(),
            yubikey: z.string(),
            otp1: z.string(),
            otp2: z.string(),
            otp3: z.string(),
            otp4: z.string()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('agentStat'),
          attributes: z.object({
            agentId: z.int(),
            statType: z.union([z.literal(1), z.literal(2), z.literal(3)]),
            time: z.number(),
            value: z.array(z.int())
          })
        }),
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
        }),
        z.object({
          id: z.int(),
          type: z.literal('chunk'),
          attributes: z.object({
            taskId: z.int(),
            skip: z.int(),
            length: z.int(),
            agentId: z.int(),
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
        }),
        z.object({
          id: z.int(),
          type: z.literal('agentAssignment'),
          attributes: z.object({
            taskId: z.int(),
            agentId: z.int(),
            benchmark: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zAgentRelationAssignments = z.object({
  data: z.array(
    z.object({
      type: z.literal('assignments'),
      id: z.int().default(1)
    })
  )
});

export const zAgentRelationAssignmentsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('assignments'),
      id: z.int().default(1)
    })
  )
});

export const zDeleteAgentsData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zGetAgentsData = z.object({
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
export const zGetAgentsResponse = zAgentListResponse;

export const zPatchAgentsData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zGetAgentsCountData = z.object({
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
export const zGetAgentsCountResponse = zAgentListResponse;

export const zGetAgentsByIdByRelationData = z.object({
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
export const zGetAgentsByIdByRelationResponse = zAgentRelationAssignmentsGetResponse;

export const zDeleteAgentsByIdRelationshipsByRelationData = z.object({
  body: zAgentRelationAssignments,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteAgentsByIdRelationshipsByRelationResponse = z.void();

export const zGetAgentsByIdRelationshipsByRelationData = z.object({
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
export const zGetAgentsByIdRelationshipsByRelationResponse = zAgentResponse;

export const zPatchAgentsByIdRelationshipsByRelationData = z.object({
  body: zAgentRelationAssignments,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchAgentsByIdRelationshipsByRelationResponse = z.void();

export const zPostAgentsByIdRelationshipsByRelationData = z.object({
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
export const zPostAgentsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteAgentsByIdData = z.object({
  body: z.record(z.string(), z.unknown()),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteAgentsByIdResponse = z.void();

export const zGetAgentsByIdData = z.object({
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
export const zGetAgentsByIdResponse = zAgentResponse;

export const zPatchAgentsByIdData = z.object({
  body: zAgentPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchAgentsByIdResponse = zAgentPostPatchResponse;
