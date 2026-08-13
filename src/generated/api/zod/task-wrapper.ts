import * as z from 'zod';

export const zTaskWrapperPatch = z.object({
  data: z.object({
    type: z.literal('taskWrapper'),
    attributes: z.object({
      accessGroupId: z.string().optional(),
      isArchived: z.boolean().optional(),
      maxAgents: z.int().optional(),
      priority: z.int().optional(),
      taskWrapperName: z.string().optional()
    })
  })
});

export const zTaskWrapperPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('taskWrapper'),
      attributes: z.object({
        accessGroupId: z.string().optional(),
        isArchived: z.boolean().optional(),
        maxAgents: z.int().optional(),
        priority: z.int().optional(),
        taskWrapperName: z.string().optional()
      })
    })
  )
});

export const zTaskWrapperDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('taskWrapper')
    })
  )
});

export const zTaskWrapperResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/taskwrappers/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('taskWrapper'),
    attributes: z.object({
      priority: z.int(),
      maxAgents: z.int(),
      taskType: z.union([z.literal(0), z.literal(1)]),
      hashlistId: z.string(),
      accessGroupId: z.string(),
      taskWrapperName: z.string(),
      isArchived: z.boolean(),
      cracked: z.int()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/taskwrappers/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/taskwrappers/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashType'),
          related: z.string().default('/api/v2/ui/taskwrappers/hashType')
        }),
        data: z
          .object({
            type: z.literal('hashType'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashlist: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashlist'),
          related: z.string().default('/api/v2/ui/taskwrappers/hashlist')
        }),
        data: z
          .object({
            type: z.literal('hashlist'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      task: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/task'),
          related: z.string().default('/api/v2/ui/taskwrappers/task')
        }),
        data: z
          .object({
            type: z.literal('task'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/tasks'),
          related: z.string().default('/api/v2/ui/taskwrappers/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.string().regex(/^[0-9]+$/)
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
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.string(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.string(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
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

export const zTaskWrapperSingleResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/taskwrappers/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('taskWrapper'),
    attributes: z.object({
      priority: z.int(),
      maxAgents: z.int(),
      taskType: z.union([z.literal(0), z.literal(1)]),
      hashlistId: z.string(),
      accessGroupId: z.string(),
      taskWrapperName: z.string(),
      isArchived: z.boolean(),
      cracked: z.int()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/taskwrappers/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/taskwrappers/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashType'),
          related: z.string().default('/api/v2/ui/taskwrappers/hashType')
        }),
        data: z
          .object({
            type: z.literal('hashType'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashlist: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashlist'),
          related: z.string().default('/api/v2/ui/taskwrappers/hashlist')
        }),
        data: z
          .object({
            type: z.literal('hashlist'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      task: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/task'),
          related: z.string().default('/api/v2/ui/taskwrappers/task')
        }),
        data: z
          .object({
            type: z.literal('task'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/tasks'),
          related: z.string().default('/api/v2/ui/taskwrappers/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.string().regex(/^[0-9]+$/)
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
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.string(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.string(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
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

export const zTaskWrapperPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/taskwrappers/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('taskWrapper'),
    attributes: z.object({
      priority: z.int(),
      maxAgents: z.int(),
      taskType: z.union([z.literal(0), z.literal(1)]),
      hashlistId: z.string(),
      accessGroupId: z.string(),
      taskWrapperName: z.string(),
      isArchived: z.boolean(),
      cracked: z.int()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/taskwrappers/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/taskwrappers/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashType'),
          related: z.string().default('/api/v2/ui/taskwrappers/hashType')
        }),
        data: z
          .object({
            type: z.literal('hashType'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashlist: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashlist'),
          related: z.string().default('/api/v2/ui/taskwrappers/hashlist')
        }),
        data: z
          .object({
            type: z.literal('hashlist'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      task: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/task'),
          related: z.string().default('/api/v2/ui/taskwrappers/task')
        }),
        data: z
          .object({
            type: z.literal('task'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrappers/relationships/tasks'),
          related: z.string().default('/api/v2/ui/taskwrappers/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.string().regex(/^[0-9]+$/)
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
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.string(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.string(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
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

export const zTaskWrapperListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/taskwrappers?page[size]=25'),
    first: z.string().default('/api/v2/ui/taskwrappers?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/taskwrappers?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/taskwrappers?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/taskwrappers?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('taskWrapper'),
      attributes: z.object({
        priority: z.int(),
        maxAgents: z.int(),
        taskType: z.union([z.literal(0), z.literal(1)]),
        hashlistId: z.string(),
        accessGroupId: z.string(),
        taskWrapperName: z.string(),
        isArchived: z.boolean(),
        cracked: z.int()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/taskwrappers/1')
      }),
      relationships: z.object({
        accessGroup: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/taskwrappers/relationships/accessGroup'),
            related: z.string().default('/api/v2/ui/taskwrappers/accessGroup')
          }),
          data: z
            .object({
              type: z.literal('accessGroup'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        }),
        hashType: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashType'),
            related: z.string().default('/api/v2/ui/taskwrappers/hashType')
          }),
          data: z
            .object({
              type: z.literal('hashType'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        }),
        hashlist: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashlist'),
            related: z.string().default('/api/v2/ui/taskwrappers/hashlist')
          }),
          data: z
            .object({
              type: z.literal('hashlist'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        }),
        task: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/taskwrappers/relationships/task'),
            related: z.string().default('/api/v2/ui/taskwrappers/task')
          }),
          data: z
            .object({
              type: z.literal('task'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        }),
        tasks: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/taskwrappers/relationships/tasks'),
            related: z.string().default('/api/v2/ui/taskwrappers/tasks')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('task'),
                id: z.string().regex(/^[0-9]+$/)
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
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.string(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.string(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
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

export const zTaskWrapperCountResponse = z.object({
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

export const zTaskWrapperRelationTasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zTaskWrapperRelationTasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zTaskWrapperDisplayResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/taskwrapperdisplays/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('taskWrapperDisplay'),
    attributes: z.object({
      taskWrapperPriority: z.int(),
      taskWrapperMaxAgents: z.int(),
      taskType: z.union([z.literal(0), z.literal(1)]),
      hashlistId: z.string(),
      accessGroupId: z.string(),
      taskWrapperName: z.string(),
      displayName: z.string(),
      taskWrapperIsArchived: z.boolean(),
      cracked: z.int(),
      taskId: z.string(),
      taskName: z.string(),
      color: z.string().nullable(),
      attackCmd: z.string(),
      chunkTime: z.int(),
      statusTimer: z.int(),
      keyspace: z.number(),
      keyspaceProgress: z.number(),
      taskPriority: z.int(),
      taskMaxAgents: z.int(),
      isSmall: z.boolean(),
      isCpuTask: z.boolean(),
      taskIsArchived: z.boolean(),
      preprocessorId: z.int(),
      hashlistName: z.string(),
      hashCount: z.int(),
      hashlistCracked: z.int(),
      hashTypeId: z.string(),
      hashTypeDescription: z.string(),
      groupName: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/taskwrapperdisplays/1')
    }),
    relationships: z.object({
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/taskwrapperdisplays/relationships/tasks'),
          related: z.string().default('/api/v2/ui/taskwrapperdisplays/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
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

export const zTaskWrapperDisplayListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/taskwrapperdisplays?page[size]=25'),
    first: z.string().default('/api/v2/ui/taskwrapperdisplays?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/taskwrapperdisplays?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/taskwrapperdisplays?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/taskwrapperdisplays?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('taskWrapperDisplay'),
      attributes: z.object({
        taskWrapperPriority: z.int(),
        taskWrapperMaxAgents: z.int(),
        taskType: z.union([z.literal(0), z.literal(1)]),
        hashlistId: z.string(),
        accessGroupId: z.string(),
        taskWrapperName: z.string(),
        displayName: z.string(),
        taskWrapperIsArchived: z.boolean(),
        cracked: z.int(),
        taskId: z.string(),
        taskName: z.string(),
        color: z.string().nullable(),
        attackCmd: z.string(),
        chunkTime: z.int(),
        statusTimer: z.int(),
        keyspace: z.number(),
        keyspaceProgress: z.number(),
        taskPriority: z.int(),
        taskMaxAgents: z.int(),
        isSmall: z.boolean(),
        isCpuTask: z.boolean(),
        taskIsArchived: z.boolean(),
        preprocessorId: z.int(),
        hashlistName: z.string(),
        hashCount: z.int(),
        hashlistCracked: z.int(),
        hashTypeId: z.string(),
        hashTypeDescription: z.string(),
        groupName: z.string()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/taskwrapperdisplays/1')
      }),
      relationships: z.object({
        tasks: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/taskwrapperdisplays/relationships/tasks'),
            related: z.string().default('/api/v2/ui/taskwrapperdisplays/tasks')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('task'),
                id: z.string().regex(/^[0-9]+$/)
              })
            )
            .optional()
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

export const zTaskWrapperDisplayCountResponse = z.object({
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

export const zTaskWrapperDisplayRelationTasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zTaskWrapperDisplayRelationTasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zDeleteTaskwrappersBody = zTaskWrapperDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteTaskwrappersResponse = z.void();

export const zGetTaskwrappersQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['accessGroup', 'hashlist', 'hashType', 'task', 'tasks'])).optional()
});

/**
 * successful operation
 */
export const zGetTaskwrappersResponse = zTaskWrapperListResponse;

export const zPatchTaskwrappersBody = zTaskWrapperPatchMultiple;

/**
 * successfully updated
 */
export const zPatchTaskwrappersResponse = z.void();

export const zGetTaskwrappersCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetTaskwrappersCountResponse = zTaskWrapperCountResponse;

export const zGetTaskwrappersByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetTaskwrappersByIdByRelationResponse = zTaskWrapperRelationTasksGetResponse;

export const zDeleteTaskwrappersByIdRelationshipsByRelationBody = zTaskWrapperRelationTasks;

export const zDeleteTaskwrappersByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully deleted
 */
export const zDeleteTaskwrappersByIdRelationshipsByRelationResponse = z.void();

export const zGetTaskwrappersByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetTaskwrappersByIdRelationshipsByRelationResponse = zTaskWrapperResponse;

export const zPatchTaskwrappersByIdRelationshipsByRelationBody = zTaskWrapperRelationTasks;

export const zPatchTaskwrappersByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchTaskwrappersByIdRelationshipsByRelationResponse = z.void();

export const zPostTaskwrappersByIdRelationshipsByRelationBody = zTaskWrapperRelationTasks;

export const zPostTaskwrappersByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully created
 */
export const zPostTaskwrappersByIdRelationshipsByRelationResponse = z.void();

export const zDeleteTaskwrappersByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteTaskwrappersByIdResponse = z.void();

export const zGetTaskwrappersByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetTaskwrappersByIdQuery = z.object({
  include: z.array(z.enum(['accessGroup', 'hashlist', 'hashType', 'task', 'tasks'])).optional()
});

/**
 * successful operation
 */
export const zGetTaskwrappersByIdResponse = zTaskWrapperResponse;

export const zPatchTaskwrappersByIdBody = zTaskWrapperPatch;

export const zPatchTaskwrappersByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchTaskwrappersByIdResponse = zTaskWrapperPostPatchResponse;
