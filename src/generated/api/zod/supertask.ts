import * as z from 'zod';

export const zSupertaskCreate = z.object({
  data: z.object({
    type: z.literal('supertask'),
    attributes: z.object({
      pretasks: z.array(z.int()),
      supertaskName: z.string()
    })
  })
});

export const zSupertaskPatch = z.object({
  data: z.object({
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string().optional()
    })
  })
});

export const zSupertaskPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('supertask'),
      attributes: z.object({
        supertaskName: z.string().optional()
      })
    })
  )
});

export const zSupertaskDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('supertask')
    })
  )
});

export const zSupertaskResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/supertasks/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/supertasks/1')
    }),
    relationships: z.object({
      pretasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/supertasks/relationships/pretasks'),
          related: z.string().default('/api/v2/ui/supertasks/pretasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('preTask'),
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
          crackerBinaryTypeId: z.string()
        })
      })
    )
    .optional()
});

export const zSupertaskSingleResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/supertasks/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/supertasks/1')
    }),
    relationships: z.object({
      pretasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/supertasks/relationships/pretasks'),
          related: z.string().default('/api/v2/ui/supertasks/pretasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('preTask'),
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
          crackerBinaryTypeId: z.string()
        })
      })
    )
    .optional()
});

export const zSupertaskPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/supertasks/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/supertasks/1')
    }),
    relationships: z.object({
      pretasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/supertasks/relationships/pretasks'),
          related: z.string().default('/api/v2/ui/supertasks/pretasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('preTask'),
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
          crackerBinaryTypeId: z.string()
        })
      })
    )
    .optional()
});

export const zSupertaskListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/supertasks?page[size]=25'),
    first: z.string().default('/api/v2/ui/supertasks?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/supertasks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/supertasks?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/supertasks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('supertask'),
      attributes: z.object({
        supertaskName: z.string()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/supertasks/1')
      }),
      relationships: z.object({
        pretasks: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/supertasks/relationships/pretasks'),
            related: z.string().default('/api/v2/ui/supertasks/pretasks')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('preTask'),
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
          crackerBinaryTypeId: z.string()
        })
      })
    )
    .optional()
});

export const zSupertaskCountResponse = z.object({
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

export const zSupertaskRelationPretasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('pretasks'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zSupertaskRelationPretasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('pretasks'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zDeleteSupertasksBody = zSupertaskDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteSupertasksResponse = z.void();

export const zGetSupertasksQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['pretasks'])).optional(),
  aggregate: z.record(z.string(), z.string()).optional()
});

/**
 * successful operation
 */
export const zGetSupertasksResponse = zSupertaskListResponse;

export const zPatchSupertasksBody = zSupertaskPatchMultiple;

/**
 * successfully updated
 */
export const zPatchSupertasksResponse = z.void();

export const zPostSupertasksBody = zSupertaskCreate;

/**
 * successful operation
 */
export const zPostSupertasksResponse = zSupertaskPostPatchResponse;

export const zGetSupertasksCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetSupertasksCountResponse = zSupertaskCountResponse;

export const zGetSupertasksByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetSupertasksByIdByRelationResponse = zSupertaskRelationPretasksGetResponse;

export const zDeleteSupertasksByIdRelationshipsByRelationBody = zSupertaskRelationPretasks;

export const zDeleteSupertasksByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully deleted
 */
export const zDeleteSupertasksByIdRelationshipsByRelationResponse = z.void();

export const zGetSupertasksByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetSupertasksByIdRelationshipsByRelationResponse = zSupertaskResponse;

export const zPatchSupertasksByIdRelationshipsByRelationBody = zSupertaskRelationPretasks;

export const zPatchSupertasksByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchSupertasksByIdRelationshipsByRelationResponse = z.void();

export const zPostSupertasksByIdRelationshipsByRelationBody = zSupertaskRelationPretasks;

export const zPostSupertasksByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully created
 */
export const zPostSupertasksByIdRelationshipsByRelationResponse = z.void();

export const zDeleteSupertasksByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteSupertasksByIdResponse = z.void();

export const zGetSupertasksByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetSupertasksByIdQuery = z.object({
  include: z.array(z.enum(['pretasks'])).optional()
});

/**
 * successful operation
 */
export const zGetSupertasksByIdResponse = zSupertaskResponse;

export const zPatchSupertasksByIdBody = zSupertaskPatch;

export const zPatchSupertasksByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchSupertasksByIdResponse = zSupertaskPostPatchResponse;
