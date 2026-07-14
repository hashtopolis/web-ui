import { Subject, of } from 'rxjs';

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
import { TasksAgentsTableColumnLabel } from '@components/tables/tasks-agents-table/tasks-agents-table.constants';

import { AgentsDataSource } from '@datasources/agents.datasource';

import { JAgent } from '@src/app/core/_models/agent.model';
import { ExportService } from '@src/app/core/_services/export/export.service';
import { SERV } from '@src/app/core/_services/main.config';
import { GlobalService } from '@src/app/core/_services/main.service';
import { AlertService } from '@src/app/core/_services/shared/alert.service';

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
  mockDialog: jasmine.SpyObj<MatDialog>,
  triggerFn: () => void
): Subject<{ action: string; data: JAgent[] } | null> {
  const afterClosedSubject = new Subject<{ action: string; data: JAgent[] } | null>();
  mockDialog.open.and.returnValue({
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
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['delete', 'bulkDelete']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);

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

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const items = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const event = { data: items, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;
      component.table.displayedColumns = component.tableColumns.map((col) => col.id.toString());

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
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
    function triggerConfirmedUnassign(agent: JAgent): Subject<{ action: string; data: JAgent[] } | null> {
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
      mockGlobalService.delete.and.returnValue(of({}));
      const agent = { id: 1, agentName: 'A1', assignmentId: 42 } as JAgent;

      triggerConfirmedUnassign(agent);

      expect(mockGlobalService.delete).toHaveBeenCalledOnceWith(SERV.AGENT_ASSIGN, 42);
    });

    it('should show a success message, reload the table, and emit assignedAgentsChanged after a successful unassign', () => {
      mockGlobalService.delete.and.returnValue(of({}));
      const agent = { id: 1, agentName: 'A1', assignmentId: 42 } as JAgent;
      let emitted = false;
      component.assignedAgentsChanged.subscribe(() => (emitted = true));

      triggerConfirmedUnassign(agent);

      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledOnceWith('Successfully unassigned agent!');
      expect(mockHTTable.reload).toHaveBeenCalledTimes(1);
      expect(emitted).toBeTrue();
    });

    it('should show an error message and NOT call the API when the agent has no assignment ID', () => {
      const agent = { id: 1, agentName: 'A1' } as JAgent;

      triggerConfirmedUnassign(agent);

      expect(mockGlobalService.delete).not.toHaveBeenCalled();
      expect(mockAlertService.showErrorMessage).toHaveBeenCalledOnceWith('Failed to unassign agent!');
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
    function triggerConfirmedBulkUnassign(agents: JAgent[]): Subject<{ action: string; data: JAgent[] } | null> {
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
      mockGlobalService.bulkDelete.and.returnValue(of({}));
      const agents = [
        { id: 1, agentName: 'A1', assignmentId: 42 },
        { id: 2, agentName: 'A2', assignmentId: 43 }
      ] as JAgent[];

      triggerConfirmedBulkUnassign(agents);

      expect(mockGlobalService.bulkDelete).toHaveBeenCalledOnceWith(SERV.AGENT_ASSIGN, [{ id: 42 }, { id: 43 }]);
    });

    it('should show a success message, reload the data source, and emit assignedAgentsChanged after a successful bulk unassign', () => {
      mockGlobalService.bulkDelete.and.returnValue(of({}));
      spyOn(component.dataSource, 'reload');
      const agents = [{ id: 1, agentName: 'A1', assignmentId: 42 }] as JAgent[];
      let emitted = false;
      component.assignedAgentsChanged.subscribe(() => (emitted = true));

      triggerConfirmedBulkUnassign(agents);

      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledOnceWith('Successfully unassigned agents!');
      expect(component.dataSource.reload).toHaveBeenCalledTimes(1);
      expect(emitted).toBeTrue();
    });

    it('should show an error message per agent and exclude them from the bulkDelete request when some agents have no assignment ID', () => {
      mockGlobalService.bulkDelete.and.returnValue(of({}));
      const agents = [
        { id: 1, agentName: 'A1', assignmentId: 42 },
        { id: 2, agentName: 'A2' }
      ] as JAgent[];

      triggerConfirmedBulkUnassign(agents);

      expect(mockAlertService.showErrorMessage).toHaveBeenCalledOnceWith('Failed to unassign agent!A2');
      expect(mockGlobalService.bulkDelete).toHaveBeenCalledOnceWith(SERV.AGENT_ASSIGN, [{ id: 42 }]);
    });

    it('should NOT call the API when none of the agents have an assignment ID', () => {
      const agents = [{ id: 1, agentName: 'A1' }] as JAgent[];

      triggerConfirmedBulkUnassign(agents);

      expect(mockGlobalService.bulkDelete).not.toHaveBeenCalled();
      expect(mockAlertService.showErrorMessage).toHaveBeenCalledOnceWith('Failed to unassign agent!A1');
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
