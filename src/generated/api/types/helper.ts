import type { FileSingleResponse } from './file';
import type { HashlistSingleResponse } from './hashlist';
import type { SupertaskSingleResponse } from './supertask';
import type { TaskWrapperSingleResponse } from './task-wrapper';

export type AbortChunkHelperApi = {
    chunkId?: number;
};

export type AbortChunkHelperApiResponse = Array<{
    Abort?: string;
}>;

export type AssignAgentHelperApi = {
    agentId?: number;
    taskId?: number;
};

export type AssignAgentHelperApiResponse = Array<{
    Assign?: string;
}>;

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

export type ChangeOwnPasswordHelperApiResponse = Array<{
    'Change password'?: string;
}>;

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

export type ImportCrackedHashesHelperApiResponse = Array<{
    totalLines?: number;
    newCracked?: number;
    alreadyCracked?: number;
    invalid?: number;
    notFound?: number;
    processTime?: number;
    tooLongPlaintexts?: number;
}>;

export type ImportFileHelperApi = {
    [key: string]: unknown;
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

export type PurgeTaskHelperApiResponse = Array<{
    Purge?: string;
}>;

export type RebuildChunkCacheHelperApi = {
    [key: string]: unknown;
};

export type RebuildChunkCacheHelperApiResponse = Array<{
    Rebuild?: string;
}>;

export type RecountFileLinesHelperApi = {
    fileId?: number;
};

export type RescanGlobalFilesHelperApi = {
    [key: string]: unknown;
};

export type RescanGlobalFilesHelperApiResponse = Array<{
    Rescan?: string;
}>;

export type ResetChunkHelperApi = {
    chunkId?: number;
};

export type ResetChunkHelperApiResponse = Array<{
    Reset?: string;
}>;

export type ResetUserPasswordHelperApi = {
    email?: string;
    username?: string;
};

export type ResetUserPasswordHelperApiResponse = Array<{
    Reset?: string;
}>;

export type SearchHashesHelperApi = {
    searchData?: string;
    separator?: string;
    isSalted?: boolean;
};

export type SearchHashesHelperApiResponse = Array<{
    0?: {
        [key: string]: unknown;
    };
    1?: {
        [key: string]: unknown;
    };
}>;

export type SetUserPasswordHelperApi = {
    userId?: number;
    password?: string;
};

export type SetUserPasswordHelperApiResponse = Array<{
    'Set password'?: string;
}>;

export type UnassignAgentHelperApi = {
    agentId?: number;
};

export type UnassignAgentHelperApiResponse = Array<{
    Unassign?: string;
}>;

export type PostAbortChunkData = {
    /**
     * ChunkID is the ID of the chunk that needs to be aborted.<br />
     */
    body: AbortChunkHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/abortChunk';
};

export type PostAbortChunkResponses = {
    /**
     * successful operation
     */
    200: AbortChunkHelperApiResponse;
};

export type PostAbortChunkResponse = PostAbortChunkResponses[keyof PostAbortChunkResponses];

export type PostAssignAgentData = {
    /**
     * The agentId is the Id of the agent that has to be assigned to the task.<br />The taskId is the Id of the task that will be assigned to the agent. If this is set to 0,<br />the agent will be unassigned from its current assigned task.<br />
     */
    body: AssignAgentHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/assignAgent';
};

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

export type PostBulkSupertaskBuilderResponses = {
    /**
     * successful operation
     */
    200: SupertaskSingleResponse;
};

export type PostBulkSupertaskBuilderResponse = PostBulkSupertaskBuilderResponses[keyof PostBulkSupertaskBuilderResponses];

export type PostChangeOwnPasswordData = {
    /**
     * oldPassword is the current password of the user.<br />newPassword is the new password that you want to set.<br />confirmPassword is the new password again to confirm it.<br />
     */
    body: ChangeOwnPasswordHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/changeOwnPassword';
};

export type PostChangeOwnPasswordResponses = {
    /**
     * successful operation
     */
    200: ChangeOwnPasswordHelperApiResponse;
};

export type PostChangeOwnPasswordResponse = PostChangeOwnPasswordResponses[keyof PostChangeOwnPasswordResponses];

export type PostCreateSuperHashlistData = {
    /**
     * HashlistIds is an array of hashlist ids of the hashlists that have to be combined into a superHashlist.<br />Name is the name of the newly created superHashlist.<br />
     */
    body: CreateSuperHashlistHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/createSuperHashlist';
};

export type PostCreateSuperHashlistResponses = {
    /**
     * successful operation
     */
    200: HashlistSingleResponse;
};

export type PostCreateSuperHashlistResponse = PostCreateSuperHashlistResponses[keyof PostCreateSuperHashlistResponses];

export type PostCreateSupertaskData = {
    /**
     * supertaskTemplateId is the the Id of the supertasktemplate of which you want to create a supertask of.<br />hashlistId is the Id of the hashlist that has to be used for the supertask.<br />crackerVersionId is the Id of the crackerversion that is used for the created supertask.<br />
     */
    body: CreateSupertaskHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/createSupertask';
};

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

export type GetCurrentUserResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type PatchCurrentUserData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/api/v2/helper/currentUser';
};

export type PatchCurrentUserResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type PostExportCrackedHashesData = {
    /**
     * hashlistId is the Id of the hashlist where you want to export the hashes of.<br />
     */
    body: ExportCrackedHashesHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/exportCrackedHashes';
};

export type PostExportCrackedHashesResponses = {
    /**
     * successful operation
     */
    200: FileSingleResponse;
};

