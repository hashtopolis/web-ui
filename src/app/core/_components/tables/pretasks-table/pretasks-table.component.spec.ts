import { of } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { BaseModel } from '@models/base.model';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { PretasksTableComponent } from '@components/tables/pretasks-table/pretasks-table.component';
import {
  PretasksTableCol,
  PretasksTableColumnLabel,
  PretasksTableEditableAction
} from '@components/tables/pretasks-table/pretasks-table.constants';

import { JFile } from '@src/app/core/_models/file.model';
import { JPretask } from '@src/app/core/_models/pretask.model';
import { ExportService } from '@src/app/core/_services/export/export.service';
import { GlobalService } from '@src/app/core/_services/main.service';
import { PreconfiguredTasksRoleService } from '@src/app/core/_services/roles/tasks/preconfiguredTasks-role.service';

class MockDataSource {
  loadAll = jasmine.createSpy('loadAll');
  setColumns = jasmine.createSpy('setColumns');
  clearFilter = jasmine.createSpy('clearFilter');
  reload = jasmine.createSpy('reload');
  setSuperTaskId = jasmine.createSpy('setSuperTaskId');
  setReverseQuery = jasmine.createSpy('setReverseQuery');
  reset = jasmine.createSpy('reset');
  filterError$ = { subscribe: jasmine.createSpy('subscribe') };
}

class TestPretasksTableComponent extends PretasksTableComponent {
  mockDataSource = new MockDataSource();

