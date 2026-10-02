/**
 * This module contains the definition of the apps user model
 */
import { JAccessGroup } from '@models/access-group.model';
import { BaseModel } from '@models/base.model';
import { JGlobalPermissionGroup } from '@models/global-permission-group.model';
import { GlobalPermissionGroupId } from '@models/id.types';

/**
 * Interface definition for the User model
 * @extends BaseModel
 */
export interface JUser extends BaseModel {
  email?: string | undefined;
  globalPermissionGroupId?: GlobalPermissionGroupId | undefined;
  globalPermissionGroupName?: string;
  globalPermissionGroup?: JGlobalPermissionGroup;
  isComputedPassword?: boolean | undefined;
  isValid?: boolean | undefined;
  lastLoginDate?: number | undefined;
  name: string;
  registeredSince?: number | undefined;
  sessionLifetime?: number | undefined;
  accessGroups?: JAccessGroup[];
}
