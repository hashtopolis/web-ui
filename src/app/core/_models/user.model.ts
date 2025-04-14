/**
 * This module contains the definition of the apps user model
 */
import { BaseModel } from '@models/base.model';
import { JGlobalPermissionGroup } from '@models/global-permission-group.model';
import { JAccessGroup } from '@models/access-group.model';

/**
 * Interface definition for the User model
 * @extends BaseModel
 */
export interface JUser extends BaseModel {
  email: string;
  globalPermissionGroupId: number;
  globalPermissionGroupName?: string;
  globalPermissionGroup?: JGlobalPermissionGroup;
  isComputedPassword: boolean;
  isValid: boolean;
  lastLoginDate: number;
  name: string;
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  registeredSince: number;
  sessionLifetime: number;
  yubikey: string;
  accessGroups: JAccessGroup[];
}
