/**
 * Contains table component for files
 * @module
 */

/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileType, JFile } from 'src/app/core/_models/file.model';
import { FilesTableCol, FilesTableColumnLabel } from './files-table.constants';
import { HTTableColumn, HTTableIcon, HTTableRouterLink } from '../ht-table/ht-table.models';
import { catchError, forkJoin } from 'rxjs';
import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { FilesDataSource } from 'src/app/core/_datasources/files.datasource';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { formatFileSize } from 'src/app/shared/utils/util';

@Component({
  selector: 'files-table',
  templateUrl: './files-table.component.html'
})
export class FilesTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() fileType: FileType = 0;
  @Input() editIndex?: number;
  @Input() editType?: number; //0 Task 1 Pretask

  tableColumns: HTTableColumn[] = [];
  dataSource: FilesDataSource;
  editPath = '';

  ngOnInit(): void {
    this.editPath = this.fileType === FileType.WORDLIST ? 'wordlist-edit' : 'rules-edit';
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
  filter(file: JFile, filterValue: string): boolean {
    if (file.filename.toLowerCase().includes(filterValue)) {
      return true;
    }
    return false;
  }

  /**
   * Get all table columns
   * @returns List of table columns
   */
  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: FilesTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (file: JFile) => file.id + ''
      },
      {
        id: FilesTableCol.NAME,
        dataKey: 'filename',
        icons: (file: JFile) => this.renderSecretIcon(file),
        routerLink: (file: JFile) => this.renderFileLink(file),
        isSortable: true,
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
        render: (file: JFile) => file.lineCount,
        export: async (file: JFile) => file.lineCount + ''
      },
      {
        id: FilesTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupName',
        isSortable: true,
        render: (file: JFile) => (file.accessGroup.groupName ? file.accessGroup.groupName : file.id),
        export: async (file: JFile) => file.accessGroup.groupName
      }
    ];
    return tableColumns;
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

  // --- Render functions ---
  @Cacheable(['id', 'isSecret'])
  async renderSecretIcon(file: JFile): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    if (file.isSecret) {
      icons.push({
        name: 'lock',
        tooltip: 'Secret'
      });
    }
    return icons;
  }

  // --- Action functions ---
  exportActionClicked(event: ActionMenuEvent<JFile[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JFile>(
          'hashtopolis-files',
          this.tableColumns,
          event.data,
          FilesTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JFile>(
          'hashtopolis-files',
          this.tableColumns,
          event.data,
          FilesTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<JFile>(
            this.tableColumns,
            event.data,
            FilesTableColumnLabel
          )
          .then(() => {
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
    const requests = files.map((file: JFile) => {
      return this.gs.delete(SERV.FILES, file.id);
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
            `Successfully deleted ${results.length} files!`,
            'Close'
          );
          this.reload();
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

  @Cacheable(['id', 'fileType'])
  async renderFileLink(file: JFile): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: ['/files', file.id, this.editPath],
        label: file['filename']
      }
    ];
  }

  private rowActionEdit(file: JFile): void {
    this.renderFileLink(file).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
