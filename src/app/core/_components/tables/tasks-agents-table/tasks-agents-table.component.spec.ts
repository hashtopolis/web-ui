import { Subject, of } from 'rxjs';
import type { MockedObject } from 'vitest';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BaseModel } from '@models/base.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TasksAgentsTableComponent } from '@components/tables/tasks-agents-table/tasks-agents-table.component';
import {
  TasksAgentsTableCol,
  TasksAgentsTableColumnLabel
} from '@components/tables/tasks-agents-table/tasks-agents-table.constants';

import { AgentsDataSource } from '@datasources/agents.datasource';

import { JAgent } from '@src/app/core/_models/agent.model';
import { ExportService } from '@src/app/core/_services/export/export.service';
import { SERV } from '@src/app/core/_services/main.config';
import { GlobalService } from '@src/app/core/_services/main.service';
import { AlertService } from '@src/app/core/_services/shared/alert.service';
import { formatSeconds } from '@src/app/shared/utils/datetime';
import { convertCrackingSpeed } from '@src/app/shared/utils/util';

class MockTasksAgentsDataSource {
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
}

/**
 * Helpers to open a dialog and simulate its close result.
 */
function openDialogAndClose(
  mockDialog: MockedObject<MatDialog>,
  triggerFn: () => void
): Subject<{
  action: string;
  data: JAgent[];
} | null> {
  const afterClosedSubject = new Subject<{
    action: string;
    data: JAgent[];
  } | null>();
  mockDialog.open.mockReturnValue({
    afterClosed: () => afterClosedSubject.asObservable()
  } as MatDialogRef<unknown>);
  triggerFn();
  return afterClosedSubject;
}

class TestTasksAgentsTableComponent extends TasksAgentsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(TasksAgentsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockTasksAgentsDataSource() as unknown as AgentsDataSource;
  }
}

