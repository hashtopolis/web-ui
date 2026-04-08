import * as z from 'zod';

export const zFileCreate = z.object({
  data: z.object({
    type: z.literal('file'),
    attributes: z.object({
      sourceType: z.string(),
      sourceData: z.string(),
      filename: z.string(),
      isSecret: z.boolean(),
      fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
      accessGroupId: z.int()
    })
  })
});

export const zFilePatch = z.object({
  data: z.object({
    type: z.literal('file'),
    attributes: z.object({
      accessGroupId: z.int().optional(),
      fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]).optional(),
      filename: z.string().optional(),
      isSecret: z.boolean().optional()
    })
  })
});

export const zFileResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/files?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/files?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/files?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/files?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/files?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.object({
    id: z.int(),
    type: z.literal('file'),
    attributes: z.object({
      filename: z.string(),
      size: z.number(),
      isSecret: z.boolean(),
      fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
      accessGroupId: z.int(),
      lineCount: z.number()
    })
  }),
  relationships: z
    .object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/files/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/files/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.int()
          })
          .nullish()
      })
    })
    .optional(),
  included: z
    .array(
      z.object({
        id: z.int(),
        type: z.literal('accessGroup'),
        attributes: z.object({
          groupName: z.string()
        })
      })
    )
    .optional()
});

export const zFileSingleResponse = z.object({
  data: z.object({
    id: z.int(),
    type: z.literal('file'),
    attributes: z.object({
      filename: z.string(),
      size: z.number(),
      isSecret: z.boolean(),
      fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
      accessGroupId: z.int(),
      lineCount: z.number()
    })
  }),
  relationships: z
    .object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/files/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/files/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.int()
          })
          .nullish()
      })
    })
    .optional(),
  included: z
    .array(
      z.object({
        id: z.int(),
        type: z.literal('accessGroup'),
        attributes: z.object({
          groupName: z.string()
        })
      })
    )
    .optional()
});

export const zFilePostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('file'),
    attributes: z.object({
      filename: z.string(),
      size: z.number(),
      isSecret: z.boolean(),
      fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
      accessGroupId: z.int(),
      lineCount: z.number()
    })
  })
});

export const zFileListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/files?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/files?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/files?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/files?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/files?page[size]=25&page[before]=25')
    })
    .optional(),
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('file'),
      attributes: z.object({
        filename: z.string(),
        size: z.number(),
        isSecret: z.boolean(),
        fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
        accessGroupId: z.int(),
        lineCount: z.number()
      })
    })
  ),
  relationships: z
    .object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/files/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/files/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.int()
          })
          .nullish()
      })
    })
    .optional(),
  included: z
    .array(
      z.object({
        id: z.int(),
        type: z.literal('accessGroup'),
        attributes: z.object({
          groupName: z.string()
        })
      })
    )
    .optional()
});

export const zFileRelationAccessGroup = z.object({
  data: z.object({
    type: z.literal('accessGroup'),
    id: z.int().default(1)
  })
});

export const zFileRelationAccessGroupGetResponse = z.object({
  data: z.object({
    type: z.literal('accessGroup'),
    id: z.int().default(1)
  })
});

export const zDeleteFilesData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zGetFilesData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z
    .object({
      'page[after]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[before]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[size]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      filter: z.record(z.string(), z.unknown()).optional(),
      include: z.string().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetFilesResponse = zFileListResponse;

export const zPatchFilesData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

export const zPostFilesData = z.object({
  body: zFileCreate,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostFilesResponse = zFilePostPatchResponse;

export const zGetFilesCountData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z
    .object({
      'page[after]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[before]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      'page[size]': z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      filter: z.record(z.string(), z.unknown()).optional(),
      include: z.string().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetFilesCountResponse = zFileListResponse;

export const zGetFilesByIdByRelationData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetFilesByIdByRelationResponse = zFileRelationAccessGroupGetResponse;

export const zGetFilesByIdRelationshipsByRelationData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetFilesByIdRelationshipsByRelationResponse = zFileResponse;

export const zPatchFilesByIdRelationshipsByRelationData = z.object({
  body: zFileRelationAccessGroup,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchFilesByIdRelationshipsByRelationResponse = z.void();

export const zDeleteFilesByIdData = z.object({
  body: z.record(z.string(), z.unknown()),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteFilesByIdResponse = z.void();

export const zGetFilesByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.string().optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetFilesByIdResponse = zFileResponse;

export const zPatchFilesByIdData = z.object({
  body: zFilePatch,
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPatchFilesByIdResponse = zFilePostPatchResponse;
