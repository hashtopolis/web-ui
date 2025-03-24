/**
 * This module contains the definition of the apps user model
 */
import { GlobalPermissionGroup, JGlobalPermissionGroup } from '@src/app/core/_models/global-permission-group.model';
import { BaseModel } from '@src/app/core/_models/base.model';
import { JAccessGroup } from '@src/app/core/_models/access-group.model';

export interface BaseUser {
  userId: number;
  username: string;
  email: string;
  rightGroupId: number;
  registered: number;
  lastLogin: number;
  isValid: number;
  sessionLifetime: number;
}

export interface CreateUser extends BaseUser {
  username: string;
  email: string;
  rightGroupId: number;
  isAdmin: number;
}

export interface JUser extends BaseModel {
  name: string;
  email: string;
  isValid: boolean;
  isComputedPassword: boolean;
  lastLoginDate: number;
  registeredSince: number;
  sessionLifetime: number;
  globalPermissionGroupId: number;
  yubikey: string;
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  globalPermissionGroupName?: string;
}

export interface User {
  _id: number;
  _self: string;
  email: string;
  globalPermissionGroupId: number;
  globalPermissionGroupName?: string;
  globalPermissionGroup?: GlobalPermissionGroup;
  id?: number;
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
}

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

export interface UserData {
  type: string;
  id: number;
  attributes: UserAttributes;
  links?: DataLinks;
  relationships?: UserRelationships;
}

export interface UserAttributes {
  name: string;
  email: string;
  isValid: boolean;
  isComputedPassword: boolean;
  lastLoginDate: number;
  registeredSince: number;
  sessionLifetime: number;
  globalPermissionGroupId: number;
  yubikey: string;
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  globalPermissionGroupName?: string;
}

export interface DataLinks {
  self: string;
}

export interface UserRelationships {
  accessGroups: UserRelationshipsLinks;
  globalPermissionGroup: UserRelationshipsLinks;
}

export interface UserRelationshipsLinks {
  links: Links;
}

export interface Links {
  self: string;
  related: string;
}
