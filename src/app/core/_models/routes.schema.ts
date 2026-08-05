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
 */
export const zFormRouteData = z.object({
  kind: z.string(),
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
  kind: z.string(),
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
