/* eslint-disable @angular-eslint/component-selector */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
  TasksSupertasksDataSourceTableCol,
  TasksSupertasksDataSourceTableColumnLabel,
  TasksSupertasksDataSourceTableEditableAction
} from './tasks-supertasks-table.constants';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { Pretask } from 'src/app/core/_models/pretask.model';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SafeHtml } from '@angular/platform-browser';
import { SERV } from 'src/app/core/_services/main.config';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { TasksSupertasksDataSource } from 'src/app/core/_datasources/tasks-supertasks.datasource';
import { SuperTask } from 'src/app/core/_models/supertask.model';
import { TaskWrapper } from 'src/app/core/_models/task-wrapper.model';
import { ChunkData } from 'src/app/core/_models/chunk.model';
import { Task } from 'src/app/core/_models/task.model';

@Component({
  selector: 'tasks-supertasks-table',
  templateUrl: './tasks-supertasks-table.component.html'
})
export class TasksSupertasksTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  @Input() supertaskId = 0;

  tableColumns: HTTableColumn[] = [];
  dataSource: TasksSupertasksDataSource;
  chunkData: { [key: number]: ChunkData } = {};
  private chunkDataLock: { [key: string]: Promise<void> } = {};

  ngOnInit(): void {
    this.setColumnLabels(TasksSupertasksDataSourceTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new TasksSupertasksDataSource(
      this.cdr,
      this.gs,
      this.uiService
    );
    this.dataSource.setColumns(this.tableColumns);
    if (this.supertaskId) {
      this.dataSource.setSuperTaskId(this.supertaskId);
    }
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: TaskWrapper, filterValue: string): boolean {
    return item.taskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: TasksSupertasksDataSourceTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (wrapper: TaskWrapper) => wrapper._id + ''
      },
      {
        id: TasksSupertasksDataSourceTableCol.NAME,
        dataKey: 'taskName',
        routerLink: (wrapper: TaskWrapper) => this.renderTaskLink(wrapper),
        isSortable: true,
        export: async (wrapper: TaskWrapper) => wrapper.taskName + ''
      },
      {
        id: TasksSupertasksDataSourceTableCol.DISPATCHED_SEARCHED,
        dataKey: 'clientSignature',
        async: (task: Task) => this.renderDispatchedSearched(task),
        isSortable: true
      },
      {
        id: TasksSupertasksDataSourceTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (wrapper: TaskWrapper) => this.renderCrackedLink(wrapper),
        isSortable: true
      },
      {
        id: TasksSupertasksDataSourceTableCol.AGENTS,
        dataKey: 'agents',
        async: (task: Task) => this.renderAgents(task),
        isSortable: true,
        export: async (task: Task) => (await this.getNumAgents(task)) + ''
      },
      {
        id: TasksSupertasksDataSourceTableCol.PRIORITY,
        dataKey: 'priority',
        editable: (task: TaskWrapper) => {
          return {
            data: task,
            value: task.priority + '',
            action: TasksSupertasksDataSourceTableEditableAction.CHANGE_PRIORITY
          };
        },
        isSortable: true,
        export: async (task: TaskWrapper) => task.priority + ''
      },
      {
        id: TasksSupertasksDataSourceTableCol.MAX_AGENTS,
        dataKey: 'maxAgents',
        editable: (task: TaskWrapper) => {
          return {
            data: task,
            value: task.maxAgents + '',
            action:
              TasksSupertasksDataSourceTableEditableAction.CHANGE_MAX_AGENTS
          };
        },
        isSortable: true,
        export: async (task: TaskWrapper) => task.maxAgents + ''
      }
    ];

    return tableColumns;
  }

  openDialog(data: DialogData<TaskWrapper>) {
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
            case BulkActionMenuAction.ARCHIVE:
              this.bulkActionArchive(result.data, true);
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

  exportActionClicked(event: ActionMenuEvent<TaskWrapper[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<TaskWrapper>(
          'hashtopolis-tasks-supertaks',
          this.tableColumns,
          event.data,
          TasksSupertasksDataSourceTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<TaskWrapper>(
          'hashtopolis-tasks-supertaks',
          this.tableColumns,
          event.data,
          TasksSupertasksDataSourceTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<TaskWrapper>(
            this.tableColumns,
            event.data,
            TasksSupertasksDataSourceTableColumnLabel
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

  rowActionClicked(event: ActionMenuEvent<TaskWrapper>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.COPY_TO_TASK:
        this.rowActionCopyToTask(event.data);
        break;
      case RowActionMenuAction.COPY_TO_PRETASK:
        this.rowActionCopyToPretask(event.data);
        break;
      case RowActionMenuAction.ARCHIVE:
        this.rowActionArchive(event.data);
        break;
      case RowActionMenuAction.UNARCHIVE:
        this.rowActionUnarchive(event.data);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting Tasks ${event.data.taskName} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete it? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<TaskWrapper[]>): void {
    switch (event.menuItem.action) {
      case BulkActionMenuAction.ARCHIVE:
        this.openDialog({
          rows: event.data,
          title: `Archiving ${event.data.length} tasks ...`,
          icon: 'info',
          listAttribute: 'taskName',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: event.data,
          title: `Deleting ${event.data.length} tasks ...`,
          icon: 'warning',
          body: `Are you sure you want to delete the above tasks? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'taskName',
          action: event.menuItem.action
        });
        break;
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionArchive(wrapper: TaskWrapper[], isArchived: boolean): void {
    const requests = wrapper.map((w: TaskWrapper) => {
      return this.gs.update(SERV.TASKS, w._id, {
        isArchived: isArchived
      });
    });

    const action = isArchived ? 'archived' : 'unarchived';

    this.subscriptions.push(
      forkJoin(requests)
        .pipe(
          catchError((error) => {
            console.error('Error during archiving:', error);
            return [];
          })
        )
        .subscribe((results) => {
          this.snackBar.open(
            `Successfully ${action} ${results.length} tasks!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * @todo Implement delete, currently we need to update to delete
   */
  private bulkActionDelete(wrapper: TaskWrapper[]): void {
    const requests = wrapper.map((w: TaskWrapper) => {
      return this.gs.delete(SERV.TASKS, w._id);
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
            `Successfully deleted ${results.length} tasks!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  async getDispatchedSearchedString(task: Task): Promise<string> {
    if (task.keyspace > 0) {
      const cd: ChunkData = await this.getChunkData(task);
      const disp = (cd.dispatched * 100).toFixed(2);
      const sear = (cd.searched * 100).toFixed(2);

      return `${disp}% / ${sear}%`;
    }
    return '';
  }

  async getNumAgents(task: Task): Promise<number> {
    const cd: ChunkData = await this.getChunkData(task);
    return cd.agents.length;
  }

  async renderAgents(task: Task): Promise<SafeHtml> {
    const numAgents = await this.getNumAgents(task);
    return this.sanitize(`${numAgents}`);
  }

  async renderDispatchedSearched(task: Task): Promise<SafeHtml> {
    const html = await this.getDispatchedSearchedString(task);
    return this.sanitize(html);
  }

  private rowActionDelete(tasks: TaskWrapper[]): void {
    //Get the IDs of tasks to be deleted
    const tasksIdsToDelete = tasks.map((tasks) => tasks._id);
    //Remove the selected tasks from the list
    const updatedTasks = this.dataSource
      .getData()
      .filter((tasks) => !tasksIdsToDelete.includes(tasks._id));
    //Update the supertask with the modified list of tasks
    const payload = { tasks: updatedTasks.map((tasks) => tasks._id) };
    this.subscriptions.push(
      this.gs
        .update(SERV.SUPER_TASKS, this.supertaskId, payload)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open('Successfully deleted tasks!', 'Close');
          this.reload();
        })
    );
  }

  editableSaved(editable: HTTableEditable<TaskWrapper>): void {
    switch (editable.action) {
      case TasksSupertasksDataSourceTableEditableAction.CHANGE_PRIORITY:
        this.changePriority(editable.data, editable.value);
        break;
      case TasksSupertasksDataSourceTableEditableAction.CHANGE_MAX_AGENTS:
        this.changeMaxAgents(editable.data, editable.value);
        break;
    }
  }

  private changePriority(task: TaskWrapper, priority: string): void {
    let val = 0;
    try {
      val = parseInt(priority);
    } catch (error) {
      // Do nothing
    }

    if (!val || task.priority == val) {
      this.snackBar.open('Nothing changed!', 'Close');
      return;
    }

    const request$ = this.gs.update(SERV.TASKS, task._id, {
      priority: val
    });
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.snackBar.open(`Failed to update priority!`, 'Close');
            console.error('Failed to update priority:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(
            `Changed priority to ${val} on subtask #${task._id}!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  private changeMaxAgents(task: TaskWrapper, max: string): void {
    let val = 0;
    try {
      val = parseInt(max);
    } catch (error) {
      // Do nothing
    }

    if (!val || task.maxAgents == val) {
      this.snackBar.open('Nothing changed!', 'Close');
      return;
    }

    const request$ = this.gs.update(SERV.TASKS, task._id, {
      maxAgents: val
    });
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.snackBar.open(`Failed to update max agents!`, 'Close');
            console.error('Failed to update max agents:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(
            `Changed number of max agents to ${val} on subtask #${task._id}!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  private rowActionCopyToTask(task: TaskWrapper): void {
    this.router.navigate(['/tasks/new-tasks', task._id, 'copypretask']);
  }

  private rowActionCopyToPretask(task: TaskWrapper): void {
    this.router.navigate(['/tasks/preconfigured-tasks', task._id, 'copy']);
  }

  private rowActionArchive(wrapper: TaskWrapper): void {
    this.updateIsArchived(wrapper._id, true);
  }

  private rowActionUnarchive(wrapper: TaskWrapper): void {
    this.updateIsArchived(wrapper._id, false);
  }

  private rowActionEdit(task: TaskWrapper): void {
    this.router.navigate(['tasks', 'show-tasks', task._id, 'edit']);
  }

  private updateIsArchived(taskId: number, isArchived: boolean): void {
    const strArchived = isArchived ? 'archived' : 'unarchived';
    this.subscriptions.push(
      this.gs
        .update(SERV.TASKS, taskId, { isArchived: isArchived })
        .subscribe(() => {
          this.snackBar.open(`Successfully ${strArchived} task!`, 'Close');
          this.reload();
        })
    );
  }

  private async getChunkData(task: Task): Promise<ChunkData> {
    if (!this.chunkDataLock[task._id]) {
      // If there is no lock, create a new one
      this.chunkDataLock[task._id] = (async () => {
        if (!(task._id in this.chunkData)) {
          // Inside the lock, await the asynchronous operation
          this.chunkData[task._id] = await this.dataSource.getChunkData(
            task._id,
            false,
            task.keyspace
          );
        }

        // Release the lock when the operation is complete
        delete this.chunkDataLock[task._id];
      })();
    }

    // Wait for the lock to be released before returning the data
    await this.chunkDataLock[task._id];
    return this.chunkData[task._id];
  }
}
