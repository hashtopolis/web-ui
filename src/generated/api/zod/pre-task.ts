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
      crackerBinaryTypeId: z.string()
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
      crackerBinaryTypeId: z.string().optional(),
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
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('preTask'),
      attributes: z.object({
        attackCmd: z.string().optional(),
        chunkTime: z.int().optional(),
        color: z.string().optional(),
        crackerBinaryTypeId: z.string().optional(),
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
      id: z.string().regex(/^[0-9]+$/),
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
    id: z.string().regex(/^[0-9]+$/),
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
      crackerBinaryTypeId: z.string(),
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
        type: z.literal('file'),
        attributes: z.object({
          filename: z.string(),
          size: z.number(),
          isSecret: z.boolean(),
          fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
          accessGroupId: z.string(),
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
    id: z.string().regex(/^[0-9]+$/),
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
      crackerBinaryTypeId: z.string(),
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
        type: z.literal('file'),
        attributes: z.object({
          filename: z.string(),
          size: z.number(),
          isSecret: z.boolean(),
          fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
          accessGroupId: z.string(),
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
      id: z.string().regex(/^[0-9]+$/),
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
        crackerBinaryTypeId: z.string(),
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
        type: z.literal('file'),
        attributes: z.object({
          filename: z.string(),
          size: z.number(),
          isSecret: z.boolean(),
          fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
          accessGroupId: z.string(),
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
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zPreTaskRelationPretaskFilesGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('pretaskFiles'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zDeletePretasksBody = zPreTaskDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeletePretasksResponse = z.void();

export const zGetPretasksQuery = z.object({
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
});

/**
 * successful operation
 */
export const zGetPretasksResponse = zPreTaskListResponse;

export const zPatchPretasksBody = zPreTaskPatchMultiple;

/**
 * successfully updated
 */
export const zPatchPretasksResponse = z.void();

export const zPostPretasksBody = zPreTaskCreate;

/**
 * successful operation
 */
export const zPostPretasksResponse = zPreTaskPostPatchResponse;

export const zGetPretasksCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetPretasksCountResponse = zPreTaskCountResponse;

export const zGetPretasksByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetPretasksByIdByRelationResponse = zPreTaskRelationPretaskFilesGetResponse;

export const zDeletePretasksByIdRelationshipsByRelationBody = zPreTaskRelationPretaskFiles;

export const zDeletePretasksByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully deleted
 */
export const zDeletePretasksByIdRelationshipsByRelationResponse = z.void();

export const zGetPretasksByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetPretasksByIdRelationshipsByRelationResponse = zPreTaskResponse;

export const zPatchPretasksByIdRelationshipsByRelationBody = zPreTaskRelationPretaskFiles;

export const zPatchPretasksByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchPretasksByIdRelationshipsByRelationResponse = z.void();

export const zPostPretasksByIdRelationshipsByRelationBody = zPreTaskRelationPretaskFiles;

export const zPostPretasksByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully created
 */
export const zPostPretasksByIdRelationshipsByRelationResponse = z.void();

export const zDeletePretasksByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeletePretasksByIdResponse = z.void();

export const zGetPretasksByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetPretasksByIdQuery = z.object({
  include: z.array(z.enum(['pretaskFiles'])).optional()
});

/**
 * successful operation
 */
export const zGetPretasksByIdResponse = zPreTaskResponse;

export const zPatchPretasksByIdBody = zPreTaskPatch;

export const zPatchPretasksByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchPretasksByIdResponse = zPreTaskPostPatchResponse;
