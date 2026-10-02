import * as z from 'zod';

export const zApiTokenCreate = z.object({
  data: z.object({
    type: z.literal('apiToken'),
    attributes: z.object({
      scopes: z.array(z.int()),
      startValid: z.number(),
      endValid: z.number(),
      userId: z.int().nullish(),
      tokenName: z.string(),
      isRevoked: z.boolean()
    })
  })
});

export const zApiTokenPatch = z.object({
  data: z.object({
    type: z.literal('apiToken'),
    attributes: z.object({
      isRevoked: z.boolean().optional(),
      tokenName: z.string().optional()
    })
  })
});

export const zApiTokenPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('apiToken'),
      attributes: z.object({
        isRevoked: z.boolean().optional(),
        tokenName: z.string().optional()
      })
    })
  )
});

export const zApiTokenDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('apiToken')
    })
  )
});

export const zApiTokenResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/apiTokens/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('apiToken'),
    attributes: z.object({
      startValid: z.number(),
      endValid: z.number(),
      userId: z.int().nullable(),
      tokenName: z.string(),
      isRevoked: z.boolean(),
      token: z.string().optional()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/apiTokens/1')
    }),
    relationships: z.object({
      user: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/apiTokens/relationships/user'),
          related: z.string().default('/api/v2/ui/apiTokens/user')
        }),
        data: z
          .object({
            type: z.literal('user'),
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
        type: z.literal('user'),
        attributes: z.object({
          name: z.string(),
          email: z.string().optional(),
          isValid: z.boolean().optional(),
          isComputedPassword: z.boolean().optional(),
          lastLoginDate: z.number().optional(),
          registeredSince: z.number().optional(),
          sessionLifetime: z.int().optional(),
          globalPermissionGroupId: z.int().optional()
        })
      })
    )
    .optional()
});

export const zApiTokenPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/apiTokens/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('apiToken'),
    attributes: z.object({
      startValid: z.number(),
      endValid: z.number(),
      userId: z.int().nullable(),
      tokenName: z.string(),
      isRevoked: z.boolean(),
      token: z.string().optional()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/apiTokens/1')
    }),
    relationships: z.object({
      user: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/apiTokens/relationships/user'),
          related: z.string().default('/api/v2/ui/apiTokens/user')
        }),
        data: z
          .object({
            type: z.literal('user'),
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
        type: z.literal('user'),
        attributes: z.object({
          name: z.string(),
          email: z.string().optional(),
          isValid: z.boolean().optional(),
          isComputedPassword: z.boolean().optional(),
          lastLoginDate: z.number().optional(),
          registeredSince: z.number().optional(),
          sessionLifetime: z.int().optional(),
          globalPermissionGroupId: z.int().optional()
        })
      })
    )
    .optional()
});

export const zApiTokenListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/apiTokens?page[size]=25'),
    first: z.string().default('/api/v2/ui/apiTokens?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/apiTokens?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/apiTokens?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/apiTokens?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('apiToken'),
      attributes: z.object({
        startValid: z.number(),
        endValid: z.number(),
        userId: z.int().nullable(),
        tokenName: z.string(),
        isRevoked: z.boolean(),
        token: z.string().optional()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/apiTokens/1')
      }),
      relationships: z.object({
        user: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/apiTokens/relationships/user'),
            related: z.string().default('/api/v2/ui/apiTokens/user')
          }),
          data: z
            .object({
              type: z.literal('user'),
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
        type: z.literal('user'),
        attributes: z.object({
          name: z.string(),
          email: z.string().optional(),
          isValid: z.boolean().optional(),
          isComputedPassword: z.boolean().optional(),
          lastLoginDate: z.number().optional(),
          registeredSince: z.number().optional(),
          sessionLifetime: z.int().optional(),
          globalPermissionGroupId: z.int().optional()
        })
      })
    )
    .optional()
});

export const zApiTokenCountResponse = z.object({
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

export const zApiTokenRelationUser = z.object({
  data: z.object({
    type: z.literal('user'),
    id: z.int()
  })
});

export const zApiTokenRelationUserGetResponse = z.object({
  data: z.object({
    type: z.literal('user'),
    id: z.int()
  })
});

export const zDeleteApiTokensData = z.object({
  body: zApiTokenDeleteMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteApiTokensResponse = z.void();

export const zGetApiTokensData = z.object({
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
      include: z.array(z.enum(['user'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetApiTokensResponse = zApiTokenListResponse;

export const zPatchApiTokensData = z.object({
  body: zApiTokenPatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchApiTokensResponse = z.void();

export const zPostApiTokensData = z.object({
  body: zApiTokenCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostApiTokensResponse = zApiTokenPostPatchResponse;

export const zGetApiTokensCountData = z.object({
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
export const zGetApiTokensCountResponse = zApiTokenCountResponse;

export const zGetApiTokensByIdByRelationData = z.object({
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
export const zGetApiTokensByIdByRelationResponse = zApiTokenRelationUserGetResponse;

export const zGetApiTokensByIdRelationshipsByRelationData = z.object({
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
export const zGetApiTokensByIdRelationshipsByRelationResponse = zApiTokenResponse;

export const zPatchApiTokensByIdRelationshipsByRelationData = z.object({
  body: zApiTokenRelationUser,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchApiTokensByIdRelationshipsByRelationResponse = z.void();

export const zDeleteApiTokensByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteApiTokensByIdResponse = z.void();

export const zGetApiTokensByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.array(z.enum(['user'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetApiTokensByIdResponse = zApiTokenResponse;

export const zPatchApiTokensByIdData = z.object({
  body: zApiTokenPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchApiTokensByIdResponse = zApiTokenPostPatchResponse;
