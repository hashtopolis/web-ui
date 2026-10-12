import * as z from 'zod';

export const zTaskResourceObject = z.object({
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
    preprocessorCommand: z.string(),
    totalAssignedAgents: z.int().optional(),
    dispatched: z.string().optional(),
    searched: z.string().optional(),
    status: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
    totalNumberOfChunks: z.int().optional(),
    currentSpeed: z.int().optional(),
    estimatedTime: z.int().optional(),
    cprogress: z.int().optional(),
    timeSpent: z.int().optional(),
    cracked: z.int().optional()
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/tasks/1')
  }),
  relationships: z.object({
    assignedAgents: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/tasks/relationships/assignedAgents'),
        related: z.string().default('/api/v2/ui/tasks/assignedAgents')
      }),
      data: z
        .array(
          z.object({
            type: z.literal('agent'),
            id: z.int()
          })
        )
        .optional()
    }),
    crackerBinary: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinary'),
        related: z.string().default('/api/v2/ui/tasks/crackerBinary')
      }),
      data: z
        .object({
          type: z.literal('crackerBinary'),
          id: z.int()
        })
        .nullish()
    }),
    crackerBinaryType: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinaryType'),
        related: z.string().default('/api/v2/ui/tasks/crackerBinaryType')
      }),
      data: z
        .object({
          type: z.literal('crackerBinaryType'),
          id: z.int()
        })
        .nullish()
    }),
    files: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/tasks/relationships/files'),
        related: z.string().default('/api/v2/ui/tasks/files')
      }),
      data: z
        .array(
          z.object({
            type: z.literal('file'),
            id: z.int()
          })
        )
        .optional()
    }),
    hashlist: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/tasks/relationships/hashlist'),
        related: z.string().default('/api/v2/ui/tasks/hashlist')
      }),
      data: z
        .object({
          type: z.literal('hashlist'),
          id: z.int()
        })
        .nullish()
    }),
    speeds: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/tasks/relationships/speeds'),
        related: z.string().default('/api/v2/ui/tasks/speeds')
      }),
      data: z
        .array(
          z.object({
            type: z.literal('speed'),
            id: z.int()
          })
        )
        .optional()
    })
  })
});

export const zTaskCreate = z.object({
  data: z.object({
    type: z.literal('task'),
    attributes: z.object({
      hashlistId: z.int(),
      files: z.array(z.int()),
      taskName: z.string(),
      attackCmd: z.string(),
      chunkTime: z.int(),
      statusTimer: z.int(),
      priority: z.int(),
      maxAgents: z.int(),
      color: z.string().nullish(),
      isSmall: z.boolean(),
      isCpuTask: z.boolean(),
      useNewBench: z.boolean(),
      skipKeyspace: z.number(),
      crackerBinaryId: z.int(),
      crackerBinaryTypeId: z.int().nullish(),
      isArchived: z.boolean(),
      notes: z.string(),
      staticChunks: z.int(),
      chunkSize: z.number(),
      forcePipe: z.boolean(),
      preprocessorId: z.int(),
      preprocessorCommand: z.string()
    })
  })
});

export const zTaskPatch = z.object({
  data: z.object({
    type: z.literal('task'),
    attributes: z.object({
      attackCmd: z.string().optional(),
      chunkTime: z.int().optional(),
      color: z.string().nullish(),
      isArchived: z.boolean().optional(),
      isCpuTask: z.boolean().optional(),
      isSmall: z.boolean().optional(),
      maxAgents: z.int().optional(),
      notes: z.string().optional(),
      preprocessorCommand: z.string().optional(),
      priority: z.int().optional(),
      statusTimer: z.int().optional(),
      taskName: z.string().optional()
    })
  })
});

