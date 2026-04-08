import * as z from 'zod';

export const zSpeedResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/speeds?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/speeds?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/speeds?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/speeds?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/speeds?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('speed'),
        attributes: z.object({
            agentId: z.int(),
            taskId: z.int(),
            speed: z.number(),
            time: z.number()
        })
    }),
    relationships: z.object({
        agent: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/speeds/relationships/agent'),
                related: z.string().default('/api/v2/ui/speeds/agent')
            }),
            data: z.object({
                type: z.literal('agent'),
                id: z.int()
            }).nullish()
        }),
        task: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/speeds/relationships/task'),
                related: z.string().default('/api/v2/ui/speeds/task')
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

export const zSpeedListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/speeds?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/speeds?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/speeds?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/speeds?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/speeds?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('speed'),
        attributes: z.object({
            agentId: z.int(),
            taskId: z.int(),
            speed: z.number(),
            time: z.number()
        })
    })),
    relationships: z.object({
        agent: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/speeds/relationships/agent'),
                related: z.string().default('/api/v2/ui/speeds/agent')
            }),
            data: z.object({
                type: z.literal('agent'),
                id: z.int()
            }).nullish()
        }),
        task: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/speeds/relationships/task'),
                related: z.string().default('/api/v2/ui/speeds/task')
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

export const zSpeedRelationTask = z.object({
    data: z.object({
        type: z.literal('task'),
        id: z.int().default(1)
    })
});

export const zSpeedRelationTaskGetResponse = z.object({
    data: z.object({
        type: z.literal('task'),
        id: z.int().default(1)
    })
});

export const zGetSpeedsData = z.object({
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
export const zGetSpeedsResponse = zSpeedListResponse;

export const zGetSpeedsCountData = z.object({
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
export const zGetSpeedsCountResponse = zSpeedListResponse;

export const zGetSpeedsByIdByRelationData = z.object({
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
export const zGetSpeedsByIdByRelationResponse = zSpeedRelationTaskGetResponse;

export const zGetSpeedsByIdRelationshipsByRelationData = z.object({
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
export const zGetSpeedsByIdRelationshipsByRelationResponse = zSpeedResponse;

export const zPatchSpeedsByIdRelationshipsByRelationData = z.object({
    body: zSpeedRelationTask,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchSpeedsByIdRelationshipsByRelationResponse = z.void();

export const zGetSpeedsByIdData = z.object({
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
export const zGetSpeedsByIdResponse = zSpeedResponse;
