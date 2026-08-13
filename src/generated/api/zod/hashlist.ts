import * as z from 'zod';

export const zHashlistCreate = z.object({
  data: z.object({
    type: z.literal('hashlist'),
    attributes: z.object({
      hashlistSeperator: z.string().nullish(),
      sourceType: z.string(),
      sourceData: z.string(),
      name: z.string(),
      format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
      hashTypeId: z.string(),
      hashCount: z.int(),
      separator: z.string().nullish(),
      isSecret: z.boolean(),
      isHexSalt: z.boolean(),
      isSalted: z.boolean(),
      accessGroupId: z.string(),
      notes: z.string(),
      useBrain: z.boolean(),
      brainFeatures: z.int(),
      isArchived: z.boolean()
    })
  })
});

export const zHashlistPatch = z.object({
  data: z.object({
    type: z.literal('hashlist'),
    attributes: z.object({
      accessGroupId: z.string().optional(),
      isArchived: z.boolean().optional(),
      isSecret: z.boolean().optional(),
      name: z.string().optional(),
      notes: z.string().optional()
    })
  })
});

export const zHashlistPatchMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('hashlist'),
      attributes: z.object({
        accessGroupId: z.string().optional(),
        isArchived: z.boolean().optional(),
        isSecret: z.boolean().optional(),
        name: z.string().optional(),
        notes: z.string().optional()
      })
    })
  )
});

export const zHashlistDeleteMultiple = z.object({
  data: z.array(
    z.object({
      id: z.string().regex(/^[0-9]+$/),
      type: z.literal('hashlist')
    })
  )
});

