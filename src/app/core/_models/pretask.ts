export class Pretask {
  public pretaskId: number;
  public taskName: string;
  public attackCmd: string;
  public chunkTime: number;
  public statusTimer: number;
  public color: number;
  public isSmall: boolean;
  public isCpuTask: boolean;
  public useNewBench: boolean;
  public priority: number;
  public maxAgents: number;
  public isMaskImport: boolean;
  public crackerBinaryTypeId: number;

  constructor(pretaskId: number, taskName: string, attackCmd: string) {
    this.pretaskId = pretaskId;
    this.taskName = taskName;
    this.attackCmd = attackCmd;
  }
}
