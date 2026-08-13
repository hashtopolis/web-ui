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
      id: z.string().regex(/^[0-9]+$/),
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
      id: z.string().regex(/^[0-9]+$/),
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
    id: z.string().regex(/^[0-9]+$/),
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
    id: z.string().regex(/^[0-9]+$/),
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
      id: z.string().regex(/^[0-9]+$/),
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

export const zDeleteVouchersBody = zVoucherDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteVouchersResponse = z.void();

export const zGetVouchersQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.string()).optional()
});

/**
 * successful operation
 */
export const zGetVouchersResponse = zVoucherListResponse;

export const zPatchVouchersBody = zVoucherPatchMultiple;

/**
 * successfully updated
 */
export const zPatchVouchersResponse = z.void();

export const zPostVouchersBody = zVoucherCreate;

/**
 * successful operation
 */
export const zPostVouchersResponse = zVoucherPostPatchResponse;

export const zGetVouchersCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetVouchersCountResponse = zVoucherCountResponse;

export const zDeleteVouchersByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteVouchersByIdResponse = z.void();

export const zGetVouchersByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetVouchersByIdQuery = z.object({
  include: z.array(z.string()).optional()
});

/**
 * successful operation
 */
export const zGetVouchersByIdResponse = zVoucherResponse;

export const zPatchVouchersByIdBody = zVoucherPatch;

export const zPatchVouchersByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchVouchersByIdResponse = zVoucherPostPatchResponse;
