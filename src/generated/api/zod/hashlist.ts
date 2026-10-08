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
      hashTypeId: z.int(),
      hashCount: z.int(),
      separator: z.string().nullish(),
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
});

export const zHashlistPatch = z.object({
  data: z.object({
    type: z.literal('hashlist'),
    attributes: z.object({
      accessGroupId: z.int().optional(),
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
      id: z.int(),
      type: z.literal('hashlist'),
      attributes: z.object({
        accessGroupId: z.int().optional(),
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
      id: z.int(),
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
            id: z.int()
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
            id: z.int()
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
              id: z.int()
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
              id: z.int()
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
              id: z.int()
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
          id: z.int(),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
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
        }),
        z.object({
          id: z.int(),
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
            crackerBinaryId: z.int(),
            crackerBinaryTypeId: z.int().nullable(),
            taskWrapperId: z.int(),
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
            id: z.int()
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
            id: z.int()
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
              id: z.int()
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
              id: z.int()
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
              id: z.int()
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
          id: z.int(),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
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
        }),
        z.object({
          id: z.int(),
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
            crackerBinaryId: z.int(),
            crackerBinaryTypeId: z.int().nullable(),
            taskWrapperId: z.int(),
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
            id: z.int()
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
            id: z.int()
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
              id: z.int()
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
              id: z.int()
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
              id: z.int()
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
          id: z.int(),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
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
        }),
        z.object({
          id: z.int(),
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
            crackerBinaryId: z.int(),
            crackerBinaryTypeId: z.int().nullable(),
            taskWrapperId: z.int(),
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
              id: z.int()
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
              id: z.int()
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
                id: z.int()
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
                id: z.int()
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
                id: z.int()
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
          id: z.int(),
          type: z.literal('accessGroup'),
          attributes: z.object({
            groupName: z.string()
          })
        }),
        z.object({
          id: z.int(),
          type: z.literal('hashType'),
          attributes: z.object({
            description: z.string(),
            isSalted: z.boolean(),
            isSlowHash: z.boolean()
          })
        }),
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
        }),
        z.object({
          id: z.int(),
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
            crackerBinaryId: z.int(),
            crackerBinaryTypeId: z.int().nullable(),
            taskWrapperId: z.int(),
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

export const zHashlistRelationAccessGroup = z.object({
  data: z.object({
    type: z.literal('accessGroup'),
    id: z.int()
  })
});

export const zHashlistRelationAccessGroupGetResponse = z.object({
  data: z.object({
    type: z.literal('accessGroup'),
    id: z.int()
  })
});

export const zHashlistRelationHashType = z.object({
  data: z.object({
    type: z.literal('hashType'),
    id: z.int()
  })
});

export const zHashlistRelationHashTypeGetResponse = z.object({
  data: z.object({
    type: z.literal('hashType'),
    id: z.int()
  })
});

export const zHashlistRelationHashes = z.object({
  data: z.array(
    z.object({
      type: z.literal('hash'),
      id: z.int()
    })
  )
});

export const zHashlistRelationHashesGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('hash'),
      id: z.int()
    })
  )
});

export const zHashlistRelationHashlists = z.object({
  data: z.array(
    z.object({
      type: z.literal('hashlist'),
      id: z.int()
    })
  )
});

export const zHashlistRelationHashlistsGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('hashlist'),
      id: z.int()
    })
  )
});

export const zHashlistRelationTasks = z.object({
  data: z.array(
    z.object({
      type: z.literal('task'),
      id: z.int()
    })
  )
});

