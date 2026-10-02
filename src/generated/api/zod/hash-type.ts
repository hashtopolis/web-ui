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

export const zHashTypePatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('hashType'),
      attributes: z.object({
        description: z.string().optional(),
        isSalted: z.boolean().optional(),
        isSlowHash: z.boolean().optional()
      })
    })
  )
});

export const zHashTypeDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('hashType')
    })
  )
});

export const zHashTypeResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/hashtypes/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('hashType'),
    attributes: z.object({
      description: z.string(),
      isSalted: z.boolean(),
      isSlowHash: z.boolean()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/hashtypes/1')
    })
  })
});

export const zHashTypePostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/hashtypes/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('hashType'),
    attributes: z.object({
      description: z.string(),
      isSalted: z.boolean(),
      isSlowHash: z.boolean()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/hashtypes/1')
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
    first: z.string().default('/api/v2/ui/hashtypes?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/hashtypes?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/hashtypes?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/hashtypes?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('hashType'),
      attributes: z.object({
        description: z.string(),
        isSalted: z.boolean(),
        isSlowHash: z.boolean()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/hashtypes/1')
      })
    })
  )
});

export const zHashTypeCountResponse = z.object({
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

export const zDeleteHashtypesData = z.object({
  body: zHashTypeDeleteMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteHashtypesResponse = z.void();

export const zGetHashtypesData = z.object({
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
export const zGetHashtypesResponse = zHashTypeListResponse;

export const zPatchHashtypesData = z.object({
  body: zHashTypePatchMultiple,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successfully updated
 */
export const zPatchHashtypesResponse = z.void();

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
export const zGetHashtypesCountResponse = zHashTypeCountResponse;

export const zDeleteHashtypesByIdData = z.object({
  body: z.never().optional(),
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
