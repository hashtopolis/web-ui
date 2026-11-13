import { zHashlistResponse } from '@generated/api/zod';
import { Subject, of, throwError } from 'rxjs';
import type { MockedObject } from 'vitest';

import type { CollectionViewer } from '@angular/cdk/collections';
import type { ChangeDetectorRef } from '@angular/core';

import { JHashlist } from '@models/hashlist.model';
import { ResponseWrapper } from '@models/response.model';
import { JTask } from '@models/task.model';

import { SERV } from '@services/main.config';
import { GlobalService } from '@services/main.service';
import type { UIConfigService } from '@services/shared/storage.service';

import { HashlistReportDataSource } from '@src/app/shared/report-builder/datasources/hashlists.datasource';
import type {
  ReportSection,
  ReportSubtitleSection,
  ReportTableSection
} from '@src/app/shared/report-builder/reports/report-builder/report.models';
import { mockValidResponse } from '@src/app/testing/mock-response';

// Fixtures
const taskAttributes = (): Record<string, unknown> => ({
  taskName: 'Task',
  attackCmd: '#HL# -a 0 rockyou.txt',
  chunkTime: 600,
  statusTimer: 5,
  keyspace: 1000,
  keyspaceProgress: 250,
  priority: 1,
  maxAgents: 0,
  color: null,
  isSmall: false,
  isCpuTask: false,
  useNewBench: false,
  skipKeyspace: 0,
  crackerBinaryId: 1,
  crackerBinaryTypeId: null,
  taskWrapperId: 1,
  isArchived: false,
  notes: '',
  staticChunks: 0,
  chunkSize: 0,
  forcePipe: false,
  preprocessorId: 0,
  preprocessorCommand: ''
});

const mockHashlistResponse = (): ResponseWrapper =>
  mockValidResponse(zHashlistResponse, {
    data: {
      id: 7,
      type: 'hashlist',
      attributes: {
        name: 'Report Hashlist',
        notes: 'Some notes',
        isSecret: false,
        useBrain: false,
        format: 0,
        hashTypeId: 0,
        hashCount: 100,
        cracked: 42,
        separator: ':',
        isHexSalt: false,
        isSalted: false,
        accessGroupId: 1,
        brainFeatures: 0,
        isArchived: false
      },
      relationships: {
        tasks: { data: [{ id: 1, type: 'task' }] }
      }
    },
    included: [{ id: 1, type: 'task', attributes: taskAttributes() }]
  });

const buildTask = (overrides: Partial<JTask> = {}): JTask =>
  ({
    id: 1,
    type: 'task',
    attackCmd: '#HL# -a 0',
    keyspace: 100,
    keyspaceProgress: 50,
    preprocessorCommand: '',
    ...overrides
  }) as JTask;

const buildHashlist = (tasks?: JTask[]): JHashlist =>
  ({
    id: 1,
    type: 'hashlist',
    name: 'My Hashlist',
    notes: 'Notes',
    hashTypeId: 1400,
    hashCount: 10,
    cracked: 3,
    tasks
  }) as JHashlist;

const tableValues = (report: ReportSection[]): (string | number)[] =>
  (report[0] as ReportTableSection).table.tableValues;

const workflowAt = (report: ReportSection[], index: number): ReportSubtitleSection =>
  report[index] as ReportSubtitleSection;

