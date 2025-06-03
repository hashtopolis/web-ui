import { Component, OnDestroy, OnInit } from '@angular/core';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { Observable, catchError, forkJoin, of } from 'rxjs';
import {
  PreprocessorsTableCol,
  PreprocessorsTableColumnLabel
} from '@components/tables/preprocessors-table/preprocessors-table.constants';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { JPreprocessor } from '@models/preprocessor.model';
import { PreprocessorsDataSource } from '@datasources/preprocessors.datasource';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { SERV } from '@services/main.config';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';

@Component({
  selector: 'app-preprocessors-table',
  templateUrl: './preprocessors-table.component.html',
  standalone: false
})
export class PreprocessorsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: PreprocessorsDataSource;
  selectedFilterColumn: string = 'all';
  ngOnInit(): void {
    this.setColumnLabels(PreprocessorsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new PreprocessorsDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  /*   filter(item: JPreprocessor, filterValue: string): boolean {
    return item.name.toLowerCase().includes(filterValue);
  } */
  filter(item: JPreprocessor, filterValue: string): boolean {
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        console.log(item);
        // Search across multiple relevant fields
        return item.id.toString().includes(filterValue) || item.name?.toLowerCase().includes(filterValue);
      }
      case 'id': {
        return item.id.toString().includes(filterValue);
      }
      case 'name': {
        return item.name?.toLowerCase().includes(filterValue);
      }
      default:
        // Default fallback to task name
        return item.name?.toLowerCase().includes(filterValue);
    }
  }
  getColumns(): HTTableColumn[] {
    return [
      {
        id: PreprocessorsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        export: async (preprocessor: JPreprocessor) => preprocessor.id + ''
      },
      {
        id: PreprocessorsTableCol.NAME,
        dataKey: 'name',
        routerLink: (preprocessor: JPreprocessor) => this.renderPreproLink(preprocessor),
        isSortable: true,
        isSearchable: true,
        export: async (preprocessor: JPreprocessor) => preprocessor.name
      }
    ];
  }

  openDialog(data: DialogData<JPreprocessor>) {
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

  /**
   * Render preprocessor link
   * @param preprocessor - preprocessor object to render link for
   * @return observable object containing a router link array
   */
  private renderPreproLink(preprocessor: JPreprocessor): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (preprocessor) {
      links.push({
        label: preprocessor.name,
        routerLink: ['/config/engine/preprocessors', preprocessor.id, 'edit'],
        tooltip: 'Preprocessor Name'
      });
    }
    return of(links);
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<JPreprocessor[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JPreprocessor>(
          'hashtopolis-preprocessors',
          this.tableColumns,
          event.data,
          PreprocessorsTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JPreprocessor>(
          'hashtopolis-preprocessors',
          this.tableColumns,
          event.data,
          PreprocessorsTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JPreprocessor>(this.tableColumns, event.data, PreprocessorsTableColumnLabel)
          .then(() => {
            this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JPreprocessor>): void {
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

  bulkActionClicked(event: ActionMenuEvent<JPreprocessor[]>): void {
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
  private bulkActionDelete(preprocessors: JPreprocessor[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.PREPROCESSORS, preprocessors)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(`Successfully deleted preprocessors!`, 'Close');
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(preprocessors: JPreprocessor[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.PREPROCESSORS, preprocessors[0].id)
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

  private rowActionEdit(preprocessor: JPreprocessor): void {
    this.router.navigate(['/config', 'engine', 'preprocessors', preprocessor.id, 'edit']);
  }
}
