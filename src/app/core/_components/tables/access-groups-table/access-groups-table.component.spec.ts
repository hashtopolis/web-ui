import { Observable, Subject, of, throwError } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { JAccessGroup } from '@models/access-group.model';
import { BaseModel } from '@models/base.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { AccessGroupsTableComponent } from '@components/tables/access-groups-table/access-groups-table.component';
import {
  AccessGroupsTableCol,
  AccessGroupsTableColumnLabel
} from '@components/tables/access-groups-table/access-groups-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { AccessGroupsDataSource } from '@datasources/access-groups.datasource';

import { FilterType } from '@src/app/core/_models/request-params.model';
import { ExportService } from '@src/app/core/_services/export/export.service';
import { SERV } from '@src/app/core/_services/main.config';
import { GlobalService } from '@src/app/core/_services/main.service';
import { AlertService } from '@src/app/core/_services/shared/alert.service';

// Test double for AccessGroupsDataSource — avoids HTTP and injector setup
class MockAccessGroupsDataSource {
  loadAll(_filter?: unknown) {}
  clearFilter() {}
  reload() {}
  setColumns() {}
}

// Test subclass — overrides ngOnInit to inject the mock datasource instead of
// constructing a real one that needs a live HttpClient / injector chain
class TestAccessGroupsTableComponent extends AccessGroupsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(AccessGroupsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockAccessGroupsDataSource() as unknown as AccessGroupsDataSource;
  }
}

// Helper: make the dialog spy return a controllable Subject, trigger the
// component action, then return the Subject so the test can emit a result
function stubDialogAndTrigger(
  mockDialog: jasmine.SpyObj<MatDialog>,
  triggerFn: () => void
): Subject<{ action: string; data: JAccessGroup[] } | null> {
  const afterClosedSubject = new Subject<{ action: string; data: JAccessGroup[] } | null>();
  mockDialog.open.and.returnValue({
    afterClosed: () => afterClosedSubject.asObservable()
  } as MatDialogRef<unknown>);
  triggerFn();
  return afterClosedSubject;
}

