import { Observable, catchError, of } from 'rxjs';

import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

import { ChunkData } from '@models/chunk.model';
import { JHashlist } from '@models/hashlist.model';
import { JTask, JTaskWrapper, TaskAttributes, TaskType } from '@models/task.model';

import { TaskContextMenuService } from '@services/context-menu/tasks/task-menu.service';
import { SERV, ServiceConfig } from '@services/main.config';

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
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import {
  TaskStatus,
  TaskTableCol,
  TaskTableColumnLabel,
  TaskTableEditableAction
} from '@components/tables/tasks-table/tasks-table.constants';

import { TasksDataSource } from '@datasources/tasks.datasource';

import { Filter, FilterType } from '@src/app/core/_models/request-params.model';
import { convertToLocale } from '@src/app/shared/utils/util';
import { ModalSubtasksComponent } from '@src/app/tasks/show-tasks/modal-subtasks/modal-subtasks.component';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  standalone: false
})
export class TasksTableComponent extends BaseTableComponent implements OnInit, OnDestroy, AfterViewInit {
  private _hashlistId: number;

  @Input()
  set hashlistId(value: number) {
    if (value !== this._hashlistId) {
      this._hashlistId = value;
    }
  }
  get hashlistId(): number {
    if (this._hashlistId === undefined) {
      return 0;
    } else {
      return this._hashlistId;
    }
  }
  tableColumns: HTTableColumn[] = [];
  dataSource: TasksDataSource;
  isArchived = false;
  selectedFilterColumn: string;

