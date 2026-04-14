import { Observable, catchError, of } from 'rxjs';

import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { JTaskWrapperDisplay, TaskStatus, TaskType } from '@models/task.model';

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
  TaskTableCol,
  TaskTableColumnLabel,
  TaskTableEditableAction
} from '@components/tables/tasks-table/tasks-table.constants';

import { TasksDataSource } from '@datasources/tasks.datasource';

import { Filter, FilterType } from '@src/app/core/_models/request-params.model';
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
  selectedFilterColumn: HTTableColumn;

  ngOnInit(): void {
    this.setColumnLabels(TaskTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new TasksDataSource(this.injector);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setIsArchived(this.isArchived);
    this.dataSource.setHashlistID(this.hashlistId);
    this.contextMenuService = new TaskContextMenuService(this.permissionService).addContextMenu();
    // Setup filter error handling
    this.setupFilterErrorSubscription(this.dataSource);
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
      this.dataSource.loadAll({
        value: input,
        field: selectedColumn.dataKey,
        operator: FilterType.ICONTAINS,
        parent: selectedColumn.parent
      });
      return;
    } else {
      this.dataSource.loadAll(); // Reload all data if input is empty
    }
  }
  handleBackendSqlFilter(event: string) {
    const filterQuery: Filter = {
      value: event,
      field: this.selectedFilterColumn.dataKey,
      operator: FilterType.ICONTAINS,
      parent: this.selectedFilterColumn.parent
    };
    this.filter(event);
    this.dataSource.setFilterQuery(filterQuery);
  }
  getColumns(): HTTableColumn[] {
    const columns: HTTableColumn[] = [];

    columns.push(
      {
        id: TaskTableCol.ID,
        dataKey: 'taskWrapperId',
        render: (wrapper: JTaskWrapperDisplay) => (wrapper.taskType === TaskType.TASK ? wrapper.taskId + '' : ''),
        isSortable: true,
        isSearchable: true,
        export: async (wrapper: JTaskWrapperDisplay) => {
          return wrapper.taskType === TaskType.TASK ? wrapper.taskId + '' : '';
        }
      },
      {
        id: TaskTableCol.TASK_TYPE,
        dataKey: 'taskType',
        render: (wrapper: JTaskWrapperDisplay) => (wrapper.taskType === TaskType.TASK ? 'Task' : '<b>SuperTask</b>'),
        export: async (wrapper: JTaskWrapperDisplay) =>
          wrapper.taskType === TaskType.TASK ? 'Task' : 'Supertask' + '',
        isSortable: true
      },
      {
        id: TaskTableCol.NAME,
        dataKey: 'displayName',
        routerLink: (wrapper: JTaskWrapperDisplay) => this.renderTaskWrapperLink(wrapper),
        isSortable: true,
        isSearchable: true,
        export: async (wrapper: JTaskWrapperDisplay) => wrapper.displayName
      },
      {
        id: TaskTableCol.STATUS,
        dataKey: 'keyspaceProgress',
        icon: (wrapper: JTaskWrapperDisplay) => this.renderStatusIcons(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapperDisplay) => this.getTaskStatusLabel(wrapper)
      },
      {
        id: TaskTableCol.HASHTYPE,
        dataKey: 'hashtype',
        isSortable: false,

        render: (wrapper: JTaskWrapperDisplay) => {
          return wrapper.hashTypeId !== undefined && wrapper.hashTypeDescription
            ? this.sanitize(`${wrapper.hashTypeId} - ${wrapper.hashTypeDescription}`)
            : '';
        },

        export: async (wrapper: JTaskWrapperDisplay) => {
          return wrapper.hashTypeId !== undefined && wrapper.hashTypeDescription
            ? `${wrapper.hashTypeId} - ${wrapper.hashTypeDescription}`
            : '';
        }
      },

      {
        id: TaskTableCol.HASHLISTS,
        dataKey: 'hashlistId',
        parent: 'hashlist',
        routerLink: (wrapper: JTaskWrapperDisplay) => this.renderHashlistLinkFromWrapper(wrapper),
        icon: (wrapper: JTaskWrapperDisplay) => {
          const allHashesCracked =
            wrapper.hashCount && wrapper.hashlistCracked && wrapper.hashCount === wrapper.hashlistCracked;
          if (allHashesCracked) {
            return {
              name: 'check',
              tooltip: 'All hashes cracked'
            };
          } else {
            return undefined;
          }
        },
        isSortable: true,
        export: async (wrapper: JTaskWrapperDisplay) => {
          return wrapper.hashlistName || wrapper.hashlistId + '';
        }
      },
      {
        id: TaskTableCol.CRACKED,
        dataKey: 'cracked',
        routerLink: (wrapper: JTaskWrapperDisplay) => this.renderCrackedLinkFromWrapper(wrapper),
        isSortable: true,
        export: async (wrapper: JTaskWrapperDisplay) => wrapper.cracked + ''
      },
      {
        id: TaskTableCol.AGENTS,
        dataKey: 'agents',
        isSortable: false,
        render: (wrapper: JTaskWrapperDisplay) => {
          if (wrapper.taskType === TaskType.TASK) {
            return wrapper.taskMaxAgents + '';
          } else {
            return '';
          }
        },
        export: async (wrapper: JTaskWrapperDisplay) =>
          (wrapper.taskType === TaskType.TASK ? wrapper.taskMaxAgents : 0) + ''
      },
      {
        id: TaskTableCol.ACCESS_GROUP,
        dataKey: 'groupName',
        parent: 'accessGroup',
        isSortable: true,
        routerLink: (wrapper: JTaskWrapperDisplay) =>
          this.renderAccessGroupLinkFromId(wrapper.accessGroupId, wrapper.groupName),
        export: async (wrapper: JTaskWrapperDisplay) => wrapper.groupName
      },
      {
        id: TaskTableCol.PREPROCESSOR,
        dataKey: 'preprocessorId',
        render: (wrapper: JTaskWrapperDisplay) =>
          wrapper.taskType === TaskType.TASK && wrapper.taskUsePreprocessor === 1 ? 'Prince' : '',
        isSortable: false,
        export: async (wrapper: JTaskWrapperDisplay) =>
          wrapper.taskType === TaskType.TASK && wrapper.taskUsePreprocessor === 1 ? 'Prince' : ''
      },
      {
        id: TaskTableCol.IS_SMALL,
        dataKey: 'isSmall',
        parent: 'task',
        icon: (wrapper: JTaskWrapperDisplay) => this.renderIsSmallIcon(wrapper),
        isSortable: true,
        export: async (wrapper: JTaskWrapperDisplay) =>
          wrapper.taskType === TaskType.TASK ? (wrapper.isSmall === 1 ? 'Yes' : 'No') : ''
      },
      {
        id: TaskTableCol.IS_CPU_TASK,
        dataKey: 'isCpuTask',
        parent: 'task',
        icon: (wrapper: JTaskWrapperDisplay) => this.renderIsCpuTaskIcon(wrapper),
        isSortable: true,
        export: async (wrapper: JTaskWrapperDisplay) =>
          wrapper.taskType === TaskType.TASK ? (wrapper.isCpuTask === 1 ? 'Yes' : 'No') : ''
      }
    );

    if (this.tasksRoleService.hasRole('edit')) {
      columns.push(
        {
          id: TaskTableCol.PRIORITY,
          dataKey: 'taskWrapperPriority',
          editable: (wrapper: JTaskWrapperDisplay) => {
            return {
              data: wrapper,
              value: (wrapper.taskType === TaskType.TASK ? wrapper.taskPriority : wrapper.taskWrapperPriority) + '',
              action: TaskTableEditableAction.CHANGE_PRIORITY
            };
          },
          isSortable: true,
          isSearchable: true,
          export: async (wrapper: JTaskWrapperDisplay) =>
            (wrapper.taskType === TaskType.TASK ? wrapper.taskPriority : wrapper.taskWrapperPriority) + ''
        },
        {
          id: TaskTableCol.MAX_AGENTS,
          dataKey: 'taskWrapperMaxAgents',
          editable: (wrapper: JTaskWrapperDisplay) => {
            return {
              data: wrapper,
              value: (wrapper.taskType === TaskType.TASK ? wrapper.taskMaxAgents : wrapper.taskWrapperMaxAgents) + '',
              action: TaskTableEditableAction.CHANGE_MAX_AGENTS
            };
          },
          isSortable: true,
          isSearchable: true,
          export: async (wrapper: JTaskWrapperDisplay) =>
            (wrapper.taskType === TaskType.TASK ? wrapper.taskMaxAgents : wrapper.taskWrapperMaxAgents) + ''
        }
      );
    } else {
      columns.push(
        {
          id: TaskTableCol.PRIORITY,
          dataKey: 'taskWrapperPriority',
          render: (wrapper: JTaskWrapperDisplay) =>
            (wrapper.taskType === TaskType.TASK ? wrapper.taskPriority : wrapper.taskWrapperPriority) + '',
          isSortable: true,
          export: async (wrapper: JTaskWrapperDisplay) =>
            (wrapper.taskType === TaskType.TASK ? wrapper.taskPriority : wrapper.taskWrapperPriority) + ''
        },
        {
          id: TaskTableCol.MAX_AGENTS,
          dataKey: 'taskWrapperMaxAgents',
          render: (wrapper: JTaskWrapperDisplay) =>
            (wrapper.taskType === TaskType.TASK ? wrapper.taskMaxAgents : wrapper.taskWrapperMaxAgents) + '',
          isSortable: false,
          export: async (wrapper: JTaskWrapperDisplay) =>
            (wrapper.taskType === TaskType.TASK ? wrapper.taskMaxAgents : wrapper.taskWrapperMaxAgents) + ''
        }
      );
    }

    return columns;
  }

  //Evaluate which row class should be set
  getRowClass = (row: JTaskWrapperDisplay) => (this.isCrackedRow(row) ? 'row-cracked' : '');

  /**
   * Handles row action events triggered from the action menu.
   * It processes the selected task and performs actions based on the action type.
   * @param event The action menu event containing the selected task and action.
   */
  rowActionClicked(event: ActionMenuEvent<JTaskWrapperDisplay>): void {
    switch (event.menuItem.action) {
      case RowActionMenuAction.EDIT_TASKS:
        this.rowActionEdit(event.data);
        break;
      case RowActionMenuAction.SHOW_SUBTASKS:
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
  getRowDeleteLabel(data: JTaskWrapperDisplay): JTaskWrapperDisplay {
    return {
      ...data,
      taskName: data.displayName
    };
  }

  /**
   * Handles bulk action events triggered from the action menu.
   * It processes the selected tasks, counts supertasks and tasks,
   * and opens a confirmation dialog based on the selected action (archive or delete).
   * @param event The action menu event containing the selected tasks and action.
   */
  bulkActionClicked(event: ActionMenuEvent<JTaskWrapperDisplay[]>): void {
    let superTasksCount = 0;
    let tasksCount = 0;

    const updatedData: JTaskWrapperDisplay[] = event.data.map((taskWrapper: JTaskWrapperDisplay) => {
      let taskName: string;

      // Determine if the task wrapper is a supertask or normal task and take the appropriate task name
      switch (taskWrapper.taskType) {
        case TaskType.SUPERTASK:
          superTasksCount++;
          taskName = taskWrapper.displayName;

          break;
        case TaskType.TASK:
          tasksCount++;
          taskName = taskWrapper.displayName;
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
  exportActionClicked(event: ActionMenuEvent<JTaskWrapperDisplay[]>): void {
    this.exportService.handleExportAction<JTaskWrapperDisplay>(
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
  openDialog(data: DialogData<JTaskWrapperDisplay>) {
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

  // --- Render functions ---
  renderStatusIcons(wrapper: JTaskWrapperDisplay): HTTableIcon {
    const status = wrapper.status;
    if (status === TaskStatus.RUNNING) {
      return {
        name: 'radio_button_checked',
        cls: 'pulsing-progress',
        tooltip: 'In Progress'
      };
    }
    return { name: '' };
  }

  private getTaskStatusLabel(wrapper: JTaskWrapperDisplay): string {
    return wrapper.status === TaskStatus.RUNNING ? 'Running' : '';
  }

  private renderIsSmallIcon(wrapper: JTaskWrapperDisplay): HTTableIcon {
    return this.renderBoolIcon(wrapper, 'isSmall');
  }

  private renderIsCpuTaskIcon(wrapper: JTaskWrapperDisplay): HTTableIcon {
    return this.renderBoolIcon(wrapper, 'isCpuTask');
  }

  editableSaved(editable: HTTableEditable<JTaskWrapperDisplay>): void {
    switch (editable.action) {
      case TaskTableEditableAction.CHANGE_PRIORITY:
        this.changePriority(editable.data, editable.value);
        break;
      case TaskTableEditableAction.CHANGE_MAX_AGENTS:
        this.changeMaxAgents(editable.data, editable.value);
        break;
    }
  }

  private rowActionEditSubtasks(taskWrapper: JTaskWrapperDisplay): void {
    const dialogRef = this.dialog.open(ModalSubtasksComponent, {
      width: '80vw',
      maxWidth: '80vw',
      data: {
        supertaskId: taskWrapper.id,
        supertaskName: taskWrapper.displayName
      }
    });
    dialogRef.afterClosed().subscribe();
  }

  // --- Action functions ---

  private renderBoolIcon(wrapper: JTaskWrapperDisplay, key: string, equals: string = ''): HTTableIcon {
    let icon: HTTableIcon = { name: '' };
    if (wrapper.taskType === TaskType.TASK) {
      if (equals === '') {
        if (wrapper[key] === 1) {
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
    } else {
      if (equals === '') {
        if (wrapper[key] === 1) {
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

  private rowActionEdit(task: JTaskWrapperDisplay): void {
    if (task.taskType === TaskType.TASK && task.taskId) {
      void this.router.navigate(['tasks', 'show-tasks', task.taskId, 'edit']);
    }
  }

  /**
   * @todo Implement error handling.
   */
  private bulkActionArchive(wrappers: JTaskWrapperDisplay[], isArchived: boolean): void {
    const action = isArchived ? 'archived' : 'unarchived';
    const tasks = [];
    for (const wrapper of wrappers) {
      if (wrapper.taskType === TaskType.TASK) {
        tasks.push({ id: wrapper.taskId });
      }
    }

    this.subscriptions.push(
      this.gs.bulkUpdate(SERV.TASKS, tasks, { isArchived: isArchived }).subscribe(() => {
        this.alertService.showSuccessMessage(`Successfully ${action} tasks!`);
        this.reload();
      })
    );
  }

  private bulkActionDelete(wrapper: JTaskWrapperDisplay[]): void {
    this.subscriptions.push(
      this.gs
        .bulkDelete(
          SERV.TASKS_WRAPPER,
          wrapper.map((w) => ({ id: w.taskWrapperId }))
        )
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

  private rowActionDelete(wrapper: JTaskWrapperDisplay[]): void {
    this.subscriptions.push(
      this.gs.delete(SERV.TASKS_WRAPPER, wrapper[0].taskWrapperId).subscribe(() => {
        this.alertService.showSuccessMessage('Successfully deleted task!');
        this.reload();
      })
    );
  }

  private rowActionCopyToTask(wrapper: JTaskWrapperDisplay): void {
    if (wrapper.taskType === TaskType.TASK && wrapper.taskId) {
      void this.router.navigate(['tasks', 'new-tasks', wrapper.taskId, 'copy']);
    }
  }

  private rowActionCopyToPretask(wrapper: JTaskWrapperDisplay): void {
    if (wrapper.taskType === TaskType.TASK && wrapper.taskId) {
      void this.router.navigate(['tasks', 'preconfigured-tasks', wrapper.taskId, 'copytask']);
    }
  }

  private rowActionArchive(wrapper: JTaskWrapperDisplay): void {
    if (wrapper.taskType === TaskType.TASK && wrapper.taskId) {
      this.updateIsArchived(wrapper.taskId, true);
    }
  }

  private rowActionUnarchive(wrapper: JTaskWrapperDisplay): void {
    if (wrapper.taskType === TaskType.TASK && wrapper.taskId) {
      this.updateIsArchived(wrapper.taskId, false);
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

  private changePriority(wrapper: JTaskWrapperDisplay, priority: string): void {
    let val = 0;
    try {
      val = parseInt(priority);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }
    let task: { id: number; priority: number };
    let serv: ServiceConfig;

    if (wrapper.taskType === TaskType.TASK) {
      task = { id: wrapper.taskId, priority: wrapper.taskPriority };
      serv = SERV.TASKS;
    } else {
      task = { id: wrapper.taskWrapperId, priority: wrapper.taskWrapperPriority };
      serv = SERV.TASKS_WRAPPER;
    }

    if (task.priority == val) {
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

  private changeMaxAgents(wrapper: JTaskWrapperDisplay, max: string): void {
    let val = 0;
    try {
      val = parseInt(max);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Do nothing
    }
    let task: { id: number; maxAgents: number };
    let serv: ServiceConfig;

    if (wrapper.taskType === TaskType.TASK) {
      task = { id: wrapper.taskId, maxAgents: wrapper.taskMaxAgents };
      serv = SERV.TASKS;
    } else {
      task = { id: wrapper.taskWrapperId, maxAgents: wrapper.taskWrapperMaxAgents };
      serv = SERV.TASKS_WRAPPER;
    }

    if (task.maxAgents == val) {
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
  private renderTaskWrapperLink(wrapper: JTaskWrapperDisplay): Observable<HTTableRouterLink[]> {
    if (wrapper.taskType === TaskType.TASK) {
      const taskName =
        wrapper.displayName?.length > 40 ? `${wrapper.displayName.substring(0, 40)}...` : wrapper.displayName;
      const isRunning = wrapper.keyspaceProgress > 0; // Assuming running if progress > 0
      const imageUrl = `${this.cs.getEndpoint()}${SERV.HELPER.URL}/getTaskProgressImage?task=${wrapper.taskId}`;
      const totalHashes = wrapper.hashCount ?? 0;
      const crackedHashes = wrapper.cracked ?? 0;
      const hasHashlistProgress = totalHashes > 0;
      const overallProgress = hasHashlistProgress ? Math.min(100, Math.round((crackedHashes / totalHashes) * 100)) : 0;
      const overallProgressLabel = hasHashlistProgress
        ? `${crackedHashes.toLocaleString()} / ${totalHashes.toLocaleString()} cracked`
        : 'No hashlist progress available';

      return of([
        {
          label: taskName,
          routerLink: ['/tasks', 'show-tasks', wrapper.taskId, 'edit'],
          tooltip: wrapper.attackCmd ?? '',
          visualGraph: {
            enabled: isRunning,
            taskId: wrapper.taskId,
            imageUrl,
            overallProgress,
            overallProgressLabel
          }
        }
      ]);
    } else {
      // Supertask: No link
      return of([
        {
          label: wrapper.displayName,
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
  private renderHashlistLinkFromWrapper(wrapper: JTaskWrapperDisplay): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];

    if (wrapper) {
      const id = wrapper.hashlistId;
      const name = wrapper.hashlistName || String(wrapper.hashlistId);

      links.push({
        routerLink: ['/hashlists', 'hashlist', id, 'edit'],
        label: name
      });
    }
    return of(links);
  }

  /**
   * Render router links for access groups using id and name
   * @param accessGroupId - the access group id
   * @param groupName - the access group name
   * @return observable containing an array of router links to be rendered in HTML
   * @private
   */
  private renderAccessGroupLinkFromId(accessGroupId?: number, groupName?: string): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (accessGroupId && groupName) {
      links.push({
        routerLink: ['/users', 'access-groups', accessGroupId, 'edit'],
        label: groupName
      });
    }
    return of(links);
  }

  /**
   * Checks whether the TaskWrapper contains cracked elements
   * @param wrapper TaskWrapper object
   * @private
   */
  private isCrackedRow(wrapper: JTaskWrapperDisplay): boolean {
    return wrapper.cracked > 0;
  }
}
