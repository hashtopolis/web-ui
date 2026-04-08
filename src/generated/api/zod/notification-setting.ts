import * as z from 'zod';

export const zNotificationSettingCreate = z.object({
    data: z.object({
        type: z.literal('notificationSetting'),
        attributes: z.object({
            actionFilter: z.string(),
            action: z.union([
                z.literal('createNotification'),
                z.literal('setActive'),
                z.literal('deleteNotification')
            ]),
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
            action: z.union([
                z.literal('createNotification'),
                z.literal('setActive'),
                z.literal('deleteNotification')
            ]).optional(),
            isActive: z.boolean().optional(),
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
            ]).optional(),
            receiver: z.string().optional()
        })
    })
});

export const zNotificationSettingResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/notifications?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/notifications?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/notifications?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/notifications?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/notifications?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('notificationSetting'),
        attributes: z.object({
            action: z.union([
                z.literal('createNotification'),
                z.literal('setActive'),
                z.literal('deleteNotification')
            ]),
            objectId: z.int(),
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
            userId: z.int(),
            receiver: z.string(),
            isActive: z.boolean()
        })
    }),
    relationships: z.object({
        user: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/notifications/relationships/user'),
                related: z.string().default('/api/v2/ui/notifications/user')
            }),
            data: z.object({
                type: z.literal('user'),
                id: z.int()
            }).nullish()
        })
    }).optional(),
    included: z.array(z.object({
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
    })).optional()
});

export const zNotificationSettingPostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
        id: z.int(),
        type: z.literal('notificationSetting'),
        attributes: z.object({
            action: z.union([
                z.literal('createNotification'),
                z.literal('setActive'),
                z.literal('deleteNotification')
            ]),
            objectId: z.int(),
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
            userId: z.int(),
            receiver: z.string(),
            isActive: z.boolean()
        })
    })
});

export const zNotificationSettingListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/notifications?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/notifications?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/notifications?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/notifications?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/notifications?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('notificationSetting'),
        attributes: z.object({
            action: z.union([
                z.literal('createNotification'),
                z.literal('setActive'),
                z.literal('deleteNotification')
            ]),
            objectId: z.int(),
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
            userId: z.int(),
            receiver: z.string(),
            isActive: z.boolean()
        })
    })),
    relationships: z.object({
        user: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/notifications/relationships/user'),
                related: z.string().default('/api/v2/ui/notifications/user')
            }),
            data: z.object({
                type: z.literal('user'),
                id: z.int()
            }).nullish()
        })
    }).optional(),
    included: z.array(z.object({
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
    })).optional()
});

export const zNotificationSettingRelationUser = z.object({
    data: z.object({
        type: z.literal('user'),
        id: z.int().default(1)
    })
});

export const zNotificationSettingRelationUserGetResponse = z.object({
    data: z.object({
        type: z.literal('user'),
        id: z.int().default(1)
    })
});

export const zDeleteNotificationsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetNotificationsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.object({
        'page[after]': z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }).optional(),
        'page[before]': z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }).optional(),
        'page[size]': z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }).optional(),
        filter: z.record(z.string(), z.unknown()).optional(),
        include: z.string().optional()
    }).optional()
});

/**
 * successful operation
 */
export const zGetNotificationsResponse = zNotificationSettingListResponse;

export const zPatchNotificationsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

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
    query: z.object({
        'page[after]': z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }).optional(),
        'page[before]': z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }).optional(),
        'page[size]': z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }).optional(),
        filter: z.record(z.string(), z.unknown()).optional(),
        include: z.string().optional()
    }).optional()
});

/**
 * successful operation
 */
export const zGetNotificationsCountResponse = zNotificationSettingListResponse;

export const zGetNotificationsByIdByRelationData = z.object({
    body: z.never().optional(),
    path: z.object({
        id: z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
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
        id: z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
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
    body: z.record(z.string(), z.unknown()),
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
        id: z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    }),
    query: z.object({
        include: z.string().optional()
    }).optional()
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
