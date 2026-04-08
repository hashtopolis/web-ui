import * as z from 'zod';

export const zHashlistCreate = z.object({
    data: z.object({
        type: z.literal('hashlist'),
        attributes: z.object({
            hashlistSeperator: z.string().nullish(),
            sourceType: z.string(),
            sourceData: z.string(),
            name: z.string(),
            format: z.union([
                z.literal(0),
                z.literal(1),
                z.literal(2),
                z.literal(3)
            ]),
            hashTypeId: z.int(),
            hashCount: z.int(),
            separator: z.string().nullish(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.int(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
        })
    })
});

export const zHashlistPatch = z.object({
    data: z.object({
        type: z.literal('hashlist'),
        attributes: z.object({
            accessGroupId: z.int().optional(),
            isArchived: z.boolean().optional(),
            isSecret: z.boolean().optional(),
            name: z.string().optional(),
            notes: z.string().optional()
        })
    })
});

export const zHashlistResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/hashlists?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/hashlists?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/hashlists?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/hashlists?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/hashlists?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('hashlist'),
        attributes: z.object({
            name: z.string(),
            format: z.union([
                z.literal(0),
                z.literal(1),
                z.literal(2),
                z.literal(3)
            ]),
            hashTypeId: z.int(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.int(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
        })
    }),
    relationships: z.object({
        accessGroup: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/accessGroup'),
                related: z.string().default('/api/v2/ui/hashlists/accessGroup')
            }),
            data: z.object({
                type: z.literal('accessGroup'),
                id: z.int()
            }).nullish()
        }),
        hashType: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/hashType'),
                related: z.string().default('/api/v2/ui/hashlists/hashType')
            }),
            data: z.object({
                type: z.literal('hashType'),
                id: z.int()
            }).nullish()
        }),
        hashes: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/hashes'),
                related: z.string().default('/api/v2/ui/hashlists/hashes')
            }),
            data: z.array(z.object({
                type: z.literal('hash'),
                id: z.int()
            })).optional()
        }),
        hashlists: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/hashlists'),
                related: z.string().default('/api/v2/ui/hashlists/hashlists')
            }),
            data: z.array(z.object({
                type: z.literal('hashlist'),
                id: z.int()
            })).optional()
        }),
        tasks: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/tasks'),
                related: z.string().default('/api/v2/ui/hashlists/tasks')
            }),
            data: z.array(z.object({
                type: z.literal('task'),
                id: z.int()
            })).optional()
        })
    }).optional(),
    included: z.array(z.union([
        z.object({
            id: z.int(),
            type: z.literal('accessGroup'),
            attributes: z.object({
                groupName: z.string()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('hashType'),
            attributes: z.object({
                description: z.string(),
                isSalted: z.boolean(),
                isSlowHash: z.boolean()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('hash'),
            attributes: z.object({
                hashlistId: z.int(),
                hash: z.string(),
                salt: z.string(),
                plaintext: z.string(),
                timeCracked: z.number(),
                chunkId: z.int(),
                isCracked: z.boolean(),
                crackPos: z.number()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('hashlist'),
            attributes: z.object({
                name: z.string(),
                format: z.union([
                    z.literal(0),
                    z.literal(1),
                    z.literal(2),
                    z.literal(3)
                ]),
                hashTypeId: z.int(),
                hashCount: z.int(),
                separator: z.string().nullable(),
                cracked: z.int(),
                isSecret: z.boolean(),
                isHexSalt: z.boolean(),
                isSalted: z.boolean(),
                accessGroupId: z.int(),
                notes: z.string(),
                useBrain: z.boolean(),
                brainFeatures: z.int(),
                isArchived: z.boolean()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('task'),
            attributes: z.object({
                taskName: z.string(),
                attackCmd: z.string(),
                chunkTime: z.int(),
                statusTimer: z.int(),
                keyspace: z.number(),
                keyspaceProgress: z.number(),
                priority: z.int(),
                maxAgents: z.int(),
                color: z.string().nullable(),
                isSmall: z.boolean(),
                isCpuTask: z.boolean(),
                useNewBench: z.boolean(),
                skipKeyspace: z.number(),
                crackerBinaryId: z.int(),
                crackerBinaryTypeId: z.int().nullable(),
                taskWrapperId: z.int(),
                isArchived: z.boolean(),
                notes: z.string(),
                staticChunks: z.int(),
                chunkSize: z.number(),
                forcePipe: z.boolean(),
                preprocessorId: z.int(),
                preprocessorCommand: z.string()
            })
        })
    ])).optional()
});

export const zHashlistSingleResponse = z.object({
    data: z.object({
        id: z.int(),
        type: z.literal('hashlist'),
        attributes: z.object({
            name: z.string(),
            format: z.union([
                z.literal(0),
                z.literal(1),
                z.literal(2),
                z.literal(3)
            ]),
            hashTypeId: z.int(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.int(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
        })
    }),
    relationships: z.object({
        accessGroup: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/accessGroup'),
                related: z.string().default('/api/v2/ui/hashlists/accessGroup')
            }),
            data: z.object({
                type: z.literal('accessGroup'),
                id: z.int()
            }).nullish()
        }),
        hashType: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/hashType'),
                related: z.string().default('/api/v2/ui/hashlists/hashType')
            }),
            data: z.object({
                type: z.literal('hashType'),
                id: z.int()
            }).nullish()
        }),
        hashes: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/hashes'),
                related: z.string().default('/api/v2/ui/hashlists/hashes')
            }),
            data: z.array(z.object({
                type: z.literal('hash'),
                id: z.int()
            })).optional()
        }),
        hashlists: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/hashlists'),
                related: z.string().default('/api/v2/ui/hashlists/hashlists')
            }),
            data: z.array(z.object({
                type: z.literal('hashlist'),
                id: z.int()
            })).optional()
        }),
        tasks: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/tasks'),
                related: z.string().default('/api/v2/ui/hashlists/tasks')
            }),
            data: z.array(z.object({
                type: z.literal('task'),
                id: z.int()
            })).optional()
        })
    }).optional(),
    included: z.array(z.union([
        z.object({
            id: z.int(),
            type: z.literal('accessGroup'),
            attributes: z.object({
                groupName: z.string()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('hashType'),
            attributes: z.object({
                description: z.string(),
                isSalted: z.boolean(),
                isSlowHash: z.boolean()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('hash'),
            attributes: z.object({
                hashlistId: z.int(),
                hash: z.string(),
                salt: z.string(),
                plaintext: z.string(),
                timeCracked: z.number(),
                chunkId: z.int(),
                isCracked: z.boolean(),
                crackPos: z.number()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('hashlist'),
            attributes: z.object({
                name: z.string(),
                format: z.union([
                    z.literal(0),
                    z.literal(1),
                    z.literal(2),
                    z.literal(3)
                ]),
                hashTypeId: z.int(),
                hashCount: z.int(),
                separator: z.string().nullable(),
                cracked: z.int(),
                isSecret: z.boolean(),
                isHexSalt: z.boolean(),
                isSalted: z.boolean(),
                accessGroupId: z.int(),
                notes: z.string(),
                useBrain: z.boolean(),
                brainFeatures: z.int(),
                isArchived: z.boolean()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('task'),
            attributes: z.object({
                taskName: z.string(),
                attackCmd: z.string(),
                chunkTime: z.int(),
                statusTimer: z.int(),
                keyspace: z.number(),
                keyspaceProgress: z.number(),
                priority: z.int(),
                maxAgents: z.int(),
                color: z.string().nullable(),
                isSmall: z.boolean(),
                isCpuTask: z.boolean(),
                useNewBench: z.boolean(),
                skipKeyspace: z.number(),
                crackerBinaryId: z.int(),
                crackerBinaryTypeId: z.int().nullable(),
                taskWrapperId: z.int(),
                isArchived: z.boolean(),
                notes: z.string(),
                staticChunks: z.int(),
                chunkSize: z.number(),
                forcePipe: z.boolean(),
                preprocessorId: z.int(),
                preprocessorCommand: z.string()
            })
        })
    ])).optional()
});

export const zHashlistPostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
        id: z.int(),
        type: z.literal('hashlist'),
        attributes: z.object({
            name: z.string(),
            format: z.union([
                z.literal(0),
                z.literal(1),
                z.literal(2),
                z.literal(3)
            ]),
            hashTypeId: z.int(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.int(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
        })
    })
});

export const zHashlistListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/hashlists?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/hashlists?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/hashlists?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/hashlists?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/hashlists?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('hashlist'),
        attributes: z.object({
            name: z.string(),
            format: z.union([
                z.literal(0),
                z.literal(1),
                z.literal(2),
                z.literal(3)
            ]),
            hashTypeId: z.int(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.int(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
        })
    })),
    relationships: z.object({
        accessGroup: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/accessGroup'),
                related: z.string().default('/api/v2/ui/hashlists/accessGroup')
            }),
            data: z.object({
                type: z.literal('accessGroup'),
                id: z.int()
            }).nullish()
        }),
        hashType: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/hashType'),
                related: z.string().default('/api/v2/ui/hashlists/hashType')
            }),
            data: z.object({
                type: z.literal('hashType'),
                id: z.int()
            }).nullish()
        }),
        hashes: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/hashes'),
                related: z.string().default('/api/v2/ui/hashlists/hashes')
            }),
            data: z.array(z.object({
                type: z.literal('hash'),
                id: z.int()
            })).optional()
        }),
        hashlists: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/hashlists'),
                related: z.string().default('/api/v2/ui/hashlists/hashlists')
            }),
            data: z.array(z.object({
                type: z.literal('hashlist'),
                id: z.int()
            })).optional()
        }),
        tasks: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/hashlists/relationships/tasks'),
                related: z.string().default('/api/v2/ui/hashlists/tasks')
            }),
            data: z.array(z.object({
                type: z.literal('task'),
                id: z.int()
            })).optional()
        })
    }).optional(),
    included: z.array(z.union([
        z.object({
            id: z.int(),
            type: z.literal('accessGroup'),
            attributes: z.object({
                groupName: z.string()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('hashType'),
            attributes: z.object({
                description: z.string(),
                isSalted: z.boolean(),
                isSlowHash: z.boolean()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('hash'),
            attributes: z.object({
                hashlistId: z.int(),
                hash: z.string(),
                salt: z.string(),
                plaintext: z.string(),
                timeCracked: z.number(),
                chunkId: z.int(),
                isCracked: z.boolean(),
                crackPos: z.number()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('hashlist'),
            attributes: z.object({
                name: z.string(),
                format: z.union([
                    z.literal(0),
                    z.literal(1),
                    z.literal(2),
                    z.literal(3)
                ]),
                hashTypeId: z.int(),
                hashCount: z.int(),
                separator: z.string().nullable(),
                cracked: z.int(),
                isSecret: z.boolean(),
                isHexSalt: z.boolean(),
                isSalted: z.boolean(),
                accessGroupId: z.int(),
                notes: z.string(),
                useBrain: z.boolean(),
                brainFeatures: z.int(),
                isArchived: z.boolean()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('task'),
            attributes: z.object({
                taskName: z.string(),
                attackCmd: z.string(),
                chunkTime: z.int(),
                statusTimer: z.int(),
                keyspace: z.number(),
                keyspaceProgress: z.number(),
                priority: z.int(),
                maxAgents: z.int(),
                color: z.string().nullable(),
                isSmall: z.boolean(),
                isCpuTask: z.boolean(),
                useNewBench: z.boolean(),
                skipKeyspace: z.number(),
                crackerBinaryId: z.int(),
                crackerBinaryTypeId: z.int().nullable(),
                taskWrapperId: z.int(),
                isArchived: z.boolean(),
                notes: z.string(),
                staticChunks: z.int(),
                chunkSize: z.number(),
                forcePipe: z.boolean(),
                preprocessorId: z.int(),
                preprocessorCommand: z.string()
            })
        })
    ])).optional()
});

export const zHashlistRelationTasks = z.object({
    data: z.array(z.object({
        type: z.literal('tasks'),
        id: z.int().default(1)
    }))
});

export const zHashlistRelationTasksGetResponse = z.object({
    data: z.array(z.object({
        type: z.literal('tasks'),
        id: z.int().default(1)
    }))
});

export const zDeleteHashlistsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetHashlistsData = z.object({
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
export const zGetHashlistsResponse = zHashlistListResponse;

export const zPatchHashlistsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zPostHashlistsData = z.object({
    body: zHashlistCreate,
    path: z.never().optional(),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostHashlistsResponse = zHashlistPostPatchResponse;

export const zGetHashlistsCountData = z.object({
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
export const zGetHashlistsCountResponse = zHashlistListResponse;

export const zGetHashlistsByIdByRelationData = z.object({
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
export const zGetHashlistsByIdByRelationResponse = zHashlistRelationTasksGetResponse;

export const zDeleteHashlistsByIdRelationshipsByRelationData = z.object({
    body: zHashlistRelationTasks,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteHashlistsByIdRelationshipsByRelationResponse = z.void();

export const zGetHashlistsByIdRelationshipsByRelationData = z.object({
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
export const zGetHashlistsByIdRelationshipsByRelationResponse = zHashlistResponse;

export const zPatchHashlistsByIdRelationshipsByRelationData = z.object({
    body: zHashlistRelationTasks,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchHashlistsByIdRelationshipsByRelationResponse = z.void();

export const zPostHashlistsByIdRelationshipsByRelationData = z.object({
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
export const zPostHashlistsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteHashlistsByIdData = z.object({
    body: z.record(z.string(), z.unknown()),
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteHashlistsByIdResponse = z.void();

export const zGetHashlistsByIdData = z.object({
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
export const zGetHashlistsByIdResponse = zHashlistResponse;

export const zPatchHashlistsByIdData = z.object({
    body: zHashlistPatch,
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchHashlistsByIdResponse = zHashlistPostPatchResponse;
