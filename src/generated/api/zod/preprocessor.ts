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

export const zPreprocessorPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
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
  )
});

export const zPreprocessorDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('preprocessor')
    })
  )
});

export const zPreprocessorResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/preprocessors/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('preprocessor'),
    attributes: z.object({
      name: z.string(),
      url: z.string(),
      binaryName: z.string(),
      keyspaceCommand: z.string(),
      skipCommand: z.string(),
      limitCommand: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/preprocessors/1')
    })
  })
});

export const zPreprocessorPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/preprocessors/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('preprocessor'),
    attributes: z.object({
      name: z.string(),
      url: z.string(),
      binaryName: z.string(),
      keyspaceCommand: z.string(),
      skipCommand: z.string(),
      limitCommand: z.string()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/preprocessors/1')
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
    first: z.string().default('/api/v2/ui/preprocessors?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/preprocessors?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/preprocessors?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/preprocessors?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('preprocessor'),
      attributes: z.object({
        name: z.string(),
        url: z.string(),
        binaryName: z.string(),
        keyspaceCommand: z.string(),
        skipCommand: z.string(),
        limitCommand: z.string()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/preprocessors/1')
      })
    })
  )
});

export const zPreprocessorCountResponse = z.object({
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

export const zDeletePreprocessorsBody = zPreprocessorDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeletePreprocessorsResponse = z.void();

export const zGetPreprocessorsQuery = z.object({
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
export const zGetPreprocessorsResponse = zPreprocessorListResponse;

export const zPatchPreprocessorsBody = zPreprocessorPatchMultiple;

/**
 * successfully updated
 */
export const zPatchPreprocessorsResponse = z.void();

export const zPostPreprocessorsBody = zPreprocessorCreate;

/**
 * successful operation
 */
export const zPostPreprocessorsResponse = zPreprocessorPostPatchResponse;

export const zGetPreprocessorsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetPreprocessorsCountResponse = zPreprocessorCountResponse;

export const zDeletePreprocessorsByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeletePreprocessorsByIdResponse = z.void();

export const zGetPreprocessorsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetPreprocessorsByIdQuery = z.object({
  include: z.array(z.string()).optional()
});

/**
 * successful operation
 */
export const zGetPreprocessorsByIdResponse = zPreprocessorResponse;

export const zPatchPreprocessorsByIdBody = zPreprocessorPatch;

export const zPatchPreprocessorsByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchPreprocessorsByIdResponse = zPreprocessorPostPatchResponse;
