/// <reference types="jasmine" />
import {
  zAgentAssignmentListResponse,
  zAgentListResponse,
  zChunkListResponse,
  zUserListResponse
} from '@generated/api/zod';
import { of } from 'rxjs';

import { ChangeDetectorRef, Injector } from '@angular/core';
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { JAgentAssignment } from '@models/agent-assignment.model';
import { JAgent } from '@models/agent.model';
import { JChunk } from '@models/chunk.model';
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

// Mock data

const MOCK_TASK: JTask = {
  id: 10,
  type: 'task',
  taskName: 'Test Task',
  keyspace: 1000
} as unknown as JTask;

const NOW = Math.floor(Date.now() / 1000);

const MOCK_TASK_CHUNK: JChunk = {
  id: 100,
  type: 'chunk',
  taskId: 10,
  agentId: 1,
  skip: 0,
  length: 500,
  dispatchTime: NOW - 60,
  solveTime: NOW - 30,
  checkpoint: 250,
  progress: 5000,
  state: 2,
  cracked: 2,
  speed: 1200
} as unknown as JChunk;

const MOCK_OTHER_TASK_CHUNK: JChunk = {
  id: 101,
  type: 'chunk',
  taskId: 11,
  agentId: 1,
  skip: 0,
  length: 500,
  dispatchTime: NOW - 60,
  solveTime: NOW - 30,
  checkpoint: 500,
  progress: 10000,
  state: 5,
  cracked: 8,
  speed: 9999
} as unknown as JChunk;

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
  tasks: [MOCK_TASK],
  chunks: [MOCK_TASK_CHUNK, MOCK_OTHER_TASK_CHUNK]
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
  agent: { ...MOCK_AGENT },
  task: MOCK_TASK
} as unknown as JAgentAssignment;

// Suite

