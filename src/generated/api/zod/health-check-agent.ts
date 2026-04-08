import * as z from 'zod';

export const zHealthCheckAgentResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/healthcheckagents?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/healthcheckagents?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/healthcheckagents?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/healthcheckagents?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/healthcheckagents?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('healthCheckAgent'),
        attributes: z.object({
            healthCheckId: z.int(),
            agentId: z.int(),
            status: z.union([
                z.literal(-1),
                z.literal(0),
                z.literal(1)
            ]),
            cracked: z.int(),
            numGpus: z.int(),
            start: z.number(),
            end: z.number(),
            errors: z.string()
        })
    }),
    relationships: z.object({
        agent: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/healthcheckagents/relationships/agent'),
                related: z.string().default('/api/v2/ui/healthcheckagents/agent')
            }),
            data: z.object({
                type: z.literal('agent'),
                id: z.int()
            }).nullish()
        }),
        healthCheck: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/healthcheckagents/relationships/healthCheck'),
                related: z.string().default('/api/v2/ui/healthcheckagents/healthCheck')
            }),
            data: z.object({
                type: z.literal('healthCheck'),
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
            type: z.literal('healthCheck'),
            attributes: z.object({
                time: z.number(),
                status: z.union([
                    z.literal(-1),
                    z.literal(0),
                    z.literal(1)
                ]),
                checkType: z.union([
                    z.literal(0),
                    z.literal(3200)
                ]),
                hashtypeId: z.int(),
                crackerBinaryId: z.int(),
                expectedCracks: z.int(),
                attackCmd: z.string()
            })
        })])).optional()
});

export const zHealthCheckAgentListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/healthcheckagents?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/healthcheckagents?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/healthcheckagents?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/healthcheckagents?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/healthcheckagents?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('healthCheckAgent'),
        attributes: z.object({
            healthCheckId: z.int(),
            agentId: z.int(),
            status: z.union([
                z.literal(-1),
                z.literal(0),
                z.literal(1)
            ]),
            cracked: z.int(),
            numGpus: z.int(),
            start: z.number(),
            end: z.number(),
            errors: z.string()
        })
    })),
    relationships: z.object({
        agent: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/healthcheckagents/relationships/agent'),
                related: z.string().default('/api/v2/ui/healthcheckagents/agent')
            }),
            data: z.object({
                type: z.literal('agent'),
                id: z.int()
            }).nullish()
        }),
        healthCheck: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/healthcheckagents/relationships/healthCheck'),
                related: z.string().default('/api/v2/ui/healthcheckagents/healthCheck')
            }),
            data: z.object({
                type: z.literal('healthCheck'),
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
            type: z.literal('healthCheck'),
            attributes: z.object({
                time: z.number(),
                status: z.union([
                    z.literal(-1),
                    z.literal(0),
                    z.literal(1)
                ]),
                checkType: z.union([
                    z.literal(0),
                    z.literal(3200)
                ]),
                hashtypeId: z.int(),
                crackerBinaryId: z.int(),
                expectedCracks: z.int(),
                attackCmd: z.string()
            })
        })])).optional()
});

export const zHealthCheckAgentRelationHealthCheck = z.object({
    data: z.object({
        type: z.literal('healthCheck'),
        id: z.int().default(1)
    })
});

export const zHealthCheckAgentRelationHealthCheckGetResponse = z.object({
    data: z.object({
        type: z.literal('healthCheck'),
        id: z.int().default(1)
    })
});

export const zGetHealthcheckagentsData = z.object({
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
export const zGetHealthcheckagentsResponse = zHealthCheckAgentListResponse;

export const zGetHealthcheckagentsCountData = z.object({
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
export const zGetHealthcheckagentsCountResponse = zHealthCheckAgentListResponse;

export const zGetHealthcheckagentsByIdByRelationData = z.object({
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
export const zGetHealthcheckagentsByIdByRelationResponse = zHealthCheckAgentRelationHealthCheckGetResponse;

export const zGetHealthcheckagentsByIdRelationshipsByRelationData = z.object({
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
export const zGetHealthcheckagentsByIdRelationshipsByRelationResponse = zHealthCheckAgentResponse;

export const zPatchHealthcheckagentsByIdRelationshipsByRelationData = z.object({
    body: zHealthCheckAgentRelationHealthCheck,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchHealthcheckagentsByIdRelationshipsByRelationResponse = z.void();

export const zGetHealthcheckagentsByIdData = z.object({
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
export const zGetHealthcheckagentsByIdResponse = zHealthCheckAgentResponse;
