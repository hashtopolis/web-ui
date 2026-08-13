import * as z from 'zod';

export const zHealthCheckCreate = z.object({
  data: z.object({
    type: z.literal('healthCheck'),
    attributes: z.object({
      checkType: z.union([z.literal(0), z.literal(3200)]),
      hashtypeId: z.string(),
      crackerBinaryId: z.string()
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
      id: z.string().regex(/^[0-9]+$/),
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
      id: z.string().regex(/^[0-9]+$/),
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
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('healthCheck'),
    attributes: z.object({
      time: z.number(),
      status: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
      checkType: z.union([z.literal(0), z.literal(3200)]),
      hashtypeId: z.string(),
      crackerBinaryId: z.string(),
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
            id: z.string().regex(/^[0-9]+$/)
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
            id: z.string().regex(/^[0-9]+$/)
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
          type: z.literal('crackerBinary'),
          attributes: z.object({
            crackerBinaryTypeId: z.string(),
            version: z.string(),
            downloadUrl: z.string(),
            binaryName: z.string()
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
          type: z.literal('healthCheckAgent'),
          attributes: z.object({
            healthCheckId: z.string(),
            agentId: z.string(),
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
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('healthCheck'),
    attributes: z.object({
      time: z.number(),
      status: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
      checkType: z.union([z.literal(0), z.literal(3200)]),
      hashtypeId: z.string(),
      crackerBinaryId: z.string(),
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
            id: z.string().regex(/^[0-9]+$/)
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
            id: z.string().regex(/^[0-9]+$/)
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
          type: z.literal('crackerBinary'),
          attributes: z.object({
            crackerBinaryTypeId: z.string(),
            version: z.string(),
            downloadUrl: z.string(),
            binaryName: z.string()
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
          type: z.literal('healthCheckAgent'),
          attributes: z.object({
            healthCheckId: z.string(),
            agentId: z.string(),
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
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('healthCheck'),
      attributes: z.object({
        time: z.number(),
        status: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
        checkType: z.union([z.literal(0), z.literal(3200)]),
        hashtypeId: z.string(),
        crackerBinaryId: z.string(),
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
              id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
          type: z.literal('crackerBinary'),
          attributes: z.object({
            crackerBinaryTypeId: z.string(),
            version: z.string(),
            downloadUrl: z.string(),
            binaryName: z.string()
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
          type: z.literal('healthCheckAgent'),
          attributes: z.object({
            healthCheckId: z.string(),
            agentId: z.string(),
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
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zHealthCheckRelationHealthCheckAgentsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('healthCheckAgents'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zDeleteHealthchecksBody = zHealthCheckDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteHealthchecksResponse = z.void();

export const zGetHealthchecksQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['crackerBinary', 'hashType', 'healthCheckAgents'])).optional()
});

/**
 * successful operation
 */
export const zGetHealthchecksResponse = zHealthCheckListResponse;

export const zPatchHealthchecksBody = zHealthCheckPatchMultiple;

/**
 * successfully updated
 */
export const zPatchHealthchecksResponse = z.void();

export const zPostHealthchecksBody = zHealthCheckCreate;

/**
 * successful operation
 */
export const zPostHealthchecksResponse = zHealthCheckPostPatchResponse;

export const zGetHealthchecksCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetHealthchecksCountResponse = zHealthCheckCountResponse;

export const zGetHealthchecksByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetHealthchecksByIdByRelationResponse = zHealthCheckRelationHealthCheckAgentsGetResponse;

export const zDeleteHealthchecksByIdRelationshipsByRelationBody = zHealthCheckRelationHealthCheckAgents;

export const zDeleteHealthchecksByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully deleted
 */
export const zDeleteHealthchecksByIdRelationshipsByRelationResponse = z.void();

export const zGetHealthchecksByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetHealthchecksByIdRelationshipsByRelationResponse = zHealthCheckResponse;

export const zPatchHealthchecksByIdRelationshipsByRelationBody = zHealthCheckRelationHealthCheckAgents;

export const zPatchHealthchecksByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchHealthchecksByIdRelationshipsByRelationResponse = z.void();

export const zPostHealthchecksByIdRelationshipsByRelationBody = zHealthCheckRelationHealthCheckAgents;

export const zPostHealthchecksByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully created
 */
export const zPostHealthchecksByIdRelationshipsByRelationResponse = z.void();

export const zDeleteHealthchecksByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteHealthchecksByIdResponse = z.void();

export const zGetHealthchecksByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetHealthchecksByIdQuery = z.object({
  include: z.array(z.enum(['crackerBinary', 'hashType', 'healthCheckAgents'])).optional()
});

/**
 * successful operation
 */
export const zGetHealthchecksByIdResponse = zHealthCheckResponse;

export const zPatchHealthchecksByIdBody = zHealthCheckPatch;

export const zPatchHealthchecksByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchHealthchecksByIdResponse = zHealthCheckPostPatchResponse;
