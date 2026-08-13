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
      id: z.string().regex(/^[0-9]+$/),
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
      id: z.string().regex(/^[0-9]+$/),
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
    id: z.string().regex(/^[0-9]+$/),
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
    id: z.string().regex(/^[0-9]+$/),
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
      id: z.string().regex(/^[0-9]+$/),
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

export const zDeleteHashtypesBody = zHashTypeDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteHashtypesResponse = z.void();

export const zGetHashtypesQuery = z.object({
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
export const zGetHashtypesResponse = zHashTypeListResponse;

export const zPatchHashtypesBody = zHashTypePatchMultiple;

/**
 * successfully updated
 */
export const zPatchHashtypesResponse = z.void();

export const zPostHashtypesBody = zHashTypeCreate;

/**
 * successful operation
 */
export const zPostHashtypesResponse = zHashTypePostPatchResponse;

export const zGetHashtypesCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetHashtypesCountResponse = zHashTypeCountResponse;

export const zDeleteHashtypesByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteHashtypesByIdResponse = z.void();

export const zGetHashtypesByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetHashtypesByIdQuery = z.object({
  include: z.array(z.string()).optional()
});

/**
 * successful operation
 */
export const zGetHashtypesByIdResponse = zHashTypeResponse;

export const zPatchHashtypesByIdBody = zHashTypePatch;

export const zPatchHashtypesByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchHashtypesByIdResponse = zHashTypePostPatchResponse;
