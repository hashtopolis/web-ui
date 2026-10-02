import * as z from 'zod';

export const zCrackerBinaryTypeCreate = z.object({
  data: z.object({
    type: z.literal('crackerBinaryType'),
    attributes: z.object({
      typeName: z.string()
    })
  })
});

export const zCrackerBinaryTypePatch = z.object({
  data: z.object({
    type: z.literal('crackerBinaryType'),
    attributes: z.object({
      isChunkingAvailable: z.boolean().nullish(),
      typeName: z.string().optional()
    })
  })
});

export const zCrackerBinaryTypePatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('crackerBinaryType'),
      attributes: z.object({
        isChunkingAvailable: z.boolean().nullish(),
        typeName: z.string().optional()
      })
    })
  )
});

export const zCrackerBinaryTypeDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('crackerBinaryType')
    })
  )
});

export const zCrackerBinaryTypeResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/crackertypes/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('crackerBinaryType'),
    attributes: z.object({
      typeName: z.string(),
      isChunkingAvailable: z.boolean().nullable()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/crackertypes/1')
    }),
    relationships: z.object({
      crackerVersions: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackertypes/relationships/crackerVersions'),
          related: z.string().default('/api/v2/ui/crackertypes/crackerVersions')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('crackerBinary'),
              id: z.int()
            })
          )
          .optional()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackertypes/relationships/tasks'),
          related: z.string().default('/api/v2/ui/crackertypes/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
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
            downloadUrl: z.string(),
            binaryName: z.string()
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

export const zCrackerBinaryTypePostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/crackertypes/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('crackerBinaryType'),
    attributes: z.object({
      typeName: z.string(),
      isChunkingAvailable: z.boolean().nullable()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/crackertypes/1')
    }),
    relationships: z.object({
      crackerVersions: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackertypes/relationships/crackerVersions'),
          related: z.string().default('/api/v2/ui/crackertypes/crackerVersions')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('crackerBinary'),
              id: z.int()
            })
          )
          .optional()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackertypes/relationships/tasks'),
          related: z.string().default('/api/v2/ui/crackertypes/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
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
            downloadUrl: z.string(),
            binaryName: z.string()
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

export const zCrackerBinaryTypeListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/crackertypes?page[size]=25'),
    first: z.string().default('/api/v2/ui/crackertypes?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/crackertypes?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/crackertypes?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/crackertypes?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('crackerBinaryType'),
      attributes: z.object({
        typeName: z.string(),
        isChunkingAvailable: z.boolean().nullable()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/crackertypes/1')
      }),
      relationships: z.object({
        crackerVersions: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/crackertypes/relationships/crackerVersions'),
            related: z.string().default('/api/v2/ui/crackertypes/crackerVersions')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('crackerBinary'),
                id: z.int()
              })
            )
            .optional()
        }),
        tasks: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/crackertypes/relationships/tasks'),
            related: z.string().default('/api/v2/ui/crackertypes/tasks')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('task'),
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
            downloadUrl: z.string(),
            binaryName: z.string()
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

export const zCrackerBinaryTypeCountResponse = z.object({
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

export const zCrackerBinaryTypeRelationTasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.int()
    })
  )
});

export const zCrackerBinaryTypeRelationTasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.int()
    })
  )
});

export const zDeleteCrackertypesData = z.object({
  body: zCrackerBinaryTypeDeleteMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteCrackertypesResponse = z.void();

export const zGetCrackertypesData = z.object({
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
      include: z.array(z.enum(['crackerVersions', 'tasks'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetCrackertypesResponse = zCrackerBinaryTypeListResponse;

export const zPatchCrackertypesData = z.object({
  body: zCrackerBinaryTypePatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchCrackertypesResponse = z.void();

export const zPostCrackertypesData = z.object({
  body: zCrackerBinaryTypeCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostCrackertypesResponse = zCrackerBinaryTypePostPatchResponse;

export const zGetCrackertypesCountData = z.object({
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
export const zGetCrackertypesCountResponse = zCrackerBinaryTypeCountResponse;

export const zGetCrackertypesByIdByRelationData = z.object({
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
export const zGetCrackertypesByIdByRelationResponse = zCrackerBinaryTypeRelationTasksGetResponse;

export const zDeleteCrackertypesByIdRelationshipsByRelationData = z.object({
  body: zCrackerBinaryTypeRelationTasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteCrackertypesByIdRelationshipsByRelationResponse = z.void();

export const zGetCrackertypesByIdRelationshipsByRelationData = z.object({
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
export const zGetCrackertypesByIdRelationshipsByRelationResponse = zCrackerBinaryTypeResponse;

export const zPatchCrackertypesByIdRelationshipsByRelationData = z.object({
  body: zCrackerBinaryTypeRelationTasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchCrackertypesByIdRelationshipsByRelationResponse = z.void();

export const zPostCrackertypesByIdRelationshipsByRelationData = z.object({
  body: zCrackerBinaryTypeRelationTasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully created
 */
export const zPostCrackertypesByIdRelationshipsByRelationResponse = z.void();

export const zDeleteCrackertypesByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteCrackertypesByIdResponse = z.void();

export const zGetCrackertypesByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.array(z.enum(['crackerVersions', 'tasks'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetCrackertypesByIdResponse = zCrackerBinaryTypeResponse;

export const zPatchCrackertypesByIdData = z.object({
  body: zCrackerBinaryTypePatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchCrackertypesByIdResponse = zCrackerBinaryTypePostPatchResponse;
