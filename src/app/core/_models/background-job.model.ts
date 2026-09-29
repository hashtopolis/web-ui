import { BackgroundJobStatus } from '@constants/background-jobs.config';

import { BaseModel } from '@models/base.model';
import { UserId } from '@models/id.types';
import { JUser } from '@models/user.model';

/**
 * Interface definition for a background job
 * @extends BaseModel
 * @prop jobType        Job type identifier, e.g. 'recount_file'
 * @prop payload        Job parameters, e.g. { fileId: 7 }
 * @prop status         Current status
 * @prop userId         User who triggered the job, null for system jobs or deleted users
 * @prop createdAt      Unix timestamp of enqueueing
 * @prop startedAt      Unix timestamp of the start, null while pending
 * @prop finishedAt     Unix timestamp of the end, null while pending or running
 * @prop exitCode       Exit code, null while pending or running
 * @prop resultMessage  Result or error message
 * @prop user           Included user
 */
export interface JBackgroundJob extends BaseModel {
  jobType: string;
  payload: Record<string, unknown>;
  status: BackgroundJobStatus;
  userId: UserId | null;
  createdAt: number;
  startedAt: number | null;
  finishedAt: number | null;
  exitCode: number | null;
  resultMessage: string | null;
  user?: JUser;
}
