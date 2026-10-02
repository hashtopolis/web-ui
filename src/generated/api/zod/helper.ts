import * as z from 'zod';

import { zAccessGroupResourceObject } from './access-group';
import { zToken } from './common';
import { zConfigResourceObject } from './config';
import { zFileSingleResponse } from './file';
import { zGlobalPermissionGroupResourceObject } from './global-permission-group';
import { zHashResourceObject } from './hash';
import { zHashlistSingleResponse } from './hashlist';
import { zSupertaskSingleResponse } from './supertask';
import { zTaskResourceObject } from './task';
import {
  zTaskWrapperDisplayCountResponse,
  zTaskWrapperDisplayListResponse,
  zTaskWrapperDisplayRelationTasks,
  zTaskWrapperDisplayRelationTasksGetResponse,
  zTaskWrapperDisplayResponse,
  zTaskWrapperSingleResponse
} from './task-wrapper';
import { zUserResourceObject } from './user';

export const zAbortChunkHelperApi = z.object({
  chunkId: z.int().optional()
});

export const zAbortChunkHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    Abort: z.string().optional().default('Success')
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zAssignAgentHelperApi = z.object({
  agentId: z.int().optional(),
  taskId: z.int().optional()
});

export const zAssignAgentHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    Assign: z.string().optional().default('Success')
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zBulkSupertaskBuilderHelperApi = z.object({
  name: z.string().optional(),
  isCpu: z.boolean().optional(),
  isSmall: z.boolean().optional(),
  crackerBinaryTypeId: z.int().optional(),
  benchtype: z.string().optional(),
  command: z.string().optional(),
  maxAgents: z.int().optional(),
  basefiles: z.array(z.int()).optional(),
  iterfiles: z.array(z.int()).optional()
});

export const zChangeOwnPasswordHelperApi = z.object({
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional()
});

export const zChangeOwnPasswordHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    'Change password': z.string().optional().default('Password succesfully updated!')
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zCreateSuperHashlistHelperApi = z.object({
  hashlistIds: z.array(z.int()).optional(),
  name: z.string().optional()
});

export const zCreateSupertaskHelperApi = z.object({
  supertaskTemplateId: z.int().optional(),
  hashlistId: z.int().optional(),
  crackerVersionId: z.int().optional()
});

export const zCurrentUserHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: zUserResourceObject
});

export const zExportCrackedHashesHelperApi = z.object({
  hashlistId: z.int().optional()
});

export const zExportLeftHashesHelperApi = z.object({
  hashlistId: z.int().optional()
});

export const zExportWordlistHelperApi = z.object({
  hashlistId: z.int().optional()
});

export const zGetAccessGroupsHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.array(zAccessGroupResourceObject)
});

export const zGetBestTasksAgentResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.array(zTaskResourceObject)
});

export const zGetCompletedCountHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    completedTasks: z.int().optional().default(5),
    completedSupertasks: z.int().optional().default(2)
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zGetCracksOfTaskHelperResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.array(zHashResourceObject)
});

export const zGetCracksPerDayHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.record(z.string(), z.int()),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zGetGlobalConfigHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: z.array(zConfigResourceObject)
});

export const zGetUserPermissionHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  data: zGlobalPermissionGroupResourceObject
});

export const zImportCrackedHashesHelperApi = z.object({
  hashlistId: z.int().optional(),
  sourceType: z.string().optional(),
  sourceData: z.string().optional(),
  separator: z.string().optional(),
  overwrite: z.int().optional()
});

export const zImportCrackedHashesHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    totalLines: z.int().optional().default(100),
    newCracked: z.int().optional().default(5),
    alreadyCracked: z.int().optional().default(2),
    invalid: z.int().optional().default(1),
    notFound: z.int().optional().default(1),
    processTime: z.int().optional().default(60),
    tooLongPlaintexts: z.int().optional().default(4)
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zImportFileHelperApi = z.record(z.string(), z.unknown());

