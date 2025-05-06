import { Observable, catchError, forkJoin, of } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { ChunkData } from '@models/chunk.model';
import { JTaskWrapper } from '@models/task-wrapper.model';
import { JTask } from '@models/task.model';

import { SERV } from '@services/main.config';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { ExportMenuAction } from '@components/menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import {
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '@components/tables/ht-table/ht-table.models';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import {
  TaskStatus,
  TaskTableCol,
  TaskTableColumnLabel,
  TaskTableEditableAction
} from '@components/tables/tasks-table/tasks-table.constants';

import { TasksDataSource } from '@datasources/tasks.datasource';

import { ModalSubtasksComponent } from '@src/app/tasks/show-tasks/modal-subtasks/modal-subtasks.component';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  standalone: false
})
export class TasksTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: TasksDataSource;
  isArchived = false;

  ngOnInit(): void {
    this.setColumnLabels(TaskTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new TasksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setIsArchived(this.isArchived);
    if (this.hashlistId) {
      this.dataSource.setHashlistId(this.hashlistId);
    }
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: JTaskWrapper, filterValue: string): boolean {
    return item.tasks[0].taskName.toLowerCase().includes(filterValue);
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: TaskTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (wrapper: JTaskWrapper) => wrapper.id + ''
      },
      {
        id: TaskTableCol.TASK_TYPE,
        dataKey: 'taskType',
        render: (wrapper: JTaskWrapper) => (wrapper.taskType === 0 ? 'Task' : '<b>SuperTask</b>'),
        export: async (wrapper: JTaskWrapper) => (wrapper.taskType === 0 ? 'Task' : 'Supertask' + '')
      },
      {
        id: TaskTableCol.NAME,
        dataKey: 'taskName',
        routerLink: (wrapper: JTaskWrapper) => this.renderTaskWrapperLink(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) => wrapper.tasks[0]?.taskName
      },
      {
        id: TaskTableCol.STATUS,
        dataKey: 'keyspaceProgress',
        render: (wrapper: JTaskWrapper) => this.renderSpeed(wrapper),
        iconsNoCache: (wrapper: JTaskWrapper) => this.renderStatusIcons(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) => {
          const status = this.getTaskStatus(wrapper);
          switch (status) {
            case TaskStatus.RUNNING:
              return 'Running';
            case TaskStatus.COMPLETED:
              return 'Completed';
            case TaskStatus.IDLE:
              return 'Idle';
            default:
              return '';
          }
        }
      },
      {
        id: TaskTableCol.HASHTYPE,
        dataKey: 'hashtype',
        isSortable: false,
        render: (wrapper: JTaskWrapper) => {
          const hashType = wrapper.hashType;
          return hashType ? `${hashType.id} - ${hashType.description}` : 'No HashType';
        },
        export: async (wrapper: JTaskWrapper) => {
          const hashType = wrapper.hashType;
          return hashType ? `${hashType.id} - ${hashType.description}` : 'No HashType';
        }
      },
      {
        id: TaskTableCol.HASHLISTS,
        dataKey: 'hashlistId',
        routerLink: (wrapper: JTaskWrapper) => this.renderHashlistLinkFromWrapper(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) => wrapper.hashlist.name + ''
      },
      {
        id: TaskTableCol.DISPATCHED_SEARCHED,
        dataKey: 'clientSignature',
        render: (wrapper: JTaskWrapper) => this.renderDispatchedSearched(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) => this.getDispatchedSearchedString(wrapper)
      },
      {
        id: TaskTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (wrapper: JTaskWrapper) => this.renderCrackedLinkFromWrapper(wrapper),
        isSortable: true,
        export: async (wrapper: JTaskWrapper) => wrapper.cracked + ''
      },
      {
        id: TaskTableCol.AGENTS,
        dataKey: 'agents',
        render: (wrapper: JTaskWrapper) => this.renderAgents(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) => this.getNumAgents(wrapper) + ''
      },
      {
        id: TaskTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupName',
        routerLink: (wrapper: JTaskWrapper) => this.renderAccessGroupLink(wrapper.accessGroup),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) => wrapper.accessGroup.groupName
      },
      {
        id: TaskTableCol.PRIORITY,
        dataKey: 'priority',
        editable: (wrapper: JTaskWrapper) => {
          return {
            data: wrapper,
            value: wrapper.priority + '',
            action: TaskTableEditableAction.CHANGE_PRIORITY
          };
        },
        isSortable: true,
        export: async (wrapper: JTaskWrapper) => wrapper.priority + ''
      },
      {
        id: TaskTableCol.MAX_AGENTS,
        dataKey: 'maxAgents',
        editable: (wrapper: JTaskWrapper) => {
          return {
            data: wrapper,
            value: wrapper.maxAgents + '',
            action: TaskTableEditableAction.CHANGE_MAX_AGENTS
          };
        },
        isSortable: true,
        export: async (wrapper: JTaskWrapper) => wrapper.maxAgents + ''
      },
      {
        id: TaskTableCol.PREPROCESSOR,
        dataKey: 'preprocessorId',
        render: (wrapper: JTaskWrapper) =>
          wrapper.taskType === 0 && wrapper.tasks[0].preprocessorId === 1 ? 'Prince' : '',
        isSortable: false,
        export: async (wrapper: JTaskWrapper) =>
          wrapper.taskType === 0 && wrapper.tasks[0].preprocessorId === 1 ? 'Prince' : ''
      },
      {
        id: TaskTableCol.IS_SMALL,
        dataKey: 'isSmall',
        iconsNoCache: (wrapper: JTaskWrapper) => this.renderIsSmallIcon(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) =>
          wrapper.taskType === 0 ? (wrapper.tasks[0].isSmall ? 'Yes' : 'No') : ''
      },
      {
        id: TaskTableCol.IS_CPU_TASK,
        dataKey: 'isCpuTask',
        iconsNoCache: (wrapper: JTaskWrapper) => this.renderIsCpuTaskIcon(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) =>
          wrapper.taskType === 0 ? (wrapper.tasks[0].isCpuTask ? 'Yes' : 'No') : ''
      }
    ];
  }

  rowActionClicked(event: ActionMenuEvent<JTaskWrapper>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT_TASKS:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.EDIT_SUBTASKS:
        // eslint-disable-next-line no-case-declarations
        this.rowActionEditSubtasks(event.data);
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
      case RowActionMenuAction.DELETE: {
        const prodata = this.getRowDeleteLabel(event.data);
        this.openDialog({
          rows: [prodata],
          title: `Deleting ${prodata.taskName} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete ${prodata.taskName}? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
      }
    }
  }

  getRowDeleteLabel(data: JTaskWrapper): JTaskWrapper {
    return {
      ...data,
      taskName: data.taskType === 1 ? data.taskWrapperName : data.tasks[0].taskName
    };
  }

  bulkActionClicked(event: ActionMenuEvent<JTaskWrapper[]>): void {
    let superTasksCount = 0;
    let tasksCount = 0;

    // Preprocess the data and count the occurrences of each type
    const updatedData: JTaskWrapper[] = event.data.map((taskWrapper: JTaskWrapper) => {
      if (taskWrapper.taskType === 1) {
        superTasksCount++;
        return { ...taskWrapper, taskName: taskWrapper.taskWrapperName };
      } else {
        tasksCount++;
        return taskWrapper;
      }
    });

    // Construct the label with counts, also adding plural
    const superTasksLabel = superTasksCount === 1 ? 'supertask' : 'supertasks';
    const tasksLabel = tasksCount === 1 ? 'task' : 'tasks';

    let label = '';
    if (superTasksCount > 0 && tasksCount > 0) {
      label = `${tasksCount} ${tasksLabel} and ${superTasksCount} ${superTasksLabel}`;
    } else if (superTasksCount > 0) {
      label = `${superTasksCount} ${superTasksLabel}`;
    } else if (tasksCount > 0) {
      label = `${tasksCount} ${tasksLabel}`;
    }

    switch (event.menuItem.action) {
      case BulkActionMenuAction.ARCHIVE:
        this.openDialog({
          rows: updatedData,
          title: `Archiving ${label} ...`,
          icon: 'info',
          listAttribute: 'taskName',
          action: event.menuItem.action
        });
        break;
      case BulkActionMenuAction.DELETE:
        this.openDialog({
          rows: updatedData,
          title: `Deleting ${label} ...`,
          icon: 'warning',
          body: `Are you sure you want to permanently delete the selected ${label}? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'taskName',
          action: event.menuItem.action
        });
        break;
    }
  }

  exportActionClicked(event: ActionMenuEvent<JTaskWrapper[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<JTaskWrapper>(
          'hashtopolis-tasks',
          this.tableColumns,
          event.data,
          TaskTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<JTaskWrapper>(
          'hashtopolis-tasks',
          this.tableColumns,
          event.data,
          TaskTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService.toClipboard<JTaskWrapper>(this.tableColumns, event.data, TaskTableColumnLabel).then(() => {
          this.snackBar.open('The selected rows are copied to the clipboard', 'Close');
        });
        break;
    }
  }

  openDialog(data: DialogData<JTaskWrapper>) {
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

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
    this.dataSource.setIsArchived(isArchived);
  }

  getDispatchedSearchedString(wrapper: JTaskWrapper): string {
    if (wrapper.taskType === 0) {
      const task: JTask = wrapper.tasks[0];
      if (task.keyspace > 0) {
        return `${task.dispatched}% / ${task.searched}%`;
      }
    }
    return '';
  }

  // --- Render functions ---

  renderStatusIcons(wrapper: JTaskWrapper): HTTableIcon {
    let icon: HTTableIcon = { name: '' };
    const status = this.getTaskStatus(wrapper);
    if (wrapper.taskType === 0) {
      switch (status) {
        case TaskStatus.RUNNING:
          icon = {
            name: 'radio_button_checked',
            cls: 'pulsing-progress',
            tooltip: 'In Progress'
          };
          break;
        case TaskStatus.COMPLETED:
          icon = {
            name: 'check',
            tooltip: 'Completed'
          };
          break;
        case TaskStatus.IDLE:
          icon = {
            name: 'radio_button_checked',
            tooltip: 'Idle',
            cls: 'text-primary'
          };
          break;
      }
    } else {
      // Count the completed tasks in supertasks
      const countCompleted = wrapper.tasks.reduce((count) => {
        return count;
      }, 0);

      if (wrapper.tasks.length === countCompleted) {
        icon = {
          name: 'check',
          tooltip: 'Completed'
        };
      }
    }

    return icon;
  }

  private renderIsSmallIcon(wrapper: JTaskWrapper): HTTableIcon {
    return this.renderBoolIcon(wrapper, 'isSmall');
  }

  private renderIsCpuTaskIcon(wrapper: JTaskWrapper): HTTableIcon {
    return this.renderBoolIcon(wrapper, 'isCpuTask');
  }

  renderDispatchedSearched(wrapper: JTaskWrapper): SafeHtml {
    const html = this.getDispatchedSearchedString(wrapper);
    return this.sanitize(html);
  }

  getNumAgents(wrapper: JTaskWrapper): number {
    return wrapper.taskType === 0 && wrapper.chunkData ? wrapper.chunkData.agents.length : 0;
  }

  renderAgents(wrapper: JTaskWrapper): SafeHtml {
    const numAgents = this.getNumAgents(wrapper);
    return this.sanitize(`${numAgents}`);
  }

  renderSpeed(wrapper: JTaskWrapper): SafeHtml {
    let html = '';
    if (wrapper.taskType === 0) {
      const chunkData: ChunkData = wrapper.chunkData;
      if (chunkData && 'speed' in chunkData && chunkData.speed > 0) {
        html = `${chunkData.speed}&nbsp;H/s`;
      }
    }
    return this.sanitize(html);
  }

  editableSaved(editable: HTTableEditable<JTaskWrapper>): void {
    switch (editable.action) {
      case TaskTableEditableAction.CHANGE_PRIORITY:
        this.changePriority(editable.data, editable.value);
        break;
      case TaskTableEditableAction.CHANGE_MAX_AGENTS:
        this.changeMaxAgents(editable.data, editable.value);
        break;
    }
  }

  private rowActionEditSubtasks(taskWrapper: JTaskWrapper): void {
    const dialogRef = this.dialog.open(ModalSubtasksComponent, {
      width: '100%',
      data: {
        supertaskId: taskWrapper.id,
        supertaskName: taskWrapper.taskWrapperName
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  private getTaskStatus(wrapper: JTaskWrapper): TaskStatus {
    if (wrapper.taskType === 0 && wrapper.tasks.length > 0) {
      const chunkData: ChunkData = wrapper.chunkData;
      if (chunkData) {
        const speed = chunkData.speed;

        if (speed > 0) {
          return TaskStatus.RUNNING;
        } else if (
          wrapper.tasks[0].keyspaceProgress >= wrapper.tasks[0].keyspace &&
          wrapper.tasks[0].keyspaceProgress > 0
        ) {
          return TaskStatus.COMPLETED;
        } else {
          return TaskStatus.IDLE;
        }
      }
    }

    return TaskStatus.INVALID;
  }

  // --- Action functions ---

  private renderBoolIcon(wrapper: JTaskWrapper, key: string, equals: string = ''): HTTableIcon {
    let icon: HTTableIcon = { name: '' };
    if (wrapper.taskType === 0) {
      const task: JTask = wrapper.tasks[0];
      if (equals === '') {
        if (task[key] === true) {
          icon = {
            name: 'check',
            cls: 'text-ok'
          };
        }
      } else if (task[key] === equals) {
        icon = {
          name: 'check',
          cls: 'text-ok'
        };
      }
    } else {
      if (equals === '') {
        if (wrapper[key] === true) {
          icon = {
            name: 'check',
            cls: 'text-ok'
          };
        }
      } else if (wrapper[key] === equals) {
        icon = {
          name: 'check',
          cls: 'text-ok'
        };
      }
    }

    return icon;
  }

  private rowActionEdit(task: JTaskWrapper): void {
    this.router.navigate(['tasks', 'show-tasks', task.tasks[0].id, 'edit']);
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionArchive(wrapper: JTaskWrapper[], isArchived: boolean): void {
    const requests = wrapper.map((w: JTaskWrapper) => {
      return this.gs.update(SERV.TASKS, w.tasks[0].id, {
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
          this.snackBar.open(`Successfully ${action} ${results.length} tasks!`, 'Close');
          this.reload();
        })
    );
  }

  private bulkActionDelete(wrapper: JTaskWrapper[]): void {
    const requests = wrapper.map((w: JTaskWrapper) => {
      return this.gs.delete(SERV.TASKS_WRAPPER, w.id);
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
          this.snackBar.open(`Successfully deleted ${results.length} tasks!`, 'Close');
          this.reload();
        })
    );
  }

  private rowActionDelete(wrapper: JTaskWrapper): void {
    console.log(wrapper);
    this.subscriptions.push(
      this.gs.delete(SERV.TASKS_WRAPPER, wrapper[0].id).subscribe(() => {
        this.snackBar.open('Successfully deleted task!', 'Close');
        this.reload();
      })
    );
  }

  private rowActionCopyToTask(wrapper: JTaskWrapper): void {
    this.router.navigate(['tasks', 'new-tasks', wrapper.tasks[0].id, 'copy']);
  }

  private rowActionCopyToPretask(wrapper: JTaskWrapper): void {
    this.router.navigate(['tasks', 'preconfigured-tasks', wrapper.tasks[0].id, 'copytask']);
  }

  private rowActionArchive(wrapper: JTaskWrapper): void {
    this.updateIsArchived(wrapper.tasks[0].id, true);
  }

  private rowActionUnarchive(wrapper: JTaskWrapper): void {
    this.updateIsArchived(wrapper.tasks[0].id, false);
  }

  private updateIsArchived(taskId: number, isArchived: boolean): void {
    const strArchived = isArchived ? 'archived' : 'unarchived';
    this.subscriptions.push(
      this.gs.update(SERV.TASKS, taskId, { isArchived: isArchived }).subscribe(() => {
        this.snackBar.open(`Successfully ${strArchived} task!`, 'Close');
        this.reload();
      })
    );
  }

  private changePriority(wrapper: JTaskWrapper, priority: string): void {
    let val = 0;
    try {
      val = parseInt(priority);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }

    if (!val || wrapper.priority == val) {
      this.snackBar.open('Nothing changed!', 'Close');
      return;
    }

    const request$ = this.gs.update(SERV.TASKS_WRAPPER, wrapper.id, {
      priority: val
    });
    this.subscriptions.push(
      request$
        .pipe(
          catchError((error) => {
            this.snackBar.open(`Failed to update prio!`, 'Close');
            console.error('Failed to update prio:', error);
            return [];
          })
        )
        .subscribe(() => {
          this.snackBar.open(`Changed prio to ${val} on Task #${wrapper.tasks[0].id}!`, 'Close');
          this.reload();
        })
    );
  }

  private changeMaxAgents(wrapper: JTaskWrapper, max: string): void {
    let val = 0;
    try {
      val = parseInt(max);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }

    if (!val || wrapper.maxAgents == val) {
      this.snackBar.open('Nothing changed!', 'Close');
      return;
    }

    const request$ = this.gs.update(SERV.TASKS_WRAPPER, wrapper.id, {
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
          this.snackBar.open(`Changed number of max agents to ${val} on Task #${wrapper.tasks[0].id}!`, 'Close');
          this.reload();
        })
    );
  }

  /**
   * Render router link to show cracked hashes for a task
   * @param wrapper - the task wrapper object to render the link for
   * @return observable containing an array of router links to be rendered in HTML
   * @private
   */
  private renderCrackedLinkFromWrapper(wrapper: JTaskWrapper): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (wrapper.taskType === 0) {
      links.push({
        label: wrapper.cracked + '',
        routerLink: ['/hashlists', 'hashes', 'tasks', wrapper.tasks[0].id]
      });
    }

    return of(links);
  }

  /**
   * Render router links for any type of tasks for a task wrapper object
   * @param wrapper - the task wrapper object to render the link for
   * @return observable containing an array of router links to be rendered in HTML
   * @private
   */
  private renderTaskWrapperLink(wrapper: JTaskWrapper): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];

    if (wrapper.taskType === 0) {
      for (const task of wrapper.tasks) {
        const taskName = task.taskName?.length > 40 ? `${task.taskName.substring(40)}...` : task.taskName;

        links.push({
          label: taskName,
          routerLink: ['/tasks', 'show-tasks', task.id, 'edit'],
          tooltip: task.attackCmd
        });
      }
    } else if (wrapper.taskType === 1) {
      const taskWrapperName =
        wrapper.taskWrapperName.length > 40 ? `${wrapper.taskWrapperName.substring(40)}...` : wrapper.taskWrapperName;

      links.push({
        label: taskWrapperName,
        routerLink: ['/tasks', 'show-subtasks', wrapper.id, 'edit'],
        tooltip: 'Supertask'
      });
    }

    return of<HTTableRouterLink[]>(links);
  }

  /**
   * Render router links for hashlists for a task wrapper object
   * @param wrapper - the task wrapper object to render the link for
   * @return observable containing an array of router links to be rendered in HTML
   * @private
   */
  private renderHashlistLinkFromWrapper(wrapper: JTaskWrapper): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (wrapper && wrapper.hashlist) {
      links.push({
        label: wrapper.hashlist.name,
        routerLink: ['/hashlists', 'hashlist', wrapper.hashlist.id, 'edit']
      });
    }
    return of(links);
  }
}
