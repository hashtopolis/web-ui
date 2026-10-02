import * as z from 'zod';

export const zConfigResourceObject = z.object({
  id: z.int(),
  type: z.literal('config'),
  attributes: z.union([
    z.object({
      configSectionId: z.int(),
      item: z.literal('serverLogLevel'),
      value: z.union([
        z.literal('0'),
        z.literal('10'),
        z.literal('20'),
        z.literal('30'),
        z.literal('40'),
        z.literal('50')
      ]),
      valueBoundaries: z
        .object({
          min: z.int().optional(),
          max: z.int().optional(),
          maxLength: z.int().optional(),
          binaryValues: z.array(z.string()).optional()
        })
        .optional()
    }),
    z.object({
      configSectionId: z.int(),
      item: z.literal('notificationsProxyType'),
      value: z.union([z.literal('HTTP'), z.literal('HTTPS'), z.literal('SOCKS4'), z.literal('SOCKS5')]),
      valueBoundaries: z
        .object({
          min: z.int().optional(),
          max: z.int().optional(),
          maxLength: z.int().optional(),
          binaryValues: z.array(z.string()).optional()
        })
        .optional()
    }),
    z.object({
      configSectionId: z.int(),
      item: z.string(),
      value: z.string(),
      valueBoundaries: z
        .object({
          min: z.int().optional(),
          max: z.int().optional(),
          maxLength: z.int().optional(),
          binaryValues: z.array(z.string()).optional()
        })
        .optional()
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
          id: z.int()
        })
        .nullish()
    })
  })
});

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
      id: z.int(),
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
    id: z.int(),
    type: z.literal('config'),
    attributes: z.union([
      z.object({
        configSectionId: z.int(),
        item: z.literal('serverLogLevel'),
        value: z.union([
          z.literal('0'),
          z.literal('10'),
          z.literal('20'),
          z.literal('30'),
          z.literal('40'),
          z.literal('50')
        ]),
        valueBoundaries: z
          .object({
            min: z.int().optional(),
            max: z.int().optional(),
            maxLength: z.int().optional(),
            binaryValues: z.array(z.string()).optional()
          })
          .optional()
      }),
      z.object({
        configSectionId: z.int(),
        item: z.literal('notificationsProxyType'),
        value: z.union([z.literal('HTTP'), z.literal('HTTPS'), z.literal('SOCKS4'), z.literal('SOCKS5')]),
        valueBoundaries: z
          .object({
            min: z.int().optional(),
            max: z.int().optional(),
            maxLength: z.int().optional(),
            binaryValues: z.array(z.string()).optional()
          })
          .optional()
      }),
      z.object({
        configSectionId: z.int(),
        item: z.string(),
        value: z.string(),
        valueBoundaries: z
          .object({
            min: z.int().optional(),
            max: z.int().optional(),
            maxLength: z.int().optional(),
            binaryValues: z.array(z.string()).optional()
          })
          .optional()
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
            id: z.int()
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.object({
        id: z.int(),
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
    id: z.int(),
    type: z.literal('config'),
    attributes: z.union([
      z.object({
        configSectionId: z.int(),
        item: z.literal('serverLogLevel'),
        value: z.union([
          z.literal('0'),
          z.literal('10'),
          z.literal('20'),
          z.literal('30'),
          z.literal('40'),
          z.literal('50')
        ]),
        valueBoundaries: z
          .object({
            min: z.int().optional(),
            max: z.int().optional(),
            maxLength: z.int().optional(),
            binaryValues: z.array(z.string()).optional()
          })
          .optional()
      }),
      z.object({
        configSectionId: z.int(),
        item: z.literal('notificationsProxyType'),
        value: z.union([z.literal('HTTP'), z.literal('HTTPS'), z.literal('SOCKS4'), z.literal('SOCKS5')]),
        valueBoundaries: z
          .object({
            min: z.int().optional(),
            max: z.int().optional(),
            maxLength: z.int().optional(),
            binaryValues: z.array(z.string()).optional()
          })
          .optional()
      }),
      z.object({
        configSectionId: z.int(),
        item: z.string(),
        value: z.string(),
        valueBoundaries: z
          .object({
            min: z.int().optional(),
            max: z.int().optional(),
            maxLength: z.int().optional(),
            binaryValues: z.array(z.string()).optional()
          })
          .optional()
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
            id: z.int()
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.object({
        id: z.int(),
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
      id: z.int(),
      type: z.literal('config'),
      attributes: z.union([
        z.object({
          configSectionId: z.int(),
          item: z.literal('serverLogLevel'),
          value: z.union([
            z.literal('0'),
            z.literal('10'),
            z.literal('20'),
            z.literal('30'),
            z.literal('40'),
            z.literal('50')
          ]),
          valueBoundaries: z
            .object({
              min: z.int().optional(),
              max: z.int().optional(),
              maxLength: z.int().optional(),
              binaryValues: z.array(z.string()).optional()
            })
            .optional()
        }),
        z.object({
          configSectionId: z.int(),
          item: z.literal('notificationsProxyType'),
          value: z.union([z.literal('HTTP'), z.literal('HTTPS'), z.literal('SOCKS4'), z.literal('SOCKS5')]),
          valueBoundaries: z
            .object({
              min: z.int().optional(),
              max: z.int().optional(),
              maxLength: z.int().optional(),
              binaryValues: z.array(z.string()).optional()
            })
            .optional()
        }),
        z.object({
          configSectionId: z.int(),
          item: z.string(),
          value: z.string(),
          valueBoundaries: z
            .object({
              min: z.int().optional(),
              max: z.int().optional(),
              maxLength: z.int().optional(),
              binaryValues: z.array(z.string()).optional()
            })
            .optional()
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
              id: z.int()
            })
            .nullish()
        })
      })
    })
  ),
  included: z
    .array(
      z.object({
        id: z.int(),
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
    id: z.int()
  })
});

export const zConfigRelationConfigSectionGetResponse = z.object({
  data: z.object({
    type: z.literal('configSection'),
    id: z.int()
  })
});

export const zGetConfigsData = z.object({
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
      include: z.array(z.enum(['configSection'])).optional(),
      aggregate: z.record(z.string(), z.string()).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetConfigsResponse = zConfigListResponse;

export const zPatchConfigsData = z.object({
  body: zConfigPatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchConfigsResponse = z.void();

export const zGetConfigsCountData = z.object({
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
export const zGetConfigsCountResponse = zConfigCountResponse;

export const zGetConfigsByIdByRelationData = z.object({
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
export const zGetConfigsByIdByRelationResponse = zConfigRelationConfigSectionGetResponse;

export const zGetConfigsByIdRelationshipsByRelationData = z.object({
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
export const zGetConfigsByIdRelationshipsByRelationResponse = zConfigResponse;

export const zPatchConfigsByIdRelationshipsByRelationData = z.object({
  body: zConfigRelationConfigSection,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchConfigsByIdRelationshipsByRelationResponse = z.void();

export const zGetConfigsByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.array(z.enum(['configSection'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetConfigsByIdResponse = zConfigResponse;

export const zPatchConfigsByIdData = z.object({
  body: zConfigPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchConfigsByIdResponse = zConfigPostPatchResponse;
