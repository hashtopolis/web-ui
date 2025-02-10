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
import { TaskData } from 'src/app/core/_models/task.model';
import { TaskWrapperData } from 'src/app/core/_models/task-wrapper.model';
import { TasksDataSource } from 'src/app/core/_datasources/tasks.datasource';
import { HashlistData } from '../../../_models/hashlist.model';

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

  filter(item: TaskWrapperData, filterValue: string): boolean {
    if (item.attributes.tasks[0].attributes.taskName.toLowerCase().includes(filterValue)) {
      return true;
    }

    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        id: TaskTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        export: async (wrapper: TaskWrapperData) => wrapper.id + ''
      },
      {
        id: TaskTableCol.TASK_TYPE,
        dataKey: 'taskType',
        render: (wrapper: TaskWrapperData) =>
          wrapper.attributes.taskType === 0 ? 'Task' : '<b>SuperTask</b>',
        export: async (wrapper: TaskWrapperData) =>
          wrapper.attributes.taskType === 0 ? 'Task' : 'Supertask' + ''
      },
      {
        id: TaskTableCol.NAME,
        dataKey: 'taskName',
        routerLink: (wrapper: TaskWrapperData) =>
          this.renderTaskWrapperLink(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapperData) => wrapper.attributes.tasks[0]?.attributes.taskName
      },
      {
        id: TaskTableCol.STATUS,
        dataKey: 'keyspaceProgress',
        async: (wrapper: TaskWrapperData) => this.renderSpeed(wrapper),
        icons: (wrapper: TaskWrapperData) => this.renderStatusIcons(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapperData) => {
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
        dataKey: 'hashtype',
        isSortable: false,
        render: (wrapper: TaskWrapperData) => {
          const firstHashtype = wrapper.attributes.hashtypes[0];
          return firstHashtype
            ? `${firstHashtype.id} - ${firstHashtype.attributes.description}`
            : 'No HashType';
        },
        export: async (wrapper: TaskWrapperData) =>{
          const firstHashtype = wrapper.attributes.hashtypes[0];
          return firstHashtype
            ? `${firstHashtype.id} - ${firstHashtype.attributes.description}`
            : 'No HashType';
        }
      },
      {
        id: TaskTableCol.HASHLISTS,
        dataKey: 'hashlistId',
        routerLink: (wrapper: TaskWrapperData) => this.renderHashlistLink(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapperData) =>
          wrapper.attributes.hashlists.map((h: HashlistData) => h.attributes.name).join(', ')
      },
      {
        id: TaskTableCol.DISPATCHED_SEARCHED,
        dataKey: 'clientSignature',
        async: (wrapper: TaskWrapperData) => this.renderDispatchedSearched(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapperData) =>
          this.getDispatchedSearchedString(wrapper)
      },
      {
        id: TaskTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (wrapper: TaskWrapperData) => this.renderCrackedLink(wrapper),
        isSortable: true,
        export: async (wrapper: TaskWrapperData) => wrapper.attributes.cracked + ''
      },
      {
        id: TaskTableCol.AGENTS,
        dataKey: 'agents',
        async: (wrapper: TaskWrapperData) => this.renderAgents(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapperData) =>
          (await this.getNumAgents(wrapper)) + ''
      },
      {
        id: TaskTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupName',
        routerLink: (wrapper: TaskWrapperData) =>
          this.renderAccessGroupLink(wrapper.attributes.accessgroup[0]),
        isSortable: false,
        export: async (wrapper: TaskWrapperData) => wrapper.attributes.accessgroup[0].attributes.groupName
      },
      {
        id: TaskTableCol.PRIORITY,
        dataKey: 'priority',
        editable: (wrapper: TaskWrapperData) => {
          return {
            data: wrapper,
            value: wrapper.attributes.priority + '',
            action: TaskTableEditableAction.CHANGE_PRIORITY
          };
        },
        isSortable: true,
        export: async (wrapper: TaskWrapperData) => wrapper.attributes.priority + ''
      },
      {
        id: TaskTableCol.MAX_AGENTS,
        dataKey: 'maxAgents',
        editable: (wrapper: TaskWrapperData) => {
          return {
            data: wrapper,
            value: wrapper.attributes.maxAgents + '',
            action: TaskTableEditableAction.CHANGE_MAX_AGENTS
          };
        },
        isSortable: true,
        export: async (wrapper: TaskWrapperData) => wrapper.attributes.maxAgents + ''
      },
      {
        id: TaskTableCol.PREPROCESSOR,
        dataKey: 'preprocessorId',
        render: (wrapper: TaskWrapperData) =>
          wrapper.attributes.taskType === 0 && wrapper.attributes.tasks[0].attributes.preprocessorId === 1
            ? 'Prince'
            : '',
        isSortable: false,
        export: async (wrapper: TaskWrapperData) =>
          wrapper.attributes.taskType === 0 && wrapper.attributes.tasks[0].attributes.preprocessorId === 1
            ? 'Prince'
            : ''
      },
      {
        id: TaskTableCol.IS_SMALL,
        dataKey: 'isSmall',
        icons: (wrapper: TaskWrapperData) => this.renderIsSmallIcon(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapperData) =>
          wrapper.attributes.taskType === 0
            ? wrapper.attributes.tasks[0].attributes.isSmall
              ? 'Yes'
              : 'No'
            : ''
      },
      {
        id: TaskTableCol.IS_CPU_TASK,
        dataKey: 'isCpuTask',
        icons: (wrapper: TaskWrapperData) => this.renderIsCpuTaskIcon(wrapper),
        isSortable: false,
        export: async (wrapper: TaskWrapperData) =>
          wrapper.attributes.taskType === 0
            ? wrapper.attributes.tasks[0].attributes.isCpuTask
              ? 'Yes'
              : 'No'
            : ''
      }
    ];

    return tableColumns;
  }

  rowActionClicked(event: ActionMenuEvent<TaskWrapperData>): void {
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

  getRowDeleteLabel(data: TaskWrapperData): any {
    return {
      ...data,
      taskName: data.attributes.taskType === 1 ? data.attributes.taskWrapperName : data.attributes.tasks[0].attributes.taskName
    };
  }

  bulkActionClicked(event: ActionMenuEvent<TaskWrapperData[]>): void {
    let superTasksCount = 0;
    let tasksCount = 0;

    // Preprocess the data and count the occurrences of each type
    const updatedData:TaskWrapperData[] = event.data.map((taskWrapper: TaskWrapperData) => {
      if (taskWrapper.attributes.taskType === 1) {
        superTasksCount++;
        return { ...taskWrapper, taskName: taskWrapper.attributes.taskWrapperName };
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

  exportActionClicked(event: ActionMenuEvent<TaskWrapperData[]>): void {
    switch (event.menuItem.action) {
      case ExportMenuAction.EXCEL:
        this.exportService.toExcel<TaskWrapperData>(
          'hashtopolis-tasks',
          this.tableColumns,
          event.data,
          TaskTableColumnLabel
        );
        break;
      case ExportMenuAction.CSV:
        this.exportService.toCsv<TaskWrapperData>(
          'hashtopolis-tasks',
          this.tableColumns,
          event.data,
          TaskTableColumnLabel
        );
        break;
      case ExportMenuAction.COPY:
        this.exportService
          .toClipboard<TaskWrapperData>(
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

  openDialog(data: DialogData<TaskWrapperData>) {
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

  private async getTaskStatus(wrapper: TaskWrapperData): Promise<TaskStatus> {
    if (wrapper.attributes.taskType === 0 && wrapper.attributes.tasks.length > 0) {
      const cd: ChunkDataData = await this.getChunkData(wrapper);
      const speed = cd.speed;

      if (speed > 0) {
        return TaskStatus.RUNNING;
      } else if (
        wrapper.attributes.tasks[0].attributes.keyspaceProgress >= wrapper.attributes.tasks[0].attributes.keyspace &&
        wrapper.attributes.tasks[0].attributes.keyspaceProgress > 0
      ) {
        return TaskStatus.COMPLETED;
      } else {
        return TaskStatus.IDLE;
      }
    }

    return TaskStatus.INVALID;
  }

  async getDispatchedSearchedString(wrapper: TaskWrapperData): Promise<string> {
    if (wrapper.attributes.taskType === 0) {
      const task: TaskData = wrapper.attributes.tasks[0];
      if (task.attributes.keyspace > 0) {
        const cd: ChunkDataData = await this.getChunkData(wrapper);
        const disp = (cd.dispatched * 100).toFixed(2);
        const sear = (cd.searched * 100).toFixed(2);

        return `${disp}% / ${sear}%`;
      }
    }
    return '';
  }

  // --- Render functions ---

  @Cacheable(['id', 'taskType'])
  async renderTaskWrapperLink(
    wrapper: TaskWrapperData
  ): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];

    if (wrapper.attributes.taskType === 0) {
      for (const task of wrapper.attributes.tasks) {
        const taskName =
          task.attributes.taskName?.length > 40
            ? `${task.attributes.taskName.substring(40)}...`
            : task.attributes.taskName;

        links.push({
          label: taskName,
          routerLink: ['/tasks', 'show-tasks', task.id, 'edit'],
          tooltip: task.attributes.attackCmd
        });
      }
    } else if (wrapper.attributes.taskType === 1) {
      const taskWrapperName =
        wrapper.attributes.taskWrapperName.length > 40
          ? `${wrapper.attributes.taskWrapperName.substring(40)}...`
          : wrapper.attributes.taskWrapperName;

      links.push({
        label: taskWrapperName,
        routerLink: ['/tasks', 'show-subtasks', wrapper.id],
        tooltip: 'Supertask'
      });
    }

    return links;
  }

  @Cacheable(['id', 'taskType', 'hashlists'])
  override async renderHashlistLink(
    wrapper: TaskWrapperData
  ): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];

    if (wrapper && wrapper.attributes.hashlists && wrapper.attributes.hashlists.length > 0) {
      links.push({
        label: wrapper.attributes.hashlists[0].attributes.name,
        routerLink: [
          '/hashlists',
          'hashlist',
          wrapper.attributes.hashlists[0].id,
          'edit'
        ]
      });
    }

    return links;
  }

  @Cacheable(['id', 'taskType', 'tasks'])
  async renderStatusIcons(wrapper: TaskWrapperData): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];
    const status = await this.getTaskStatus(wrapper);
    if (wrapper.attributes.taskType === 0) {
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
      const countCompleted = wrapper.attributes.tasks.reduce((count, task) => {
        return count;
      }, 0);

      if (wrapper.attributes.tasks.length === countCompleted) {
        icons.push({
          name: 'check',
          tooltip: 'Completed'
        });
      }
    }

    return icons;
  }

  @Cacheable(['_id', 'isSmall'])
  async renderIsSmallIcon(wrapper: TaskWrapperData): Promise<HTTableIcon[]> {
    return this.renderBoolIcon(wrapper, 'isSmall');
  }

  @Cacheable(['id', 'isCpuTask'])
  async renderIsCpuTaskIcon(wrapper: TaskWrapperData): Promise<HTTableIcon[]> {
    return this.renderBoolIcon(wrapper, 'isCpuTask');
  }

  @Cacheable(['id', 'taskType'])
  async renderTaskTypeIcon(wrapper: TaskWrapperData): Promise<HTTableIcon[]> {
    return this.renderBoolIcon(wrapper, 'taskType', 1);
  }

  private renderBoolIcon(
    wrapper: TaskWrapperData,
    key: string,
    equals: any = ''
  ): HTTableIcon[] {
    const icons: HTTableIcon[] = [];
    if (wrapper.attributes.taskType === 0) {
      const task: TaskData = wrapper.attributes.tasks[0];
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

  @Cacheable(['id', 'taskType', 'tasks'])
  async renderDispatchedSearched(wrapper: TaskWrapperData): Promise<SafeHtml> {
    const html = await this.getDispatchedSearchedString(wrapper);
    return this.sanitize(html);
  }

  @Cacheable(['id', 'taskType', 'tasks'])
  override async renderCrackedLink(
    wrapper: TaskWrapperData
  ): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (wrapper.attributes.taskType === 0) {
      const cd: ChunkDataData = await this.getChunkData(wrapper);
      links.push({
        label: cd.cracked + '',
        routerLink: ['/hashlists', 'hashes', 'tasks', wrapper.attributes.tasks[0].id]
      });
    }

    return links;
  }

  async getNumAgents(wrapper: TaskWrapperData): Promise<number> {
    if (wrapper.attributes.taskType === 0) {
      const cd: ChunkDataData = await this.getChunkData(wrapper);
      return cd.agents.length;
    }

    return 0;
  }

  @Cacheable(['id', 'taskType', 'tasks'])
  async renderAgents(wrapper: TaskWrapperData): Promise<SafeHtml> {
    const numAgents = await this.getNumAgents(wrapper);
    return this.sanitize(`${numAgents}`);
  }

  @Cacheable(['id', 'taskType', 'tasks'])
  async renderSpeed(wrapper: TaskWrapperData): Promise<SafeHtml> {
    let html = '';
    if (wrapper.attributes.taskType === 0) {
      const cd: ChunkDataData = await this.getChunkData(wrapper);
      html = cd.speed > 0 ? `${cd.speed}&nbsp;H/s` : '';
    }
    return this.sanitize(html);
  }

  // --- Action functions ---

  private rowActionEdit(task: TaskWrapperData): void {
    this.router.navigate(['tasks', 'show-tasks', task.attributes.tasks[0].id, 'edit']);
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionArchive(wrapper: TaskWrapperData[], isArchived: boolean): void {
    const requests = wrapper.map((w: TaskWrapperData) => {
      return this.gs.update(SERV.TASKS, w.attributes.tasks[0].id, {
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

  private bulkActionDelete(wrapper: TaskWrapperData[]): void {
    const requests = wrapper.map((w: TaskWrapperData) => {
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
          this.snackBar.open(
            `Successfully deleted ${results.length} tasks!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  private rowActionDelete(wrapper: TaskWrapperData): void {
    console.log(wrapper);
    this.subscriptions.push(
      this.gs.delete(SERV.TASKS_WRAPPER, wrapper[0].id).subscribe(() => {
        this.snackBar.open('Successfully deleted task!', 'Close');
        this.reload();
      })
    );
  }

  private rowActionCopyToTask(wrapper: TaskWrapperData): void {
    this.router.navigate(['tasks', 'new-tasks', wrapper.attributes.tasks[0].id, 'copy']);
  }

  private rowActionCopyToPretask(wrapper: TaskWrapperData): void {
    this.router.navigate([
      'tasks',
      'preconfigured-tasks',
      wrapper.attributes.tasks[0].id,
      'copytask'
    ]);
  }

  private rowActionArchive(wrapper: TaskWrapperData): void {
    this.updateIsArchived(wrapper.attributes.tasks[0].id, true);
  }

  private rowActionUnarchive(wrapper: TaskWrapperData): void {
    this.updateIsArchived(wrapper.attributes.tasks[0].id, false);
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

  editableSaved(editable: HTTableEditable<TaskWrapperData>): void {
    switch (editable.action) {
      case TaskTableEditableAction.CHANGE_PRIORITY:
        this.changePriority(editable.data, editable.value);
        break;
      case TaskTableEditableAction.CHANGE_MAX_AGENTS:
        this.changeMaxAgents(editable.data, editable.value);
        break;
    }
  }

  private changePriority(wrapper: TaskWrapperData, priority: string): void {
    let val = 0;
    try {
      val = parseInt(priority);
    } catch (error) {
      // Do nothing
    }

    if (!val || wrapper.attributes.priority == val) {
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
          this.snackBar.open(
            `Changed prio to ${val} on Task #${wrapper.attributes.tasks[0].id}!`,
            'Close'
          );
          this.reload();
        })
    );
  }

  private changeMaxAgents(wrapper: TaskWrapperData, max: string): void {
    let val = 0;
    try {
      val = parseInt(max);
    } catch (error) {
      // Do nothing
    }

    if (!val || wrapper.attributes.maxAgents == val) {
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
          this.snackBar.open(
            `Changed number of max agents to ${val} on Task #${wrapper.attributes.tasks[0].id}!`,
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
   * @param {TaskWrapperData} wrapper - The task wrapper containing the task for which chunk data is requested.
   * @returns {Promise<ChunkData>} - A promise that resolves to the chunk data associated with the specified task.
   *
   * @remarks
   * This function uses a locking mechanism to ensure that concurrent calls for the same task ID
   * do not interfere with each other. If another call is already fetching or has fetched
   * the chunk data for the same task ID, subsequent calls will wait for the operation to complete
   * before proceeding.
   */
  private async getChunkData(wrapper: TaskWrapperData): Promise<ChunkDataData> {
    const task: TaskData = wrapper.attributes.tasks[0];

    if (!this.chunkDataLock[task.id]) {
      // If there is no lock, create a new one
      this.chunkDataLock[task.id] = (async () => {
        if (!(task.id in this.chunkData)) {
          // Inside the lock, await the asynchronous operation
          this.chunkData[task.id] = await this.dataSource.getChunkData(
            task.id,
            false,
            task.attributes.keyspace
          );
        }

        // Release the lock when the operation is complete
        delete this.chunkDataLock[task.id];
      })();
    }

    // Wait for the lock to be released before returning the data
    await this.chunkDataLock[task.id];
    return this.chunkData[task.id];
  }
}
