import { BackgroundJobStatus } from '@constants/background-jobs.config';
import { of, throwError } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { JBackgroundJob } from '@models/background-job.model';
import { BaseModel } from '@models/base.model';
import { TableSortDirection, uiConfigDefault } from '@models/config-ui.model';

import { SERV } from '@services/main.config';

import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BackgroundJobsTableComponent } from '@components/tables/background-jobs-table/background-jobs-table.component';
import {
  BackgroundJobsTableCol,
  BackgroundJobsTableColumnLabel
} from '@components/tables/background-jobs-table/background-jobs-table.constants';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';

import { BackgroundJobsDataSource } from '@datasources/background-jobs.datasource';

import { ExportService } from '@src/app/core/_services/export/export.service';

class MockBackgroundJobsDataSource {
  autoRefreshService = { refreshPage: false };
  loadAll() {}
  setColumns() {}
  clearFilter() {}
  reload() {}
  startAutoRefresh() {}
  stopAutoRefresh() {}
}

class TestBackgroundJobsTableComponent extends BackgroundJobsTableComponent {
  override ngOnInit(): void {
    this.setColumnLabels(BackgroundJobsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new MockBackgroundJobsDataSource() as unknown as BackgroundJobsDataSource;
  }
}

function job(overrides: Partial<JBackgroundJob> = {}): JBackgroundJob {
  return {
    id: 3,
    type: 'backgroundJob',
    jobType: 'recount_file',
    payload: { fileId: 7 },
    status: BackgroundJobStatus.DONE,
    userId: 1,
    createdAt: 1700000000,
    startedAt: 1700000010,
    finishedAt: 1700000020,
    exitCode: 0,
    resultMessage: 'Recounted 3 lines.',
    user: { id: 1, type: 'user', name: 'admin' },
    ...overrides
  } as JBackgroundJob;
}

describe('BackgroundJobsTableComponent', () => {
  let component: TestBackgroundJobsTableComponent;
  let fixture: ComponentFixture<TestBackgroundJobsTableComponent>;
  let mockExportService: jasmine.SpyObj<ExportService>;

  beforeEach(async () => {
    mockExportService = jasmine.createSpyObj('ExportService', ['handleExportAction']);

    await TestBed.configureTestingModule({
      declarations: [TestBackgroundJobsTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ExportService, useValue: mockExportService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestBackgroundJobsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.table = jasmine.createSpyObj('HTTableComponent', ['reload']) as unknown as HTTableComponent<BaseModel>;
  });

  function column(id: BackgroundJobsTableCol): HTTableColumn {
    return component.tableColumns.find((col) => col.id === id)!;
  }

  function rendered(id: BackgroundJobsTableCol, row: JBackgroundJob): string {
    return String(column(id).render!(row));
  }

  describe('columns', () => {
    it('exposes one column per label', () => {
      expect(component.tableColumns.length).toBe(Object.keys(BackgroundJobsTableColumnLabel).length);
    });

    it('renders type and status labels', () => {
      expect(rendered(BackgroundJobsTableCol.TYPE, job())).toBe('Recount file lines');
      expect(rendered(BackgroundJobsTableCol.STATUS, job({ status: BackgroundJobStatus.FAILED }))).toBe('Failed');
      expect(rendered(BackgroundJobsTableCol.TYPE, job({ jobType: 'future_job' }))).toBe('future_job');
    });

    it('renders the user name, or System without a user', () => {
      expect(rendered(BackgroundJobsTableCol.USER, job())).toBe('admin');
      const systemJob = job({ userId: null });
      delete systemJob.user;
      expect(rendered(BackgroundJobsTableCol.USER, systemJob)).toBe('System');
    });

    it('renders empty cells for a pending job', () => {
      const pending = job({
        status: BackgroundJobStatus.PENDING,
        startedAt: null,
        finishedAt: null,
        exitCode: null,
        resultMessage: null
      });
      expect(rendered(BackgroundJobsTableCol.STARTED, pending)).toBe('');
      expect(rendered(BackgroundJobsTableCol.FINISHED, pending)).toBe('');
      expect(rendered(BackgroundJobsTableCol.EXIT_CODE, pending)).toBe('');
      expect(rendered(BackgroundJobsTableCol.MESSAGE, pending)).toBe('');
      expect(rendered(BackgroundJobsTableCol.CREATED, pending)).not.toBe('');
    });

    it('renders the payload as key: value pairs', () => {
      expect(rendered(BackgroundJobsTableCol.PAYLOAD, job())).toBe('fileId: 7');
    });

    it('sorts newest first by default', () => {
      const settings = uiConfigDefault.tableSettings as unknown as Record<
        string,
        { order: { id: number; direction: string } }
      >;
      expect(settings['backgroundJobsTable'].order).toEqual(
        jasmine.objectContaining({ id: BackgroundJobsTableCol.ID, direction: TableSortDirection.DESC })
      );
    });
  });

  describe('delete actions', () => {
    let gs: { delete: jasmine.Spy; bulkDelete: jasmine.Spy };
    let dialogOpen: jasmine.Spy;
    let showSuccess: jasmine.Spy;
    let showInfo: jasmine.Spy;
    let reload: jasmine.Spy;

    function confirmDialog(action: string, data: JBackgroundJob[]) {
      dialogOpen.and.returnValue({ afterClosed: () => of({ action, data }) } as unknown as MatDialogRef<unknown>);
    }

    beforeEach(() => {
      gs = component['gs'] as unknown as typeof gs;
      spyOn(gs, 'delete').and.returnValue(of({}));
      spyOn(gs, 'bulkDelete').and.returnValue(of({}));
      dialogOpen = spyOn(component.dialog, 'open');
      showSuccess = spyOn(component['alertService'], 'showSuccessMessage');
      showInfo = spyOn(component['alertService'], 'showInfoMessage');
      reload = spyOn(component, 'reload');
    });

    it('deletes a finished job after confirmation', () => {
      const row = job();
      confirmDialog(RowActionMenuAction.DELETE, [row]);

      component.rowActionClicked({ data: row, menuItem: { action: RowActionMenuAction.DELETE, label: '' } });

      expect(gs.delete).toHaveBeenCalledWith(SERV.BACKGROUND_JOBS, 3);
      expect(showSuccess).toHaveBeenCalledWith('Deleted background job!');
      expect(reload).toHaveBeenCalled();
    });

    it('does not open the dialog for a running job', () => {
      const row = job({ status: BackgroundJobStatus.RUNNING });

      component.rowActionClicked({ data: row, menuItem: { action: RowActionMenuAction.DELETE, label: '' } });

      expect(dialogOpen).not.toHaveBeenCalled();
      expect(gs.delete).not.toHaveBeenCalled();
      expect(showInfo).toHaveBeenCalledWith('Running jobs cannot be deleted.');
    });

    it('delete error reloads and shows no success toast', () => {
      const row = job({ status: BackgroundJobStatus.PENDING });
      confirmDialog(RowActionMenuAction.DELETE, [row]);
      gs.delete.and.returnValue(throwError(() => ({ status: 409 })));

      component.rowActionClicked({ data: row, menuItem: { action: RowActionMenuAction.DELETE, label: '' } });

      expect(showSuccess).not.toHaveBeenCalled();
      expect(reload).toHaveBeenCalled();
    });

    it('bulk delete sends only non-running jobs and reports the skipped count', () => {
      const done = job({ id: 1 });
      const pending = job({ id: 2, status: BackgroundJobStatus.PENDING });
      const running = job({ id: 3, status: BackgroundJobStatus.RUNNING });
      confirmDialog(BulkActionMenuAction.DELETE, [done, pending]);

      component.bulkActionClicked({
        data: [done, running, pending],
        menuItem: { action: BulkActionMenuAction.DELETE, label: '' }
      });

      const dialogData = dialogOpen.calls.mostRecent().args[1].data;
      expect(dialogData.rows).toEqual([done, pending]);
      expect(gs.bulkDelete).toHaveBeenCalledWith(SERV.BACKGROUND_JOBS, [done, pending]);
      expect(showSuccess).toHaveBeenCalledWith('Deleted 2 background jobs. 1 running jobs were skipped.');
      expect(reload).toHaveBeenCalled();
    });

    it('bulk delete without running jobs does not mention skipped jobs', () => {
      const rows = [job({ id: 1 }), job({ id: 2 })];
      confirmDialog(BulkActionMenuAction.DELETE, rows);

      component.bulkActionClicked({ data: rows, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } });

      expect(showSuccess).toHaveBeenCalledWith('Deleted 2 background jobs.');
    });

    it('bulk delete with only running jobs sends nothing', () => {
      const rows = [job({ id: 1, status: BackgroundJobStatus.RUNNING })];

      component.bulkActionClicked({ data: rows, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } });

      expect(dialogOpen).not.toHaveBeenCalled();
      expect(gs.bulkDelete).not.toHaveBeenCalled();
      expect(showInfo).toHaveBeenCalledWith('Running jobs cannot be deleted.');
    });

    it('bulk delete error reloads and shows no success toast', () => {
      const rows = [job({ id: 1 })];
      confirmDialog(BulkActionMenuAction.DELETE, rows);
      gs.bulkDelete.and.returnValue(throwError(() => ({ status: 409 })));

      component.bulkActionClicked({ data: rows, menuItem: { action: BulkActionMenuAction.DELETE, label: '' } });

      expect(showSuccess).not.toHaveBeenCalled();
      expect(reload).toHaveBeenCalled();
    });
  });

  describe('auto-refresh lifecycle', () => {
    function mockDataSource() {
      return component.dataSource as unknown as MockBackgroundJobsDataSource;
    }

    it('resumes auto-refresh on init when it is enabled in the settings', () => {
      const ds = mockDataSource();
      ds.autoRefreshService.refreshPage = true;
      spyOn(ds, 'startAutoRefresh');

      component.ngAfterViewInit();

      expect(ds.startAutoRefresh).toHaveBeenCalled();
    });

    it('does not start auto-refresh on init when it is disabled in the settings', () => {
      const ds = mockDataSource();
      spyOn(ds, 'startAutoRefresh');

      component.ngAfterViewInit();

      expect(ds.startAutoRefresh).not.toHaveBeenCalled();
    });

    it('stops auto-refresh when the table is destroyed', () => {
      const ds = mockDataSource();
      spyOn(ds, 'stopAutoRefresh');

      fixture.destroy();

      expect(ds.stopAutoRefresh).toHaveBeenCalled();
    });
  });

  describe('exportActionClicked', () => {
    it('delegates to the export service', () => {
      component.table.displayedColumns = [String(BackgroundJobsTableCol.ID)];
      const event = { data: [job()], menuItem: { action: 'excel', label: '' } };

      component.exportActionClicked(event);

      expect(mockExportService.handleExportAction).toHaveBeenCalledWith(
        event,
        [column(BackgroundJobsTableCol.ID)],
        BackgroundJobsTableColumnLabel,
        'hashtopolis-background-jobs'
      );
    });
  });
});