describe('HashlistReportDataSource', () => {
  let dataSource: HashlistReportDataSource;

  // Mocks
  let cdrSpy: MockedObject<ChangeDetectorRef>;
  let globalServiceSpy: MockedObject<GlobalService>;

  const viewer: CollectionViewer = { viewChange: of({ start: 0, end: 0 }) };

  const collectData = (): ReportSection[][] => {
    const received: ReportSection[][] = [];
    dataSource.connect(viewer).subscribe((data) => received.push(data));
    return received;
  };

  const collectLoading = (): boolean[] => {
    const states: boolean[] = [];
    dataSource.loading$.subscribe((state) => states.push(state));
    return states;
  };

  beforeEach(() => {
    cdrSpy = {
      markForCheck: vi.fn().mockName('ChangeDetectorRef.markForCheck'),
      detach: vi.fn().mockName('ChangeDetectorRef.detach'),
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges'),
      reattach: vi.fn().mockName('ChangeDetectorRef.reattach')
    };
    globalServiceSpy = {
      get: vi.fn().mockName('GlobalService.get')
    } as unknown as MockedObject<GlobalService>;
    globalServiceSpy.get.mockReturnValue(of(mockHashlistResponse()));

    dataSource = new HashlistReportDataSource(cdrSpy, globalServiceSpy, {} as UIConfigService);
  });

  describe('loadAll', () => {
    it('requests the configured hashlist with all required includes', () => {
      dataSource.setHashlistId(7);

      dataSource.loadAll();

      expect(globalServiceSpy.get).toHaveBeenCalledExactlyOnceWith(SERV.HASHLISTS, 7, {
        include: ['accessGroup', 'tasks', 'hashType', 'hashlists']
      });
    });

    it('uses hashlist id 0 when no id has been set', () => {
      dataSource.loadAll();

      expect(globalServiceSpy.get).toHaveBeenCalledExactlyOnceWith(SERV.HASHLISTS, 0, expect.anything());
    });

    it('deserializes the response and emits the generated report', () => {
      const received = collectData();
      dataSource.setHashlistId(7);

      dataSource.loadAll();

      expect(received).toHaveLength(2);
      const report = received[1];
      expect(report[0]).toStrictEqual({
        title: 'Input Fields',
        table: {
          tableColumns: ['Name', 'Notes', 'Hash Mode', 'Hash Count', 'Retrieved', 'Total Keyspace explored'],
          tableValues: ['Report Hashlist', 'Some notes', 0, 100, 42, 1000]
        }
      });
      expect(report[4]).toMatchObject({
        subtitle: 'Command: #HL# -a 0 rockyou.txt',
        ul: [
          { text: 'Keyspace: 1000 (Progress: 25.00%)', margin: [0, 0, 0, 5] },
          { text: 'File: rockyou.txt', margin: [0, 0, 0, 5] }
        ]
      });
      expect(dataSource.getOriginalData()).toBe(report);
    });

    it('sets loading to true while loading and back to false when finished', () => {
      const loadingStates = collectLoading();

      dataSource.loadAll();

      expect(loadingStates).toStrictEqual([false, true, false]);
      expect(cdrSpy.detectChanges).toHaveBeenCalledTimes(2);
    });

    it('keeps loading true until the request emits', () => {
      const response$ = new Subject<ResponseWrapper>();
      globalServiceSpy.get.mockReturnValue(response$);
      const loadingStates = collectLoading();

      dataSource.loadAll();

      expect(loadingStates).toStrictEqual([false, true]);

      response$.next(mockHashlistResponse());
      response$.complete();

      expect(loadingStates).toStrictEqual([false, true, false]);
    });

    it('swallows request errors, emits no data and resets the loading state', () => {
      globalServiceSpy.get.mockReturnValue(throwError(() => new Error('Server error')));
      const received = collectData();
      const loadingStates = collectLoading();

      dataSource.loadAll();

      expect(received).toStrictEqual([[]]);
      expect(dataSource.getOriginalData()).toStrictEqual([]);
      expect(loadingStates).toStrictEqual([false, true, false]);
    });

    it('registers the subscription so it is cancelled on disconnect', () => {
      const response$ = new Subject<ResponseWrapper>();
      globalServiceSpy.get.mockReturnValue(response$);
      dataSource.loadAll();

      dataSource.disconnect(viewer);

      expect(response$.observed).toBe(false);
    });
  });

  describe('reload', () => {
    it('delegates to loadAll', () => {
      const loadAllSpy = vi.spyOn(dataSource, 'loadAll');

      dataSource.reload();

      expect(loadAllSpy).toHaveBeenCalledOnce();
      expect(globalServiceSpy.get).toHaveBeenCalledOnce();
    });
  });

  describe('getReport', () => {
    it('sums the keyspace of all tasks', () => {
      const hashlist = buildHashlist([
        buildTask({ id: 1, keyspace: 100 }),
        buildTask({ id: 2, keyspace: 250 }),
        buildTask({ id: 3, keyspace: 650 })
      ]);

      const report = dataSource.getReport(hashlist);

      expect(tableValues(report)[5]).toBe(1000);
      expect(report).toHaveLength(7);
    });

    it.each([
      { tasks: undefined, condition: 'tasks are undefined' },
      { tasks: [], condition: 'the task list is empty' }
    ])('returns only the header sections when $condition', ({ tasks }) => {
      const hashlist = buildHashlist(tasks);

      const report = dataSource.getReport(hashlist);

      expect(report).toHaveLength(4);
      expect(tableValues(report)[5]).toBe(0);
    });

    it('ignores non-numeric keyspace values in the sum', () => {
      const hashlist = buildHashlist([
        buildTask({ id: 1, keyspace: '500' as unknown as number }),
        buildTask({ id: 2, keyspace: null as unknown as number }),
        buildTask({ id: 3, keyspace: 75 })
      ]);

      const report = dataSource.getReport(hashlist);

      expect(tableValues(report)[5]).toBe(75);
    });

    it.each([
      { keyspaceProgress: 3, expectedProgress: '100.00%' },
      { keyspaceProgress: 1, expectedProgress: '33.33%' }
    ])('reports keyspace progress as $expectedProgress', ({ keyspaceProgress, expectedProgress }) => {
      const hashlist = buildHashlist([buildTask({ keyspace: 3, keyspaceProgress })]);

      const report = dataSource.getReport(hashlist);

      expect(workflowAt(report, 4).ul?.[0].text).toBe(`Keyspace: 3 (Progress: ${expectedProgress})`);
    });

    it('does not add a preprocessor entry when the preprocessor command is empty', () => {
      const hashlist = buildHashlist([buildTask({ preprocessorCommand: '' })]);

      const report = dataSource.getReport(hashlist);

      expect(report[4]).not.toHaveProperty('0');
    });

    it('extracts every file name from the attack command', () => {
      const hashlist = buildHashlist([buildTask({ attackCmd: '#HL# -a 0 rockyou.txt -r best64.rule' })]);

      const report = dataSource.getReport(hashlist);

      expect(workflowAt(report, 4).ul).toStrictEqual([
        { text: 'Keyspace: 100 (Progress: 50.00%)', margin: [0, 0, 0, 5] },
        { text: 'File: rockyou.txt', margin: [0, 0, 0, 5] },
        { text: 'File: best64.rule', margin: [0, 0, 0, 5] }
      ]);
    });

    it.each([
      {
        attackCmd: '#HL# -a 3 ?d?d?d',
        description: 'an attack command without file names',
        expectedSubtitle: 'Command: #HL# -a 3 ?d?d?d'
      },
      { attackCmd: '', description: 'an empty attack command', expectedSubtitle: 'Command: ' }
    ])('adds no file entries for $description', ({ attackCmd, expectedSubtitle }) => {
      const hashlist = buildHashlist([buildTask({ attackCmd })]);

      const report = dataSource.getReport(hashlist);

      expect(workflowAt(report, 4).subtitle).toBe(expectedSubtitle);
      expect(workflowAt(report, 4).ul).toHaveLength(1);
    });
  });
});
