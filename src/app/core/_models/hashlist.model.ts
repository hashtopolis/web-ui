import { BaseModel } from '@models/base.model';
import { JHashtype } from '@models/hashtype.model';
import { JTask } from '@models/task.model';

/**
 * Interface definition for a Hashlist
 * @extends BaseModel
 */
export interface JHashlist extends BaseModel {
  hashlistId?: number;
  accessGroupId: number;
  brainFeatures: number;
  format?: number;
  name: string;
  hashTypeId: number;
  hashType?: JHashtype | null;
  hashTypeDescription?: string;
  isHexSalt: boolean;
  isSecret: boolean;
  isSalted: boolean;
  separator?: string | null;
  useBrain: boolean;
  hashCount: number;
  cracked: number;
  notes: string;
  isArchived: boolean;
  sourceType?: string;
  sourceData?: string;
  hashlists?: JHashlist[];
  tasks?: JTask[];
}
