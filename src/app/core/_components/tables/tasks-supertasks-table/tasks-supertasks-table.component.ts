import { catchError, forkJoin } from 'rxjs';

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { ChunkData } from '@models/chunk.model';
import { JTask } from '@models/task.model';

import { TaskSuperTaskContextMenuService } from '@services/context-menu/tasks/task-supertask-menu.service';
import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { HTTableColumn, HTTableEditable } from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import {
  TasksSupertasksDataSourceTableCol,
  TasksSupertasksDataSourceTableColumnLabel,
  TasksSupertasksDataSourceTableEditableAction
} from '@components/tables/tasks-supertasks-table/tasks-supertasks-table.constants';

import { TasksSupertasksDataSource } from '@datasources/tasks-supertasks.datasource';

import { convertToLocale } from '@src/app/shared/utils/util';

@Component({
  selector: 'app-tasks-supertasks-table',
  templateUrl: './tasks-supertasks-table.component.html',
  standalone: false
})
export class TasksSupertasksTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  @Input() supertaskId = 0;
  @Output() linkClicked = new EventEmitter<void>();

  tableColumns: HTTableColumn[] = [];
  dataSource: TasksSupertasksDataSource;

  ngOnInit(): void {
    this.setColumnLabels(TasksSupertasksDataSourceTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new TasksSupertasksDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    if (this.supertaskId) {
      this.dataSource.setSuperTaskId(this.supertaskId);
    }
    this.contextMenuService = new TaskSuperTaskContextMenuService(this.permissionService).addContextMenu();
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  onLinkClick(): void {
    this.linkClicked.emit();
  }

  filter(item: JTask, filterValue: string): boolean {
    return item.taskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: TasksSupertasksDataSourceTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (wrapper: JTask) => wrapper.id + ''
      },
      {
        id: TasksSupertasksDataSourceTableCol.NAME,
        dataKey: 'taskName',
        //routerLink: (wrapper: JTask) => this.renderTaskLink(wrapper),
        isSortable: true,
        export: async (wrapper: JTask) => wrapper.taskName + ''
      },
      {
        id: TasksSupertasksDataSourceTableCol.DISPATCHED_SEARCHED,
        dataKey: 'clientSignature',
        render: (task: JTask) => this.renderDispatchedSearched(task),
        isSortable: true
      },
      {
        id: TasksSupertasksDataSourceTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (task: JTask) => this.renderCrackedLinkFromTask(task),
        isSortable: true
      },
      {
        id: TasksSupertasksDataSourceTableCol.AGENTS,
        dataKey: 'agents',
        render: (task: JTask) => this.renderAgents(task),
        isSortable: true,
        export: async (task: JTask) => this.getNumAgents(task) + ''
      },
      {
        id: TasksSupertasksDataSourceTableCol.PRIORITY,
        dataKey: 'priority',
        editable: (task: JTask) => {
          return {
            data: task,
            value: task.priority + '',
            action: TasksSupertasksDataSourceTableEditableAction.CHANGE_PRIORITY
          };
        },
        isSortable: true,
        export: async (task: JTask) => task.priority + ''
      },
      {
        id: TasksSupertasksDataSourceTableCol.MAX_AGENTS,
        dataKey: 'maxAgents',
        editable: (task: JTask) => {
          return {
            data: task,
            value: task.maxAgents + '',
            action: TasksSupertasksDataSourceTableEditableAction.CHANGE_MAX_AGENTS
          };
        },
        isSortable: true,
        export: async (task: JTask) => task.maxAgents + ''
      }
    ];
  }

  openDialog(data: DialogData<JTask>) {
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

  exportActionClicked(event: ActionMenuEvent<JTask[]>): void {
    this.exportService.handleExportAction<JTask>(
      event,
      this.tableColumns,
      TasksSupertasksDataSourceTableColumnLabel,
      'hashtopolis-tasks-supertaks'
    );
  }

  rowActionClicked(event: ActionMenuEvent<JTask>): void {
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

  bulkActionClicked(event: ActionMenuEvent<JTask[]>): void {
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
  private bulkActionArchive(wrapper: JTask[], isArchived: boolean): void {
    const requests = wrapper.map((w: JTask) => {
      return this.gs.update(SERV.TASKS, w.id, {
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
          this.alertService.showSuccessMessage(`Successfully ${action} ${results.length} tasks!`);
          this.reload();
        })
    );
  }

  /**
   * @todo Implement delete, currently we need to update to delete
   */
  private bulkActionDelete(wrapper: JTask[]): void {
    const requests = wrapper.map((w: JTask) => {
      return this.gs.delete(SERV.TASKS, w.id);
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
          this.alertService.showSuccessMessage(`Successfully deleted ${results.length} tasks!`);
          this.reload();
        })
    );
  }

  private getDispatchedSearchedString(task: JTask): string {
    if (task.keyspace > 0) {
      const chunkData: ChunkData = task.chunkData;
      const disp = convertToLocale(chunkData.dispatched * 100);
      const sear = convertToLocale(chunkData.searched * 100);
      return `${disp}% / ${sear}%`;
    }
    return '';
  }

  private getNumAgents(task: JTask): number {
    return task.chunkData ? task.chunkData.agents.length : 0;
  }

  private renderAgents(task: JTask): SafeHtml {
    const numAgents = this.getNumAgents(task);
    return this.sanitize(`${numAgents}`);
  }

  private renderDispatchedSearched(task: JTask): SafeHtml {
    const html = this.getDispatchedSearchedString(task);
    return this.sanitize(html);
  }

  private rowActionDelete(tasks: JTask[]): void {
    //Get the IDs of tasks to be deleted
    const tasksIdsToDelete = tasks.map((tasks) => tasks.id);
    //Remove the selected tasks from the list
    const updatedTasks = this.dataSource.getData().filter((tasks) => !tasksIdsToDelete.includes(tasks.id));
    //Update the supertask with the modified list of tasks
    const payload = { tasks: updatedTasks.map((tasks) => tasks.id) };
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
          this.alertService.showSuccessMessage('Successfully deleted tasks!');
          this.reload();
        })
    );
  }

  editableSaved(editable: HTTableEditable<JTask>): void {
    switch (editable.action) {
      case TasksSupertasksDataSourceTableEditableAction.CHANGE_PRIORITY:
        this.changePriority(editable.data, editable.value);
        break;
      case TasksSupertasksDataSourceTableEditableAction.CHANGE_MAX_AGENTS:
        this.changeMaxAgents(editable.data, editable.value);
        break;
    }
  }

  private changePriority(task: JTask, priority: string): void {
    let val = 0;
    try {
      val = parseInt(priority);
    } catch {
      // Do nothing
    }

    if (!val || task.priority == val) {
      this.alertService.showInfoMessage('Nothing changed');
      return;
    }

    const request$ = this.gs.update(SERV.TASKS, task.id, {
      priority: val
    });
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.alertService.showErrorMessage(`Failed to update priority!`);
            console.error('Failed to update priority:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Changed priority to ${val} on subtask #${task.id}!`);
          this.reload();
        })
    );
  }

  private changeMaxAgents(task: JTask, max: string): void {
    let val = 0;
    try {
      val = parseInt(max);
    } catch {
      // Do nothing
    }

    if (!val || task.maxAgents == val) {
      this.alertService.showInfoMessage('Nothing changed');
      return;
    }

    const request$ = this.gs.update(SERV.TASKS, task.id, {
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
          this.alertService.showSuccessMessage(`Changed number of max agents to ${val} on subtask #${task.id}!`);
          this.reload();
        })
    );
  }

  private rowActionCopyToTask(task: JTask): void {
    this.router.navigate(['/tasks/new-tasks', task.id, 'copypretask']);
  }

  private rowActionCopyToPretask(task: JTask): void {
    this.router.navigate(['/tasks/preconfigured-tasks', task.id, 'copy']);
  }

  private rowActionArchive(wrapper: JTask): void {
    this.updateIsArchived(wrapper.id, true);
  }

  private rowActionUnarchive(wrapper: JTask): void {
    this.updateIsArchived(wrapper.id, false);
  }

  private rowActionEdit(task: JTask): void {
    this.router.navigate(['tasks', 'show-tasks', task.id, 'edit']);
  }

  private updateIsArchived(taskId: number, isArchived: boolean): void {
    const strArchived = isArchived ? 'archived' : 'unarchived';
    this.subscriptions.push(
      this.gs.update(SERV.TASKS, taskId, { isArchived: isArchived }).subscribe(() => {
        this.alertService.showSuccessMessage(`Successfully ${strArchived} task!`);
        this.reload();
      })
    );
  }
}
