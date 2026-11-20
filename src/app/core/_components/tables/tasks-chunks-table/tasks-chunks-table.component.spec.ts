import { of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JChunk } from '@models/chunk.model';
import { FilterType } from '@models/request-params.model';

import { ChunkActionsService } from '@services/actions/chunk-actions.service';
import { AlertService } from '@services/shared/alert.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TasksChunksTableComponent } from '@components/tables/tasks-chunks-table/tasks-chunks-table.component';
import { TasksChunksTableCol } from '@components/tables/tasks-chunks-table/tasks-chunks-table.constants';

import { ChunkState } from '@src/app/core/_constants/chunks.config';

@Component({
  template: '',
  standalone: false
})
class TestTasksChunksTableComponent extends TasksChunksTableComponent {}

const createChunk = (overrides: Partial<JChunk> = {}): JChunk => ({
  id: 1,
  type: 'chunk',
  taskId: 1,
  skip: 0,
  length: 1000,
  agentId: null,
  dispatchTime: 0,
  solveTime: 0,
  checkpoint: 0,
  progress: 0,
  state: ChunkState.INIT,
  cracked: 0,
  speed: 0,
  ...overrides
});

describe('TasksChunksTableComponent', () => {
  let component: TestTasksChunksTableComponent;
  let fixture: ComponentFixture<TestTasksChunksTableComponent>;
  let mockChunkActionsService: MockedObject<ChunkActionsService>;
  let mockAlertService: MockedObject<AlertService>;

  beforeEach(async () => {
    mockChunkActionsService = {
      resetChunk: vi.fn().mockName('ChunkActionsService.resetChunk').mockReturnValue(of(undefined))
    } as MockedObject<ChunkActionsService>;
    mockAlertService = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage')
    } as MockedObject<AlertService>;

    await TestBed.configureTestingModule({
      declarations: [TestTasksChunksTableComponent],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: ChunkActionsService, useValue: mockChunkActionsService },
        { provide: AlertService, useValue: mockAlertService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestTasksChunksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    vi.spyOn(component.dataSource, 'loadAll').mockResolvedValue(undefined);
    vi.spyOn(component.dataSource, 'setTaskId');
    vi.spyOn(component.dataSource, 'setIsChunksLive');
    vi.spyOn(component.dataSource, 'clearFilter').mockImplementation(() => {});
  });

  it('should initialize the columns without loading when no task ID is supplied', () => {
    expect(component.tableColumns.length).toBe(11);
    expect(component.dataSource.loadAll).not.toHaveBeenCalled();
  });

  describe('getColumns', () => {
    it('should return the task chunk columns in display order', () => {
      const columns = component.getColumns();

      expect(columns.map((column) => column.id)).toStrictEqual([
        TasksChunksTableCol.ID,
        TasksChunksTableCol.START,
        TasksChunksTableCol.LENGTH,
        TasksChunksTableCol.CHECKPOINT,
        TasksChunksTableCol.PROGRESS,
        TasksChunksTableCol.AGENT,
        TasksChunksTableCol.DISPATCH_TIME,
        TasksChunksTableCol.LAST_ACTIVITY,
        TasksChunksTableCol.TIME_SPENT,
        TasksChunksTableCol.STATE,
        TasksChunksTableCol.CRACKED
      ]);
    });
  });

  describe('ngOnChanges', () => {
    it('should configure and load chunks when task inputs change', () => {
      fixture.componentRef.setInput('taskId', 42);
      fixture.componentRef.setInput('isChunksLive', 1);
      fixture.detectChanges();

      expect(component.dataSource.setTaskId).toHaveBeenCalledExactlyOnceWith(42);
      expect(component.dataSource.setIsChunksLive).toHaveBeenCalledExactlyOnceWith(1);
      expect(component.dataSource.loadAll).toHaveBeenCalledExactlyOnceWith();
    });

    it('should not load chunks when the task ID is cleared', () => {
      fixture.componentRef.setInput('taskId', null);
      fixture.detectChanges();

      expect(component.dataSource.loadAll).not.toHaveBeenCalled();
    });
  });

  describe('renderState', () => {
    it('should render a known state with its label and pill class', () => {
      const result = component.renderState(createChunk({ state: ChunkState.RUNNING }));

      expect(result).toBe('<span class="pill pill-running">Running</span>');
    });

    it('should render the raw value for an unknown state', () => {
      const chunk = createChunk();
      Reflect.set(chunk, 'state', 99);
      const result = component.renderState(chunk);

      expect(result).toBe('<span class="pill">99</span>');
    });
  });

  describe('renderTimeSpent', () => {
    it('should format the elapsed time between dispatch and solve', () => {
      const result = component.renderTimeSpent(createChunk({ dispatchTime: 50, solveTime: 110 }));

      expect(result.toString()).toBe('00:01:00');
    });

    it('should show zero when either timestamp is missing', () => {
      const result = component.renderTimeSpent(createChunk({ dispatchTime: 0, solveTime: 110 }));

      expect(result).toBe('0');
    });
  });

  describe('renderCheckpoint', () => {
    it('should include the checkpoint progress percentage', () => {
      const result = component.renderCheckpoint(createChunk({ checkpoint: 250, skip: 0, length: 1000 }));

      expect(result).toBe('250 (25%)');
    });

    it('should display zero when no checkpoint is available', () => {
      const result = component.renderCheckpoint(createChunk({ checkpoint: 0, skip: 0, length: 1000 }));

      expect(result).toBe('0');
    });
  });

  describe('renderProgress', () => {
    it('should format agent-reported progress as a percentage', () => {
      const result = component.renderProgress(createChunk({ progress: 4250 }));

      expect(result).toBe('42.5%');
    });

    it('should show N/A when progress is unavailable', () => {
      const chunk = createChunk();
      Reflect.set(chunk, 'progress', undefined);
      const result = component.renderProgress(chunk);

      expect(result).toBe('N/A');
    });
  });

  describe('renderDispatchTime and renderLastActivity', () => {
    it('should show N/A when dispatch time is unset', () => {
      expect(component.renderDispatchTime(createChunk({ dispatchTime: 0 }))).toBe('N/A');
    });

    it('should show the no-activity label when solve time is zero', () => {
      expect(component.renderLastActivity(createChunk({ solveTime: 0 }))).toBe('(No activity)');
    });

    it('should format a positive solve time', () => {
      const result = component.renderLastActivity(createChunk({ solveTime: 1_700_000_000 }));

      expect(result).not.toBe('(No activity)');
      expect(result).not.toBe('N/A');
    });
  });

  describe('filter', () => {
    it('should load a filter using the selected column metadata', () => {
      component.selectedFilterColumn = {
        id: TasksChunksTableCol.STATE,
        dataKey: 'state',
        parent: 'task'
      } as HTTableColumn;
      component.filter('Running');

      expect(component.dataSource.loadAll).toHaveBeenCalledExactlyOnceWith({
        value: 'Running',
        field: 'state',
        operator: FilterType.ICONTAINS,
        parent: 'task'
      });
    });

    it('should reload without a filter when the input is empty', () => {
      component.filter('');

      expect(component.dataSource.loadAll).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe('handleBackendSqlFilter', () => {
    it('should clear the filter when the input contains only whitespace', () => {
      component.handleBackendSqlFilter('   ');

      expect(component.dataSource.clearFilter).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe('rowActionClicked', () => {
    it('should reset the selected chunk and reload the table on success', () => {
      const chunk = createChunk({ id: 8 });
      const reload = vi.spyOn(component, 'reload');

      component.rowActionClicked({
        data: chunk,
        menuItem: { action: RowActionMenuAction.RESET, label: '' }
      } as ActionMenuEvent<JChunk>);

      expect(mockChunkActionsService.resetChunk).toHaveBeenCalledExactlyOnceWith(chunk);
      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledExactlyOnceWith('Successfully reseted chunk!');
      expect(reload).toHaveBeenCalledExactlyOnceWith();
    });
  });
});