describe('TasksAgentsTableComponent', () => {
  let component: TestTasksAgentsTableComponent;
  let fixture: ComponentFixture<TestTasksAgentsTableComponent>;
  let mockExportService: MockedObject<ExportService>;
  let mockHTTable: MockedObject<HTTableComponent<BaseModel>>;
  let mockDialog: MockedObject<MatDialog>;
  let mockGlobalService: MockedObject<GlobalService>;
  let mockAlertService: MockedObject<AlertService>;

  beforeEach(async () => {
    mockExportService = {
      handleExportAction: vi.fn().mockName('ExportService.handleExportAction')
    } as MockedObject<ExportService>;
    mockHTTable = {
      reload: vi.fn().mockName('HTTableComponent.reload')
    } as MockedObject<HTTableComponent<BaseModel>>;
    mockDialog = {
      open: vi.fn().mockName('MatDialog.open')
    } as MockedObject<MatDialog>;
    mockGlobalService = {
      delete: vi.fn().mockName('GlobalService.delete'),
      bulkDelete: vi.fn().mockName('GlobalService.bulkDelete')
    } as MockedObject<GlobalService>;
    mockAlertService = {
      showSuccessMessage: vi.fn().mockName('AlertService.showSuccessMessage'),
      showErrorMessage: vi.fn().mockName('AlertService.showErrorMessage')
    } as MockedObject<AlertService>;

    await TestBed.configureTestingModule({
      declarations: [TestTasksAgentsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestTasksAgentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('table columns', () => {
    it('should expose columns for tasks/agents', () => {
      expect(component.tableColumns.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('assignment aggregate columns', () => {
    // loadAssignments() copies the assignment aggregates onto each agent; the task comes from the include.
    const working = {
      id: 1,
      currentSpeed: 1200,
      chunkId: 289,
      timeSpent: 30,
      searched: 250,
      cracked: 2,
      task: { id: 10, keyspace: 1000 }
    } as unknown as JAgent;
    const idle = { id: 2, task: { id: 10, keyspace: 1000 } } as unknown as JAgent;

    function column(id: TasksAgentsTableCol): HTTableColumn {
      return component.tableColumns.find((col: HTTableColumn) => col.id === id)!;
    }

    it('should render the current speed with the progress icon', () => {
      const speedColumn = column(TasksAgentsTableCol.TASK_SPEED);
      // sanitize() HTML-encodes the non-breaking space in convertCrackingSpeed output.
      expect(speedColumn.render!(working)).toBe(convertCrackingSpeed(1200).replace('\u00A0', '&#160;'));
      expect(speedColumn.icon!(working)).toEqual({ name: 'radio_button_checked', cls: 'pulsing-progress' });
    });

    it('should render a dash and no progress icon when the agent has no current speed', () => {
      const speedColumn = column(TasksAgentsTableCol.TASK_SPEED);
      expect(speedColumn.render!(idle)).toBe('-');
      expect(speedColumn.icon!(idle)).toEqual({ name: '' });
    });

    it('should link to the current chunk', async () => {
      column(TasksAgentsTableCol.CURRENT_CHUNK).routerLink!(working).subscribe((links) => {
        expect(links).toEqual([{ routerLink: ['/tasks', 'chunks', 289, 'view'], label: 289 }]);
      });
    });

    it('should render no chunk link when the agent has no chunk', async () => {
      column(TasksAgentsTableCol.CURRENT_CHUNK).routerLink!(idle).subscribe((links) => {
        expect(links).toEqual([]);
      });
    });

    it('should render the time spent on the task', () => {
      expect(column(TasksAgentsTableCol.TIME_SPENT).render!(working)).toBe(formatSeconds(30));
      expect(column(TasksAgentsTableCol.TIME_SPENT).render!(idle)).toBe('-');
    });

    it('should render searched as a percentage of the task keyspace', () => {
      expect(column(TasksAgentsTableCol.SEARCHED).render!(working)).toBe('25%');
      expect(column(TasksAgentsTableCol.SEARCHED).render!(idle)).toBe('-');
    });

    it('should render a dash when the task keyspace is unknown', () => {
      const noKeyspace = { ...working, task: { id: 10 } } as unknown as JAgent;
      expect(column(TasksAgentsTableCol.SEARCHED).render!(noKeyspace)).toBe('-');
    });

    it('should render the cracked count, including zero', () => {
      expect(column(TasksAgentsTableCol.CRACKED).render!(working)).toBe('<span>2</span>');
      expect(column(TasksAgentsTableCol.CRACKED).render!({ ...working, cracked: 0 } as JAgent)).toBe('<span>0</span>');
      expect(column(TasksAgentsTableCol.CRACKED).render!(idle)).toBe('-');
    });

    it('should export the aggregate values', async () => {
      await expect(column(TasksAgentsTableCol.TASK_SPEED).export!(working)).resolves.toEqual('1200');
      await expect(column(TasksAgentsTableCol.CURRENT_CHUNK).export!(working)).resolves.toEqual('289');
      await expect(column(TasksAgentsTableCol.TIME_SPENT).export!(working)).resolves.toEqual('30');
      await expect(column(TasksAgentsTableCol.SEARCHED).export!(working)).resolves.toEqual('0.25');
      await expect(column(TasksAgentsTableCol.CRACKED).export!(working)).resolves.toEqual('2');
    });

    it('should export placeholders when the aggregates are missing', async () => {
      await expect(column(TasksAgentsTableCol.TASK_SPEED).export!(idle)).resolves.toEqual('-');
      await expect(column(TasksAgentsTableCol.CURRENT_CHUNK).export!(idle)).resolves.toEqual('');
      await expect(column(TasksAgentsTableCol.TIME_SPENT).export!(idle)).resolves.toEqual('-');
      await expect(column(TasksAgentsTableCol.SEARCHED).export!(idle)).resolves.toEqual('0');
      await expect(column(TasksAgentsTableCol.CRACKED).export!(idle)).resolves.toEqual('-');
    });
  });

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;
      component.table.displayedColumns = component.tableColumns.map((col) => col.id.toString());

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledTimes(1);

      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        component.tableColumns,
        TasksAgentsTableColumnLabel,
        'hashtopolis-agents'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const items = [
        { id: 1, agentName: 'A1' },
        { id: 2, agentName: 'A2' }
      ] as JAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        TasksAgentsTableColumnLabel,
        'hashtopolis-agents'
      );
    });
  });

  // ─── Unassign agent (row action) ─────────────────────────────────────────────

  describe('rowActionUnassign (via UNASSIGN row action)', () => {
    function triggerConfirmedUnassign(agent: JAgent): Subject<{
      action: string;
      data: JAgent[];
    } | null> {
      const subject = openDialogAndClose(mockDialog, () =>
        component.rowActionClicked({
          data: agent,
          menuItem: { action: RowActionMenuAction.UNASSIGN, label: '' }
        })
      );
      subject.next({ action: RowActionMenuAction.UNASSIGN, data: [agent] });
      return subject;
    }

    it('should call gs.delete with SERV.AGENT_ASSIGN and the assignment ID when the agent has one', () => {
      mockGlobalService.delete.mockReturnValue(of({}));
      const agent = { id: 1, agentName: 'A1', assignmentId: 42 } as JAgent;

      triggerConfirmedUnassign(agent);

      expect(mockGlobalService.delete).toHaveBeenCalledTimes(1);

      expect(mockGlobalService.delete).toHaveBeenCalledWith(SERV.AGENT_ASSIGN, 42);
    });

    it('should show a success message, reload the table, and emit assignedAgentsChanged after a successful unassign', () => {
      mockGlobalService.delete.mockReturnValue(of({}));
      const agent = { id: 1, agentName: 'A1', assignmentId: 42 } as JAgent;
      let emitted = false;
      component.assignedAgentsChanged.subscribe(() => (emitted = true));

      triggerConfirmedUnassign(agent);

      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledTimes(1);

      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Successfully unassigned agent!');
      expect(mockHTTable.reload).toHaveBeenCalledTimes(1);
      expect(emitted).toBe(true);
    });

    it('should show an error message and NOT call the API when the agent has no assignment ID', () => {
      const agent = { id: 1, agentName: 'A1' } as JAgent;

      triggerConfirmedUnassign(agent);

      expect(mockGlobalService.delete).not.toHaveBeenCalled();
      expect(mockAlertService.showErrorMessage).toHaveBeenCalledTimes(1);
      expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('Failed to unassign agent!');
    });

    it('should NOT call the API when the confirmation dialog is dismissed', () => {
      const agent = { id: 1, agentName: 'A1', assignmentId: 42 } as JAgent;

      const subject = openDialogAndClose(mockDialog, () =>
        component.rowActionClicked({
          data: agent,
          menuItem: { action: RowActionMenuAction.UNASSIGN, label: '' }
        })
      );
      subject.next(null);

      expect(mockGlobalService.delete).not.toHaveBeenCalled();
    });
  });

  // ─── Unassign agents (bulk action) ───────────────────────────────────────────

  describe('bulkActionUnassign (via UNASSIGN bulk action)', () => {
    function triggerConfirmedBulkUnassign(agents: JAgent[]): Subject<{
      action: string;
      data: JAgent[];
    } | null> {
      const subject = openDialogAndClose(mockDialog, () =>
        component.bulkActionClicked({
          data: agents,
          menuItem: { action: BulkActionMenuAction.UNASSIGN, label: '' }
        })
      );
      subject.next({ action: BulkActionMenuAction.UNASSIGN, data: agents });
      return subject;
    }

    it('should call gs.bulkDelete with SERV.AGENT_ASSIGN and the assignment IDs of the assigned agents', () => {
      mockGlobalService.bulkDelete.mockReturnValue(of({}));
      const agents = [
        { id: 1, agentName: 'A1', assignmentId: 42 },
        { id: 2, agentName: 'A2', assignmentId: 43 }
      ] as JAgent[];

      triggerConfirmedBulkUnassign(agents);

      expect(mockGlobalService.bulkDelete).toHaveBeenCalledTimes(1);

      expect(mockGlobalService.bulkDelete).toHaveBeenCalledWith(SERV.AGENT_ASSIGN, [{ id: 42 }, { id: 43 }]);
    });

    it('should show a success message, reload the data source, and emit assignedAgentsChanged after a successful bulk unassign', () => {
      mockGlobalService.bulkDelete.mockReturnValue(of({}));
      vi.spyOn(component.dataSource, 'reload').mockReturnValue(undefined);
      const agents = [{ id: 1, agentName: 'A1', assignmentId: 42 }] as JAgent[];
      let emitted = false;
      component.assignedAgentsChanged.subscribe(() => (emitted = true));

      triggerConfirmedBulkUnassign(agents);

      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledTimes(1);

      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledWith('Successfully unassigned agents!');
      expect(component.dataSource.reload).toHaveBeenCalledTimes(1);
      expect(emitted).toBe(true);
    });

    it('should show an error message per agent and exclude them from the bulkDelete request when some agents have no assignment ID', () => {
      mockGlobalService.bulkDelete.mockReturnValue(of({}));
      const agents = [
        { id: 1, agentName: 'A1', assignmentId: 42 },
        { id: 2, agentName: 'A2' }
      ] as JAgent[];

      triggerConfirmedBulkUnassign(agents);

      expect(mockAlertService.showErrorMessage).toHaveBeenCalledTimes(1);

      expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('Failed to unassign agent!A2');
      expect(mockGlobalService.bulkDelete).toHaveBeenCalledTimes(1);
      expect(mockGlobalService.bulkDelete).toHaveBeenCalledWith(SERV.AGENT_ASSIGN, [{ id: 42 }]);
    });

    it('should NOT call the API when none of the agents have an assignment ID', () => {
      const agents = [{ id: 1, agentName: 'A1' }] as JAgent[];

      triggerConfirmedBulkUnassign(agents);

      expect(mockGlobalService.bulkDelete).not.toHaveBeenCalled();
      expect(mockAlertService.showErrorMessage).toHaveBeenCalledTimes(1);
      expect(mockAlertService.showErrorMessage).toHaveBeenCalledWith('Failed to unassign agent!A1');
    });

    it('should NOT call the API when the confirmation dialog is dismissed', () => {
      const agents = [{ id: 1, agentName: 'A1', assignmentId: 42 }] as JAgent[];

      const subject = openDialogAndClose(mockDialog, () =>
        component.bulkActionClicked({
          data: agents,
          menuItem: { action: BulkActionMenuAction.UNASSIGN, label: '' }
        })
      );
      subject.next(null);

      expect(mockGlobalService.bulkDelete).not.toHaveBeenCalled();
    });
  });
});
