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
      userId: z.string().nullish()
    })
  })
});

export const zAgentPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
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
        userId: z.string().nullish()
      })
    })
  )
});

export const zAgentDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('agent')
    })
  )
});

export const zAgentResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agents/1')
  }),
  data: z.object({
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
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/agents/1')
    }),
    relationships: z.object({
      accessGroups: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/accessGroups'),
          related: z.string().default('/api/v2/ui/agents/accessGroups')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('accessGroup'),
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
          type: z.literal('user'),
          attributes: z.object({
            name: z.string(),
            email: z.string(),
            isValid: z.boolean(),
            isComputedPassword: z.boolean(),
            lastLoginDate: z.number(),
            registeredSince: z.number(),
            sessionLifetime: z.int(),
            globalPermissionGroupId: z.string(),
            yubikey: z.string(),
            otp1: z.string(),
            otp2: z.string(),
            otp3: z.string(),
            otp4: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agentStat'),
          attributes: z.object({
            agentId: z.string(),
            statType: z.union([z.literal(1), z.literal(2), z.literal(3)]),
            time: z.number(),
            value: z.array(z.int())
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agentError'),
          attributes: z.object({
            agentId: z.string(),
            taskId: z.string(),
            chunkId: z.string().nullable(),
            time: z.number(),
            error: z.string()
          })
        }),
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
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agentAssignment'),
          attributes: z.object({
            taskId: z.string(),
            agentId: z.string(),
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
  links: z.object({
    self: z.string().default('/api/v2/ui/agents/1')
  }),
  data: z.object({
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
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/agents/1')
    }),
    relationships: z.object({
      accessGroups: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/agents/relationships/accessGroups'),
          related: z.string().default('/api/v2/ui/agents/accessGroups')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('accessGroup'),
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
          type: z.literal('user'),
          attributes: z.object({
            name: z.string(),
            email: z.string(),
            isValid: z.boolean(),
            isComputedPassword: z.boolean(),
            lastLoginDate: z.number(),
            registeredSince: z.number(),
            sessionLifetime: z.int(),
            globalPermissionGroupId: z.string(),
            yubikey: z.string(),
            otp1: z.string(),
            otp2: z.string(),
            otp3: z.string(),
            otp4: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agentStat'),
          attributes: z.object({
            agentId: z.string(),
            statType: z.union([z.literal(1), z.literal(2), z.literal(3)]),
            time: z.number(),
            value: z.array(z.int())
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agentError'),
          attributes: z.object({
            agentId: z.string(),
            taskId: z.string(),
            chunkId: z.string().nullable(),
            time: z.number(),
            error: z.string()
          })
        }),
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
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agentAssignment'),
          attributes: z.object({
            taskId: z.string(),
            agentId: z.string(),
            benchmark: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zAgentListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/agents?page[size]=25'),
    first: z.string().default('/api/v2/ui/agents?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agents?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agents?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/agents?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/agents/1')
      }),
      relationships: z.object({
        accessGroups: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/agents/relationships/accessGroups'),
            related: z.string().default('/api/v2/ui/agents/accessGroups')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('accessGroup'),
                id: z.string().regex(/^[0-9]+$/)
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
                id: z.string().regex(/^[0-9]+$/)
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
                id: z.string().regex(/^[0-9]+$/)
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
                id: z.string().regex(/^[0-9]+$/)
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
                id: z.string().regex(/^[0-9]+$/)
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
                id: z.string().regex(/^[0-9]+$/)
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
          type: z.literal('user'),
          attributes: z.object({
            name: z.string(),
            email: z.string(),
            isValid: z.boolean(),
            isComputedPassword: z.boolean(),
            lastLoginDate: z.number(),
            registeredSince: z.number(),
            sessionLifetime: z.int(),
            globalPermissionGroupId: z.string(),
            yubikey: z.string(),
            otp1: z.string(),
            otp2: z.string(),
            otp3: z.string(),
            otp4: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agentStat'),
          attributes: z.object({
            agentId: z.string(),
            statType: z.union([z.literal(1), z.literal(2), z.literal(3)]),
            time: z.number(),
            value: z.array(z.int())
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agentError'),
          attributes: z.object({
            agentId: z.string(),
            taskId: z.string(),
            chunkId: z.string().nullable(),
            time: z.number(),
            error: z.string()
          })
        }),
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
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agentAssignment'),
          attributes: z.object({
            taskId: z.string(),
            agentId: z.string(),
            benchmark: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zAgentCountResponse = z.object({
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

export const zAgentRelationAssignments = z.object({
  data: z.array(
    z.object({
      type: z.literal('assignments'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zAgentRelationAssignmentsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('assignments'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zDeleteAgentsBody = zAgentDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteAgentsResponse = z.void();

export const zGetAgentsQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z
    .array(z.enum(['user', 'accessGroups', 'agentStats', 'agentErrors', 'chunks', 'tasks', 'assignments']))
    .optional(),
  aggregate: z.record(z.string(), z.string()).optional()
});

/**
 * successful operation
 */
export const zGetAgentsResponse = zAgentListResponse;

export const zPatchAgentsBody = zAgentPatchMultiple;

/**
 * successfully updated
 */
export const zPatchAgentsResponse = z.void();

export const zGetAgentsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetAgentsCountResponse = zAgentCountResponse;

export const zGetAgentsByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetAgentsByIdByRelationResponse = zAgentRelationAssignmentsGetResponse;

export const zDeleteAgentsByIdRelationshipsByRelationBody = zAgentRelationAssignments;

export const zDeleteAgentsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully deleted
 */
export const zDeleteAgentsByIdRelationshipsByRelationResponse = z.void();

export const zGetAgentsByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetAgentsByIdRelationshipsByRelationResponse = zAgentResponse;

export const zPatchAgentsByIdRelationshipsByRelationBody = zAgentRelationAssignments;

export const zPatchAgentsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchAgentsByIdRelationshipsByRelationResponse = z.void();

export const zPostAgentsByIdRelationshipsByRelationBody = zAgentRelationAssignments;

export const zPostAgentsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully created
 */
export const zPostAgentsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteAgentsByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAgentsByIdResponse = z.void();

export const zGetAgentsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetAgentsByIdQuery = z.object({
  include: z
    .array(z.enum(['user', 'accessGroups', 'agentStats', 'agentErrors', 'chunks', 'tasks', 'assignments']))
    .optional()
});

/**
 * successful operation
 */
export const zGetAgentsByIdResponse = zAgentResponse;

export const zPatchAgentsByIdBody = zAgentPatch;

export const zPatchAgentsByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchAgentsByIdResponse = zAgentPostPatchResponse;
