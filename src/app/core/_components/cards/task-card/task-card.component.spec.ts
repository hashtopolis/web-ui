/// <reference types="jasmine" />
import { JTaskWrapperDisplayOverview, TaskStatus, TaskType } from '@models/task.model';

import { TaskCardComponent } from '@components/cards/task-card/task-card.component';

/**
 * Overrides for a test wrapper. Written out rather than `Partial<...>` so a case can set a field
 * back to `undefined`, which `exactOptionalPropertyTypes` forbids on a plain `Partial`.
 */
type TaskWrapperOverrides = {
  [K in keyof JTaskWrapperDisplayOverview]?: JTaskWrapperDisplayOverview[K] | undefined;
};

/**
 * The component has no constructor dependencies, so the derivation that the template reads can be
 * exercised directly without a TestBed.
 */
function cardFor(overrides: TaskWrapperOverrides): TaskCardComponent {
  const component = new TaskCardComponent();
  component.task = {
    id: 1,
    taskWrapperId: 1,
    taskType: TaskType.TASK,
    taskId: 7,
    displayName: 'Task A',
    status: TaskStatus.RUNNING,
    dispatched: '0',
    searched: '0',
    totalAssignedAgents: 0,
    currentSpeed: 0,
    ...overrides
  } as JTaskWrapperDisplayOverview;
  return component;
}

