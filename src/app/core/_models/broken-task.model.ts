import { BaseModel } from '@models/base.model';
import { TaskId } from '@models/id.types';
import { JTask } from '@models/task.model';

/**
 * A task the server marked broken after several distinct agents failed on it
 * (issue #884). While the BrokenTask row exists the task is excluded from
 * assignment; deleting the row clears the state so the task is assignable again.
 * @extends BaseModel
 * @prop taskId  Task the broken state refers to
 * @prop time    Unix time the task was marked broken
 * @prop reason  Human readable explanation of why it was marked broken
 * @prop task    The referenced task, present when included
 */
export interface JBrokenTask extends BaseModel {
  taskId: TaskId;
  time: number;
  reason: string;
  task?: JTask;
}
