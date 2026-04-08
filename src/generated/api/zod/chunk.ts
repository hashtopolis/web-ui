import * as z from 'zod';

export const zChunkResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/chunks?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/chunks?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/chunks?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/chunks?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/chunks?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('chunk'),
        attributes: z.object({
            taskId: z.int(),
            skip: z.int(),
            length: z.int(),
            agentId: z.int(),
            dispatchTime: z.number(),
            solveTime: z.number(),
            checkpoint: z.number(),
            progress: z.int(),
            state: z.union([
                z.literal(0),
                z.literal(1),
                z.literal(2),
                z.literal(3),
                z.literal(4),
                z.literal(5),
                z.literal(6),
                z.literal(7),
                z.literal(8),
                z.literal(9),
                z.literal(10)
            ]),
            cracked: z.int(),
            speed: z.number()
        })
    }),
    relationships: z.object({
        agent: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/chunks/relationships/agent'),
                related: z.string().default('/api/v2/ui/chunks/agent')
            }),
            data: z.object({
                type: z.literal('agent'),
                id: z.int()
            }).nullish()
        }),
        task: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/chunks/relationships/task'),
                related: z.string().default('/api/v2/ui/chunks/task')
            }),
            data: z.object({
                type: z.literal('task'),
                id: z.int()
            }).nullish()
        })
    }).optional(),
    included: z.array(z.union([z.object({
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
        }), z.object({
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
        })])).optional()
});

export const zChunkListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/chunks?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/chunks?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/chunks?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/chunks?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/chunks?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('chunk'),
        attributes: z.object({
            taskId: z.int(),
            skip: z.int(),
            length: z.int(),
            agentId: z.int(),
            dispatchTime: z.number(),
            solveTime: z.number(),
            checkpoint: z.number(),
            progress: z.int(),
            state: z.union([
                z.literal(0),
                z.literal(1),
                z.literal(2),
                z.literal(3),
                z.literal(4),
                z.literal(5),
                z.literal(6),
                z.literal(7),
                z.literal(8),
                z.literal(9),
                z.literal(10)
            ]),
            cracked: z.int(),
            speed: z.number()
        })
    })),
    relationships: z.object({
        agent: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/chunks/relationships/agent'),
                related: z.string().default('/api/v2/ui/chunks/agent')
            }),
            data: z.object({
                type: z.literal('agent'),
                id: z.int()
            }).nullish()
        }),
        task: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/chunks/relationships/task'),
                related: z.string().default('/api/v2/ui/chunks/task')
            }),
            data: z.object({
                type: z.literal('task'),
                id: z.int()
            }).nullish()
        })
    }).optional(),
    included: z.array(z.union([z.object({
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
        }), z.object({
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
        })])).optional()
});

export const zChunkRelationTask = z.object({
    data: z.object({
        type: z.literal('task'),
        id: z.int().default(1)
    })
});

export const zChunkRelationTaskGetResponse = z.object({
    data: z.object({
        type: z.literal('task'),
        id: z.int().default(1)
    })
});

export const zGetChunksData = z.object({
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
export const zGetChunksResponse = zChunkListResponse;

export const zGetChunksCountData = z.object({
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
export const zGetChunksCountResponse = zChunkListResponse;

export const zGetChunksByIdByRelationData = z.object({
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
export const zGetChunksByIdByRelationResponse = zChunkRelationTaskGetResponse;

export const zGetChunksByIdRelationshipsByRelationData = z.object({
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
export const zGetChunksByIdRelationshipsByRelationResponse = zChunkResponse;

export const zPatchChunksByIdRelationshipsByRelationData = z.object({
    body: zChunkRelationTask,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchChunksByIdRelationshipsByRelationResponse = z.void();

export const zGetChunksByIdData = z.object({
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
export const zGetChunksByIdResponse = zChunkResponse;
