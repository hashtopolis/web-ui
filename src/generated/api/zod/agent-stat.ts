import * as z from 'zod';

export const zAgentStatResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/agentstats?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/agentstats?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/agentstats?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/agentstats?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/agentstats?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('agentStat'),
        attributes: z.object({
            agentId: z.int(),
            statType: z.union([
                z.literal(1),
                z.literal(2),
                z.literal(3)
            ]),
            time: z.number(),
            value: z.array(z.int())
        })
    }),
    relationships: z.record(z.string(), z.unknown()).optional(),
    included: z.array(z.unknown()).optional()
});

export const zAgentStatListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/agentstats?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/agentstats?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/agentstats?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/agentstats?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/agentstats?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('agentStat'),
        attributes: z.object({
            agentId: z.int(),
            statType: z.union([
                z.literal(1),
                z.literal(2),
                z.literal(3)
            ]),
            time: z.number(),
            value: z.array(z.int())
        })
    })),
    relationships: z.record(z.string(), z.unknown()).optional(),
    included: z.array(z.unknown()).optional()
});

export const zDeleteAgentstatsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetAgentstatsData = z.object({
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
export const zGetAgentstatsResponse = zAgentStatListResponse;

export const zGetAgentstatsCountData = z.object({
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
export const zGetAgentstatsCountResponse = zAgentStatListResponse;

export const zDeleteAgentstatsByIdData = z.object({
    body: z.record(z.string(), z.unknown()),
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteAgentstatsByIdResponse = z.void();

export const zGetAgentstatsByIdData = z.object({
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
export const zGetAgentstatsByIdResponse = zAgentStatResponse;
