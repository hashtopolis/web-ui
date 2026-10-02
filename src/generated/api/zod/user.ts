import * as z from 'zod';

export const zUserResourceObject = z.object({
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
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/users/1')
  }),
  relationships: z.object({
    accessGroups: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/users/relationships/accessGroups'),
        related: z.string().default('/api/v2/ui/users/accessGroups')
      }),
      data: z
        .array(
          z.object({
            type: z.literal('accessGroup'),
            id: z.int()
          })
        )
        .optional()
    }),
    globalPermissionGroup: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/users/relationships/globalPermissionGroup'),
        related: z.string().default('/api/v2/ui/users/globalPermissionGroup')
      }),
      data: z
        .object({
          type: z.literal('globalPermissionGroup'),
          id: z.int()
        })
        .nullish()
    })
  })
});

export const zUserCreate = z.object({
  data: z.object({
    type: z.literal('user'),
    attributes: z.object({
      name: z.string(),
      email: z.string(),
      isValid: z.boolean(),
      sessionLifetime: z.int(),
      globalPermissionGroupId: z.int()
    })
  })
});

export const zUserPatch = z.object({
  data: z.object({
    type: z.literal('user'),
    attributes: z.object({
      email: z.string().optional(),
      globalPermissionGroupId: z.int().optional(),
      isValid: z.boolean().optional(),
      sessionLifetime: z.int().optional()
    })
  })
});

export const zUserPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('user'),
      attributes: z.object({
        email: z.string().optional(),
        globalPermissionGroupId: z.int().optional(),
        isValid: z.boolean().optional(),
        sessionLifetime: z.int().optional()
      })
    })
  )
});

export const zUserDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('user')
    })
  )
});

export const zUserResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/users/1')
  }),
  data: z.object({
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
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/users/1')
    }),
    relationships: z.object({
      accessGroups: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/users/relationships/accessGroups'),
          related: z.string().default('/api/v2/ui/users/accessGroups')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('accessGroup'),
              id: z.int()
            })
          )
          .optional()
      }),
      globalPermissionGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/users/relationships/globalPermissionGroup'),
          related: z.string().default('/api/v2/ui/users/globalPermissionGroup')
        }),
        data: z
          .object({
            type: z.literal('globalPermissionGroup'),
            id: z.int()
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('globalPermissionGroup'),
          attributes: z.object({
            name: z.string(),
            permissions: z.record(z.string(), z.boolean())
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zUserPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/users/1')
  }),
  data: z.object({
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
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/users/1')
    }),
    relationships: z.object({
      accessGroups: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/users/relationships/accessGroups'),
          related: z.string().default('/api/v2/ui/users/accessGroups')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('accessGroup'),
              id: z.int()
            })
          )
          .optional()
      }),
      globalPermissionGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/users/relationships/globalPermissionGroup'),
          related: z.string().default('/api/v2/ui/users/globalPermissionGroup')
        }),
        data: z
          .object({
            type: z.literal('globalPermissionGroup'),
            id: z.int()
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('globalPermissionGroup'),
          attributes: z.object({
            name: z.string(),
            permissions: z.record(z.string(), z.boolean())
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zUserListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/users?page[size]=25'),
    first: z.string().default('/api/v2/ui/users?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/users?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/users?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/users?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/users/1')
      }),
      relationships: z.object({
        accessGroups: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/users/relationships/accessGroups'),
            related: z.string().default('/api/v2/ui/users/accessGroups')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('accessGroup'),
                id: z.int()
              })
            )
            .optional()
        }),
        globalPermissionGroup: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/users/relationships/globalPermissionGroup'),
            related: z.string().default('/api/v2/ui/users/globalPermissionGroup')
          }),
          data: z
            .object({
              type: z.literal('globalPermissionGroup'),
              id: z.int()
            })
            .nullish()
        })
      })
    })
  ),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('globalPermissionGroup'),
          attributes: z.object({
            name: z.string(),
            permissions: z.record(z.string(), z.boolean())
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zUserCountResponse = z.object({
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

export const zUserRelationAccessGroups = z.object({
  data: z.array(
    z.object({
      type: z.literal('accessGroups'),
      id: z.int()
    })
  )
});

export const zUserRelationAccessGroupsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('accessGroups'),
      id: z.int()
    })
  )
});

export const zDeleteUsersData = z.object({
  body: zUserDeleteMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteUsersResponse = z.void();

export const zGetUsersData = z.object({
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
      include: z.array(z.enum(['globalPermissionGroup', 'accessGroups'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetUsersResponse = zUserListResponse;

export const zPatchUsersData = z.object({
  body: zUserPatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchUsersResponse = z.void();

export const zPostUsersData = z.object({
  body: zUserCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostUsersResponse = zUserPostPatchResponse;

export const zGetUsersCountData = z.object({
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
export const zGetUsersCountResponse = zUserCountResponse;

export const zGetUsersByIdByRelationData = z.object({
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
export const zGetUsersByIdByRelationResponse = zUserRelationAccessGroupsGetResponse;

export const zDeleteUsersByIdRelationshipsByRelationData = z.object({
  body: zUserRelationAccessGroups,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteUsersByIdRelationshipsByRelationResponse = z.void();

export const zGetUsersByIdRelationshipsByRelationData = z.object({
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
export const zGetUsersByIdRelationshipsByRelationResponse = zUserResponse;

export const zPatchUsersByIdRelationshipsByRelationData = z.object({
  body: zUserRelationAccessGroups,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchUsersByIdRelationshipsByRelationResponse = z.void();

export const zPostUsersByIdRelationshipsByRelationData = z.object({
  body: zUserRelationAccessGroups,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully created
 */
export const zPostUsersByIdRelationshipsByRelationResponse = z.void();

export const zDeleteUsersByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteUsersByIdResponse = z.void();

export const zGetUsersByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.array(z.enum(['globalPermissionGroup', 'accessGroups'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetUsersByIdResponse = zUserResponse;

export const zPatchUsersByIdData = z.object({
  body: zUserPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchUsersByIdResponse = zUserPostPatchResponse;
