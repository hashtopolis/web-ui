/* eslint-disable @angular-eslint/component-selector */
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  PreprocessorsTableCol,
  PreprocessorsTableColumnLabel
} from './preprocessors-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { HTTableColumn, HTTableRouterLink } from '../ht-table/ht-table.models';
import { Preprocessor } from 'src/app/core/_models/preprocessor.model';
import { PreprocessorsDataSource } from 'src/app/core/_datasources/preprocessors.datasource';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { Cacheable } from 'src/app/core/_decorators/cacheable';

@Component({
  selector: 'preprocessors-table',
  templateUrl: './preprocessors-table.component.html'
})
export class PreprocessorsTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: PreprocessorsDataSource;

  ngOnInit(): void {
    this.setColumnLabels(PreprocessorsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new PreprocessorsDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: Preprocessor, filterValue: string): boolean {
    if (item.name.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: PreprocessorsTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (preprocessor: Preprocessor) => preprocessor._id + ''
      },
      {
        id: PreprocessorsTableCol.NAME,
        dataKey: 'name',
        routerLink: (preprocessor: Preprocessor) =>
          this.renderPreproLink(preprocessor),
        isSortable: true,
        export: async (preprocessor: Preprocessor) => preprocessor.name
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<Preprocessor>) {
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

  @Cacheable(['_id'])
  async renderPreproLink(
    preprocessor: Preprocessor
  ): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];

    links.push({
      label: preprocessor.name,
      routerLink: ['/config/engine/preprocessors', preprocessor._id, 'edit'],
      tooltip: 'Preprocessor Name'
    });

    return links;
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<Preprocessor[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<Preprocessor>(
          'hashtopolis-preprocessors',
          this.tableColumns,
          event.data,
          PreprocessorsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<Preprocessor>(
          'hashtopolis-preprocessors',
          this.tableColumns,
          event.data,
          PreprocessorsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<Preprocessor>(
            this.tableColumns,
            event.data,
            PreprocessorsTableColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<Preprocessor>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting preprocessor ${event.data.name} ...`,
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

  bulkActionClicked(event: ActionMenuEvent<Preprocessor[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} preprocessors ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above preprocessors? Note that this action cannot be undone.`,
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
  private bulkActionDelete(preprocessors: Preprocessor[]): void {
    const requests = preprocessors.map((preprocessor: Preprocessor) => {
      return this.gs.delete(SERV.PREPROCESSORS, preprocessor._id);
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
            `Successfully deleted ${results.length} preprocessors!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(preprocessors: Preprocessor[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.PREPROCESSORS, preprocessors[0]._id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted preprocessor!', 'Close');
          this.reload();
        })
    );
  }

  private rowActionEdit(preprocessor: Preprocessor): void {
    this.router.navigate([
      '/config',
      'engine',
      'preprocessors',
      preprocessor._id,
      'edit'
    ]);
  }
}
