import { Observable, Subject, of, throwError } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { JAgent } from '@models/agent.model';

import { AccessGroupsAgentsTableComponent } from '@components/tables/access-groups-agents-table/access-groups-agents-table.component';
import {
  AccessGroupsAgentsTableCol,
  AccessGroupsAgentsTableColumnLabel
} from '@components/tables/access-groups-agents-table/access-groups-agents-table.constants';

import { ActionMenuEvent } from '@src/app/core/_components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@src/app/core/_components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@src/app/core/_components/menus/row-action-menu/row-action-menu.constants';
import { AccessGroupsExpandDataSource } from '@src/app/core/_datasources/access-groups-expand.datasource';
import { ExportService } from '@src/app/core/_services/export/export.service';
import { RelationshipType, SERV } from '@src/app/core/_services/main.config';
import { GlobalService } from '@src/app/core/_services/main.service';
import { AlertService } from '@src/app/core/_services/shared/alert.service';

class MockAccessGroupsExpandDataSource {
  loadAll() {}
  setColumns() {}
  setAccessGroupId() {}
  setAccessGroupExpand() {}
  clearFilter() {}
  reload() {}
}

class TestAccessGroupsAgentsTableComponent extends AccessGroupsAgentsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(AccessGroupsAgentsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockAccessGroupsExpandDataSource() as unknown as AccessGroupsExpandDataSource;
  }
}

/**
 * Helpers to open a dialog and simulate its close result.
 */
