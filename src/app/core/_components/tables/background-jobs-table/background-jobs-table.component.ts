import {
  BackgroundJobStatus,
  formatBackgroundJobPayload,
  formatBackgroundJobStatus,
  formatBackgroundJobType
} from '@constants/background-jobs.config';
import { catchError } from 'rxjs';

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { JBackgroundJob } from '@models/background-job.model';

import { BackgroundJobContextMenuService } from '@services/context-menu/config/background-job-menu.service';
import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import {
  BackgroundJobsTableCol,
  BackgroundJobsTableColumnLabel
} from '@components/tables/background-jobs-table/background-jobs-table.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { BackgroundJobsDataSource } from '@datasources/background-jobs.datasource';

import { FilterType } from '@src/app/core/_models/request-params.model';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

const RUNNING_NOT_DELETABLE = 'Running jobs cannot be deleted.';

@Component({
  selector: 'background-jobs-table',
  templateUrl: './background-jobs-table.component.html',
  standalone: false
})
export class BackgroundJobsTableComponent extends BaseTableComponent implements OnInit, AfterViewInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: BackgroundJobsDataSource;
  selectedFilterColumn: HTTableColumn;

  /** Number of running jobs left out of the pending bulk delete, reported in the success toast. */
  private skippedRunningJobs = 0;

  ngOnInit(): void {
    this.setColumnLabels(BackgroundJobsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new BackgroundJobsDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.contextMenuService = new BackgroundJobContextMenuService(this.permissionService).addContextMenu();
    // Setup filter error handling
    this.setupFilterErrorSubscription(this.dataSource);
  }

  ngAfterViewInit(): void {
    // Wait until paginator is defined
    this.dataSource.loadAll();
    if (this.dataSource.autoRefreshService.refreshPage) {
      this.dataSource.startAutoRefresh();
    }
  }

  ngOnDestroy(): void {
    this.dataSource.stopAutoRefresh();
  }

  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({
        value: input,
        field: selectedColumn.dataKey ?? '',
        operator: FilterType.ICONTAINS,
        parent: selectedColumn.parent
      });
      return;
    } else {
      this.dataSource.loadAll(); // Reload all data if input is empty
    }
  }

  handleBackendSqlFilter(event: string) {
    if (event && event.trim().length > 0) {
      this.filter(event);
    } else {
      // Clear the filter when search box is cleared
      this.dataSource.clearFilter();
    }
  }

  getColumns(): HTTableColumn[] {
    const timestamp = (value: number | null) => (value ? formatUnixTimestamp(value, this.dateTimeFormat) : '');
    const userName = (job: JBackgroundJob) => job.user?.name ?? (job.userId === null ? 'System' : '');

    return [
      {
        id: BackgroundJobsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        export: async (job: JBackgroundJob) => job.id + ''
      },
      {
        id: BackgroundJobsTableCol.TYPE,
        dataKey: 'jobType',
        isSortable: true,
        isSearchable: true,
        render: (job: JBackgroundJob) => this.sanitize(formatBackgroundJobType(job.jobType)),
        export: async (job: JBackgroundJob) => formatBackgroundJobType(job.jobType)
      },
      {
        id: BackgroundJobsTableCol.STATUS,
        dataKey: 'status',
        isSortable: true,
        render: (job: JBackgroundJob) => formatBackgroundJobStatus(job.status),
        export: async (job: JBackgroundJob) => formatBackgroundJobStatus(job.status)
      },
      {
        id: BackgroundJobsTableCol.USER,
        dataKey: 'userId',
        isSortable: false,
        render: (job: JBackgroundJob) => this.sanitize(userName(job)),
        export: async (job: JBackgroundJob) => userName(job)
      },
      {
        id: BackgroundJobsTableCol.CREATED,
        dataKey: 'createdAt',
        isSortable: true,
        render: (job: JBackgroundJob) => timestamp(job.createdAt),
        export: async (job: JBackgroundJob) => timestamp(job.createdAt)
      },
      {
        id: BackgroundJobsTableCol.STARTED,
        dataKey: 'startedAt',
        isSortable: true,
        render: (job: JBackgroundJob) => timestamp(job.startedAt),
        export: async (job: JBackgroundJob) => timestamp(job.startedAt)
      },
      {
        id: BackgroundJobsTableCol.FINISHED,
        dataKey: 'finishedAt',
        isSortable: true,
        render: (job: JBackgroundJob) => timestamp(job.finishedAt),
        export: async (job: JBackgroundJob) => timestamp(job.finishedAt)
      },
      {
        id: BackgroundJobsTableCol.EXIT_CODE,
        dataKey: 'exitCode',
        isSortable: true,
        render: (job: JBackgroundJob) => (job.exitCode === null ? '' : String(job.exitCode)),
        export: async (job: JBackgroundJob) => (job.exitCode === null ? '' : String(job.exitCode))
      },
      {
        id: BackgroundJobsTableCol.MESSAGE,
        dataKey: 'resultMessage',
        isSortable: false,
        isSearchable: true,
        render: (job: JBackgroundJob) => this.sanitize(job.resultMessage ?? ''),
        export: async (job: JBackgroundJob) => job.resultMessage ?? ''
      },
      {
        id: BackgroundJobsTableCol.PAYLOAD,
        dataKey: 'payload',
        isSortable: false,
        render: (job: JBackgroundJob) => this.sanitize(formatBackgroundJobPayload(job.payload)),
        export: async (job: JBackgroundJob) => formatBackgroundJobPayload(job.payload)
      }
    ];
  }

  openDialog(data: DialogData<JBackgroundJob>) {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result && result.action) {
          switch (result.action) {
            case RowActionMenuAction.DELETE:
              this.rowActionDelete(result.data);
              break;
            case BulkActionMenuAction.DELETE:
              this.bulkActionDelete(result.data);
              break;
          }
        }
      });
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JBackgroundJob[]>): void {
    const visibleColumnIds = this.table.displayedColumns.map(Number);
    const visibleColumns = this.tableColumns.filter((col) => visibleColumnIds.includes(col.id));
    this.exportService.handleExportAction<JBackgroundJob>(
      event,
      visibleColumns,
      BackgroundJobsTableColumnLabel,
      'hashtopolis-background-jobs'
    );
  }

  rowActionClicked(event: ActionMenuEvent<JBackgroundJob>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        if (event.data.status === BackgroundJobStatus.RUNNING) {
          this.alertService.showInfoMessage(RUNNING_NOT_DELETABLE);
          return;
        }
        this.openDialog({
          rows: [event.data],
          title: `Deleting background job ${event.data.id} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? A pending job is cancelled. Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JBackgroundJob[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE: {
        const deletable = event.data.filter((job) => job.status !== BackgroundJobStatus.RUNNING);
        this.skippedRunningJobs = event.data.length - deletable.length;
        if (deletable.length === 0) {
          this.alertService.showInfoMessage(RUNNING_NOT_DELETABLE);
          return;
        }
        this.openDialog({
          rows: deletable,
          title: `Deleting ${deletable.length} background jobs ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above background jobs? Pending jobs are cancelled. Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'id',
          action: event.menuItem.action
        });
        break;
      }
    }
  }

  /**
   * Errors (e.g. 409 when a job started in the meantime) are shown by the global HTTP error handler.
   */
  private rowActionDelete(jobs: JBackgroundJob[]): void {
    this.gs
      .delete(SERV.BACKGROUND_JOBS, jobs[0].id)
      .pipe(
        catchError(() => {
          this.reload();
          return [];
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.alertService.showSuccessMessage('Deleted background job!');
        this.reload();
      });
  }

  /**
   * The backend deletes one by one without a transaction, so after an error some jobs may already be gone;
   * reloading shows the real state. The error itself is shown by the global HTTP error handler.
   */
  private bulkActionDelete(jobs: JBackgroundJob[]): void {
    const skipped = this.skippedRunningJobs;
    this.gs
      .bulkDelete(SERV.BACKGROUND_JOBS, jobs)
      .pipe(
        catchError(() => {
          this.reload();
          return [];
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        const skippedText = skipped > 0 ? ` ${skipped} running jobs were skipped.` : '';
        this.alertService.showSuccessMessage(`Deleted ${jobs.length} background jobs.${skippedText}`);
        this.reload();
      });
  }
}
