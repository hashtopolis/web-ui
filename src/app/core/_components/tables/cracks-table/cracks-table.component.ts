/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CracksTableCol,
  CracksTableColumnLabel
} from './cracks-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { CracksDataSource } from 'src/app/core/_datasources/cracks.datasource';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HTTableColumn, HTTableRouterLink } from '../ht-table/ht-table.models';
import { JHash } from 'src/app/core/_models/hash.model';
import { HashListFormatLabel } from 'src/app/core/_constants/hashlist.config';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { formatUnixTimestamp } from 'src/app/shared/utils/datetime';
import { Cacheable } from '../../../_decorators/cacheable';

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
    this.setColumnLabels(CracksTableColumnLabel);
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

  filter(item: JHash, filterValue: string): boolean {
    if (item.plaintext.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: CracksTableCol.FOUND,
        dataKey: 'timeCracked',
        render: (crack: JHash) =>
          formatUnixTimestamp(crack.timeCracked, this.dateFormat),
        isSortable: true,
        export: async (crack: JHash) =>
          formatUnixTimestamp(crack.timeCracked, this.dateFormat)
      },
      {
        id: CracksTableCol.PLAINTEXT,
        dataKey: 'plaintext',
        isSortable: true,
        render: (crack: JHash) => crack.plaintext,
        export: async (crack: JHash) => crack.plaintext
      },
      {
        id: CracksTableCol.HASH,
        dataKey: 'hash',
        isSortable: true,
        truncate: true,
        render: (crack: JHash) => crack.hash,
        export: async (crack: JHash) => crack.hash
      },
      {
        id: CracksTableCol.AGENT,
        dataKey: 'agentId',
        isSortable: true,
        routerLink: (crack: JHash) => this.renderAgentLink(crack),
        export: async (crack: JHash) => crack.chunk.agentId + ''
      },
      {
        id: CracksTableCol.TASK,
        dataKey: 'taskId',
        isSortable: true,
        routerLink: (crack: JHash) => this.renderTaskLinkId(crack),
        export: async (crack: JHash) => crack.chunk.taskId + ''
      },
      {
        id: CracksTableCol.CHUNK,
        dataKey: 'chunkId',
        isSortable: true,
        routerLink: (crack: JHash) => this.renderChunkLink(crack),
        export: async (crack: JHash) => crack.chunkId + ''
      },
      {
        id: CracksTableCol.TYPE,
        dataKey: 'hashlistId',
        isSortable: true,
        render: (crack: JHash) =>
          crack.hashlist ? HashListFormatLabel[crack.hashlist.format] : '',
        export: async (crack: JHash) =>
          crack.hashlist ? HashListFormatLabel[crack.hashlist.format] : ''
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<JHash>) {
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



  // --- Render functions ---
  @Cacheable(['id'])
 override async renderAgentLink(obj: JHash): Promise<HTTableRouterLink[]> {
    return [
      {
        //crack.chunk.agentId
        routerLink:
          obj && obj['chunk']['agentId']
            ? ['/agents', 'show-agents', obj['chunk']['agentId'], 'edit']
            : [],
        label: obj['chunk']['agentId']
      }
    ];
  }

  @Cacheable(['id'])
  async renderTaskLinkId(obj: JHash): Promise<HTTableRouterLink[]> {
  return [
    {
      routerLink:
        obj && obj['chunk']['taskId']
          ? ['/tasks', 'show-tasks', obj['chunk']['taskId'], 'edit']
          : [],
      label: obj['chunk']['taskId']
    }
  ];
}


  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JHash[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JHash>(
          'hashtopolis-cracks',
          this.tableColumns,
          event.data,
          CracksTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JHash>(
          'hashtopolis-cracks',
          this.tableColumns,
          event.data,
          CracksTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JHash>(
            this.tableColumns,
            event.data,
            CracksTableColumnLabel
          )
          .then(() => {
            this.snackBar.open(
              'The selected rows are copied to the clipboard',
              'Close'
            );
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JHash>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting crack ${event.data.id} ...`,
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

  bulkActionClicked(event: ActionMenuEvent<JHash[]>): void {
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
  private bulkActionDelete(cracks: JHash[]): void {
    const requests = cracks.map((crack: JHash) => {
      return this.gs.delete(SERV.CRACKERS_TYPES, crack.id);
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
  private rowActionDelete(cracks: JHash[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.CRACKERS_TYPES, cracks[0].id)
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

  private rowActionEdit(crack: JHash): void {
    this.router.navigate(['/config', 'engine', 'cracks', crack.id, 'edit']);
  }
}