describe('TaskCardComponent', () => {
  describe('status badge', () => {
    it('should label every status, including the ones the table leaves blank', () => {
      expect(cardFor({ status: TaskStatus.RUNNING }).view.status).toEqual(
        jasmine.objectContaining({ label: 'Running', tone: 'running' })
      );
      expect(cardFor({ status: TaskStatus.IDLE }).view.status).toEqual(
        jasmine.objectContaining({ label: 'Waiting', tone: 'waiting' })
      );
      expect(cardFor({ status: TaskStatus.COMPLETED }).view.status).toEqual(
        jasmine.objectContaining({ label: 'Completed', tone: 'completed' })
      );
      expect(cardFor({ status: TaskStatus.SKIPPED }).view.status).toEqual(
        jasmine.objectContaining({ label: 'Skipped', tone: 'skipped' })
      );
    });

    it('should fall back to an unknown tone for a missing status', () => {
      expect(cardFor({ status: undefined }).view.status.tone).toBe('unknown');
    });
  });

  describe('keyspace meter', () => {
    it('should read the dispatched and searched percentages', () => {
      expect(cardFor({ dispatched: '80', searched: '42.5' }).view.keyspace).toEqual({
        dispatched: 80,
        searched: 42.5
      });
    });

    it('should clamp out-of-range and non-numeric percentages', () => {
      expect(cardFor({ dispatched: '140', searched: '-3' }).view.keyspace).toEqual({
        dispatched: 100,
        searched: 0
      });
      expect(cardFor({ dispatched: 'n/a', searched: undefined }).view.keyspace).toEqual({
        dispatched: 0,
        searched: 0
      });
    });

    it('should omit the meter for supertasks, which do not report keyspace progress', () => {
      const card = cardFor({ taskType: TaskType.SUPERTASK, taskId: null, dispatched: '', searched: '' });
      expect(card.view.keyspace).toBeNull();
      expect(card.view.isSupertask).toBeTrue();
    });
  });

  describe('cracked', () => {
    it('should report a plain count, never a share of the hashlist', () => {
      // `cracked` is what THIS task found; `hashCount` is the whole hashlist, which other tasks
      // also crack into. A ratio of the two would claim this task finished the hashlist.
      const card = cardFor({ cracked: 250, hashCount: 1000, taskId: 42 });
      expect(card.view.cracked.count).toBe(250);
      expect(card.view.cracked).not.toEqual(jasmine.objectContaining({ percent: jasmine.anything() }));
    });

    it('should link a task\u2019s cracks to its hash list', () => {
      expect(cardFor({ cracked: 3, taskId: 42 }).view.cracked.routerLink).toEqual([
        '/hashlists',
        'hashes',
        'tasks',
        42
      ]);
    });

    it('should not link when there is nothing cracked', () => {
      expect(cardFor({ cracked: 0, taskId: 42 }).view.cracked.routerLink).toBeNull();
    });

    it('should not link a supertask, whose cracks span its subtasks', () => {
      const card = cardFor({ taskType: TaskType.SUPERTASK, taskId: null, cracked: 9 });
      expect(card.view.cracked.count).toBe(9);
      expect(card.view.cracked.routerLink).toBeNull();
    });

    it('should flag any crack for the row highlight', () => {
      expect(cardFor({ cracked: 5 }).view.hasCracks).toBeTrue();
      expect(cardFor({ cracked: 0 }).view.hasCracks).toBeFalse();
    });

    it('should mark a fully cracked hashlist from the hashlist totals, not this task\u2019s cracks', () => {
      // One task cracking every hash it owns says nothing about the hashlist as a whole.
      expect(cardFor({ cracked: 10, hashCount: 1000, hashlistCracked: 10 }).view.hashlistFullyCracked).toBeFalse();
      expect(cardFor({ cracked: 10, hashCount: 1000, hashlistCracked: 1000 }).view.hashlistFullyCracked).toBeTrue();
    });

    it('should not mark a fully cracked hashlist when the hashlist size is unknown', () => {
      expect(cardFor({ cracked: 5, hashCount: 0, hashlistCracked: 0 }).view.hashlistFullyCracked).toBeFalse();
    });
  });

  describe('links', () => {
    it('should link a task to its detail page', () => {
      expect(cardFor({ taskId: 42 }).view.detailLink).toEqual(['/tasks', 'show-tasks', 42, 'edit']);
    });

    it('should leave a supertask without a route so the card opens the subtasks dialog', () => {
      expect(cardFor({ taskType: TaskType.SUPERTASK, taskId: null }).view.detailLink).toBeNull();
    });

    it('should fall back to the hashlist id when the hashlist has no name', () => {
      expect(cardFor({ hashlistId: 9, hashlistName: '' }).view.hashlist).toEqual({
        label: '9',
        routerLink: ['/hashlists', 'hashlist', 9, 'edit']
      });
    });
  });

  describe('priority and agents', () => {
    it('should take a task’s own priority and max agents', () => {
      const card = cardFor({ taskPriority: 7, taskMaxAgents: 3, taskWrapperPriority: 99, taskWrapperMaxAgents: 99 });
      expect(card.view.priority).toBe(7);
      expect(card.view.maxAgents).toBe(3);
    });

    it('should take the wrapper values for a supertask', () => {
      const card = cardFor({
        taskType: TaskType.SUPERTASK,
        taskId: null,
        taskPriority: null,
        taskMaxAgents: null,
        taskWrapperPriority: 12,
        taskWrapperMaxAgents: 4
      });
      expect(card.view.priority).toBe(12);
      expect(card.view.maxAgents).toBe(4);
    });
  });

  describe('flags', () => {
    it('should list the task attributes that are set', () => {
      const card = cardFor({ isSmall: true, isCpuTask: false, taskUsePreprocessor: 1 });
      expect(card.view.flags.map((flag) => flag.label)).toEqual(['Small task', 'Preprocessor: Prince']);
    });

    it('should list no flags for a supertask', () => {
      const card = cardFor({ taskType: TaskType.SUPERTASK, taskId: null, isSmall: true, isCpuTask: true });
      expect(card.view.flags).toEqual([]);
    });
  });

  describe('speed', () => {
    it('should format the current speed for a task', () => {
      expect(cardFor({ currentSpeed: 1_500_000 }).view.speed).toContain('MH/s');
    });

    it('should omit the speed for a supertask', () => {
      expect(cardFor({ taskType: TaskType.SUPERTASK, taskId: null }).view.speed).toBeNull();
    });
  });
});
