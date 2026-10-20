import * as z from 'zod';

export const zCrackerBinaryCreate = z.object({
  data: z.object({
    type: z.literal('crackerBinary'),
    attributes: z.object({
      sourceType: z.union([z.literal('inline'), z.literal('import'), z.literal('url')]).nullish(),
      sourceData: z.string().nullish(),
      crackerBinaryTypeId: z.int(),
      version: z.string(),
      downloadUrl: z.string().nullish(),
      binaryName: z.string(),
      accessGroupId: z.int()
    })
  })
});

export const zCrackerBinaryPatch = z.object({
  data: z.object({
    type: z.literal('crackerBinary'),
    attributes: z.object({
      accessGroupId: z.int().optional(),
      binaryName: z.string().optional(),
      downloadUrl: z.string().nullish(),
      version: z.string().optional()
    })
  })
});

export const zCrackerBinaryPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('crackerBinary'),
      attributes: z.object({
        accessGroupId: z.int().optional(),
        binaryName: z.string().optional(),
        downloadUrl: z.string().nullish(),
        version: z.string().optional()
      })
    })
  )
});

export const zCrackerBinaryDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
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
    id: z.int(),
    type: z.literal('crackerBinary'),
    attributes: z.object({
      crackerBinaryTypeId: z.int(),
      version: z.string(),
      downloadUrl: z.string().nullable(),
      binaryName: z.string(),
      filename: z.string().nullable(),
      accessGroupId: z.int()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/crackers/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/crackers/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.int()
          })
          .nullish()
      }),
      crackerBinaryType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/crackerBinaryType'),
          related: z.string().default('/api/v2/ui/crackers/crackerBinaryType')
        }),
        data: z
          .object({
            type: z.literal('crackerBinaryType'),
            id: z.int()
          })
          .nullish()
      }),
      hashtypes: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/hashtypes'),
          related: z.string().default('/api/v2/ui/crackers/hashtypes')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('hashType'),
              id: z.int()
            })
          )
          .optional()
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
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean().nullable()
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
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
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
    id: z.int(),
    type: z.literal('crackerBinary'),
    attributes: z.object({
      crackerBinaryTypeId: z.int(),
      version: z.string(),
      downloadUrl: z.string().nullable(),
      binaryName: z.string(),
      filename: z.string().nullable(),
      accessGroupId: z.int()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/crackers/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/crackers/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.int()
          })
          .nullish()
      }),
      crackerBinaryType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/crackerBinaryType'),
          related: z.string().default('/api/v2/ui/crackers/crackerBinaryType')
        }),
        data: z
          .object({
            type: z.literal('crackerBinaryType'),
            id: z.int()
          })
          .nullish()
      }),
      hashtypes: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/crackers/relationships/hashtypes'),
          related: z.string().default('/api/v2/ui/crackers/hashtypes')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('hashType'),
              id: z.int()
            })
          )
          .optional()
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
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean().nullable()
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
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
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
      id: z.int(),
      type: z.literal('crackerBinary'),
      attributes: z.object({
        crackerBinaryTypeId: z.int(),
        version: z.string(),
        downloadUrl: z.string().nullable(),
        binaryName: z.string(),
        filename: z.string().nullable(),
        accessGroupId: z.int()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/crackers/1')
      }),
      relationships: z.object({
        accessGroup: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/crackers/relationships/accessGroup'),
            related: z.string().default('/api/v2/ui/crackers/accessGroup')
          }),
          data: z
            .object({
              type: z.literal('accessGroup'),
              id: z.int()
            })
            .nullish()
        }),
        crackerBinaryType: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/crackers/relationships/crackerBinaryType'),
            related: z.string().default('/api/v2/ui/crackers/crackerBinaryType')
          }),
          data: z
            .object({
              type: z.literal('crackerBinaryType'),
              id: z.int()
            })
            .nullish()
        }),
        hashtypes: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/crackers/relationships/hashtypes'),
            related: z.string().default('/api/v2/ui/crackers/hashtypes')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('hashType'),
                id: z.int()
              })
            )
            .optional()
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
          type: z.literal('crackerBinaryType'),
          attributes: z.object({
            typeName: z.string(),
            isChunkingAvailable: z.boolean().nullable()
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
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
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

export const zCrackerBinaryRelationCrackerBinaryType = z.object({
  data: z.object({
    type: z.literal('crackerBinaryType'),
    id: z.int()
  })
});

export const zCrackerBinaryRelationCrackerBinaryTypeGetResponse = z.object({
  data: z.object({
    type: z.literal('crackerBinaryType'),
    id: z.int()
  })
});

export const zCrackerBinaryRelationAccessGroup = z.object({
  data: z.object({
    type: z.literal('accessGroup'),
    id: z.int()
  })
});

export const zCrackerBinaryRelationAccessGroupGetResponse = z.object({
  data: z.object({
    type: z.literal('accessGroup'),
    id: z.int()
  })
});

export const zCrackerBinaryRelationTasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('task'),
      id: z.int()
    })
  )
});

export const zCrackerBinaryRelationTasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('task'),
      id: z.int()
    })
  )
});

export const zCrackerBinaryRelationHashtypes = z.object({
  data: z.array(
    z.object({
      type: z.literal('hashType'),
      id: z.int()
    })
  )
});

export const zCrackerBinaryRelationHashtypesGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('hashType'),
      id: z.int()
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
  include: z.array(z.enum(['crackerBinaryType', 'accessGroup', 'tasks', 'hashtypes'])).optional()
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

export const zGetCrackersByIdCrackerBinaryTypePath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackersByIdCrackerBinaryTypeResponse = zCrackerBinaryRelationCrackerBinaryTypeGetResponse;

export const zGetCrackersByIdRelationshipsCrackerBinaryTypePath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackersByIdRelationshipsCrackerBinaryTypeResponse = zCrackerBinaryResponse;

export const zPatchCrackersByIdRelationshipsCrackerBinaryTypeBody = zCrackerBinaryRelationCrackerBinaryType;

export const zPatchCrackersByIdRelationshipsCrackerBinaryTypePath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchCrackersByIdRelationshipsCrackerBinaryTypeResponse = z.void();

export const zGetCrackersByIdAccessGroupPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackersByIdAccessGroupResponse = zCrackerBinaryRelationAccessGroupGetResponse;

export const zGetCrackersByIdRelationshipsAccessGroupPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackersByIdRelationshipsAccessGroupResponse = zCrackerBinaryResponse;

export const zPatchCrackersByIdRelationshipsAccessGroupBody = zCrackerBinaryRelationAccessGroup;

export const zPatchCrackersByIdRelationshipsAccessGroupPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchCrackersByIdRelationshipsAccessGroupResponse = z.void();

export const zGetCrackersByIdTasksPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackersByIdTasksResponse = zCrackerBinaryRelationTasksGetResponse;

export const zDeleteCrackersByIdRelationshipsTasksBody = zCrackerBinaryRelationTasks;

export const zDeleteCrackersByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteCrackersByIdRelationshipsTasksResponse = z.void();

export const zGetCrackersByIdRelationshipsTasksPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackersByIdRelationshipsTasksResponse = zCrackerBinaryResponse;

export const zPatchCrackersByIdRelationshipsTasksBody = zCrackerBinaryRelationTasks;

export const zPatchCrackersByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchCrackersByIdRelationshipsTasksResponse = z.void();

export const zPostCrackersByIdRelationshipsTasksBody = zCrackerBinaryRelationTasks;

export const zPostCrackersByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostCrackersByIdRelationshipsTasksResponse = z.void();

export const zGetCrackersByIdHashtypesPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackersByIdHashtypesResponse = zCrackerBinaryRelationHashtypesGetResponse;

export const zDeleteCrackersByIdRelationshipsHashtypesBody = zCrackerBinaryRelationHashtypes;

export const zDeleteCrackersByIdRelationshipsHashtypesPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteCrackersByIdRelationshipsHashtypesResponse = z.void();

export const zGetCrackersByIdRelationshipsHashtypesPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetCrackersByIdRelationshipsHashtypesResponse = zCrackerBinaryResponse;

export const zPatchCrackersByIdRelationshipsHashtypesBody = zCrackerBinaryRelationHashtypes;

export const zPatchCrackersByIdRelationshipsHashtypesPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchCrackersByIdRelationshipsHashtypesResponse = z.void();

export const zPostCrackersByIdRelationshipsHashtypesBody = zCrackerBinaryRelationHashtypes;

export const zPostCrackersByIdRelationshipsHashtypesPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostCrackersByIdRelationshipsHashtypesResponse = z.void();

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
  include: z.array(z.enum(['crackerBinaryType', 'accessGroup', 'tasks', 'hashtypes'])).optional()
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
