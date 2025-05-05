import { catchError, forkJoin } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { ActionMenuEvent } from '@src/app/core/_components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@src/app/core/_components/menus/bulk-action-menu/bulk-action-menu.constants';
import { ExportMenuAction } from '@src/app/core/_components/menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '@src/app/core/_components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@src/app/core/_components/tables/base-table/base-table.component';
import { HTTableColumn } from '@src/app/core/_components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@src/app/core/_components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@src/app/core/_components/tables/table-dialog/table-dialog.model';
import {
  VouchersTableCol,
  VouchersTableColumnLabel
} from '@src/app/core/_components/tables/vouchers-table/vouchers-table.constants';
import { VouchersDataSource } from '@src/app/core/_datasources/vouchers.datasource';
import { JVoucher } from '@src/app/core/_models/voucher.model';
import { SERV } from '@src/app/core/_services/main.config';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-vouchers-table',
  templateUrl: './vouchers-table.component.html',
  standalone: false
})
export class VouchersTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: VouchersDataSource;

  ngOnInit(): void {
    this.setColumnLabels(VouchersTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new VouchersDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  /**
   * Filter voucher
   * @param item
   * @param filterValue
   * @returns true, if voucher contains filterValue, else false
   */
  filter(item: JVoucher, filterValue: string): boolean {
    return item.voucher.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: VouchersTableCol.ID,
        dataKey: 'id',
        isSortable: true
      },
      {
        id: VouchersTableCol.KEY,
        dataKey: 'voucher',
        isSortable: true,
        export: async (voucher: JVoucher) => voucher.voucher
      },
      {
        id: VouchersTableCol.CREATED,
        dataKey: 'time',
        isSortable: true,
        render: (voucher: JVoucher) => formatUnixTimestamp(voucher.time, this.dateFormat),
        export: async (voucher: JVoucher) => formatUnixTimestamp(voucher.time, this.dateFormat)
      }
    ];
  }

  openDialog(data: DialogData<JVoucher>) {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((result) => {
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
      })
    );
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JVoucher[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JVoucher>(
          'hashtopolis-vouchers',
          this.tableColumns,
          event.data,
          VouchersTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JVoucher>(
          'hashtopolis-vouchers',
          this.tableColumns,
          event.data,
          VouchersTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService.toClipboard<JVoucher>(this.tableColumns, event.data, VouchersTableColumnLabel).then(() => {
          this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
        });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JVoucher>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting voucher ${event.data.voucher} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JVoucher[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} vouchers ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above vouchers? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'voucher',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(vouchers: JVoucher[]): void {
    const requests = vouchers.map((voucher: JVoucher) => {
      return this.gs.delete(SERV.VOUCHER, voucher.id);
    });

    this.subscriptions.push(
      forkJoin(requests)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(`Successfully deleted ${results.length} vouchers!`, 'Close');
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(vouchers: JVoucher[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.VOUCHER, vouchers[0].id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted voucher!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(voucher: JVoucher): void {
    this.router.navigate(['/config', 'engine', 'vouchers', voucher.id, 'edit']);
  }
}