export const zTaskPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('task'),
      attributes: z.object({
        attackCmd: z.string().optional(),
        chunkTime: z.int().optional(),
        color: z.string().nullish(),
        isArchived: z.boolean().optional(),
        isCpuTask: z.boolean().optional(),
        isSmall: z.boolean().optional(),
        maxAgents: z.int().optional(),
        notes: z.string().optional(),
        preprocessorCommand: z.string().optional(),
        priority: z.int().optional(),
        statusTimer: z.int().optional(),
        taskName: z.string().optional()
      })
    })
  )
});

export const zTaskDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('task')
    })
  )
});

export const zTaskResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/tasks/1')
  }),
  data: z.object({
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
      preprocessorCommand: z.string(),
      totalAssignedAgents: z.int().optional(),
      dispatched: z.string().optional(),
      searched: z.string().optional(),
      status: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
      totalNumberOfChunks: z.int().optional(),
      currentSpeed: z.int().optional(),
      estimatedTime: z.int().optional(),
      cprogress: z.int().optional(),
      timeSpent: z.int().optional(),
      cracked: z.int().optional()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/tasks/1')
    }),
    relationships: z.object({
      assignedAgents: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/assignedAgents'),
          related: z.string().default('/api/v2/ui/tasks/assignedAgents')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agent'),
              id: z.int()
            })
          )
          .optional()
      }),
      crackerBinary: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinary'),
          related: z.string().default('/api/v2/ui/tasks/crackerBinary')
        }),
        data: z
          .object({
            type: z.literal('crackerBinary'),
            id: z.int()
          })
          .nullish()
      }),
      crackerBinaryType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinaryType'),
          related: z.string().default('/api/v2/ui/tasks/crackerBinaryType')
        }),
        data: z
          .object({
            type: z.literal('crackerBinaryType'),
            id: z.int()
          })
          .nullish()
      }),
      files: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/files'),
          related: z.string().default('/api/v2/ui/tasks/files')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('file'),
              id: z.int()
            })
          )
          .optional()
      }),
      hashlist: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/hashlist'),
          related: z.string().default('/api/v2/ui/tasks/hashlist')
        }),
        data: z
          .object({
            type: z.literal('hashlist'),
            id: z.int()
          })
          .nullish()
      }),
      speeds: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/speeds'),
          related: z.string().default('/api/v2/ui/tasks/speeds')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('speed'),
              id: z.int()
            })
          )
          .optional()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('crackerBinary'),
          attributes: z.object({
            crackerBinaryTypeId: z.int(),
            version: z.string(),
            downloadUrl: z.string().nullable(),
            binaryName: z.string(),
            filename: z.string().nullable(),
            accessGroupId: z.int()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean().nullable()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.int(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.int(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
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
          type: z.literal('file'),
          attributes: z.object({
            filename: z.string(),
            size: z.number(),
            isSecret: z.boolean(),
            fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
            accessGroupId: z.int(),
            lineCount: z.number()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('speed'),
          attributes: z.object({
            agentId: z.int(),
            taskId: z.int(),
            speed: z.number(),
            time: z.number()
          })
        })
      ])
    )
    .optional()
});

