import { BaseModel } from '@models/base.model';
import { JHashtype } from '@models/hashtype.model';
import { JTask } from './task.model';

/**
 * Interface definition for a Hashlist
 * @extends BaseModel
 */
export interface JHashlist extends BaseModel {
  hashlistId?: number;
  accessGroupId: number;
  brainFeatures: string;
  format: number;
  name: string;
  hashTypeId: number;
  hashType?: JHashtype;
  hashTypeDescription?: string;
  isHexSalt: boolean;
  isSecret: boolean;
  isSalted: boolean;
  separator: string;
  useBrain: boolean;
  hashCount: number;
  cracked: number;
  notes: string;
  isArchived: boolean;
  sourceType: string;
  sourceData: string;
  hashlists?: JHashlist[];
  tasks?: JTask[];
}
