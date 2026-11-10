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
import { UIConfigService } from '@services/shared/storage.service';

import { HashlistReportDataSource } from '@src/app/shared/report-builder/datasources/hashlists.datasource';
import type {
  ReportSection,
  ReportSubtitleSection,
  ReportTableSection
} from '@src/app/shared/report-builder/reports/report-builder/report.models';
import { mockValidResponse } from '@src/app/testing/mock-response';

// Fixtures
const taskAttributes = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
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
  preprocessorCommand: '',
  ...overrides
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
  let uiServiceSpy: MockedObject<UIConfigService>;

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
      markForCheck: vi.fn(),
      detach: vi.fn(),
      detectChanges: vi.fn().mockName('ChangeDetectorRef.detectChanges'),
      reattach: vi.fn(),
      checkNoChanges: vi.fn()
    } as MockedObject<ChangeDetectorRef>;
    globalServiceSpy = {
      get: vi.fn().mockName('GlobalService.get')
    } as unknown as MockedObject<GlobalService>;
    uiServiceSpy = {
      getUISettings: vi.fn().mockName('UIConfigService.getUISettings')
    } as unknown as MockedObject<UIConfigService>;

    globalServiceSpy.get.mockReturnValue(of(mockHashlistResponse()));

    dataSource = new HashlistReportDataSource(cdrSpy, globalServiceSpy, uiServiceSpy);
  });

  describe('loadAll', () => {
    it('requests the configured hashlist with all required includes', () => {
      dataSource.setHashlistId(7);

      dataSource.loadAll();

      expect(globalServiceSpy.get).toHaveBeenCalledOnce();
      expect(globalServiceSpy.get).toHaveBeenCalledWith(SERV.HASHLISTS, 7, {
        include: ['accessGroup', 'tasks', 'hashType', 'hashlists']
      });
    });

    it('uses hashlist id 0 when no id has been set', () => {
      dataSource.loadAll();

      expect(globalServiceSpy.get).toHaveBeenCalledWith(SERV.HASHLISTS, 0, expect.anything());
    });

    it('deserializes the response and emits the generated report', () => {
      const received = collectData();
      dataSource.setHashlistId(7);

      dataSource.loadAll();

      expect(received).toHaveLength(2);
      const report = received[1];
      expect(report[0]).toEqual({
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

      expect(loadingStates).toEqual([false, true, false]);
      expect(cdrSpy.detectChanges).toHaveBeenCalledTimes(2);
    });

    it('keeps loading true until the request emits', () => {
      const response$ = new Subject<ResponseWrapper>();
      globalServiceSpy.get.mockReturnValue(response$);
      const loadingStates = collectLoading();

      dataSource.loadAll();

      expect(loadingStates).toEqual([false, true]);

      response$.next(mockHashlistResponse());
      response$.complete();

      expect(loadingStates).toEqual([false, true, false]);
    });

    it('swallows request errors, emits no data and resets the loading state', () => {
      globalServiceSpy.get.mockReturnValue(throwError(() => new Error('Server error')));
      const received = collectData();
      const loadingStates = collectLoading();

      expect(() => dataSource.loadAll()).not.toThrow();

      expect(received).toEqual([[]]);
      expect(dataSource.getOriginalData()).toEqual([]);
      expect(loadingStates).toEqual([false, true, false]);
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
    it('builds the static report header for a hashlist with a single task', () => {
      const hashlist = buildHashlist([buildTask({ attackCmd: '#HL# -a 3 ?a?a', keyspace: 200, keyspaceProgress: 50 })]);

      const report = dataSource.getReport(hashlist);

      expect(report).toEqual([
        {
          title: 'Input Fields',
          table: {
            tableColumns: ['Name', 'Notes', 'Hash Mode', 'Hash Count', 'Retrieved', 'Total Keyspace explored'],
            tableValues: ['My Hashlist', 'Notes', 1400, 10, 3, 200]
          }
        },
        { break: 1 },
        { title: 'WorkFlow Completed' },
        { break: 1 },
        {
          subtitle: 'Command: #HL# -a 3 ?a?a',
          ul: [{ text: 'Keyspace: 200 (Progress: 25.00%)', margin: [0, 0, 0, 5] }]
        }
      ]);
    });

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

    it('returns only the header sections when tasks are undefined', () => {
      const hashlist = buildHashlist(undefined);

      const report = dataSource.getReport(hashlist);

      expect(report).toHaveLength(4);
      expect(tableValues(report)[5]).toBe(0);
    });

    it('returns only the header sections for an empty task list', () => {
      const hashlist = buildHashlist([]);

      const report = dataSource.getReport(hashlist);

      expect(report).toHaveLength(4);
      expect(tableValues(report)[5]).toBe(0);
    });

    it('passes through missing hashlist attributes as undefined', () => {
      const hashlist = { id: 1, type: 'hashlist', tasks: [] } as unknown as JHashlist;

      const report = dataSource.getReport(hashlist);

      expect(tableValues(report)).toEqual([undefined, undefined, undefined, undefined, undefined, 0]);
    });

    it('ignores a keyspace of 0 in the sum and reports NaN progress', () => {
      const hashlist = buildHashlist([buildTask({ keyspace: 0, keyspaceProgress: 0 })]);

      const report = dataSource.getReport(hashlist);

      expect(tableValues(report)[5]).toBe(0);
      expect(workflowAt(report, 4).ul?.[0]).toEqual({ text: 'Keyspace: 0 (Progress: NaN%)', margin: [0, 0, 0, 5] });
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

    it('reports 100.00% progress when the keyspace is fully explored', () => {
      const hashlist = buildHashlist([buildTask({ keyspace: 3, keyspaceProgress: 3 })]);

      const report = dataSource.getReport(hashlist);

      expect(workflowAt(report, 4).ul?.[0].text).toBe('Keyspace: 3 (Progress: 100.00%)');
    });

    it('rounds the progress to two decimals', () => {
      const hashlist = buildHashlist([buildTask({ keyspace: 3, keyspaceProgress: 1 })]);

      const report = dataSource.getReport(hashlist);

      expect(workflowAt(report, 4).ul?.[0].text).toBe('Keyspace: 3 (Progress: 33.33%)');
    });

    it('adds the preprocessor command to the workflow entry', () => {
      const hashlist = buildHashlist([buildTask({ preprocessorCommand: '--pw-min=8' })]);

      const report = dataSource.getReport(hashlist);

      expect(report[4]).toMatchObject({ 0: { subtitle: 'Preprocessor Command: --pw-min=8' } });
    });

    it('does not add a preprocessor entry when the preprocessor command is empty', () => {
      const hashlist = buildHashlist([buildTask({ preprocessorCommand: '' })]);

      const report = dataSource.getReport(hashlist);

      expect(report[4]).not.toHaveProperty('0');
    });

    it('extracts every file name from the attack command', () => {
      const hashlist = buildHashlist([buildTask({ attackCmd: '#HL# -a 0 rockyou.txt -r best64.rule' })]);

      const report = dataSource.getReport(hashlist);

      expect(workflowAt(report, 4).ul).toEqual([
        { text: 'Keyspace: 100 (Progress: 50.00%)', margin: [0, 0, 0, 5] },
        { text: 'File: rockyou.txt', margin: [0, 0, 0, 5] },
        { text: 'File: best64.rule', margin: [0, 0, 0, 5] }
      ]);
    });

    it('adds no file entries when the attack command contains no file names', () => {
      const hashlist = buildHashlist([buildTask({ attackCmd: '#HL# -a 3 ?d?d?d' })]);

      const report = dataSource.getReport(hashlist);

      expect(workflowAt(report, 4).ul).toHaveLength(1);
    });

    it('adds no file entries for an empty attack command', () => {
      const hashlist = buildHashlist([buildTask({ attackCmd: '' })]);

      const report = dataSource.getReport(hashlist);

      expect(workflowAt(report, 4).subtitle).toBe('Command: ');
      expect(workflowAt(report, 4).ul).toHaveLength(1);
    });

    it('accumulates files and preprocessor commands of previous tasks into later workflow entries', () => {
      const hashlist = buildHashlist([
        buildTask({ id: 1, attackCmd: '#HL# a.txt', preprocessorCommand: 'pre1' }),
        buildTask({ id: 2, attackCmd: '#HL# b.txt', preprocessorCommand: 'pre2' })
      ]);

      const report = dataSource.getReport(hashlist);

      expect(workflowAt(report, 4).ul?.map((item) => item.text)).toEqual([
        'Keyspace: 100 (Progress: 50.00%)',
        'File: a.txt'
      ]);
      expect(workflowAt(report, 5).ul?.map((item) => item.text)).toEqual([
        'Keyspace: 100 (Progress: 50.00%)',
        'File: a.txt',
        'File: b.txt'
      ]);
      expect(report[5]).toMatchObject({
        0: { subtitle: 'Preprocessor Command: pre1' },
        1: { subtitle: 'Preprocessor Command: pre2' }
      });
    });

    it('throws a TypeError when a task has no attack command', () => {
      const hashlist = buildHashlist([buildTask({ attackCmd: undefined as unknown as string })]);

      expect(() => dataSource.getReport(hashlist)).toThrow(TypeError);
    });

    it('throws a TypeError when the hashlist is null', () => {
      expect(() => dataSource.getReport(null as unknown as JHashlist)).toThrow(TypeError);
    });
  });
});