  override ngOnInit(): void {
    this.setColumnLabels(PretasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = this.mockDataSource as unknown as typeof this.dataSource;
    this.dataSource.setColumns(this.tableColumns);

    if (this.supertTaskId) {
      this.isDetail = true;
      this.dataSource.setSuperTaskId(this.supertTaskId);
      this.dataSource.setReverseQuery(this.reverseQuery);
    }

    this.setupFilterErrorSubscription(this.dataSource);
  }

  override ngAfterViewInit(): void {}

  override ngOnDestroy(): void {
    this.subscriptions = [];
  }
}

describe('PretasksTableComponent', () => {
  let component: TestPretasksTableComponent;
  let fixture: ComponentFixture<TestPretasksTableComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockHTTable: jasmine.SpyObj<HTTableComponent<BaseModel>>;
  let mockGlobalService: jasmine.SpyObj<GlobalService>;
  let mockExportService: jasmine.SpyObj<ExportService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPreconfiguredTasksRoleService: jasmine.SpyObj<PreconfiguredTasksRoleService>;
  let mockPermissionService: jasmine.SpyObj<unknown>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.returnValue(Promise.resolve(true));
    mockHTTable = jasmine.createSpyObj('HTTableComponent', ['reload']);
    mockGlobalService = jasmine.createSpyObj('GlobalService', [
      'bulkDelete',
      'delete',
      'update',
      'deleteRelationships'
    ]);
    mockGlobalService.update.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.update>);
    mockGlobalService.bulkDelete.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.bulkDelete>);
    mockGlobalService.delete.and.returnValue(of({}) as unknown as ReturnType<typeof mockGlobalService.delete>);
    mockGlobalService.deleteRelationships.and.returnValue(
      of({}) as unknown as ReturnType<typeof mockGlobalService.deleteRelationships>
    );
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);
    mockPreconfiguredTasksRoleService = jasmine.createSpyObj('PreconfiguredTasksRoleService', ['hasRole']);
    mockPermissionService = jasmine.createSpyObj('PermissionService', ['hasPermission']);

    await TestBed.configureTestingModule({
      declarations: [TestPretasksTableComponent],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        { provide: MatDialog, useValue: mockDialog },
        { provide: Router, useValue: mockRouter },
        { provide: GlobalService, useValue: mockGlobalService },
        { provide: ExportService, useValue: mockExportService },
        { provide: PreconfiguredTasksRoleService, useValue: mockPreconfiguredTasksRoleService },
        { provide: 'PermissionService', useValue: mockPermissionService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatDialogModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TestPretasksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = mockHTTable as HTTableComponent<BaseModel>;
    (component as unknown as { table: unknown }).table = {
      clearFilterError: jasmine.createSpy('clearFilterError'),
      reload: jasmine.createSpy('reload')
    };
    mockPreconfiguredTasksRoleService.hasRole.and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getColumns', () => {
    it('should return columns including ID, NAME, ATTACK_COMMAND, FILES_TOTAL, FILES_SIZE, PRIORITY, MAX_AGENTS', () => {
      const columns = component.getColumns();
      const columnIds = columns.map((col) => col.id);

      expect(columnIds).toContain(PretasksTableCol.ID);
      expect(columnIds).toContain(PretasksTableCol.NAME);
      expect(columnIds).toContain(PretasksTableCol.ATTACK_COMMAND);
      expect(columnIds).toContain(PretasksTableCol.FILES_TOTAL);
      expect(columnIds).toContain(PretasksTableCol.FILES_SIZE);
      expect(columnIds).toContain(PretasksTableCol.PRIORITY);
      expect(columnIds).toContain(PretasksTableCol.MAX_AGENTS);
    });

    it('should include ID column with correct properties', () => {
      const columns = component.getColumns();
      const idColumn = columns.find((col) => col.id === PretasksTableCol.ID);

      expect(idColumn).toBeDefined();
      expect(idColumn?.isSortable).toBe(true);
      expect(idColumn?.isSearchable).toBe(true);
      expect(typeof idColumn?.export).toBe('function');
    });

    it('should include NAME column with routerLink function that returns correct URL', (done) => {
      const columns = component.getColumns();
      const nameColumn = columns.find((col) => col.id === PretasksTableCol.NAME);
      const pretask = { id: 5, taskName: 'Test Pretask' } as JPretask;

      expect(nameColumn).toBeDefined();
      expect(nameColumn?.routerLink).toBeDefined();

      const link$ = nameColumn!.routerLink!(pretask);
      link$.subscribe((links) => {
        expect(links).toBeDefined();
        expect(links.length).toBe(1);
        expect(links[0].routerLink).toEqual(['/tasks/preconfigured-tasks', 5, 'edit']);
        done();
      });
    });

    it('should include FILES_TOTAL column with render function that returns correct count', () => {
      const columns = component.getColumns();
      const filesTotalColumn = columns.find((col) => col.id === PretasksTableCol.FILES_TOTAL);
      const pretaskWithFiles = { id: 1, taskName: 'Test', pretaskFiles: [{ id: 1 }, { id: 2 }, { id: 3 }] } as JPretask;
      const pretaskWithoutFiles = { id: 2, taskName: 'Test' } as JPretask;

      expect(filesTotalColumn).toBeDefined();
      expect(filesTotalColumn?.render).toBeDefined();
      expect(typeof filesTotalColumn?.icon).toBe('function');

      expect(filesTotalColumn!.render!(pretaskWithFiles)).toBe(3);
      expect(filesTotalColumn!.render!(pretaskWithoutFiles)).toBe(0);
    });

    it('should include FILES_SIZE column with render function that calculates total size correctly', () => {
      const columns = component.getColumns();
      const filesSizeColumn = columns.find((col) => col.id === PretasksTableCol.FILES_SIZE);
      const pretaskWithMultipleFiles = {
        id: 1,
        taskName: 'Test',
        pretaskFiles: [
          { id: 1, size: 1024 },
          { id: 2, size: 2048 },
          { id: 3, size: 512 }
        ]
      } as JPretask;
      const pretaskWithInvalidSizes = {
        id: 2,
        taskName: 'Test',
        pretaskFiles: [{ id: 1, size: 1000 }, { id: 2, size: NaN }, { id: 3 }]
      } as JPretask;
      const pretaskWithoutFiles = { id: 3, taskName: 'Test' } as JPretask;

      expect(filesSizeColumn).toBeDefined();
      expect(filesSizeColumn?.render).toBeDefined();
      expect(typeof filesSizeColumn?.export).toBe('function');

      expect(filesSizeColumn!.render!(pretaskWithMultipleFiles)).toMatch(/^[\d,.]+ KB$/);
      expect(filesSizeColumn!.render!(pretaskWithInvalidSizes)).toMatch(/^[\d,.]+ B$/);
      expect(filesSizeColumn!.render!(pretaskWithoutFiles)).toBe('');
    });

    it('should include PRIORITY column when user has update role', () => {
      mockPreconfiguredTasksRoleService.hasRole.and.returnValue(true);
      component.ngOnInit();
      const columns = component.getColumns();
      const priorityColumn = columns.find((col) => col.id === PretasksTableCol.PRIORITY);

      expect(priorityColumn).toBeDefined();
      expect(priorityColumn?.editable).toBeDefined();
    });

    it('should include MAX_AGENTS column when user has update role', () => {
      mockPreconfiguredTasksRoleService.hasRole.and.returnValue(true);
      component.ngOnInit();
      const columns = component.getColumns();
      const maxAgentsColumn = columns.find((col) => col.id === PretasksTableCol.MAX_AGENTS);

      expect(maxAgentsColumn).toBeDefined();
      expect(maxAgentsColumn?.editable).toBeDefined();
    });

    it('should not include editable for PRIORITY column when user lacks update role', () => {
      mockPreconfiguredTasksRoleService.hasRole.and.returnValue(false);
      component.ngOnInit();
      const columns = component.getColumns();
      const priorityColumn = columns.find((col) => col.id === PretasksTableCol.PRIORITY);

      expect(priorityColumn).toBeDefined();
      expect(priorityColumn?.editable).toBeUndefined();
    });

    it('should not include editable for MAX_AGENTS column when user lacks update role', () => {
      mockPreconfiguredTasksRoleService.hasRole.and.returnValue(false);
      component.ngOnInit();
      const columns = component.getColumns();
      const maxAgentsColumn = columns.find((col) => col.id === PretasksTableCol.MAX_AGENTS);

      expect(maxAgentsColumn).toBeDefined();
      expect(maxAgentsColumn?.editable).toBeUndefined();
    });

    it('should include ESTIMATED_KEYSPACE column when supertTaskId is set', () => {
      component.supertTaskId = 1;
      const columns = component.getColumns();
      const keyspaceColumn = columns.find((col) => col.id === PretasksTableCol.ESTIMATED_KEYSPACE);

      expect(keyspaceColumn).toBeDefined();
      expect(keyspaceColumn?.render).toBeDefined();
    });

    it('should not include ESTIMATED_KEYSPACE column when supertTaskId is 0', () => {
      component.supertTaskId = 0;
      const columns = component.getColumns();
      const keyspaceColumn = columns.find((col) => col.id === PretasksTableCol.ESTIMATED_KEYSPACE);

      expect(keyspaceColumn).toBeUndefined();
    });
  });

  describe('renderSecretIcon', () => {
    it('should return lock icon when pretask has secret files', () => {
      const pretask = {
        id: 1,
        taskName: 'Test',
        pretaskFiles: [{ id: 1, isSecret: true, size: 100 } as JFile, { id: 2, isSecret: false, size: 200 } as JFile]
      } as JPretask;

      const result = component.renderSecretIcon(pretask);

      expect(result.name).toBe('lock');
      expect(result.tooltip).toBe('Secret: 1 file');
    });

    it('should return lock icon with plural for multiple secret files', () => {
      const pretask = {
        id: 1,
        taskName: 'Test',
        pretaskFiles: [{ id: 1, isSecret: true, size: 100 } as JFile, { id: 2, isSecret: true, size: 200 } as JFile]
      } as JPretask;

      const result = component.renderSecretIcon(pretask);

      expect(result.name).toBe('lock');
      expect(result.tooltip).toBe('Secret: 2 files');
    });

    it('should return empty icon name when no secret files', () => {
      const pretask = {
        id: 1,
        taskName: 'Test',
        pretaskFiles: [{ id: 1, isSecret: false, size: 100 } as JFile]
      } as JPretask;

      const result = component.renderSecretIcon(pretask);

      expect(result.name).toBe('');
    });

    it('should return empty icon name when no pretaskFiles', () => {
      const pretask = { id: 1, taskName: 'Test' } as JPretask;

      const result = component.renderSecretIcon(pretask);

      expect(result.name).toBe('');
    });
  });

  describe('renderEstimatedKeyspace', () => {
    it('should render keyspace as formatted number', () => {
      const pretask = {
        id: 1,
        taskName: 'Test',
        attackCmd: 'test',
        pretaskFiles: [{ id: 1, size: 1000, lineCount: 100 } as JFile]
      } as JPretask;

      const result = component.renderEstimatedKeyspace(pretask);

      expect(result).toBeTruthy();
    });
  });

  describe('rowActionClicked', () => {
    const testPretask = { id: 5, taskName: 'Test Pretask' } as JPretask;

    beforeEach(() => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as unknown as ReturnType<typeof mockDialog.open>);
    });

    it('should emit pretaskAdd for ADD action', () => {
      const event = {
        menuItem: { label: 'Add', action: RowActionMenuAction.ADD },
        data: testPretask
      };
      spyOn(component.pretaskAdd, 'emit');

      component.rowActionClicked(event);

      expect(component.pretaskAdd.emit).toHaveBeenCalledWith([testPretask]);
    });

    it('should navigate to pretask edit page for EDIT action', () => {
      const event = {
        menuItem: { label: 'Edit', action: RowActionMenuAction.EDIT },
        data: testPretask
      };

      component.rowActionClicked(event);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks/preconfigured-tasks', 5, 'edit']);
    });

    it('should navigate to new task copy page for COPY_TO_TASK action', () => {
      const event = {
        menuItem: { label: 'Copy to Task', action: RowActionMenuAction.COPY_TO_TASK },
        data: testPretask
      };

      component.rowActionClicked(event);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks/new-tasks', 5, 'copypretask']);
    });

    it('should navigate to pretask copy page for COPY_TO_PRETASK action', () => {
      const event = {
        menuItem: { label: 'Copy to Pretask', action: RowActionMenuAction.COPY_TO_PRETASK },
        data: testPretask
      };

      component.rowActionClicked(event);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks/preconfigured-tasks', 5, 'copy']);
    });

    it('should open dialog for DELETE action when isDelete is true', () => {
      component.unassignOption = false;
      const event = {
        menuItem: { label: 'Delete', action: RowActionMenuAction.DELETE },
        data: testPretask
      };

      component.rowActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should open dialog for DELETE action when isDelete is false (unassign)', () => {
      component.unassignOption = true;
      const event = {
        menuItem: { label: 'Delete', action: RowActionMenuAction.DELETE },
        data: testPretask
      };

      component.rowActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('bulkActionClicked', () => {
    beforeEach(() => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as unknown as ReturnType<typeof mockDialog.open>);
    });

    it('should emit pretaskAdd for ADD action', () => {
      const pretasks = [
        { id: 1, taskName: 'Test 1' },
        { id: 2, taskName: 'Test 2' }
      ] as JPretask[];
      const event = {
        menuItem: { label: 'Add', action: BulkActionMenuAction.ADD },
        data: pretasks
      };
      spyOn(component.pretaskAdd, 'emit');

      component.bulkActionClicked(event);

      expect(component.pretaskAdd.emit).toHaveBeenCalledWith(pretasks);
    });

    it('should open dialog for DELETE action when isDelete is true', () => {
      component.unassignOption = false;
      const pretasks = [{ id: 1, taskName: 'Test 1' }] as JPretask[];
      const event = {
        menuItem: { label: 'Delete', action: BulkActionMenuAction.DELETE },
        data: pretasks
      };

      component.bulkActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should open dialog for DELETE action when isDelete is false (unassign)', () => {
      component.unassignOption = true;
      const pretasks = [{ id: 1, taskName: 'Test 1' }] as JPretask[];
      const event = {
        menuItem: { label: 'Delete', action: BulkActionMenuAction.DELETE },
        data: pretasks
      };

      component.bulkActionClicked(event);

      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('filter', () => {
    it('should call dataSource.loadAll with filter when input has value', () => {
      component.selectedFilterColumn = { dataKey: 'taskName' } as unknown as HTTableColumn;

      component.filter('test');

      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith({
        value: 'test',
        field: 'taskName',
        operator: jasmine.anything(),
        parent: undefined
      });
    });

    it('should call dataSource.loadAll without filter when input is empty', () => {
      component.filter('');
      expect(component.mockDataSource.loadAll).toHaveBeenCalledWith();
    });
  });

  describe('handleBackendSqlFilter', () => {
    it('should call filter when event has value', () => {
      component.selectedFilterColumn = { dataKey: 'taskName' } as unknown as HTTableColumn;
      const filterSpy = spyOn(component, 'filter');

      component.handleBackendSqlFilter('search term');

      expect(filterSpy).toHaveBeenCalledWith('search term');
    });

    it('should call dataSource.clearFilter when event is empty', () => {
      component.handleBackendSqlFilter('');

      expect(component.mockDataSource.clearFilter).toHaveBeenCalled();
    });

    it('should call dataSource.clearFilter when event is whitespace only', () => {
      component.handleBackendSqlFilter('   ');

      expect(component.mockDataSource.clearFilter).toHaveBeenCalled();
    });
  });

  describe('exportActionClicked', () => {
    it('should call exportService.handleExportAction', () => {
      component.tableColumns = [];
      component.table.displayedColumns = ['0', '1', '2', '3', '4', '5', '6'];
      const event = {
        menuItem: { label: 'Export' },
        data: [{ id: 1, taskName: 'Test' }]
      } as ActionMenuEvent<JPretask[]>;

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        component.tableColumns,
        PretasksTableColumnLabel,
        'hashtopolis-pretasks'
      );
    });

    it('should pass only visible columns when displayedColumns is set', () => {
      component.table.displayedColumns = ['0', '1'];
      const event = {
        menuItem: { label: 'Export' },
        data: [{ id: 1 }, { id: 2 }]
      } as ActionMenuEvent<JPretask[]>;

      component.exportActionClicked(event);

      const expectedColumns = component.tableColumns.filter((col: HTTableColumn) => [0, 1].includes(col.id));
      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        expectedColumns,
        PretasksTableColumnLabel,
        'hashtopolis-pretasks'
      );
    });
  });

  describe('openDialog', () => {
    beforeEach(() => {
      mockDialog.open.and.returnValue({
        afterClosed: () => of(null)
      } as unknown as ReturnType<typeof mockDialog.open>);
    });

    it('should open dialog with correct configuration', () => {
      component.openDialog({
        rows: [{ id: 1, taskName: 'Test' }] as JPretask[],
        title: 'Test Title',
        icon: 'warning',
        body: 'Test body',
        warn: true,
        action: RowActionMenuAction.DELETE
      });

      expect(mockDialog.open).toHaveBeenCalledWith(jasmine.anything(), {
        data: jasmine.any(Object),
        width: '450px'
      });
    });

    it('should handle dialog close with DELETE action', () => {
      const dialogRefMock = {
        afterClosed: () => of({ action: RowActionMenuAction.DELETE, data: [{ id: 1, taskName: 'Test' }] })
      };
      mockDialog.open.and.returnValue(dialogRefMock as unknown as ReturnType<typeof mockDialog.open>);

      component.openDialog({
        rows: [{ id: 1, taskName: 'Test' }] as JPretask[],
        title: 'Test Title',
        icon: 'warning',
        body: 'Test body',
        warn: true,
        action: RowActionMenuAction.DELETE
      });

      fixture.detectChanges();
    });
  });

  describe('editableSaved', () => {
    it('should call globalService.update for CHANGE_PRIORITY action', () => {
      const editable = {
        action: PretasksTableEditableAction.CHANGE_PRIORITY,
        data: { id: 1, taskName: 'Test', priority: 5 } as JPretask,
        value: '10'
      };

      component.editableSaved(editable);

      expect(mockGlobalService.update).toHaveBeenCalledWith(jasmine.anything(), 1, { priority: 10 });
    });

    it('should call globalService.update for CHANGE_MAX_AGENTS action', () => {
      const editable = {
        action: PretasksTableEditableAction.CHANGE_MAX_AGENTS,
        data: { id: 1, taskName: 'Test', maxAgents: 5 } as JPretask,
        value: '10'
      };

      component.editableSaved(editable);

      expect(mockGlobalService.update).toHaveBeenCalledWith(jasmine.anything(), 1, { maxAgents: 10 });
    });
  });

  describe('Input setters', () => {
    it('should set supertTaskId correctly', () => {
      component.supertTaskId = 5;
      expect(component.supertTaskId).toBe(5);
    });

    it('should return 0 when supertTaskId is undefined', () => {
      expect(component.supertTaskId).toBe(0);
    });

    it('should set reverseQuery correctly', () => {
      component.reverseQuery = true;
      expect(component.reverseQuery).toBe(true);
    });

    it('should set unassignOption correctly', () => {
      component.unassignOption = true;
      expect(component.unassignOption).toBe(true);
    });
  });

  describe('isDelete getter', () => {
    it('should return true when unassignOption is false', () => {
      component.unassignOption = false;
      expect(component.isDelete).toBe(true);
    });

    it('should return false when unassignOption is true', () => {
      component.unassignOption = true;
      expect(component.isDelete).toBe(false);
    });
  });

  describe('rowActionAddToSupertask', () => {
    it('should emit pretaskAdd with single pretask', () => {
      spyOn(component.pretaskAdd, 'emit');
      const pretask = { id: 1, taskName: 'Test' } as JPretask;

      (component as unknown as { rowActionAddToSupertask: (pretask: JPretask) => void }).rowActionAddToSupertask(
        pretask
      );

      expect(component.pretaskAdd.emit).toHaveBeenCalledWith([pretask]);
    });
  });
});
