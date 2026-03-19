import { JTaskWrapper, TaskCompletionData, TaskStatus, TaskType } from '@models/task.model';

export function isTaskCompleted(task: TaskCompletionData): boolean {
  return task.keyspaceProgress >= task.keyspace && task.keyspaceProgress > 0 && Number(task.searched) === 100;
}

export function getTaskWrapperStatus(wrapper: JTaskWrapper): TaskStatus {
  if (!wrapper?.tasks?.length) {
    return TaskStatus.INVALID;
  }
  if (wrapper.taskType === TaskType.SUPERTASK && wrapper.tasks.every((task) => isTaskCompleted(task))) {
      return TaskStatus.COMPLETED;
  }
  return wrapper?.tasks[0]?.status;
}
