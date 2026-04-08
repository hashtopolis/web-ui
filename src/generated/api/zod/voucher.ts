import * as z from 'zod';

export const zVoucherCreate = z.object({
    data: z.object({
        type: z.literal('voucher'),
        attributes: z.object({
            voucher: z.string()
        })
    })
});

export const zVoucherPatch = z.object({
    data: z.object({
        type: z.literal('voucher'),
        attributes: z.object({
            voucher: z.string().optional()
        })
    })
});

export const zVoucherResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/vouchers?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/vouchers?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/vouchers?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/vouchers?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/vouchers?page[size]=25&page[before]=25')
    }).optional(),
    data: z.object({
        id: z.int(),
        type: z.literal('voucher'),
        attributes: z.object({
            voucher: z.string(),
            time: z.number()
        })
    }),
    relationships: z.record(z.string(), z.unknown()).optional(),
    included: z.array(z.unknown()).optional()
});

export const zVoucherPostPatchResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    data: z.object({
        id: z.int(),
        type: z.literal('voucher'),
        attributes: z.object({
            voucher: z.string(),
            time: z.number()
        })
    })
});

export const zVoucherListResponse = z.object({
    jsonapi: z.object({
        version: z.string().default('1.1'),
        ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
    }),
    links: z.object({
        self: z.string().default('/api/v2/ui/vouchers?page[size]=25'),
        first: z.string().optional().default('/api/v2/ui/vouchers?page[size]=25&page[after]=0'),
        last: z.string().optional().default('/api/v2/ui/vouchers?page[size]=25&page[before]=500'),
        next: z.string().nullish().default('/api/v2/ui/vouchers?page[size]=25&page[after]=25'),
        previous: z.string().nullish().default('/api/v2/ui/vouchers?page[size]=25&page[before]=25')
    }).optional(),
    data: z.array(z.object({
        id: z.int(),
        type: z.literal('voucher'),
        attributes: z.object({
            voucher: z.string(),
            time: z.number()
        })
    })),
    relationships: z.record(z.string(), z.unknown()).optional(),
    included: z.array(z.unknown()).optional()
});

export const zDeleteVouchersData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zGetVouchersData = z.object({
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
export const zGetVouchersResponse = zVoucherListResponse;

export const zPatchVouchersData = z.object({
    body: z.never().optional(),
    path: z.never().optional(),
    query: z.never().optional()
});

export const zPostVouchersData = z.object({
    body: zVoucherCreate,
    path: z.never().optional(),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostVouchersResponse = zVoucherPostPatchResponse;

export const zGetVouchersCountData = z.object({
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
export const zGetVouchersCountResponse = zVoucherListResponse;

export const zDeleteVouchersByIdData = z.object({
    body: z.record(z.string(), z.unknown()),
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteVouchersByIdResponse = z.void();

export const zGetVouchersByIdData = z.object({
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
export const zGetVouchersByIdResponse = zVoucherResponse;

export const zPatchVouchersByIdData = z.object({
    body: zVoucherPatch,
    path: z.object({
        id: z.int()
    }),
    query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchVouchersByIdResponse = zVoucherPostPatchResponse;
