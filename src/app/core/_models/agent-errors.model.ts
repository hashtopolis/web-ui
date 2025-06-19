import { BaseModel } from './base.model';
import { NumberSymbol } from '@angular/common';

export interface JAgentErrors extends BaseModel {
  agentId: number;
  chunkId: number;
  error: string;
  id: number;
  taskId: number;
  time: NumberSymbol;
  type: string;
  taskName?: string;
}
