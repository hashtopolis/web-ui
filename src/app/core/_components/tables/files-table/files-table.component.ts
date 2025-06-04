import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileType, JFile } from '@models/file.model';
import { FilesTableCol, FilesTableColumnLabel } from '@components/tables/files-table/files-table.constants';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { Observable, catchError, of } from 'rxjs';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { FilesDataSource } from '@datasources/files.datasource';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { SERV } from '@services/main.config';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
/**
 * Contains table component for files
 * @module
 */
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { formatFileSize } from '@src/app/shared/utils/util';

@Component({
  selector: 'app-files-table',
  templateUrl: './files-table.component.html',
  standalone: false
})
export class FilesTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() fileType: FileType = 0;
  @Input() editIndex?: number;
  @Input() editType?: number; //0 Task 1 Pretask

  tableColumns: HTTableColumn[] = [];
  dataSource: FilesDataSource;
  editPath = '';
  selectedFilterColumn: string = 'all';
  ngOnInit(): void {
    const pathMap = {
      [FileType.WORDLIST]: 'wordlist-edit',
      [FileType.RULES]: 'rules-edit',
      [FileType.OTHER]: 'other-edit'
    };
    this.editPath = pathMap[this.fileType];

    this.setColumnLabels(FilesTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new FilesDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setFileType(this.fileType);
    if (this.editIndex) {
      this.dataSource.setEditValues(this.editIndex, this.editType);
    }
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  /**
   * Filter function for files
   * @param file File object
   * @param filterValue String value to filter filename
   * @returns True, if filename contains filterValue
   *          False, if not
   */
  filter(item: JFile, filterValue: string): boolean {
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;
    // Filter based on selected column
    switch (selectedColumn) {
      case 'all': {
        // Search across multiple relevant fields
        return (
          item.id.toString().includes(filterValue) ||
          item.filename?.toLowerCase().includes(filterValue) ||
          item.accessGroup?.groupName?.toLowerCase().includes(filterValue)
        );
      }
      case 'id': {
        return item.id?.toString().includes(filterValue);
      }
      case 'filename': {
        return item.filename?.toLowerCase().includes(filterValue);
      }
      case 'accessGroupName': {
        return item.accessGroup?.groupName?.toLowerCase().includes(filterValue);
      }
      default:
        // Default fallback to task name
        return item.filename?.toLowerCase().includes(filterValue);
    }
  }
  /**
   * Get all table columns
   * @returns List of table columns
   */
  getColumns(): HTTableColumn[] {
    return [
      {
        id: FilesTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
        export: async (file: JFile) => file.id + ''
      },
      {
        id: FilesTableCol.NAME,
        dataKey: 'filename',
        routerLink: (file: JFile) => this.renderFileLink(file),
        isSortable: true,
        isSearchable: true,
        export: async (file: JFile) => file.filename
      },
      {
        id: FilesTableCol.SIZE,
        dataKey: 'size',
        render: (file: JFile) => formatFileSize(file.size, 'short'),
        isSortable: true,
        export: async (file: JFile) => formatFileSize(file.size, 'short')
      },
      {
        id: FilesTableCol.LINE_COUNT,
        dataKey: 'lineCount',
        isSortable: true,
        render: (file: JFile) => file.lineCount.toLocaleString(),
        export: async (file: JFile) => file.lineCount + ''
      },
      {
        id: FilesTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupName',
        isSortable: true,
        isSearchable: true,
        render: (file: JFile) => (file.accessGroup?.groupName ? file.accessGroup.groupName : file.id),
        export: async (file: JFile) => file.accessGroup?.groupName
      }
    ];
  }

  /**
   * Opens dialog
   * @param data Dialog data
   */
  openDialog(data: DialogData<JFile>) {
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
  exportActionClicked(event: ActionMenuEvent<JFile[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JFile>('hashtopolis-files', this.tableColumns, event.data, FilesTableColumnLabel);
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JFile>('hashtopolis-files', this.tableColumns, event.data, FilesTableColumnLabel);
        break;
      case ExportMenuAction.COPY:
        this.exportService.toClipboard<JFile>(this.tableColumns, event.data, FilesTableColumnLabel).then(() => {
          this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
        });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<JFile>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting file ${event.data.filename} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<JFile[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} files ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above files? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'filename',
          action: event.menuItem.action
        });
        break;
    }
  }

  private bulkActionDelete(files: JFile[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.FILES, files)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(`Successfully deleted files!`, 'Close');
          this.dataSource.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(files: JFile[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.FILES, files[0].id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted file!', 'Close');
          this.reload();
        })
    );
  }

  /**
   * Render file link
   * @param file - file object to render link for
   * @return observable object containing a router link array
   */
  private renderFileLink(file: JFile): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (file) {
      links.push({
        routerLink: ['/files', file.id, this.editPath],
        label: file['filename'],
        icon: {
          faIcon: file.isSecret ? faKey : undefined,
          tooltip: file.isSecret ? 'Secret file' : ''
        }
      });
    }
    return of(links);
  }

  private rowActionEdit(file: JFile): void {
    this.renderFileLink(file).subscribe((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink).then(() => {});
    });
  }
}
