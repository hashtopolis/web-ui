import * as z from 'zod';

export const zNotificationSettingCreate = z.object({
  data: z.object({
    type: z.literal('notificationSetting'),
    attributes: z.object({
      actionFilter: z.string(),
      action: z.union([z.literal('createNotification'), z.literal('setActive'), z.literal('deleteNotification')]),
      notification: z.union([
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
      receiver: z.string()
    })
  })
});

export const zNotificationSettingPatch = z.object({
  data: z.object({
    type: z.literal('notificationSetting'),
    attributes: z.object({
      action: z
        .union([z.literal('createNotification'), z.literal('setActive'), z.literal('deleteNotification')])
        .optional(),
      isActive: z.boolean().optional(),
      notification: z
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
      receiver: z.string().optional()
    })
  })
});

export const zNotificationSettingPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('notificationSetting'),
      attributes: z.object({
        action: z
          .union([z.literal('createNotification'), z.literal('setActive'), z.literal('deleteNotification')])
          .optional(),
        isActive: z.boolean().optional(),
        notification: z
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
        receiver: z.string().optional()
      })
    })
  )
});

export const zNotificationSettingDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
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
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('notificationSetting'),
    attributes: z.object({
      action: z.union([z.literal('createNotification'), z.literal('setActive'), z.literal('deleteNotification')]),
      objectId: z.int().nullable(),
      notification: z.union([
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
      userId: z.string(),
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

export const zNotificationSettingPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/notifications/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('notificationSetting'),
    attributes: z.object({
      action: z.union([z.literal('createNotification'), z.literal('setActive'), z.literal('deleteNotification')]),
      objectId: z.int().nullable(),
      notification: z.union([
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
      userId: z.string(),
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
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('notificationSetting'),
      attributes: z.object({
        action: z.union([z.literal('createNotification'), z.literal('setActive'), z.literal('deleteNotification')]),
        objectId: z.int().nullable(),
        notification: z.union([
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
        userId: z.string(),
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
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zNotificationSettingRelationUserGetResponse = z.object({
  data: z.object({
    type: z.literal('user'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zDeleteNotificationsBody = zNotificationSettingDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteNotificationsResponse = z.void();

export const zGetNotificationsQuery = z.object({
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
export const zGetNotificationsResponse = zNotificationSettingListResponse;

export const zPatchNotificationsBody = zNotificationSettingPatchMultiple;

/**
 * successfully updated
 */
export const zPatchNotificationsResponse = z.void();

export const zPostNotificationsBody = zNotificationSettingCreate;

/**
 * successful operation
 */
export const zPostNotificationsResponse = zNotificationSettingPostPatchResponse;

export const zGetNotificationsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetNotificationsCountResponse = zNotificationSettingCountResponse;

export const zGetNotificationsByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetNotificationsByIdByRelationResponse = zNotificationSettingRelationUserGetResponse;

export const zGetNotificationsByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetNotificationsByIdRelationshipsByRelationResponse = zNotificationSettingResponse;

export const zPatchNotificationsByIdRelationshipsByRelationBody = zNotificationSettingRelationUser;

export const zPatchNotificationsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchNotificationsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteNotificationsByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteNotificationsByIdResponse = z.void();

export const zGetNotificationsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetNotificationsByIdQuery = z.object({
  include: z.array(z.enum(['user'])).optional()
});

/**
 * successful operation
 */
export const zGetNotificationsByIdResponse = zNotificationSettingResponse;

export const zPatchNotificationsByIdBody = zNotificationSettingPatch;

export const zPatchNotificationsByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchNotificationsByIdResponse = zNotificationSettingPostPatchResponse;
