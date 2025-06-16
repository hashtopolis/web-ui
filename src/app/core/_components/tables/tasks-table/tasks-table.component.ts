import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '@components/tables/ht-table/ht-table.models';
import { Observable, catchError, of } from 'rxjs';
import {
  TaskStatus,
  TaskTableCol,
  TaskTableColumnLabel,
  TaskTableEditableAction
} from '@components/tables/tasks-table/tasks-table.constants';
import { convertCrackingSpeed, convertToLocale } from '@src/app/shared/utils/util';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { BaseTableComponent } from '@components/tables/base-table/base-table.component';
import { BulkActionMenuAction } from '@components/menus/bulk-action-menu/bulk-action-menu.constants';
import { ChunkData } from '@models/chunk.model';
import { DialogData } from '@components/tables/table-dialog/table-dialog.model';
import { JTask } from '@models/task.model';
import { JTaskWrapper } from '@models/task-wrapper.model';
import { ModalSubtasksComponent } from '@src/app/tasks/show-tasks/modal-subtasks/modal-subtasks.component';
import { RowActionMenuAction } from '@components/menus/row-action-menu/row-action-menu.constants';
import { SERV } from '@services/main.config';
import { SafeHtml } from '@angular/platform-browser';
import { TableDialogComponent } from '@components/tables/table-dialog/table-dialog.component';
import { TasksDataSource } from '@datasources/tasks.datasource';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  standalone: false
})
export class TasksTableComponent extends BaseTableComponent implements OnInit, OnDestroy {
  tableColumns: HTTableColumn[] = [];
  dataSource: TasksDataSource;
  isArchived = false;
  selectedFilterColumn: string = 'all';
  ngOnInit(): void {
    this.setColumnLabels(TaskTableColumnLabel);
    this.tableColumns = this.getColumns();
    this.dataSource = new TasksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.setIsArchived(this.isArchived);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
  filter(item: JTaskWrapper, filterValue: string): boolean {
    // Get lowercase filter value for case-insensitive comparison
    filterValue = filterValue.toLowerCase();
    const selectedColumn = this.selectedFilterColumn;

    // Filter based on selected column
    switch (selectedColumn) {
      case 'all':
        // Search across multiple relevant fields
        return (
          item.tasks?.some((task: JTask) => task.taskName?.toLowerCase().includes(filterValue)) ||
          item.id?.toString().toLowerCase().includes(filterValue) ||
          item.accessGroup?.groupName?.toLowerCase().includes(filterValue) ||
          (item.hashType &&
            (item.hashType.id?.toString().includes(filterValue) ||
              item.hashType.description?.toLowerCase().includes(filterValue) ||
              (item.hashType.id?.toString().toLowerCase() + '-' + item.hashType.description?.toLowerCase()).includes(
                filterValue
              ))) ||
          item.hashlist?.name?.toLowerCase().includes(filterValue)
        );

      case 'id':
        return item.id?.toString().toLowerCase().includes(filterValue);

      case 'taskName':
        return item.tasks?.some((task: JTask) => task.taskName?.toLowerCase().includes(filterValue));

      case 'taskType': {
        const typeText = item.taskType === 0 ? 'task' : 'supertask';
        return typeText.includes(filterValue);
      }

      case 'hashtype':
        if (item.hashType) {
          return (
            item.hashType.description?.toLowerCase().includes(filterValue) ||
            item.hashType.id?.toString().toLowerCase().includes(filterValue) ||
            (item.hashType.id?.toString().toLowerCase() + '-' + item.hashType.description?.toLowerCase()).includes(
              filterValue
            )
          );
        }
        return false;
      case 'hashlistId': {
        return (
          item.hashlist?.name?.toLowerCase().includes(filterValue) ||
          item.hashlistId?.toString().toLowerCase().includes(filterValue)
        );
      }
      case 'accessGroupName': {
        return item.accessGroup?.groupName?.toLowerCase().includes(filterValue);
      }

      default:
        return item.tasks?.some((task: JTask) => task.taskName?.toLowerCase().includes(filterValue));
    }
  }

  getColumns(): HTTableColumn[] {
    return [
      {
        id: TaskTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        isSearchable: true,
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
        isSearchable: true,

        isSortable: false,
        export: async (wrapper: JTaskWrapper) => wrapper.tasks[0]?.taskName
      },
      {
        id: TaskTableCol.STATUS,
        dataKey: 'keyspaceProgress',
        render: (wrapper: JTaskWrapper) => this.renderSpeed(wrapper),
        icon: (wrapper: JTaskWrapper) => this.renderStatusIcons(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) => {
          console.log(wrapper);
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
        isSearchable: true,
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
        isSearchable: true,
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
        isSearchable: true,

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
        icon: (wrapper: JTaskWrapper) => this.renderIsSmallIcon(wrapper),
        isSortable: false,
        export: async (wrapper: JTaskWrapper) =>
          wrapper.taskType === 0 ? (wrapper.tasks[0].isSmall ? 'Yes' : 'No') : ''
      },
      {
        id: TaskTableCol.IS_CPU_TASK,
        dataKey: 'isCpuTask',
        icon: (wrapper: JTaskWrapper) => this.renderIsCpuTaskIcon(wrapper),
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
    this.exportService.handleExportAction<JTaskWrapper>(
      event,
      this.tableColumns,
      TaskTableColumnLabel,
      'hashtopolis-tasks'
    );
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
        html = `${convertCrackingSpeed(chunkData.speed)}`;
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
    const chunkData: ChunkData = wrapper.chunkData;
    if (chunkData) {
      const speed = chunkData.speed;

      if (speed > 0) {
        return TaskStatus.RUNNING;
      } else if (
        (wrapper.tasks[0].keyspaceProgress >= wrapper.tasks[0].keyspace && wrapper.tasks[0].keyspaceProgress > 0) ||
        wrapper.tasks.find((task: JTask) => task.keyspaceProgress >= task.keyspace && task.keyspaceProgress > 0)
      ) {
        return TaskStatus.COMPLETED;
      } else {
        return TaskStatus.IDLE;
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
    console.log(wrapper);
    this.subscriptions.push(
      this.gs.delete(SERV.TASKS_WRAPPER, wrapper[0].id).subscribe(() => {
        this.alertService.showSuccessMessage('Successfully deleted task!');
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
        this.alertService.showSuccessMessage(`Successfully ${strArchived} task!`);
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
      this.alertService.showInfoMessage('Nothing changed');
      return;
    }

    const request$ = this.gs.update(SERV.TASKS_WRAPPER, wrapper.id, {
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
          this.alertService.showSuccessMessage(`Changed prio to ${val} on Task #${wrapper.tasks[0].id}!`);
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
      this.alertService.showInfoMessage('Nothing changed');
      return;
    }

    const request$ = this.gs.update(SERV.TASKS_WRAPPER, wrapper.id, {
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
          this.alertService.showSuccessMessage(
            `Changed number of max agents to ${val} on Task #${wrapper.tasks[0].id}!`
          );
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
    switch (wrapper.taskType) {
      case 0: // Task
        links.push({
          label: wrapper.hashlist.cracked.toLocaleString(),
          routerLink: ['/hashlists', 'hashes', 'hashlists', wrapper.hashlistId]
          // routerLink: ['/hashlists', 'hashes', 'tasks', wrapper.id], old
        });
        break;
      case 1: // Supertask
        links.push({
          label: wrapper.hashlist.cracked.toLocaleString(),
          routerLink: ['/hashlists', 'hashes', 'hashlists', wrapper.hashlistId]
        });
        break;
      default:
        links.push({
          label: 'Unknown Task Type',
          routerLink: ['/hashlists', 'hashes', 'tasks', wrapper.id]
        });
        break;
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
    for (const task of wrapper.tasks) {
      const taskName = task.taskName?.length > 40 ? `${task.taskName.substring(40)}...` : task.taskName;

      links.push({
        label: taskName,
        routerLink: ['/tasks', 'show-tasks', task.id, 'edit'],
        tooltip: task.attackCmd
      });
    }

    return of(links);
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
