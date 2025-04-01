import { File, JFile } from './file.model';
import { BaseModel } from '@src/app/core/_models/base.model';

export class Pretask {
  public pretaskId: number;
  public taskName: string;
  public attackCmd: string;
  public chunkTime: number;
  public statusTimer: number;
  public color: string;
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

export interface Pretask {
  _id: number;
  _self: string;
  attackCmd: string;
  chunkTime: number;
  color: string;
  crackerBinaryTypeId: number;
  isCpuTask: boolean;
  isMaskImport: boolean;
  isSmall: boolean;
  maxAgents: number;
  pretaskFiles: File[];
  pretaskId: number;
  priority: number;
  statusTimer: number;
  taskName: string;
  useNewBench: boolean;
}

export interface JPretask extends BaseModel{
  attackCmd: string;
  chunkTime: number;
  color: string;
  crackerBinaryTypeId: number;
  isCpuTask: boolean;
  isMaskImport: boolean;
  isSmall: boolean;
  maxAgents: number;
  pretaskFiles: JFile[];
  priority: number;
  statusTimer: number;
  taskName: string;
  useNewBench: boolean;
}
