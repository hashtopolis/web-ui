import * as z from 'zod';

import { zFileSingleResponse } from './file';
import { zHashlistSingleResponse } from './hashlist';
import { zSupertaskSingleResponse } from './supertask';
import { zTaskWrapperSingleResponse } from './task-wrapper';

export const zAbortChunkHelperApi = z.object({
  chunkId: z.int().optional()
});

export const zAbortChunkHelperApiResponse = z.array(
  z.object({
    Abort: z.string().optional().default('Success')
  })
);

export const zAssignAgentHelperApi = z.object({
  agentId: z.int().optional(),
  taskId: z.int().optional()
});

export const zAssignAgentHelperApiResponse = z.array(
  z.object({
    Assign: z.string().optional().default('Success')
  })
);

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

export const zChangeOwnPasswordHelperApiResponse = z.array(
  z.object({
    'Change password': z.string().optional().default('Password succesfully updated!')
  })
);

export const zCreateSuperHashlistHelperApi = z.object({
  hashlistIds: z.array(z.int()).optional(),
  name: z.string().optional()
});

export const zCreateSupertaskHelperApi = z.object({
  supertaskTemplateId: z.int().optional(),
  hashlistId: z.int().optional(),
  crackerVersionId: z.int().optional()
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

export const zImportCrackedHashesHelperApi = z.object({
  hashlistId: z.int().optional(),
  sourceType: z.string().optional(),
  sourceData: z.string().optional(),
  separator: z.string().optional(),
  overwrite: z.int().optional()
});

export const zImportCrackedHashesHelperApiResponse = z.array(
  z.object({
    totalLines: z.int().optional().default(100),
    newCracked: z.int().optional().default(5),
    alreadyCracked: z.int().optional().default(2),
    invalid: z.int().optional().default(1),
    notFound: z.int().optional().default(1),
    processTime: z.int().optional().default(60),
    tooLongPlaintexts: z.int().optional().default(4)
  })
);

export const zImportFileHelperApi = z.record(z.string(), z.unknown());

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

export const zPurgeTaskHelperApiResponse = z.array(
  z.object({
    Purge: z.string().optional().default('Success')
  })
);

export const zRebuildChunkCacheHelperApi = z.record(z.string(), z.unknown());

export const zRebuildChunkCacheHelperApiResponse = z.array(
  z.object({
    Rebuild: z.string().optional().default('Success')
  })
);

export const zRecountFileLinesHelperApi = z.object({
  fileId: z.int().optional()
});

export const zRescanGlobalFilesHelperApi = z.record(z.string(), z.unknown());

export const zRescanGlobalFilesHelperApiResponse = z.array(
  z.object({
    Rescan: z.string().optional().default('Success')
  })
);

export const zResetChunkHelperApi = z.object({
  chunkId: z.int().optional()
});

export const zResetChunkHelperApiResponse = z.array(
  z.object({
    Reset: z.string().optional().default('Success')
  })
);

export const zResetUserPasswordHelperApi = z.object({
  email: z.string().optional(),
  username: z.string().optional()
});

export const zResetUserPasswordHelperApiResponse = z.array(
  z.object({
    Reset: z.string().optional().default('Success')
  })
);

export const zSearchHashesHelperApi = z.object({
  searchData: z.string().optional(),
  separator: z.string().optional(),
  isSalted: z.boolean().optional()
});

export const zSearchHashesHelperApiResponse = z.array(
  z.object({
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
  })
);

export const zSetUserPasswordHelperApi = z.object({
  userId: z.int().optional(),
  password: z.string().optional()
});

export const zSetUserPasswordHelperApiResponse = z.array(
  z.object({
    'Set password': z.string().optional().default('Success')
  })
);

export const zUnassignAgentHelperApi = z.object({
  agentId: z.int().optional()
});

export const zUnassignAgentHelperApiResponse = z.array(
  z.object({
    Unassign: z.string().optional().default('Success')
  })
);

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

export const zPatchCurrentUserData = z.object({
  body: z.never().optional(),
  path: z.never().optional(),
  query: z.never().optional()
});

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

export const zPostImportFileResponse = z.union([z.unknown(), z.string()]);

export const zDeleteImportFileById09aF32Data = z.object({
  body: z.never().optional(),
  path: z.object({
    32: z.string(),
    id: z.int()
  }),
  query: z.never().optional()
});

export const zHeadImportFileById09aF32Data = z.object({
  body: z.never().optional(),
  path: z.object({
    32: z.string(),
    id: z.int()
  }),
  query: z.never().optional()
});

export const zPatchImportFileById09aF32Data = z.object({
  body: z.string(),
  path: z.object({
    32: z.string(),
    id: z.int()
  }),
  query: z.never().optional(),
  headers: z.object({
    'Upload-Offset': z.int(),
    'Content-Type': z.enum(['application/offset+octet-stream'])
  })
});

export const zPatchImportFileById09aF32Response = z.union([z.unknown(), z.void()]);

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
