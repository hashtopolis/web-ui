import * as z from 'zod';

export const zHashResourceObject = z.object({
  id: z.int(),
  type: z.literal('hash'),
  attributes: z.object({
    hashlistId: z.int(),
    hash: z.string(),
    salt: z.string(),
    plaintext: z.string(),
    timeCracked: z.number(),
    chunkId: z.int().nullable(),
    isCracked: z.boolean(),
    crackPos: z.number()
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/hashes/1')
  }),
  relationships: z.object({
    chunk: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/hashes/relationships/chunk'),
        related: z.string().default('/api/v2/ui/hashes/chunk')
      }),
      data: z
        .object({
          type: z.literal('chunk'),
          id: z.int()
        })
        .nullish()
    }),
    hashlist: z.object({
      links: z.object({
        self: z.string().default('/api/v2/ui/hashes/relationships/hashlist'),
        related: z.string().default('/api/v2/ui/hashes/hashlist')
      }),
      data: z
        .object({
          type: z.literal('hashlist'),
          id: z.int()
        })
        .nullish()
    })
  })
});

export const zHashResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/hashes/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('hash'),
    attributes: z.object({
      hashlistId: z.int(),
      hash: z.string(),
      salt: z.string(),
      plaintext: z.string(),
      timeCracked: z.number(),
      chunkId: z.int().nullable(),
      isCracked: z.boolean(),
      crackPos: z.number()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/hashes/1')
    }),
    relationships: z.object({
      chunk: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashes/relationships/chunk'),
          related: z.string().default('/api/v2/ui/hashes/chunk')
        }),
        data: z
          .object({
            type: z.literal('chunk'),
            id: z.int()
          })
          .nullish()
      }),
      hashlist: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashes/relationships/hashlist'),
          related: z.string().default('/api/v2/ui/hashes/hashlist')
        }),
        data: z
          .object({
            type: z.literal('hashlist'),
            id: z.int()
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('chunk'),
          attributes: z.object({
            taskId: z.int(),
            skip: z.int(),
            length: z.int(),
            agentId: z.int().nullable(),
            dispatchTime: z.number(),
            solveTime: z.number(),
            checkpoint: z.number(),
            progress: z.int(),
            state: z.union([
              z.literal(0),
              z.literal(1),
              z.literal(2),
              z.literal(3),
              z.literal(4),
              z.literal(5),
              z.literal(6),
              z.literal(7),
              z.literal(8),
              z.literal(9),
              z.literal(10)
            ]),
            cracked: z.int(),
            speed: z.number()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.int(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.int(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        })
      ])
    )
    .optional()
});

export const zHashListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/hashes?page[size]=25'),
    first: z.string().default('/api/v2/ui/hashes?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/hashes?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/hashes?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/hashes?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('hash'),
      attributes: z.object({
        hashlistId: z.int(),
        hash: z.string(),
        salt: z.string(),
        plaintext: z.string(),
        timeCracked: z.number(),
        chunkId: z.int().nullable(),
        isCracked: z.boolean(),
        crackPos: z.number()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/hashes/1')
      }),
      relationships: z.object({
        chunk: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/hashes/relationships/chunk'),
            related: z.string().default('/api/v2/ui/hashes/chunk')
          }),
          data: z
            .object({
              type: z.literal('chunk'),
              id: z.int()
            })
            .nullish()
        }),
        hashlist: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/hashes/relationships/hashlist'),
            related: z.string().default('/api/v2/ui/hashes/hashlist')
          }),
          data: z
            .object({
              type: z.literal('hashlist'),
              id: z.int()
            })
            .nullish()
        })
      })
    })
  ),
  included: z
    .array(
      z.union([
        z.object({
          id: z.int(),
          type: z.literal('chunk'),
          attributes: z.object({
            taskId: z.int(),
            skip: z.int(),
            length: z.int(),
            agentId: z.int().nullable(),
            dispatchTime: z.number(),
            solveTime: z.number(),
            checkpoint: z.number(),
            progress: z.int(),
            state: z.union([
              z.literal(0),
              z.literal(1),
              z.literal(2),
              z.literal(3),
              z.literal(4),
              z.literal(5),
              z.literal(6),
              z.literal(7),
              z.literal(8),
              z.literal(9),
              z.literal(10)
            ]),
            cracked: z.int(),
            speed: z.number()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.int(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.int(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        })
      ])
    )
    .optional()
});

export const zHashCountResponse = z.object({
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

export const zHashRelationChunk = z.object({
  data: z.object({
    type: z.literal('chunk'),
    id: z.int()
  })
});

export const zHashRelationChunkGetResponse = z.object({
  data: z.object({
    type: z.literal('chunk'),
    id: z.int()
  })
});

export const zHashRelationHashlist = z.object({
  data: z.object({
    type: z.literal('hashlist'),
    id: z.int()
  })
});

export const zHashRelationHashlistGetResponse = z.object({
  data: z.object({
    type: z.literal('hashlist'),
    id: z.int()
  })
});

export const zGetHashesQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['chunk', 'hashlist'])).optional()
});

/**
 * successful operation
 */
export const zGetHashesResponse = zHashListResponse;

export const zGetHashesCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetHashesCountResponse = zHashCountResponse;

export const zGetHashesByIdChunkPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashesByIdChunkResponse = zHashRelationChunkGetResponse;

export const zGetHashesByIdRelationshipsChunkPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashesByIdRelationshipsChunkResponse = zHashResponse;

export const zPatchHashesByIdRelationshipsChunkBody = zHashRelationChunk;

export const zPatchHashesByIdRelationshipsChunkPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchHashesByIdRelationshipsChunkResponse = z.void();

export const zGetHashesByIdHashlistPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashesByIdHashlistResponse = zHashRelationHashlistGetResponse;

export const zGetHashesByIdRelationshipsHashlistPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashesByIdRelationshipsHashlistResponse = zHashResponse;

export const zPatchHashesByIdRelationshipsHashlistBody = zHashRelationHashlist;

export const zPatchHashesByIdRelationshipsHashlistPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchHashesByIdRelationshipsHashlistResponse = z.void();

export const zGetHashesByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetHashesByIdQuery = z.object({
  include: z.array(z.enum(['chunk', 'hashlist'])).optional()
});

/**
 * successful operation
 */
export const zGetHashesByIdResponse = zHashResponse;
