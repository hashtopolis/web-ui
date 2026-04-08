import * as z from 'zod';

export const zTaskCreate = z.object({
    data: z.object({
        type: z.literal('task'),
        attributes: z.object({
            hashlistId: z.int(),
            files: z.array(z.int()),
            taskName: z.string(),
            attackCmd: z.string(),
            chunkTime: z.int(),
            statusTimer: z.int(),
            priority: z.int(),
            maxAgents: z.int(),
            color: z.string().nullish(),
            isSmall: z.boolean(),
            isCpuTask: z.boolean(),
            useNewBench: z.boolean(),
            skipKeyspace: z.number(),
            crackerBinaryId: z.int(),
            crackerBinaryTypeId: z.int().nullish(),
            isArchived: z.boolean(),
            notes: z.string(),
            staticChunks: z.int(),
            chunkSize: z.number(),
            forcePipe: z.boolean(),
            preprocessorId: z.int(),
            preprocessorCommand: z.string()
        })
    })
});

export const zTaskPatch = z.object({
    data: z.object({
        type: z.literal('task'),
        attributes: z.object({
            attackCmd: z.string().optional(),
            chunkTime: z.int().optional(),
            color: z.string().nullish(),
            isArchived: z.boolean().optional(),
            isCpuTask: z.boolean().optional(),
            isSmall: z.boolean().optional(),
            maxAgents: z.int().optional(),
            notes: z.string().optional(),
            priority: z.int().optional(),
            statusTimer: z.int().optional(),
            taskName: z.string().optional()
        })
    })
});

export const zTaskResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/tasks?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/tasks?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/tasks?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/tasks?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/tasks?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
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
            preprocessorCommand: z.string(),
            activeAgents: z.int().optional(),
            dispatched: z.string().optional(),
            searched: z.string().optional(),
            status: z.union([
                z.literal(0),
                z.literal(1),
                z.literal(2),
                z.literal(3)
            ]).optional(),
            estimatedTime: z.int().optional(),
            timeSpent: z.int().optional(),
            currentSpeed: z.int().optional(),
            cprogress: z.int().optional()
        })
    }),
    relationships: z.object({
        assignedAgents: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/assignedAgents'),
                related: z.string().default('/api/v2/ui/tasks/assignedAgents')
            }),
            data: z.array(z.object({
                type: z.literal('agent'),
                id: z.int()
            })).optional()
        }),
        crackerBinary: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinary'),
                related: z.string().default('/api/v2/ui/tasks/crackerBinary')
            }),
            data: z.object({
                type: z.literal('crackerBinary'),
                id: z.int()
            }).nullish()
        }),
        crackerBinaryType: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinaryType'),
                related: z.string().default('/api/v2/ui/tasks/crackerBinaryType')
            }),
            data: z.object({
                type: z.literal('crackerBinaryType'),
                id: z.int()
            }).nullish()
        }),
        files: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/files'),
                related: z.string().default('/api/v2/ui/tasks/files')
            }),
            data: z.array(z.object({
                type: z.literal('file'),
                id: z.int()
            })).optional()
        }),
        hashlist: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/hashlist'),
                related: z.string().default('/api/v2/ui/tasks/hashlist')
            }),
            data: z.object({
                type: z.literal('hashlist'),
                id: z.int()
            }).nullish()
        }),
        speeds: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/speeds'),
                related: z.string().default('/api/v2/ui/tasks/speeds')
            }),
            data: z.array(z.object({
                type: z.literal('speed'),
                id: z.int()
            })).optional()
        })
    }).optional(),
    included: z.array(z.union([
        z.object({
            id: z.int(),
            type: z.literal('crackerBinary'),
            attributes: z.object({
                crackerBinaryTypeId: z.int(),
                version: z.string(),
                downloadUrl: z.string(),
                binaryName: z.string()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('crackerBinaryType'),
            attributes: z.object({
                typeName: z.string(),
                isChunkingAvailable: z.boolean()
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
        }),
        z.object({
            id: z.int(),
            type: z.literal('file'),
            attributes: z.object({
                filename: z.string(),
                size: z.number(),
                isSecret: z.boolean(),
                fileType: z.union([
                    z.literal(0),
                    z.literal(1),
                    z.literal(2),
                    z.literal(100)
                ]),
                accessGroupId: z.int(),
                lineCount: z.number()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('speed'),
            attributes: z.object({
                agentId: z.int(),
                taskId: z.int(),
                speed: z.number(),
                time: z.number()
            })
        })
    ])).optional()
});

export const zTaskPostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
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
            preprocessorCommand: z.string(),
            activeAgents: z.int().optional(),
            dispatched: z.string().optional(),
            searched: z.string().optional(),
            status: z.union([
                z.literal(0),
                z.literal(1),
                z.literal(2),
                z.literal(3)
            ]).optional(),
            estimatedTime: z.int().optional(),
            timeSpent: z.int().optional(),
            currentSpeed: z.int().optional(),
            cprogress: z.int().optional()
        })
    })
});

