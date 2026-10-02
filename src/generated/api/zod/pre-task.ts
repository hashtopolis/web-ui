import * as z from 'zod';

export const zPreTaskCreate = z.object({
  data: z.object({
    type: z.literal('preTask'),
    attributes: z.object({
      files: z.array(z.int()),
      taskName: z.string(),
      attackCmd: z.string(),
      chunkTime: z.int(),
      statusTimer: z.int(),
      color: z.string(),
      isSmall: z.boolean(),
      isCpuTask: z.boolean(),
      useNewBench: z.boolean(),
      priority: z.int(),
      maxAgents: z.int(),
      isMaskImport: z.boolean(),
      crackerBinaryTypeId: z.int()
    })
  })
});

export const zPreTaskPatch = z.object({
  data: z.object({
    type: z.literal('preTask'),
    attributes: z.object({
      attackCmd: z.string().optional(),
      chunkTime: z.int().optional(),
      color: z.string().optional(),
      crackerBinaryTypeId: z.int().optional(),
      isCpuTask: z.boolean().optional(),
      isMaskImport: z.boolean().optional(),
      isSmall: z.boolean().optional(),
      maxAgents: z.int().optional(),
      priority: z.int().optional(),
      statusTimer: z.int().optional(),
      taskName: z.string().optional(),
      useNewBench: z.boolean().optional()
    })
  })
});

export const zPreTaskPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('preTask'),
      attributes: z.object({
        attackCmd: z.string().optional(),
        chunkTime: z.int().optional(),
        color: z.string().optional(),
        crackerBinaryTypeId: z.int().optional(),
        isCpuTask: z.boolean().optional(),
        isMaskImport: z.boolean().optional(),
        isSmall: z.boolean().optional(),
        maxAgents: z.int().optional(),
        priority: z.int().optional(),
        statusTimer: z.int().optional(),
        taskName: z.string().optional(),
        useNewBench: z.boolean().optional()
      })
    })
  )
});

export const zPreTaskDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('preTask')
    })
  )
});

export const zPreTaskResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/pretasks/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('preTask'),
    attributes: z.object({
      taskName: z.string(),
      attackCmd: z.string(),
      chunkTime: z.int(),
      statusTimer: z.int(),
      color: z.string(),
      isSmall: z.boolean(),
      isCpuTask: z.boolean(),
      useNewBench: z.boolean(),
      priority: z.int(),
      maxAgents: z.int(),
      isMaskImport: z.boolean(),
      crackerBinaryTypeId: z.int(),
      auxiliaryKeyspace: z.int().optional()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/pretasks/1')
    }),
    relationships: z.object({
      pretaskFiles: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/pretasks/relationships/pretaskFiles'),
          related: z.string().default('/api/v2/ui/pretasks/pretaskFiles')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('file'),
              id: z.int()
            })
          )
          .optional()
      })
    })
  }),
  included: z
    .array(
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
      })
    )
    .optional()
});

export const zPreTaskPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/pretasks/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('preTask'),
    attributes: z.object({
      taskName: z.string(),
      attackCmd: z.string(),
      chunkTime: z.int(),
      statusTimer: z.int(),
      color: z.string(),
      isSmall: z.boolean(),
      isCpuTask: z.boolean(),
      useNewBench: z.boolean(),
      priority: z.int(),
      maxAgents: z.int(),
      isMaskImport: z.boolean(),
      crackerBinaryTypeId: z.int(),
      auxiliaryKeyspace: z.int().optional()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/pretasks/1')
    }),
    relationships: z.object({
      pretaskFiles: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/pretasks/relationships/pretaskFiles'),
          related: z.string().default('/api/v2/ui/pretasks/pretaskFiles')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('file'),
              id: z.int()
            })
          )
          .optional()
      })
    })
  }),
  included: z
    .array(
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
      })
    )
    .optional()
});

export const zPreTaskListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/pretasks?page[size]=25'),
    first: z.string().default('/api/v2/ui/pretasks?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/pretasks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/pretasks?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/pretasks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('preTask'),
      attributes: z.object({
        taskName: z.string(),
        attackCmd: z.string(),
        chunkTime: z.int(),
        statusTimer: z.int(),
        color: z.string(),
        isSmall: z.boolean(),
        isCpuTask: z.boolean(),
        useNewBench: z.boolean(),
        priority: z.int(),
        maxAgents: z.int(),
        isMaskImport: z.boolean(),
        crackerBinaryTypeId: z.int(),
        auxiliaryKeyspace: z.int().optional()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/pretasks/1')
      }),
      relationships: z.object({
        pretaskFiles: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/pretasks/relationships/pretaskFiles'),
            related: z.string().default('/api/v2/ui/pretasks/pretaskFiles')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('file'),
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
      })
    )
    .optional()
});

export const zPreTaskCountResponse = z.object({
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

export const zPreTaskRelationPretaskFiles = z.object({
  data: z.array(
    z.object({
      type: z.literal('pretaskFiles'),
      id: z.int()
    })
  )
});

export const zPreTaskRelationPretaskFilesGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('pretaskFiles'),
      id: z.int()
    })
  )
});

export const zDeletePretasksData = z.object({
  body: zPreTaskDeleteMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeletePretasksResponse = z.void();

export const zGetPretasksData = z.object({
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
      include: z.array(z.enum(['pretaskFiles'])).optional(),
      aggregate: z.record(z.string(), z.string()).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetPretasksResponse = zPreTaskListResponse;

export const zPatchPretasksData = z.object({
  body: zPreTaskPatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchPretasksResponse = z.void();

export const zPostPretasksData = z.object({
  body: zPreTaskCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostPretasksResponse = zPreTaskPostPatchResponse;

export const zGetPretasksCountData = z.object({
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
export const zGetPretasksCountResponse = zPreTaskCountResponse;

export const zGetPretasksByIdByRelationData = z.object({
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
export const zGetPretasksByIdByRelationResponse = zPreTaskRelationPretaskFilesGetResponse;

export const zDeletePretasksByIdRelationshipsByRelationData = z.object({
  body: zPreTaskRelationPretaskFiles,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeletePretasksByIdRelationshipsByRelationResponse = z.void();

export const zGetPretasksByIdRelationshipsByRelationData = z.object({
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
export const zGetPretasksByIdRelationshipsByRelationResponse = zPreTaskResponse;

export const zPatchPretasksByIdRelationshipsByRelationData = z.object({
  body: zPreTaskRelationPretaskFiles,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchPretasksByIdRelationshipsByRelationResponse = z.void();

export const zPostPretasksByIdRelationshipsByRelationData = z.object({
  body: zPreTaskRelationPretaskFiles,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully created
 */
export const zPostPretasksByIdRelationshipsByRelationResponse = z.void();

export const zDeletePretasksByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeletePretasksByIdResponse = z.void();

export const zGetPretasksByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.array(z.enum(['pretaskFiles'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetPretasksByIdResponse = zPreTaskResponse;

export const zPatchPretasksByIdData = z.object({
  body: zPreTaskPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchPretasksByIdResponse = zPreTaskPostPatchResponse;
