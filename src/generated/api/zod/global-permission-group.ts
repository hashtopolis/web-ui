import * as z from 'zod';

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

export const zGlobalPermissionGroupResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/globalpermissiongroups?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/globalpermissiongroups?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/globalpermissiongroups?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/globalpermissiongroups?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/globalpermissiongroups?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.object({
    id: z.int(),
    type: z.literal('globalPermissionGroup'),
    attributes: z.object({
      name: z.string(),
      permissions: z.record(z.string(), z.boolean())
    })
  }),
  relationships: z
    .object({
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
    .optional(),
  included: z
    .array(
      z.object({
        id: z.int(),
        type: z.literal('user'),
        attributes: z.object({
          name: z.string(),
          email: z.string(),
          isValid: z.boolean(),
          isComputedPassword: z.boolean(),
          lastLoginDate: z.number(),
          registeredSince: z.number(),
          sessionLifetime: z.int(),
          globalPermissionGroupId: z.int(),
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

export const zGlobalPermissionGroupPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('globalPermissionGroup'),
    attributes: z.object({
      name: z.string(),
      permissions: z.record(z.string(), z.boolean())
    })
  })
});

export const zGlobalPermissionGroupListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/globalpermissiongroups?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/globalpermissiongroups?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/globalpermissiongroups?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/globalpermissiongroups?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/globalpermissiongroups?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('globalPermissionGroup'),
      attributes: z.object({
        name: z.string(),
        permissions: z.record(z.string(), z.boolean())
      })
    })
  ),
  relationships: z
    .object({
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
    .optional(),
  included: z
    .array(
      z.object({
        id: z.int(),
        type: z.literal('user'),
        attributes: z.object({
          name: z.string(),
          email: z.string(),
          isValid: z.boolean(),
          isComputedPassword: z.boolean(),
          lastLoginDate: z.number(),
          registeredSince: z.number(),
          sessionLifetime: z.int(),
          globalPermissionGroupId: z.int(),
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

export const zGlobalPermissionGroupRelationUserMembers = z.object({
  data: z.array(
    z.object({
      type: z.literal('userMembers'),
      id: z.int().default(1)
    })
  )
});

export const zGlobalPermissionGroupRelationUserMembersGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('userMembers'),
      id: z.int().default(1)
    })
  )
});

export const zDeleteGlobalpermissiongroupsData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zGetGlobalpermissiongroupsData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z
    .object({
      'page[after]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[before]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[size]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      filter: z.record(z.string(), z.unknown()).optional(),
      include: z.string().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetGlobalpermissiongroupsResponse = zGlobalPermissionGroupListResponse;

export const zPatchGlobalpermissiongroupsData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zPostGlobalpermissiongroupsData = z.object({
  body: zGlobalPermissionGroupCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostGlobalpermissiongroupsResponse = zGlobalPermissionGroupPostPatchResponse;

export const zGetGlobalpermissiongroupsCountData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z
    .object({
      'page[after]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[before]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[size]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      filter: z.record(z.string(), z.unknown()).optional(),
      include: z.string().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetGlobalpermissiongroupsCountResponse = zGlobalPermissionGroupListResponse;

export const zGetGlobalpermissiongroupsByIdByRelationData = z.object({
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
export const zGetGlobalpermissiongroupsByIdByRelationResponse = zGlobalPermissionGroupRelationUserMembersGetResponse;

export const zDeleteGlobalpermissiongroupsByIdRelationshipsByRelationData = z.object({
  body: zGlobalPermissionGroupRelationUserMembers,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteGlobalpermissiongroupsByIdRelationshipsByRelationResponse = z.void();

export const zGetGlobalpermissiongroupsByIdRelationshipsByRelationData = z.object({
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
export const zGetGlobalpermissiongroupsByIdRelationshipsByRelationResponse = zGlobalPermissionGroupResponse;

export const zPatchGlobalpermissiongroupsByIdRelationshipsByRelationData = z.object({
  body: zGlobalPermissionGroupRelationUserMembers,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchGlobalpermissiongroupsByIdRelationshipsByRelationResponse = z.void();

export const zPostGlobalpermissiongroupsByIdRelationshipsByRelationData = z.object({
  body: z.record(z.string(), z.unknown()),
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully created
 */
export const zPostGlobalpermissiongroupsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteGlobalpermissiongroupsByIdData = z.object({
  body: z.record(z.string(), z.unknown()),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteGlobalpermissiongroupsByIdResponse = z.void();

export const zGetGlobalpermissiongroupsByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.string().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetGlobalpermissiongroupsByIdResponse = zGlobalPermissionGroupResponse;

export const zPatchGlobalpermissiongroupsByIdData = z.object({
  body: zGlobalPermissionGroupPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchGlobalpermissiongroupsByIdResponse = zGlobalPermissionGroupPostPatchResponse;
