import { BaseModel } from '@models/base.model';

/**
 * Interface for access group defining user access to agents
 * @extends BaseModel
 * @prop groupName    Name of access group
 * @prop userMembers  Users which are members of the group
 * @prop agentMembers Agents which are members of the group
 */

export interface JwtPayload extends BaseModel {
  userId?: number;
  sub?: number | string;
  username?: string;
  name?: string;
  user?: string;
  exp?: number;
  [k: string]: unknown;
}
