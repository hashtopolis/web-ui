import { BaseModel } from '@models/base.model';
import { AgentId, TaskId } from '@models/id.types';

/**
 * Interface for cracking speed statistic
 * @extends BaseModel
 * @prop speedId  Database ID
 * @prop agentId  ID of corresponding agent
 * @prop taskId   ID  of corresponding task
 * @prop speed    Speed value
 * @prop time     Timestamp
 */
export interface SpeedStat extends BaseModel {
  speedId?: number;
  agentId: AgentId;
  taskId: TaskId;
  speed: number;
  time: number;
}
