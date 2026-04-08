import * as z from 'zod';

export const zConfigPatch = z.object({
    data: z.object({
        type: z.literal('config'),
        attributes: z.object({
            item: z.string().optional(),
            value: z.string().optional()
        })
    })
});

export const zConfigResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/configs?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/configs?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/configs?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/configs?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/configs?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('config'),
        attributes: z.object({
            configSectionId: z.int(),
            item: z.string(),
            value: z.string()
        })
    }),
    relationships: z.object({
        configSection: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/configs/relationships/configSection'),
                related: z.string().default('/api/v2/ui/configs/configSection')
            }),
            data: z.object({
                type: z.literal('configSection'),
                id: z.int()
            }).nullish()
        })
    }).optional(),
    included: z.array(z.object({
        id: z.int(),
        type: z.literal('configSection'),
        attributes: z.object({
            sectionName: z.string()
        })
    })).optional()
});

export const zConfigPostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
        id: z.int(),
        type: z.literal('config'),
        attributes: z.object({
            configSectionId: z.int(),
            item: z.string(),
            value: z.string()
        })
    })
});

export const zConfigListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/configs?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/configs?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/configs?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/configs?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/configs?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('config'),
        attributes: z.object({
            configSectionId: z.int(),
            item: z.string(),
            value: z.string()
        })
    })),
    relationships: z.object({
        configSection: z.object({
            links: z.object({
                self: z.string().default('/api/v2/ui/configs/relationships/configSection'),
                related: z.string().default('/api/v2/ui/configs/configSection')
            }),
            data: z.object({
                type: z.literal('configSection'),
                id: z.int()
            }).nullish()
        })
    }).optional(),
    included: z.array(z.object({
        id: z.int(),
        type: z.literal('configSection'),
        attributes: z.object({
            sectionName: z.string()
        })
    })).optional()
});

export const zConfigRelationConfigSection = z.object({
    data: z.object({
        type: z.literal('configSection'),
        id: z.int().default(1)
    })
});

export const zConfigRelationConfigSectionGetResponse = z.object({
    data: z.object({
        type: z.literal('configSection'),
        id: z.int().default(1)
    })
});

export const zGetConfigsData = z.object({
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
export const zGetConfigsResponse = zConfigListResponse;

export const zPatchConfigsData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetConfigsCountData = z.object({
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
export const zGetConfigsCountResponse = zConfigListResponse;

export const zGetConfigsByIdByRelationData = z.object({
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
export const zGetConfigsByIdByRelationResponse = zConfigRelationConfigSectionGetResponse;

export const zGetConfigsByIdRelationshipsByRelationData = z.object({
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
export const zGetConfigsByIdRelationshipsByRelationResponse = zConfigResponse;

export const zPatchConfigsByIdRelationshipsByRelationData = z.object({
    body: zConfigRelationConfigSection,
    path: z.object({
        id: z.int(),
        relation: z.string()
    }),
    query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchConfigsByIdRelationshipsByRelationResponse = z.void();

export const zGetConfigsByIdData = z.object({
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
export const zGetConfigsByIdResponse = zConfigResponse;

export const zPatchConfigsByIdData = z.object({
    body: zConfigPatch,
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchConfigsByIdResponse = zConfigPostPatchResponse;
