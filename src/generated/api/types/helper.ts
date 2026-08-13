import type { AccessGroupSingleResponse } from './access-group';
import type { ErrorResponse } from './common';
import type { ConfigSingleResponse } from './config';
import type { FileSingleResponse } from './file';
import type { GlobalPermissionGroupSingleResponse } from './global-permission-group';
import type { HashSingleResponse } from './hash';
import type { HashlistSingleResponse } from './hashlist';
import type { SupertaskSingleResponse } from './supertask';
import type { TaskSingleResponse } from './task';
import type {
  TaskWrapperDisplayCountResponse,
  TaskWrapperDisplayListResponse,
  TaskWrapperDisplayRelationTasks,
  TaskWrapperDisplayRelationTasksGetResponse,
  TaskWrapperDisplayResponse,
  TaskWrapperSingleResponse
} from './task-wrapper';
import type { UserSingleResponse } from './user';

export type AbortChunkHelperApi = {
  chunkId?: number;
};

export type AbortChunkHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    Abort?: string;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type AssignAgentHelperApi = {
  agentId?: number;
  taskId?: number;
};

export type AssignAgentHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    Assign?: string;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type BulkSupertaskBuilderHelperApi = {
  name?: string;
  isCpu?: boolean;
  isSmall?: boolean;
  crackerBinaryTypeId?: number;
  benchtype?: string;
  command?: string;
  maxAgents?: number;
  basefiles?: Array<number>;
  iterfiles?: Array<number>;
};