export const zImportFileHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    file: z.string().optional().default('abc.txt'),
    size: z.int().optional().default(123)
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zMaskSupertaskBuilderHelperApi = z.object({
  name: z.string().optional(),
  isCpu: z.boolean().optional(),
  isSmall: z.boolean().optional(),
  optimized: z.boolean().optional(),
  crackerBinaryTypeId: z.int().optional(),
  benchtype: z.string().optional(),
  masks: z.string().optional(),
  maxAgents: z.int().optional()
});

export const zPurgeTaskHelperApi = z.object({
  taskId: z.int().optional()
});

export const zPurgeTaskHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    Purge: z.string().optional().default('Success')
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zRebuildChunkCacheHelperApi = z.record(z.string(), z.unknown());

export const zRebuildChunkCacheHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    Rebuild: z.string().optional().default('Success')
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zRecountFileLinesHelperApi = z.object({
  fileId: z.int().optional()
});

export const zRescanGlobalFilesHelperApi = z.record(z.string(), z.unknown());

export const zRescanGlobalFilesHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    Rescan: z.string().optional().default('Success')
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zResetChunkHelperApi = z.object({
  chunkId: z.int().optional()
});

export const zResetChunkHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    Reset: z.string().optional().default('Success')
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zResetUserPasswordHelperApi = z.object({
  email: z.string().optional(),
  username: z.string().optional()
});

export const zResetUserPasswordHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    Reset: z.string().optional().default('Success')
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zSearchHashesHelperApi = z.object({
  searchData: z.string().optional(),
  separator: z.string().optional(),
  isSalted: z.boolean().optional()
});

export const zSearchHashesHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    0: z.record(z.string(), z.unknown()).optional().default({ found: false, query: '12345678' }),
    1: z
      .record(z.string(), z.unknown())
      .optional()
      .default({
        found: true,
        query: '54321',
        matches: [
          {
            type: 'hash',
            id: 552,
            attributes: {
              hashlistId: 5,
              hash: '7682543218768',
              salt: '',
              plaintext: '',
              timeCracked: 0,
              chunkId: null,
              isCracked: false,
              crackPos: 0
            },
            links: { self: '/api/v2/ui/hashes/552' },
            relationships: {
              chunk: {
                links: { self: '/api/v2/ui/hashes/552/relationships/chunk', related: '/api/v2/ui/hashes/552/chunk' }
              },
              hashlist: {
                links: {
                  self: '/api/v2/ui/hashes/552/relationships/hashlist',
                  related: '/api/v2/ui/hashes/552/hashlist'
                }
              }
            }
          },
          {
            type: 'hash',
            id: 1,
            attributes: {
              hashlistId: 5,
              hash: '54321768671',
              salt: '',
              plaintext: '',
              timeCracked: 0,
              chunkId: null,
              isCracked: false,
              crackPos: 0
            },
            links: { self: '/api/v2/ui/hashes/1' },
            relationships: {
              chunk: {
                links: { self: '/api/v2/ui/hashes/1/relationships/chunk', related: '/api/v2/ui/hashes/1/chunk' }
              },
              hashlist: {
                links: { self: '/api/v2/ui/hashes/1/relationships/hashlist', related: '/api/v2/ui/hashes/1/hashlist' }
              }
            }
          }
        ]
      })
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zSetUserPasswordHelperApi = z.object({
  userId: z.int().optional(),
  password: z.string().optional()
});

export const zSetUserPasswordHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    'Set password': z.string().optional().default('Success')
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zUnassignAgentHelperApi = z.object({
  agentId: z.int().optional()
});

export const zUnassignAgentHelperApiResponse = z.object({
  jsonapi: z.object({
    version: z.string().default('1.1'),
    ext: z.array(z.string()).optional().default(['https://jsonapi.org/profiles/ethanresnick/cursor-pagination'])
  }),
  meta: z.object({
    Unassign: z.string().optional().default('Success')
  }),
  data: z.array(z.record(z.string(), z.unknown())).max(0)
});

