import * as z from 'zod';

export const zBackgroundJobDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.int(),
      type: z.literal('backgroundJob')
    })
  )
});

export const zBackgroundJobResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/backgroundJobs/1')
  }),
  data: z.object({
    id: z.int(),
    type: z.literal('backgroundJob'),
    attributes: z.object({
      jobType: z.string(),
      payload: z.record(z.string(), z.unknown()),
      status: z.union([z.literal(-1), z.literal(0), z.literal(1), z.literal(2)]),
      userId: z.int().nullable(),
      createdAt: z.number(),
      startedAt: z.number().nullable(),
      finishedAt: z.number().nullable(),
      exitCode: z.int().nullable(),
      resultMessage: z.string().nullable()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/backgroundJobs/1')
    }),
    relationships: z.object({
      user: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/backgroundJobs/relationships/user'),
          related: z.string().default('/api/v2/ui/backgroundJobs/user')
        }),
        data: z
          .object({
            type: z.literal('user'),
            id: z.int()
          })
          .nullish()
      })
    })
  }),
  included: z
    .array(
      z.object({
        id: z.int(),
        type: z.literal('user'),
        attributes: z.object({
          name: z.string(),
          email: z.string().optional(),
          isValid: z.boolean().optional(),
          isComputedPassword: z.boolean().optional(),
          lastLoginDate: z.number().optional(),
          registeredSince: z.number().optional(),
          sessionLifetime: z.int().optional(),
          globalPermissionGroupId: z.int().optional()
        })
      })
    )
    .optional()
});

export const zBackgroundJobListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/backgroundJobs?page[size]=25'),
    first: z.string().default('/api/v2/ui/backgroundJobs?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/backgroundJobs?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/backgroundJobs?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/backgroundJobs?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('backgroundJob'),
      attributes: z.object({
        jobType: z.string(),
        payload: z.record(z.string(), z.unknown()),
        status: z.union([z.literal(-1), z.literal(0), z.literal(1), z.literal(2)]),
        userId: z.int().nullable(),
        createdAt: z.number(),
        startedAt: z.number().nullable(),
        finishedAt: z.number().nullable(),
        exitCode: z.int().nullable(),
        resultMessage: z.string().nullable()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/backgroundJobs/1')
      }),
      relationships: z.object({
        user: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/backgroundJobs/relationships/user'),
            related: z.string().default('/api/v2/ui/backgroundJobs/user')
          }),
          data: z
            .object({
              type: z.literal('user'),
              id: z.int()
            })
            .nullish()
        })
      })
    })
  ),
  included: z
    .array(
      z.object({
        id: z.int(),
        type: z.literal('user'),
        attributes: z.object({
          name: z.string(),
          email: z.string().optional(),
          isValid: z.boolean().optional(),
          isComputedPassword: z.boolean().optional(),
          lastLoginDate: z.number().optional(),
          registeredSince: z.number().optional(),
          sessionLifetime: z.int().optional(),
          globalPermissionGroupId: z.int().optional()
        })
      })
    )
    .optional()
});

export const zBackgroundJobCountResponse = z.object({
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

export const zBackgroundJobRelationUser = z.object({
  data: z.object({
    type: z.literal('user'),
    id: z.int()
  })
});

export const zBackgroundJobRelationUserGetResponse = z.object({
  data: z.object({
    type: z.literal('user'),
    id: z.int()
  })
});

export const zDeleteBackgroundJobsBody = zBackgroundJobDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteBackgroundJobsResponse = z.void();

export const zGetBackgroundJobsQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['user'])).optional()
});

/**
 * successful operation
 */
export const zGetBackgroundJobsResponse = zBackgroundJobListResponse;

export const zGetBackgroundJobsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetBackgroundJobsCountResponse = zBackgroundJobCountResponse;

export const zGetBackgroundJobsByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetBackgroundJobsByIdByRelationResponse = zBackgroundJobRelationUserGetResponse;

export const zGetBackgroundJobsByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetBackgroundJobsByIdRelationshipsByRelationResponse = zBackgroundJobResponse;

export const zPatchBackgroundJobsByIdRelationshipsByRelationBody = zBackgroundJobRelationUser;

export const zPatchBackgroundJobsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchBackgroundJobsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteBackgroundJobsByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteBackgroundJobsByIdResponse = z.void();

export const zGetBackgroundJobsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetBackgroundJobsByIdQuery = z.object({
  include: z.array(z.enum(['user'])).optional()
});

/**
 * successful operation
 */
export const zGetBackgroundJobsByIdResponse = zBackgroundJobResponse;
