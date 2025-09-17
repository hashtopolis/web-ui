import { Observable, catchError, of } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { JPreprocessor } from '@models/preprocessor.model';

import { PreProContextMenuService } from '@services/context-menu/crackers/preprocessor-menu.service';
import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import {
  PreprocessorsTableCol,
  PreprocessorsTableColumnLabel
} from '@components/tables/preprocessors-table/preprocessors-table.constants';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { PreprocessorsDataSource } from '@datasources/preprocessors.datasource';

import { FilterType } from '@src/app/core/_models/request-params.model';

@Component({
  selector: 'app-preprocessors-table',
  templateUrl: './preprocessors-table.component.html',
  standalone: false
})
export class PreprocessorsTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: PreprocessorsDataSource;
  selectedFilterColumn: string;
  ngOnInit(): void {
    this.setColumnLabels(PreprocessorsTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new PreprocessorsDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.contextMenuService = new PreProContextMenuService(this.permissionService).addContextMenu();
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({ value: input, field: selectedColumn, operator: FilterType.ICONTAINS });
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
    return [
      {
        id: PreprocessorsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        render: (preprocessor: JPreprocessor) => preprocessor.id,
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
    this.exportService.handleExportAction<JPreprocessor>(
      event,
      this.tableColumns,
      PreprocessorsTableColumnLabel,
      'hashtopolis-preprocessors'
    );
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
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Successfully deleted preprocessors!`);
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
          this.alertService.showSuccessMessage('Successfully deleted preprocessor!');
          this.reload();
        })
    );
  }

  private rowActionEdit(preprocessor: JPreprocessor): void {
    this.router.navigate(['/config', 'engine', 'preprocessors', preprocessor.id, 'edit']);
  }
}
