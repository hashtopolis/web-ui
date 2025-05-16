import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { JUser } from '@models/user.model';

/**
 * Interface for access group defining user access to agents
 * @extends BaseModel
 * @prop groupName    Name of access group
 * @prop userMembers  Users which are members of the group
 * @prop agentMembers Agents which are members of the group
 */
export interface JAccessGroup extends BaseModel {
  groupName: string;
  userMembers?: JUser[];
  agentMembers?: JAgent[];
}
