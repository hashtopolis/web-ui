import * as z from 'zod';

export const zPreprocessorCreate = z.object({
    data: z.object({
        type: z.literal('preprocessor'),
        attributes: z.object({
            name: z.string(),
            url: z.string(),
            binaryName: z.string(),
            keyspaceCommand: z.string(),
            skipCommand: z.string(),
            limitCommand: z.string()
        })
    })
});

export const zPreprocessorPatch = z.object({
    data: z.object({
        type: z.literal('preprocessor'),
        attributes: z.object({
            binaryName: z.string().optional(),
            keyspaceCommand: z.string().optional(),
            limitCommand: z.string().optional(),
            name: z.string().optional(),
            skipCommand: z.string().optional(),
            url: z.string().optional()
        })
    })
});

export const zPreprocessorResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/preprocessors?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/preprocessors?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/preprocessors?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/preprocessors?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/preprocessors?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('preprocessor'),
        attributes: z.object({
            name: z.string(),
            url: z.string(),
            binaryName: z.string(),
            keyspaceCommand: z.string(),
            skipCommand: z.string(),
            limitCommand: z.string()
        })
    }),
    relationships: z.record(z.string(), z.unknown()).optional(),
    included: z.array(z.unknown()).optional()
});

export const zPreprocessorPostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
        id: z.int(),
        type: z.literal('preprocessor'),
        attributes: z.object({
            name: z.string(),
            url: z.string(),
            binaryName: z.string(),
            keyspaceCommand: z.string(),
            skipCommand: z.string(),
            limitCommand: z.string()
        })
    })
});

export const zPreprocessorListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/preprocessors?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/preprocessors?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/preprocessors?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/preprocessors?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/preprocessors?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('preprocessor'),
        attributes: z.object({
            name: z.string(),
            url: z.string(),
            binaryName: z.string(),
            keyspaceCommand: z.string(),
            skipCommand: z.string(),
            limitCommand: z.string()
        })
    })),
    relationships: z.record(z.string(), z.unknown()).optional(),
    included: z.array(z.unknown()).optional()
});

export const zDeletePreprocessorsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetPreprocessorsData = z.object({
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
export const zGetPreprocessorsResponse = zPreprocessorListResponse;

export const zPatchPreprocessorsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zPostPreprocessorsData = z.object({
    body: zPreprocessorCreate,
    path: z.never().optional(),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostPreprocessorsResponse = zPreprocessorPostPatchResponse;

export const zGetPreprocessorsCountData = z.object({
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
export const zGetPreprocessorsCountResponse = zPreprocessorListResponse;

export const zDeletePreprocessorsByIdData = z.object({
    body: z.record(z.string(), z.unknown()),
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeletePreprocessorsByIdResponse = z.void();

export const zGetPreprocessorsByIdData = z.object({
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
export const zGetPreprocessorsByIdResponse = zPreprocessorResponse;

export const zPatchPreprocessorsByIdData = z.object({
    body: zPreprocessorPatch,
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchPreprocessorsByIdResponse = zPreprocessorPostPatchResponse;
