import * as z from 'zod';

export const zConfigPatch = z.object({
  data: z.object({
    type: z.literal('config'),
    attributes: z.object({
      item: z.string().optional(),
      value: z.string().optional()
    })
  })
});

export const zConfigPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('config'),
      attributes: z.object({
        item: z.string().optional(),
        value: z.string().optional()
      })
    })
  )
});

export const zConfigResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/configs/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('config'),
    attributes: z.union([
      z.object({
        configSectionId: z.string(),
        item: z.literal('serverLogLevel'),
        value: z.union([
          z.literal('0'),
          z.literal('10'),
          z.literal('20'),
          z.literal('30'),
          z.literal('40'),
          z.literal('50')
        ])
      }),
      z.object({
        configSectionId: z.string(),
        item: z.literal('notificationsProxyType'),
        value: z.union([z.literal('HTTP'), z.literal('HTTPS'), z.literal('SOCKS4'), z.literal('SOCKS5')])
      }),
      z.object({
        configSectionId: z.string(),
        item: z.string(),
        value: z.string()
      })
    ]),
    links: z.object({
      self: z.string().default('/api/v2/ui/configs/1')
    }),
    relationships: z.object({
      configSection: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/configs/relationships/configSection'),
          related: z.string().default('/api/v2/ui/configs/configSection')
        }),
        data: z
          .object({
            type: z.literal('configSection'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9]+$/),
        type: z.literal('configSection'),
        attributes: z.object({
          sectionName: z.string()
        })
      })
    )
    .optional()
});

export const zConfigSingleResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/configs/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('config'),
    attributes: z.union([
      z.object({
        configSectionId: z.string(),
        item: z.literal('serverLogLevel'),
        value: z.union([
          z.literal('0'),
          z.literal('10'),
          z.literal('20'),
          z.literal('30'),
          z.literal('40'),
          z.literal('50')
        ])
      }),
      z.object({
        configSectionId: z.string(),
        item: z.literal('notificationsProxyType'),
        value: z.union([z.literal('HTTP'), z.literal('HTTPS'), z.literal('SOCKS4'), z.literal('SOCKS5')])
      }),
      z.object({
        configSectionId: z.string(),
        item: z.string(),
        value: z.string()
      })
    ]),
    links: z.object({
      self: z.string().default('/api/v2/ui/configs/1')
    }),
    relationships: z.object({
      configSection: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/configs/relationships/configSection'),
          related: z.string().default('/api/v2/ui/configs/configSection')
        }),
        data: z
          .object({
            type: z.literal('configSection'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9]+$/),
        type: z.literal('configSection'),
        attributes: z.object({
          sectionName: z.string()
        })
      })
    )
    .optional()
});

export const zConfigPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/configs/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('config'),
    attributes: z.union([
      z.object({
        configSectionId: z.string(),
        item: z.literal('serverLogLevel'),
        value: z.union([
          z.literal('0'),
          z.literal('10'),
          z.literal('20'),
          z.literal('30'),
          z.literal('40'),
          z.literal('50')
        ])
      }),
      z.object({
        configSectionId: z.string(),
        item: z.literal('notificationsProxyType'),
        value: z.union([z.literal('HTTP'), z.literal('HTTPS'), z.literal('SOCKS4'), z.literal('SOCKS5')])
      }),
      z.object({
        configSectionId: z.string(),
        item: z.string(),
        value: z.string()
      })
    ]),
    links: z.object({
      self: z.string().default('/api/v2/ui/configs/1')
    }),
    relationships: z.object({
      configSection: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/configs/relationships/configSection'),
          related: z.string().default('/api/v2/ui/configs/configSection')
        }),
        data: z
          .object({
            type: z.literal('configSection'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9]+$/),
        type: z.literal('configSection'),
        attributes: z.object({
          sectionName: z.string()
        })
      })
    )
    .optional()
});

export const zConfigListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/configs?page[size]=25'),
    first: z.string().default('/api/v2/ui/configs?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/configs?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/configs?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/configs?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('config'),
      attributes: z.union([
        z.object({
          configSectionId: z.string(),
          item: z.literal('serverLogLevel'),
          value: z.union([
            z.literal('0'),
            z.literal('10'),
            z.literal('20'),
            z.literal('30'),
            z.literal('40'),
            z.literal('50')
          ])
        }),
        z.object({
          configSectionId: z.string(),
          item: z.literal('notificationsProxyType'),
          value: z.union([z.literal('HTTP'), z.literal('HTTPS'), z.literal('SOCKS4'), z.literal('SOCKS5')])
        }),
        z.object({
          configSectionId: z.string(),
          item: z.string(),
          value: z.string()
        })
      ]),
      links: z.object({
        self: z.string().default('/api/v2/ui/configs/1')
      }),
      relationships: z.object({
        configSection: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/configs/relationships/configSection'),
            related: z.string().default('/api/v2/ui/configs/configSection')
          }),
          data: z
            .object({
              type: z.literal('configSection'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        })
      })
    })
  ),
  included: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9]+$/),
        type: z.literal('configSection'),
        attributes: z.object({
          sectionName: z.string()
        })
      })
    )
    .optional()
});

export const zConfigCountResponse = z.object({
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

export const zConfigRelationConfigSection = z.object({
  data: z.object({
    type: z.literal('configSection'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zConfigRelationConfigSectionGetResponse = z.object({
  data: z.object({
    type: z.literal('configSection'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zGetConfigsQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['configSection'])).optional(),
  aggregate: z.record(z.string(), z.string()).optional()
});

/**
 * successful operation
 */
export const zGetConfigsResponse = zConfigListResponse;

export const zPatchConfigsBody = zConfigPatchMultiple;

/**
 * successfully updated
 */
export const zPatchConfigsResponse = z.void();

export const zGetConfigsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetConfigsCountResponse = zConfigCountResponse;

export const zGetConfigsByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetConfigsByIdByRelationResponse = zConfigRelationConfigSectionGetResponse;

export const zGetConfigsByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetConfigsByIdRelationshipsByRelationResponse = zConfigResponse;

export const zPatchConfigsByIdRelationshipsByRelationBody = zConfigRelationConfigSection;

export const zPatchConfigsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchConfigsByIdRelationshipsByRelationResponse = z.void();

export const zGetConfigsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetConfigsByIdQuery = z.object({
  include: z.array(z.enum(['configSection'])).optional()
});

/**
 * successful operation
 */
export const zGetConfigsByIdResponse = zConfigResponse;

export const zPatchConfigsByIdBody = zConfigPatch;

export const zPatchConfigsByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchConfigsByIdResponse = zConfigPostPatchResponse;
