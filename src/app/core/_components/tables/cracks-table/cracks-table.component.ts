/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { CracksDataSource } from 'src/app/core/_datasources/cracks.datasource';
import { CracksTableColumnLabel } from './cracks-table.constants';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HTTableColumn } from '../ht-table/ht-table.models';
import { Hash } from 'src/app/core/_models/hash.model';
import { HashListFormatLabel } from 'src/app/core/_constants/hashlist.config';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';

@Component({
  selector: 'cracks-table',
  templateUrl: './cracks-table.component.html'
})
export class CracksTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: CracksDataSource;

  ngOnInit(): void {
    this.tableColumns = this.getColumns();
    this.dataSource = new CracksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: Hash, filterValue: string): boolean {
    if (item.hash.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        name: CracksTableColumnLabel.FOUND,
        dataKey: 'timeCracked',
        render: (crack: Hash) =>
          formatUnixTimestamp(crack.timeCracked, this.dateFormat),
        isSortable: true,
        export: async (crack: Hash) =>
          formatUnixTimestamp(crack.timeCracked, this.dateFormat)
      },
      {
        name: CracksTableColumnLabel.PLAINTEXT,
        dataKey: 'plaintext',
        isSortable: true,
        export: async (crack: Hash) => crack.plaintext
      },
      {
        name: CracksTableColumnLabel.HASH,
        dataKey: 'hash',
        isSortable: true,
        truncate: true,
        export: async (crack: Hash) => crack.hash
      },
      {
        name: CracksTableColumnLabel.AGENT,
        dataKey: 'agentId',
        isSortable: true,
        routerLink: (crack: Hash) => this.renderAgentLink(crack),
        export: async (crack: Hash) => crack.agentId + ''
      },
      {
        name: CracksTableColumnLabel.TASK,
        dataKey: 'taskId',
        isSortable: true,
        routerLink: (crack: Hash) => this.renderTaskLink(crack),
        export: async (crack: Hash) => crack.taskId + ''
      },
      {
        name: CracksTableColumnLabel.CHUNK,
        dataKey: 'chunkId',
        isSortable: true,
        routerLink: (crack: Hash) => this.renderChunkLink(crack),
        export: async (crack: Hash) => crack.chunkId + ''
      },
      {
        name: CracksTableColumnLabel.TYPE,
        dataKey: 'hashlistId',
        isSortable: true,
        render: (crack: Hash) =>
          crack.hashlist ? HashListFormatLabel[crack.hashlist.format] : '',
        export: async (crack: Hash) =>
          crack.hashlist ? HashListFormatLabel[crack.hashlist.format] : ''
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<Hash>) {
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

  exportActionClicked(event: ActionMenuEvent<Hash[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<Hash>(
          'hashtopolis-cracks',
          this.tableColumns,
          event.data
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Hash>(
          'hashtopolis-cracks',
          this.tableColumns,
          event.data
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Hash>(this.tableColumns, event.data)
          .then(() => {
            this.snackBar.open(
              'The selected rows are copied to the clipboard',
              'Close'
            );
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<Hash>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting crack ${event.data._id} ...`,
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

  bulkActionClicked(event: ActionMenuEvent<Hash[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} cracks ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above cracks? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'name',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(cracks: Hash[]): void {
    const requests = cracks.map((crack: Hash) => {
      return this.gs.delete(SERV.CRACKERS_TYPES, crack._id);
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
          this.snackBar.open(
            `Successfully deleted ${results.length} cracks!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(cracks: Hash[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.CRACKERS_TYPES, cracks[0]._id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted crack!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(crack: Hash): void {
    this.router.navigate(['/config', 'engine', 'cracks', crack._id, 'edit']);
  }
}
