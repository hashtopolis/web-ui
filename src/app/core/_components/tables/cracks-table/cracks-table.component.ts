import { Observable, catchError, forkJoin, of } from 'rxjs';

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { BaseModel } from '@models/base.model';
import { JHash } from '@models/hash.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { CracksTableCol, CracksTableColumnLabel } from '@components/tables/cracks-table/cracks-table.constants';
import { HTTableColumn, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { CracksDataSource } from '@datasources/cracks.datasource';

import { HashListFormatLabel } from '@src/app/core/_constants/hashlist.config';
import { FilterType } from '@src/app/core/_models/request-params.model';
import { ShowTruncatedDataDialogComponent } from '@src/app/shared/dialog/show-truncated-data.dialog/show-truncated-data.dialog.component';
import { formatUnixTimestamp } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-cracks-table',
  templateUrl: './cracks-table.component.html',
  standalone: false
})
export class CracksTableComponent extends BaseTableComponent implements OnInit, OnDestroy, AfterViewInit {
  tableColumns: HTTableColumn[] = [];
  dataSource: CracksDataSource;
  selectedFilterColumn: HTTableColumn;
  ngOnInit(): void {
    this.setColumnLabels(CracksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new CracksDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
  }

  ngAfterViewInit(): void {
    // Wait until paginator is defined
    this.dataSource.loadAll().then(() => {});
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({ value: input, field: selectedColumn.dataKey, operator: FilterType.ICONTAINS, parent: selectedColumn.parent });
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
        id: CracksTableCol.FOUND,
        dataKey: 'timeCracked',
        render: (crack: JHash) => formatUnixTimestamp(crack.timeCracked, this.dateFormat),
        isSortable: true,
        export: async (crack: JHash) => formatUnixTimestamp(crack.timeCracked, this.dateFormat)
      },
      {
        id: CracksTableCol.PLAINTEXT,
        dataKey: 'plaintext',
        isSortable: true,
        isSearchable: true,
        render: (crack: JHash) => crack.plaintext,
        export: async (crack: JHash) => crack.plaintext
      },
      {
        id: CracksTableCol.HASH,
        dataKey: 'hash',
        isSortable: true,
        isSearchable: true,
        isCopy: true,
        truncate: (crack: JHash) => crack.hash.length > 40,
        render: (crack: JHash) => crack.hash,
        export: async (crack: JHash) => crack.hash
      },
      {
        id: CracksTableCol.AGENT,
        dataKey: 'agentId',
        isSortable: false,
        routerLink: (crack: JHash) => this.renderAgentLinkFromHash(crack),
        export: async (crack: JHash) => crack.chunk.agentId + ''
      },
      {
        id: CracksTableCol.TASK,
        dataKey: 'taskId',
        isSortable: false,
        routerLink: (crack: JHash) => this.renderTaskLinkFromHash(crack),
        export: async (crack: JHash) => crack.chunk.taskId + ''
      },
      {
        id: CracksTableCol.CHUNK,
        dataKey: 'chunkId',
        isSortable: true,
        routerLink: (crack: JHash) => this.renderChunkLinkFromHash(crack),
        export: async (crack: JHash) => crack.chunkId + ''
      },
      {
        id: CracksTableCol.TYPE,
        dataKey: 'hashlistId',
        isSortable: true,
        render: (crack: JHash) => (crack.hashlist ? HashListFormatLabel[crack.hashlist.format] : ''),
        export: async (crack: JHash) => (crack.hashlist ? HashListFormatLabel[crack.hashlist.format] : '')
      }
    ];
  }

  protected receiveCopyData(event: BaseModel) {
    if (this.clipboard.copy((event as JHash).hash)) {
      this.alertService.showSuccessMessage('Hash value successfully copied to clipboard.');
    } else {
      this.alertService.showErrorMessage('Could not copy hash value clipboard.');
    }
  }

  showTruncatedData(event: JHash) {
    this.dialog.open(ShowTruncatedDataDialogComponent, {
      data: {
        hashlistName: event.hashlist?.name,
        unTruncatedText: event.hash
      }
    });
  }

  openDialog(data: DialogData<JHash>) {
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
   * Render an edit link to a defined object from a given chunk contained in a hash
   * @param hash - the hash model to render the link for
   * @param relativePath - relative URL path fot the link
   * @param context - the context path of the link
   * @param modelIDKey - the parameter of the model ID based on the hashes chunk model
   * @private
   */
  private renderEditLinkFromHash(hash: JHash, relativePath: string, context: string, modelIDKey: string) {
    const links: HTTableRouterLink[] = [];
    if (hash) {
      const chunk = hash.chunk;
      if (chunk) {
        const modelID = chunk[modelIDKey];
        links.push({
          routerLink: [relativePath, context, modelID, 'edit'],
          label: modelID
        });
      }
    }
    return of(links);
  }

  /**
   * Render edit link to agent for a given hash model
   * @param hash - the hash model to render the link for
   * @return observable containing an array of router links to be rendered in HTML
   * @private
   */
  private renderAgentLinkFromHash(hash: JHash): Observable<HTTableRouterLink[]> {
    return this.renderEditLinkFromHash(hash, '/agents', 'show-agents', 'agentId');
  }

  /**
   * Render edit link to task for a given hash model
   * @param hash - the hash model to render the link for
   * @return observable containing an array of router links to be rendered in HTML
   * @private
   */
  private renderTaskLinkFromHash(hash: JHash): Observable<HTTableRouterLink[]> {
    return this.renderEditLinkFromHash(hash, '/tasks', 'show-tasks', 'taskId');
  }

  /**
   * Render chunk link to be displayed in HTML code
   * @param crack - cracked hash object to render router link for
   * @return observable object containing a router link array
   */
  private renderChunkLinkFromHash(crack: JHash): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (crack) {
      links.push({
        routerLink: ['/tasks', 'chunks', crack.chunkId, 'view'],
        label: crack.chunkId
      });
    }
    return of(links);
  }

  // --- Action functions ---
  exportActionClicked(event: ActionMenuEvent<JHash[]>): void {
    this.exportService.handleExportAction<JHash>(
      event,
      this.tableColumns,
      CracksTableColumnLabel,
      'hashtopolis-cracks'
    );
  }

  rowActionClicked(event: ActionMenuEvent<JHash>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting crack ${event.data.id} ...`,
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

  bulkActionClicked(event: ActionMenuEvent<JHash[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} cracks ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above cracks? Note that this action cannot be undone.`,
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
  private bulkActionDelete(cracks: JHash[]): void {
    const requests = cracks.map((crack: JHash) => {
      return this.gs.delete(SERV.CRACKERS_TYPES, crack.id);
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
          this.alertService.showSuccessMessage(`Successfully deleted ${results.length} cracks!`);
          this.reload();
        })
    );
  }

  /**
   * @todo Implement error handling.
   */
  private rowActionDelete(cracks: JHash[]): void {
    this.subscriptions.push(
      this.gs
        .delete(SERV.CRACKERS_TYPES, cracks[0].id)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage('Successfully deleted crack!');
          this.reload();
        })
    );
  }

  private rowActionEdit(crack: JHash): void {
    this.router.navigate(['/config', 'engine', 'cracks', crack.id, 'edit']);
  }
}
