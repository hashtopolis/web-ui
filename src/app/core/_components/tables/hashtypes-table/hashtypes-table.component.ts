import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HTTableColumn, HTTableIcon } from '@components/tables/ht-table/ht-table.models';
import {
  HashtypesTableCol,
  HashtypesTableColumnLabel
} from '@components/tables/hashtypes-table/hashtypes-table.constants';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import { HashtypesDataSource } from '@datasources/hashtypes.datasource';
import { JHashtype } from '@models/hashtype.model';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { SERV } from '@services/main.config';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-hashtypes-table',
  templateUrl: './hashtypes-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class HashtypesTableComponent extends BaseTableComponent implements OnInit, AfterViewInit {
  tableColumns: HTTableColumn[] = [];
  dataSource: HashtypesDataSource;
  selectedFilterColumn: string = 'all';
  ngOnInit(): void {
    this.setColumnLabels(HashtypesTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new HashtypesDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
  }

  ngAfterViewInit(): void {
    // Wait until paginator is defined
    this.dataSource.loadAll();
    console.log(this.dataSource);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: HashtypesTableCol.HASHTYPE,
        dataKey: 'hashTypeId',
        isSortable: true,
        isSearchable: true,
        render: (hashtype: JHashtype) => hashtype.id,
        export: async (hashtype: JHashtype) => hashtype.id + ''
      },
      {
        id: HashtypesTableCol.DESCRIPTION,
        dataKey: 'description',
        isSortable: true,
        isSearchable: true,
        render: (hashtype: JHashtype) => hashtype.description,
        export: async (hashtype: JHashtype) => hashtype.description
      },
      {
        id: HashtypesTableCol.SALTED,
        dataKey: 'isSalted',
        icon: (hashtype: JHashtype) => this.renderCheckmarkIcon(hashtype, 'isSalted'),
        isSortable: true,
        export: async (hashtype: JHashtype) => (hashtype.isSalted ? 'Yes' : 'No')
      },
      {
        id: HashtypesTableCol.SLOW_HASH,
        dataKey: 'isSlowHash',
        icon: (hashtype: JHashtype) => this.renderCheckmarkIcon(hashtype, 'isSlowHash'),
        isSortable: true,
        export: async (hashtype: JHashtype) => (hashtype.isSlowHash ? 'Yes' : 'No')
      }
    ];
  }

  filter(input: string) {
    console.log(this.tableColumns);
    const selectedColumn = this.selectedFilterColumn;
    switch (selectedColumn) {
      case 'all': {
        console.log('Filtering across all columns');
        this.dataSource.loadAll({ query: input, field: 'all' });
        // Search across multiple relevant fields
        break;
      }
      default: {
        console.log(`Filtering by column: ${selectedColumn}`);
        this.dataSource.loadAll({ query: input, field: selectedColumn });
        break;
      }
    }
  }

  openDialog(data: DialogData<JHashtype>) {
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

  rowActionClicked(event: ActionMenuEvent<JHashtype>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting hashtype ${event.data.id} (${event.data.id}) ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JHashtype[]>): void {
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

  exportActionClicked(event: ActionMenuEvent<JHashtype[]>): void {
    this.exportService.handleExportAction<JHashtype>(
      event,
      this.tableColumns,
      HashtypesTableColumnLabel,
      'hashtopolis-hashtypes'
    );
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(hashtypes: JHashtype[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.HASHTYPES, hashtypes)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Successfully deleted hashtypes!`);
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(hashtypes: JHashtype[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.HASHTYPES, hashtypes[0].id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage('Successfully deleted hashtype!');
          this.reload();
        })
    );
  }

  private rowActionEdit(hashtype: JHashtype): void {
    this.router.navigate(['/config', 'hashtypes', hashtype.id, 'edit']);
  }

  /**
   * Redner a checkmark icon depending on the setting of the given property
   * @param hashtype - hashtype database model
   * @param property name of property to check
   * @return checkmark icon, if property is present in hashtype and id property is set to true
   * @private
   */
  private renderCheckmarkIcon(hashtype: JHashtype, property: string): HTTableIcon {
    if (property in hashtype && hashtype[property] === true) {
      return {
        name: 'check_circle',
        tooltip: 'Salted Hash',
        cls: 'text-ok'
      };
    }

    return { name: '' };
  }
}
