import { getTaskWrapperStatus } from '@models/task.business';
import { JTask, JTaskWrapper, TaskStatus, TaskType } from '@models/task.model';

function createTask(status: TaskStatus): JTask {
  return { status } as JTask;
}

function createWrapper(taskType: TaskType, tasks: JTask[]): JTaskWrapper {
  return { taskType, tasks } as JTaskWrapper;
}

describe('getTaskWrapperStatus', () => {
  describe('regular task (TaskType.TASK)', () => {
    it('should return the task status directly for RUNNING', () => {
      const wrapper = createWrapper(TaskType.TASK, [createTask(TaskStatus.RUNNING)]);
      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.RUNNING);
    });

    it('should return the task status directly for IDLE', () => {
      const wrapper = createWrapper(TaskType.TASK, [createTask(TaskStatus.IDLE)]);
      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.IDLE);
    });

    it('should return the task status directly for COMPLETED', () => {
      const wrapper = createWrapper(TaskType.TASK, [createTask(TaskStatus.COMPLETED)]);
      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.COMPLETED);
    });
  });

  describe('supertask (TaskType.SUPERTASK)', () => {
    it('should return COMPLETED when all subtasks are COMPLETED', () => {
      const wrapper = createWrapper(TaskType.SUPERTASK, [
        createTask(TaskStatus.COMPLETED),
        createTask(TaskStatus.COMPLETED)
      ]);
      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.COMPLETED);
    });

    it('should return RUNNING when any subtask is RUNNING', () => {
      const wrapper = createWrapper(TaskType.SUPERTASK, [
        createTask(TaskStatus.IDLE),
        createTask(TaskStatus.RUNNING),
        createTask(TaskStatus.IDLE)
      ]);
      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.RUNNING);
    });

    it('should return IDLE when all subtasks are IDLE', () => {
      const wrapper = createWrapper(TaskType.SUPERTASK, [createTask(TaskStatus.IDLE), createTask(TaskStatus.IDLE)]);
      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.IDLE);
    });

    it('should return IDLE when some subtasks are COMPLETED and the rest are IDLE', () => {
      const wrapper = createWrapper(TaskType.SUPERTASK, [
        createTask(TaskStatus.COMPLETED),
        createTask(TaskStatus.IDLE)
      ]);
      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.IDLE);
    });

    it('should prioritise RUNNING over partial COMPLETED', () => {
      const wrapper = createWrapper(TaskType.SUPERTASK, [
        createTask(TaskStatus.COMPLETED),
        createTask(TaskStatus.RUNNING)
      ]);
      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.RUNNING);
    });
  });
});
