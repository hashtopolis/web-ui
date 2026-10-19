import { HttpHeaderName } from '@constants/http.config';
import { zAgentAssignmentListResponse, zAgentListResponse, zUserListResponse } from '@generated/api/zod';
import { of } from 'rxjs';
import type { Mock, MockedObject } from 'vitest';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgent } from '@models/agent.model';
import { RequestParams } from '@models/request-params.model';
import { JTask } from '@models/task.model';
import { JUser } from '@models/user.model';

import { JsonAPISerializer } from '@services/api/serializer-service';
import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import { HttpCacheService } from '@services/shared/http-cache.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { AgentsDataSource } from '@src/app/core/_datasources/agents.datasource';
import { mockResponse } from '@src/app/testing/mock-response';
import { wait } from '@src/app/testing/wait';

// Mock data

const MOCK_TASK: JTask = {
  id: 10,
  type: 'task',
  taskName: 'Test Task',
  keyspace: 1000
} as unknown as JTask;

const NOW = Math.floor(Date.now() / 1000);

const MOCK_USER: JUser = {
  id: 5,
  type: 'user',
  name: 'TestUser',
  email: 'test@test.com'
} as unknown as JUser;

const MOCK_AGENT: JAgent = {
  id: 1,
  type: 'agent',
  agentName: 'Agent1',
  userId: MOCK_USER.id,
  lastTime: NOW,
  tasks: [MOCK_TASK]
} as unknown as JAgent;

const MOCK_AGENT_NO_TASKS: JAgent = {
  id: 2,
  type: 'agent',
  agentName: 'Agent2',
  userId: undefined,
  tasks: []
} as unknown as JAgent;

const MOCK_ASSIGNMENT: JAgentAssignment = {
  id: 1,
  type: 'agentAssignment',
  taskId: 10,
  agentId: 1,
  benchmark: '1000H/s',
  cracked: 2,
  currentSpeed: 1200,
  crackingTime: 30,
  searched: 250,
  currentChunkId: 100,
  agent: { ...MOCK_AGENT },
  task: MOCK_TASK
} as unknown as JAgentAssignment;

// Suite

