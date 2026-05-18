import { BaseModel } from '@models/base.model';
import { AgentId } from '@models/id.types';

/**
 * Interface for Agent statistics data
 * @extends BaseModel
 * @prop agentId ID of agent the stat belongs to
 * @prop statType Type of stat
 * @prop time Unix timestamp of stat
 * @prop value Value of stat
 */
export interface JAgentStat extends BaseModel {
  agentId: AgentId;
  statType: number;
  time: number;
  value: number[];
}