describe('AgentsDataSource', () => {
  let dataSource: AgentsDataSource;
  let gsSpy: jasmine.SpyObj<GlobalService>;
  let deserializeSpy: jasmine.Spy;

  beforeEach(() => {
    gsSpy = jasmine.createSpyObj('GlobalService', ['getAll']);

    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['markForCheck', 'detectChanges']);
    const uiServiceSpy = jasmine.createSpyObj('UIConfigService', ['getUISettings']);
    uiServiceSpy.getUISettings.and.returnValue({});
    const autoRefreshSpy = jasmine.createSpyObj(
      'AutoRefreshService',
      ['toggleAutoRefresh', 'startAutoRefresh', 'stopAutoRefresh'],
      { refresh$: of() }
    );
    const cacheSpy = jasmine.createSpyObj('HttpCacheService', ['invalidate']);
    const storageSpy = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    storageSpy.getItem.and.returnValue(null);

    gsSpy.getAll.and.returnValue(of(mockResponse()));

    // Bypass Zod validation — return appropriate mock data based on schema.
    deserializeSpy = spyOn(JsonAPISerializer.prototype, 'deserialize').and.callFake(
      (_body: unknown, schema?: unknown) => {
        if (schema === zAgentListResponse) return [MOCK_AGENT];
        if (schema === zAgentAssignmentListResponse) return [MOCK_ASSIGNMENT];
        if (schema === zChunkListResponse) return [MOCK_TASK_CHUNK, MOCK_OTHER_TASK_CHUNK];
        if (schema === zUserListResponse) return [MOCK_USER];
        return [];
      }
    );

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
      expect(dataSource['agentStatsRequired']).toBeTrue();
    });

    it('should store the flag when set to false', () => {
      dataSource.setAgentStatsRequired(false);
      expect(dataSource['agentStatsRequired']).toBeFalse();
    });
  });

  // loadAll()

  describe('loadAll()', () => {
    it('should call service.getAll with SERV.AGENTS', () => {
      dataSource.loadAll();
      const [serviceConfig] = gsSpy.getAll.calls.mostRecent().args;
      expect(serviceConfig).toEqual(SERV.AGENTS);
    });

    it('should set loading to false after a successful response', () => {
      dataSource.loadAll();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
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
      deserializeSpy.and.returnValue([MOCK_AGENT_NO_TASKS]);
      dataSource.loadAll();
      const agent = dataSource.getOriginalData()[0];
      expect(agent.taskId).toBeUndefined();
      expect(agent.taskName).toBeUndefined();
    });

    it('should include agentStats in the request params when setAgentStatsRequired(true)', () => {
      dataSource.setAgentStatsRequired(true);
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).include).toContain('agentStats');
    });

    it('should not include agentStats in the request params by default', () => {
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      expect((params as RequestParams).include).not.toContain('agentStats');
    });

    it('should always include accessGroups, tasks, assignments and user in the request params', () => {
      dataSource.loadAll();
      const [, params] = gsSpy.getAll.calls.mostRecent().args;
      const include = (params as RequestParams).include ?? [];
      expect(include).toContain('accessGroups');
      expect(include).toContain('tasks');
      expect(include).toContain('assignments');
      expect(include).toContain('user');
    });

    it('should persist the filter across calls when no new filter is provided', () => {
      const filter = { field: 'name', operator: 'eq' as never, value: 'test' };
      dataSource.loadAll(filter);
      gsSpy.getAll.calls.reset();

      dataSource.loadAll(); // no filter argument
      expect(gsSpy.getAll).toHaveBeenCalled();
    });
  });

  // loadAssignments()

  describe('loadAssignments()', () => {
    beforeEach(() => {
      dataSource.setTaskId(10);

      gsSpy.getAll.and.callFake((serviceConfig) => {
        if (serviceConfig === SERV.AGENT_ASSIGN) {
          return of(mockResponse({ meta: { page: { total_elements: 1 } } }));
        }
        // SERV.USERS — called by loadUserData()
        return of(mockResponse());
      });
    });

    it('should call service.getAll with SERV.AGENT_ASSIGN', fakeAsync(() => {
      dataSource.loadAssignments();
      flushMicrotasks();
      const firstCallArgs = gsSpy.getAll.calls.all()[0].args;
      expect(firstCallArgs[0]).toEqual(SERV.AGENT_ASSIGN);
    }));

    it('should filter assignments by the stored taskId', fakeAsync(() => {
      dataSource.loadAssignments();
      flushMicrotasks();
      const [, params] = gsSpy.getAll.calls.all()[0].args;
      expect((params as RequestParams).filter).toContain(jasmine.objectContaining({ field: 'taskId', value: 10 }));
    }));

    it('should not request nested agent chunks include on assignments endpoint', fakeAsync(() => {
      dataSource.loadAssignments();
      flushMicrotasks();
      const [, params] = gsSpy.getAll.calls.all()[0].args;
      expect((params as RequestParams).include).not.toContain('agent.chunks');
    }));

    it('should fetch chunks for the assigned agents and task', fakeAsync(() => {
      dataSource.loadAssignments();
      flushMicrotasks();

      const chunkCall = gsSpy.getAll.calls.all().find((call) => call.args[0] === SERV.CHUNKS);
      expect(chunkCall).toBeDefined();
      const [, params] = chunkCall!.args;
      expect((params as RequestParams).filter).toContain(jasmine.objectContaining({ field: 'taskId', value: 10 }));
      expect((params as RequestParams).filter).toContain(
        jasmine.objectContaining({ field: 'agentId', operator: 'in', value: [1] })
      );
    }));

    it('should fetch user data for the agents in the assignments', fakeAsync(() => {
      dataSource.loadAssignments();
      flushMicrotasks();
      const calledServices = gsSpy.getAll.calls.all().map((c) => c.args[0]);
      expect(calledServices).toContain(SERV.USERS);
    }));

    it('should map task, taskName, taskId, assignmentId, user and benchmark onto agents', fakeAsync(() => {
      dataSource.loadAssignments();
      flushMicrotasks();
      const agents = dataSource.getOriginalData();
      expect(agents.length).toBe(1);
      const agent = agents[0];
      expect(agent.task).toEqual(MOCK_TASK);
      expect(agent.taskName).toBe(MOCK_TASK.taskName);
      expect(agent.taskId).toBe(MOCK_TASK.id);
      expect(agent.assignmentId).toBe(MOCK_ASSIGNMENT.id);
      expect(agent.benchmark).toBe(MOCK_ASSIGNMENT.benchmark);
      expect(agent.user).toEqual(MOCK_USER);
    }));

    it('should derive task-scoped chunk data and current chunk for assigned agents', fakeAsync(() => {
      dataSource.loadAssignments();
      flushMicrotasks();

      const agent = dataSource.getOriginalData()[0];
      expect(agent.chunkData).toEqual(
        jasmine.objectContaining({
          speed: MOCK_TASK_CHUNK.speed,
          timeSpent: MOCK_TASK_CHUNK.solveTime - MOCK_TASK_CHUNK.dispatchTime,
          searched: (MOCK_TASK_CHUNK.checkpoint - MOCK_TASK_CHUNK.skip) / MOCK_TASK.keyspace,
          cracked: MOCK_TASK_CHUNK.cracked
        })
      );
      expect(agent.chunkId).toBe(MOCK_TASK_CHUNK.id);
      expect(agent.chunk).toEqual(MOCK_TASK_CHUNK);
    }));

    it('should not derive time spent from agent last activity', fakeAsync(() => {
      const activeAgent = {
        ...MOCK_AGENT,
        lastTime: NOW,
        chunks: [{ ...MOCK_TASK_CHUNK, solveTime: NOW - 45, dispatchTime: NOW - 120, progress: 5000 }]
      } as JAgent;
      const activeAssignment = { ...MOCK_ASSIGNMENT, agent: activeAgent } as JAgentAssignment;

      deserializeSpy.and.callFake((_body: unknown, schema?: unknown) => {
        if (schema === zAgentAssignmentListResponse) return [activeAssignment];
        if (schema === zChunkListResponse) return activeAgent.chunks;
        if (schema === zUserListResponse) return [MOCK_USER];
        if (schema === zAgentListResponse) return [activeAgent];
        return [];
      });

      dataSource.loadAssignments();
      flushMicrotasks();

      const agent = dataSource.getOriginalData()[0];
      expect(agent.chunkData?.timeSpent).toBe(75);
    }));

    it('should set data to an empty array when there are no assignments', fakeAsync(() => {
      deserializeSpy.and.returnValue([]);
      dataSource.loadAssignments();
      flushMicrotasks();
      expect(dataSource.getOriginalData().length).toBe(0);
    }));

    it('should set loading to false after completing', fakeAsync(() => {
      dataSource.loadAssignments();
      flushMicrotasks();
      expect(dataSource['loadingSubject'].getValue()).toBeFalse();
    }));
  });

  // reload()

  describe('reload()', () => {
    it('should call loadAll() when no taskId is set', () => {
      spyOn(dataSource, 'loadAll');
      dataSource.reload();
      expect(dataSource.loadAll).toHaveBeenCalled();
    });

    it('should call loadAssignments() when a taskId is set', () => {
      spyOn(dataSource, 'loadAssignments');
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
      spyOn(dataSource, 'reload'); // prevent actual loadAll
      dataSource.index = 5;
      dataSource.clearFilter();
      expect(dataSource.index).toBe(0);
    });

    it('should call reload()', () => {
      spyOn(dataSource, 'reload');
      dataSource.clearFilter();
      expect(dataSource.reload).toHaveBeenCalled();
    });
  });
});
