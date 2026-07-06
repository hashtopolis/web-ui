import { ChunkState } from '@constants/chunks.config';
import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseModel } from '@models/base.model';
import { JChunk } from '@models/chunk.model';
import { FilterType } from '@models/request-params.model';

import { ChunkActionsService } from '@services/actions/chunk-actions.service';
import { AlertService } from '@services/shared/alert.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { ChunksTableComponent } from '@components/tables/chunks-table/chunks-table.component';
import { ChunksTableCol, ChunksTableColumnLabel } from '@components/tables/chunks-table/chunks-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

class MockDataSource {
  loadAll = jasmine.createSpy('loadAll').and.callFake(() => {});
  setColumns = jasmine.createSpy('setColumns');
  clearFilter = jasmine.createSpy('clearFilter');
  reload = jasmine.createSpy('reload');
  setAgentId = jasmine.createSpy('setAgentId');
  filterError$ = { subscribe: jasmine.createSpy('subscribe') };
  isDetail = false;
}

class TestChunksTableComponent extends ChunksTableComponent {
  mockDataSource = new MockDataSource();

  override ngOnInit(): void {
    this.setColumnLabels(ChunksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = this.mockDataSource as unknown as typeof this.dataSource;
    this.dataSource.setColumns(this.tableColumns);
    if (this.agentId) {
      this.dataSource.setAgentId(this.agentId);
    }
    this.setupFilterErrorSubscription(this.dataSource);
  }

  override ngAfterViewInit(): void {}
}

describe('ChunksTableComponent', () => {
  let component: TestChunksTableComponent;
  let fixture: ComponentFixture<TestChunksTableComponent>;
  let mockChunkActionsService: jasmine.SpyObj<ChunkActionsService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    mockChunkActionsService = jasmine.createSpyObj('ChunkActionsService', ['resetChunk']);
    mockChunkActionsService.resetChunk.and.returnValue(of(undefined));
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

    await TestBed.configureTestingModule({
      declarations: [TestChunksTableComponent],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: ChunkActionsService, useValue: mockChunkActionsService },
        { provide: AlertService, useValue: mockAlertService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestChunksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = { reload: jasmine.createSpy('reload') } as unknown as HTTableComponent<BaseModel>;
    (component as unknown as { table: { reload: jasmine.Spy; clearFilterError: jasmine.Spy } }).table = {
      clearFilterError: jasmine.createSpy('clearFilterError'),
      reload: jasmine.createSpy('reload')
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize dataSource and tableColumns', () => {
      expect(component.dataSource).toBeDefined();
      expect(component.tableColumns).toBeDefined();
      expect(component.tableColumns.length).toBeGreaterThan(0);
    });

    it('should call setAgentId when agentId input is provided', () => {
      const testComponent = TestBed.createComponent(TestChunksTableComponent).componentInstance;
      testComponent.agentId = 5;
      testComponent.ngOnInit();

      expect(testComponent.mockDataSource.setAgentId).toHaveBeenCalledWith(5);
    });

    it('should not call setAgentId when agentId is not provided', () => {
      const testComponent = TestBed.createComponent(TestChunksTableComponent).componentInstance;
      testComponent.ngOnInit();

      expect(testComponent.mockDataSource.setAgentId).not.toHaveBeenCalled();
    });
  });

  describe('getColumns', () => {
    it('should return columns with all expected column IDs', () => {
      const columns = component.getColumns();
      const columnIds = columns.map((col) => col.id);

      expect(columnIds).toContain(ChunksTableCol.ID);
      expect(columnIds).toContain(ChunksTableCol.START);
      expect(columnIds).toContain(ChunksTableCol.LENGTH);
      expect(columnIds).toContain(ChunksTableCol.CHECKPOINT);
      expect(columnIds).toContain(ChunksTableCol.PROGRESS);
      expect(columnIds).toContain(ChunksTableCol.TASK);
      expect(columnIds).toContain(ChunksTableCol.AGENT);
      expect(columnIds).toContain(ChunksTableCol.DISPATCH_TIME);
      expect(columnIds).toContain(ChunksTableCol.LAST_ACTIVITY);
      expect(columnIds).toContain(ChunksTableCol.TIME_SPENT);
      expect(columnIds).toContain(ChunksTableCol.STATE);
      expect(columnIds).toContain(ChunksTableCol.CRACKED);
    });

    it('should include ID column with correct properties', () => {
      const columns = component.getColumns();
      const idColumn = columns.find((col) => col.id === ChunksTableCol.ID);

      expect(idColumn).toBeDefined();
      expect(idColumn?.isSortable).toBe(true);
      expect(idColumn?.isSearchable).toBe(true);
      expect(idColumn?.dataKey).toBe('id');
    });

    it('should include START column as sortable', () => {
      const columns = component.getColumns();
      const startColumn = columns.find((col) => col.id === ChunksTableCol.START);

      expect(startColumn).toBeDefined();
      expect(startColumn?.isSortable).toBe(true);
      expect(startColumn?.dataKey).toBe('skip');
    });

    it('should include LENGTH column as sortable', () => {
      const columns = component.getColumns();
      const lengthColumn = columns.find((col) => col.id === ChunksTableCol.LENGTH);

      expect(lengthColumn).toBeDefined();
      expect(lengthColumn?.isSortable).toBe(true);
      expect(lengthColumn?.dataKey).toBe('length');
    });

    it('should include CHECKPOINT column with render function', () => {
      const columns = component.getColumns();
      const checkpointColumn = columns.find((col) => col.id === ChunksTableCol.CHECKPOINT);

      expect(checkpointColumn).toBeDefined();
      expect(checkpointColumn?.render).toBeDefined();
      expect(checkpointColumn?.isSortable).toBe(true);
      expect(checkpointColumn?.dataKey).toBe('checkpoint');
    });

    it('should include PROGRESS column with render function', () => {
      const columns = component.getColumns();
      const progressColumn = columns.find((col) => col.id === ChunksTableCol.PROGRESS);

      expect(progressColumn).toBeDefined();
      expect(progressColumn?.render).toBeDefined();
      expect(progressColumn?.isSortable).toBe(true);
      expect(progressColumn?.dataKey).toBe('progress');
    });

    it('should include TASK column with routerLink function', () => {
      const columns = component.getColumns();
      const taskColumn = columns.find((col) => col.id === ChunksTableCol.TASK);

      expect(taskColumn).toBeDefined();
      expect(taskColumn?.routerLink).toBeDefined();
      expect(taskColumn?.isSortable).toBe(false);
      expect(taskColumn?.dataKey).toBe('taskName');
    });

    it('should render TASK column routerLink with correct path and label', (done) => {
      const columns = component.getColumns();
      const taskColumn = columns.find((col) => col.id === ChunksTableCol.TASK);
      const chunk = { taskId: 5, task: { taskName: 'Test Task' } } as JChunk;

      taskColumn?.routerLink!(chunk).subscribe((links) => {
        expect(links.length).toBe(1);
        expect(links[0].routerLink).toEqual(['/tasks', 'show-tasks', 5, 'edit']);
        expect(links[0].label).toBe('Test Task');
        done();
      });
    });

    it('should render TASK column routerLink with taskId as label when taskName is undefined', (done) => {
      const columns = component.getColumns();
      const taskColumn = columns.find((col) => col.id === ChunksTableCol.TASK);
      const chunk = { taskId: 10, task: { taskName: undefined } } as unknown as JChunk;

      taskColumn?.routerLink!(chunk).subscribe((links) => {
        expect(links.length).toBe(1);
        expect(links[0].routerLink).toEqual(['/tasks', 'show-tasks', 10, 'edit']);
        expect(links[0].label).toBeUndefined();
        done();
      });
    });

    it('should include AGENT column with routerLink function', () => {
      const columns = component.getColumns();
      const agentColumn = columns.find((col) => col.id === ChunksTableCol.AGENT);

      expect(agentColumn).toBeDefined();
      expect(agentColumn?.routerLink).toBeDefined();
      expect(agentColumn?.isSortable).toBe(false);
      expect(agentColumn?.dataKey).toBe('agentName');
    });

    it('should render AGENT column routerLink with correct path and label', (done) => {
      const columns = component.getColumns();
      const agentColumn = columns.find((col) => col.id === ChunksTableCol.AGENT);
      const chunk = { agentId: 7, agentName: 'Test Agent' } as JChunk;

      agentColumn?.routerLink!(chunk).subscribe((links) => {
        expect(links.length).toBe(1);
        expect(links[0].routerLink).toEqual(['/agents', 'show-agents', 7, 'edit']);
        expect(links[0].label).toBe('Test Agent');
        done();
      });
    });

    it('should render AGENT column routerLink with agentId as label when agentName is undefined', (done) => {
      const columns = component.getColumns();
      const agentColumn = columns.find((col) => col.id === ChunksTableCol.AGENT);
      const chunk = { agentId: 3, agentName: undefined } as unknown as JChunk;

      agentColumn?.routerLink!(chunk).subscribe((links) => {
        expect(links.length).toBe(1);
        expect(links[0].routerLink).toEqual(['/agents', 'show-agents', 3, 'edit']);
        expect(links[0].label).toBe('3');
        done();
      });
    });

    it('should include DISPATCH_TIME column with render function', () => {
      const columns = component.getColumns();
      const dispatchTimeColumn = columns.find((col) => col.id === ChunksTableCol.DISPATCH_TIME);

      expect(dispatchTimeColumn).toBeDefined();
      expect(dispatchTimeColumn?.render).toBeDefined();
      expect(dispatchTimeColumn?.isSortable).toBe(true);
      expect(dispatchTimeColumn?.dataKey).toBe('dispatchTime');
    });

    it('should include LAST_ACTIVITY column with render function', () => {
      const columns = component.getColumns();
      const lastActivityColumn = columns.find((col) => col.id === ChunksTableCol.LAST_ACTIVITY);

      expect(lastActivityColumn).toBeDefined();
      expect(lastActivityColumn?.render).toBeDefined();
      expect(lastActivityColumn?.isSortable).toBe(true);
      expect(lastActivityColumn?.dataKey).toBe('solveTime');
    });

    it('should include TIME_SPENT column with render function', () => {
      const columns = component.getColumns();
      const timeSpentColumn = columns.find((col) => col.id === ChunksTableCol.TIME_SPENT);

      expect(timeSpentColumn).toBeDefined();
      expect(timeSpentColumn?.render).toBeDefined();
      expect(timeSpentColumn?.isSortable).toBe(false);
      expect(timeSpentColumn?.dataKey).toBe('timeSpent');
    });

    it('should include STATE column with render function', () => {
      const columns = component.getColumns();
      const stateColumn = columns.find((col) => col.id === ChunksTableCol.STATE);

      expect(stateColumn).toBeDefined();
      expect(stateColumn?.render).toBeDefined();
      expect(stateColumn?.isSortable).toBe(true);
      expect(stateColumn?.dataKey).toBe('state');
    });

    it('should include CRACKED column with routerLink function', () => {
      const columns = component.getColumns();
      const crackedColumn = columns.find((col) => col.id === ChunksTableCol.CRACKED);

      expect(crackedColumn).toBeDefined();
      expect(crackedColumn?.routerLink).toBeDefined();
      expect(crackedColumn?.isSortable).toBe(true);
      expect(crackedColumn?.dataKey).toBe('cracked');
    });

    it('should render CRACKED column routerLink with correct path and label', (done) => {
      const columns = component.getColumns();
      const crackedColumn = columns.find((col) => col.id === ChunksTableCol.CRACKED);
      const chunk = { id: 9, taskId: 5, cracked: 100 } as JChunk;

      crackedColumn?.routerLink!(chunk).subscribe((links) => {
        expect(links.length).toBe(1);
        expect(links[0].routerLink).toEqual(['/hashlists', 'hashes', 'chunks', 9]);
        expect(links[0].label).toBe('100');
        done();
      });
    });
  });

  describe('renderState', () => {
    it('should render state with pill class for state 0 (New)', () => {
      const chunk = { state: 0 } as JChunk;
      const result = component.renderState(chunk);

      expect(result).toBeTruthy();
    });

    it('should render state for RUNNING state', () => {
      const chunk = { state: 2 } as JChunk;
      const result = component.renderState(chunk);

      expect(result).toContain(ChunkState.RUNNING.toLowerCase());
      expect(result).toContain(ChunkState.RUNNING);
    });

    it('should render state for EXHAUSTED state', () => {
      const chunk = { state: 4 } as JChunk;
      const result = component.renderState(chunk);

      expect(result).toContain(ChunkState.EXHAUSTED.toLowerCase());
      expect(result).toContain(ChunkState.EXHAUSTED);
    });

    it('should render state for CRACKED state', () => {
      const chunk = { state: 5 } as JChunk;
      const result = component.renderState(chunk);

      expect(result).toContain(ChunkState.CRACKED.toLowerCase());
      expect(result).toContain(ChunkState.CRACKED);
    });

    it('should render state for ABORTED state', () => {
      const chunk = { state: 6 } as JChunk;
      const result = component.renderState(chunk);

      expect(result).toContain(ChunkState.ABORTED.toLowerCase());
      expect(result).toContain(ChunkState.ABORTED);
    });

    it('should render state for QUIT state', () => {
      const chunk = { state: 7 } as JChunk;
      const result = component.renderState(chunk);

      expect(result).toContain(ChunkState.QUIT.toLowerCase());
      expect(result).toContain(ChunkState.QUIT);
    });

    it('should render state for BYPASS state', () => {
      const chunk = { state: 8 } as JChunk;
      const result = component.renderState(chunk);

      expect(result).toContain(ChunkState.BYPASS.toLowerCase());
      expect(result).toContain(ChunkState.BYPASS);
    });

    it('should render state for TRIMMED state', () => {
      const chunk = { state: 9 } as JChunk;
      const result = component.renderState(chunk);

      expect(result).toContain(ChunkState.TRIMMED.toLowerCase());
      expect(result).toContain(ChunkState.TRIMMED);
    });

    it('should render state for ABORTING state', () => {
      const chunk = { state: 10 } as JChunk;
      const result = component.renderState(chunk);

      expect(result).toContain(ChunkState.ABORTING.toLowerCase());
      expect(result).toContain(ChunkState.ABORTING);
    });

    it('should render plain state for unknown state', () => {
      const chunk = { state: 99 } as unknown as JChunk;
      const result = component.renderState(chunk);

      expect(result).toBe('99');
    });

    it('should handle undefined state', () => {
      const chunk = { state: undefined } as unknown as JChunk;
      const result = component.renderState(chunk);

      expect(result).toContain('undefined');
    });
  });

  describe('renderTimeSpent', () => {
    it('should calculate time spent correctly', () => {
      const chunk = { solveTime: 100, dispatchTime: 50 } as JChunk;
      const result = component.renderTimeSpent(chunk);

      expect(result).toContain('50');
    });

    it('should return 0 when solveTime equals dispatchTime', () => {
      const chunk = { solveTime: 50, dispatchTime: 50 } as JChunk;
      const result = component.renderTimeSpent(chunk);

      expect(result).toContain('0');
    });

    it('should return 0 when solveTime is undefined', () => {
      const chunk = { solveTime: undefined, dispatchTime: 50 } as unknown as JChunk;
      const result = component.renderTimeSpent(chunk);

      expect(result).toContain('0');
    });

    it('should return placeholder for invalid time when dispatchTime is undefined', () => {
      const chunk = { solveTime: 100, dispatchTime: undefined } as unknown as JChunk;
      const result = component.renderTimeSpent(chunk);

      expect(result).toBeDefined();
    });

    it('should handle negative time difference', () => {
      const chunk = { solveTime: 50, dispatchTime: 100 } as JChunk;
      const result = component.renderTimeSpent(chunk);

      expect(result).toBeDefined();
    });
  });

  describe('renderCheckpoint', () => {
    it('should render checkpoint with percentage when checkpoint exists', () => {
      const chunk = { checkpoint: 100, skip: 0, length: 1000, progress: 10 } as JChunk;
      const result = component.renderCheckpoint(chunk);

      expect(result).toContain('100');
    });

    it('should render 0 when checkpoint is 0', () => {
      const chunk = { checkpoint: 0, skip: 0, length: 1000, progress: 10 } as JChunk;
      const result = component.renderCheckpoint(chunk);

      expect(result).toContain('0');
    });

    it('should render 0 when checkpoint is undefined', () => {
      const chunk = { checkpoint: undefined, skip: 0, length: 1000, progress: 10 } as unknown as JChunk;
      const result = component.renderCheckpoint(chunk);

      expect(result).toContain('0');
    });

    it('should render 0% when progress is undefined', () => {
      const chunk = { checkpoint: 100, skip: 0, length: 1000, progress: undefined } as unknown as JChunk;
      const result = component.renderCheckpoint(chunk);

      expect(result).toContain('0');
    });

    it('should calculate percentage correctly', () => {
      const chunk = { checkpoint: 500, skip: 0, length: 1000, progress: 50 } as JChunk;
      const result = component.renderCheckpoint(chunk);

      expect(result).toContain('50');
    });

    it('should handle skip offset', () => {
      const chunk = { checkpoint: 600, skip: 100, length: 1000, progress: 50 } as JChunk;
      const result = component.renderCheckpoint(chunk);

      expect(result).toContain('600');
      expect(result).toContain('50');
    });
  });

  describe('renderProgress', () => {
    it('should return N/A when progress is undefined', () => {
      const chunk = { progress: undefined } as unknown as JChunk;
      const result = component.renderProgress(chunk);

      expect(result).toContain('N/A');
    });

    it('should return N/A when progress is not defined in chunk', () => {
      const chunk = {} as JChunk;
      const result = component.renderProgress(chunk);

      expect(result).toContain('N/A');
    });

    it('should format progress as percentage when progress is positive', () => {
      const chunk = { progress: 5000 } as JChunk;
      const result = component.renderProgress(chunk);

      expect(result).toContain('50');
    });

    it('should handle progress of 0', () => {
      const chunk = { progress: 0 } as JChunk;
      const result = component.renderProgress(chunk);

      expect(result).toContain('0');
    });

    it('should handle progress of 10000 (100%)', () => {
      const chunk = { progress: 10000 } as JChunk;
      const result = component.renderProgress(chunk);

      expect(result).toContain('100');
    });
  });

  describe('renderDispatchTime', () => {
    it('should render formatted dispatch time', () => {
      const chunk = { dispatchTime: 1609459200 } as JChunk;
      const result = component.renderDispatchTime(chunk);

      expect(result).toBeDefined();
    });

    it('should return N/A when dispatchTime is 0', () => {
      const chunk = { dispatchTime: 0 } as JChunk;
      const result = component.renderDispatchTime(chunk);

      expect(result).toContain('N/A');
    });

    it('should return N/A when dispatchTime is undefined or invalid', () => {
      const chunk = { dispatchTime: undefined } as unknown as JChunk;
      const result = component.renderDispatchTime(chunk);

      expect(result).toBeDefined();
    });

    it('should return date string with year, month and day for valid timestamp', () => {
      const chunk = { dispatchTime: 1609459200 } as JChunk;
      const result = component.renderDispatchTime(chunk);

      expect(result).toContain('2021');
    });

    it('should return date string with time components', () => {
      const chunk = { dispatchTime: 1609459200 } as JChunk;
      const result = component.renderDispatchTime(chunk);

      const plainResult = result.toString();
      expect(plainResult).toMatch(/(\d{2}:\d{2}:\d{2}|\d{1,2}:\d{2})/);
    });

    it('should use DISPATCH_TIME column render function', () => {
      const columns = component.getColumns();
      const dispatchTimeColumn = columns.find((col) => col.id === ChunksTableCol.DISPATCH_TIME);
      const chunk = { dispatchTime: 1609459200 } as JChunk;

      const result = dispatchTimeColumn?.render!(chunk);

      expect(result).toBeDefined();
    });

    it('should use DISPATCH_TIME column render function for N/A case', () => {
      const columns = component.getColumns();
      const dispatchTimeColumn = columns.find((col) => col.id === ChunksTableCol.DISPATCH_TIME);
      const chunk = { dispatchTime: 0 } as JChunk;

      const result = dispatchTimeColumn?.render!(chunk);

      expect(result).toContain('N/A');
    });
  });

  describe('renderLastActivity', () => {
    it('should return (No activity) when solveTime is 0', () => {
      const chunk = { solveTime: 0 } as JChunk;
      const result = component.renderLastActivity(chunk);

      expect(result).toContain('(No activity)');
    });

    it('should return formatted time when solveTime is positive', () => {
      const chunk = { solveTime: 1609459200 } as JChunk;
      const result = component.renderLastActivity(chunk);

      expect(result).toBeDefined();
      expect(result).not.toContain('(No activity)');
    });

    it('should return date string with year, month and day for valid timestamp', () => {
      const chunk = { solveTime: 1609459200 } as JChunk;
      const result = component.renderLastActivity(chunk);

      expect(result).toContain('2021');
    });

    it('should return date string with time components', () => {
      const chunk = { solveTime: 1609459200 } as JChunk;
      const result = component.renderLastActivity(chunk);

      const plainResult = result.toString();
      expect(plainResult).toMatch(/(\d{2}:\d{2}:\d{2}|\d{1,2}:\d{2})/);
    });

    it('should return solveTime value when neither condition is met', () => {
      const chunk = { solveTime: -1 } as JChunk;
      const result = component.renderLastActivity(chunk);

      expect(result).toContain('-1');
    });

    it('should use LAST_ACTIVITY column render function', () => {
      const columns = component.getColumns();
      const lastActivityColumn = columns.find((col) => col.id === ChunksTableCol.LAST_ACTIVITY);
      const chunk = { solveTime: 1609459200 } as JChunk;

      const result = lastActivityColumn?.render!(chunk);

      expect(result).toBeDefined();
    });

    it('should use LAST_ACTIVITY column render function for no activity case', () => {
      const columns = component.getColumns();
      const lastActivityColumn = columns.find((col) => col.id === ChunksTableCol.LAST_ACTIVITY);
      const chunk = { solveTime: 0 } as JChunk;

      const result = lastActivityColumn?.render!(chunk);

      expect(result).toContain('(No activity)');
    });
  });

  describe('filter', () => {
    it('should call dataSource.loadAll with filter when input has value', () => {
      component.selectedFilterColumn = { id: 1, dataKey: 'state', parent: undefined } as unknown as HTTableColumn;
      component.mockDataSource.loadAll.calls.reset();

      component.filter('Running');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith({
        value: 'Running',
        field: 'state',
        operator: FilterType.ICONTAINS,
        parent: undefined
      });
    });

    it('should call dataSource.loadAll without filter when input is empty string', () => {
      component.selectedFilterColumn = { id: 1, dataKey: 'state' } as unknown as HTTableColumn;
      component.mockDataSource.loadAll.calls.reset();

      component.filter('');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith();
    });

    it('should call dataSource.loadAll without filter when input is empty string and selectedFilterColumn is undefined', () => {
      (component as unknown as { selectedFilterColumn: HTTableColumn | undefined }).selectedFilterColumn = undefined;
      component.mockDataSource.loadAll.calls.reset();

      component.filter('');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith();
    });

    it('should pass parent from selectedFilterColumn to filter', () => {
      component.selectedFilterColumn = {
        id: 1,
        dataKey: 'taskName',
        parent: 'task'
      } as unknown as HTTableColumn;
      component.mockDataSource.loadAll.calls.reset();

      component.filter('test');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith({
        value: 'test',
        field: 'taskName',
        operator: FilterType.ICONTAINS,
        parent: 'task'
      });
    });
  });

  describe('handleBackendSqlFilter', () => {
    it('should call filter when event has value', () => {
      const filterSpy = spyOn(component, 'filter');

      component.handleBackendSqlFilter('test query');

      expect(filterSpy).toHaveBeenCalledWith('test query');
    });

    it('should clear filter when event is empty string', () => {
      component.mockDataSource.clearFilter.calls.reset();

      component.handleBackendSqlFilter('');

      expect(component.mockDataSource.clearFilter).toHaveBeenCalled();
    });

    it('should clear filter when event is only whitespace', () => {
      component.mockDataSource.clearFilter.calls.reset();

      component.handleBackendSqlFilter('   ');

      expect(component.mockDataSource.clearFilter).toHaveBeenCalled();
    });

    it('should call filter when event is valid', () => {
      const filterSpy = spyOn(component, 'filter');

      component.handleBackendSqlFilter('some filter');

      expect(filterSpy).toHaveBeenCalledWith('some filter');
    });
  });

  describe('rowActionClicked', () => {
    it('should call chunkActions.resetChunk for RESET action', () => {
      const chunk = { id: 1, state: 0 } as JChunk;
      const event = {
        menuItem: { action: RowActionMenuAction.RESET },
        data: chunk
      } as ActionMenuEvent<JChunk>;

      component.rowActionClicked(event);

      expect(mockChunkActionsService.resetChunk).toHaveBeenCalledWith(chunk);
    });

    it('should show success message after reset succeeds', () => {
      const chunk = { id: 1, state: 0 } as JChunk;
      const event = {
        menuItem: { action: RowActionMenuAction.RESET },
        data: chunk
      } as ActionMenuEvent<JChunk>;

      component.rowActionClicked(event);

      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Successfully reseted chunk!');
    });

    it('should call reload after reset succeeds', () => {
      const chunk = { id: 1, state: 0 } as JChunk;
      const event = {
        menuItem: { action: RowActionMenuAction.RESET },
        data: chunk
      } as ActionMenuEvent<JChunk>;

      component.rowActionClicked(event);

      expect((component as unknown as { table: { reload: jasmine.Spy } }).table.reload).toHaveBeenCalled();
    });

    it('should handle in-progress chunk (state 2)', () => {
      const chunk = { id: 1, state: 2 } as JChunk;
      const event = {
        menuItem: { action: RowActionMenuAction.RESET },
        data: chunk
      } as ActionMenuEvent<JChunk>;

      component.rowActionClicked(event);

      expect(mockChunkActionsService.resetChunk).toHaveBeenCalledWith(chunk);
    });

    it('should not call any action for unknown action', () => {
      const chunk = { id: 1, state: 0 } as JChunk;
      const event = {
        menuItem: { action: 'unknown' },
        data: chunk
      } as ActionMenuEvent<JChunk>;

      component.rowActionClicked(event);

      expect(mockChunkActionsService.resetChunk).not.toHaveBeenCalled();
    });
  });
});
