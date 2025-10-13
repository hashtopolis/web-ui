import { BaseModel } from '@models/base.model';
import { JFile } from '@models/file.model';

/**
 * Interface definition for a pretask
 * @extends BaseModel
 */
export interface JPretask extends BaseModel {
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