function openDialogAndClose(
  component: TestAccessGroupsAgentsTableComponent,
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

describe('AccessGroupsAgentsTableComponent', () => {
  let component: TestAccessGroupsAgentsTableComponent;
  let fixture: ComponentFixture<TestAccessGroupsAgentsTableComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockHTTable: jasmine.SpyObj<{ reload: () => void }>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['deleteRelationships']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    await TestBed.configureTestingModule({
      declarations: [TestAccessGroupsAgentsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: mockDialog },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAccessGroupsAgentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // Provide a spy for the @ViewChild('table') so BaseTableComponent.reload() works
    component.table = mockHTTable as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Column definitions ──────────────────────────────────────────────────────

  describe('table columns', () => {
    it('should expose exactly two columns: ID and NAME', () => {
      const ids = component.tableColumns.map((c) => c.id);
      expect(ids).toEqual([AccessGroupsAgentsTableCol.ID, AccessGroupsAgentsTableCol.NAME]);
    });

    it('ID column should be sortable and searchable', () => {
      const col = component.tableColumns.find((c) => c.id === AccessGroupsAgentsTableCol.ID)!;
      expect(col.isSortable).toBeTrue();
      expect(col.isSearchable).toBeTrue();
    });

    it('NAME column should be sortable and searchable', () => {
      const col = component.tableColumns.find((c) => c.id === AccessGroupsAgentsTableCol.NAME)!;
      expect(col.isSortable).toBeTrue();
      expect(col.isSearchable).toBeTrue();
    });
  });

  // ─── ID column link ──────────────────────────────────────────────────────────

  describe('ID column routerLink', () => {
    let idCol: (typeof component.tableColumns)[0];
    beforeEach(() => {
      idCol = component.tableColumns.find((c) => c.id === AccessGroupsAgentsTableCol.ID)!;
    });

    it('should link to the agent edit page', (done) => {
      const agent = { id: 42, agentName: 'Agent42' } as JAgent;
      idCol.routerLink!(agent).subscribe((links) => {
        expect(links[0].routerLink).toEqual(['/agents', 42, 'edit']);
        done();
      });
    });

    it('should use the agent numeric ID as the link label (as string)', (done) => {
      const agent = { id: 42, agentName: 'Agent42' } as JAgent;
      idCol.routerLink!(agent).subscribe((links) => {
        expect(links[0].label).toBe('42');
        done();
      });
    });
  });

  // ─── NAME column link ────────────────────────────────────────────────────────

  describe('NAME column routerLink', () => {
    let nameCol: (typeof component.tableColumns)[0];
    beforeEach(() => {
      nameCol = component.tableColumns.find((c) => c.id === AccessGroupsAgentsTableCol.NAME)!;
    });

    it('should link to the agent detail/edit page using the agent name as label', (done) => {
      const agent = { id: 7, agentName: 'TestAgent', isTrusted: false } as JAgent;
      nameCol.routerLink!(agent).subscribe((links) => {
        expect(links[0].routerLink).toEqual(['/agents', 'show-agents', 7, 'edit']);
        expect(links[0].label).toBe('TestAgent');
        done();
      });
    });

    it('should show a trusted-agent icon when the agent is trusted', (done) => {
      const trustedAgent = { id: 7, agentName: 'TrustedAgent', isTrusted: true } as JAgent;
      nameCol.routerLink!(trustedAgent).subscribe((links) => {
        expect(links[0].icon?.faIcon).toBeTruthy();
        expect(links[0].icon?.tooltip).toBe('Trusted Agent');
        done();
      });
    });

    it('should NOT show a trusted-agent icon when the agent is not trusted', (done) => {
      const agent = { id: 8, agentName: 'RegularAgent', isTrusted: false } as JAgent;
      nameCol.routerLink!(agent).subscribe((links) => {
        expect(links[0].icon?.faIcon).toBeUndefined();
        done();
      });
    });
  });

  // ─── Row action ──────────────────────────────────────────────────────────────

  describe('rowActionClicked', () => {
    it('should open a confirmation dialog for the DELETE action', () => {
      const afterClosedSubject = new Subject<null>();
      mockDialog.open.and.returnValue({
        afterClosed: () => afterClosedSubject.asObservable()
      } as MatDialogRef<unknown>);

      const agent = { id: 5, agentName: 'AgentX' } as JAgent;
      component.rowActionClicked({ data: agent, menuItem: { action: RowActionMenuAction.DELETE, label: '' } });

      expect(mockDialog.open).toHaveBeenCalledTimes(1);
    });

    it('should include the agent name in the confirmation dialog body', () => {
      const afterClosedSubject = new Subject<null>();
      mockDialog.open.and.returnValue({
        afterClosed: () => afterClosedSubject.asObservable()
      } as MatDialogRef<unknown>);

      const agent = { id: 5, agentName: 'AgentX' } as JAgent;
      component.rowActionClicked({ data: agent, menuItem: { action: RowActionMenuAction.DELETE, label: '' } });

      const dialogData = (mockDialog.open.calls.mostRecent().args[1] as { data: { body: string } }).data;
      expect(dialogData.body).toContain('AgentX');
    });

    it('should NOT open any dialog for actions other than DELETE', () => {
      const agent = { id: 5, agentName: 'AgentX' } as JAgent;
      component.rowActionClicked({ data: agent, menuItem: { action: RowActionMenuAction.EDIT, label: '' } });

      expect(mockDialog.open).not.toHaveBeenCalled();
    });
  });

  // ─── Bulk action ─────────────────────────────────────────────────────────────

  describe('bulkActionClicked', () => {
    it('should use plural wording in the dialog title for multiple agents', () => {
      const agents = [
        { id: 1, agentName: 'A1' },
        { id: 2, agentName: 'A2' }
      ] as JAgent[];
      const subject = openDialogAndClose(component, mockDialog, () =>
        component.bulkActionClicked({ data: agents, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );

      const dialogData = (mockDialog.open.calls.mostRecent().args[1] as { data: { title: string; body: string } }).data;
      expect(dialogData.title).toContain('2');
      expect(dialogData.title).toContain('agents');
      subject.complete();
    });

    it('should use singular wording in the dialog title for a single agent', () => {
      const agents = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const subject = openDialogAndClose(component, mockDialog, () =>
        component.bulkActionClicked({ data: agents, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );

      const dialogData = (mockDialog.open.calls.mostRecent().args[1] as { data: { title: string } }).data;
      expect(dialogData.title).not.toContain('agents');
      expect(dialogData.title).toContain('agent');
      subject.complete();
    });

    it('should mark the dialog as a warning (destructive action)', () => {
      const agents = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const subject = openDialogAndClose(component, mockDialog, () =>
        component.bulkActionClicked({ data: agents, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );

      const dialogData = (mockDialog.open.calls.mostRecent().args[1] as { data: { warn: boolean } }).data;
      expect(dialogData.warn).toBeTrue();
      subject.complete();
    });
  });

  // ─── Remove agents (API call + side effects) ─────────────────────────────────

  describe('removing agents from access group', () => {
    const GROUP_ID = 99;
    const agents = [
      { id: 10, agentName: 'A10' },
      { id: 20, agentName: 'A20' }
    ] as JAgent[];

    function triggerConfirmedRemoval(
      agents: JAgent[],
      apiResponse$: Observable<object | never>
    ): Subject<{ action: string; data: JAgent[] } | null> {
      mockGlobalService.deleteRelationships.and.returnValue(apiResponse$);
      component.accessgroupId = GROUP_ID;

      const subject = openDialogAndClose(component, mockDialog, () =>
        component.bulkActionClicked({ data: agents, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );
      subject.next({ action: BulkActionMenuAction.DELETE, data: agents });
      return subject;
    }

    it('should call the API with the correct access group ID and agent IDs mapped as AGENTMEMBER relationships', () => {
      triggerConfirmedRemoval(agents, of({}));

      expect(mockGlobalService.deleteRelationships).toHaveBeenCalledOnceWith(
        SERV.ACCESS_GROUPS,
        GROUP_ID,
        RelationshipType.AGENTMEMBER,
        {
          data: [
            { type: RelationshipType.AGENTMEMBER, id: 10 },
            { type: RelationshipType.AGENTMEMBER, id: 20 }
          ]
        }
      );
    });

    it('should emit agentsRemoved after a successful API call', () => {
      let emitted = false;
      component.agentsRemoved.subscribe(() => (emitted = true));

      triggerConfirmedRemoval(agents, of({}));

      expect(emitted).toBeTrue();
    });

    it('should show a success alert mentioning the number of removed agents', () => {
      triggerConfirmedRemoval(agents, of({}));

      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledOnceWith(jasmine.stringMatching(/2.*agent/i));
    });

    it('should NOT emit agentsRemoved when the API call fails', () => {
      let emitted = false;
      component.agentsRemoved.subscribe(() => (emitted = true));

      triggerConfirmedRemoval(
        agents,
        throwError(() => new Error('server error'))
      );

      expect(emitted).toBeFalse();
    });

    it('should show an error alert when the API call fails', () => {
      triggerConfirmedRemoval(
        agents,
        throwError(() => new Error('server error'))
      );

      expect(mockAlertService.showErrorMessage).toHaveBeenCalledTimes(1);
    });

    it('should NOT call the API when the confirmation dialog is dismissed', () => {
      mockGlobalService.deleteRelationships.and.returnValue(of({}));
      component.accessgroupId = GROUP_ID;

      const subject = openDialogAndClose(component, mockDialog, () =>
        component.bulkActionClicked({ data: agents, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );
      // User closes the dialog without confirming (null result)
      subject.next(null);

      expect(mockGlobalService.deleteRelationships).not.toHaveBeenCalled();
    });
  });

  // ─── Reload after removal ────────────────────────────────────────────────────

  describe('table reload after removal', () => {
    it('should trigger a table reload after a successful removal', () => {
      mockGlobalService.deleteRelationships.and.returnValue(of({}));
      component.accessgroupId = 99;

      const agents = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const subject = openDialogAndClose(component, mockDialog, () =>
        component.bulkActionClicked({ data: agents, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );
      subject.next({ action: BulkActionMenuAction.DELETE, data: agents });

      expect(mockHTTable.reload).toHaveBeenCalledTimes(1);
    });

    it('should NOT trigger a table reload when the API call fails', () => {
      mockGlobalService.deleteRelationships.and.returnValue(throwError(() => new Error('fail')));
      component.accessgroupId = 99;

      const agents = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const subject = openDialogAndClose(component, mockDialog, () =>
        component.bulkActionClicked({ data: agents, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );
      subject.next({ action: BulkActionMenuAction.DELETE, data: agents });

      expect(mockHTTable.reload).not.toHaveBeenCalled();
    });
  });

  // ─── Bulk dialog list content ────────────────────────────────────────────────

  describe('bulk dialog content', () => {
    it('should pass listAttribute "agentName" so the dialog renders agent names', () => {
      const agents = [
        { id: 1, agentName: 'Alpha' },
        { id: 2, agentName: 'Beta' }
      ] as JAgent[];
      const subject = openDialogAndClose(component, mockDialog, () =>
        component.bulkActionClicked({ data: agents, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );

      const dialogData = (
        mockDialog.open.calls.mostRecent().args[1] as { data: { listAttribute: string; rows: JAgent[] } }
      ).data;
      expect(dialogData.listAttribute).toBe('agentName');
      expect(dialogData.rows).toEqual(agents);
      subject.complete();
    });
  });

  // ─── Export ──────────────────────────────────────────────────────────────────

  describe('exportActionClicked', () => {
    it('should delegate to exportService with the correct file name', () => {
      const agents = [{ id: 1, agentName: 'A1' }] as JAgent[];
      const event = { data: agents, menuItem: { action: 'excel', label: '' } } as ActionMenuEvent<JAgent[]>;

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        AccessGroupsAgentsTableColumnLabel,
        'hashtopolis-access-groups-agents'
      );
    });
  });

  // ─── Column export callbacks ─────────────────────────────────────────────────

  describe('column export callbacks', () => {
    it('ID column export should return the agent id as a string', async () => {
      const agent = { id: 55, agentName: 'ExportAgent' } as JAgent;
      const idCol = component.tableColumns.find((c) => c.id === AccessGroupsAgentsTableCol.ID)!;
      const result = await idCol.export!(agent);
      expect(result).toBe('55');
    });

    it('NAME column export should return the agent name', async () => {
      const agent = { id: 55, agentName: 'ExportAgent' } as JAgent;
      const nameCol = component.tableColumns.find((c) => c.id === AccessGroupsAgentsTableCol.NAME)!;
      const result = await nameCol.export!(agent);
      expect(result).toBe('ExportAgent');
    });
  });
});
