import * as z from 'zod';

export const zHealthCheckCreate = z.object({
  data: z.object({
    type: z.literal('healthCheck'),
    attributes: z.object({
      checkType: z.union([z.literal(0), z.literal(3200)]),
      hashtypeId: z.int(),
      crackerBinaryId: z.int()
    })
  })
});

export const zHealthCheckPatch = z.object({
  data: z.object({
    type: z.literal('healthCheck'),
    attributes: z.object({
      checkType: z.union([z.literal(0), z.literal(3200)]).optional()
    })
  })
});

export const zHealthCheckPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('healthCheck'),
      attributes: z.object({
        checkType: z.union([z.literal(0), z.literal(3200)]).optional()
      })
    })
  )
});

export const zHealthCheckDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('healthCheck')
    })
  )
});

export const zHealthCheckResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/healthchecks/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('healthCheck'),
    attributes: z.object({
      time: z.number(),
      status: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
      checkType: z.union([z.literal(0), z.literal(3200)]),
      hashtypeId: z.int(),
      crackerBinaryId: z.int(),
      expectedCracks: z.int(),
      attackCmd: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/healthchecks/1')
    }),
    relationships: z.object({
      crackerBinary: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/healthchecks/relationships/crackerBinary'),
          related: z.string().default('/api/v2/ui/healthchecks/crackerBinary')
        }),
        data: z
          .object({
            type: z.literal('crackerBinary'),
            id: z.int()
          })
          .nullish()
      }),
      hashType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/healthchecks/relationships/hashType'),
          related: z.string().default('/api/v2/ui/healthchecks/hashType')
        }),
        data: z
          .object({
            type: z.literal('hashType'),
            id: z.int()
          })
          .nullish()
      }),
      healthCheckAgents: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/healthchecks/relationships/healthCheckAgents'),
          related: z.string().default('/api/v2/ui/healthchecks/healthCheckAgents')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('healthCheckAgent'),
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
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('healthCheckAgent'),
          attributes: z.object({
            healthCheckId: z.int(),
            agentId: z.int(),
            status: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
            cracked: z.int(),
            numGpus: z.int(),
            start: z.number(),
            end: z.number(),
            errors: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zHealthCheckPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/healthchecks/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('healthCheck'),
    attributes: z.object({
      time: z.number(),
      status: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
      checkType: z.union([z.literal(0), z.literal(3200)]),
      hashtypeId: z.int(),
      crackerBinaryId: z.int(),
      expectedCracks: z.int(),
      attackCmd: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/healthchecks/1')
    }),
    relationships: z.object({
      crackerBinary: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/healthchecks/relationships/crackerBinary'),
          related: z.string().default('/api/v2/ui/healthchecks/crackerBinary')
        }),
        data: z
          .object({
            type: z.literal('crackerBinary'),
            id: z.int()
          })
          .nullish()
      }),
      hashType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/healthchecks/relationships/hashType'),
          related: z.string().default('/api/v2/ui/healthchecks/hashType')
        }),
        data: z
          .object({
            type: z.literal('hashType'),
            id: z.int()
          })
          .nullish()
      }),
      healthCheckAgents: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/healthchecks/relationships/healthCheckAgents'),
          related: z.string().default('/api/v2/ui/healthchecks/healthCheckAgents')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('healthCheckAgent'),
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
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('healthCheckAgent'),
          attributes: z.object({
            healthCheckId: z.int(),
            agentId: z.int(),
            status: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
            cracked: z.int(),
            numGpus: z.int(),
            start: z.number(),
            end: z.number(),
            errors: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zHealthCheckListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/healthchecks?page[size]=25'),
    first: z.string().default('/api/v2/ui/healthchecks?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/healthchecks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/healthchecks?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/healthchecks?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('healthCheck'),
      attributes: z.object({
        time: z.number(),
        status: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
        checkType: z.union([z.literal(0), z.literal(3200)]),
        hashtypeId: z.int(),
        crackerBinaryId: z.int(),
        expectedCracks: z.int(),
        attackCmd: z.string()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/healthchecks/1')
      }),
      relationships: z.object({
        crackerBinary: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/healthchecks/relationships/crackerBinary'),
            related: z.string().default('/api/v2/ui/healthchecks/crackerBinary')
          }),
          data: z
            .object({
              type: z.literal('crackerBinary'),
              id: z.int()
            })
            .nullish()
        }),
        hashType: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/healthchecks/relationships/hashType'),
            related: z.string().default('/api/v2/ui/healthchecks/hashType')
          }),
          data: z
            .object({
              type: z.literal('hashType'),
              id: z.int()
            })
            .nullish()
        }),
        healthCheckAgents: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/healthchecks/relationships/healthCheckAgents'),
            related: z.string().default('/api/v2/ui/healthchecks/healthCheckAgents')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('healthCheckAgent'),
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
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('healthCheckAgent'),
          attributes: z.object({
            healthCheckId: z.int(),
            agentId: z.int(),
            status: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
            cracked: z.int(),
            numGpus: z.int(),
            start: z.number(),
            end: z.number(),
            errors: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zHealthCheckCountResponse = z.object({
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

export const zHealthCheckRelationHealthCheckAgents = z.object({
  data: z.array(
    z.object({
      type: z.literal('healthCheckAgents'),
      id: z.int()
    })
  )
});

export const zHealthCheckRelationHealthCheckAgentsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('healthCheckAgents'),
      id: z.int()
    })
  )
});

export const zDeleteHealthchecksData = z.object({
  body: zHealthCheckDeleteMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteHealthchecksResponse = z.void();

export const zGetHealthchecksData = z.object({
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
      include: z.array(z.enum(['crackerBinary', 'hashType', 'healthCheckAgents'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetHealthchecksResponse = zHealthCheckListResponse;

export const zPatchHealthchecksData = z.object({
  body: zHealthCheckPatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchHealthchecksResponse = z.void();

export const zPostHealthchecksData = z.object({
  body: zHealthCheckCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostHealthchecksResponse = zHealthCheckPostPatchResponse;

export const zGetHealthchecksCountData = z.object({
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
export const zGetHealthchecksCountResponse = zHealthCheckCountResponse;

export const zGetHealthchecksByIdByRelationData = z.object({
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
export const zGetHealthchecksByIdByRelationResponse = zHealthCheckRelationHealthCheckAgentsGetResponse;

export const zDeleteHealthchecksByIdRelationshipsByRelationData = z.object({
  body: zHealthCheckRelationHealthCheckAgents,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteHealthchecksByIdRelationshipsByRelationResponse = z.void();

export const zGetHealthchecksByIdRelationshipsByRelationData = z.object({
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
export const zGetHealthchecksByIdRelationshipsByRelationResponse = zHealthCheckResponse;

export const zPatchHealthchecksByIdRelationshipsByRelationData = z.object({
  body: zHealthCheckRelationHealthCheckAgents,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchHealthchecksByIdRelationshipsByRelationResponse = z.void();

export const zPostHealthchecksByIdRelationshipsByRelationData = z.object({
  body: zHealthCheckRelationHealthCheckAgents,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully created
 */
export const zPostHealthchecksByIdRelationshipsByRelationResponse = z.void();

export const zDeleteHealthchecksByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteHealthchecksByIdResponse = z.void();

export const zGetHealthchecksByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.array(z.enum(['crackerBinary', 'hashType', 'healthCheckAgents'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetHealthchecksByIdResponse = zHealthCheckResponse;

export const zPatchHealthchecksByIdData = z.object({
  body: zHealthCheckPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchHealthchecksByIdResponse = zHealthCheckPostPatchResponse;
