import * as z from 'zod';

export const zNotificationSettingCreate = z.object({
  data: z.object({
    type: z.literal('notificationSetting'),
    attributes: z.object({
      actionFilter: z.string(),
      action: z.union([
        z.literal('taskComplete'),
        z.literal('agentError'),
        z.literal('ownAgentError'),
        z.literal('logError'),
        z.literal('newTask'),
        z.literal('newHashlist'),
        z.literal('hashlistAllCracked'),
        z.literal('hashlistCrackedHash'),
        z.literal('userCreated'),
        z.literal('userDeleted'),
        z.literal('userLoginFailed'),
        z.literal('logWarn'),
        z.literal('logFatal'),
        z.literal('newAgent'),
        z.literal('deleteTask'),
        z.literal('deleteHashlist'),
        z.literal('deleteAgent')
      ]),
      notification: z.string(),
      receiver: z.string()
    })
  })
});

export const zNotificationSettingPatch = z.object({
  data: z.object({
    type: z.literal('notificationSetting'),
    attributes: z.object({
      action: z
        .union([
          z.literal('taskComplete'),
          z.literal('agentError'),
          z.literal('ownAgentError'),
          z.literal('logError'),
          z.literal('newTask'),
          z.literal('newHashlist'),
          z.literal('hashlistAllCracked'),
          z.literal('hashlistCrackedHash'),
          z.literal('userCreated'),
          z.literal('userDeleted'),
          z.literal('userLoginFailed'),
          z.literal('logWarn'),
          z.literal('logFatal'),
          z.literal('newAgent'),
          z.literal('deleteTask'),
          z.literal('deleteHashlist'),
          z.literal('deleteAgent')
        ])
        .optional(),
      isActive: z.boolean().optional(),
      notification: z.string().optional(),
      receiver: z.string().optional()
    })
  })
});

export const zNotificationSettingPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('notificationSetting'),
      attributes: z.object({
        action: z
          .union([
            z.literal('taskComplete'),
            z.literal('agentError'),
            z.literal('ownAgentError'),
            z.literal('logError'),
            z.literal('newTask'),
            z.literal('newHashlist'),
            z.literal('hashlistAllCracked'),
            z.literal('hashlistCrackedHash'),
            z.literal('userCreated'),
            z.literal('userDeleted'),
            z.literal('userLoginFailed'),
            z.literal('logWarn'),
            z.literal('logFatal'),
            z.literal('newAgent'),
            z.literal('deleteTask'),
            z.literal('deleteHashlist'),
            z.literal('deleteAgent')
          ])
          .optional(),
        isActive: z.boolean().optional(),
        notification: z.string().optional(),
        receiver: z.string().optional()
      })
    })
  )
});

export const zNotificationSettingDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('notificationSetting')
    })
  )
});

