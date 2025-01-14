import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import {
  TaskStatus,
  TaskTableCol,
  TaskTableColumnLabel,
  TaskTableEditableAction
} from './tasks-table.constants';

import { catchError, forkJoin } from 'rxjs';
import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { ChunkDataData } from 'src/app/core/_models/chunk.model';
import { DialogData } from '../table-dialog/table-dialog.model';
import { ExportMenuAction } from '../../menus/export-menu/export-menu.constants';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { SafeHtml } from '@angular/platform-browser';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { Task } from 'src/app/core/_models/task.model';
import { TaskWrapper } from 'src/app/core/_models/task-wrapper.model';
import { TasksDataSource } from 'src/app/core/_datasources/tasks.datasource';

@Component({
  selector: 'tasks-table',
  templateUrl: './tasks-table.component.html'
})
export class TasksTableComponent
  extends BaseTableComponent
  implements OnInit, OnDestroy
{
  tableColumns: HTTableColumn[] = [];
  dataSource: TasksDataSource;
  isArchived = false;
  chunkData: { [key: number]: ChunkDataData } = {};
  private chunkDataLock: { [key: string]: Promise<void> } = {};

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

  filter(item: TaskWrapper, filterValue: string): boolean {
    if (item.taskName.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: TaskTableCol.ID,
        dataKey: '_id',
        isSortable: true,
        export: async (wrapper: TaskWrapper) => wrapper._id + ''
      },
      {
        id: TaskTableCol.TASK_TYPE,
        dataKey: 'taskType',
        render: (wrapper: TaskWrapper) =>
          wrapper.taskType === 0 ? 'Task' : '<b>SuperTask</b>',
        export: async (wrapper: TaskWrapper) =>
          wrapper.taskType === 0 ? 'Task' : 'Supertask' + ''
      },
      {
        id: TaskTableCol.NAME,
        dataKey: 'taskName',
        routerLink: (wrapper: TaskWrapper) =>
          this.renderTaskWrapperLink(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapper) => wrapper.taskName
      },
      {
        id: TaskTableCol.STATUS,
        async: (wrapper: TaskWrapper) => this.renderSpeed(wrapper),
        icons: (wrapper: TaskWrapper) => this.renderStatusIcons(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapper) => {
          const status = await this.getTaskStatus(wrapper);
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
        isSortable: false,
        render: (wrapper: any) => {
          const firstHashtype = wrapper.hashtypes[0];
          return firstHashtype
            ? `${firstHashtype.hashTypeId} - ${firstHashtype.description}`
            : 'No HashType';
        }
      },
      {
        id: TaskTableCol.HASHLISTS,
        dataKey: 'hashlistId',
        routerLink: (wrapper: TaskWrapper) => this.renderHashlistLink(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapper) =>
          wrapper.hashlists.map((h) => h.name).join(', ')
      },
      {
        id: TaskTableCol.DISPATCHED_SEARCHED,
        async: (wrapper: TaskWrapper) => this.renderDispatchedSearched(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapper) =>
          this.getDispatchedSearchedString(wrapper)
      },
      {
        id: TaskTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (wrapper: TaskWrapper) => this.renderCrackedLink(wrapper),
        isSortable: true,
        export: async (wrapper: TaskWrapper) => wrapper.cracked + ''
      },
      {
        id: TaskTableCol.AGENTS,
        async: (wrapper: TaskWrapper) => this.renderAgents(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapper) =>
          (await this.getNumAgents(wrapper)) + ''
      },
      {
        id: TaskTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupName',
        routerLink: (wrapper: TaskWrapper) =>
          this.renderAccessGroupLink(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapper) => wrapper.accessGroupName
      },
      {
        id: TaskTableCol.PRIORITY,
        dataKey: 'priority',
        editable: (wrapper: TaskWrapper) => {
          return {
            data: wrapper,
            value: wrapper.priority + '',
            action: TaskTableEditableAction.CHANGE_PRIORITY
          };
        },
        isSortable: true,
        export: async (wrapper: TaskWrapper) => wrapper.priority + ''
      },
      {
        id: TaskTableCol.MAX_AGENTS,
        dataKey: 'maxAgents',
        editable: (wrapper: TaskWrapper) => {
          return {
            data: wrapper,
            value: wrapper.maxAgents + '',
            action: TaskTableEditableAction.CHANGE_MAX_AGENTS
          };
        },
        isSortable: true,
        export: async (wrapper: TaskWrapper) => wrapper.maxAgents + ''
      },
      {
        id: TaskTableCol.PREPROCESSOR,
        render: (wrapper: TaskWrapper) =>
          wrapper.taskType === 0 && wrapper.tasks[0].preprocessorId === 1
            ? 'Prince'
            : '',
        isSortable: false,
        export: async (wrapper: TaskWrapper) =>
          wrapper.taskType === 0 && wrapper.tasks[0].preprocessorId === 1
            ? 'Prince'
            : ''
      },
      {
        id: TaskTableCol.IS_SMALL,
        icons: (wrapper: TaskWrapper) => this.renderIsSmallIcon(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapper) =>
          wrapper.taskType === 0
            ? wrapper.tasks[0].isSmall
              ? 'Yes'
              : 'No'
            : ''
      },
      {
        id: TaskTableCol.IS_CPU_TASK,
        icons: (wrapper: TaskWrapper) => this.renderIsCpuTaskIcon(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapper) =>
          wrapper.taskType === 0
            ? wrapper.tasks[0].isCpuTask
              ? 'Yes'
              : 'No'
            : ''
      }
    ];

    return tableColumns;
  }

  rowActionClicked(event: ActionMenuEvent<TaskWrapper>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT_TASKS:
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

  getRowDeleteLabel(data): any {
    return {
      ...data,
      taskName: data.taskType === 1 ? data.taskWrapperName : data.taskName
    };
  }

  bulkActionClicked(event: ActionMenuEvent<TaskWrapper[]>): void {
    let tasksCount = 0;

    // Preprocess the data and count the occurrences of each type
    const updatedData = event.data.map((taskWrapper) => {
      tasksCount++;
      return taskWrapper;
    });

    // Construct the label with counts, also adding plural
    const tasksLabel = tasksCount === 1 ? 'task' : 'tasks';

    let label = '';
    label = `${tasksCount} ${tasksLabel}`;

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

  exportActionClicked(event: ActionMenuEvent<TaskWrapper[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<TaskWrapper>(
          'hashtopolis-tasks',
          this.tableColumns,
          event.data,
          TaskTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<TaskWrapper>(
          'hashtopolis-tasks',
          this.tableColumns,
          event.data,
          TaskTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<TaskWrapper>(
            this.tableColumns,
            event.data,
            TaskTableColumnLabel
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

  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
    this.dataSource.setIsArchived(isArchived);
  }

  private async getTaskStatus(wrapper: TaskWrapper): Promise<TaskStatus> {
    if (wrapper.taskType === 0 && wrapper.tasks.length > 0) {
      const cd: ChunkDataData = await this.getChunkData(wrapper);
      const speed = cd.speed;

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

    return TaskStatus.INVALID;
  }

  async getDispatchedSearchedString(wrapper: TaskWrapper): Promise<string> {
    if (wrapper.taskType === 0) {
      const task: Task = wrapper.tasks[0];
      if (task.keyspace > 0) {
        const cd: ChunkDataData = await this.getChunkData(wrapper);
        const disp = (cd.dispatched * 100).toFixed(2);
        const sear = (cd.searched * 100).toFixed(2);

        return `${disp}% / ${sear}%`;
      }
    }
    return '';
  }

  // --- Render functions ---

  @Cacheable(['_id', 'taskType'])
  async renderTaskWrapperLink(
    wrapper: TaskWrapper
  ): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];

    if (wrapper.taskType === 0) {
      for (const task of wrapper.tasks) {
        const taskName =
          task.taskName?.length > 40
            ? `${task.taskName.substring(40)}...`
            : task.taskName;

        links.push({
          label: taskName,
          routerLink: ['/tasks', 'show-tasks', task._id, 'edit'],
          tooltip: task.attackCmd
        });
      }
    } else if (wrapper.taskType === 1) {
      const taskWrapperName =
        wrapper.taskWrapperName.length > 40
          ? `${wrapper.taskWrapperName.substring(40)}...`
          : wrapper.taskWrapperName;

      links.push({
        label: taskWrapperName,
        routerLink: ['/tasks', 'show-subtasks', wrapper._id],
        tooltip: 'Supertask'
      });
    }

    return links;
  }

  @Cacheable(['_id', 'taskType', 'hashlists'])
  override async renderHashlistLink(
    wrapper: TaskWrapper
  ): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];

    if (wrapper && wrapper['hashlists'] && wrapper['hashlists'].length) {
      links.push({
        label: wrapper['hashlists'][0].name,
        routerLink: [
          '/hashlists',
          'hashlist',
          wrapper['hashlists'][0]._id,
          'edit'
        ]
      });
    }

    return links;
  }

  @Cacheable(['_id', 'taskType', 'tasks'])
  async renderStatusIcons(wrapper: TaskWrapper): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    const status = await this.getTaskStatus(wrapper);
    if (wrapper.taskType === 0) {
      switch (status) {
        case TaskStatus.RUNNING:
          icons.push({
            name: 'radio_button_checked',
            cls: 'pulsing-progress',
            tooltip: 'In Progress'
          });
          break;
        case TaskStatus.COMPLETED:
          icons.push({
            name: 'check',
            tooltip: 'Completed'
          });
          break;
        case TaskStatus.IDLE:
          icons.push({
            name: 'radio_button_checked',
            tooltip: 'Idle',
            cls: 'text-primary'
          });
          break;
      }
    } else {
      // Count the completed tasks in supertasks
      const countCompleted = wrapper.tasks.reduce((count, task) => {
        return count;
      }, 0);

      if (wrapper.tasks.length === countCompleted) {
        icons.push({
          name: 'check',
          tooltip: 'Completed'
        });
      }
    }

    return icons;
  }

  @Cacheable(['_id', 'isSmall'])
  async renderIsSmallIcon(wrapper: TaskWrapper): Promise<HTTableIcon[]> {
    return this.renderBoolIcon(wrapper, 'isSmall');
  }

  @Cacheable(['_id', 'isCpuTask'])
  async renderIsCpuTaskIcon(wrapper: TaskWrapper): Promise<HTTableIcon[]> {
    return this.renderBoolIcon(wrapper, 'isCpuTask');
  }

  @Cacheable(['_id', 'taskType'])
  async renderTaskTypeIcon(wrapper: TaskWrapper): Promise<HTTableIcon[]> {
    return this.renderBoolIcon(wrapper, 'taskType', 1);
  }

  private renderBoolIcon(
    wrapper: TaskWrapper,
    key: string,
    equals: any = ''
  ): HTTableIcon[] {
    const icons: HTTableIcon[] = [];
    if (wrapper.taskType === 0) {
      const task: Task = wrapper.tasks[0];
      if (equals === '') {
        if (task[key] === true) {
          icons.push({
            name: 'check',
            cls: 'text-ok'
          });
        }
      } else if (task[key] === equals) {
        icons.push({
          name: 'check',
          cls: 'text-ok'
        });
      }
    } else {
      if (equals === '') {
        if (wrapper[key] === true) {
          icons.push({
            name: 'check',
            cls: 'text-ok'
          });
        }
      } else if (wrapper[key] === equals) {
        icons.push({
          name: 'check',
          cls: 'text-ok'
        });
      }
    }

    return icons;
  }

  @Cacheable(['_id', 'taskType', 'tasks'])
  async renderDispatchedSearched(wrapper: TaskWrapper): Promise<SafeHtml> {
    const html = await this.getDispatchedSearchedString(wrapper);
    return this.sanitize(html);
  }

  @Cacheable(['_id', 'taskType', 'tasks'])
  override async renderCrackedLink(
    wrapper: TaskWrapper
  ): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (wrapper.taskType === 0) {
      const cd: ChunkDataData = await this.getChunkData(wrapper);
      links.push({
        label: cd.cracked + '',
        routerLink: ['/hashlists', 'hashes', 'tasks', wrapper.tasks[0]._id]
      });
    }

    return links;
  }

  async getNumAgents(wrapper: TaskWrapper): Promise<number> {
    if (wrapper.taskType === 0) {
      const cd: ChunkDataData = await this.getChunkData(wrapper);
      return cd.agents.length;
    }

    return 0;
  }

  @Cacheable(['_id', 'taskType', 'tasks'])
  async renderAgents(wrapper: TaskWrapper): Promise<SafeHtml> {
    const numAgents = await this.getNumAgents(wrapper);
    return this.sanitize(`${numAgents}`);
  }

  @Cacheable(['_id', 'taskType', 'tasks'])
  async renderSpeed(wrapper: TaskWrapper): Promise<SafeHtml> {
    let html = '';
    if (wrapper.taskType === 0) {
      const cd: ChunkDataData = await this.getChunkData(wrapper);
      html = cd.speed > 0 ? `${cd.speed}&nbsp;H/s` : '';
    }
    return this.sanitize(html);
  }

  // --- Action functions ---

  private rowActionEdit(task: TaskWrapper): void {
    this.router.navigate(['tasks', 'show-tasks', task.tasks[0]._id, 'edit']);
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionArchive(wrapper: TaskWrapper[], isArchived: boolean): void {
    const requests = wrapper.map((w: TaskWrapper) => {
      return this.gs.update(SERV.TASKS, w.tasks[0]._id, {
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

  private bulkActionDelete(wrapper: TaskWrapper[]): void {
    const requests = wrapper.map((w: TaskWrapper) => {
      return this.gs.delete(SERV.TASKS_WRAPPER, w._id);
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

  private rowActionDelete(wrapper: TaskWrapper): void {
    console.log(wrapper);
    this.subscriptions.push(
      this.gs.delete(SERV.TASKS_WRAPPER, wrapper[0]._id).subscribe(() => {
        this.snackBar.open('Successfully deleted task!', 'Close');
        this.reload();
      })
    );
  }

  private rowActionCopyToTask(wrapper: TaskWrapper): void {
    this.router.navigate(['tasks', 'new-tasks', wrapper.tasks[0]._id, 'copy']);
  }

  private rowActionCopyToPretask(wrapper: TaskWrapper): void {
    this.router.navigate([
      'tasks',
      'preconfigured-tasks',
      wrapper.tasks[0]._id,
      'copytask'
    ]);
  }

  private rowActionArchive(wrapper: TaskWrapper): void {
    this.updateIsArchived(wrapper.tasks[0]._id, true);
  }

  private rowActionUnarchive(wrapper: TaskWrapper): void {
    this.updateIsArchived(wrapper.tasks[0]._id, false);
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

  editableSaved(editable: HTTableEditable<TaskWrapper>): void {
    switch (editable.action) {
      case TaskTableEditableAction.CHANGE_PRIORITY:
        this.changePriority(editable.data, editable.value);
        break;
      case TaskTableEditableAction.CHANGE_MAX_AGENTS:
        this.changeMaxAgents(editable.data, editable.value);
        break;
    }
  }

  private changePriority(wrapper: TaskWrapper, priority: string): void {
    let val = 0;
    try {
      val = parseInt(priority);
    } catch (error) {
      // Do nothing
    }

    if (!val || wrapper.priority == val) {
      this.snackBar.open('Nothing changed!', 'Close');
      return;
    }

    const request$ = this.gs.update(SERV.TASKS_WRAPPER, wrapper._id, {
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
          this.snackBar.open(
            `Changed prio to ${val} on Task #${wrapper.tasks[0]._id}!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  private changeMaxAgents(wrapper: TaskWrapper, max: string): void {
    let val = 0;
    try {
      val = parseInt(max);
    } catch (error) {
      // Do nothing
    }

    if (!val || wrapper.maxAgents == val) {
      this.snackBar.open('Nothing changed!', 'Close');
      return;
    }

    const request$ = this.gs.update(SERV.TASKS_WRAPPER, wrapper._id, {
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
            `Changed number of max agents to ${val} on Task #${wrapper.tasks[0]._id}!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  /**
   * Retrieves or fetches chunk data associated with a given task from the data source.
   * If the chunk data for the specified task ID is not already cached, it is fetched
   * asynchronously from the data source and stored in the cache for future use.
   *
   * @param {TaskWrapper} wrapper - The task wrapper containing the task for which chunk data is requested.
   * @returns {Promise<ChunkData>} - A promise that resolves to the chunk data associated with the specified task.
   *
   * @remarks
   * This function uses a locking mechanism to ensure that concurrent calls for the same task ID
   * do not interfere with each other. If another call is already fetching or has fetched
   * the chunk data for the same task ID, subsequent calls will wait for the operation to complete
   * before proceeding.
   */
  private async getChunkData(wrapper: TaskWrapper): Promise<ChunkDataData> {
    const task: Task = wrapper.tasks[0];

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
