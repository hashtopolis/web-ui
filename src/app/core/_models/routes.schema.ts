import { z } from 'zod';

import { Type } from '@angular/core';

import { RoleService } from '@services/roles/base/role.service';

import { NewTaskRouteKind } from '@src/app/tasks/tasks-routing.constants';

const zServiceConfig = z.object({
  URL: z.string(),
  RESOURCE: z.string()
});

export const formRouteType = z.enum(['create', 'edit', 'helper']);

/**
 * Zod schema for route data consumed by FormComponent.
 * Validates that required fields are present and correctly typed.
 * `kind` is the key the form metadata is looked up with, so only kinds that have
 * metadata are accepted.
 */
export const zFormRouteData = z.object({
  kind: z.enum([
    'editagentbinary',
    'editcrackerversion',
    'edithashtype',
    'editother',
    'editrule',
    'editwordlist',
    'newaccessgroups',
    'newagentbinary',
    'newcrackerversion',
    'newglobalpermissionsgp',
    'newhashtype'
  ]),
  type: formRouteType,
  serviceConfig: zServiceConfig,
  responseSchema: z.custom<z.ZodTypeAny>().optional()
});

export type FormRouteData = z.infer<typeof zFormRouteData>;

/**
 * Zod schema for route data consumed by FormConfigComponent.
 * Same shape minus `type` (FormConfigComponent does not use it).
 */
export const zFormConfigRouteData = z.object({
  kind: z.enum(['server-actions', 'serveragent', 'servergs', 'serverhch', 'servernotif', 'servertaskchunk']),
  serviceConfig: zServiceConfig
});

export type FormConfigRouteData = z.infer<typeof zFormConfigRouteData>;

export const zErrorPageRouteData = z.object({
  message: z.string()
});

export const zBreadcrumbRouteData = z.object({
  breadcrumb: z.string().optional()
});

export const zPreloadRouteData = z.object({
  preload: z.boolean().optional(),
  delay: z.boolean().optional()
});

export const zPermissionRouteData = z.object({
  roleName: z.string().min(1),
  roleServiceClass: z.custom<Type<RoleService>>((value) => typeof value === 'function')
});

export const zFilesRouteData = z.object({
  kind: z.enum(['wordlist', 'rules', 'other'])
});

export const zNewFilesRouteData = z.object({
  kind: z.enum(['wordlist-new', 'rule-new', 'other-new'])
});

export const zHashesRouteData = z.object({
  kind: z.enum(['chunkshash', 'taskhas', 'hashlisthash'])
});

export const zEditTaskRouteData = z.object({
  kind: z.enum(['edit-task', 'edit-task-cAll'])
});

export const zNewTaskRouteData = z.object({
  kind: z.enum(NewTaskRouteKind)
});

export const zNewPretaskRouteData = z.object({
  kind: z.enum(['new-preconfigured-tasks', 'copy-preconfigured-tasks', 'copy-tasks'])
});

export type NewPretaskRouteKind = z.infer<typeof zNewPretaskRouteData>['kind'];

/** The `:id` path parameter, which every detail and edit route carries. */
export const zRouteId = z.coerce.number().int().positive();

export const zIdRouteParams = z.object({
  id: zRouteId
});

/** Routes where `:id` is only present in copy mode, create routes carry no id. */
export const zOptionalIdRouteParams = z.object({
  id: zRouteId.optional()
});

/** The hashes routes carry a legacy `<id>?<filter>` path parameter, so `id` is split by hand. */
export const zHashesRouteParams = z.object({
  id: z.string()
});

/** Query parameters of the hashes view. */
export const zHashesQueryParams = z.object({
  crackpos: z.string().optional(),
  filter: z.string().optional(),
  display: z.string().optional()
});