export const zTaskPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/tasks/1')
  }),
  data: z.object({
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
      preprocessorCommand: z.string(),
      totalAssignedAgents: z.int().optional(),
      dispatched: z.string().optional(),
      searched: z.string().optional(),
      status: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
      totalNumberOfChunks: z.int().optional(),
      currentSpeed: z.int().optional(),
      estimatedTime: z.int().optional(),
      cprogress: z.int().optional(),
      timeSpent: z.int().optional(),
      cracked: z.int().optional()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/tasks/1')
    }),
    relationships: z.object({
      assignedAgents: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/assignedAgents'),
          related: z.string().default('/api/v2/ui/tasks/assignedAgents')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agent'),
              id: z.int()
            })
          )
          .optional()
      }),
      crackerBinary: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinary'),
          related: z.string().default('/api/v2/ui/tasks/crackerBinary')
        }),
        data: z
          .object({
            type: z.literal('crackerBinary'),
            id: z.int()
          })
          .nullish()
      }),
      crackerBinaryType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinaryType'),
          related: z.string().default('/api/v2/ui/tasks/crackerBinaryType')
        }),
        data: z
          .object({
            type: z.literal('crackerBinaryType'),
            id: z.int()
          })
          .nullish()
      }),
      files: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/files'),
          related: z.string().default('/api/v2/ui/tasks/files')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('file'),
              id: z.int()
            })
          )
          .optional()
      }),
      hashlist: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/hashlist'),
          related: z.string().default('/api/v2/ui/tasks/hashlist')
        }),
        data: z
          .object({
            type: z.literal('hashlist'),
            id: z.int()
          })
          .nullish()
      }),
      speeds: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/tasks/relationships/speeds'),
          related: z.string().default('/api/v2/ui/tasks/speeds')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('speed'),
              id: z.int()
            })
          )
          .optional()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('crackerBinary'),
          attributes: z.object({
            crackerBinaryTypeId: z.int(),
            version: z.string(),
            downloadUrl: z.string().nullable(),
            binaryName: z.string(),
            filename: z.string().nullable(),
            accessGroupId: z.int()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean().nullable()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.int(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.int(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
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
          type: z.literal('file'),
          attributes: z.object({
            filename: z.string(),
            size: z.number(),
            isSecret: z.boolean(),
            fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
            accessGroupId: z.int(),
            lineCount: z.number()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('speed'),
          attributes: z.object({
            agentId: z.int(),
            taskId: z.int(),
            speed: z.number(),
            time: z.number()
          })
        })
      ])
    )
    .optional()
});

export const zTaskListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/tasks?page[size]=25'),
    first: z.string().default('/api/v2/ui/tasks?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/tasks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/tasks?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/tasks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
        preprocessorCommand: z.string(),
        totalAssignedAgents: z.int().optional(),
        dispatched: z.string().optional(),
        searched: z.string().optional(),
        status: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
        totalNumberOfChunks: z.int().optional(),
        currentSpeed: z.int().optional(),
        estimatedTime: z.int().optional(),
        cprogress: z.int().optional(),
        timeSpent: z.int().optional(),
        cracked: z.int().optional()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/tasks/1')
      }),
      relationships: z.object({
        assignedAgents: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/tasks/relationships/assignedAgents'),
            related: z.string().default('/api/v2/ui/tasks/assignedAgents')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('agent'),
                id: z.int()
              })
            )
            .optional()
        }),
        crackerBinary: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinary'),
            related: z.string().default('/api/v2/ui/tasks/crackerBinary')
          }),
          data: z
            .object({
              type: z.literal('crackerBinary'),
              id: z.int()
            })
            .nullish()
        }),
        crackerBinaryType: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinaryType'),
            related: z.string().default('/api/v2/ui/tasks/crackerBinaryType')
          }),
          data: z
            .object({
              type: z.literal('crackerBinaryType'),
              id: z.int()
            })
            .nullish()
        }),
        files: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/tasks/relationships/files'),
            related: z.string().default('/api/v2/ui/tasks/files')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('file'),
                id: z.int()
              })
            )
            .optional()
        }),
        hashlist: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/tasks/relationships/hashlist'),
            related: z.string().default('/api/v2/ui/tasks/hashlist')
          }),
          data: z
            .object({
              type: z.literal('hashlist'),
              id: z.int()
            })
            .nullish()
        }),
        speeds: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/tasks/relationships/speeds'),
            related: z.string().default('/api/v2/ui/tasks/speeds')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('speed'),
                id: z.int()
              })
            )
            .optional()
        })
      })
    })
  ),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('crackerBinary'),
          attributes: z.object({
            crackerBinaryTypeId: z.int(),
            version: z.string(),
            downloadUrl: z.string().nullable(),
            binaryName: z.string(),
            filename: z.string().nullable(),
            accessGroupId: z.int()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean().nullable()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.int(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.int(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
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
          type: z.literal('file'),
          attributes: z.object({
            filename: z.string(),
            size: z.number(),
            isSecret: z.boolean(),
            fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
            accessGroupId: z.int(),
            lineCount: z.number()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('speed'),
          attributes: z.object({
            agentId: z.int(),
            taskId: z.int(),
            speed: z.number(),
            time: z.number()
          })
        })
      ])
    )
    .optional()
});

