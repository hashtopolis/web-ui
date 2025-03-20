import { BaseModel } from '@src/app/core/_models/base.model';

/**
 * Interface for Agent statistics data
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
