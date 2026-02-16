import { Observable, catchError, of } from 'rxjs';

import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { JPretask } from '@models/pretask.model';

import { PreTaskContextMenuService } from '@services/context-menu/tasks/pretask-menu.service';
import { RelationshipType, SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import {
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '@components/tables/ht-table/ht-table.models';
import {
  PretasksTableCol,
  PretasksTableColumnLabel,
  PretasksTableEditableAction
} from '@components/tables/pretasks-table/pretasks-table.constants';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';

import { PreTasksDataSource } from '@datasources/preconfigured-tasks.datasource';

import { FilterType } from '@src/app/core/_models/request-params.model';
import { calculateKeyspace } from '@src/app/shared/utils/estkeyspace_attack';
import { formatFileSize } from '@src/app/shared/utils/util';

export interface AttackOptions {
  attackType: number;
  ruleFiles: string[];
  posArgs: string[];
  unrecognizedFlag: string[];
}

declare let options: AttackOptions;
declare let defaultOptions: AttackOptions;

@Component({
  selector: 'app-pretasks-table',
  templateUrl: './pretasks-table.component.html',
  standalone: false
})
export class PretasksTableComponent extends BaseTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private _supertTaskId: number;
  private _reverseQuery = false;
  private _unassignOption = false;
  isDetail = false;

  // Input property to specify a supertask ID for filtering pretasks.
  @Input()
  set supertTaskId(value: number) {
    if (value !== this._supertTaskId) {
      this._supertTaskId = value;
    }
  }
  get supertTaskId(): number {
    if (this._supertTaskId === undefined) {
      return 0;
    } else {
      return this._supertTaskId;
    }
  }

  // Input property to specify if the query should be reversed (Return all pretasks NOT in current supertask).
  @Input()
  set reverseQuery(value: boolean) {
    if (value !== this._reverseQuery) {
      this._reverseQuery = value;
    }
  }
  get reverseQuery(): boolean {
    return this._reverseQuery;
  }

  @Input()
  set unassignOption(value: boolean) {
    if (value !== this._unassignOption) {
      this._unassignOption = value;
    }
  }
  get unassignOption(): boolean {
    return this._unassignOption;
  }

  /**
   * Determines if the row/bulk delete action should perform deletion of the pretask or unassignment from the supertask
   */
  get isDelete(): boolean {
    return !this.unassignOption;
  }

  // Estimate runtime attack
  @Input() benchmarkA0 = 0;
  @Input() benchmarkA3 = 0;

  @Output() pretasksChanged = new EventEmitter<void>();

  /**
   * Emitted when user requests to add one or multiple pretasks to a supertask.
   * Parent component should handle the API call and UI refresh.
   */
  @Output() pretaskAdd = new EventEmitter<JPretask[]>();

  tableColumns: HTTableColumn[] = [];
  dataSource: PreTasksDataSource;
  selectedFilterColumn: HTTableColumn;
  ngOnInit(): void {
    this.setColumnLabels(PretasksTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new PreTasksDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    if (this.supertTaskId) {
      this.isDetail = true;
      this.dataSource.setSuperTaskId(this.supertTaskId);
      this.dataSource.setReverseQuery(this.reverseQuery);
    }
    this.contextMenuService = new PreTaskContextMenuService(
      this.permissionService,
      this._reverseQuery,
      this._unassignOption
    ).addContextMenu();
    this.setupFilterErrorSubscription(this.dataSource);
  }

  ngAfterViewInit(): void {
    // Wait until paginator is defined
    void this.dataSource.loadAll();
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
      void this.dataSource.loadAll(); // Reload all data if input is empty
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
    const tableColumns: HTTableColumn[] = [
      {
        id: PretasksTableCol.ID,
        dataKey: 'pretaskId',
        isSortable: true,
        isSearchable: true,
        render: (pretask: JPretask) => pretask.id,
        export: async (pretask: JPretask) => pretask.id + ''
      },
      {
        id: PretasksTableCol.NAME,
        dataKey: 'taskName',
        routerLink: (pretask: JPretask) => this.renderPretaskLink(pretask),
        isSortable: true,
        isSearchable: true,
        export: async (pretask: JPretask) => pretask.taskName
      },
      {
        id: PretasksTableCol.ATTACK_COMMAND,
        dataKey: 'attackCmd',
        isSortable: true,
        isSearchable: true,
        export: async (pretask: JPretask) => pretask.attackCmd
      },
      {
        id: PretasksTableCol.FILES_TOTAL,
        dataKey: 'filesTotal',
        isSortable: false,
        icon: (pretask: JPretask) => this.renderSecretIcon(pretask),
        render: (pretask: JPretask) => pretask.pretaskFiles?.length,
        export: async (pretask: JPretask) => pretask.pretaskFiles?.length.toString()
      },
      {
        id: PretasksTableCol.FILES_SIZE,
        dataKey: 'pretaskFiles',
        isSortable: false,
        render: (pretask: JPretask) => {
          if (pretask.pretaskFiles) {
            const totalFileSize = pretask.pretaskFiles?.reduce((sum, file) => {
              if (file && typeof file.size === 'number' && !isNaN(file.size)) {
                return sum + file.size;
              } else {
                return sum;
              }
            }, 0);
            return formatFileSize(totalFileSize, 'short');
          } else {
            return '';
          }
        },
        export: async (pretask: JPretask) => {
          const totalFileSize = pretask.pretaskFiles?.reduce((sum, file) => {
            if (file && typeof file.size === 'number' && !isNaN(file.size)) {
              return sum + file.size;
            } else {
              return sum;
            }
          }, 0);
          return formatFileSize(totalFileSize, 'short');
        }
      }
    ];

    if (this.preconfiguredTasksRoleService.hasRole('update')) {
      tableColumns.push(
        {
          id: PretasksTableCol.PRIORITY,
          dataKey: 'priority',
          editable: (pretask: JPretask) => {
            return {
              data: pretask,
              value: pretask.priority + '',
              action: PretasksTableEditableAction.CHANGE_PRIORITY
            };
          },
          isSortable: true,
          export: async (pretask: JPretask) => pretask.priority.toString()
        },
        {
          id: PretasksTableCol.MAX_AGENTS,
          dataKey: 'maxAgents',
          editable: (pretask: JPretask) => {
            return {
              data: pretask,
              value: pretask.maxAgents + '',
              action: PretasksTableEditableAction.CHANGE_MAX_AGENTS
            };
          },
          isSortable: true,
          export: async (pretask: JPretask) => pretask.maxAgents.toString()
        }
      );
    } else {
      tableColumns.push(
        {
          id: PretasksTableCol.PRIORITY,
          dataKey: 'priority',
          render: (pretask: JPretask) => pretask.priority + '',
          isSortable: true,
          export: async (pretask: JPretask) => pretask.priority + ''
        },
        {
          id: PretasksTableCol.MAX_AGENTS,
          dataKey: 'maxAgents',
          render: (pretask: JPretask) => pretask.maxAgents + '',
          isSortable: true,
          export: async (pretask: JPretask) => pretask.maxAgents + ''
        }
      );
    }

    if (this.supertTaskId !== 0) {
      tableColumns.push({
        id: PretasksTableCol.ESTIMATED_KEYSPACE,
        dataKey: 'keyspaceSize',
        render: (pretask: JPretask) => this.renderEstimatedKeyspace(pretask),
        isSortable: false,
        export: async (pretask: JPretask) => Promise.resolve(this.renderEstimatedKeyspace(pretask).toString())
      });
      tableColumns.push({
        id: PretasksTableCol.ATTACK_RUNTIME,
        dataKey: 'keyspaceTime',
        isSortable: false,
        render: () => this.renderKeyspaceTime(this.benchmarkA0, this.benchmarkA3)
      });
    }

    return tableColumns;
  }

  openDialog(data: DialogData<JPretask>) {
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

  // --- Action handler ---
  /**
   * Handler for export action menu clicks.
   * @param event ActionMenuEvent containing selected menu item and data (list of pretasks)
   */
  exportActionClicked(event: ActionMenuEvent<JPretask[]>): void {
    this.exportService.handleExportAction<JPretask>(
      event,
      this.tableColumns,
      PretasksTableColumnLabel,
      'hashtopolis-pretasks'
    );
  }

  /**
   * Handler for row action menu clicks.
   * @param event ActionMenuEvent containing selected menu item and data (pretask)
   */
  rowActionClicked(event: ActionMenuEvent<JPretask>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.ADD:
        this.rowActionAddToSupertask(event.data);

        break;
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.COPY_TO_TASK:
        this.rowActionCopyToTask(event.data);
        break;
      case RowActionMenuAction.COPY_TO_PRETASK:
        this.rowActionCopyToPretask(event.data);
        break;
      case RowActionMenuAction.DELETE: {
        this.openDialog({
          rows: [event.data],
          title: `${
            this.isDelete
              ? `Deleting Pretask ${event.data.taskName} ...`
              : `Unassigning Pretask ${event.data.taskName} ...`
          }`,
          icon: 'warning',
          body: `Are you sure you want to ${
            this.isDelete ? `delete it? Note that this action cannot be undone.` : `unassign it from the supertask?`
          }`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      }
    }
  }

  /**
   * Handler for bulk action menu clicks.
   * @param event ActionMenuEvent containing selected menu item and data (list of pretasks)
   */
  bulkActionClicked(event: ActionMenuEvent<JPretask[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.ADD:
        this.bulkActionAddToSupertask(event.data);
        break;
      case BulkActionMenuAction.DELETE: {
        this.openDialog({
          rows: event.data,
          title: `${
            this.isDelete
              ? `Deleting ${event.data.length} pretasks ...`
              : `Unassigning ${event.data.length} pretasks ...`
          }`,
          icon: 'warning',
          body: `${
            this.isDelete
              ? `Are you sure you want to delete them? Note that this action cannot be undone.`
              : `Are you sure you want to unassign them from the supertask?`
          }`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      }
    }
  }

  /**
   * Bulk add to supertask action, handled by parent edit-supertasks.component.ts to be able to refresh both pretask
   * tables after adding the pretasks
   * @param pretasks List of pretasks to add to supertask
   * @private
   */
  private bulkActionAddToSupertask(pretasks: JPretask[]): void {
    this.pretaskAdd.emit(pretasks);
  }

  /**
   * Bulk delete action
   * @param pretasks List of pretasks to delete
   * @private
   */
  private bulkActionDelete(pretasks: JPretask[]): void {
    if (this.isDelete) {
      this.subscriptions.push(
        this.gs
          .bulkDelete(SERV.PRETASKS, pretasks)
          .pipe(
            catchError((error) => {
              console.error('Error during deletion: ', error);
              return of([]);
            })
          )
          .subscribe(() => {
            this.alertService.showSuccessMessage(`Successfully deleted ${pretasks.length} pretasks!`);
            this.pretasksChanged.emit();
          })
      );
    } else {
      const pretaskData = pretasks.map((pretask) => ({ type: RelationshipType.PRETASKS, id: pretask.id }));
      const responseBody = { data: pretaskData };

      this.subscriptions.push(
        this.gs
          .deleteRelationships(SERV.SUPER_TASKS, this.supertTaskId, RelationshipType.PRETASKS, responseBody)
          .pipe(
            catchError((error) => {
              console.error('Error during deletion:', error);
              return of([]);
            })
          )
          .subscribe(() => {
            this.alertService.showSuccessMessage(`Successfully unassigned ${pretasks.length} pretasks!`);
            this.pretasksChanged.emit();
          })
      );
    }
  }

  override renderSecretIcon(pretask: JPretask): HTTableIcon {
    if (pretask.pretaskFiles) {
      const secretFilesCount = pretask.pretaskFiles.reduce((sum, file) => sum + (file.isSecret ? 1 : 0), 0);
      if (secretFilesCount > 0) {
        return {
          name: 'lock',
          tooltip: `Secret: ${secretFilesCount} ${secretFilesCount > 1 ? 'files' : 'file'}`
        };
      }
      return { name: '' };
    } else {
      return { name: '' };
    }
  }

  private renderPretaskLink(pretask: JPretask): Observable<HTTableRouterLink[]> {
    return of([
      {
        routerLink: ['/tasks/preconfigured-tasks', pretask.id, 'edit']
      }
    ]);
  }

  renderEstimatedKeyspace(pretask: JPretask): SafeHtml {
    const keyspace = calculateKeyspace(pretask.pretaskFiles, 'lineCount', pretask.attackCmd, false);
    if (keyspace === null) {
      return '';
    } else {
      return keyspace.toLocaleString();
    }
  }

  renderKeyspaceTime(a0: number, a3: number): SafeHtml {
    return this.calculateKeyspaceTime(a0, a3);
  }

  /**
   * Inline Editing
   */

  editableSaved(editable: HTTableEditable<JPretask>): void {
    switch (editable.action) {
      case PretasksTableEditableAction.CHANGE_PRIORITY:
        this.changePriority(editable.data, editable.value);
        break;
      case PretasksTableEditableAction.CHANGE_MAX_AGENTS:
        this.changeMaxAgents(editable.data, editable.value);
        break;
    }
  }

  private changePriority(pretask: JPretask, priority: string): void {
    let val = 0;
    try {
      val = parseInt(priority);
    } catch (error) {
      console.error(error);
    }

    if (!val || pretask.priority == val) {
      this.alertService.showInfoMessage('Nothing changed');
      return;
    }

    const request$ = this.gs.update(SERV.PRETASKS, pretask.id, {
      priority: val
    });
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.alertService.showErrorMessage(`Failed to update prio!`);
            console.error('Failed to update prio:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Changed prio to ${val} on Task #${pretask.id}!`);
          this.reload();
        })
    );
  }

  private changeMaxAgents(pretask: JPretask, max: string): void {
    let val = 0;
    try {
      val = parseInt(max);
    } catch (error) {
      console.error(error);
    }

    if (!val || pretask.maxAgents == val) {
      this.alertService.showInfoMessage('Nothing changed');
      return;
    }

    const request$ = this.gs.update(SERV.PRETASKS, pretask.id, {
      maxAgents: val
    });
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.alertService.showErrorMessage(`Failed to update max agents!`);
            console.error('Failed to update max agents:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Changed number of max agents to ${val} on Task #${pretask.id}!`);
          this.reload();
        })
    );
  }

  /**
   * Row delete action
   * @param pretasks pretask to delete
   * @private
   */
  private rowActionDelete(pretasks: JPretask[]): void {
    if (this.isDelete) {
      this.subscriptions.push(
        this.gs
          .delete(SERV.PRETASKS, pretasks[0].id)
          .pipe(
            catchError((error) => {
              console.error('Error during deletion:', error);
              return [];
            })
          )
          .subscribe(() => {
            this.alertService.showSuccessMessage('Successfully deleted pretask!');
            this.pretasksChanged.emit();
          })
      );
    } else {
      const responseBody = { data: [{ type: RelationshipType.PRETASKS, id: pretasks[0].id }] };

      this.subscriptions.push(
        this.gs
          .deleteRelationships(SERV.SUPER_TASKS, this.supertTaskId, RelationshipType.PRETASKS, responseBody)
          .pipe(
            catchError((error) => {
              console.error('Error during unassigning:', error);
              return [];
            })
          )
          .subscribe(() => {
            this.alertService.showSuccessMessage('Successfully unassigned pretask!');
            this.pretasksChanged.emit();
          })
      );
    }
  }

  /**
   * Row add to supertask action, handled by parent edit-supertasks.component.ts to be able to refresh both pretask
   * tables after adding the pretask
   * @param pretask Pretask to add to supertask
   * @private
   */
  private rowActionAddToSupertask(pretask: JPretask) {
    this.pretaskAdd.emit([pretask]);
  }

  private rowActionCopyToTask(pretask: JPretask): void {
    void this.router.navigate(['/tasks/new-tasks', pretask.id, 'copypretask']);
  }

  private rowActionCopyToPretask(pretask: JPretask): void {
    void this.router.navigate(['/tasks/preconfigured-tasks', pretask.id, 'copy']);
  }

  private rowActionEdit(pretask: JPretask): void {
    this.renderPretaskLink(pretask)
      .subscribe((links: HTTableRouterLink[]) => {
        this.router.navigate(links[0].routerLink).then(() => {});
      })
      .unsubscribe();
  }

  calculateKeyspaceTime(a0: number, a3: number): string {
    if (a0 !== 0 && a3 !== 0) {
      let totalSecondsSupertask = 0;
      let unknown_runtime_included = 0;
      const benchmarka0 = a0;
      const benchmarka3 = a3;

      // Iterate over each task in the supertask
      $('.taskInSuper').each(function () {
        // Extract keyspace size from the table cell
        const keyspace_size = $(this).find('td:nth-child(4)').text();
        let seconds = null;
        let runtime: string;

        // Set default options for the attack
        options = defaultOptions;
        options.ruleFiles = [];
        options.posArgs = [];
        options.unrecognizedFlag = [];

        // Check if keyspace size is available
        if (keyspace_size === null || !keyspace_size) {
          unknown_runtime_included = 1;
        } else if (options.attackType === 3) {
          // Calculate seconds based on benchmarka3 for attackType 3
          seconds = Math.floor(Number(keyspace_size) / Number(benchmarka3));
        } else if (options.attackType === 0) {
          // Calculate seconds based on benchmarka0 for attackType 0
          seconds = Math.floor(Number(keyspace_size) / Number(benchmarka0));
        }

        // Convert seconds to human-readable runtime format
        if (Number.isInteger(seconds)) {
          totalSecondsSupertask += seconds;
          const days = Math.floor(seconds / (3600 * 24));
          seconds -= days * 3600 * 24;
          const hrs = Math.floor(seconds / 3600);
          seconds -= hrs * 3600;
          const mins = Math.floor(seconds / 60);
          seconds -= mins * 60;

          runtime = days + 'd, ' + hrs + 'h, ' + mins + 'm, ' + seconds + 's';
        } else {
          unknown_runtime_included = 1;
          runtime = 'Unknown';
        }

        // Update the HTML content with the calculated runtime
        $(this).find('td:nth-child(5)').html(runtime);
      });

      // Reduce total runtime to a human-readable format
      let seconds = totalSecondsSupertask;
      const days = Math.floor(seconds / (3600 * 24));
      seconds -= days * 3600 * 24;
      const hrs = Math.floor(seconds / 3600);
      seconds -= hrs * 3600;
      const mins = Math.floor(seconds / 60);
      seconds -= mins * 60;

      let totalRuntimeSupertask = days + 'd, ' + hrs + 'h, ' + mins + 'm, ' + seconds + 's';

      // Append additional information if unknown runtime is included
      if (unknown_runtime_included === 1) {
        totalRuntimeSupertask += ', plus additional unknown runtime';
      }
      return totalRuntimeSupertask;
    }
    return '';
  }
}
