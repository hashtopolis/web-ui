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

export const zVoucherPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('voucher'),
      attributes: z.object({
        voucher: z.string().optional()
      })
    })
  )
});

export const zVoucherDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('voucher')
    })
  )
});

export const zVoucherResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/vouchers/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('voucher'),
    attributes: z.object({
      voucher: z.string(),
      time: z.number()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/vouchers/1')
    })
  })
});

export const zVoucherPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/vouchers/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('voucher'),
    attributes: z.object({
      voucher: z.string(),
      time: z.number()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/vouchers/1')
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
    first: z.string().default('/api/v2/ui/vouchers?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/vouchers?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/vouchers?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/vouchers?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      )
  }),
  meta: z.object({
    page: z.object({
      total_elements: z.int()
    })
  }),
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('voucher'),
      attributes: z.object({
        voucher: z.string(),
        time: z.number()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/vouchers/1')
      })
    })
  )
});

export const zVoucherCountResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    count: z.int(),
    total_count: z.int().optional()
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zDeleteVouchersData = z.object({
  body: zVoucherDeleteMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteVouchersResponse = z.void();

export const zGetVouchersData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z
    .object({
      'page[after]': z.string().optional(),
      'page[before]': z.string().optional(),
      'page[size]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      filter: z.record(z.string(), z.string()).optional(),
      include: z.array(z.string()).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetVouchersResponse = zVoucherListResponse;

export const zPatchVouchersData = z.object({
  body: zVoucherPatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchVouchersResponse = z.void();

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
  query: z
    .object({
      filter: z.record(z.string(), z.string()).optional(),
      include_total: z.boolean().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetVouchersCountResponse = zVoucherCountResponse;

export const zDeleteVouchersByIdData = z.object({
  body: z.never().optional(),
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
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.array(z.string()).optional()
    })
    .optional()
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