export type ChangeOwnPasswordHelperApi = {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export type ChangeOwnPasswordHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    'Change password'?: string;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type CreateSuperHashlistHelperApi = {
  hashlistIds?: Array<number>;
  name?: string;
};

export type CreateSupertaskHelperApi = {
  supertaskTemplateId?: number;
  hashlistId?: number;
  crackerVersionId?: number;
};

export type ExportCrackedHashesHelperApi = {
  hashlistId?: number;
};

export type ExportLeftHashesHelperApi = {
  hashlistId?: number;
};

export type ExportWordlistHelperApi = {
  hashlistId?: number;
};

export type ImportCrackedHashesHelperApi = {
  hashlistId?: number;
  sourceType?: string;
  sourceData?: string;
  separator?: string;
  overwrite?: number;
};

export type ImportCrackedHashesHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    totalLines?: number;
    newCracked?: number;
    alreadyCracked?: number;
    invalid?: number;
    notFound?: number;
    processTime?: number;
    tooLongPlaintexts?: number;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type ImportFileHelperApi = {
  [key: string]: unknown;
};

export type ImportFileHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    file?: string;
    size?: number;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type MaskSupertaskBuilderHelperApi = {
  name?: string;
  isCpu?: boolean;
  isSmall?: boolean;
  optimized?: boolean;
  crackerBinaryTypeId?: number;
  benchtype?: string;
  masks?: string;
  maxAgents?: number;
};

export type PurgeTaskHelperApi = {
  taskId?: number;
};

export type PurgeTaskHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    Purge?: string;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type RebuildChunkCacheHelperApi = {
  [key: string]: unknown;
};

export type RebuildChunkCacheHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    Rebuild?: string;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type RecountFileLinesHelperApi = {
  fileId?: number;
};

export type RescanGlobalFilesHelperApi = {
  [key: string]: unknown;
};

export type RescanGlobalFilesHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    Rescan?: string;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type ResetChunkHelperApi = {
  chunkId?: number;
};

export type ResetChunkHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    Reset?: string;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type ResetUserPasswordHelperApi = {
  email?: string;
  username?: string;
};

export type ResetUserPasswordHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    Reset?: string;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type SearchHashesHelperApi = {
  searchData?: string;
  separator?: string;
  isSalted?: boolean;
};

export type SearchHashesHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    0?: {
      [key: string]: unknown;
    };
    1?: {
      [key: string]: unknown;
    };
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type SetUserPasswordHelperApi = {
  userId?: number;
  password?: string;
};

export type SetUserPasswordHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    'Set password'?: string;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type UnassignAgentHelperApi = {
  agentId?: number;
};

export type UnassignAgentHelperApiResponse = {
  jsonapi: {
    version: string;
    ext?: Array<string>;
  };
  meta: {
    Unassign?: string;
  };
  /**
   * Always empty: a helper answers with meta only.
   */
  data: Array<{
    [key: string]: unknown;
  }>;
};

export type GetTaskwrapperdisplaysData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Pointer to paginate to retrieve the data after the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"taskWrapperId": 123}}` -> `eyJwcmltYXJ5Ijp7InRhc2tXcmFwcGVySWQiOiAxMjN9fQ==`
     */
    'page[after]'?: string;
    /**
     * Pointer to paginate to retrieve the data before the object provided. Specify the `base64` encoded JSON string in a **uniquely identifiable** manner (e.g. object IDs), i.e. by using one (primary) or two (primary and secondary) fields that allow for **stable** sorting.
     *
     *
     * Format: `{"primary":{"someField": 123},"secondary":{"someOtherOptionalField": "Foo"}}`
     *
     *
     * Example: `{"primary":{"taskWrapperId": 123}}` -> `eyJwcmltYXJ5Ijp7InRhc2tXcmFwcGVySWQiOiAxMjN9fQ==`
     */
    'page[before]'?: string;
    /**
     * Amout of data to retrieve inside a single page
     */
    'page[size]'?: number;
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[taskWrapperId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Relationships to include in the response, comma seperated. Possible options: tasks
     */
    include?: Array<'tasks'>;
    /**
     * Aggregated fields to include by type (comma separated values). Possible options: taskwrapperdisplay: totalAssignedAgents, dispatched, searched, status, currentSpeed, estimatedTime, cprogress, timeSpent
     */
    aggregate?: {
      [key: string]: string;
    };
  };
  url: '/api/v2/ui/taskwrapperdisplays';
};

export type GetTaskwrapperdisplaysErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetTaskwrapperdisplaysError = GetTaskwrapperdisplaysErrors[keyof GetTaskwrapperdisplaysErrors];

export type GetTaskwrapperdisplaysResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperDisplayListResponse;
};

export type GetTaskwrapperdisplaysResponse = GetTaskwrapperdisplaysResponses[keyof GetTaskwrapperdisplaysResponses];

export type GetTaskwrapperdisplaysCountData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * Filters results using a query. Every key is an attribute name optionally suffixed with a comparison operator, e.g. `filter[taskWrapperId__gt]=200`.
     */
    filter?: {
      [key: string]: string;
    };
    /**
     * Also report the number of objects without any filter applied, as `meta.total_count`
     */
    include_total?: boolean;
  };
  url: '/api/v2/ui/taskwrapperdisplays/count';
};

export type GetTaskwrapperdisplaysCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
};

export type GetTaskwrapperdisplaysCountError =
  GetTaskwrapperdisplaysCountErrors[keyof GetTaskwrapperdisplaysCountErrors];

export type GetTaskwrapperdisplaysCountResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperDisplayCountResponse;
};

export type GetTaskwrapperdisplaysCountResponse =
  GetTaskwrapperdisplaysCountResponses[keyof GetTaskwrapperdisplaysCountResponses];

export type GetTaskwrapperdisplaysByIdByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/taskwrapperdisplays/{id}/{relation}';
};

export type GetTaskwrapperdisplaysByIdByRelationErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetTaskwrapperdisplaysByIdByRelationError =
  GetTaskwrapperdisplaysByIdByRelationErrors[keyof GetTaskwrapperdisplaysByIdByRelationErrors];

export type GetTaskwrapperdisplaysByIdByRelationResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperDisplayRelationTasksGetResponse;
};

export type GetTaskwrapperdisplaysByIdByRelationResponse =
  GetTaskwrapperdisplaysByIdByRelationResponses[keyof GetTaskwrapperdisplaysByIdByRelationResponses];

export type DeleteTaskwrapperdisplaysByIdRelationshipsByRelationData = {
  body: TaskWrapperDisplayRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/taskwrapperdisplays/{id}/relationships/{relation}';
};

export type DeleteTaskwrapperdisplaysByIdRelationshipsByRelationErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type DeleteTaskwrapperdisplaysByIdRelationshipsByRelationError =
  DeleteTaskwrapperdisplaysByIdRelationshipsByRelationErrors[keyof DeleteTaskwrapperdisplaysByIdRelationshipsByRelationErrors];

export type DeleteTaskwrapperdisplaysByIdRelationshipsByRelationResponses = {
  /**
   * successfully deleted
   */
  204: void;
};

export type DeleteTaskwrapperdisplaysByIdRelationshipsByRelationResponse =
  DeleteTaskwrapperdisplaysByIdRelationshipsByRelationResponses[keyof DeleteTaskwrapperdisplaysByIdRelationshipsByRelationResponses];

export type GetTaskwrapperdisplaysByIdRelationshipsByRelationData = {
  body?: never;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/taskwrapperdisplays/{id}/relationships/{relation}';
};

export type GetTaskwrapperdisplaysByIdRelationshipsByRelationErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetTaskwrapperdisplaysByIdRelationshipsByRelationError =
  GetTaskwrapperdisplaysByIdRelationshipsByRelationErrors[keyof GetTaskwrapperdisplaysByIdRelationshipsByRelationErrors];

export type GetTaskwrapperdisplaysByIdRelationshipsByRelationResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperDisplayResponse;
};

export type GetTaskwrapperdisplaysByIdRelationshipsByRelationResponse =
  GetTaskwrapperdisplaysByIdRelationshipsByRelationResponses[keyof GetTaskwrapperdisplaysByIdRelationshipsByRelationResponses];

export type PatchTaskwrapperdisplaysByIdRelationshipsByRelationData = {
  body: TaskWrapperDisplayRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/taskwrapperdisplays/{id}/relationships/{relation}';
};

export type PatchTaskwrapperdisplaysByIdRelationshipsByRelationErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
};

export type PatchTaskwrapperdisplaysByIdRelationshipsByRelationError =
  PatchTaskwrapperdisplaysByIdRelationshipsByRelationErrors[keyof PatchTaskwrapperdisplaysByIdRelationshipsByRelationErrors];

export type PatchTaskwrapperdisplaysByIdRelationshipsByRelationResponses = {
  /**
   * Successfull operation
   */
  204: void;
};

export type PatchTaskwrapperdisplaysByIdRelationshipsByRelationResponse =
  PatchTaskwrapperdisplaysByIdRelationshipsByRelationResponses[keyof PatchTaskwrapperdisplaysByIdRelationshipsByRelationResponses];

export type PostTaskwrapperdisplaysByIdRelationshipsByRelationData = {
  body: TaskWrapperDisplayRelationTasks;
  path: {
    id: number;
    relation: string;
  };
  query?: never;
  url: '/api/v2/ui/taskwrapperdisplays/{id}/relationships/{relation}';
};

export type PostTaskwrapperdisplaysByIdRelationshipsByRelationErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
  /**
   * Resource already exists
   */
  409: ErrorResponse;
};

export type PostTaskwrapperdisplaysByIdRelationshipsByRelationError =
  PostTaskwrapperdisplaysByIdRelationshipsByRelationErrors[keyof PostTaskwrapperdisplaysByIdRelationshipsByRelationErrors];

export type PostTaskwrapperdisplaysByIdRelationshipsByRelationResponses = {
  /**
   * successfully created
   */
  204: void;
};

export type PostTaskwrapperdisplaysByIdRelationshipsByRelationResponse =
  PostTaskwrapperdisplaysByIdRelationshipsByRelationResponses[keyof PostTaskwrapperdisplaysByIdRelationshipsByRelationResponses];

export type GetTaskwrapperdisplaysByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: {
    /**
     * Relationships to include in the response, comma seperated. Possible options: tasks
     */
    include?: Array<'tasks'>;
  };
  url: '/api/v2/ui/taskwrapperdisplays/{id}';
};

export type GetTaskwrapperdisplaysByIdErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetTaskwrapperdisplaysByIdError = GetTaskwrapperdisplaysByIdErrors[keyof GetTaskwrapperdisplaysByIdErrors];

export type GetTaskwrapperdisplaysByIdResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperDisplayResponse;
};

export type GetTaskwrapperdisplaysByIdResponse =
  GetTaskwrapperdisplaysByIdResponses[keyof GetTaskwrapperdisplaysByIdResponses];

export type PostAbortChunkData = {
  /**
   * ChunkID is the ID of the chunk that needs to be aborted.
   */
  body: AbortChunkHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/abortChunk';
};

export type PostAbortChunkErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostAbortChunkError = PostAbortChunkErrors[keyof PostAbortChunkErrors];

export type PostAbortChunkResponses = {
  /**
   * successful operation
   */
  200: AbortChunkHelperApiResponse;
};

export type PostAbortChunkResponse = PostAbortChunkResponses[keyof PostAbortChunkResponses];

export type PostAssignAgentData = {
  /**
   * The agentId is the Id of the agent that has to be assigned to the task.<br />The taskId is the Id of the task that will be assigned to the agent. If this is set to 0,<br />the agent will be unassigned from its current assigned task.
   */
  body: AssignAgentHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/assignAgent';
};

export type PostAssignAgentErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostAssignAgentError = PostAssignAgentErrors[keyof PostAssignAgentErrors];

export type PostAssignAgentResponses = {
  /**
   * successful operation
   */
  200: AssignAgentHelperApiResponse;
};

export type PostAssignAgentResponse = PostAssignAgentResponses[keyof PostAssignAgentResponses];

export type PostBulkSupertaskBuilderData = {
  body: BulkSupertaskBuilderHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/bulkSupertaskBuilder';
};

export type PostBulkSupertaskBuilderErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostBulkSupertaskBuilderError = PostBulkSupertaskBuilderErrors[keyof PostBulkSupertaskBuilderErrors];

export type PostBulkSupertaskBuilderResponses = {
  /**
   * successful operation
   */
  200: SupertaskSingleResponse;
};

export type PostBulkSupertaskBuilderResponse =
  PostBulkSupertaskBuilderResponses[keyof PostBulkSupertaskBuilderResponses];

export type PostChangeOwnPasswordData = {
  /**
   * oldPassword is the current password of the user.<br />newPassword is the new password that you want to set.<br />confirmPassword is the new password again to confirm it.
   */
  body: ChangeOwnPasswordHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/changeOwnPassword';
};

export type PostChangeOwnPasswordErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostChangeOwnPasswordError = PostChangeOwnPasswordErrors[keyof PostChangeOwnPasswordErrors];

export type PostChangeOwnPasswordResponses = {
  /**
   * successful operation
   */
  200: ChangeOwnPasswordHelperApiResponse;
};

export type PostChangeOwnPasswordResponse = PostChangeOwnPasswordResponses[keyof PostChangeOwnPasswordResponses];

export type PostCreateSuperHashlistData = {
  /**
   * HashlistIds is an array of hashlist ids of the hashlists that have to be combined into a superHashlist.<br />Name is the name of the newly created superHashlist.
   */
  body: CreateSuperHashlistHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/createSuperHashlist';
};

export type PostCreateSuperHashlistErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostCreateSuperHashlistError = PostCreateSuperHashlistErrors[keyof PostCreateSuperHashlistErrors];

export type PostCreateSuperHashlistResponses = {
  /**
   * successful operation
   */
  200: HashlistSingleResponse;
};

export type PostCreateSuperHashlistResponse = PostCreateSuperHashlistResponses[keyof PostCreateSuperHashlistResponses];

export type PostCreateSupertaskData = {
  /**
   * supertaskTemplateId is the the Id of the supertasktemplate of which you want to create a supertask of.<br />hashlistId is the Id of the hashlist that has to be used for the supertask.<br />crackerVersionId is the Id of the crackerversion that is used for the created supertask.
   */
  body: CreateSupertaskHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/createSupertask';
};

export type PostCreateSupertaskErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostCreateSupertaskError = PostCreateSupertaskErrors[keyof PostCreateSupertaskErrors];

export type PostCreateSupertaskResponses = {
  /**
   * successful operation
   */
  200: TaskWrapperSingleResponse;
};

export type PostCreateSupertaskResponse = PostCreateSupertaskResponses[keyof PostCreateSupertaskResponses];

export type GetCurrentUserData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/helper/currentUser';
};

export type GetCurrentUserErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetCurrentUserError = GetCurrentUserErrors[keyof GetCurrentUserErrors];

export type GetCurrentUserResponses = {
  /**
   * successful operation
   */
  200: UserSingleResponse;
};

export type GetCurrentUserResponse = GetCurrentUserResponses[keyof GetCurrentUserResponses];

export type PatchCurrentUserData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/helper/currentUser';
};

export type PatchCurrentUserErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PatchCurrentUserError = PatchCurrentUserErrors[keyof PatchCurrentUserErrors];

export type PatchCurrentUserResponses = {
  /**
   * successful operation
   */
  200: UserSingleResponse;
};

export type PatchCurrentUserResponse = PatchCurrentUserResponses[keyof PatchCurrentUserResponses];

export type PostExportCrackedHashesData = {
  /**
   * hashlistId is the Id of the hashlist where you want to export the hashes of.
   */
  body: ExportCrackedHashesHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/exportCrackedHashes';
};

export type PostExportCrackedHashesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostExportCrackedHashesError = PostExportCrackedHashesErrors[keyof PostExportCrackedHashesErrors];

export type PostExportCrackedHashesResponses = {
  /**
   * successful operation
   */
  200: FileSingleResponse;
};

export type PostExportCrackedHashesResponse = PostExportCrackedHashesResponses[keyof PostExportCrackedHashesResponses];

export type PostExportLeftHashesData = {
  /**
   * hashlistId is the id of the hashlist where you want to export the uncracked hashes of.
   */
  body: ExportLeftHashesHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/exportLeftHashes';
};

export type PostExportLeftHashesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostExportLeftHashesError = PostExportLeftHashesErrors[keyof PostExportLeftHashesErrors];

export type PostExportLeftHashesResponses = {
  /**
   * successful operation
   */
  200: FileSingleResponse;
};

export type PostExportLeftHashesResponse = PostExportLeftHashesResponses[keyof PostExportLeftHashesResponses];

export type PostExportWordlistData = {
  /**
   * hashlistId is the Id of the hashlist where you want to export the wordlist of.
   */
  body: ExportWordlistHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/exportWordlist';
};

export type PostExportWordlistErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostExportWordlistError = PostExportWordlistErrors[keyof PostExportWordlistErrors];

export type PostExportWordlistResponses = {
  /**
   * successful operation
   */
  200: FileSingleResponse;
};

export type PostExportWordlistResponse = PostExportWordlistResponses[keyof PostExportWordlistResponses];

export type GetGetAccessGroupsData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/helper/getAccessGroups';
};

export type GetGetAccessGroupsErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetGetAccessGroupsError = GetGetAccessGroupsErrors[keyof GetGetAccessGroupsErrors];

export type GetGetAccessGroupsResponses = {
  /**
   * successful operation
   */
  200: AccessGroupSingleResponse;
};

export type GetGetAccessGroupsResponse = GetGetAccessGroupsResponses[keyof GetGetAccessGroupsResponses];

export type GetGetAgentBinaryData = {
  body?: never;
  path?: never;
  query: {
    /**
     * The ID of the agent zip to download.
     */
    agent: number;
  };
  url: '/api/v2/helper/getAgentBinary';
};

export type GetGetAgentBinaryErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetGetAgentBinaryError = GetGetAgentBinaryErrors[keyof GetGetAgentBinaryErrors];

export type GetGetAgentBinaryResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetGetBestTasksAgentData = {
  body?: never;
  path?: never;
  query: {
    /**
     * The ID of the agent.
     */
    agent: number;
  };
  url: '/api/v2/helper/getBestTasksAgent';
};

export type GetGetBestTasksAgentErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetGetBestTasksAgentError = GetGetBestTasksAgentErrors[keyof GetGetBestTasksAgentErrors];

export type GetGetBestTasksAgentResponses = {
  /**
   * successful operation
   */
  200: TaskSingleResponse;
};

export type GetGetBestTasksAgentResponse = GetGetBestTasksAgentResponses[keyof GetGetBestTasksAgentResponses];

export type GetGetCompletedCountData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/helper/getCompletedCount';
};

export type GetGetCompletedCountErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetGetCompletedCountError = GetGetCompletedCountErrors[keyof GetGetCompletedCountErrors];

export type GetGetCompletedCountResponses = {
  /**
   * successful operation
   */
  200: TaskSingleResponse;
};

export type GetGetCompletedCountResponse = GetGetCompletedCountResponses[keyof GetGetCompletedCountResponses];

export type GetGetCracksOfTaskData = {
  body?: never;
  path?: never;
  query: {
    /**
     * The ID of the task.
     */
    task: number;
  };
  url: '/api/v2/helper/getCracksOfTask';
};

export type GetGetCracksOfTaskErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetGetCracksOfTaskError = GetGetCracksOfTaskErrors[keyof GetGetCracksOfTaskErrors];

export type GetGetCracksOfTaskResponses = {
  /**
   * successful operation
   */
  200: HashSingleResponse;
};

export type GetGetCracksOfTaskResponse = GetGetCracksOfTaskResponses[keyof GetGetCracksOfTaskResponses];

export type GetGetCracksPerDayData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/helper/getCracksPerDay';
};

export type GetGetCracksPerDayErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetGetCracksPerDayError = GetGetCracksPerDayErrors[keyof GetGetCracksPerDayErrors];

export type GetGetCracksPerDayResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetGetFileData = {
  body?: never;
  path?: never;
  query: {
    /**
     * The ID of the file to download.
     */
    file: number;
  };
  url: '/api/v2/helper/getFile';
};

export type GetGetFileErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetGetFileError = GetGetFileErrors[keyof GetGetFileErrors];

export type GetGetFileResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetGetGlobalConfigData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/helper/getGlobalConfig';
};

export type GetGetGlobalConfigErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetGetGlobalConfigError = GetGetGlobalConfigErrors[keyof GetGetGlobalConfigErrors];

export type GetGetGlobalConfigResponses = {
  /**
   * successful operation
   */
  200: ConfigSingleResponse;
};

export type GetGetGlobalConfigResponse = GetGetGlobalConfigResponses[keyof GetGetGlobalConfigResponses];

export type GetGetTaskProgressImageData = {
  body?: never;
  path?: never;
  query?: {
    /**
     * The ID of the supertask where you want to create the progress image of.
     */
    supertask?: number;
    /**
     * The ID of the task where you want to create the progress image of.
     */
    task?: number;
  };
  url: '/api/v2/helper/getTaskProgressImage';
};

export type GetGetTaskProgressImageErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetGetTaskProgressImageError = GetGetTaskProgressImageErrors[keyof GetGetTaskProgressImageErrors];

export type GetGetTaskProgressImageResponses = {
  /**
   * successful operation
   */
  200: unknown;
};

export type GetGetUserPermissionData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/helper/getUserPermission';
};

export type GetGetUserPermissionErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetGetUserPermissionError = GetGetUserPermissionErrors[keyof GetGetUserPermissionErrors];

export type GetGetUserPermissionResponses = {
  /**
   * successful operation
   */
  200: GlobalPermissionGroupSingleResponse;
};

export type GetGetUserPermissionResponse = GetGetUserPermissionResponses[keyof GetGetUserPermissionResponses];

export type PostImportCrackedHashesData = {
  /**
   * HashlistId is the Id of the hashlist where you want to import the cracked hashes into.<br />SourceData is the cracked hashes you want to import.<br />Seperator is the seperator that has been used for the salt in the hashes.
   */
  body: ImportCrackedHashesHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/importCrackedHashes';
};

export type PostImportCrackedHashesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostImportCrackedHashesError = PostImportCrackedHashesErrors[keyof PostImportCrackedHashesErrors];

export type PostImportCrackedHashesResponses = {
  /**
   * successful operation
   */
  200: ImportCrackedHashesHelperApiResponse;
};

export type PostImportCrackedHashesResponse = PostImportCrackedHashesResponses[keyof PostImportCrackedHashesResponses];

export type GetImportFileData = {
  body?: never;
  path?: never;
  query?: never;
  url: '/api/v2/helper/importFile';
};

export type GetImportFileErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type GetImportFileError = GetImportFileErrors[keyof GetImportFileErrors];

export type GetImportFileResponses = {
  /**
   * successful operation
   */
  200: ImportFileHelperApiResponse;
};

export type GetImportFileResponse = GetImportFileResponses[keyof GetImportFileResponses];

export type PostImportFileData = {
  /**
   * Import file has no POST parameters
   */
  body: ImportFileHelperApi;
  headers: {
    /**
     *  The Upload-Metadata header contains one or more comma-separated key-value pairs.
     * Each pair is formatted as `<key> <base64(value)>`, where:
     * - `key` is a string without spaces.
     * - `value` is base64-encoded
     */
    'Upload-Metadata': string;
    /**
     * The total size of the upload in bytes. Must be a positive integer.
     * Required if `Upload-Defer-Length` is not set.
     */
    'Upload-Length'?: number;
    /**
     * Indicates that the upload length is not known at creation time.
     * Value must be `1`. If present, `Upload-Length` must be omitted.
     */
    'Upload-Defer-Length'?: number;
  };
  path?: never;
  query?: never;
  url: '/api/v2/helper/importFile';
};

export type PostImportFileErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostImportFileError = PostImportFileErrors[keyof PostImportFileErrors];

export type PostImportFileResponses = {
  /**
   * successful operation
   */
  200: ImportFileHelperApiResponse;
  /**
   * Upload created
   */
  201: unknown;
};

export type PostImportFileResponse = PostImportFileResponses[keyof PostImportFileResponses];

export type DeleteImportFileByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/helper/importFile/{id}';
};

export type DeleteImportFileByIdErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type DeleteImportFileByIdError = DeleteImportFileByIdErrors[keyof DeleteImportFileByIdErrors];

export type DeleteImportFileByIdResponses = {
  /**
   * successful operation
   */
  200: ImportFileHelperApiResponse;
};

export type DeleteImportFileByIdResponse = DeleteImportFileByIdResponses[keyof DeleteImportFileByIdResponses];

export type HeadImportFileByIdData = {
  body?: never;
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/helper/importFile/{id}';
};

export type HeadImportFileByIdErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type HeadImportFileByIdError = HeadImportFileByIdErrors[keyof HeadImportFileByIdErrors];

export type HeadImportFileByIdResponses = {
  /**
   * successful request
   */
  200: unknown;
};

export type PatchImportFileByIdData = {
  /**
   * The binary data to push to the file
   */
  body: Blob | File;
  headers: {
    /**
     *  The Upload-Offset header's value MUST be equal to the current offset of the resource
     */
    'Upload-Offset': number;
    'Content-Type': 'application/offset+octet-stream';
  };
  path: {
    id: number;
  };
  query?: never;
  url: '/api/v2/helper/importFile/{id}';
};

export type PatchImportFileByIdErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PatchImportFileByIdError = PatchImportFileByIdErrors[keyof PatchImportFileByIdErrors];

export type PatchImportFileByIdResponses = {
  /**
   * successful operation
   */
  200: ImportFileHelperApiResponse;
  /**
   * Chunk accepted
   */
  204: void;
};

export type PatchImportFileByIdResponse = PatchImportFileByIdResponses[keyof PatchImportFileByIdResponses];

export type PostMaskSupertaskBuilderData = {
  body: MaskSupertaskBuilderHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/maskSupertaskBuilder';
};

export type PostMaskSupertaskBuilderErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostMaskSupertaskBuilderError = PostMaskSupertaskBuilderErrors[keyof PostMaskSupertaskBuilderErrors];

export type PostMaskSupertaskBuilderResponses = {
  /**
   * successful operation
   */
  200: SupertaskSingleResponse;
};

export type PostMaskSupertaskBuilderResponse =
  PostMaskSupertaskBuilderResponses[keyof PostMaskSupertaskBuilderResponses];

export type PostPurgeTaskData = {
  /**
   * taskId is the id of the task that should be purged.
   */
  body: PurgeTaskHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/purgeTask';
};

export type PostPurgeTaskErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostPurgeTaskError = PostPurgeTaskErrors[keyof PostPurgeTaskErrors];

export type PostPurgeTaskResponses = {
  /**
   * successful operation
   */
  200: PurgeTaskHelperApiResponse;
};

export type PostPurgeTaskResponse = PostPurgeTaskResponses[keyof PostPurgeTaskResponses];

export type PostRebuildChunkCacheData = {
  body: RebuildChunkCacheHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/rebuildChunkCache';
};

export type PostRebuildChunkCacheErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostRebuildChunkCacheError = PostRebuildChunkCacheErrors[keyof PostRebuildChunkCacheErrors];

export type PostRebuildChunkCacheResponses = {
  /**
   * successful operation
   */
  200: RebuildChunkCacheHelperApiResponse;
};

export type PostRebuildChunkCacheResponse = PostRebuildChunkCacheResponses[keyof PostRebuildChunkCacheResponses];

export type PostRecountFileLinesData = {
  /**
   * FileId is the id of the file that needs to be recounted.
   */
  body: RecountFileLinesHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/recountFileLines';
};

export type PostRecountFileLinesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostRecountFileLinesError = PostRecountFileLinesErrors[keyof PostRecountFileLinesErrors];

export type PostRecountFileLinesResponses = {
  /**
   * successful operation
   */
  200: FileSingleResponse;
};

export type PostRecountFileLinesResponse = PostRecountFileLinesResponses[keyof PostRecountFileLinesResponses];

export type PostRescanGlobalFilesData = {
  body: RescanGlobalFilesHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/rescanGlobalFiles';
};

export type PostRescanGlobalFilesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostRescanGlobalFilesError = PostRescanGlobalFilesErrors[keyof PostRescanGlobalFilesErrors];

export type PostRescanGlobalFilesResponses = {
  /**
   * successful operation
   */
  200: RescanGlobalFilesHelperApiResponse;
};

export type PostRescanGlobalFilesResponse = PostRescanGlobalFilesResponses[keyof PostRescanGlobalFilesResponses];

export type PostResetChunkData = {
  /**
   * chunkId is the id of the chunk which you want to reset.
   */
  body: ResetChunkHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/resetChunk';
};

export type PostResetChunkErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostResetChunkError = PostResetChunkErrors[keyof PostResetChunkErrors];

export type PostResetChunkResponses = {
  /**
   * successful operation
   */
  200: ResetChunkHelperApiResponse;
};

export type PostResetChunkResponse = PostResetChunkResponses[keyof PostResetChunkResponses];

export type PostResetUserPasswordData = {
  body: ResetUserPasswordHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/resetUserPassword';
};

export type PostResetUserPasswordErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostResetUserPasswordError = PostResetUserPasswordErrors[keyof PostResetUserPasswordErrors];

export type PostResetUserPasswordResponses = {
  /**
   * successful operation
   */
  200: ResetUserPasswordHelperApiResponse;
};

export type PostResetUserPasswordResponse = PostResetUserPasswordResponses[keyof PostResetUserPasswordResponses];

export type PostSearchHashesData = {
  body: SearchHashesHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/searchHashes';
};

export type PostSearchHashesErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostSearchHashesError = PostSearchHashesErrors[keyof PostSearchHashesErrors];

export type PostSearchHashesResponses = {
  /**
   * successful operation
   */
  200: SearchHashesHelperApiResponse;
};

export type PostSearchHashesResponse = PostSearchHashesResponses[keyof PostSearchHashesResponses];

export type PostSetUserPasswordData = {
  /**
   * userId is the id of the user of which you want to change the password.<br />password is the new password that you want to set.
   */
  body: SetUserPasswordHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/setUserPassword';
};

export type PostSetUserPasswordErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostSetUserPasswordError = PostSetUserPasswordErrors[keyof PostSetUserPasswordErrors];

export type PostSetUserPasswordResponses = {
  /**
   * successful operation
   */
  200: SetUserPasswordHelperApiResponse;
};

export type PostSetUserPasswordResponse = PostSetUserPasswordResponses[keyof PostSetUserPasswordResponses];

export type PostUnassignAgentData = {
  /**
   * agentId is the id of the agent which you want to unassign.
   */
  body: UnassignAgentHelperApi;
  path?: never;
  query?: never;
  url: '/api/v2/helper/unassignAgent';
};

export type PostUnassignAgentErrors = {
  /**
   * Invalid request
   */
  400: ErrorResponse;
  /**
   * Authentication failed
   */
  401: ErrorResponse;
  /**
   * Permission denied
   */
  403: ErrorResponse;
  /**
   * Not Found
   */
  404: ErrorResponse;
};

export type PostUnassignAgentError = PostUnassignAgentErrors[keyof PostUnassignAgentErrors];

export type PostUnassignAgentResponses = {
  /**
   * successful operation
   */
  200: UnassignAgentHelperApiResponse;
};

export type PostUnassignAgentResponse = PostUnassignAgentResponses[keyof PostUnassignAgentResponses];