export const zNotificationSettingResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/notifications/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('notificationSetting'),
    attributes: z.object({
      action: z.union([
        z.literal('taskComplete'),
        z.literal('agentError'),
        z.literal('ownAgentError'),
        z.literal('logError'),
        z.literal('newTask'),
        z.literal('newHashlist'),
        z.literal('hashlistAllCracked'),
        z.literal('hashlistCrackedHash'),
        z.literal('userCreated'),
        z.literal('userDeleted'),
        z.literal('userLoginFailed'),
        z.literal('logWarn'),
        z.literal('logFatal'),
        z.literal('newAgent'),
        z.literal('deleteTask'),
        z.literal('deleteHashlist'),
        z.literal('deleteAgent')
      ]),
      objectId: z.int().nullable(),
      notification: z.string(),
      userId: z.int(),
      receiver: z.string(),
      isActive: z.boolean()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/notifications/1')
    }),
    relationships: z.object({
      user: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/notifications/relationships/user'),
          related: z.string().default('/api/v2/ui/notifications/user')
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

export const zNotificationSettingPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/notifications/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('notificationSetting'),
    attributes: z.object({
      action: z.union([
        z.literal('taskComplete'),
        z.literal('agentError'),
        z.literal('ownAgentError'),
        z.literal('logError'),
        z.literal('newTask'),
        z.literal('newHashlist'),
        z.literal('hashlistAllCracked'),
        z.literal('hashlistCrackedHash'),
        z.literal('userCreated'),
        z.literal('userDeleted'),
        z.literal('userLoginFailed'),
        z.literal('logWarn'),
        z.literal('logFatal'),
        z.literal('newAgent'),
        z.literal('deleteTask'),
        z.literal('deleteHashlist'),
        z.literal('deleteAgent')
      ]),
      objectId: z.int().nullable(),
      notification: z.string(),
      userId: z.int(),
      receiver: z.string(),
      isActive: z.boolean()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/notifications/1')
    }),
    relationships: z.object({
      user: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/notifications/relationships/user'),
          related: z.string().default('/api/v2/ui/notifications/user')
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

export const zNotificationSettingListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/notifications?page[size]=25'),
    first: z.string().default('/api/v2/ui/notifications?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/notifications?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/notifications?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/notifications?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('notificationSetting'),
      attributes: z.object({
        action: z.union([
          z.literal('taskComplete'),
          z.literal('agentError'),
          z.literal('ownAgentError'),
          z.literal('logError'),
          z.literal('newTask'),
          z.literal('newHashlist'),
          z.literal('hashlistAllCracked'),
          z.literal('hashlistCrackedHash'),
          z.literal('userCreated'),
          z.literal('userDeleted'),
          z.literal('userLoginFailed'),
          z.literal('logWarn'),
          z.literal('logFatal'),
          z.literal('newAgent'),
          z.literal('deleteTask'),
          z.literal('deleteHashlist'),
          z.literal('deleteAgent')
        ]),
        objectId: z.int().nullable(),
        notification: z.string(),
        userId: z.int(),
        receiver: z.string(),
        isActive: z.boolean()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/notifications/1')
      }),
      relationships: z.object({
        user: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/notifications/relationships/user'),
            related: z.string().default('/api/v2/ui/notifications/user')
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

export const zNotificationSettingCountResponse = z.object({
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

export const zNotificationSettingRelationUser = z.object({
  data: z.object({
    type: z.literal('user'),
    id: z.int()
  })
});

export const zNotificationSettingRelationUserGetResponse = z.object({
  data: z.object({
    type: z.literal('user'),
    id: z.int()
  })
});

export const zDeleteNotificationsData = z.object({
  body: zNotificationSettingDeleteMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteNotificationsResponse = z.void();

export const zGetNotificationsData = z.object({
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
export const zGetNotificationsResponse = zNotificationSettingListResponse;

export const zPatchNotificationsData = z.object({
  body: zNotificationSettingPatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchNotificationsResponse = z.void();

export const zPostNotificationsData = z.object({
  body: zNotificationSettingCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostNotificationsResponse = zNotificationSettingPostPatchResponse;

export const zGetNotificationsCountData = z.object({
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
export const zGetNotificationsCountResponse = zNotificationSettingCountResponse;

export const zGetNotificationsByIdByRelationData = z.object({
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
export const zGetNotificationsByIdByRelationResponse = zNotificationSettingRelationUserGetResponse;

export const zGetNotificationsByIdRelationshipsByRelationData = z.object({
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
export const zGetNotificationsByIdRelationshipsByRelationResponse = zNotificationSettingResponse;

export const zPatchNotificationsByIdRelationshipsByRelationData = z.object({
  body: zNotificationSettingRelationUser,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchNotificationsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteNotificationsByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteNotificationsByIdResponse = z.void();

export const zGetNotificationsByIdData = z.object({
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
export const zGetNotificationsByIdResponse = zNotificationSettingResponse;

export const zPatchNotificationsByIdData = z.object({
  body: zNotificationSettingPatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchNotificationsByIdResponse = zNotificationSettingPostPatchResponse;