describe('AgentsDataSource', () => {
  let dataSource: AgentsDataSource;
  let gsSpy: MockedObject<GlobalService>;
  let deserializeSpy: Mock;

  beforeEach(() => {
    gsSpy = {
      getAll: vi.fn().mockName('GlobalService.getAll')
    } as MockedObject<GlobalService>;

    const cdrSpy = {
      markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges')
    };
    const uiServiceSpy = {
      getUISettings: vi.fn().mockName('UIConfigService.getUISettings')
    };
    uiServiceSpy.getUISettings.mockReturnValue({});
    const autoRefreshSpy = {
      toggleAutoRefresh: vi.fn().mockName('AutoRefreshService.toggleAutoRefresh'),
      startAutoRefresh: vi.fn().mockName('AutoRefreshService.startAutoRefresh'),
      stopAutoRefresh: vi.fn().mockName('AutoRefreshService.stopAutoRefresh'),
      refresh$: of()
    };
    const cacheSpy = {
      invalidate: vi.fn().mockName('HttpCacheService.invalidate')
    };
    const storageSpy = {
      getItem: vi.fn().mockName('LocalStorageService.getItem'),
      setItem: vi.fn().mockName('LocalStorageService.setItem')
    };
    storageSpy.getItem.mockReturnValue(null);

    gsSpy.getAll.mockReturnValue(of(mockResponse()));

    // Bypass Zod validation — return appropriate mock data based on schema.
    deserializeSpy = vi
      .spyOn(JsonAPISerializer.prototype, 'deserialize')
      .mockImplementation((_body: unknown, schema?: unknown) => {
        if (schema === zAgentListResponse) return [MOCK_AGENT];
        if (schema === zAgentAssignmentListResponse) return [MOCK_ASSIGNMENT];
        if (schema === zUserListResponse) return [MOCK_USER];
        return [];
      });

    TestBed.configureTestingModule({
      providers: [
        { provide: GlobalService, useValue: gsSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
        { provide: UIConfigService, useValue: uiServiceSpy },
        { provide: AutoRefreshService, useValue: autoRefreshSpy },
        { provide: HttpCacheService, useValue: cacheSpy },
        { provide: LocalStorageService, useValue: storageSpy }
      ]
    });

    const injector = TestBed.inject(Injector);
    dataSource = new AgentsDataSource(injector);
  });

  // setTaskId()

  describe('setTaskId()', () => {
    it('should store the provided task ID', () => {
      dataSource.setTaskId(42);
      expect(dataSource['_taskId']).toBe(42);
    });
  });

  // setAgentStatsRequired()

  describe('setAgentStatsRequired()', () => {
    it('should store the flag when set to true', () => {
      dataSource.setAgentStatsRequired(true);
      expect(dataSource['agentStatsRequired']).toBe(true);
    });

    it('should store the flag when set to false', () => {
      dataSource.setAgentStatsRequired(false);
      expect(dataSource['agentStatsRequired']).toBe(false);
    });
  });

  // loadAll()

  describe('loadAll()', () => {
    it('should call service.getAll with SERV.AGENTS', () => {
      dataSource.loadAll();
      const [serviceConfig] = gsSpy.getAll.mock.lastCall!;
      expect(serviceConfig).toEqual(SERV.AGENTS);
    });

    it('should set loading to false after a successful response', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBe(false);
    });

    it('should populate the data with the deserialized agents', () => {
      dataSource.loadAll();
      expect(dataSource.getOriginalData().length).toBe(1);
      expect(dataSource.getOriginalData()[0].agentName).toBe(MOCK_AGENT.agentName);
    });

    it('should map taskId, task and taskName from the first task when the agent has tasks', () => {
      dataSource.loadAll();
      const agent = dataSource.getOriginalData()[0];
      expect(agent.taskId).toBe(MOCK_TASK.id);
      expect(agent.task).toBe(MOCK_TASK);
      expect(agent.taskName).toBe(MOCK_TASK.taskName);
    });

    it('should not set task info when the agent has no tasks', () => {
      deserializeSpy.mockReturnValue([MOCK_AGENT_NO_TASKS]);
      dataSource.loadAll();
      const agent = dataSource.getOriginalData()[0];
      expect(agent.taskId).toBeUndefined();
      expect(agent.taskName).toBeUndefined();
    });

    it('should include agentStats in the request params when setAgentStatsRequired(true)', () => {
      dataSource.setAgentStatsRequired(true);
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.mock.lastCall!;
      expect((params as RequestParams).include).toContain('agentStats');
    });

    it('should not include agentStats in the request params by default', () => {
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.mock.lastCall!;
      expect((params as RequestParams).include).not.toContain('agentStats');
    });

    it('should always include accessGroups, tasks, assignments and user in the request params', () => {
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.mock.lastCall!;
      const include = (params as RequestParams).include ?? [];
      expect(include).toContain('accessGroups');
      expect(include).toContain('tasks');
      expect(include).toContain('assignments');
      expect(include).toContain('user');
    });

    it('should persist the filter across calls when no new filter is provided', () => {
      const filter = { field: 'name', operator: 'eq' as never, value: 'test' };
      dataSource.loadAll(filter);
      gsSpy.getAll.mockClear();

      dataSource.loadAll(); // no filter argument
      expect(gsSpy.getAll).toHaveBeenCalled();
    });
  });

  // loadAssignments()

  describe('loadAssignments()', () => {
    beforeEach(() => {
      dataSource.setTaskId(10);

      gsSpy.getAll.mockImplementation((serviceConfig) => {
        if (serviceConfig === SERV.AGENT_ASSIGN) {
          return of(mockResponse({ meta: { page: { total_elements: 1 } } }));
        }
        // SERV.USERS — called by loadUserData()
        return of(mockResponse());
      });
    });

    it('should call service.getAll with SERV.AGENT_ASSIGN', () => {
      dataSource.loadAssignments();
      const firstCallArgs = gsSpy.getAll.mock.calls[0];
      expect(firstCallArgs[0]).toEqual(SERV.AGENT_ASSIGN);

      const httpOptions = firstCallArgs[2] as
        | {
            headers?: {
              get(name: string): string | null;
            };
          }
        | undefined;
      expect(httpOptions?.headers?.get(HttpHeaderName.SKIP_CACHE)).toBe('true');
    });

    it('should filter assignments by the stored taskId', () => {
      dataSource.loadAssignments();
      const [, params] = gsSpy.getAll.mock.calls[0];
      expect((params as RequestParams).filter).toContainEqual(expect.objectContaining({ field: 'taskId', value: 10 }));
    });

    it('should not request nested agent chunks include on assignments endpoint', () => {
      dataSource.loadAssignments();
      const [, params] = gsSpy.getAll.mock.calls[0];
      expect((params as RequestParams).include).not.toContain('agent.chunks');
    });

    it('should request the assignment aggregates instead of fetching chunks', () => {
      dataSource.loadAssignments();

      expect(gsSpy.getAll.mock.calls.find((call) => call[0] === SERV.CHUNKS)).toBeUndefined();

      const [, params] = gsSpy.getAll.mock.calls[0];
      expect((params as RequestParams).aggregate).toContainEqual(
        expect.objectContaining({
          field: 'assignment',
          values: ['cracked', 'currentSpeed', 'crackingTime', 'searched', 'currentChunkId']
        })
      );
    });

    it('should fetch user data for the agents in the assignments', () => {
      dataSource.loadAssignments();
      const calledServices = gsSpy.getAll.mock.calls.map((c) => c[0]);
      expect(calledServices).toContain(SERV.USERS);
    });

    it('should map task, taskName, taskId, assignmentId, user and benchmark onto agents', async () => {
      dataSource.loadAssignments();
      await wait();
      const agents = dataSource.getOriginalData();
      expect(agents.length).toBe(1);
      const agent = agents[0];
      expect(agent.task).toEqual(MOCK_TASK);
      expect(agent.taskName).toBe(MOCK_TASK.taskName);
      expect(agent.taskId).toBe(MOCK_TASK.id);
      expect(agent.assignmentId).toBe(MOCK_ASSIGNMENT.id);
      expect(agent.benchmark).toBe(MOCK_ASSIGNMENT.benchmark);
      expect(agent.user).toEqual(MOCK_USER);
    });

    it('should map the assignment aggregates onto agents', async () => {
      dataSource.loadAssignments();
      await wait();

      const agent = dataSource.getOriginalData()[0];
      expect(agent.cracked).toBe(2);
      expect(agent.currentSpeed).toBe(1200);
      expect(agent.timeSpent).toBe(30);
      expect(agent.searched).toBe(250);
      expect(agent.chunkId).toBe(100);
    });

    it('should expose lastTime from the included agent for the last activity column', async () => {
      dataSource.loadAssignments();
      await wait();
      expect(dataSource.getOriginalData()[0].lastTime).toBe(NOW);
    });

    it('should leave the chunk id undefined when the server omits the currentChunkId aggregate', async () => {
      // The server drops null aggregates from the payload instead of sending them as null.
      const assignmentWithoutChunk = { ...MOCK_ASSIGNMENT, agent: { ...MOCK_AGENT } } as unknown as JAgentAssignment;
      delete (
        assignmentWithoutChunk as {
          currentChunkId?: number;
        }
      ).currentChunkId;

      deserializeSpy.mockImplementation((_body: unknown, schema?: unknown) => {
        if (schema === zAgentAssignmentListResponse) return [assignmentWithoutChunk];
        if (schema === zUserListResponse) return [MOCK_USER];
        if (schema === zAgentListResponse) return [MOCK_AGENT];
        return [];
      });

      dataSource.loadAssignments();
      await wait();

      expect(dataSource.getOriginalData()[0].chunkId).toBeUndefined();
    });

    it('should set data to an empty array when there are no assignments', () => {
      deserializeSpy.mockReturnValue([]);
      dataSource.loadAssignments();
      expect(dataSource.getOriginalData().length).toBe(0);
    });

    it('should set loading to false after completing', () => {
      dataSource.loadAssignments();
      expect(dataSource['loadingSubject'].getValue()).toBe(false);
    });
  });

  // reload()

  describe('reload()', () => {
    it('should call loadAll() when no taskId is set', () => {
      vi.spyOn(dataSource, 'loadAll').mockReturnValue(undefined);
      dataSource.reload();
      expect(dataSource.loadAll).toHaveBeenCalled();
    });

    it('should call loadAssignments() when a taskId is set', () => {
      vi.spyOn(dataSource, 'loadAssignments').mockReturnValue(undefined);
      dataSource.setTaskId(10);
      dataSource.reload();
      expect(dataSource.loadAssignments).toHaveBeenCalled();
    });
  });

  // clearFilter()

  describe('clearFilter()', () => {
    it('should reset the stored filter to null', () => {
      const filter = { field: 'name', operator: 'eq' as never, value: 'test' };
      dataSource.loadAll(filter);
      dataSource.clearFilter();
      expect(dataSource['_currentFilter']).toBeNull();
    });

    it('should reset the page index to 0', () => {
      vi.spyOn(dataSource, 'reload').mockReturnValue(undefined); // prevent actual loadAll
      dataSource.index = 5;
      dataSource.clearFilter();
      expect(dataSource.index).toBe(0);
    });

    it('should call reload()', () => {
      vi.spyOn(dataSource, 'reload').mockReturnValue(undefined);
      dataSource.clearFilter();
      expect(dataSource.reload).toHaveBeenCalled();
    });
  });
});
