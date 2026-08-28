import * as z from 'zod';

import { zAccessGroupSingleResponse } from './access-group';
import { zConfigSingleResponse } from './config';
import { zFileSingleResponse } from './file';
import { zGlobalPermissionGroupSingleResponse } from './global-permission-group';
import { zHashSingleResponse } from './hash';
import { zHashlistSingleResponse } from './hashlist';
import { zSupertaskSingleResponse } from './supertask';
import { zTaskSingleResponse } from './task';
import {
  zTaskWrapperDisplayCountResponse,
  zTaskWrapperDisplayListResponse,
  zTaskWrapperDisplayRelationTasks,
  zTaskWrapperDisplayRelationTasksGetResponse,
  zTaskWrapperDisplayResponse,
  zTaskWrapperSingleResponse
} from './task-wrapper';
import { zUserSingleResponse } from './user';

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

export const zGetTaskwrapperdisplaysQuery = z.object({
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
});

/**
 * successful operation
 */
export const zGetTaskwrapperdisplaysResponse = zTaskWrapperDisplayListResponse;

export const zGetTaskwrapperdisplaysCountQuery = z.object({
  filter: z.record(z.string(), z.string()).optional(),
  include_total: z.boolean().optional()
});

/**
 * successful operation
 */
export const zGetTaskwrapperdisplaysCountResponse = zTaskWrapperDisplayCountResponse;

export const zGetTaskwrapperdisplaysByIdByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetTaskwrapperdisplaysByIdByRelationResponse = zTaskWrapperDisplayRelationTasksGetResponse;

export const zDeleteTaskwrapperdisplaysByIdRelationshipsByRelationBody = zTaskWrapperDisplayRelationTasks;

export const zDeleteTaskwrapperdisplaysByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully deleted
 */
export const zDeleteTaskwrapperdisplaysByIdRelationshipsByRelationResponse = z.void();

export const zGetTaskwrapperdisplaysByIdRelationshipsByRelationPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' }),
  relation: z.string()
});

/**
 * successful operation
 */
export const zGetTaskwrapperdisplaysByIdRelationshipsByRelationResponse = zTaskWrapperDisplayResponse;

export const zPatchTaskwrapperdisplaysByIdRelationshipsByRelationBody = zTaskWrapperDisplayRelationTasks;

export const zPatchTaskwrapperdisplaysByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * Successfull operation
 */
export const zPatchTaskwrapperdisplaysByIdRelationshipsByRelationResponse = z.void();

export const zPostTaskwrapperdisplaysByIdRelationshipsByRelationBody = zTaskWrapperDisplayRelationTasks;

export const zPostTaskwrapperdisplaysByIdRelationshipsByRelationPath = z.object({
  id: z.int(),
  relation: z.string()
});

/**
 * successfully created
 */
export const zPostTaskwrapperdisplaysByIdRelationshipsByRelationResponse = z.void();

