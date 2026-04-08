import * as z from 'zod';

export const zApiTokenCreate = z.object({
    data: z.object({
        type: z.literal('apiToken'),
        attributes: z.object({
            scopes: z.array(z.int()),
            startValid: z.number(),
            endValid: z.number(),
            userId: z.int(),
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

export const zApiTokenResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/apiTokens?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/apiTokens?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/apiTokens?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/apiTokens?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/apiTokens?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('apiToken'),
        attributes: z.object({
            startValid: z.number(),
            endValid: z.number(),
            userId: z.int(),
            isRevoked: z.boolean(),
            token: z.string().optional()
        })
    }),
    relationships: z.object({
        user: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/apiTokens/relationships/user'),
                related: z.string().default('/api/v2/ui/apiTokens/user')
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

export const zApiTokenPostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
        id: z.int(),
        type: z.literal('apiToken'),
        attributes: z.object({
            startValid: z.number(),
            endValid: z.number(),
            userId: z.int(),
            isRevoked: z.boolean(),
            token: z.string().optional()
        })
    })
});

export const zApiTokenListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/apiTokens?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/apiTokens?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/apiTokens?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/apiTokens?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/apiTokens?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('apiToken'),
        attributes: z.object({
            startValid: z.number(),
            endValid: z.number(),
            userId: z.int(),
            isRevoked: z.boolean(),
            token: z.string().optional()
        })
    })),
    relationships: z.object({
        user: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/apiTokens/relationships/user'),
                related: z.string().default('/api/v2/ui/apiTokens/user')
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

export const zApiTokenRelationUser = z.object({
    data: z.object({
        type: z.literal('user'),
        id: z.int().default(1)
    })
});

export const zApiTokenRelationUserGetResponse = z.object({
    data: z.object({
        type: z.literal('user'),
        id: z.int().default(1)
    })
});

export const zDeleteApiTokensData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetApiTokensData = z.object({
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
export const zGetApiTokensResponse = zApiTokenListResponse;

export const zPatchApiTokensData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zPostApiTokensData = z.object({
    body: zApiTokenCreate,
    path: z.never().optional(),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostApiTokensResponse = zApiTokenPostPatchResponse;

export const zGetApiTokensCountData = z.object({
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
export const zGetApiTokensCountResponse = zApiTokenListResponse;

export const zGetApiTokensByIdByRelationData = z.object({
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
export const zGetApiTokensByIdByRelationResponse = zApiTokenRelationUserGetResponse;

export const zGetApiTokensByIdRelationshipsByRelationData = z.object({
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
export const zGetApiTokensByIdRelationshipsByRelationResponse = zApiTokenResponse;

export const zPatchApiTokensByIdRelationshipsByRelationData = z.object({
    body: zApiTokenRelationUser,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchApiTokensByIdRelationshipsByRelationResponse = z.void();

export const zDeleteApiTokensByIdData = z.object({
    body: z.record(z.string(), z.unknown()),
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteApiTokensByIdResponse = z.void();

export const zGetApiTokensByIdData = z.object({
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
export const zGetApiTokensByIdResponse = zApiTokenResponse;

export const zPatchApiTokensByIdData = z.object({
    body: zApiTokenPatch,
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchApiTokensByIdResponse = zApiTokenPostPatchResponse;
