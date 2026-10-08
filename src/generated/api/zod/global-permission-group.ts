import * as z from 'zod';

export const zGlobalPermissionGroupResourceObject = z.object({
  id: z.int(),
  type: z.literal('globalPermissionGroup'),
  attributes: z.object({
    name: z.string(),
    permissions: z.record(z.string(), z.boolean())
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/globalpermissiongroups/1')
  }),
  relationships: z.object({
    userMembers: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/globalpermissiongroups/relationships/userMembers'),
        related: z.string().default('/api/v2/ui/globalpermissiongroups/userMembers')
      }),
      data: z
        .array(
          z.object({
            type: z.literal('user'),
            id: z.int()
          })
        )
        .optional()
    })
  })
});

export const zGlobalPermissionGroupCreate = z.object({
  data: z.object({
    type: z.literal('globalPermissionGroup'),
    attributes: z.object({
      name: z.string(),
      permissions: z.record(z.string(), z.boolean())
    })
  })
});

export const zGlobalPermissionGroupPatch = z.object({
  data: z.object({
    type: z.literal('globalPermissionGroup'),
    attributes: z.object({
      name: z.string().optional(),
      permissions: z.record(z.string(), z.boolean()).optional()
    })
  })
});

export const zGlobalPermissionGroupPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('globalPermissionGroup'),
      attributes: z.object({
        name: z.string().optional(),
        permissions: z.record(z.string(), z.boolean()).optional()
      })
    })
  )
});

export const zGlobalPermissionGroupDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('globalPermissionGroup')
    })
  )
});

export const zGlobalPermissionGroupResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/globalpermissiongroups/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('globalPermissionGroup'),
    attributes: z.object({
      name: z.string(),
      permissions: z.record(z.string(), z.boolean())
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/globalpermissiongroups/1')
    }),
    relationships: z.object({
      userMembers: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/globalpermissiongroups/relationships/userMembers'),
          related: z.string().default('/api/v2/ui/globalpermissiongroups/userMembers')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('user'),
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

export const zGlobalPermissionGroupPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/globalpermissiongroups/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('globalPermissionGroup'),
    attributes: z.object({
      name: z.string(),
      permissions: z.record(z.string(), z.boolean())
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/globalpermissiongroups/1')
    }),
    relationships: z.object({
      userMembers: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/globalpermissiongroups/relationships/userMembers'),
          related: z.string().default('/api/v2/ui/globalpermissiongroups/userMembers')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('user'),
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

export const zGlobalPermissionGroupListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/globalpermissiongroups?page[size]=25'),
    first: z.string().default('/api/v2/ui/globalpermissiongroups?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/globalpermissiongroups?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/globalpermissiongroups?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/globalpermissiongroups?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('globalPermissionGroup'),
      attributes: z.object({
        name: z.string(),
        permissions: z.record(z.string(), z.boolean())
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/globalpermissiongroups/1')
      }),
      relationships: z.object({
        userMembers: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/globalpermissiongroups/relationships/userMembers'),
            related: z.string().default('/api/v2/ui/globalpermissiongroups/userMembers')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('user'),
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

export const zGlobalPermissionGroupCountResponse = z.object({
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

export const zGlobalPermissionGroupRelationUserMembers = z.object({
  data: z.array(
    z.object({
      type: z.literal('user'),
      id: z.int()
    })
  )
});

export const zGlobalPermissionGroupRelationUserMembersGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('user'),
      id: z.int()
    })
  )
});

export const zDeleteGlobalpermissiongroupsBody = zGlobalPermissionGroupDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteGlobalpermissiongroupsResponse = z.void();

export const zGetGlobalpermissiongroupsQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['userMembers'])).optional()
});

/**
 * successful operation
 */
export const zGetGlobalpermissiongroupsResponse = zGlobalPermissionGroupListResponse;

export const zPatchGlobalpermissiongroupsBody = zGlobalPermissionGroupPatchMultiple;

/**
 * successfully updated
 */
export const zPatchGlobalpermissiongroupsResponse = z.void();

export const zPostGlobalpermissiongroupsBody = zGlobalPermissionGroupCreate;

/**
 * successful operation
 */
export const zPostGlobalpermissiongroupsResponse = zGlobalPermissionGroupPostPatchResponse;

export const zGetGlobalpermissiongroupsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetGlobalpermissiongroupsCountResponse = zGlobalPermissionGroupCountResponse;

export const zGetGlobalpermissiongroupsByIdUserMembersPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetGlobalpermissiongroupsByIdUserMembersResponse = zGlobalPermissionGroupRelationUserMembersGetResponse;

export const zDeleteGlobalpermissiongroupsByIdRelationshipsUserMembersBody = zGlobalPermissionGroupRelationUserMembers;

export const zDeleteGlobalpermissiongroupsByIdRelationshipsUserMembersPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteGlobalpermissiongroupsByIdRelationshipsUserMembersResponse = z.void();

export const zGetGlobalpermissiongroupsByIdRelationshipsUserMembersPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetGlobalpermissiongroupsByIdRelationshipsUserMembersResponse = zGlobalPermissionGroupResponse;

export const zPatchGlobalpermissiongroupsByIdRelationshipsUserMembersBody = zGlobalPermissionGroupRelationUserMembers;

export const zPatchGlobalpermissiongroupsByIdRelationshipsUserMembersPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchGlobalpermissiongroupsByIdRelationshipsUserMembersResponse = z.void();

export const zPostGlobalpermissiongroupsByIdRelationshipsUserMembersBody = zGlobalPermissionGroupRelationUserMembers;

export const zPostGlobalpermissiongroupsByIdRelationshipsUserMembersPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostGlobalpermissiongroupsByIdRelationshipsUserMembersResponse = z.void();

export const zDeleteGlobalpermissiongroupsByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteGlobalpermissiongroupsByIdResponse = z.void();

export const zGetGlobalpermissiongroupsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetGlobalpermissiongroupsByIdQuery = z.object({
  include: z.array(z.enum(['userMembers'])).optional()
});

/**
 * successful operation
 */
export const zGetGlobalpermissiongroupsByIdResponse = zGlobalPermissionGroupResponse;

export const zPatchGlobalpermissiongroupsByIdBody = zGlobalPermissionGroupPatch;

export const zPatchGlobalpermissiongroupsByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchGlobalpermissiongroupsByIdResponse = zGlobalPermissionGroupPostPatchResponse;
