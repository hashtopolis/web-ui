/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FileData, FileType } from 'src/app/core/_models/file.model';
import { FilesTableCol, FilesTableColumnLabel } from './files-table.constants';
import {
  HTTableColumn,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
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
export class FilesTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() fileType: FileType = 0;
  @Input() editIndex?: number;
  @Input() editType?: number; //0 Task 1 Pretask

  tableColumns: HTTableColumn[] = [];
  dataSource: FilesDataSource;
  editPath = '';

  ngOnInit(): void {
    this.editPath =
      this.fileType === FileType.WORDLIST ? 'wordlist-edit' : 'rules-edit';
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

  filter(item: FileData, filterValue: string): boolean {
    if (item.attributes.filename.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: FilesTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (file: FileData) => file.id + ''
      },
      {
        id: FilesTableCol.NAME,
        dataKey: 'filename',
        icons: (file: FileData) => this.renderSecretIcon(file),
        routerLink: (file: FileData) => this.renderFileLink(file),
        isSortable: true,
        export: async (file: FileData) => file.attributes.filename
      },
      {
        id: FilesTableCol.SIZE,
        dataKey: 'size',
        render: (file: FileData) => formatFileSize(file.attributes.size, 'short'),
        isSortable: true,
        export: async (file: FileData) => formatFileSize(file.attributes.size, 'short')
      },
      {
        id: FilesTableCol.LINE_COUNT,
        dataKey: 'lineCount',
        isSortable: true,
        render: (file: FileData) => file.attributes.lineCount,
        export: async (file: FileData) => file.attributes.lineCount + ''
      },
      {
        id: FilesTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupName',
        isSortable: true,
        render: (file: FileData) =>
          file.attributes.accessGroup.groupName ? file.attributes.accessGroup.groupName : file.id,
        export: async (file: FileData) => file.attributes.accessGroup.groupName
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<FileData>) {
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
  async renderSecretIcon(file: FileData): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    if (file.attributes.isSecret) {
      icons.push({
        name: 'lock',
        tooltip: 'Secret'
      });
    }

    return icons;
  }

  // --- Action functions ---

  exportActionClicked(event: ActionMenuEvent<FileData[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<FileData>(
          'hashtopolis-files',
          this.tableColumns,
          event.data,
          FilesTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<FileData>(
          'hashtopolis-files',
          this.tableColumns,
          event.data,
          FilesTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<FileData>(
            this.tableColumns,
            event.data,
            FilesTableColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<FileData>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting file ${event.data.attributes.filename} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<FileData[]>): void {
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

  private bulkActionDelete(files: FileData[]): void {
    const requests = files.map((file: FileData) => {
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
  private rowActionDelete(files: FileData[]): void {
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
  async renderFileLink(file: FileData): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: ['/files', file.id, this.editPath],
        label: file['attributes']['filename']
      }
    ];
  }

  private rowActionEdit(file: FileData): void {
    this.renderFileLink(file).then((links: HTTableRouterLink[]) => {
      this.router.navigate(links[0].routerLink);
    });
  }
}