export const zGetTaskwrapperdisplaysData = z.object({
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
      include: z.array(z.enum(['tasks'])).optional(),
      aggregate: z.record(z.string(), z.string()).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetTaskwrapperdisplaysResponse = zTaskWrapperDisplayListResponse;

export const zGetTaskwrapperdisplaysCountData = z.object({
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
export const zGetTaskwrapperdisplaysCountResponse = zTaskWrapperDisplayCountResponse;

export const zGetTaskwrapperdisplaysByIdByRelationData = z.object({
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
export const zGetTaskwrapperdisplaysByIdByRelationResponse = zTaskWrapperDisplayRelationTasksGetResponse;

export const zDeleteTaskwrapperdisplaysByIdRelationshipsByRelationData = z.object({
  body: zTaskWrapperDisplayRelationTasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully deleted
 */
export const zDeleteTaskwrapperdisplaysByIdRelationshipsByRelationResponse = z.void();

export const zGetTaskwrapperdisplaysByIdRelationshipsByRelationData = z.object({
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
export const zGetTaskwrapperdisplaysByIdRelationshipsByRelationResponse = zTaskWrapperDisplayResponse;

export const zPatchTaskwrapperdisplaysByIdRelationshipsByRelationData = z.object({
  body: zTaskWrapperDisplayRelationTasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * Successfull operation
 */
export const zPatchTaskwrapperdisplaysByIdRelationshipsByRelationResponse = z.void();

export const zPostTaskwrapperdisplaysByIdRelationshipsByRelationData = z.object({
  body: zTaskWrapperDisplayRelationTasks,
  path: z.object({
    id: z.int(),
    relation: z.string()
  }),
  query: z.never().optional()
});

/**
 * successfully created
 */
export const zPostTaskwrapperdisplaysByIdRelationshipsByRelationResponse = z.void();

export const zGetTaskwrapperdisplaysByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  }),
  query: z
    .object({
      include: z.array(z.enum(['tasks'])).optional()
    })
    .optional()
});

/**
 * successful operation
 */
export const zGetTaskwrapperdisplaysByIdResponse = zTaskWrapperDisplayResponse;

export const zPostAbortChunkData = z.object({
  body: zAbortChunkHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostAbortChunkResponse = zAbortChunkHelperApiResponse;

export const zPostAssignAgentData = z.object({
  body: zAssignAgentHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostAssignAgentResponse = zAssignAgentHelperApiResponse;

export const zPostBulkSupertaskBuilderData = z.object({
  body: zBulkSupertaskBuilderHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostBulkSupertaskBuilderResponse = zSupertaskSingleResponse;

export const zPostChangeOwnPasswordData = z.object({
  body: zChangeOwnPasswordHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostChangeOwnPasswordResponse = zChangeOwnPasswordHelperApiResponse;

export const zPostCreateSuperHashlistData = z.object({
  body: zCreateSuperHashlistHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostCreateSuperHashlistResponse = zHashlistSingleResponse;

export const zPostCreateSupertaskData = z.object({
  body: zCreateSupertaskHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostCreateSupertaskResponse = zTaskWrapperSingleResponse;

export const zGetCurrentUserData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetCurrentUserResponse = zCurrentUserHelperApiResponse;

export const zPatchCurrentUserData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * No content
 */
export const zPatchCurrentUserResponse = z.void();

export const zPostExportCrackedHashesData = z.object({
  body: zExportCrackedHashesHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostExportCrackedHashesResponse = zFileSingleResponse;

export const zPostExportLeftHashesData = z.object({
  body: zExportLeftHashesHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostExportLeftHashesResponse = zFileSingleResponse;

export const zPostExportWordlistData = z.object({
  body: zExportWordlistHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostExportWordlistResponse = zFileSingleResponse;

export const zGetGetAccessGroupsData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetGetAccessGroupsResponse = zGetAccessGroupsHelperApiResponse;

export const zGetGetAgentBinaryData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.object({
    agent: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  })
});

export const zGetGetBestTasksAgentData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.object({
    agent: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  })
});

/**
 * successful operation
 */
export const zGetGetBestTasksAgentResponse = zGetBestTasksAgentResponse;

export const zGetGetCompletedCountData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetGetCompletedCountResponse = zGetCompletedCountHelperApiResponse;

export const zGetGetCracksOfTaskData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.object({
    task: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  })
});

/**
 * successful operation
 */
export const zGetGetCracksOfTaskResponse = zGetCracksOfTaskHelperResponse;

export const zGetGetCracksPerDayData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetGetCracksPerDayResponse = zGetCracksPerDayHelperApiResponse;

export const zGetGetFileData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.object({
    file: z
      .int()
      .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
      .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
  })
});

export const zGetGetGlobalConfigData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetGetGlobalConfigResponse = zGetGlobalConfigHelperApiResponse;

export const zGetGetTaskProgressImageData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z
    .object({
      supertask: z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional(),
      task: z
        .int()
        .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
        .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
        .optional()
    })
    .optional()
});

export const zGetGetUserPermissionData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetGetUserPermissionResponse = zGetUserPermissionHelperApiResponse;

export const zPostImportCrackedHashesData = z.object({
  body: zImportCrackedHashesHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostImportCrackedHashesResponse = zImportCrackedHashesHelperApiResponse;

export const zGetImportFileData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zGetImportFileResponse = zImportFileHelperApiResponse;

export const zPostImportFileData = z.object({
  body: zImportFileHelperApi,
  path: z.never().optional(),
  query: z.never().optional(),
  headers: z.object({
    'Upload-Metadata': z.string().regex(/^([a-zA-Z0-9]+ [A-Za-z0-9+\/=]+)(,[a-zA-Z0-9]+ [A-Za-z0-9+\/=]+)*$/),
    'Upload-Length': z.int().gte(1).optional(),
    'Upload-Defer-Length': z.int().optional()
  })
});

export const zPostImportFileResponse = z.union([zImportFileHelperApiResponse, z.unknown()]);

export const zDeleteImportFileByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zDeleteImportFileByIdResponse = zImportFileHelperApiResponse;

export const zHeadImportFileByIdData = z.object({
  body: z.never().optional(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional()
});

export const zPatchImportFileByIdData = z.object({
  body: z.string(),
  path: z.object({
    id: z.int()
  }),
  query: z.never().optional(),
  headers: z.object({
    'Upload-Offset': z.int(),
    'Content-Type': z.enum(['application/offset+octet-stream'])
  })
});

export const zPatchImportFileByIdResponse = z.union([zImportFileHelperApiResponse, z.void()]);

export const zPostMaskSupertaskBuilderData = z.object({
  body: zMaskSupertaskBuilderHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostMaskSupertaskBuilderResponse = zSupertaskSingleResponse;

export const zPostPurgeTaskData = z.object({
  body: zPurgeTaskHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostPurgeTaskResponse = zPurgeTaskHelperApiResponse;

export const zPostRebuildChunkCacheData = z.object({
  body: zRebuildChunkCacheHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostRebuildChunkCacheResponse = zRebuildChunkCacheHelperApiResponse;

export const zPostRecountFileLinesData = z.object({
  body: zRecountFileLinesHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostRecountFileLinesResponse = zFileSingleResponse;

export const zPostRescanGlobalFilesData = z.object({
  body: zRescanGlobalFilesHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostRescanGlobalFilesResponse = zRescanGlobalFilesHelperApiResponse;

export const zPostResetChunkData = z.object({
  body: zResetChunkHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostResetChunkResponse = zResetChunkHelperApiResponse;

export const zPostResetUserPasswordData = z.object({
  body: zResetUserPasswordHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostResetUserPasswordResponse = zResetUserPasswordHelperApiResponse;

export const zPostSearchHashesData = z.object({
  body: zSearchHashesHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostSearchHashesResponse = zSearchHashesHelperApiResponse;

export const zPostSetUserPasswordData = z.object({
  body: zSetUserPasswordHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostSetUserPasswordResponse = zSetUserPasswordHelperApiResponse;

export const zPostUnassignAgentData = z.object({
  body: zUnassignAgentHelperApi,
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * successful operation
 */
export const zPostUnassignAgentResponse = zUnassignAgentHelperApiResponse;

export const zDeleteRefreshData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * Success
 */
export const zDeleteRefreshResponse = z.void();

export const zPostRefreshData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

/**
 * Success
 */
export const zPostRefreshResponse = zToken;
