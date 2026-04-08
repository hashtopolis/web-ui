import * as z from 'zod';

export const zHashTypeCreate = z.object({
    data: z.object({
        type: z.literal('hashType'),
        attributes: z.object({
            hashTypeId: z.int(),
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
        })
    })
});

export const zHashTypePatch = z.object({
    data: z.object({
        type: z.literal('hashType'),
        attributes: z.object({
            description: z.string().optional(),
            isSalted: z.boolean().optional(),
            isSlowHash: z.boolean().optional()
        })
    })
});

export const zHashTypeResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/hashtypes?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/hashtypes?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/hashtypes?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/hashtypes?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/hashtypes?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('hashType'),
        attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
        })
    }),
    relationships: z.record(z.string(), z.unknown()).optional(),
    included: z.array(z.unknown()).optional()
});

export const zHashTypePostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
        id: z.int(),
        type: z.literal('hashType'),
        attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
        })
    })
});

export const zHashTypeListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/hashtypes?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/hashtypes?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/hashtypes?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/hashtypes?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/hashtypes?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('hashType'),
        attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
        })
    })),
    relationships: z.record(z.string(), z.unknown()).optional(),
    included: z.array(z.unknown()).optional()
});

export const zDeleteHashtypesData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetHashtypesData = z.object({
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
export const zGetHashtypesResponse = zHashTypeListResponse;

export const zPatchHashtypesData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zPostHashtypesData = z.object({
    body: zHashTypeCreate,
    path: z.never().optional(),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostHashtypesResponse = zHashTypePostPatchResponse;

export const zGetHashtypesCountData = z.object({
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
export const zGetHashtypesCountResponse = zHashTypeListResponse;

export const zDeleteHashtypesByIdData = z.object({
    body: z.record(z.string(), z.unknown()),
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteHashtypesByIdResponse = z.void();

export const zGetHashtypesByIdData = z.object({
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
export const zGetHashtypesByIdResponse = zHashTypeResponse;

export const zPatchHashtypesByIdData = z.object({
    body: zHashTypePatch,
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchHashtypesByIdResponse = zHashTypePostPatchResponse;
