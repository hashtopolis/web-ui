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
            downloadUrl: z.string().nullable(),
            binaryName: z.string(),
            filename: z.string().nullable(),
            accessGroupId: z.int()
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
            downloadUrl: z.string().nullable(),
            binaryName: z.string(),
            filename: z.string().nullable(),
            accessGroupId: z.int()
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
            downloadUrl: z.string().nullable(),
            binaryName: z.string(),
            filename: z.string().nullable(),
            accessGroupId: z.int()
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

export const zCrackerBinaryTypeRelationCrackerVersions = z.object({
  data: z.array(
    z.object({
      type: z.literal('crackerBinary'),
      id: z.int()
    })
  )
});

export const zCrackerBinaryTypeRelationCrackerVersionsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('crackerBinary'),
      id: z.int()
    })
  )
});

export const zCrackerBinaryTypeRelationTasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('task'),
      id: z.int()
    })
  )
});

export const zCrackerBinaryTypeRelationTasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('task'),
      id: z.int()
    })
  )
});

export const zDeleteCrackertypesBody = zCrackerBinaryTypeDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteCrackertypesResponse = z.void();

export const zGetCrackertypesQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['crackerVersions', 'tasks'])).optional()
});

/**
 * successful operation
 */
export const zGetCrackertypesResponse = zCrackerBinaryTypeListResponse;

export const zPatchCrackertypesBody = zCrackerBinaryTypePatchMultiple;

/**
 * successfully updated
 */
export const zPatchCrackertypesResponse = z.void();

export const zPostCrackertypesBody = zCrackerBinaryTypeCreate;

/**
 * successful operation
 */
export const zPostCrackertypesResponse = zCrackerBinaryTypePostPatchResponse;

export const zGetCrackertypesCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetCrackertypesCountResponse = zCrackerBinaryTypeCountResponse;

export const zGetCrackertypesByIdCrackerVersionsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackertypesByIdCrackerVersionsResponse = zCrackerBinaryTypeRelationCrackerVersionsGetResponse;

export const zDeleteCrackertypesByIdRelationshipsCrackerVersionsBody = zCrackerBinaryTypeRelationCrackerVersions;

export const zDeleteCrackertypesByIdRelationshipsCrackerVersionsPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteCrackertypesByIdRelationshipsCrackerVersionsResponse = z.void();

export const zGetCrackertypesByIdRelationshipsCrackerVersionsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackertypesByIdRelationshipsCrackerVersionsResponse = zCrackerBinaryTypeResponse;

export const zPatchCrackertypesByIdRelationshipsCrackerVersionsBody = zCrackerBinaryTypeRelationCrackerVersions;

export const zPatchCrackertypesByIdRelationshipsCrackerVersionsPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchCrackertypesByIdRelationshipsCrackerVersionsResponse = z.void();

export const zPostCrackertypesByIdRelationshipsCrackerVersionsBody = zCrackerBinaryTypeRelationCrackerVersions;

export const zPostCrackertypesByIdRelationshipsCrackerVersionsPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostCrackertypesByIdRelationshipsCrackerVersionsResponse = z.void();

export const zGetCrackertypesByIdTasksPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackertypesByIdTasksResponse = zCrackerBinaryTypeRelationTasksGetResponse;

export const zDeleteCrackertypesByIdRelationshipsTasksBody = zCrackerBinaryTypeRelationTasks;

export const zDeleteCrackertypesByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteCrackertypesByIdRelationshipsTasksResponse = z.void();

export const zGetCrackertypesByIdRelationshipsTasksPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackertypesByIdRelationshipsTasksResponse = zCrackerBinaryTypeResponse;

export const zPatchCrackertypesByIdRelationshipsTasksBody = zCrackerBinaryTypeRelationTasks;

export const zPatchCrackertypesByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchCrackertypesByIdRelationshipsTasksResponse = z.void();

export const zPostCrackertypesByIdRelationshipsTasksBody = zCrackerBinaryTypeRelationTasks;

export const zPostCrackertypesByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostCrackertypesByIdRelationshipsTasksResponse = z.void();

export const zDeleteCrackertypesByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteCrackertypesByIdResponse = z.void();

export const zGetCrackertypesByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetCrackertypesByIdQuery = z.object({
  include: z.array(z.enum(['crackerVersions', 'tasks'])).optional()
});

/**
 * successful operation
 */
export const zGetCrackertypesByIdResponse = zCrackerBinaryTypeResponse;

export const zPatchCrackertypesByIdBody = zCrackerBinaryTypePatch;

export const zPatchCrackertypesByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchCrackertypesByIdResponse = zCrackerBinaryTypePostPatchResponse;
