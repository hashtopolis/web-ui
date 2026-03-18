import { JTaskWrapper, TaskCompletionData, TaskStatus, TaskType } from './task.model';

export function isTaskCompleted(task: TaskCompletionData): boolean {
  return task.keyspaceProgress >= task.keyspace && task.keyspaceProgress > 0 && Number(task.searched) === 100;
}

export function getTaskWrapperStatus(wrapper: JTaskWrapper): TaskStatus {
  if (!wrapper?.tasks?.length) {
    return TaskStatus.INVALID;
  }

  if (wrapper.tasks.some((task) => (task.activeAgents || 0) > 0)) {
    return TaskStatus.RUNNING;
  }

  if (wrapper.taskType === TaskType.SUPERTASK) {
    if (wrapper.tasks.every((task) => isTaskCompleted(task))) {
      return TaskStatus.COMPLETED;
    }

    return TaskStatus.IDLE;
  }

  return TaskStatus.INVALID;
}
