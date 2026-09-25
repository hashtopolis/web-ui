import { catchError } from 'rxjs';

import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { JBenchmark } from '@models/benchmark.model';

import { BenchmarkContextMenuService } from '@services/context-menu/config/benchmark-menu.service';
import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import {
  BenchmarkTableCol,
  BenchmarkTableColumnLabel
} from '@components/tables/benchmark-table/benchmark-table.constants';
import { HTTableColumn } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { BenchmarkDataSource } from '@datasources/benchmark.datasource';

import { FilterType } from '@src/app/core/_models/request-params.model';
import { ShowTruncatedDataDialogComponent } from '@src/app/shared/dialog/show-truncated-data.dialog/show-truncated-data.dialog.component';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-benchmark-table',
  templateUrl: './benchmark-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BenchmarkTableComponent extends BaseTableComponent implements OnInit, AfterViewInit {
  tableColumns: HTTableColumn[] = [];
  dataSource: BenchmarkDataSource;
  selectedFilterColumn: HTTableColumn;

  ngOnInit(): void {
    this.setColumnLabels(BenchmarkTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new BenchmarkDataSource(this.injector);
    this.contextMenuService = new BenchmarkContextMenuService(this.permissionService).addContextMenu();
    this.dataSource.setColumns(this.tableColumns);
    this.setupFilterErrorSubscription(this.dataSource);
  }

  ngAfterViewInit(): void {
    this.dataSource.loadAll();
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: BenchmarkTableCol.ID,
        dataKey: 'id',
        isNumeric: true,
        isSortable: true,
        isSearchable: true,
        export: async (b: JBenchmark) => b.id + ''
      },
      {
        id: BenchmarkTableCol.CRACKER,
        dataKey: 'crackerBinaryId',
        isNumeric: true,
        isSortable: true,
        export: async (b: JBenchmark) => b.crackerBinaryId + ''
      },
      {
        id: BenchmarkTableCol.HASH_MODE,
        dataKey: 'hashMode',
        isNumeric: true,
        isSortable: true,
        isSearchable: true,
        export: async (b: JBenchmark) => b.hashMode + ''
      },
      {
        id: BenchmarkTableCol.ATTACK,
        dataKey: 'attackParameters',
        isSortable: true,
        // Signatures are opaque 64-char SHA-256 hashes. Show a short middle
        // ellipsis so the column stays narrow; the show-full button opens a
        // dialog with the complete value, and export carries it too.
        truncate: () => true,
        truncateMaxLength: 20,
        export: async (b: JBenchmark) => b.attackParameters
      },
      {
        id: BenchmarkTableCol.DEVICE,
        dataKey: 'deviceSignature',
        isSortable: true,
        truncate: () => true,
        truncateMaxLength: 20,
        export: async (b: JBenchmark) => b.deviceSignature
      },
      {
        id: BenchmarkTableCol.TYPE,
        dataKey: 'benchmarkType',
        isSortable: true,
        isSearchable: true,
        export: async (b: JBenchmark) => b.benchmarkType
      },
      {
        id: BenchmarkTableCol.VALUE,
        dataKey: 'benchmarkValue',
        isSortable: true,
        export: async (b: JBenchmark) => b.benchmarkValue
      },
      {
        id: BenchmarkTableCol.CREATED,
        dataKey: 'createTime',
        isSortable: true,
        render: (b: JBenchmark) => formatUnixTimestamp(b.createTime, this.dateTimeFormat),
        export: async (b: JBenchmark) => formatUnixTimestamp(b.createTime, this.dateTimeFormat)
      },
      {
        id: BenchmarkTableCol.EXPIRES,
        dataKey: 'expireTime',
        isSortable: true,
        render: (b: JBenchmark) => formatUnixTimestamp(b.expireTime, this.dateTimeFormat),
        export: async (b: JBenchmark) => formatUnixTimestamp(b.expireTime, this.dateTimeFormat)
      }
    ];
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
      this.dataSource.loadAll();
    }
  }

  handleBackendSqlFilter(event: string) {
    if (event && event.trim().length > 0) {
      this.filter(event);
    } else {
      this.dataSource.clearFilter();
    }
  }

  openDialog(data: DialogData<JBenchmark>) {
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

  rowActionClicked(event: ActionMenuEvent<JBenchmark>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Invalidating benchmark cache entry ${event.data.id} ...`,
          icon: 'warning',
          body: `Are you sure you want to invalidate it? Agents whose run matches this key will benchmark again on their next task pickup.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JBenchmark[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Invalidating ${event.data.length} benchmark cache entries ...`,
          icon: 'warning',
          body: `Are you sure you want to invalidate the above entries? The matching agents will benchmark again on their next task pickup.`,
          warn: true,
          listAttribute: 'benchmarkValue',
          action: event.menuItem.action
        });
        break;
    }
  }

  exportActionClicked(event: ActionMenuEvent<JBenchmark[]>): void {
    const visibleColumnIds = this.table.displayedColumns.map(Number);
    const visibleColumns = this.tableColumns.filter((col) => visibleColumnIds.includes(col.id));
    this.exportService.handleExportAction<JBenchmark>(
      event,
      visibleColumns,
      BenchmarkTableColumnLabel,
      'hashtopolis-benchmark-cache'
    );
  }

  // The signature columns are truncated, so the show-full button emits the row
  // and this opens a dialog with both complete signatures (a row-level emit
  // cannot say which of the two columns was clicked, so it shows both).
  showFullSignature(benchmark: JBenchmark): void {
    this.dialog.open(ShowTruncatedDataDialogComponent, {
      data: {
        hashlistName: 'benchmark #' + benchmark.id,
        unTruncatedText:
          'Attack signature:  ' + benchmark.attackParameters + '\n' + 'Device signature:  ' + benchmark.deviceSignature
      }
    });
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(benchmarks: JBenchmark[]): void {
    this.gs
      .bulkDelete(SERV.BENCHMARKS, benchmarks)
      .pipe(
        catchError((error) => {
          console.error('Error during deletion: ', error);
          return [];
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.alertService.showSuccessMessage(`Successfully invalidated benchmark cache entries!`);
        this.dataSource.reload();
      });
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(benchmarks: JBenchmark[]): void {
    this.gs
      .delete(SERV.BENCHMARKS, benchmarks[0].id)
      .pipe(
        catchError((error) => {
          console.error('Error during deletion:', error);
          return [];
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.alertService.showSuccessMessage('Successfully invalidated benchmark cache entry!');
        this.reload();
      });
  }
}
