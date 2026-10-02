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
      id: z.int(),
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
      id: z.int(),
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
    id: z.int(),
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string(),
      amountPretasks: z.int().optional()
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
          crackerBinaryTypeId: z.int()
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
    id: z.int(),
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string(),
      amountPretasks: z.int().optional()
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
          crackerBinaryTypeId: z.int()
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
    id: z.int(),
    type: z.literal('supertask'),
    attributes: z.object({
      supertaskName: z.string(),
      amountPretasks: z.int().optional()
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
          crackerBinaryTypeId: z.int()
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
      id: z.int(),
      type: z.literal('supertask'),
      attributes: z.object({
        supertaskName: z.string(),
        amountPretasks: z.int().optional()
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
          crackerBinaryTypeId: z.int()
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
      id: z.int()
    })
  )
});

export const zSupertaskRelationPretasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('pretasks'),
      id: z.int()
    })
  )
});

export const zDeleteSupertasksData = z.object({
  body: zSupertaskDeleteMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteSupertasksResponse = z.void();

export const zGetSupertasksData = z.object({
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
      include: z.array(z.enum(['pretasks'])).optional(),
      aggregate: z.record(z.string(), z.string()).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetSupertasksResponse = zSupertaskListResponse;

export const zPatchSupertasksData = z.object({
  body: zSupertaskPatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchSupertasksResponse = z.void();

export const zPostSupertasksData = z.object({
  body: zSupertaskCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostSupertasksResponse = zSupertaskPostPatchResponse;

export const zGetSupertasksCountData = z.object({
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
export const zGetSupertasksCountResponse = zSupertaskCountResponse;

export const zGetSupertasksByIdByRelationData = z.object({
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
export const zGetSupertasksByIdByRelationResponse = zSupertaskRelationPretasksGetResponse;

export const zDeleteSupertasksByIdRelationshipsByRelationData = z.object({
  body: zSupertaskRelationPretasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteSupertasksByIdRelationshipsByRelationResponse = z.void();

export const zGetSupertasksByIdRelationshipsByRelationData = z.object({
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
export const zGetSupertasksByIdRelationshipsByRelationResponse = zSupertaskResponse;

export const zPatchSupertasksByIdRelationshipsByRelationData = z.object({
  body: zSupertaskRelationPretasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchSupertasksByIdRelationshipsByRelationResponse = z.void();

export const zPostSupertasksByIdRelationshipsByRelationData = z.object({
  body: zSupertaskRelationPretasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully created
 */
export const zPostSupertasksByIdRelationshipsByRelationResponse = z.void();

export const zDeleteSupertasksByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteSupertasksByIdResponse = z.void();

export const zGetSupertasksByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.array(z.enum(['pretasks'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetSupertasksByIdResponse = zSupertaskResponse;

export const zPatchSupertasksByIdData = z.object({
  body: zSupertaskPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchSupertasksByIdResponse = zSupertaskPostPatchResponse;
