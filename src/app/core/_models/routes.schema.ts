import { z } from 'zod';

import { Type } from '@angular/core';

import { RoleService } from '@services/roles/base/role.service';

import { NewTaskRouteKind } from '@src/app/tasks/tasks-routing.constants';

const zServiceConfig = z.object({
  URL: z.string(),
  RESOURCE: z.string()
});

export const FormRouteType = {
  Create: 'create',
  Edit: 'edit',
  Helper: 'helper'
} as const;

export type FormRouteType = (typeof FormRouteType)[keyof typeof FormRouteType];

export const FormRouteKind = {
  EditAgentBinary: 'editagentbinary',
  EditCrackerVersion: 'editcrackerversion',
  EditHashtype: 'edithashtype',
  EditOther: 'editother',
  EditRule: 'editrule',
  EditWordlist: 'editwordlist',
  NewAccessGroups: 'newaccessgroups',
  NewAgentBinary: 'newagentbinary',
  NewCrackerVersion: 'newcrackerversion',
  NewGlobalPermissionsGroup: 'newglobalpermissionsgp',
  NewHashtype: 'newhashtype'
} as const;

export type FormRouteKind = (typeof FormRouteKind)[keyof typeof FormRouteKind];

/**
 * Zod schema for route data consumed by FormComponent.
 * Validates that required fields are present and correctly typed.
 */
export const zFormRouteData = z.object({
  kind: z.enum(FormRouteKind),
  type: z.enum(FormRouteType),
  serviceConfig: zServiceConfig,
  responseSchema: z.custom<z.ZodTypeAny>().optional()
});

export type FormRouteData = z.infer<typeof zFormRouteData>;

export const FormConfigRouteKind = {
  ServerActions: 'server-actions',
  ServerAgent: 'serveragent',
  ServerGeneralSettings: 'servergs',
  ServerHealthChecks: 'serverhch',
  ServerNotifications: 'servernotif',
  ServerTaskChunk: 'servertaskchunk'
} as const;

export type FormConfigRouteKind = (typeof FormConfigRouteKind)[keyof typeof FormConfigRouteKind];

/**
 * Zod schema for route data consumed by FormConfigComponent.
 * Same shape minus `type` (FormConfigComponent does not use it).
 */
export const zFormConfigRouteData = z.object({
  kind: z.enum(FormConfigRouteKind),
  serviceConfig: zServiceConfig
});

export type FormConfigRouteData = z.infer<typeof zFormConfigRouteData>;

export const zErrorPageRouteData = z.object({
  message: z.string()
});

export const zPreloadRouteData = z.object({
  preload: z.boolean().optional(),
  delay: z.boolean().optional()
});

export const zPermissionRouteData = z.object({
  roleName: z.string().min(1),
  roleServiceClass: z.custom<Type<RoleService>>((value) => typeof value === 'function')
});

export const FilesRouteKind = {
  Wordlist: 'wordlist',
  Rules: 'rules',
  Other: 'other'
} as const;

export type FilesRouteKind = (typeof FilesRouteKind)[keyof typeof FilesRouteKind];

export const zFilesRouteData = z.object({
  kind: z.enum(FilesRouteKind)
});

export const NewFilesRouteKind = {
  NewWordlist: 'wordlist-new',
  NewRule: 'rule-new',
  NewOther: 'other-new'
} as const;

export type NewFilesRouteKind = (typeof NewFilesRouteKind)[keyof typeof NewFilesRouteKind];

export const zNewFilesRouteData = z.object({
  kind: z.enum(NewFilesRouteKind)
});

export const HashesRouteKind = {
  ChunkHashes: 'chunkshash',
  TaskHashes: 'taskhas',
  HashlistHashes: 'hashlisthash'
} as const;

export type HashesRouteKind = (typeof HashesRouteKind)[keyof typeof HashesRouteKind];

export const zHashesRouteData = z.object({
  kind: z.enum(HashesRouteKind)
});

export const EditTaskRouteKind = {
  EditTask: 'edit-task',
  EditTaskCrackedAll: 'edit-task-cAll'
} as const;

export type EditTaskRouteKind = (typeof EditTaskRouteKind)[keyof typeof EditTaskRouteKind];

export const zEditTaskRouteData = z.object({
  kind: z.enum(EditTaskRouteKind)
});

export const zNewTaskRouteData = z.object({
  kind: z.enum(NewTaskRouteKind)
});

export const NewPretaskRouteKind = {
  NewPretask: 'new-preconfigured-tasks',
  CopyPretask: 'copy-preconfigured-tasks',
  CopyTask: 'copy-tasks'
} as const;

export type NewPretaskRouteKind = (typeof NewPretaskRouteKind)[keyof typeof NewPretaskRouteKind];

export const zNewPretaskRouteData = z.object({
  kind: z.enum(NewPretaskRouteKind)
});

export const zRouteId = z.coerce.number().int().positive();

export const zIdRouteParams = z.object({
  id: zRouteId
});

export const zOptionalIdRouteParams = z.object({
  id: zRouteId.optional()
});

export const zHashesRouteParams = z.object({
  id: z.string()
});

export const zHashesQueryParams = z.object({
  crackpos: z.string().optional(),
  filter: z.string().optional(),
  display: z.string().optional()
});
