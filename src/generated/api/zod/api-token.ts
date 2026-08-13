import * as z from 'zod';

export const zApiTokenCreate = z.object({
  data: z.object({
    type: z.literal('apiToken'),
    attributes: z.object({
      scopes: z.array(z.int()),
      startValid: z.number(),
      endValid: z.number(),
      userId: z.string().nullish(),
      isRevoked: z.boolean()
    })
  })
});

export const zApiTokenPatch = z.object({
  data: z.object({
    type: z.literal('apiToken'),
    attributes: z.object({
      isRevoked: z.boolean().optional()
    })
  })
});

export const zApiTokenPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('apiToken'),
      attributes: z.object({
        isRevoked: z.boolean().optional()
      })
    })
  )
});

export const zApiTokenDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
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
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('apiToken'),
    attributes: z.object({
      startValid: z.number(),
      endValid: z.number(),
      userId: z.string().nullable(),
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
        type: z.literal('user'),
        attributes: z.object({
          name: z.string(),
          email: z.string(),
          isValid: z.boolean(),
          isComputedPassword: z.boolean(),
          lastLoginDate: z.number(),
          registeredSince: z.number(),
          sessionLifetime: z.int(),
          globalPermissionGroupId: z.string(),
          yubikey: z.string(),
          otp1: z.string(),
          otp2: z.string(),
          otp3: z.string(),
          otp4: z.string()
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
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('apiToken'),
    attributes: z.object({
      startValid: z.number(),
      endValid: z.number(),
      userId: z.string().nullable(),
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
        type: z.literal('user'),
        attributes: z.object({
          name: z.string(),
          email: z.string(),
          isValid: z.boolean(),
          isComputedPassword: z.boolean(),
          lastLoginDate: z.number(),
          registeredSince: z.number(),
          sessionLifetime: z.int(),
          globalPermissionGroupId: z.string(),
          yubikey: z.string(),
          otp1: z.string(),
          otp2: z.string(),
          otp3: z.string(),
          otp4: z.string()
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
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('apiToken'),
      attributes: z.object({
        startValid: z.number(),
        endValid: z.number(),
        userId: z.string().nullable(),
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
        type: z.literal('user'),
        attributes: z.object({
          name: z.string(),
          email: z.string(),
          isValid: z.boolean(),
          isComputedPassword: z.boolean(),
          lastLoginDate: z.number(),
          registeredSince: z.number(),
          sessionLifetime: z.int(),
          globalPermissionGroupId: z.string(),
          yubikey: z.string(),
          otp1: z.string(),
          otp2: z.string(),
          otp3: z.string(),
          otp4: z.string()
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
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zApiTokenRelationUserGetResponse = z.object({
  data: z.object({
    type: z.literal('user'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zDeleteApiTokensBody = zApiTokenDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteApiTokensResponse = z.void();

export const zGetApiTokensQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['user'])).optional()
});

/**
 * successful operation
 */
export const zGetApiTokensResponse = zApiTokenListResponse;

export const zPatchApiTokensBody = zApiTokenPatchMultiple;

/**
 * successfully updated
 */
export const zPatchApiTokensResponse = z.void();

export const zPostApiTokensBody = zApiTokenCreate;

/**
 * successful operation
 */
export const zPostApiTokensResponse = zApiTokenPostPatchResponse;

export const zGetApiTokensCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetApiTokensCountResponse = zApiTokenCountResponse;

export const zGetApiTokensByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetApiTokensByIdByRelationResponse = zApiTokenRelationUserGetResponse;

export const zGetApiTokensByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetApiTokensByIdRelationshipsByRelationResponse = zApiTokenResponse;

export const zPatchApiTokensByIdRelationshipsByRelationBody = zApiTokenRelationUser;

export const zPatchApiTokensByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchApiTokensByIdRelationshipsByRelationResponse = z.void();

export const zDeleteApiTokensByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteApiTokensByIdResponse = z.void();

export const zGetApiTokensByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetApiTokensByIdQuery = z.object({
  include: z.array(z.enum(['user'])).optional()
});

/**
 * successful operation
 */
export const zGetApiTokensByIdResponse = zApiTokenResponse;

export const zPatchApiTokensByIdBody = zApiTokenPatch;

export const zPatchApiTokensByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchApiTokensByIdResponse = zApiTokenPostPatchResponse;
