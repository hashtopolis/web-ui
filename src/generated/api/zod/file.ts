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
      accessGroupId: z.string()
    })
  })
});

export const zFilePatch = z.object({
  data: z.object({
    type: z.literal('file'),
    attributes: z.object({
      accessGroupId: z.string().optional(),
      fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]).optional(),
      filename: z.string().optional(),
      isSecret: z.boolean().optional()
    })
  })
});

export const zFilePatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('file'),
      attributes: z.object({
        accessGroupId: z.string().optional(),
        fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]).optional(),
        filename: z.string().optional(),
        isSecret: z.boolean().optional()
      })
    })
  )
});

export const zFileDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('file')
    })
  )
});

export const zFileResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/files/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('file'),
    attributes: z.object({
      filename: z.string(),
      size: z.number(),
      isSecret: z.boolean(),
      fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
      accessGroupId: z.string(),
      lineCount: z.number()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/files/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/files/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/files/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9]+$/),
        type: z.literal('accessGroup'),
        attributes: z.object({
          groupName: z.string()
        })
      })
    )
    .optional()
});

export const zFileSingleResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/files/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('file'),
    attributes: z.object({
      filename: z.string(),
      size: z.number(),
      isSecret: z.boolean(),
      fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
      accessGroupId: z.string(),
      lineCount: z.number()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/files/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/files/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/files/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9]+$/),
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
  links: z.object({
    self: z.string().default('/api/v2/ui/files/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('file'),
    attributes: z.object({
      filename: z.string(),
      size: z.number(),
      isSecret: z.boolean(),
      fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
      accessGroupId: z.string(),
      lineCount: z.number()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/files/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/files/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/files/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9]+$/),
        type: z.literal('accessGroup'),
        attributes: z.object({
          groupName: z.string()
        })
      })
    )
    .optional()
});

export const zFileListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/files?page[size]=25'),
    first: z.string().default('/api/v2/ui/files?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/files?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/files?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/files?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('file'),
      attributes: z.object({
        filename: z.string(),
        size: z.number(),
        isSecret: z.boolean(),
        fileType: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(100)]),
        accessGroupId: z.string(),
        lineCount: z.number()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/files/1')
      }),
      relationships: z.object({
        accessGroup: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/files/relationships/accessGroup'),
            related: z.string().default('/api/v2/ui/files/accessGroup')
          }),
          data: z
            .object({
              type: z.literal('accessGroup'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        })
      })
    })
  ),
  included: z
    .array(
      z.object({
        id: z.string().regex(/^[0-9]+$/),
        type: z.literal('accessGroup'),
        attributes: z.object({
          groupName: z.string()
        })
      })
    )
    .optional()
});

export const zFileCountResponse = z.object({
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

export const zFileRelationAccessGroup = z.object({
  data: z.object({
    type: z.literal('accessGroup'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zFileRelationAccessGroupGetResponse = z.object({
  data: z.object({
    type: z.literal('accessGroup'),
    id: z.string().regex(/^[0-9]+$/)
  })
});

export const zDeleteFilesBody = zFileDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteFilesResponse = z.void();

export const zGetFilesQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['accessGroup'])).optional()
});

/**
 * successful operation
 */
export const zGetFilesResponse = zFileListResponse;

export const zPatchFilesBody = zFilePatchMultiple;

/**
 * successfully updated
 */
export const zPatchFilesResponse = z.void();

export const zPostFilesBody = zFileCreate;

/**
 * successful operation
 */
export const zPostFilesResponse = zFilePostPatchResponse;

export const zGetFilesCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetFilesCountResponse = zFileCountResponse;

export const zGetFilesByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetFilesByIdByRelationResponse = zFileRelationAccessGroupGetResponse;

export const zGetFilesByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetFilesByIdRelationshipsByRelationResponse = zFileResponse;

export const zPatchFilesByIdRelationshipsByRelationBody = zFileRelationAccessGroup;

export const zPatchFilesByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchFilesByIdRelationshipsByRelationResponse = z.void();

export const zDeleteFilesByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteFilesByIdResponse = z.void();

export const zGetFilesByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetFilesByIdQuery = z.object({
  include: z.array(z.enum(['accessGroup'])).optional()
});

/**
 * successful operation
 */
export const zGetFilesByIdResponse = zFileResponse;

export const zPatchFilesByIdBody = zFilePatch;

export const zPatchFilesByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchFilesByIdResponse = zFilePostPatchResponse;