export const zHashlistRelationTasksGetResponse = z.object({
  data: z.array(
    z.object({
      type: z.literal('task'),
      id: z.int()
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

export const zGetHashlistsByIdAccessGroupPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashlistsByIdAccessGroupResponse = zHashlistRelationAccessGroupGetResponse;

export const zGetHashlistsByIdRelationshipsAccessGroupPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashlistsByIdRelationshipsAccessGroupResponse = zHashlistResponse;

export const zPatchHashlistsByIdRelationshipsAccessGroupBody = zHashlistRelationAccessGroup;

export const zPatchHashlistsByIdRelationshipsAccessGroupPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchHashlistsByIdRelationshipsAccessGroupResponse = z.void();

export const zGetHashlistsByIdHashTypePath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashlistsByIdHashTypeResponse = zHashlistRelationHashTypeGetResponse;

export const zGetHashlistsByIdRelationshipsHashTypePath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashlistsByIdRelationshipsHashTypeResponse = zHashlistResponse;

export const zPatchHashlistsByIdRelationshipsHashTypeBody = zHashlistRelationHashType;

export const zPatchHashlistsByIdRelationshipsHashTypePath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchHashlistsByIdRelationshipsHashTypeResponse = z.void();

export const zGetHashlistsByIdHashesPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashlistsByIdHashesResponse = zHashlistRelationHashesGetResponse;

export const zDeleteHashlistsByIdRelationshipsHashesBody = zHashlistRelationHashes;

export const zDeleteHashlistsByIdRelationshipsHashesPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteHashlistsByIdRelationshipsHashesResponse = z.void();

export const zGetHashlistsByIdRelationshipsHashesPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashlistsByIdRelationshipsHashesResponse = zHashlistResponse;

export const zPatchHashlistsByIdRelationshipsHashesBody = zHashlistRelationHashes;

export const zPatchHashlistsByIdRelationshipsHashesPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchHashlistsByIdRelationshipsHashesResponse = z.void();

export const zPostHashlistsByIdRelationshipsHashesBody = zHashlistRelationHashes;

export const zPostHashlistsByIdRelationshipsHashesPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostHashlistsByIdRelationshipsHashesResponse = z.void();

export const zGetHashlistsByIdHashlistsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashlistsByIdHashlistsResponse = zHashlistRelationHashlistsGetResponse;

export const zDeleteHashlistsByIdRelationshipsHashlistsBody = zHashlistRelationHashlists;

export const zDeleteHashlistsByIdRelationshipsHashlistsPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteHashlistsByIdRelationshipsHashlistsResponse = z.void();

export const zGetHashlistsByIdRelationshipsHashlistsPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashlistsByIdRelationshipsHashlistsResponse = zHashlistResponse;

export const zPatchHashlistsByIdRelationshipsHashlistsBody = zHashlistRelationHashlists;

export const zPatchHashlistsByIdRelationshipsHashlistsPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchHashlistsByIdRelationshipsHashlistsResponse = z.void();

export const zPostHashlistsByIdRelationshipsHashlistsBody = zHashlistRelationHashlists;

export const zPostHashlistsByIdRelationshipsHashlistsPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostHashlistsByIdRelationshipsHashlistsResponse = z.void();

export const zGetHashlistsByIdTasksPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashlistsByIdTasksResponse = zHashlistRelationTasksGetResponse;

export const zDeleteHashlistsByIdRelationshipsTasksBody = zHashlistRelationTasks;

export const zDeleteHashlistsByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * successfully deleted
 */
export const zDeleteHashlistsByIdRelationshipsTasksResponse = z.void();

export const zGetHashlistsByIdRelationshipsTasksPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetHashlistsByIdRelationshipsTasksResponse = zHashlistResponse;

export const zPatchHashlistsByIdRelationshipsTasksBody = zHashlistRelationTasks;

export const zPatchHashlistsByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * Successfull operation
 */
export const zPatchHashlistsByIdRelationshipsTasksResponse = z.void();

export const zPostHashlistsByIdRelationshipsTasksBody = zHashlistRelationTasks;

export const zPostHashlistsByIdRelationshipsTasksPath = z.object({
  id: z.int()
});

/**
 * successfully created
 */
export const zPostHashlistsByIdRelationshipsTasksResponse = z.void();

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
