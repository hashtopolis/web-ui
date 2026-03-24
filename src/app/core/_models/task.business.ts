import { JTaskWrapper, TaskStatus, TaskType } from '@models/task.model';

/**
 * Returns the effective status of a task wrapper.
 *
 * For a regular task the status is taken directly from the single task.
 * For a supertask: COMPLETED if all subtasks are completed, RUNNING if any
 * subtask is running, IDLE otherwise.
 *
 * @param wrapper - The task wrapper to evaluate
 * @returns The effective `TaskStatus` of the wrapper, or `null` if the wrapper has no tasks
 */
export function getTaskWrapperStatus(wrapper: JTaskWrapper): TaskStatus | null {
  if (!wrapper?.tasks?.length) {
    return null;
  }
  if (wrapper.taskType === TaskType.TASK) {
    return wrapper.tasks[0].status;
  }
  if (wrapper.tasks.every((task) => task.status === TaskStatus.COMPLETED)) {
    return TaskStatus.COMPLETED;
  }
  if (wrapper.tasks.some((task) => task.status === TaskStatus.RUNNING)) {
    return TaskStatus.RUNNING;
  }
  return TaskStatus.IDLE;
}