export const zTaskCountResponse = z.object({
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

export const zTaskRelationCrackerBinary = z.object({
  data: z.object({
    type: z.literal('crackerBinary'),
    id: z.int()
  })
});

export const zTaskRelationCrackerBinaryGetResponse = z.object({
  data: z.object({
    type: z.literal('crackerBinary'),
    id: z.int()
  })
});

export const zTaskRelationCrackerBinaryType = z.object({
  data: z.object({
    type: z.literal('crackerBinaryType'),
    id: z.int()
  })
});

export const zTaskRelationCrackerBinaryTypeGetResponse = z.object({
  data: z.object({
    type: z.literal('crackerBinaryType'),
    id: z.int()
  })
});

export const zTaskRelationHashlist = z.object({
  data: z.object({
    type: z.literal('hashlist'),
    id: z.int()
  })
});

export const zTaskRelationHashlistGetResponse = z.object({
  data: z.object({
    type: z.literal('hashlist'),
    id: z.int()
  })
});

export const zTaskRelationAssignedAgents = z.object({
  data: z.array(
    z.object({
      type: z.literal('agent'),
      id: z.int()
    })
  )
});

export const zTaskRelationAssignedAgentsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('agent'),
      id: z.int()
    })
  )
});

export const zTaskRelationFiles = z.object({
  data: z.array(
    z.object({
      type: z.literal('file'),
      id: z.int()
    })
  )
});

export const zTaskRelationFilesGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('file'),
      id: z.int()
    })
  )
});

export const zTaskRelationSpeeds = z.object({
  data: z.array(
    z.object({
      type: z.literal('speed'),
      id: z.int()
    })
  )
});

export const zTaskRelationSpeedsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('speed'),
      id: z.int()
    })
  )
});

export const zDeleteTasksBody = zTaskDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteTasksResponse = z.void();

export const zGetTasksQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z
    .array(z.enum(['crackerBinary', 'crackerBinaryType', 'hashlist', 'assignedAgents', 'files', 'speeds']))
    .optional(),
  aggregate: z.record(z.string(), z.string()).optional()
});

/**
 * successful operation
 */
export const zGetTasksResponse = zTaskListResponse;

export const zPatchTasksBody = zTaskPatchMultiple;

/**
 * successfully updated
 */
export const zPatchTasksResponse = z.void();

export const zPostTasksBody = zTaskCreate;

/**
 * successful operation
 */
export const zPostTasksResponse = zTaskPostPatchResponse;

export const zGetTasksCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetTasksCountResponse = zTaskCountResponse;

export const zGetTasksByIdCrackerBinaryPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdCrackerBinaryResponse = zTaskRelationCrackerBinaryGetResponse;

export const zGetTasksByIdRelationshipsCrackerBinaryPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdRelationshipsCrackerBinaryResponse = zTaskResponse;

export const zPatchTasksByIdRelationshipsCrackerBinaryBody = zTaskRelationCrackerBinary;

export const zPatchTasksByIdRelationshipsCrackerBinaryPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchTasksByIdRelationshipsCrackerBinaryResponse = z.void();

export const zGetTasksByIdCrackerBinaryTypePath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdCrackerBinaryTypeResponse = zTaskRelationCrackerBinaryTypeGetResponse;

export const zGetTasksByIdRelationshipsCrackerBinaryTypePath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdRelationshipsCrackerBinaryTypeResponse = zTaskResponse;

export const zPatchTasksByIdRelationshipsCrackerBinaryTypeBody = zTaskRelationCrackerBinaryType;

export const zPatchTasksByIdRelationshipsCrackerBinaryTypePath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchTasksByIdRelationshipsCrackerBinaryTypeResponse = z.void();

export const zGetTasksByIdHashlistPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdHashlistResponse = zTaskRelationHashlistGetResponse;

export const zGetTasksByIdRelationshipsHashlistPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdRelationshipsHashlistResponse = zTaskResponse;

export const zPatchTasksByIdRelationshipsHashlistBody = zTaskRelationHashlist;

export const zPatchTasksByIdRelationshipsHashlistPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchTasksByIdRelationshipsHashlistResponse = z.void();

export const zGetTasksByIdAssignedAgentsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdAssignedAgentsResponse = zTaskRelationAssignedAgentsGetResponse;

export const zDeleteTasksByIdRelationshipsAssignedAgentsBody = zTaskRelationAssignedAgents;

export const zDeleteTasksByIdRelationshipsAssignedAgentsPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteTasksByIdRelationshipsAssignedAgentsResponse = z.void();

export const zGetTasksByIdRelationshipsAssignedAgentsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdRelationshipsAssignedAgentsResponse = zTaskResponse;

export const zPatchTasksByIdRelationshipsAssignedAgentsBody = zTaskRelationAssignedAgents;

export const zPatchTasksByIdRelationshipsAssignedAgentsPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchTasksByIdRelationshipsAssignedAgentsResponse = z.void();

export const zPostTasksByIdRelationshipsAssignedAgentsBody = zTaskRelationAssignedAgents;

export const zPostTasksByIdRelationshipsAssignedAgentsPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostTasksByIdRelationshipsAssignedAgentsResponse = z.void();

export const zGetTasksByIdFilesPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdFilesResponse = zTaskRelationFilesGetResponse;

export const zDeleteTasksByIdRelationshipsFilesBody = zTaskRelationFiles;

export const zDeleteTasksByIdRelationshipsFilesPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteTasksByIdRelationshipsFilesResponse = z.void();

export const zGetTasksByIdRelationshipsFilesPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdRelationshipsFilesResponse = zTaskResponse;

export const zPatchTasksByIdRelationshipsFilesBody = zTaskRelationFiles;

export const zPatchTasksByIdRelationshipsFilesPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchTasksByIdRelationshipsFilesResponse = z.void();

export const zPostTasksByIdRelationshipsFilesBody = zTaskRelationFiles;

export const zPostTasksByIdRelationshipsFilesPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostTasksByIdRelationshipsFilesResponse = z.void();

export const zGetTasksByIdSpeedsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdSpeedsResponse = zTaskRelationSpeedsGetResponse;

export const zDeleteTasksByIdRelationshipsSpeedsBody = zTaskRelationSpeeds;

export const zDeleteTasksByIdRelationshipsSpeedsPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteTasksByIdRelationshipsSpeedsResponse = z.void();

export const zGetTasksByIdRelationshipsSpeedsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetTasksByIdRelationshipsSpeedsResponse = zTaskResponse;

export const zPatchTasksByIdRelationshipsSpeedsBody = zTaskRelationSpeeds;

export const zPatchTasksByIdRelationshipsSpeedsPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchTasksByIdRelationshipsSpeedsResponse = z.void();

export const zPostTasksByIdRelationshipsSpeedsBody = zTaskRelationSpeeds;

export const zPostTasksByIdRelationshipsSpeedsPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostTasksByIdRelationshipsSpeedsResponse = z.void();

export const zDeleteTasksByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteTasksByIdResponse = z.void();

export const zGetTasksByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetTasksByIdQuery = z.object({
  include: z
    .array(z.enum(['crackerBinary', 'crackerBinaryType', 'hashlist', 'assignedAgents', 'files', 'speeds']))
    .optional()
});

/**
 * successful operation
 */
export const zGetTasksByIdResponse = zTaskResponse;

export const zPatchTasksByIdBody = zTaskPatch;

export const zPatchTasksByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchTasksByIdResponse = zTaskPostPatchResponse;
