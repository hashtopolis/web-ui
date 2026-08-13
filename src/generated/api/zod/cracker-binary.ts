import * as z from 'zod';

export const zCrackerBinaryCreate = z.object({
  data: z.object({
    type: z.literal('crackerBinary'),
    attributes: z.object({
      crackerBinaryTypeId: z.string(),
      version: z.string(),
      downloadUrl: z.string(),
      binaryName: z.string()
    })
  })
});

export const zCrackerBinaryPatch = z.object({
  data: z.object({
    type: z.literal('crackerBinary'),
    attributes: z.object({
      binaryName: z.string().optional(),
      downloadUrl: z.string().optional(),
      version: z.string().optional()
    })
  })
});

export const zCrackerBinaryPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('crackerBinary'),
      attributes: z.object({
        binaryName: z.string().optional(),
        downloadUrl: z.string().optional(),
        version: z.string().optional()
      })
    })
  )
});

export const zCrackerBinaryDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('crackerBinary')
    })
  )
});

export const zCrackerBinaryResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/crackers/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('crackerBinary'),
    attributes: z.object({
      crackerBinaryTypeId: z.string(),
      version: z.string(),
      downloadUrl: z.string(),
      binaryName: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/crackers/1')
    }),
    relationships: z.object({
      crackerBinaryType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/crackerBinaryType'),
          related: z.string().default('/api/v2/ui/crackers/crackerBinaryType')
        }),
        data: z
          .object({
            type: z.literal('crackerBinaryType'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/tasks'),
          related: z.string().default('/api/v2/ui/crackers/tasks')
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
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean().nullable()
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

export const zCrackerBinaryPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/crackers/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('crackerBinary'),
    attributes: z.object({
      crackerBinaryTypeId: z.string(),
      version: z.string(),
      downloadUrl: z.string(),
      binaryName: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/crackers/1')
    }),
    relationships: z.object({
      crackerBinaryType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/crackerBinaryType'),
          related: z.string().default('/api/v2/ui/crackers/crackerBinaryType')
        }),
        data: z
          .object({
            type: z.literal('crackerBinaryType'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/tasks'),
          related: z.string().default('/api/v2/ui/crackers/tasks')
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
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean().nullable()
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

export const zCrackerBinaryListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/crackers?page[size]=25'),
    first: z.string().default('/api/v2/ui/crackers?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/crackers?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/crackers?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/crackers?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('crackerBinary'),
      attributes: z.object({
        crackerBinaryTypeId: z.string(),
        version: z.string(),
        downloadUrl: z.string(),
        binaryName: z.string()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/crackers/1')
      }),
      relationships: z.object({
        crackerBinaryType: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/crackers/relationships/crackerBinaryType'),
            related: z.string().default('/api/v2/ui/crackers/crackerBinaryType')
          }),
          data: z
            .object({
              type: z.literal('crackerBinaryType'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        }),
        tasks: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/crackers/relationships/tasks'),
            related: z.string().default('/api/v2/ui/crackers/tasks')
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
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean().nullable()
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

export const zCrackerBinaryCountResponse = z.object({
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

export const zCrackerBinaryRelationTasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zCrackerBinaryRelationTasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zDeleteCrackersBody = zCrackerBinaryDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteCrackersResponse = z.void();

export const zGetCrackersQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['crackerBinaryType', 'tasks'])).optional()
});

/**
 * successful operation
 */
export const zGetCrackersResponse = zCrackerBinaryListResponse;

export const zPatchCrackersBody = zCrackerBinaryPatchMultiple;

/**
 * successfully updated
 */
export const zPatchCrackersResponse = z.void();

export const zPostCrackersBody = zCrackerBinaryCreate;

/**
 * successful operation
 */
export const zPostCrackersResponse = zCrackerBinaryPostPatchResponse;

export const zGetCrackersCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetCrackersCountResponse = zCrackerBinaryCountResponse;

export const zGetCrackersByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetCrackersByIdByRelationResponse = zCrackerBinaryRelationTasksGetResponse;

export const zDeleteCrackersByIdRelationshipsByRelationBody = zCrackerBinaryRelationTasks;

export const zDeleteCrackersByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully deleted
 */
export const zDeleteCrackersByIdRelationshipsByRelationResponse = z.void();

export const zGetCrackersByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetCrackersByIdRelationshipsByRelationResponse = zCrackerBinaryResponse;

export const zPatchCrackersByIdRelationshipsByRelationBody = zCrackerBinaryRelationTasks;

export const zPatchCrackersByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchCrackersByIdRelationshipsByRelationResponse = z.void();

export const zPostCrackersByIdRelationshipsByRelationBody = zCrackerBinaryRelationTasks;

export const zPostCrackersByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully created
 */
export const zPostCrackersByIdRelationshipsByRelationResponse = z.void();

export const zDeleteCrackersByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteCrackersByIdResponse = z.void();

export const zGetCrackersByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetCrackersByIdQuery = z.object({
  include: z.array(z.enum(['crackerBinaryType', 'tasks'])).optional()
});

/**
 * successful operation
 */
export const zGetCrackersByIdResponse = zCrackerBinaryResponse;

export const zPatchCrackersByIdBody = zCrackerBinaryPatch;

export const zPatchCrackersByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchCrackersByIdResponse = zCrackerBinaryPostPatchResponse;
