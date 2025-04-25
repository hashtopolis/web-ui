import { BaseModel } from '@models/base.model';
import { JUser } from '@models/user.model';

/**
 * Represents a collection of permissions in a flattened format used for API payload.
 *
 * @prop key `string` The permission identifier (e.g., "permUserCreate", "permTaskRead").
 * @prop value `boolean` The value indicating whether the permission is granted (`true`) or not (`false`).
 */
export interface Permission {
  [key: string]: boolean;
}

/**
 * Represents a global permission group for users in the system.
 *
 * @prop name - The name of the permission group (e.g., "Admin", "Manager").
 * @prop permissions A collection of permissions associated with the group.
 * @prop userMembers A list of users who belong to this permission group.
 */
export interface JGlobalPermissionGroup extends BaseModel {
  name: string;
  permissions: Permission;
  userMembers: JUser[];
}

/**
 * Represents the CRUD permissions for a single resource in a structured format.
 *
 * @prop name `string` human-readable name of the resource (e.g., "User", "Task").
 * @prop key `string` unique identifier for the resource, typically in PascalCase (e.g., "User", "Task").
 * @prop create `boolean` indicating wether the user can create the resource
 * @prop read `boolean` indicating whether the user can read this resource.
 * @prop update `boolean` indicating whether the user can update this resource.
 * @prop delete `boolean` indicating whether the user can delete this resource.
 */
export interface UserPermissions {
  name: string;
  key: string;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}
