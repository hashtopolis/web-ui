import { getTaskWrapperStatus } from '@models/task.business';
import { JTask, JTaskWrapper, TaskStatus, TaskStatusData, TaskType } from '@models/task.model';

function createTask(overrides: Partial<TaskStatusData> = {}): JTask {
  return {
    activeAgents: 0,
    keyspace: 1000,
    keyspaceProgress: 0,
    searched: '0',
    ...overrides
  } as JTask;
}

function createWrapper(overrides: Partial<JTaskWrapper> = {}): JTaskWrapper {
  return {
    taskType: TaskType.TASK,
    tasks: [createTask()],
    ...overrides
  } as JTaskWrapper;
}

function createSupertask(tasks: TaskStatusData[]): JTaskWrapper {
  return createWrapper({ taskType: TaskType.SUPERTASK, tasks } as Partial<JTaskWrapper>);
}

describe('getTaskStatus', () => {
  describe('regular tasks', () => {
    it('should return RUNNING when task has active agents', () => {
      const wrapper = createWrapper({
        taskType: TaskType.TASK,
        tasks: [createTask({ activeAgents: 2 })]
      });

      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.RUNNING);
    });

    it('should return INVALID when task has no active agents', () => {
      const wrapper = createWrapper({
        taskType: TaskType.TASK,
        tasks: [createTask({ activeAgents: 0 })]
      });

      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.INVALID);
    });
  });

  describe('supertasks', () => {
    it('should return RUNNING when any subtask has active agents', () => {
      const wrapper = createSupertask([
        createTask({ activeAgents: 0 }),
        createTask({ activeAgents: 1 }),
        createTask({ activeAgents: 0 })
      ]);

      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.RUNNING);
    });

    it('should return COMPLETED when all subtasks are completed', () => {
      const wrapper = createSupertask([
        createTask({ activeAgents: 0, keyspace: 100, keyspaceProgress: 100, searched: '100' }),
        createTask({ activeAgents: 0, keyspace: 200, keyspaceProgress: 200, searched: '100' })
      ]);

      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.COMPLETED);
    });

    it('should return IDLE when no agents active and not all subtasks completed', () => {
      const wrapper = createSupertask([
        createTask({ activeAgents: 0, keyspace: 100, keyspaceProgress: 100, searched: '100' }),
        createTask({ activeAgents: 0, keyspace: 200, keyspaceProgress: 50, searched: '25' })
      ]);

      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.IDLE);
    });

    it('should return IDLE when no subtasks are completed', () => {
      const wrapper = createSupertask([
        createTask({ activeAgents: 0 }),
        createTask({ activeAgents: 0 })
      ]);

      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.IDLE);
    });
  });

  describe('edge cases', () => {
    it('should return INVALID for empty tasks array', () => {
      const wrapper = createWrapper({ tasks: [] });

      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.INVALID);
    });

    it('should return INVALID for undefined tasks', () => {
      const wrapper = createWrapper({ tasks: undefined });

      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.INVALID);
    });

    it('should treat undefined activeAgents as zero (not running)', () => {
      const wrapper = createWrapper({
        taskType: TaskType.TASK,
        tasks: [createTask({ activeAgents: undefined })]
      });

      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.INVALID);
    });

    it('should treat null activeAgents as zero (not running)', () => {
      const wrapper = createWrapper({
        taskType: TaskType.TASK,
        tasks: [createTask({ activeAgents: null })]
      });

      expect(getTaskWrapperStatus(wrapper)).toBe(TaskStatus.INVALID);
    });
  });
});
