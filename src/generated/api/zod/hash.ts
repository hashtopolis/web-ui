import * as z from 'zod';

export const zHashResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z
    .object({
      self: z.string().default('/api/v2/ui/hashes?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/hashes?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/hashes?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/hashes?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/hashes?page[size]=25&page[before]=25')
    })
    .optional(),
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
    })
  }),
  relationships: z
    .object({
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
    .optional(),
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
            agentId: z.int(),
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
  links: z
    .object({
      self: z.string().default('/api/v2/ui/hashes?page[size]=25'),
      first: z.string().optional().default('/api/v2/ui/hashes?page[size]=25&page[after]=0'),
      last: z.string().optional().default('/api/v2/ui/hashes?page[size]=25&page[before]=500'),
      next: z.string().nullish().default('/api/v2/ui/hashes?page[size]=25&page[after]=25'),
      previous: z.string().nullish().default('/api/v2/ui/hashes?page[size]=25&page[before]=25')
    })
    .optional(),
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
        chunkId: z.number().nullable(), // Allow null for chunkId
        isCracked: z.boolean(),
        crackPos: z.number()
      })
    })
  ),
  relationships: z
    .object({
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
    .optional(),
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
            agentId: z.int(),
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

export const zHashRelationHashlist = z.object({
  data: z.object({
    type: z.literal('hashlist'),
    id: z.int().default(1)
  })
});

export const zHashRelationHashlistGetResponse = z.object({
  data: z.object({
    type: z.literal('hashlist'),
    id: z.int().default(1)
  })
});

export const zGetHashesData = z.object({
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
export const zGetHashesResponse = zHashListResponse;

export const zGetHashesCountData = z.object({
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
export const zGetHashesCountResponse = zHashListResponse;

export const zGetHashesByIdByRelationData = z.object({
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
export const zGetHashesByIdByRelationResponse = zHashRelationHashlistGetResponse;

export const zGetHashesByIdRelationshipsByRelationData = z.object({
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
export const zGetHashesByIdRelationshipsByRelationResponse = zHashResponse;

export const zPatchHashesByIdRelationshipsByRelationData = z.object({
  body: zHashRelationHashlist,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchHashesByIdRelationshipsByRelationResponse = z.void();

export const zGetHashesByIdData = z.object({
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
export const zGetHashesByIdResponse = zHashResponse;
