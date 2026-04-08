import * as z from 'zod';

export const zTaskWrapperPatch = z.object({
    data: z.object({
        type: z.literal('taskWrapper'),
        attributes: z.object({
            accessGroupId: z.int().optional(),
            isArchived: z.boolean().optional(),
            maxAgents: z.int().optional(),
            priority: z.int().optional(),
            taskWrapperName: z.string().optional()
        })
    })
});

export const zTaskWrapperResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/taskwrappers?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/taskwrappers?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/taskwrappers?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/taskwrappers?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/taskwrappers?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('taskWrapper'),
        attributes: z.object({
            priority: z.int(),
            maxAgents: z.int(),
            taskType: z.union([
                z.literal(0),
                z.literal(1)
            ]),
            hashlistId: z.int(),
            accessGroupId: z.int(),
            taskWrapperName: z.string(),
            isArchived: z.boolean(),
            cracked: z.int()
        })
    }),
    relationships: z.object({
        accessGroup: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/accessGroup'),
                related: z.string().default('/api/v2/ui/taskwrappers/accessGroup')
            }),
            data: z.object({
                type: z.literal('accessGroup'),
                id: z.int()
            }).nullish()
        }),
        hashType: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashType'),
                related: z.string().default('/api/v2/ui/taskwrappers/hashType')
            }),
            data: z.object({
                type: z.literal('hashType'),
                id: z.int()
            }).nullish()
        }),
        hashlist: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashlist'),
                related: z.string().default('/api/v2/ui/taskwrappers/hashlist')
            }),
            data: z.object({
                type: z.literal('hashlist'),
                id: z.int()
            }).nullish()
        }),
        task: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/task'),
                related: z.string().default('/api/v2/ui/taskwrappers/task')
            }),
            data: z.object({
                type: z.literal('task'),
                id: z.int()
            }).nullish()
        }),
        tasks: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/tasks'),
                related: z.string().default('/api/v2/ui/taskwrappers/tasks')
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
            type: z.literal('hashType'),
            attributes: z.object({
                description: z.string(),
                isSalted: z.boolean(),
                isSlowHash: z.boolean()
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

export const zTaskWrapperSingleResponse = z.object({
    data: z.object({
        id: z.int(),
        type: z.literal('taskWrapper'),
        attributes: z.object({
            priority: z.int(),
            maxAgents: z.int(),
            taskType: z.union([
                z.literal(0),
                z.literal(1)
            ]),
            hashlistId: z.int(),
            accessGroupId: z.int(),
            taskWrapperName: z.string(),
            isArchived: z.boolean(),
            cracked: z.int()
        })
    }),
    relationships: z.object({
        accessGroup: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/accessGroup'),
                related: z.string().default('/api/v2/ui/taskwrappers/accessGroup')
            }),
            data: z.object({
                type: z.literal('accessGroup'),
                id: z.int()
            }).nullish()
        }),
        hashType: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashType'),
                related: z.string().default('/api/v2/ui/taskwrappers/hashType')
            }),
            data: z.object({
                type: z.literal('hashType'),
                id: z.int()
            }).nullish()
        }),
        hashlist: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashlist'),
                related: z.string().default('/api/v2/ui/taskwrappers/hashlist')
            }),
            data: z.object({
                type: z.literal('hashlist'),
                id: z.int()
            }).nullish()
        }),
        task: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/task'),
                related: z.string().default('/api/v2/ui/taskwrappers/task')
            }),
            data: z.object({
                type: z.literal('task'),
                id: z.int()
            }).nullish()
        }),
        tasks: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/tasks'),
                related: z.string().default('/api/v2/ui/taskwrappers/tasks')
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
            type: z.literal('hashType'),
            attributes: z.object({
                description: z.string(),
                isSalted: z.boolean(),
                isSlowHash: z.boolean()
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

export const zTaskWrapperPostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
        id: z.int(),
        type: z.literal('taskWrapper'),
        attributes: z.object({
            priority: z.int(),
            maxAgents: z.int(),
            taskType: z.union([
                z.literal(0),
                z.literal(1)
            ]),
            hashlistId: z.int(),
            accessGroupId: z.int(),
            taskWrapperName: z.string(),
            isArchived: z.boolean(),
            cracked: z.int()
        })
    })
});

