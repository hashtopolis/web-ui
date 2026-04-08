import * as z from 'zod';

export const zUserCreate = z.object({
    data: z.object({
        type: z.literal('user'),
        attributes: z.object({
            name: z.string(),
            email: z.string(),
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

export const zUserResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/users?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/users?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/users?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/users?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/users?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
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
    }),
    relationships: z.object({
        accessGroups: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/users/relationships/accessGroups'),
                related: z.string().default('/api/v2/ui/users/accessGroups')
            }),
            data: z.array(z.object({
                type: z.literal('accessGroup'),
                id: z.int()
            })).optional()
        }),
        globalPermissionGroup: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/users/relationships/globalPermissionGroup'),
                related: z.string().default('/api/v2/ui/users/globalPermissionGroup')
            }),
            data: z.object({
                type: z.literal('globalPermissionGroup'),
                id: z.int()
            }).nullish()
        })
    }).optional(),
    included: z.array(z.union([z.object({
            id: z.int(),
            type: z.literal('globalPermissionGroup'),
            attributes: z.object({
                name: z.string(),
                permissions: z.record(z.string(), z.boolean())
            })
        }), z.object({
            id: z.int(),
            type: z.literal('accessGroup'),
            attributes: z.object({
                groupName: z.string()
            })
        })])).optional()
});

export const zUserPostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
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
});

export const zUserListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/users?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/users?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/users?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/users?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/users?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
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
    })),
    relationships: z.object({
        accessGroups: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/users/relationships/accessGroups'),
                related: z.string().default('/api/v2/ui/users/accessGroups')
            }),
            data: z.array(z.object({
                type: z.literal('accessGroup'),
                id: z.int()
            })).optional()
        }),
        globalPermissionGroup: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/users/relationships/globalPermissionGroup'),
                related: z.string().default('/api/v2/ui/users/globalPermissionGroup')
            }),
            data: z.object({
                type: z.literal('globalPermissionGroup'),
                id: z.int()
            }).nullish()
        })
    }).optional(),
    included: z.array(z.union([z.object({
            id: z.int(),
            type: z.literal('globalPermissionGroup'),
            attributes: z.object({
                name: z.string(),
                permissions: z.record(z.string(), z.boolean())
            })
        }), z.object({
            id: z.int(),
            type: z.literal('accessGroup'),
            attributes: z.object({
                groupName: z.string()
            })
        })])).optional()
});

export const zUserRelationAccessGroups = z.object({
    data: z.array(z.object({
        type: z.literal('accessGroups'),
        id: z.int().default(1)
    }))
});

export const zUserRelationAccessGroupsGetResponse = z.object({
    data: z.array(z.object({
        type: z.literal('accessGroups'),
        id: z.int().default(1)
    }))
});

export const zDeleteUsersData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetUsersData = z.object({
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
export const zGetUsersResponse = zUserListResponse;

export const zPatchUsersData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

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
export const zGetUsersCountResponse = zUserListResponse;

export const zGetUsersByIdByRelationData = z.object({
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
        id: z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
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
export const zPostUsersByIdRelationshipsByRelationResponse = z.void();

export const zDeleteUsersByIdData = z.object({
    body: z.record(z.string(), z.unknown()),
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
        id: z.int().min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' }).max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    }),
    query: z.object({
        include: z.string().optional()
    }).optional()
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