// Spec
describe('AccessGroupsTableComponent', () => {
  let component: TestAccessGroupsTableComponent;
  let fixture: ComponentFixture<TestAccessGroupsTableComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockGlobalService = jasmine.createSpyObj('GlobalService', ['delete', 'bulkDelete']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showSuccessMessage', 'showErrorMessage']);
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);

    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      declarations: [TestAccessGroupsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: mockDialog },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: ExportService, useValue: mockExportService },
        { provide: Router, useValue: mockRouter }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAccessGroupsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // CUSTOM_ELEMENTS_SCHEMA causes @ViewChild('table') to resolve to a native
    // custom element without a reload() method — replace it with the spy so
    // that BaseTableComponent.reload() can be exercised without runtime errors.
    component.table = mockHTTable as HTTableComponent<BaseModel>;

    // Spies are set up AFTER detectChanges so that the initial loadAll() call
    // from ngAfterViewInit is not counted in assertion expectations.
    spyOn(component.dataSource, 'loadAll');
    spyOn(component.dataSource, 'clearFilter');
    spyOn(component.dataSource, 'reload');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Column definitions

  describe('table columns', () => {
    it('should expose exactly four columns: ID, NAME, NUSERS, NAGENTS', () => {
      const ids = component.tableColumns.map((c) => c.id);
      expect(ids).toEqual([
        AccessGroupsTableCol.ID,
        AccessGroupsTableCol.NAME,
        AccessGroupsTableCol.NUSERS,
        AccessGroupsTableCol.NAGENTS
      ]);
    });

    it('ID column should be sortable and searchable', () => {
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.ID)!;
      expect(col.isSortable).toBeTrue();
      expect(col.isSearchable).toBeTrue();
    });

    it('NAME column should be sortable and searchable', () => {
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NAME)!;
      expect(col.isSortable).toBeTrue();
      expect(col.isSearchable).toBeTrue();
    });

    it('NUSERS column should NOT be sortable', () => {
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NUSERS)!;
      expect(col.isSortable).toBeFalse();
    });

    it('NAGENTS column should NOT be sortable', () => {
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NAGENTS)!;
      expect(col.isSortable).toBeFalse();
    });
  });

  // NAME column router link

  describe('NAME column routerLink', () => {
    it('should link to the access group edit page', (done) => {
      const group = { id: 3, groupName: 'TestGroup' } as JAccessGroup;
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NAME)!;
      (col.routerLink!(group) as Observable<{ routerLink: unknown[]; label: string }[]>).subscribe((links) => {
        expect(links[0].routerLink).toEqual(['/users', 'access-groups', 3, 'edit']);
        expect(links[0].label).toBe('TestGroup');
        done();
      });
    });
  });

  // NUSERS column render

  describe('NUSERS column render', () => {
    let col: (typeof component.tableColumns)[0];

    beforeEach(() => {
      col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NUSERS)!;
    });

    it('should display the count of userMembers when present', () => {
      const group = { id: 1, groupName: 'G', userMembers: [{}, {}, {}] } as unknown as JAccessGroup;
      expect(col.render!(group)).toBe('3');
    });

    it('should display "-" when userMembers is undefined', () => {
      const group = { id: 1, groupName: 'G' } as JAccessGroup;
      expect(col.render!(group)).toBe('-');
    });
  });

  // NAGENTS column render

  describe('NAGENTS column render', () => {
    let col: (typeof component.tableColumns)[0];

    beforeEach(() => {
      col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NAGENTS)!;
    });

    it('should display the count of agentMembers when present', () => {
      const group = { id: 1, groupName: 'G', agentMembers: [{}, {}] } as unknown as JAccessGroup;
      expect(col.render!(group)).toBe('2');
    });

    it('should display "-" when agentMembers is undefined', () => {
      const group = { id: 1, groupName: 'G' } as JAccessGroup;
      expect(col.render!(group)).toBe('-');
    });
  });

  // Column export callbacks

  describe('column export callbacks', () => {
    it('ID column should export the id as a string', async () => {
      const group = { id: 7, groupName: 'G' } as JAccessGroup;
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.ID)!;
      expect(await col.export!(group)).toBe('7');
    });

    it('NAME column should export groupName', async () => {
      const group = { id: 7, groupName: 'MyGroup' } as JAccessGroup;
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NAME)!;
      expect(await col.export!(group)).toBe('MyGroup');
    });

    it('NUSERS column should export the count of userMembers', async () => {
      const group = { id: 1, groupName: 'G', userMembers: [{}, {}] } as unknown as JAccessGroup;
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NUSERS)!;
      expect(await col.export!(group)).toBe('2');
    });

    it('NUSERS column should export "-" when userMembers is undefined', async () => {
      const group = { id: 1, groupName: 'G' } as JAccessGroup;
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NUSERS)!;
      expect(await col.export!(group)).toBe('-');
    });

    it('NAGENTS column should export the count of agentMembers', async () => {
      const group = { id: 1, groupName: 'G', agentMembers: [{}] } as unknown as JAccessGroup;
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NAGENTS)!;
      expect(await col.export!(group)).toBe('1');
    });

    it('NAGENTS column should export "-" when agentMembers is undefined', async () => {
      const group = { id: 1, groupName: 'G' } as JAccessGroup;
      const col = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NAGENTS)!;
      expect(await col.export!(group)).toBe('-');
    });
  });

  // filter()

  describe('filter()', () => {
    beforeEach(() => {
      component.selectedFilterColumn = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NAME)!;
    });

    it('should call dataSource.loadAll with ICONTAINS filter when input is non-empty', () => {
      component.filter('mygroup');
      expect(component.dataSource.loadAll).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({
          value: 'mygroup',
          field: 'groupName',
          operator: FilterType.ICONTAINS
        })
      );
    });

    it('should call dataSource.loadAll without params when input is empty', () => {
      component.filter('');
      expect(component.dataSource.loadAll).toHaveBeenCalledTimes(1);
      expect(component.dataSource.loadAll).not.toHaveBeenCalledWith(
        jasmine.objectContaining({ value: jasmine.anything() })
      );
    });
  });

  // handleBackendSqlFilter()

  describe('handleBackendSqlFilter()', () => {
    beforeEach(() => {
      component.selectedFilterColumn = component.tableColumns.find((c) => c.id === AccessGroupsTableCol.NAME)!;
    });

    it('should delegate to filter() when a non-empty string is provided', () => {
      component.handleBackendSqlFilter('test');
      expect(component.dataSource.loadAll).toHaveBeenCalled();
    });

    it('should clear the filter when an empty string is provided', () => {
      component.handleBackendSqlFilter('');
      expect(component.dataSource.clearFilter).toHaveBeenCalledTimes(1);
      expect(component.dataSource.loadAll).not.toHaveBeenCalled();
    });

    it('should clear the filter when only whitespace is provided', () => {
      component.handleBackendSqlFilter('   ');
      expect(component.dataSource.clearFilter).toHaveBeenCalledTimes(1);
      expect(component.dataSource.loadAll).not.toHaveBeenCalled();
    });
  });

  // exportActionClicked()

  describe('exportActionClicked()', () => {
    it('should delegate to exportService with the correct filename', () => {
      const groups = [{ id: 1, groupName: 'G1' }] as JAccessGroup[];
      const event: ActionMenuEvent<JAccessGroup[]> = {
        data: groups,
        menuItem: { action: 'excel', label: '' }
      };
      component.table.displayedColumns = ['0', '1', '2', '3'];
      component.exportActionClicked(event);
      expect(mockExportService.handleExportAction).toHaveBeenCalledOnceWith(
        event,
        component.tableColumns,
        AccessGroupsTableColumnLabel,
        'hashtopolis-access-groups'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const groups = [
        { id: 1, groupName: 'G1' },
        { id: 2, groupName: 'G2' }
      ] as JAccessGroup[];
      const event: ActionMenuEvent<JAccessGroup[]> = {
        data: groups,
        menuItem: { action: 'excel', label: '' }
      };
      component.exportActionClicked(event);
      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id as number));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        AccessGroupsTableColumnLabel,
        'hashtopolis-access-groups'
      );
    });
  });

  // rowActionClicked()

  describe('rowActionClicked()', () => {
    describe('DELETE action', () => {
      it('should open a confirmation dialog', () => {
        const group = { id: 1, groupName: 'TestGroup' } as JAccessGroup;
        const subject = stubDialogAndTrigger(mockDialog, () =>
          component.rowActionClicked({ data: group, menuItem: { action: RowActionMenuAction.DELETE, label: '' } })
        );
        expect(mockDialog.open).toHaveBeenCalledTimes(1);
        subject.complete();
      });

      it('dialog title should contain the access group name', () => {
        const group = { id: 1, groupName: 'TestGroup' } as JAccessGroup;
        const subject = stubDialogAndTrigger(mockDialog, () =>
          component.rowActionClicked({ data: group, menuItem: { action: RowActionMenuAction.DELETE, label: '' } })
        );
        const dialogData = (mockDialog.open.calls.mostRecent().args[1] as { data: { title: string } }).data;
        expect(dialogData.title).toContain('TestGroup');
        subject.complete();
      });

      it('dialog should be opened with warn: true', () => {
        const group = { id: 1, groupName: 'TestGroup' } as JAccessGroup;
        const subject = stubDialogAndTrigger(mockDialog, () =>
          component.rowActionClicked({ data: group, menuItem: { action: RowActionMenuAction.DELETE, label: '' } })
        );
        const dialogData = (mockDialog.open.calls.mostRecent().args[1] as { data: { warn: boolean } }).data;
        expect(dialogData.warn).toBeTrue();
        subject.complete();
      });
    });

    describe('EDIT action', () => {
      it('should navigate to the access group edit page', (done) => {
        const group = { id: 2, groupName: 'EditGroup' } as JAccessGroup;
        component.rowActionClicked({ data: group, menuItem: { action: RowActionMenuAction.EDIT, label: '' } });

        setTimeout(() => {
          expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/users', 'access-groups', 2, 'edit']);
          done();
        });
      });

      it('should NOT open a dialog', () => {
        const group = { id: 2, groupName: 'EditGroup' } as JAccessGroup;
        component.rowActionClicked({ data: group, menuItem: { action: RowActionMenuAction.EDIT, label: '' } });
        expect(mockDialog.open).not.toHaveBeenCalled();
      });
    });
  });

  // bulkActionClicked()

  describe('bulkActionClicked()', () => {
    it('should open a confirmation dialog for DELETE', () => {
      const groups = [
        { id: 1, groupName: 'G1' },
        { id: 2, groupName: 'G2' }
      ] as JAccessGroup[];
      const subject = stubDialogAndTrigger(mockDialog, () =>
        component.bulkActionClicked({ data: groups, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );
      expect(mockDialog.open).toHaveBeenCalledTimes(1);
      subject.complete();
    });

    it('dialog title should contain the count of groups to delete', () => {
      const groups = [
        { id: 1, groupName: 'G1' },
        { id: 2, groupName: 'G2' }
      ] as JAccessGroup[];
      const subject = stubDialogAndTrigger(mockDialog, () =>
        component.bulkActionClicked({ data: groups, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );
      const dialogData = (mockDialog.open.calls.mostRecent().args[1] as { data: { title: string } }).data;
      expect(dialogData.title).toContain('2');
      subject.complete();
    });

    it('dialog should use groupName as the listAttribute', () => {
      const groups = [{ id: 1, groupName: 'G1' }] as JAccessGroup[];
      const subject = stubDialogAndTrigger(mockDialog, () =>
        component.bulkActionClicked({ data: groups, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );
      const dialogData = (mockDialog.open.calls.mostRecent().args[1] as { data: { listAttribute: string } }).data;
      expect(dialogData.listAttribute).toBe('groupName');
      subject.complete();
    });

    it('dialog should be opened with warn: true', () => {
      const groups = [{ id: 1, groupName: 'G1' }] as JAccessGroup[];
      const subject = stubDialogAndTrigger(mockDialog, () =>
        component.bulkActionClicked({ data: groups, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );
      const dialogData = (mockDialog.open.calls.mostRecent().args[1] as { data: { warn: boolean } }).data;
      expect(dialogData.warn).toBeTrue();
      subject.complete();
    });
  });

  // Row delete (after dialog confirmed)

  describe('row delete — single access group', () => {
    const group = { id: 10, groupName: 'ToDelete' } as JAccessGroup;

    function triggerConfirmedRowDelete(apiResponse$: Observable<object>) {
      mockGlobalService.delete.and.returnValue(apiResponse$);
      const subject = stubDialogAndTrigger(mockDialog, () =>
        component.rowActionClicked({ data: group, menuItem: { action: RowActionMenuAction.DELETE, label: '' } })
      );
      subject.next({ action: RowActionMenuAction.DELETE, data: [group] });
      return subject;
    }

    it('should call gs.delete with the correct endpoint and group ID', () => {
      triggerConfirmedRowDelete(of({}));
      expect(mockGlobalService.delete).toHaveBeenCalledOnceWith(SERV.ACCESS_GROUPS, group.id);
    });

    it('should show a success alert after deletion', () => {
      triggerConfirmedRowDelete(of({}));
      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });

    it('should reload the table (HTTable) after successful deletion', () => {
      triggerConfirmedRowDelete(of({}));
      expect(mockHTTable.reload).toHaveBeenCalledTimes(1);
    });

    it('should NOT show a success alert when the API call fails', () => {
      triggerConfirmedRowDelete(throwError(() => new Error('fail')));
      expect(mockAlertService.showSuccessMessage).not.toHaveBeenCalled();
    });

    it('should NOT reload the table when the API call fails', () => {
      triggerConfirmedRowDelete(throwError(() => new Error('fail')));
      expect(mockHTTable.reload).not.toHaveBeenCalled();
    });

    it('should NOT call the API when the dialog is dismissed', () => {
      mockGlobalService.delete.and.returnValue(of({}));
      const subject = stubDialogAndTrigger(mockDialog, () =>
        component.rowActionClicked({ data: group, menuItem: { action: RowActionMenuAction.DELETE, label: '' } })
      );
      subject.next(null);
      expect(mockGlobalService.delete).not.toHaveBeenCalled();
    });
  });

  // Bulk delete (after dialog confirmed)

  describe('bulk delete — multiple access groups', () => {
    const groups = [
      { id: 10, groupName: 'G10' },
      { id: 20, groupName: 'G20' }
    ] as JAccessGroup[];

    function triggerConfirmedBulkDelete(apiResponse$: Observable<object>) {
      mockGlobalService.bulkDelete.and.returnValue(apiResponse$);
      const subject = stubDialogAndTrigger(mockDialog, () =>
        component.bulkActionClicked({ data: groups, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );
      subject.next({ action: BulkActionMenuAction.DELETE, data: groups });
      return subject;
    }

    it('should call gs.bulkDelete with the correct endpoint and groups', () => {
      triggerConfirmedBulkDelete(of({}));
      expect(mockGlobalService.bulkDelete).toHaveBeenCalledOnceWith(SERV.ACCESS_GROUPS, groups);
    });

    it('should show a success alert after bulk deletion', () => {
      triggerConfirmedBulkDelete(of({}));
      expect(mockAlertService.showSuccessMessage).toHaveBeenCalledTimes(1);
    });

    it('should reload the datasource (not just the HTTable) after successful bulk deletion', () => {
      triggerConfirmedBulkDelete(of({}));
      expect(component.dataSource.reload).toHaveBeenCalledTimes(1);
    });

    it('should NOT show a success alert when the API call fails', () => {
      triggerConfirmedBulkDelete(throwError(() => new Error('fail')));
      expect(mockAlertService.showSuccessMessage).not.toHaveBeenCalled();
    });

    it('should NOT reload the datasource when the API call fails', () => {
      triggerConfirmedBulkDelete(throwError(() => new Error('fail')));
      expect(component.dataSource.reload).not.toHaveBeenCalled();
    });

    it('should NOT call the API when the dialog is dismissed', () => {
      mockGlobalService.bulkDelete.and.returnValue(of({}));
      const subject = stubDialogAndTrigger(mockDialog, () =>
        component.bulkActionClicked({ data: groups, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } })
      );
      subject.next(null);
      expect(mockGlobalService.bulkDelete).not.toHaveBeenCalled();
    });
  });

  // ngOnDestroy()

  describe('ngOnDestroy()', () => {
    it('should unsubscribe all active subscriptions on destroy', () => {
      const mockSub = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component['subscriptions'].push(mockSub);
      component.ngOnDestroy();
      expect(mockSub.unsubscribe).toHaveBeenCalledTimes(1);
    });
  });
});
