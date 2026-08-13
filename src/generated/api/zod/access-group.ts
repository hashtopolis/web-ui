import * as z from 'zod';

export const zAccessGroupCreate = z.object({
  data: z.object({
    type: z.literal('accessGroup'),
    attributes: z.object({
      groupName: z.string()
    })
  })
});

export const zAccessGroupPatch = z.object({
  data: z.object({
    type: z.literal('accessGroup'),
    attributes: z.object({
      groupName: z.string().optional()
    })
  })
});

export const zAccessGroupPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('accessGroup'),
      attributes: z.object({
        groupName: z.string().optional()
      })
    })
  )
});

export const zAccessGroupDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('accessGroup')
    })
  )
});

export const zAccessGroupResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/accessgroups/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('accessGroup'),
    attributes: z.object({
      groupName: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/accessgroups/1')
    }),
    relationships: z.object({
      agentMembers: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/accessgroups/relationships/agentMembers'),
          related: z.string().default('/api/v2/ui/accessgroups/agentMembers')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agent'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      }),
      userMembers: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/accessgroups/relationships/userMembers'),
          related: z.string().default('/api/v2/ui/accessgroups/userMembers')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('user'),
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
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agent'),
          attributes: z.object({
            agentName: z.string(),
            uid: z.string(),
            os: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            devices: z.string(),
            cmdPars: z.string(),
            ignoreErrors: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            isActive: z.boolean(),
            isTrusted: z.boolean(),
            token: z.string(),
            lastAct: z.string(),
            lastTime: z.number(),
            lastIp: z.string(),
            userId: z.string().nullable(),
            cpuOnly: z.boolean(),
            clientSignature: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zAccessGroupSingleResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/accessgroups/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('accessGroup'),
    attributes: z.object({
      groupName: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/accessgroups/1')
    }),
    relationships: z.object({
      agentMembers: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/accessgroups/relationships/agentMembers'),
          related: z.string().default('/api/v2/ui/accessgroups/agentMembers')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agent'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      }),
      userMembers: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/accessgroups/relationships/userMembers'),
          related: z.string().default('/api/v2/ui/accessgroups/userMembers')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('user'),
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
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agent'),
          attributes: z.object({
            agentName: z.string(),
            uid: z.string(),
            os: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            devices: z.string(),
            cmdPars: z.string(),
            ignoreErrors: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            isActive: z.boolean(),
            isTrusted: z.boolean(),
            token: z.string(),
            lastAct: z.string(),
            lastTime: z.number(),
            lastIp: z.string(),
            userId: z.string().nullable(),
            cpuOnly: z.boolean(),
            clientSignature: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zAccessGroupPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/accessgroups/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('accessGroup'),
    attributes: z.object({
      groupName: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/accessgroups/1')
    }),
    relationships: z.object({
      agentMembers: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/accessgroups/relationships/agentMembers'),
          related: z.string().default('/api/v2/ui/accessgroups/agentMembers')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('agent'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      }),
      userMembers: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/accessgroups/relationships/userMembers'),
          related: z.string().default('/api/v2/ui/accessgroups/userMembers')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('user'),
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
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agent'),
          attributes: z.object({
            agentName: z.string(),
            uid: z.string(),
            os: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            devices: z.string(),
            cmdPars: z.string(),
            ignoreErrors: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            isActive: z.boolean(),
            isTrusted: z.boolean(),
            token: z.string(),
            lastAct: z.string(),
            lastTime: z.number(),
            lastIp: z.string(),
            userId: z.string().nullable(),
            cpuOnly: z.boolean(),
            clientSignature: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zAccessGroupListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/accessgroups?page[size]=25'),
    first: z.string().default('/api/v2/ui/accessgroups?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/accessgroups?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/accessgroups?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/accessgroups?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('accessGroup'),
      attributes: z.object({
        groupName: z.string()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/accessgroups/1')
      }),
      relationships: z.object({
        agentMembers: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/accessgroups/relationships/agentMembers'),
            related: z.string().default('/api/v2/ui/accessgroups/agentMembers')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('agent'),
                id: z.string().regex(/^[0-9]+$/)
              })
            )
            .optional()
        }),
        userMembers: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/accessgroups/relationships/userMembers'),
            related: z.string().default('/api/v2/ui/accessgroups/userMembers')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('user'),
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
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('agent'),
          attributes: z.object({
            agentName: z.string(),
            uid: z.string(),
            os: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            devices: z.string(),
            cmdPars: z.string(),
            ignoreErrors: z.union([z.literal(0), z.literal(1), z.literal(2)]),
            isActive: z.boolean(),
            isTrusted: z.boolean(),
            token: z.string(),
            lastAct: z.string(),
            lastTime: z.number(),
            lastIp: z.string(),
            userId: z.string().nullable(),
            cpuOnly: z.boolean(),
            clientSignature: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zAccessGroupCountResponse = z.object({
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

export const zAccessGroupRelationAgentMembers = z.object({
  data: z.array(
    z.object({
      type: z.literal('agentMembers'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zAccessGroupRelationAgentMembersGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('agentMembers'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zDeleteAccessgroupsBody = zAccessGroupDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteAccessgroupsResponse = z.void();

export const zGetAccessgroupsQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['userMembers', 'agentMembers'])).optional()
});

/**
 * successful operation
 */
export const zGetAccessgroupsResponse = zAccessGroupListResponse;

export const zPatchAccessgroupsBody = zAccessGroupPatchMultiple;

/**
 * successfully updated
 */
export const zPatchAccessgroupsResponse = z.void();

export const zPostAccessgroupsBody = zAccessGroupCreate;

/**
 * successful operation
 */
export const zPostAccessgroupsResponse = zAccessGroupPostPatchResponse;

export const zGetAccessgroupsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetAccessgroupsCountResponse = zAccessGroupCountResponse;

export const zGetAccessgroupsByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetAccessgroupsByIdByRelationResponse = zAccessGroupRelationAgentMembersGetResponse;

export const zDeleteAccessgroupsByIdRelationshipsByRelationBody = zAccessGroupRelationAgentMembers;

export const zDeleteAccessgroupsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully deleted
 */
export const zDeleteAccessgroupsByIdRelationshipsByRelationResponse = z.void();

export const zGetAccessgroupsByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetAccessgroupsByIdRelationshipsByRelationResponse = zAccessGroupResponse;

export const zPatchAccessgroupsByIdRelationshipsByRelationBody = zAccessGroupRelationAgentMembers;

export const zPatchAccessgroupsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchAccessgroupsByIdRelationshipsByRelationResponse = z.void();

export const zPostAccessgroupsByIdRelationshipsByRelationBody = zAccessGroupRelationAgentMembers;

export const zPostAccessgroupsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully created
 */
export const zPostAccessgroupsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteAccessgroupsByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteAccessgroupsByIdResponse = z.void();

export const zGetAccessgroupsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetAccessgroupsByIdQuery = z.object({
  include: z.array(z.enum(['userMembers', 'agentMembers'])).optional()
});

/**
 * successful operation
 */
export const zGetAccessgroupsByIdResponse = zAccessGroupResponse;

export const zPatchAccessgroupsByIdBody = zAccessGroupPatch;

export const zPatchAccessgroupsByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchAccessgroupsByIdResponse = zAccessGroupPostPatchResponse;