export const zGetTaskwrapperdisplaysByIdPath = z.object({
  id: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetTaskwrapperdisplaysByIdQuery = z.object({
  include: z.array(z.enum(['tasks'])).optional()
});

/**
 * successful operation
 */
export const zGetTaskwrapperdisplaysByIdResponse = zTaskWrapperDisplayResponse;

/**
 * ChunkID is the ID of the chunk that needs to be aborted.
 */
export const zPostAbortChunkBody = zAbortChunkHelperApi;

/**
 * successful operation
 */
export const zPostAbortChunkResponse = zAbortChunkHelperApiResponse;

/**
 * The agentId is the Id of the agent that has to be assigned to the task.<br />The taskId is the Id of the task that will be assigned to the agent. If this is set to 0,<br />the agent will be unassigned from its current assigned task.
 */
export const zPostAssignAgentBody = zAssignAgentHelperApi;

/**
 * successful operation
 */
export const zPostAssignAgentResponse = zAssignAgentHelperApiResponse;

export const zPostBulkSupertaskBuilderBody = zBulkSupertaskBuilderHelperApi;

/**
 * successful operation
 */
export const zPostBulkSupertaskBuilderResponse = zSupertaskSingleResponse;

/**
 * oldPassword is the current password of the user.<br />newPassword is the new password that you want to set.<br />confirmPassword is the new password again to confirm it.
 */
export const zPostChangeOwnPasswordBody = zChangeOwnPasswordHelperApi;

/**
 * successful operation
 */
export const zPostChangeOwnPasswordResponse = zChangeOwnPasswordHelperApiResponse;

/**
 * HashlistIds is an array of hashlist ids of the hashlists that have to be combined into a superHashlist.<br />Name is the name of the newly created superHashlist.
 */
export const zPostCreateSuperHashlistBody = zCreateSuperHashlistHelperApi;

/**
 * successful operation
 */
export const zPostCreateSuperHashlistResponse = zHashlistSingleResponse;

/**
 * supertaskTemplateId is the the Id of the supertasktemplate of which you want to create a supertask of.<br />hashlistId is the Id of the hashlist that has to be used for the supertask.<br />crackerVersionId is the Id of the crackerversion that is used for the created supertask.
 */
export const zPostCreateSupertaskBody = zCreateSupertaskHelperApi;

/**
 * successful operation
 */
export const zPostCreateSupertaskResponse = zTaskWrapperSingleResponse;

/**
 * successful operation
 */
export const zGetCurrentUserResponse = zUserSingleResponse;

/**
 * successful operation
 */
export const zPatchCurrentUserResponse = zUserSingleResponse;

/**
 * hashlistId is the Id of the hashlist where you want to export the hashes of.
 */
export const zPostExportCrackedHashesBody = zExportCrackedHashesHelperApi;

/**
 * successful operation
 */
export const zPostExportCrackedHashesResponse = zFileSingleResponse;

/**
 * hashlistId is the id of the hashlist where you want to export the uncracked hashes of.
 */
export const zPostExportLeftHashesBody = zExportLeftHashesHelperApi;

/**
 * successful operation
 */
export const zPostExportLeftHashesResponse = zFileSingleResponse;

/**
 * hashlistId is the Id of the hashlist where you want to export the wordlist of.
 */
export const zPostExportWordlistBody = zExportWordlistHelperApi;

/**
 * successful operation
 */
export const zPostExportWordlistResponse = zFileSingleResponse;

/**
 * successful operation
 */
export const zGetGetAccessGroupsResponse = zAccessGroupSingleResponse;

export const zGetGetAgentBinaryQuery = z.object({
  agent: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

export const zGetGetBestTasksAgentQuery = z.object({
  agent: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetGetBestTasksAgentResponse = zTaskSingleResponse;

/**
 * successful operation
 */
export const zGetGetCompletedCountResponse = zTaskSingleResponse;

export const zGetGetCracksOfTaskQuery = z.object({
  task: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetGetCracksOfTaskResponse = zHashSingleResponse;

export const zGetGetFileQuery = z.object({
  file: z
    .int()
    .min(-2147483648, { error: 'Invalid value: Expected int32 to be >= -2147483648' })
    .max(2147483647, { error: 'Invalid value: Expected int32 to be <= 2147483647' })
});

/**
 * successful operation
 */
export const zGetGetGlobalConfigResponse = zConfigSingleResponse;

export const zGetGetTaskProgressImageQuery = z.object({
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
});

/**
 * successful operation
 */
export const zGetGetUserPermissionResponse = zGlobalPermissionGroupSingleResponse;

/**
 * HashlistId is the Id of the hashlist where you want to import the cracked hashes into.<br />SourceData is the cracked hashes you want to import.<br />Seperator is the seperator that has been used for the salt in the hashes.
 */
export const zPostImportCrackedHashesBody = zImportCrackedHashesHelperApi;

/**
 * successful operation
 */
export const zPostImportCrackedHashesResponse = zImportCrackedHashesHelperApiResponse;

/**
 * successful operation
 */
export const zGetImportFileResponse = zImportFileHelperApiResponse;

/**
 * Import file has no POST parameters
 */
export const zPostImportFileBody = zImportFileHelperApi;

export const zPostImportFileHeaders = z.object({
  'Upload-Metadata': z.string().regex(/^([a-zA-Z0-9]+ [A-Za-z0-9+\/=]+)(,[a-zA-Z0-9]+ [A-Za-z0-9+\/=]+)*$/),
  'Upload-Length': z.int().gte(1).optional(),
  'Upload-Defer-Length': z.int().optional()
});

export const zPostImportFileResponse = z.union([zImportFileHelperApiResponse, z.unknown()]);

export const zDeleteImportFileByIdPath = z.object({
  id: z.int()
});

/**
 * successful operation
 */
export const zDeleteImportFileByIdResponse = zImportFileHelperApiResponse;

export const zHeadImportFileByIdPath = z.object({
  id: z.int()
});

/**
 * The binary data to push to the file
 */
export const zPatchImportFileByIdBody = z.string();

export const zPatchImportFileByIdHeaders = z.object({
  'Upload-Offset': z.int(),
  'Content-Type': z.enum(['application/offset+octet-stream'])
});

export const zPatchImportFileByIdPath = z.object({
  id: z.int()
});

export const zPatchImportFileByIdResponse = z.union([zImportFileHelperApiResponse, z.void()]);

export const zPostMaskSupertaskBuilderBody = zMaskSupertaskBuilderHelperApi;

/**
 * successful operation
 */
export const zPostMaskSupertaskBuilderResponse = zSupertaskSingleResponse;

/**
 * taskId is the id of the task that should be purged.
 */
export const zPostPurgeTaskBody = zPurgeTaskHelperApi;

/**
 * successful operation
 */
export const zPostPurgeTaskResponse = zPurgeTaskHelperApiResponse;

export const zPostRebuildChunkCacheBody = zRebuildChunkCacheHelperApi;

/**
 * successful operation
 */
export const zPostRebuildChunkCacheResponse = zRebuildChunkCacheHelperApiResponse;

/**
 * FileId is the id of the file that needs to be recounted.
 */
export const zPostRecountFileLinesBody = zRecountFileLinesHelperApi;

/**
 * successful operation
 */
export const zPostRecountFileLinesResponse = zFileSingleResponse;

export const zPostRescanGlobalFilesBody = zRescanGlobalFilesHelperApi;

/**
 * successful operation
 */
export const zPostRescanGlobalFilesResponse = zRescanGlobalFilesHelperApiResponse;

/**
 * chunkId is the id of the chunk which you want to reset.
 */
export const zPostResetChunkBody = zResetChunkHelperApi;

/**
 * successful operation
 */
export const zPostResetChunkResponse = zResetChunkHelperApiResponse;

export const zPostResetUserPasswordBody = zResetUserPasswordHelperApi;

/**
 * successful operation
 */
export const zPostResetUserPasswordResponse = zResetUserPasswordHelperApiResponse;

export const zPostSearchHashesBody = zSearchHashesHelperApi;

/**
 * successful operation
 */
export const zPostSearchHashesResponse = zSearchHashesHelperApiResponse;

/**
 * userId is the id of the user of which you want to change the password.<br />password is the new password that you want to set.
 */
export const zPostSetUserPasswordBody = zSetUserPasswordHelperApi;

/**
 * successful operation
 */
export const zPostSetUserPasswordResponse = zSetUserPasswordHelperApiResponse;

/**
 * agentId is the id of the agent which you want to unassign.
 */
export const zPostUnassignAgentBody = zUnassignAgentHelperApi;

/**
 * successful operation
 */
export const zPostUnassignAgentResponse = zUnassignAgentHelperApiResponse;
