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

export const zAgentPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
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
  )
});

export const zAgentDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
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
      clientSignature: z.string(),
      crackingTime: z.int().optional()
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
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('user'),
          attributes: z.object({
            name: z.string(),
            email: z.string().optional(),
            isValid: z.boolean().optional(),
            isComputedPassword: z.boolean().optional(),
            lastLoginDate: z.number().optional(),
            registeredSince: z.number().optional(),
            sessionLifetime: z.int().optional(),
            globalPermissionGroupId: z.int().optional()
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
            agentId: z.int().nullable(),
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
  links: z.object({
    self: z.string().default('/api/v2/ui/agents/1')
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
      clientSignature: z.string(),
      crackingTime: z.int().optional()
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
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('user'),
          attributes: z.object({
            name: z.string(),
            email: z.string().optional(),
            isValid: z.boolean().optional(),
            isComputedPassword: z.boolean().optional(),
            lastLoginDate: z.number().optional(),
            registeredSince: z.number().optional(),
            sessionLifetime: z.int().optional(),
            globalPermissionGroupId: z.int().optional()
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
            agentId: z.int().nullable(),
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
        clientSignature: z.string(),
        crackingTime: z.int().optional()
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
    })
  ),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('user'),
          attributes: z.object({
            name: z.string(),
            email: z.string().optional(),
            isValid: z.boolean().optional(),
            isComputedPassword: z.boolean().optional(),
            lastLoginDate: z.number().optional(),
            registeredSince: z.number().optional(),
            sessionLifetime: z.int().optional(),
            globalPermissionGroupId: z.int().optional()
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
            agentId: z.int().nullable(),
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

export const zAgentRelationUser = z.object({
  data: z.object({
    type: z.literal('user'),
    id: z.int()
  })
});

export const zAgentRelationUserGetResponse = z.object({
  data: z.object({
    type: z.literal('user'),
    id: z.int()
  })
});

export const zAgentRelationAccessGroups = z.object({
  data: z.array(
    z.object({
      type: z.literal('accessGroup'),
      id: z.int()
    })
  )
});

export const zAgentRelationAccessGroupsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('accessGroup'),
      id: z.int()
    })
  )
});

export const zAgentRelationAgentStats = z.object({
  data: z.array(
    z.object({
      type: z.literal('agentStat'),
      id: z.int()
    })
  )
});

export const zAgentRelationAgentStatsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('agentStat'),
      id: z.int()
    })
  )
});

export const zAgentRelationAgentErrors = z.object({
  data: z.array(
    z.object({
      type: z.literal('agentError'),
      id: z.int()
    })
  )
});

export const zAgentRelationAgentErrorsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('agentError'),
      id: z.int()
    })
  )
});

export const zAgentRelationChunks = z.object({
  data: z.array(
    z.object({
      type: z.literal('chunk'),
      id: z.int()
    })
  )
});

export const zAgentRelationChunksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('chunk'),
      id: z.int()
    })
  )
});

export const zAgentRelationTasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('task'),
      id: z.int()
    })
  )
});

export const zAgentRelationTasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('task'),
      id: z.int()
    })
  )
});

export const zAgentRelationAssignments = z.object({
  data: z.array(
    z.object({
      type: z.literal('agentAssignment'),
      id: z.int()
    })
  )
});

export const zAgentRelationAssignmentsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('agentAssignment'),
      id: z.int()
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

export const zGetAgentsByIdUserPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdUserResponse = zAgentRelationUserGetResponse;

export const zGetAgentsByIdRelationshipsUserPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdRelationshipsUserResponse = zAgentResponse;

export const zPatchAgentsByIdRelationshipsUserBody = zAgentRelationUser;

export const zPatchAgentsByIdRelationshipsUserPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchAgentsByIdRelationshipsUserResponse = z.void();

export const zGetAgentsByIdAccessGroupsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdAccessGroupsResponse = zAgentRelationAccessGroupsGetResponse;

export const zDeleteAgentsByIdRelationshipsAccessGroupsBody = zAgentRelationAccessGroups;

export const zDeleteAgentsByIdRelationshipsAccessGroupsPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAgentsByIdRelationshipsAccessGroupsResponse = z.void();

export const zGetAgentsByIdRelationshipsAccessGroupsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdRelationshipsAccessGroupsResponse = zAgentResponse;

export const zPatchAgentsByIdRelationshipsAccessGroupsBody = zAgentRelationAccessGroups;

export const zPatchAgentsByIdRelationshipsAccessGroupsPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchAgentsByIdRelationshipsAccessGroupsResponse = z.void();

export const zPostAgentsByIdRelationshipsAccessGroupsBody = zAgentRelationAccessGroups;

export const zPostAgentsByIdRelationshipsAccessGroupsPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostAgentsByIdRelationshipsAccessGroupsResponse = z.void();

export const zGetAgentsByIdAgentStatsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdAgentStatsResponse = zAgentRelationAgentStatsGetResponse;

export const zDeleteAgentsByIdRelationshipsAgentStatsBody = zAgentRelationAgentStats;

export const zDeleteAgentsByIdRelationshipsAgentStatsPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAgentsByIdRelationshipsAgentStatsResponse = z.void();

export const zGetAgentsByIdRelationshipsAgentStatsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdRelationshipsAgentStatsResponse = zAgentResponse;

export const zPatchAgentsByIdRelationshipsAgentStatsBody = zAgentRelationAgentStats;

export const zPatchAgentsByIdRelationshipsAgentStatsPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchAgentsByIdRelationshipsAgentStatsResponse = z.void();

export const zPostAgentsByIdRelationshipsAgentStatsBody = zAgentRelationAgentStats;

export const zPostAgentsByIdRelationshipsAgentStatsPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostAgentsByIdRelationshipsAgentStatsResponse = z.void();

export const zGetAgentsByIdAgentErrorsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdAgentErrorsResponse = zAgentRelationAgentErrorsGetResponse;

export const zDeleteAgentsByIdRelationshipsAgentErrorsBody = zAgentRelationAgentErrors;

export const zDeleteAgentsByIdRelationshipsAgentErrorsPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAgentsByIdRelationshipsAgentErrorsResponse = z.void();

export const zGetAgentsByIdRelationshipsAgentErrorsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdRelationshipsAgentErrorsResponse = zAgentResponse;

export const zPatchAgentsByIdRelationshipsAgentErrorsBody = zAgentRelationAgentErrors;

export const zPatchAgentsByIdRelationshipsAgentErrorsPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchAgentsByIdRelationshipsAgentErrorsResponse = z.void();

export const zPostAgentsByIdRelationshipsAgentErrorsBody = zAgentRelationAgentErrors;

export const zPostAgentsByIdRelationshipsAgentErrorsPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostAgentsByIdRelationshipsAgentErrorsResponse = z.void();

export const zGetAgentsByIdChunksPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdChunksResponse = zAgentRelationChunksGetResponse;

export const zDeleteAgentsByIdRelationshipsChunksBody = zAgentRelationChunks;

export const zDeleteAgentsByIdRelationshipsChunksPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAgentsByIdRelationshipsChunksResponse = z.void();

export const zGetAgentsByIdRelationshipsChunksPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdRelationshipsChunksResponse = zAgentResponse;

export const zPatchAgentsByIdRelationshipsChunksBody = zAgentRelationChunks;

export const zPatchAgentsByIdRelationshipsChunksPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchAgentsByIdRelationshipsChunksResponse = z.void();

export const zPostAgentsByIdRelationshipsChunksBody = zAgentRelationChunks;

export const zPostAgentsByIdRelationshipsChunksPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostAgentsByIdRelationshipsChunksResponse = z.void();

export const zGetAgentsByIdTasksPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdTasksResponse = zAgentRelationTasksGetResponse;

export const zDeleteAgentsByIdRelationshipsTasksBody = zAgentRelationTasks;

export const zDeleteAgentsByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAgentsByIdRelationshipsTasksResponse = z.void();

export const zGetAgentsByIdRelationshipsTasksPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdRelationshipsTasksResponse = zAgentResponse;

export const zPatchAgentsByIdRelationshipsTasksBody = zAgentRelationTasks;

export const zPatchAgentsByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchAgentsByIdRelationshipsTasksResponse = z.void();

export const zPostAgentsByIdRelationshipsTasksBody = zAgentRelationTasks;

export const zPostAgentsByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostAgentsByIdRelationshipsTasksResponse = z.void();

export const zGetAgentsByIdAssignmentsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdAssignmentsResponse = zAgentRelationAssignmentsGetResponse;

export const zDeleteAgentsByIdRelationshipsAssignmentsBody = zAgentRelationAssignments;

export const zDeleteAgentsByIdRelationshipsAssignmentsPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAgentsByIdRelationshipsAssignmentsResponse = z.void();

export const zGetAgentsByIdRelationshipsAssignmentsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetAgentsByIdRelationshipsAssignmentsResponse = zAgentResponse;

export const zPatchAgentsByIdRelationshipsAssignmentsBody = zAgentRelationAssignments;

export const zPatchAgentsByIdRelationshipsAssignmentsPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchAgentsByIdRelationshipsAssignmentsResponse = z.void();

export const zPostAgentsByIdRelationshipsAssignmentsBody = zAgentRelationAssignments;

export const zPostAgentsByIdRelationshipsAssignmentsPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostAgentsByIdRelationshipsAssignmentsResponse = z.void();

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
