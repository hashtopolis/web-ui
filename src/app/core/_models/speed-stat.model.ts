/**
 * Interface for cracking speed statistic
 * @prop speedId  Database ID
 * @prop agentId  ID of corresponding agent
 * @prop taskId   ID  of corresponding task
 * @prop speed    Speed value
 * @prop time     Timestamp
 */
export interface SpeedStat {
  speedId: number;
  agentId: number;
  taskId: number;
  speed: number;
  time: number;
}