export const zTaskWrapperListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/taskwrappers?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/taskwrappers?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/taskwrappers?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/taskwrappers?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/taskwrappers?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('taskWrapper'),
        attributes: z.object({
            priority: z.int(),
            maxAgents: z.int(),
            taskType: z.union([
                z.literal(0),
                z.literal(1)
            ]),
            hashlistId: z.int(),
            accessGroupId: z.int(),
            taskWrapperName: z.string(),
            isArchived: z.boolean(),
            cracked: z.int()
        })
    })),
    relationships: z.object({
        accessGroup: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/accessGroup'),
                related: z.string().default('/api/v2/ui/taskwrappers/accessGroup')
            }),
            data: z.object({
                type: z.literal('accessGroup'),
                id: z.int()
            }).nullish()
        }),
        hashType: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashType'),
                related: z.string().default('/api/v2/ui/taskwrappers/hashType')
            }),
            data: z.object({
                type: z.literal('hashType'),
                id: z.int()
            }).nullish()
        }),
        hashlist: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/hashlist'),
                related: z.string().default('/api/v2/ui/taskwrappers/hashlist')
            }),
            data: z.object({
                type: z.literal('hashlist'),
                id: z.int()
            }).nullish()
        }),
        task: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/task'),
                related: z.string().default('/api/v2/ui/taskwrappers/task')
            }),
            data: z.object({
                type: z.literal('task'),
                id: z.int()
            }).nullish()
        }),
        tasks: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/taskwrappers/relationships/tasks'),
                related: z.string().default('/api/v2/ui/taskwrappers/tasks')
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
            type: z.literal('hashType'),
            attributes: z.object({
                description: z.string(),
                isSalted: z.boolean(),
                isSlowHash: z.boolean()
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

export const zTaskWrapperRelationTasks = z.object({
    data: z.array(z.object({
        type: z.literal('tasks'),
        id: z.int().default(1)
    }))
});

export const zTaskWrapperRelationTasksGetResponse = z.object({
    data: z.array(z.object({
        type: z.literal('tasks'),
        id: z.int().default(1)
    }))
});

export const zDeleteTaskwrappersData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetTaskwrappersData = z.object({
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
export const zGetTaskwrappersResponse = zTaskWrapperListResponse;

export const zPatchTaskwrappersData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetTaskwrappersCountData = z.object({
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
export const zGetTaskwrappersCountResponse = zTaskWrapperListResponse;

export const zGetTaskwrappersByIdByRelationData = z.object({
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
export const zGetTaskwrappersByIdByRelationResponse = zTaskWrapperRelationTasksGetResponse;

export const zDeleteTaskwrappersByIdRelationshipsByRelationData = z.object({
    body: zTaskWrapperRelationTasks,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteTaskwrappersByIdRelationshipsByRelationResponse = z.void();

export const zGetTaskwrappersByIdRelationshipsByRelationData = z.object({
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
export const zGetTaskwrappersByIdRelationshipsByRelationResponse = zTaskWrapperResponse;

export const zPatchTaskwrappersByIdRelationshipsByRelationData = z.object({
    body: zTaskWrapperRelationTasks,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchTaskwrappersByIdRelationshipsByRelationResponse = z.void();

export const zPostTaskwrappersByIdRelationshipsByRelationData = z.object({
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
export const zPostTaskwrappersByIdRelationshipsByRelationResponse = z.void();

export const zDeleteTaskwrappersByIdData = z.object({
    body: z.record(z.string(), z.unknown()),
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteTaskwrappersByIdResponse = z.void();

export const zGetTaskwrappersByIdData = z.object({
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
export const zGetTaskwrappersByIdResponse = zTaskWrapperResponse;

export const zPatchTaskwrappersByIdData = z.object({
    body: zTaskWrapperPatch,
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchTaskwrappersByIdResponse = zTaskWrapperPostPatchResponse;
