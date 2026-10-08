import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DynamicModel } from '@models/base.model';
import { JHashtype } from '@models/hashtype.model';
import { CrackerBinaryId } from '@models/id.types';
import { FilterType } from '@models/request-params.model';

import { CrackerHashtypesContextMenuService } from '@services/context-menu/crackers/cracker-hashtypes-menu.service';
import { RelationshipType, SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import {
  CrackerHashtypesTableCol,
  CrackerHashtypesTableColumnLabel
} from '@components/tables/cracker-hashtypes-table/cracker-hashtypes-table.constants';
import { HTTableColumn, HTTableIcon } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { CrackerHashtypesDataSource } from '@datasources/cracker-hashtypes.datasource';

/**
 * Hashtypes supported by a cracker version. Removing is only offered when editable (generic versions).
 */
@Component({
  selector: 'app-cracker-hashtypes-table',
  templateUrl: './cracker-hashtypes-table.component.html',
  standalone: false
})
export class CrackerHashtypesTableComponent extends BaseTableComponent implements OnInit, AfterViewInit {
  @Input({ required: true }) crackerBinaryId: CrackerBinaryId;
  @Input() editable = false;

  /** Emitted after hashtypes were removed, so the host can refresh what depends on the assignment */
  @Output() hashtypesRemoved = new EventEmitter<void>();

  tableColumns: HTTableColumn[] = [];
  dataSource: CrackerHashtypesDataSource;
  selectedFilterColumn: HTTableColumn;

  ngOnInit(): void {
    this.setColumnLabels(CrackerHashtypesTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new CrackerHashtypesDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setCrackerBinaryId(this.crackerBinaryId);
    this.setupFilterErrorSubscription(this.dataSource);
    this.setupContextMenu();
  }

  ngAfterViewInit(): void {
    this.dataSource.loadAll();
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: CrackerHashtypesTableCol.HASHTYPE,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        export: async (hashtype: JHashtype) => hashtype.id + ''
      },
      {
        id: CrackerHashtypesTableCol.DESCRIPTION,
        dataKey: 'description',
        isSortable: true,
        isSearchable: true,
        export: async (hashtype: JHashtype) => hashtype.description
      },
      {
        id: CrackerHashtypesTableCol.SALTED,
        dataKey: 'isSalted',
        icon: (hashtype: JHashtype) => this.renderCheckmarkIcon(hashtype, 'isSalted', 'Salted Hash'),
        isSortable: true,
        export: async (hashtype: JHashtype) => (hashtype.isSalted ? 'Yes' : 'No')
      },
      {
        id: CrackerHashtypesTableCol.SLOW_HASH,
        dataKey: 'isSlowHash',
        icon: (hashtype: JHashtype) => this.renderCheckmarkIcon(hashtype, 'isSlowHash', 'Slow Hash'),
        isSortable: true,
        export: async (hashtype: JHashtype) => (hashtype.isSlowHash ? 'Yes' : 'No')
      }
    ];
  }

  rowActionClicked(event: ActionMenuEvent<JHashtype>): void {
    if (event.menuItem.action === RowActionMenuAction.DELETE) {
      this.openDialog({
        rows: [event.data],
        title: 'Remove hashtype from cracker version',
        icon: 'warning',
        body: `Are you sure you want to remove hashtype ${event.data.id} (${event.data.description}) from this cracker version?`,
        warn: true,
        action: event.menuItem.action
      });
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JHashtype[]>): void {
    const hashtypes = event.data;
    this.openDialog({
      rows: hashtypes,
      title: `Remove ${hashtypes.length} hashtype${hashtypes.length > 1 ? 's' : ''} ...`,
      icon: 'warning',
      body: `Are you sure you want to remove the above hashtype${hashtypes.length > 1 ? 's' : ''} from this cracker version?`,
      warn: true,
      listAttribute: 'description',
      action: BulkActionMenuAction.DELETE
    });
  }

  exportActionClicked(event: ActionMenuEvent<JHashtype[]>): void {
    const visibleColumnIds = this.table.displayedColumns.map(Number);
    const visibleColumns = this.tableColumns.filter((col) => visibleColumnIds.includes(col.id));
    this.exportService.handleExportAction<JHashtype>(
      event,
      visibleColumns,
      CrackerHashtypesTableColumnLabel,
      'hashtopolis-cracker-hashtypes'
    );
  }

  /** Backend search on the selected column, an empty search clears the filter */
  handleBackendSqlFilter(input: string): void {
    if (input && input.trim().length > 0) {
      const selectedColumn = this.selectedFilterColumn;
      this.dataSource.loadAll({
        value: input,
        field: selectedColumn.dataKey ?? '',
        operator: FilterType.ICONTAINS,
        parent: selectedColumn.parent
      });
    } else {
      this.dataSource.clearFilter();
    }
  }

  /** Remove actions only for editable (generic) versions, hashcat versions are read-only */
  protected setupContextMenu(): void {
    if (this.editable) {
      this.contextMenuService = new CrackerHashtypesContextMenuService(this.permissionService).addContextMenu();
    }
  }

  /** Checkmark icon if the given boolean property of the hashtype is set (same as the hashtypes table) */
  private renderCheckmarkIcon(hashtype: JHashtype, property: keyof JHashtype, tooltip: string): HTTableIcon {
    if ((hashtype as unknown as DynamicModel)[property] === true) {
      return { name: 'check_circle', tooltip, cls: 'text-ok' };
    }
    return { name: '' };
  }

  private openDialog(data: DialogData<JHashtype>): void {
    const dialogRef = this.dialog.open(TableDialogComponent, {
      data: data,
      width: '450px'
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result) => {
        if (result && result.action) {
          this.removeHashtypes(result.data);
        }
      });
  }

  private removeHashtypes(hashtypes: JHashtype[]): void {
    const payload = { data: hashtypes.map((hashtype) => ({ type: 'hashType', id: hashtype.id })) };
    this.gs
      .deleteRelationships(SERV.CRACKERS, this.crackerBinaryId, RelationshipType.HASHTYPES, payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.alertService.showSuccessMessage(
            `Removed ${hashtypes.length} hashtype${hashtypes.length > 1 ? 's' : ''}`
          );
          this.hashtypesRemoved.emit();
          this.reload();
        },
        error: (error: unknown) => {
          // the global HTTP error dialog shows the reason
          console.error('Error while removing hashtypes from cracker version:', error);
          this.reload();
        }
      });
  }
}
