/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { File, FileType } from 'src/app/core/_models/file.model';
import { HTTableColumn, HTTableIcon } from '../ht-table/ht-table.models';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { FilesDataSource } from 'src/app/core/_datasources/files.datasource';
import { FilesTableColumnLabel } from './files-table.constants';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { formatFileSize } from 'src/app/shared/utils/util';

@Component({
  selector: 'files-table',
  templateUrl: './files-table.component.html'
})
export class FilesTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() fileType: FileType = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: FilesDataSource;
  editPath = '';

  ngOnInit(): void {
    this.editPath =
      this.fileType === FileType.WORDLIST ? 'wordlist-edit' : 'rules-edit';

    this.tableColumns = this.getColumns();
    this.dataSource = new FilesDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setFileType(this.fileType);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: File, filterValue: string): boolean {
    if (item.filename.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        name: FilesTableColumnLabel.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (file: File) => file._id + ''
      },
      {
        name: FilesTableColumnLabel.NAME,
        dataKey: 'filename',
        icons: (file: File) => this.renderSecretIcon(file),
        routerLink: (file: File) => [
          {
            routerLink: ['/files', file._id, this.editPath]
          }
        ],
        isSortable: true,
        export: async (file: File) => file.filename
      },
      {
        name: FilesTableColumnLabel.SIZE,
        dataKey: 'size',
        render: (file: File) => formatFileSize(file.size, 'short'),
        isSortable: true,
        export: async (file: File) => formatFileSize(file.size, 'short')
      },
      {
        name: FilesTableColumnLabel.LINE_COUNT,
        dataKey: 'lineCount',
        isSortable: true,
        export: async (file: File) => file.lineCount + ''
      },
      {
        name: FilesTableColumnLabel.ACCESS_GROUP,
        dataKey: 'accessGroupName',
        isSortable: true,
        export: async (file: File) => file.accessGroupName
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<File>) {
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

  @Cacheable(['_id', 'isSecret'])
  async renderSecretIcon(file: File): Promise<HTTableIcon[]> {
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

  exportActionClicked(event: ActionMenuEvent<File[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<File>(
          'hashtopolis-files',
          this.tableColumns,
          event.data
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<File>(
          'hashtopolis-files',
          this.tableColumns,
          event.data
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<File>(this.tableColumns, event.data)
          .then(() => {
            this.snackBar.open(
              'The selected rows are copied to the clipboard',
              'Close'
            );
          });
        break;
    }
  }

  rowActionClicked(event: ActionMenuEvent<File>): void {
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

  bulkActionClicked(event: ActionMenuEvent<File[]>): void {
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

  /**
   * @todo Implement error handling.
   */
  private bulkActionDelete(files: File[]): void {
    const requests = files.map((file: File) => {
      return this.gs.delete(SERV.HASHLISTS, file._id);
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
  private rowActionDelete(files: File[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.HASHLISTS, files[0]._id)
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

  private rowActionEdit(file: File): void {
    this.router.navigate(['/files', file._id, this.editPath]);
  }
}
