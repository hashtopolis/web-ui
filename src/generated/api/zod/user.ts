import * as z from 'zod';

export const zUserCreate = z.object({
  data: z.object({
    type: z.literal('user'),
    attributes: z.object({
      name: z.string(),
      email: z.string(),
      globalPermissionGroupId: z.string()
    })
  })
});

export const zUserPatch = z.object({
  data: z.object({
    type: z.literal('user'),
    attributes: z.object({
      email: z.string().optional(),
      globalPermissionGroupId: z.string().optional(),
      isValid: z.boolean().optional(),
      sessionLifetime: z.int().optional()
    })
  })
});

export const zUserPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('user'),
      attributes: z.object({
        email: z.string().optional(),
        globalPermissionGroupId: z.string().optional(),
        isValid: z.boolean().optional(),
        sessionLifetime: z.int().optional()
      })
    })
  )
});

export const zUserDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
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
              id: z.string().regex(/^[0-9]+$/)
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
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('globalPermissionGroup'),
          attributes: z.object({
            name: z.string(),
            permissions: z.record(z.string(), z.boolean())
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zUserSingleResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/users/1')
  }),
  data: z.object({
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
              id: z.string().regex(/^[0-9]+$/)
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
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('globalPermissionGroup'),
          attributes: z.object({
            name: z.string(),
            permissions: z.record(z.string(), z.boolean())
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
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
              id: z.string().regex(/^[0-9]+$/)
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
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('globalPermissionGroup'),
          attributes: z.object({
            name: z.string(),
            permissions: z.record(z.string(), z.boolean())
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
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
                id: z.string().regex(/^[0-9]+$/)
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
              id: z.string().regex(/^[0-9]+$/)
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
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('globalPermissionGroup'),
          attributes: z.object({
            name: z.string(),
            permissions: z.record(z.string(), z.boolean())
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
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
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zUserRelationAccessGroupsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('accessGroups'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zDeleteUsersBody = zUserDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteUsersResponse = z.void();

export const zGetUsersQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['globalPermissionGroup', 'accessGroups'])).optional()
});

/**
 * successful operation
 */
export const zGetUsersResponse = zUserListResponse;

export const zPatchUsersBody = zUserPatchMultiple;

/**
 * successfully updated
 */
export const zPatchUsersResponse = z.void();

export const zPostUsersBody = zUserCreate;

/**
 * successful operation
 */
export const zPostUsersResponse = zUserPostPatchResponse;

export const zGetUsersCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetUsersCountResponse = zUserCountResponse;

export const zGetUsersByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetUsersByIdByRelationResponse = zUserRelationAccessGroupsGetResponse;

export const zDeleteUsersByIdRelationshipsByRelationBody = zUserRelationAccessGroups;

export const zDeleteUsersByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully deleted
 */
export const zDeleteUsersByIdRelationshipsByRelationResponse = z.void();

export const zGetUsersByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetUsersByIdRelationshipsByRelationResponse = zUserResponse;

export const zPatchUsersByIdRelationshipsByRelationBody = zUserRelationAccessGroups;

export const zPatchUsersByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchUsersByIdRelationshipsByRelationResponse = z.void();

export const zPostUsersByIdRelationshipsByRelationBody = zUserRelationAccessGroups;

export const zPostUsersByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully created
 */
export const zPostUsersByIdRelationshipsByRelationResponse = z.void();

export const zDeleteUsersByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteUsersByIdResponse = z.void();

export const zGetUsersByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetUsersByIdQuery = z.object({
  include: z.array(z.enum(['globalPermissionGroup', 'accessGroups'])).optional()
});

/**
 * successful operation
 */
export const zGetUsersByIdResponse = zUserResponse;

export const zPatchUsersByIdBody = zUserPatch;

export const zPatchUsersByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchUsersByIdResponse = zUserPostPatchResponse;
