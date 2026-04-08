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

export const zAccessGroupResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/accessgroups?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/accessgroups?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/accessgroups?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/accessgroups?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/accessgroups?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('accessGroup'),
        attributes: z.object({
            groupName: z.string()
        })
    }),
    relationships: z.object({
        agentMembers: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/accessgroups/relationships/agentMembers'),
                related: z.string().default('/api/v2/ui/accessgroups/agentMembers')
            }),
            data: z.array(z.object({
                type: z.literal('agent'),
                id: z.int()
            })).optional()
        }),
        userMembers: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/accessgroups/relationships/userMembers'),
                related: z.string().default('/api/v2/ui/accessgroups/userMembers')
            }),
            data: z.array(z.object({
                type: z.literal('user'),
                id: z.int()
            })).optional()
        })
    }).optional(),
    included: z.array(z.union([z.object({
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
        }), z.object({
            id: z.int(),
            type: z.literal('agent'),
            attributes: z.object({
                agentName: z.string(),
                uid: z.string(),
                os: z.union([
                    z.literal(0),
                    z.literal(1),
                    z.literal(2)
                ]),
                devices: z.string(),
                cmdPars: z.string(),
                ignoreErrors: z.union([
                    z.literal(0),
                    z.literal(1),
                    z.literal(2)
                ]),
                isActive: z.boolean(),
                isTrusted: z.boolean(),
                token: z.string(),
                lastAct: z.string(),
                lastTime: z.number(),
                lastIp: z.string(),
                userId: z.int().nullable(),
                cpuOnly: z.boolean(),
                clientSignature: z.string()
            })
        })])).optional()
});

export const zAccessGroupPostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
        id: z.int(),
        type: z.literal('accessGroup'),
        attributes: z.object({
            groupName: z.string()
        })
    })
});

export const zAccessGroupListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/accessgroups?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/accessgroups?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/accessgroups?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/accessgroups?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/accessgroups?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('accessGroup'),
        attributes: z.object({
            groupName: z.string()
        })
    })),
    relationships: z.object({
        agentMembers: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/accessgroups/relationships/agentMembers'),
                related: z.string().default('/api/v2/ui/accessgroups/agentMembers')
            }),
            data: z.array(z.object({
                type: z.literal('agent'),
                id: z.int()
            })).optional()
        }),
        userMembers: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/accessgroups/relationships/userMembers'),
                related: z.string().default('/api/v2/ui/accessgroups/userMembers')
            }),
            data: z.array(z.object({
                type: z.literal('user'),
                id: z.int()
            })).optional()
        })
    }).optional(),
    included: z.array(z.union([z.object({
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
        }), z.object({
            id: z.int(),
            type: z.literal('agent'),
            attributes: z.object({
                agentName: z.string(),
                uid: z.string(),
                os: z.union([
                    z.literal(0),
                    z.literal(1),
                    z.literal(2)
                ]),
                devices: z.string(),
                cmdPars: z.string(),
                ignoreErrors: z.union([
                    z.literal(0),
                    z.literal(1),
                    z.literal(2)
                ]),
                isActive: z.boolean(),
                isTrusted: z.boolean(),
                token: z.string(),
                lastAct: z.string(),
                lastTime: z.number(),
                lastIp: z.string(),
                userId: z.int().nullable(),
                cpuOnly: z.boolean(),
                clientSignature: z.string()
            })
        })])).optional()
});

export const zAccessGroupRelationAgentMembers = z.object({
    data: z.array(z.object({
        type: z.literal('agentMembers'),
        id: z.int().default(1)
    }))
});

export const zAccessGroupRelationAgentMembersGetResponse = z.object({
    data: z.array(z.object({
        type: z.literal('agentMembers'),
        id: z.int().default(1)
    }))
});

export const zDeleteAccessgroupsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetAccessgroupsData = z.object({
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
export const zGetAccessgroupsResponse = zAccessGroupListResponse;

export const zPatchAccessgroupsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zPostAccessgroupsData = z.object({
    body: zAccessGroupCreate,
    path: z.never().optional(),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostAccessgroupsResponse = zAccessGroupPostPatchResponse;

export const zGetAccessgroupsCountData = z.object({
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
export const zGetAccessgroupsCountResponse = zAccessGroupListResponse;

export const zGetAccessgroupsByIdByRelationData = z.object({
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
export const zGetAccessgroupsByIdByRelationResponse = zAccessGroupRelationAgentMembersGetResponse;

export const zDeleteAccessgroupsByIdRelationshipsByRelationData = z.object({
    body: zAccessGroupRelationAgentMembers,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteAccessgroupsByIdRelationshipsByRelationResponse = z.void();

export const zGetAccessgroupsByIdRelationshipsByRelationData = z.object({
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
export const zGetAccessgroupsByIdRelationshipsByRelationResponse = zAccessGroupResponse;

export const zPatchAccessgroupsByIdRelationshipsByRelationData = z.object({
    body: zAccessGroupRelationAgentMembers,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchAccessgroupsByIdRelationshipsByRelationResponse = z.void();

export const zPostAccessgroupsByIdRelationshipsByRelationData = z.object({
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
export const zPostAccessgroupsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteAccessgroupsByIdData = z.object({
    body: z.record(z.string(), z.unknown()),
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteAccessgroupsByIdResponse = z.void();

export const zGetAccessgroupsByIdData = z.object({
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
export const zGetAccessgroupsByIdResponse = zAccessGroupResponse;

export const zPatchAccessgroupsByIdData = z.object({
    body: zAccessGroupPatch,
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchAccessgroupsByIdResponse = zAccessGroupPostPatchResponse;