export type PostExportCrackedHashesResponse = PostExportCrackedHashesResponses[keyof PostExportCrackedHashesResponses];

export type PostExportLeftHashesData = {
    /**
     * hashlistId is the id of the hashlist where you want to export the uncracked hashes of.<br />
     */
    body: ExportLeftHashesHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/exportLeftHashes';
};

export type PostExportLeftHashesResponses = {
    /**
     * successful operation
     */
    200: FileSingleResponse;
};

export type PostExportLeftHashesResponse = PostExportLeftHashesResponses[keyof PostExportLeftHashesResponses];

export type PostExportWordlistData = {
    /**
     * hashlistId is the Id of the hashlist where you want to export the wordlist of.<br />
     */
    body: ExportWordlistHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/exportWordlist';
};

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

export type GetGetAccessGroupsResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

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

export type GetGetBestTasksAgentResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

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

export type GetGetCracksOfTaskResponses = {
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

export type GetGetFileResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

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

export type GetGetUserPermissionResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type PostImportCrackedHashesData = {
    /**
     * HashlistId is the Id of the hashlist where you want to import the cracked hashes into.<br />SourceData is the cracked hashes you want to import.<br />Seperator is the seperator that has been used for the salt in the hashes.<br />
     */
    body: ImportCrackedHashesHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/importCrackedHashes';
};

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

export type GetImportFileResponses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type PostImportFileData = {
    /**
     * Import file has no POST parameters<br />
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

export type PostImportFileResponses = {
    /**
     * successful operation
     */
    200: unknown;
    /**
     * successful operation
     */
    201: Blob | File;
};

export type PostImportFileResponse = PostImportFileResponses[keyof PostImportFileResponses];

export type DeleteImportFileById09aF32Data = {
    body?: never;
    path: {
        32: string;
        id: number;
    };
    query?: never;
    url: '/api/v2/helper/importFile/{id}-[0-9a-f]{32}}';
};

export type DeleteImportFileById09aF32Responses = {
    /**
     * successful operation
     */
    200: unknown;
};

export type HeadImportFileById09aF32Data = {
    body?: never;
    path: {
        32: string;
        id: number;
    };
    query?: never;
    url: '/api/v2/helper/importFile/{id}-[0-9a-f]{32}}';
};

export type HeadImportFileById09aF32Responses = {
    /**
     * successful request
     */
    200: unknown;
};

export type PatchImportFileById09aF32Data = {
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
        32: string;
        id: number;
    };
    query?: never;
    url: '/api/v2/helper/importFile/{id}-[0-9a-f]{32}}';
};

export type PatchImportFileById09aF32Responses = {
    /**
     * successful operation
     */
    200: unknown;
    /**
     * Chunk accepted
     */
    204: void;
};

export type PatchImportFileById09aF32Response = PatchImportFileById09aF32Responses[keyof PatchImportFileById09aF32Responses];

export type PostMaskSupertaskBuilderData = {
    body: MaskSupertaskBuilderHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/maskSupertaskBuilder';
};

export type PostMaskSupertaskBuilderResponses = {
    /**
     * successful operation
     */
    200: SupertaskSingleResponse;
};

export type PostMaskSupertaskBuilderResponse = PostMaskSupertaskBuilderResponses[keyof PostMaskSupertaskBuilderResponses];

export type PostPurgeTaskData = {
    /**
     * taskId is the id of the task that should be purged.<br />
     */
    body: PurgeTaskHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/purgeTask';
};

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

export type PostRebuildChunkCacheResponses = {
    /**
     * successful operation
     */
    200: RebuildChunkCacheHelperApiResponse;
};

export type PostRebuildChunkCacheResponse = PostRebuildChunkCacheResponses[keyof PostRebuildChunkCacheResponses];

export type PostRecountFileLinesData = {
    /**
     * FileId is the id of the file that needs to be recounted.<br />
     */
    body: RecountFileLinesHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/recountFileLines';
};

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

export type PostRescanGlobalFilesResponses = {
    /**
     * successful operation
     */
    200: RescanGlobalFilesHelperApiResponse;
};

export type PostRescanGlobalFilesResponse = PostRescanGlobalFilesResponses[keyof PostRescanGlobalFilesResponses];

export type PostResetChunkData = {
    /**
     * chunkId is the id of the chunk which you want to reset.<br />
     */
    body: ResetChunkHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/resetChunk';
};

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

export type PostSearchHashesResponses = {
    /**
     * successful operation
     */
    200: SearchHashesHelperApiResponse;
};

export type PostSearchHashesResponse = PostSearchHashesResponses[keyof PostSearchHashesResponses];

export type PostSetUserPasswordData = {
    /**
     * userId is the id of the user of which you want to change the password.<br />password is the new password that you want to set.<br />
     */
    body: SetUserPasswordHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/setUserPassword';
};

export type PostSetUserPasswordResponses = {
    /**
     * successful operation
     */
    200: SetUserPasswordHelperApiResponse;
};

export type PostSetUserPasswordResponse = PostSetUserPasswordResponses[keyof PostSetUserPasswordResponses];

export type PostUnassignAgentData = {
    /**
     * agentId is the id of the agent which you want to unassign.<br />
     */
    body: UnassignAgentHelperApi;
    path?: never;
    query?: never;
    url: '/api/v2/helper/unassignAgent';
};

export type PostUnassignAgentResponses = {
    /**
     * successful operation
     */
    200: UnassignAgentHelperApiResponse;
};

export type PostUnassignAgentResponse = PostUnassignAgentResponses[keyof PostUnassignAgentResponses];
