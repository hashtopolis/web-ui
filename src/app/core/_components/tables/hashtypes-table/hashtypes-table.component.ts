/* eslint-disable @angular-eslint/component-selector */
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit
} from '@angular/core';
import {
  HTTableColumn,
  HTTableIcon
} from '../../tables/ht-table/ht-table.models';
import {
  HashtypesTableCol,
  HashtypesTableColumnLabel
} from './hashtypes-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { Hashtype } from '../../../_models/hashtype.model';
import { HashtypesDataSource } from '../../../_datasources/hashtypes.datasource';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';

@Component({
  selector: 'hashtypes-table',
  templateUrl: './hashtypes-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HashtypesTableComponent
  extends BaseTableComponent
  implements OnInit, AfterViewInit
{
  tableColumns: HTTableColumn[] = [];
  dataSource: HashtypesDataSource;

  ngOnInit(): void {
    this.setColumnLabels(HashtypesTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HashtypesDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
  }

  ngAfterViewInit(): void {
    // Wait until paginator is defined
    this.dataSource.loadAll();
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: HashtypesTableCol.HASHTYPE,
        dataKey: 'hashTypeId',
        isSortable: true,
        export: async (hashtype: Hashtype) => hashtype.hashTypeId + ''
      },
      {
        id: HashtypesTableCol.DESCRIPTION,
        dataKey: 'description',
        isSortable: true,
        export: async (hashtype: Hashtype) => hashtype.description
      },
      {
        id: HashtypesTableCol.SALTED,
        dataKey: 'isSalted',
        icons: (hashtype: Hashtype) => this.renderIsSaltedIcon(hashtype),
        isSortable: true,
        export: async (hashtype: Hashtype) => (hashtype.isSalted ? 'Yes' : 'No')
      },
      {
        id: HashtypesTableCol.SLOW_HASH,
        dataKey: 'isSlowHash',
        icons: (hashtype: Hashtype) => this.renderIsSlowIcon(hashtype),
        isSortable: true,
        export: async (hashtype: Hashtype) =>
          hashtype.isSlowHash ? 'Yes' : 'No'
      }
    ];

    return tableColumns;
  }

  filter(item: Hashtype, filterValue: string): boolean {
    if (
      item.hashTypeId.toString().toLowerCase().includes(filterValue) ||
      item.description.toLowerCase().includes(filterValue)
    ) {
      return true;
    }

    return false;
  }

  openDialog(data: DialogData<Hashtype>) {
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

  rowActionClicked(event: ActionMenuEvent<Hashtype>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting hashtype ${event.data.hashTypeId} (${event.data.description}) ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<Hashtype[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} hashtypes ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above hashtypes? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'description',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(hashtypes: Hashtype[]): void {
    const requests = hashtypes.map((hashtype: Hashtype) => {
      return this.gs.delete(SERV.HASHTYPES, hashtype.hashTypeId);
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
            `Successfully deleted ${results.length} hashtypes!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(hashtypes: Hashtype[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.HASHTYPES, hashtypes[0].hashTypeId)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted hashtype!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(hashtype: Hashtype): void {
    this.router.navigate(['/config', 'hashtypes', hashtype.hashTypeId, 'edit']);
  }

  exportActionClicked(event: ActionMenuEvent<Hashtype[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<Hashtype>(
          'hashtopolis-hashtypes',
          this.tableColumns,
          event.data,
          HashtypesTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Hashtype>(
          'hashtopolis-hashtypes',
          this.tableColumns,
          event.data,
          HashtypesTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Hashtype>(
            this.tableColumns,
            event.data,
            HashtypesTableColumnLabel
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

  @Cacheable(['hashTypeId', 'isSalted'])
  async renderIsSaltedIcon(hashtype: Hashtype): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    if (hashtype.isSalted) {
      icons.push({
        name: 'check_circle',
        tooltip: 'Salted Hash',
        cls: 'text-ok'
      });
    }

    return icons;
  }

  @Cacheable(['hashTypeId', 'isSlowHash'])
  async renderIsSlowIcon(hashtype: Hashtype): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    if (hashtype.isSlowHash) {
      icons.push({
        name: 'check_circle',
        tooltip: 'Slow Hash',
        cls: 'text-ok'
      });
    }

    return icons;
  }
}
