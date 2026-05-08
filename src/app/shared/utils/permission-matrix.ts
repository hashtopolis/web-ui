import { Permission, UserPermissions } from '@models/global-permission-group.model';

import { Perm } from '@src/app/core/_constants/userpermissions.config';

/**
 * One row of the CRUD permission matrix.
 *
 * Each CRUD field is a `boolean` indicating whether the user *holds* that
 * permission (true = granted). The companion `keys` map records the actual
 * backend permission key for each existing CRUD verb on this resource — keys
 * are absent (undefined) when the backend has no permission for that
 * row × verb combination (e.g. there is no `permHashCreate`, only
 * `permHashRead`).
 *
 * Consumers can therefore distinguish three cell states:
 *   - cell granted  : `keys[verb]` is defined AND the verb boolean is true
 *   - cell denied   : `keys[verb]` is defined AND the verb boolean is false
 *   - cell n/a      : `keys[verb]` is undefined
 */
export interface PermissionMatrixRow extends UserPermissions {
  keys: {
    create?: string;
    read?: string;
    update?: string;
    delete?: string;
  };
}

export const CrudVerb = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete'
} as const;
export type CrudVerb = (typeof CrudVerb)[keyof typeof CrudVerb];

const VERB_PATTERN = /(Create|Delete|Read|Update)$/;

/**
 * Group a flat permission map (e.g. `{ permTaskRead: true, permTaskUpdate: false, ... }`)
 * into one row per resource with CRUD booleans + key lookup. Sorted alphabetically
 * by display name.
 *
 * Replaces the inline grouping previously hidden inside
 * `AccessPermissionGroupsExpandDataSource.processPermissions()` so the same
 * structure can be consumed by the live-edit table and the API-key creation form.
 */
export function buildPermissionMatrix(permissions: Permission): PermissionMatrixRow[] {
  let permId = 0;
  const rows = Object.entries(permissions).reduce<PermissionMatrixRow[]>((acc, [key, value]) => {
    const operation = key.replace(/^perm/, '').replace(VERB_PATTERN, '');
    const verbMatch = key.match(VERB_PATTERN)?.[0];
    if (!verbMatch) {
      return acc;
    }
    const verb = verbMatch.toLowerCase() as CrudVerb;
    const operationName = humanizeResourceName(operation);

    let row = acc.find((item) => item.key === operation);
    if (!row) {
      row = {
        id: permId++,
        type: 'userPermission',
        name: operationName,
        key: operation,
        create: false,
        read: false,
        update: false,
        delete: false,
        keys: {}
      };
      acc.push(row);
    }
    row[verb] = value;
    row.keys[verb] = key;
    return acc;
  }, []);

  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Build a permission map containing every backend permission key set to `true`.
 *
 * Used by read-only consumers (e.g. the API-key detail page) that need to
 * render the *full* CRUD matrix regardless of what the current user holds —
 * the per-cell selection state is then driven by the resource's stored scopes,
 * not by `granted`. Source-of-truth is the static {@link Perm} catalogue, so
 * the matrix stays in lockstep with the frontend's known permission keys.
 */
export function buildAllPermissionsMap(): Permission {
  const all: Permission = {};
  for (const group of Object.values(Perm) as Array<Record<string, string>>) {
    for (const key of Object.values(group)) {
      all[key] = true;
    }
  }
  return all;
}

function humanizeResourceName(operation: string): string {
  const spaced = operation.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export const PERMISSION_DENIED_TOOLTIP = 'You can only grant permissions you hold yourself.';
export const PERMISSION_NOT_APPLICABLE_TOOLTIP = 'This action does not exist for this resource.';
