import { BaseModel } from './base.model';
import { JTask } from './task.model';
import { NumberSymbol } from '@angular/common';

export interface JAgentErrors extends BaseModel {
  agentId: number;
  chunkId: number;
  error: string;
  id: number;
  taskId: number;
  time: NumberSymbol;
  type: string;
  task?: JTask;
}