export const zTaskListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/tasks?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/tasks?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/tasks?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/tasks?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/tasks?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
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
            preprocessorCommand: z.string(),
            activeAgents: z.int().optional(),
            dispatched: z.string().optional(),
            searched: z.string().optional(),
            status: z.union([
                z.literal(0),
                z.literal(1),
                z.literal(2),
                z.literal(3)
            ]).optional(),
            estimatedTime: z.int().optional(),
            timeSpent: z.int().optional(),
            currentSpeed: z.int().optional(),
            cprogress: z.int().optional()
        })
    })),
    relationships: z.object({
        assignedAgents: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/assignedAgents'),
                related: z.string().default('/api/v2/ui/tasks/assignedAgents')
            }),
            data: z.array(z.object({
                type: z.literal('agent'),
                id: z.int()
            })).optional()
        }),
        crackerBinary: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinary'),
                related: z.string().default('/api/v2/ui/tasks/crackerBinary')
            }),
            data: z.object({
                type: z.literal('crackerBinary'),
                id: z.int()
            }).nullish()
        }),
        crackerBinaryType: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/crackerBinaryType'),
                related: z.string().default('/api/v2/ui/tasks/crackerBinaryType')
            }),
            data: z.object({
                type: z.literal('crackerBinaryType'),
                id: z.int()
            }).nullish()
        }),
        files: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/files'),
                related: z.string().default('/api/v2/ui/tasks/files')
            }),
            data: z.array(z.object({
                type: z.literal('file'),
                id: z.int()
            })).optional()
        }),
        hashlist: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/hashlist'),
                related: z.string().default('/api/v2/ui/tasks/hashlist')
            }),
            data: z.object({
                type: z.literal('hashlist'),
                id: z.int()
            }).nullish()
        }),
        speeds: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/tasks/relationships/speeds'),
                related: z.string().default('/api/v2/ui/tasks/speeds')
            }),
            data: z.array(z.object({
                type: z.literal('speed'),
                id: z.int()
            })).optional()
        })
    }).optional(),
    included: z.array(z.union([
        z.object({
            id: z.int(),
            type: z.literal('crackerBinary'),
            attributes: z.object({
                crackerBinaryTypeId: z.int(),
                version: z.string(),
                downloadUrl: z.string(),
                binaryName: z.string()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('crackerBinaryType'),
            attributes: z.object({
                typeName: z.string(),
                isChunkingAvailable: z.boolean()
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
        }),
        z.object({
            id: z.int(),
            type: z.literal('file'),
            attributes: z.object({
                filename: z.string(),
                size: z.number(),
                isSecret: z.boolean(),
                fileType: z.union([
                    z.literal(0),
                    z.literal(1),
                    z.literal(2),
                    z.literal(100)
                ]),
                accessGroupId: z.int(),
                lineCount: z.number()
            })
        }),
        z.object({
            id: z.int(),
            type: z.literal('speed'),
            attributes: z.object({
                agentId: z.int(),
                taskId: z.int(),
                speed: z.number(),
                time: z.number()
            })
        })
    ])).optional()
});

export const zTaskRelationSpeeds = z.object({
    data: z.array(z.object({
        type: z.literal('speeds'),
        id: z.int().default(1)
    }))
});

export const zTaskRelationSpeedsGetResponse = z.object({
    data: z.array(z.object({
        type: z.literal('speeds'),
        id: z.int().default(1)
    }))
});

export const zDeleteTasksData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetTasksData = z.object({
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
export const zGetTasksResponse = zTaskListResponse;

export const zPatchTasksData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zPostTasksData = z.object({
    body: zTaskCreate,
    path: z.never().optional(),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostTasksResponse = zTaskPostPatchResponse;

export const zGetTasksCountData = z.object({
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
export const zGetTasksCountResponse = zTaskListResponse;

export const zGetTasksByIdByRelationData = z.object({
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
export const zGetTasksByIdByRelationResponse = zTaskRelationSpeedsGetResponse;

export const zDeleteTasksByIdRelationshipsByRelationData = z.object({
    body: zTaskRelationSpeeds,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteTasksByIdRelationshipsByRelationResponse = z.void();

export const zGetTasksByIdRelationshipsByRelationData = z.object({
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
export const zGetTasksByIdRelationshipsByRelationResponse = zTaskResponse;

export const zPatchTasksByIdRelationshipsByRelationData = z.object({
    body: zTaskRelationSpeeds,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchTasksByIdRelationshipsByRelationResponse = z.void();

export const zPostTasksByIdRelationshipsByRelationData = z.object({
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
export const zPostTasksByIdRelationshipsByRelationResponse = z.void();

export const zDeleteTasksByIdData = z.object({
    body: z.record(z.string(), z.unknown()),
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteTasksByIdResponse = z.void();

export const zGetTasksByIdData = z.object({
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
export const zGetTasksByIdResponse = zTaskResponse;

export const zPatchTasksByIdData = z.object({
    body: zTaskPatch,
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchTasksByIdResponse = zTaskPostPatchResponse;
