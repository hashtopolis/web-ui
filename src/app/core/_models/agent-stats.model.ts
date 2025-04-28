import { BaseModel } from '@models/base.model';

/**
 * Interface for Agent statistics data
 * @extends BaseModel
 * @prop agentId ID of agent the stat belongs to
 * @prop statType Type of stat
 * @prop time Unix timestamp of stat
 * @prop value Value of stat
 */
export interface JAgentStat extends BaseModel {
  agentId: number;
  statType: number;
  time: number;
  value: number[];
}