  ngOnInit(): void {
    this.setColumnLabels(TaskTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new TasksDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setIsArchived(this.isArchived);
    this.dataSource.setHashlistID(this.hashlistId);
    this.contextMenuService = new TaskContextMenuService(this.permissionService).addContextMenu();
  }

  ngAfterViewInit(): void {
    this.dataSource.loadAll();
    if (this.dataSource.autoRefreshService.refreshPage) {
      this.dataSource.startAutoRefresh();
    }
  }

  ngOnDestroy(): void {
    this.dataSource.stopAutoRefresh();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
  filter(input: string) {
    const selectedColumn = this.selectedFilterColumn;
    if (input && input.length > 0) {
      this.dataSource.loadAll({ value: input, field: selectedColumn, operator: FilterType.ICONTAINS });
      return;
    } else {
      this.dataSource.loadAll(); // Reload all data if input is empty
    }
  }
  handleBackendSqlFilter(event: string) {
    const filterQuery: Filter = { value: event, field: this.selectedFilterColumn, operator: FilterType.ICONTAINS };
    this.filter(event);
    this.dataSource.setFilterQuery(filterQuery);
  }
  getColumns(): HTTableColumn[] {
    const columns: HTTableColumn[] = [];

    columns.push(
      {
        id: TaskTableCol.ID,
        dataKey: 'taskWrapperId',
        isSortable: true,
        isSearchable: true,
        export: async (wrapper: JTaskWrapper) => {
          return wrapper.taskType === TaskType.TASK ? wrapper.tasks[0]?.id + '' : '';
        },
        render: (wrapper: JTaskWrapper) => {
          return wrapper.taskType === TaskType.TASK ? wrapper.tasks[0]?.id + '' : '';
        }
      },
      {
        id: TaskTableCol.TASK_TYPE,
        dataKey: 'taskType',
        render: (wrapper: JTaskWrapper) => (wrapper.taskType === TaskType.TASK ? 'Task' : '<b>SuperTask</b>'),
        export: async (wrapper: JTaskWrapper) => (wrapper.taskType === TaskType.TASK ? 'Task' : 'Supertask' + '')
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
        icon: (wrapper: JTaskWrapper) => this.renderStatusIcons(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) => {
          const status = wrapper.tasks[0]?.status;
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
          const type = wrapper.hashType;

          return type ? `${type.id} - ${type.description}` : '';
        },

        export: async (wrapper: JTaskWrapper) => {
          const type = wrapper.hashType;

          return type ? `${type.id} - ${type.description}` : '';
        }
      },

      {
        id: TaskTableCol.HASHLISTS,
        dataKey: 'hashlistId',
        routerLink: (wrapper: JTaskWrapper) => this.renderHashlistLinkFromWrapper(wrapper),
        icon: (wrapper: JTaskWrapper) => {
          if (wrapper.hashlist) {
            this.renderHashlistIcon(wrapper.hashlist);
          } else {
            return undefined;
          }
        },
        isSortable: false,
        export: async (wrapper: JTaskWrapper) => {
          if (wrapper.hashlist) {
            return wrapper.hashlist.name + '';
          } else {
            return wrapper.hashlistId + ' -';
          }
        }
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
        isSortable: false,
        render: (wrapper: JTaskWrapper) => {
          if (wrapper.taskType === TaskType.TASK) {
            return wrapper.tasks[0]?.activeAgents + '';
          } else {
            return '';
          }
        },
        export: async (wrapper: JTaskWrapper) => (wrapper.tasks[0]?.activeAgents ?? 0) + ''
      },
      {
        id: TaskTableCol.ACCESS_GROUP,
        dataKey: 'accessGroupName',
        routerLink: (wrapper: JTaskWrapper) => this.renderAccessGroupLink(wrapper.accessGroup),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) => wrapper.accessGroup.groupName
      },
      {
        id: TaskTableCol.PREPROCESSOR,
        dataKey: 'preprocessorId',
        render: (wrapper: JTaskWrapper) =>
          wrapper.taskType === TaskType.TASK && wrapper.tasks[0].preprocessorId === 1 ? 'Prince' : '',
        isSortable: false,
        export: async (wrapper: JTaskWrapper) =>
          wrapper.taskType === TaskType.TASK && wrapper.tasks[0].preprocessorId === 1 ? 'Prince' : ''
      },
      {
        id: TaskTableCol.IS_SMALL,
        dataKey: 'isSmall',
        icon: (wrapper: JTaskWrapper) => this.renderIsSmallIcon(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) =>
          wrapper.taskType === TaskType.TASK ? (wrapper.tasks[0].isSmall ? 'Yes' : 'No') : ''
      },
      {
        id: TaskTableCol.IS_CPU_TASK,
        dataKey: 'isCpuTask',
        icon: (wrapper: JTaskWrapper) => this.renderIsCpuTaskIcon(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) =>
          wrapper.taskType === TaskType.TASK ? (wrapper.tasks[0].isCpuTask ? 'Yes' : 'No') : ''
      }
    );

    if (this.tasksRoleService.hasRole('edit')) {
      columns.push(
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
              value: wrapper.taskType === TaskType.TASK ? wrapper.tasks[0]?.maxAgents + '' : wrapper.maxAgents + '',
              action: TaskTableEditableAction.CHANGE_MAX_AGENTS
            };
          },
          isSortable: false,
          export: async (wrapper: JTaskWrapper) => wrapper.tasks[0]?.maxAgents + ''
        }
      );
    } else {
      columns.push(
        {
          id: TaskTableCol.PRIORITY,
          dataKey: 'priority',
          render: (wrapper: JTaskWrapper) => wrapper.priority + '',
          isSortable: true,
          export: async (wrapper: JTaskWrapper) => wrapper.priority + ''
        },
        {
          id: TaskTableCol.MAX_AGENTS,
          dataKey: 'maxAgents',
          render: (wrapper: JTaskWrapper) =>
            wrapper.taskType === TaskType.TASK ? wrapper.tasks[0]?.maxAgents + '' : wrapper.maxAgents + '',
          isSortable: false,
          export: async (wrapper: JTaskWrapper) =>
            wrapper.taskType === TaskType.TASK ? wrapper.tasks[0]?.maxAgents + '' : wrapper.maxAgents + ''
        }
      );
    }

    return columns;
  }

  //Evaluate which row class should be set
  getRowClass = (row: JTaskWrapper) => (this.isCrackedRow(row) ? 'row-cracked' : '');

  /**
   * Handles row action events triggered from the action menu.
   * It processes the selected task and performs actions based on the action type.
   * @param event The action menu event containing the selected task and action.
   */
  rowActionClicked(event: ActionMenuEvent<JTaskWrapper>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT_TASKS:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.SHOW_SUBTASKS:
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

  /**
   * Prepares the task wrapper data for deletion by setting the appropriate task name.
   * If the task type is SUPERTASK or there are no tasks, it uses the taskWrapperName.
   * Otherwise, it uses the name of the first (and only) task in the tasks array.
   * @param data The task wrapper data to be processed.
   * @returns The modified task wrapper data with the correct task name for deletion.
   */
  getRowDeleteLabel(data: JTaskWrapper): JTaskWrapper {
    return {
      ...data,
      taskName:
        data.taskType === TaskType.SUPERTASK || data.tasks.length === 0 ? data.taskWrapperName : data.tasks[0].taskName
    };
  }

  /**
   * Handles bulk action events triggered from the action menu.
   * It processes the selected tasks, counts supertasks and tasks,
   * and opens a confirmation dialog based on the selected action (archive or delete).
   * @param event The action menu event containing the selected tasks and action.
   */
  bulkActionClicked(event: ActionMenuEvent<JTaskWrapper[]>): void {
    let superTasksCount = 0;
    let tasksCount = 0;

    const updatedData: JTaskWrapper[] = event.data.map((taskWrapper: JTaskWrapper) => {
      let taskName: string;

      // Determine if the task wrapper is a supertask or normal task and take the appropriate task name
      switch (taskWrapper.taskType) {
        case TaskType.SUPERTASK:
          superTasksCount++;
          taskName = taskWrapper.taskWrapperName;

          break;
        case TaskType.TASK:
          tasksCount++;
          taskName = taskWrapper.tasks[0]?.taskName ?? taskWrapper.taskWrapperName;
      }

      return {
        ...taskWrapper,
        taskName
      };
    });

    // Build the label shown in the dialog title based on the counts of supertasks and tasks
    const superTasksLabel = superTasksCount === 1 ? 'supertask' : 'supertasks';
    const tasksLabel = tasksCount === 1 ? 'task' : 'tasks';

    const label =
      superTasksCount > 0 && tasksCount > 0
        ? `${tasksCount} ${tasksLabel} and ${superTasksCount} ${superTasksLabel}`
        : superTasksCount > 0
          ? `${superTasksCount} ${superTasksLabel}`
          : `${tasksCount} ${tasksLabel}`;

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

  /**
   * Handles export action events triggered from the action menu.
   * It utilizes the export service to process the selected tasks and export them
   * based on the defined table columns and labels.
   * @param event The action menu event containing the selected tasks for export.
   */
  exportActionClicked(event: ActionMenuEvent<JTaskWrapper[]>): void {
    this.exportService.handleExportAction<JTaskWrapper>(
      event,
      this.tableColumns,
      TaskTableColumnLabel,
      'hashtopolis-tasks'
    );
  }

  /**
   * Opens a dialog with the provided data.
   * After the dialog is closed, it processes the result and performs actions based on the user's choice.
   * @param data The data to be passed to the dialog, including title, body, rows, and action.
   */
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

  /**
   * Sets the archived state of the tasks and reloads the data source accordingly.
   * @param isArchived  A `boolean` indicating whether to `archive (true)` or `unarchive (false)` the tasks.
   */
  setIsArchived(isArchived: boolean): void {
    this.isArchived = isArchived;
    this.dataSource.reset(true);
    this.dataSource.setIsArchived(isArchived);
    this.dataSource.loadAll();
  }

  /**
   * Generates a string representing the dispatched and searched percentages for a given task wrapper.
   * If the task wrapper is of type TASK and has a valid keyspace, it returns a formatted string.
   * Otherwise, it returns an empty string.
   * @param wrapper The task wrapper object containing task details.
   * @returns A string in the format "dispatched% / searched%" or an empty string if not applicable.
   */
  getDispatchedSearchedString(wrapper: JTaskWrapper): string {
    if (wrapper.taskType === TaskType.TASK) {
      const task: JTask = wrapper.tasks[0];
      if (task != null && task.keyspace > 0) {
        return `${convertToLocale(Number(task.dispatched))}% / ${convertToLocale(Number(task.searched))}%`;
      }
    }
    return '';
  }

  // --- Render functions ---

  renderStatusIcons(wrapper: JTaskWrapper): HTTableIcon {
    let icon: HTTableIcon = { name: '' };
    const status = this.getTaskStatus(wrapper);
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
    if (wrapper.taskType === TaskType.TASK && wrapper.tasks.length > 0) {
      const chunkData: ChunkData = wrapper.chunkData;
      if (chunkData) {
        const speed = chunkData.speed;

        if (speed > 0) {
          return TaskStatus.RUNNING;
        } else if (
          (wrapper.tasks[0].keyspaceProgress >= wrapper.tasks[0].keyspace &&
            wrapper.tasks[0].keyspaceProgress > 0 &&
            Number(wrapper.tasks[0].searched) === 100) ||
          wrapper.tasks.find(
            (task: JTask) =>
              task.keyspaceProgress >= task.keyspace && task.keyspaceProgress > 0 && Number(task.searched) === 100
          )
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
    if (wrapper.taskType === TaskType.TASK) {
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
    if (this.checkValidTask(task)) {
      this.router.navigate(['tasks', 'show-tasks', task.tasks[0].id, 'edit']);
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionArchive(wrappers: JTaskWrapper[], isArchived: boolean): void {
    const action = isArchived ? 'archived' : 'unarchived';
    const tasks = [];
    for (const wrapper of wrappers) {
      tasks.push(wrapper.tasks[0]);
    }

    this.subscriptions.push(
      this.gs.bulkUpdate(SERV.TASKS, tasks, { isArchived: isArchived }).subscribe(() => {
        this.alertService.showSuccessMessage(`Successfully ${action} tasks!`);
        this.reload();
      })
    );
  }

  private bulkActionDelete(wrapper: JTaskWrapper[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(SERV.TASKS_WRAPPER, wrapper)
        .pipe(
          catchError((error) => {
            console.error('Error during deletion: ', error);
            return [];
          })
        )
        .subscribe(() => {
          this.alertService.showSuccessMessage(`Successfully deleted task!`);
          this.dataSource.reload();
        })
    );
  }

  private rowActionDelete(wrapper: JTaskWrapper): void {
    this.subscriptions.push(
      this.gs.delete(SERV.TASKS_WRAPPER, wrapper[0].id).subscribe(() => {
        this.alertService.showSuccessMessage('Successfully deleted task!');
        this.reload();
      })
    );
  }

  private rowActionCopyToTask(wrapper: JTaskWrapper): void {
    if (this.checkValidTask(wrapper)) {
      this.router.navigate(['tasks', 'new-tasks', wrapper.tasks[0].id, 'copy']);
    }
  }

  private rowActionCopyToPretask(wrapper: JTaskWrapper): void {
    if (this.checkValidTask(wrapper)) {
      this.router.navigate(['tasks', 'preconfigured-tasks', wrapper.tasks[0].id, 'copytask']);
    }
  }

  private rowActionArchive(wrapper: JTaskWrapper): void {
    if (this.checkValidTask(wrapper)) {
      this.updateIsArchived(wrapper.tasks[0].id, true);
    }
  }

  private rowActionUnarchive(wrapper: JTaskWrapper): void {
    if (this.checkValidTask(wrapper)) {
      this.updateIsArchived(wrapper.tasks[0].id, false);
    }
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

  // Function to check if a task is invalid, by checking if a taskwrapper has a task and show an error.
  // This state should not happen but since there are no database constraints this can't be enforced.
  private checkValidTask(wrapper: JTaskWrapper): boolean {
    if (wrapper.tasks.length === 0) {
      this.alertService.showErrorMessage(
        "Invalid task, the taskwrapper doesn't have a task. It is probably best to delete this taskwrapper"
      );
      return false;
    } else {
      return true;
    }
  }

  private changePriority(wrapper: JTaskWrapper, priority: string): void {
    let val = 0;
    try {
      val = parseInt(priority);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }
    let task: TaskAttributes;
    let serv: ServiceConfig;

    if (wrapper.taskType === TaskType.TASK) {
      if (!wrapper.tasks || wrapper.tasks.length === 0) {
        this.alertService.showErrorMessage(
          "Invalid task, the taskwrapper doesn't have a task. It is probably best to delete this taskwrapper"
        );
      }
      task = wrapper.tasks[0];
      serv = SERV.TASKS;
    } else {
      task = wrapper;
      serv = SERV.TASKS_WRAPPER;
    }

    if (!val || task.priority == val) {
      this.alertService.showInfoMessage('Nothing changed');
      return;
    }

    const request$ = this.gs.update(serv, task.id, {
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
          this.alertService.showSuccessMessage(`Changed prio to ${val} on Task #${task.id}!`);
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
    let task: TaskAttributes;
    let serv: ServiceConfig;

    if (wrapper.taskType === TaskType.TASK) {
      if (!wrapper.tasks || wrapper.tasks.length === 0) {
        this.alertService.showErrorMessage(
          "Invalid task, the taskwrapper doesn't have a task. It is probably best to delete this taskwrapper"
        );
      }
      task = wrapper.tasks[0];
      serv = SERV.TASKS;
    } else {
      task = wrapper;
      serv = SERV.TASKS_WRAPPER;
    }

    if (!val || task.maxAgents == val) {
      this.alertService.showInfoMessage('Nothing changed');
      return;
    }

    const request$ = this.gs.update(serv, task.id, {
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
          this.alertService.showSuccessMessage(`Changed number of max agents to ${val} on Task #${task.id}!`);
          this.reload();
        })
    );
  }

  /**
   * Render router links for any type of tasks for a task wrapper object
   * @param wrapper - the task wrapper object to render the link for
   * @return observable containing an array of router links to be rendered in HTML
   * @private
   */
  private renderTaskWrapperLink(wrapper: JTaskWrapper): Observable<HTTableRouterLink[]> {
    if (wrapper.taskType === TaskType.TASK) {
      const task = wrapper.tasks?.[0];
      const taskName = task?.taskName?.length > 40 ? `${task.taskName.substring(0, 40)}...` : task?.taskName;

      return of([
        {
          label: taskName,
          routerLink: ['/tasks', 'show-tasks', task?.id, 'edit'],
          tooltip: task?.attackCmd ?? ''
        }
      ]);
    } else {
      // Supertask: No link
      return of([
        {
          label: wrapper.taskWrapperName,
          routerLink: null,
          tooltip: ''
        }
      ]);
    }
  }

  /**
   * Render router links for hashlists for a task wrapper object
   * @param wrapper - the task wrapper object to render the link for
   * @return observable containing an array of router links to be rendered in HTML
   * @private
   */
  private renderHashlistLinkFromWrapper(wrapper: JTaskWrapper): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];

    if (wrapper) {
      const id = wrapper.hashlist?.id ?? wrapper.hashlistId;
      const name = wrapper.hashlist?.name?.trim();

      links.push({
        routerLink: ['/hashlists', 'hashlist', id, 'edit'],
        label: name || String(id)
      });
    }
    return of(links);
  }

  /**
   * Renders checkmark icon, if all hashes of hashlist are cracked
   * @param hashlist Hashlist object
   * @private
   */
  private renderHashlistIcon(hashlist: JHashlist): HTTableIcon | undefined {
    const allHashesCracked = hashlist.hashCount === hashlist.cracked;

    if (allHashesCracked) {
      return {
        name: 'check',
        tooltip: 'All hashes cracked'
      };
    }
    return undefined;
  }

  /**
   * Checks whether the TaskWrapper contains cracked elements
   * @param wrapper TaskWrapper object
   * @private
   */
  private isCrackedRow(wrapper: JTaskWrapper): boolean {
    return wrapper.cracked > 0;
  }
}