export const zHashlistResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/hashlists/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('hashlist'),
    attributes: z.object({
      name: z.string(),
      format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
      hashTypeId: z.string(),
      hashCount: z.int(),
      separator: z.string().nullable(),
      cracked: z.int(),
      isSecret: z.boolean(),
      isHexSalt: z.boolean(),
      isSalted: z.boolean(),
      accessGroupId: z.string(),
      notes: z.string(),
      useBrain: z.boolean(),
      brainFeatures: z.int(),
      isArchived: z.boolean()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/hashlists/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/hashlists/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/hashType'),
          related: z.string().default('/api/v2/ui/hashlists/hashType')
        }),
        data: z
          .object({
            type: z.literal('hashType'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashes: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/hashes'),
          related: z.string().default('/api/v2/ui/hashlists/hashes')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('hash'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      }),
      hashlists: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/hashlists'),
          related: z.string().default('/api/v2/ui/hashlists/hashlists')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('hashlist'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/tasks'),
          related: z.string().default('/api/v2/ui/hashlists/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hash'),
          attributes: z.object({
            hashlistId: z.string(),
            hash: z.string(),
            salt: z.string(),
            plaintext: z.string(),
            timeCracked: z.number(),
            chunkId: z.string().nullable(),
            isCracked: z.boolean(),
            crackPos: z.number()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.string(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.string(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('task'),
          attributes: z.object({
            taskName: z.string(),
            attackCmd: z.string(),
            chunkTime: z.int(),
            statusTimer: z.int(),
            keyspace: z.number(),
            keyspaceProgress: z.number(),
            priority: z.int(),
            maxAgents: z.int(),
            color: z.string().nullable(),
            isSmall: z.boolean(),
            isCpuTask: z.boolean(),
            useNewBench: z.boolean(),
            skipKeyspace: z.number(),
            crackerBinaryId: z.string(),
            crackerBinaryTypeId: z.string().nullable(),
            taskWrapperId: z.string(),
            isArchived: z.boolean(),
            notes: z.string(),
            staticChunks: z.int(),
            chunkSize: z.number(),
            forcePipe: z.boolean(),
            preprocessorId: z.int(),
            preprocessorCommand: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zHashlistSingleResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/hashlists/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('hashlist'),
    attributes: z.object({
      name: z.string(),
      format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
      hashTypeId: z.string(),
      hashCount: z.int(),
      separator: z.string().nullable(),
      cracked: z.int(),
      isSecret: z.boolean(),
      isHexSalt: z.boolean(),
      isSalted: z.boolean(),
      accessGroupId: z.string(),
      notes: z.string(),
      useBrain: z.boolean(),
      brainFeatures: z.int(),
      isArchived: z.boolean()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/hashlists/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/hashlists/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/hashType'),
          related: z.string().default('/api/v2/ui/hashlists/hashType')
        }),
        data: z
          .object({
            type: z.literal('hashType'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashes: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/hashes'),
          related: z.string().default('/api/v2/ui/hashlists/hashes')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('hash'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      }),
      hashlists: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/hashlists'),
          related: z.string().default('/api/v2/ui/hashlists/hashlists')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('hashlist'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/tasks'),
          related: z.string().default('/api/v2/ui/hashlists/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hash'),
          attributes: z.object({
            hashlistId: z.string(),
            hash: z.string(),
            salt: z.string(),
            plaintext: z.string(),
            timeCracked: z.number(),
            chunkId: z.string().nullable(),
            isCracked: z.boolean(),
            crackPos: z.number()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.string(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.string(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('task'),
          attributes: z.object({
            taskName: z.string(),
            attackCmd: z.string(),
            chunkTime: z.int(),
            statusTimer: z.int(),
            keyspace: z.number(),
            keyspaceProgress: z.number(),
            priority: z.int(),
            maxAgents: z.int(),
            color: z.string().nullable(),
            isSmall: z.boolean(),
            isCpuTask: z.boolean(),
            useNewBench: z.boolean(),
            skipKeyspace: z.number(),
            crackerBinaryId: z.string(),
            crackerBinaryTypeId: z.string().nullable(),
            taskWrapperId: z.string(),
            isArchived: z.boolean(),
            notes: z.string(),
            staticChunks: z.int(),
            chunkSize: z.number(),
            forcePipe: z.boolean(),
            preprocessorId: z.int(),
            preprocessorCommand: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zHashlistPostPatchResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/hashlists/1')
  }),
  data: z.object({
    id: z.string().regex(/^[0-9]+$/),
    type: z.literal('hashlist'),
    attributes: z.object({
      name: z.string(),
      format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
      hashTypeId: z.string(),
      hashCount: z.int(),
      separator: z.string().nullable(),
      cracked: z.int(),
      isSecret: z.boolean(),
      isHexSalt: z.boolean(),
      isSalted: z.boolean(),
      accessGroupId: z.string(),
      notes: z.string(),
      useBrain: z.boolean(),
      brainFeatures: z.int(),
      isArchived: z.boolean()
    }),
    links: z.object({
      self: z.string().default('/api/v2/ui/hashlists/1')
    }),
    relationships: z.object({
      accessGroup: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/accessGroup'),
          related: z.string().default('/api/v2/ui/hashlists/accessGroup')
        }),
        data: z
          .object({
            type: z.literal('accessGroup'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashType: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/hashType'),
          related: z.string().default('/api/v2/ui/hashlists/hashType')
        }),
        data: z
          .object({
            type: z.literal('hashType'),
            id: z.string().regex(/^[0-9]+$/)
          })
          .nullish()
      }),
      hashes: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/hashes'),
          related: z.string().default('/api/v2/ui/hashlists/hashes')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('hash'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      }),
      hashlists: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/hashlists'),
          related: z.string().default('/api/v2/ui/hashlists/hashlists')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('hashlist'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      }),
      tasks: z.object({
        links: z.object({
          self: z.string().default('/api/v2/ui/hashlists/relationships/tasks'),
          related: z.string().default('/api/v2/ui/hashlists/tasks')
        }),
        data: z
          .array(
            z.object({
              type: z.literal('task'),
              id: z.string().regex(/^[0-9]+$/)
            })
          )
          .optional()
      })
    })
  }),
  included: z
    .array(
      z.union([
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hash'),
          attributes: z.object({
            hashlistId: z.string(),
            hash: z.string(),
            salt: z.string(),
            plaintext: z.string(),
            timeCracked: z.number(),
            chunkId: z.string().nullable(),
            isCracked: z.boolean(),
            crackPos: z.number()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.string(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.string(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('task'),
          attributes: z.object({
            taskName: z.string(),
            attackCmd: z.string(),
            chunkTime: z.int(),
            statusTimer: z.int(),
            keyspace: z.number(),
            keyspaceProgress: z.number(),
            priority: z.int(),
            maxAgents: z.int(),
            color: z.string().nullable(),
            isSmall: z.boolean(),
            isCpuTask: z.boolean(),
            useNewBench: z.boolean(),
            skipKeyspace: z.number(),
            crackerBinaryId: z.string(),
            crackerBinaryTypeId: z.string().nullable(),
            taskWrapperId: z.string(),
            isArchived: z.boolean(),
            notes: z.string(),
            staticChunks: z.int(),
            chunkSize: z.number(),
            forcePipe: z.boolean(),
            preprocessorId: z.int(),
            preprocessorCommand: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zHashlistListResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  links: z.object({
    self: z.string().default('/api/v2/ui/hashlists?page[size]=25'),
    first: z.string().default('/api/v2/ui/hashlists?page[size]=25'),
    last: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/hashlists?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    next: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/hashlists?page[size]=25&page[after]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
      ),
    prev: z
      .string()
      .nullable()
      .default(
        '/api/v2/ui/hashlists?page[size]=25&page[before]=eyJwcmltYXJ5Ijp7InNvbWVVbnFpdWVGaWVsZCI6MTIzfSwic2Vjb25kYXJ5Ijp7InNvbWVPdGhlck9wdGlvbmFsRmllbGQiOiJGb28ifX0='
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
      type: z.literal('hashlist'),
      attributes: z.object({
        name: z.string(),
        format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
        hashTypeId: z.string(),
        hashCount: z.int(),
        separator: z.string().nullable(),
        cracked: z.int(),
        isSecret: z.boolean(),
        isHexSalt: z.boolean(),
        isSalted: z.boolean(),
        accessGroupId: z.string(),
        notes: z.string(),
        useBrain: z.boolean(),
        brainFeatures: z.int(),
        isArchived: z.boolean()
      }),
      links: z.object({
        self: z.string().default('/api/v2/ui/hashlists/1')
      }),
      relationships: z.object({
        accessGroup: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/hashlists/relationships/accessGroup'),
            related: z.string().default('/api/v2/ui/hashlists/accessGroup')
          }),
          data: z
            .object({
              type: z.literal('accessGroup'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        }),
        hashType: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/hashlists/relationships/hashType'),
            related: z.string().default('/api/v2/ui/hashlists/hashType')
          }),
          data: z
            .object({
              type: z.literal('hashType'),
              id: z.string().regex(/^[0-9]+$/)
            })
            .nullish()
        }),
        hashes: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/hashlists/relationships/hashes'),
            related: z.string().default('/api/v2/ui/hashlists/hashes')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('hash'),
                id: z.string().regex(/^[0-9]+$/)
              })
            )
            .optional()
        }),
        hashlists: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/hashlists/relationships/hashlists'),
            related: z.string().default('/api/v2/ui/hashlists/hashlists')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('hashlist'),
                id: z.string().regex(/^[0-9]+$/)
              })
            )
            .optional()
        }),
        tasks: z.object({
          links: z.object({
            self: z.string().default('/api/v2/ui/hashlists/relationships/tasks'),
            related: z.string().default('/api/v2/ui/hashlists/tasks')
          }),
          data: z
            .array(
              z.object({
                type: z.literal('task'),
                id: z.string().regex(/^[0-9]+$/)
              })
            )
            .optional()
        })
      })
    })
  ),
  included: z
    .array(
      z.union([
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hash'),
          attributes: z.object({
            hashlistId: z.string(),
            hash: z.string(),
            salt: z.string(),
            plaintext: z.string(),
            timeCracked: z.number(),
            chunkId: z.string().nullable(),
            isCracked: z.boolean(),
            crackPos: z.number()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('hashlist'),
          attributes: z.object({
            name: z.string(),
            format: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
            hashTypeId: z.string(),
            hashCount: z.int(),
            separator: z.string().nullable(),
            cracked: z.int(),
            isSecret: z.boolean(),
            isHexSalt: z.boolean(),
            isSalted: z.boolean(),
            accessGroupId: z.string(),
            notes: z.string(),
            useBrain: z.boolean(),
            brainFeatures: z.int(),
            isArchived: z.boolean()
          })
        }),
        z.object({
          id: z.string().regex(/^[0-9]+$/),
          type: z.literal('task'),
          attributes: z.object({
            taskName: z.string(),
            attackCmd: z.string(),
            chunkTime: z.int(),
            statusTimer: z.int(),
            keyspace: z.number(),
            keyspaceProgress: z.number(),
            priority: z.int(),
            maxAgents: z.int(),
            color: z.string().nullable(),
            isSmall: z.boolean(),
            isCpuTask: z.boolean(),
            useNewBench: z.boolean(),
            skipKeyspace: z.number(),
            crackerBinaryId: z.string(),
            crackerBinaryTypeId: z.string().nullable(),
            taskWrapperId: z.string(),
            isArchived: z.boolean(),
            notes: z.string(),
            staticChunks: z.int(),
            chunkSize: z.number(),
            forcePipe: z.boolean(),
            preprocessorId: z.int(),
            preprocessorCommand: z.string()
          })
        })
      ])
    )
    .optional()
});

export const zHashlistCountResponse = z.object({
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

export const zHashlistRelationTasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zHashlistRelationTasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('tasks'),
      id: z.string().regex(/^[0-9]+$/)
    })
  )
});

export const zDeleteHashlistsBody = zHashlistDeleteMultiple;

/**
 * successfully deleted
 */
export const zDeleteHashlistsResponse = z.void();

export const zGetHashlistsQuery = z.object({
  'page[after]': z.string().optional(),
  'page[before]': z.string().optional(),
  'page[size]': z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
    .optional(),
  filter: z.record(z.string(), z.string()).optional(),
  include: z.array(z.enum(['accessGroup', 'hashType', 'hashes', 'hashlists', 'tasks'])).optional()
});

/**
 * successful operation
 */
export const zGetHashlistsResponse = zHashlistListResponse;

export const zPatchHashlistsBody = zHashlistPatchMultiple;

/**
 * successfully updated
 */
export const zPatchHashlistsResponse = z.void();

export const zPostHashlistsBody = zHashlistCreate;

/**
 * successful operation
 */
export const zPostHashlistsResponse = zHashlistPostPatchResponse;

export const zGetHashlistsCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetHashlistsCountResponse = zHashlistCountResponse;

export const zGetHashlistsByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetHashlistsByIdByRelationResponse = zHashlistRelationTasksGetResponse;

export const zDeleteHashlistsByIdRelationshipsByRelationBody = zHashlistRelationTasks;

export const zDeleteHashlistsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully deleted
 */
export const zDeleteHashlistsByIdRelationshipsByRelationResponse = z.void();

export const zGetHashlistsByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetHashlistsByIdRelationshipsByRelationResponse = zHashlistResponse;

export const zPatchHashlistsByIdRelationshipsByRelationBody = zHashlistRelationTasks;

export const zPatchHashlistsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchHashlistsByIdRelationshipsByRelationResponse = z.void();

export const zPostHashlistsByIdRelationshipsByRelationBody = zHashlistRelationTasks;

export const zPostHashlistsByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully created
 */
export const zPostHashlistsByIdRelationshipsByRelationResponse = z.void();

export const zDeleteHashlistsByIdPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteHashlistsByIdResponse = z.void();

export const zGetHashlistsByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetHashlistsByIdQuery = z.object({
  include: z.array(z.enum(['accessGroup', 'hashType', 'hashes', 'hashlists', 'tasks'])).optional()
});

/**
 * successful operation
 */
export const zGetHashlistsByIdResponse = zHashlistResponse;

export const zPatchHashlistsByIdBody = zHashlistPatch;

export const zPatchHashlistsByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zPatchHashlistsByIdResponse = zHashlistPostPatchResponse;
