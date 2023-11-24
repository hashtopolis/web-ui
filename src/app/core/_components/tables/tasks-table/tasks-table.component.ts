import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2
} from '@angular/core';
import {
  HTTableColumn,
  HTTableEditable,
  HTTableIcon,
  HTTableRouterLink
} from '../ht-table/ht-table.models';
import { catchError, forkJoin } from 'rxjs';

import { ActionMenuEvent } from '../../menus/action-menu/action-menu.model';
import { BaseTableComponent } from '../base-table/base-table.component';
import { BulkActionMenuAction } from '../../menus/bulk-action-menu/bulk-action-menu.constants';
import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { ChunkData } from 'src/app/core/_models/chunk.model';
import { DialogData } from '../table-dialog/table-dialog.model';
import { RowActionMenuAction } from '../../menus/row-action-menu/row-action-menu.constants';
import { SERV } from 'src/app/core/_services/main.config';
import { SafeHtml } from '@angular/platform-browser';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { Task } from 'src/app/core/_models/task.model';
import {
  TaskTableColumnLabel,
  TaskTableEditableAction
} from './tasks-table.constants';
import { TaskWrapper } from 'src/app/core/_models/task-wrapper.model';
import { TasksDataSource } from 'src/app/core/_datasources/tasks.datasource';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { wrap } from 'module';

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
  chunkData: { [key: number]: ChunkData } = {};

  ngOnInit(): void {
    this.tableColumns = this.getColumns();
    this.dataSource = new TasksDataSource(this.cdr, this.gs, this.uiService);
    this.dataSource.setColumns(this.tableColumns);
    this.dataSource.loadAll();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  filter(item: Task, filterValue: string): boolean {
    /*
    if (item.taskName.toLowerCase().includes(filterValue) ||
      item.clientSignature.toLowerCase().includes(filterValue) ||
      item.devices.toLowerCase().includes(filterValue)) {
      return true
    }
*/
    return false;
  }

  getColumns(): HTTableColumn[] {
    const tableColumns = [
      {
        name: TaskTableColumnLabel.ID,
        dataKey: '_id',
        isSortable: true
      },
      {
        name: TaskTableColumnLabel.NAME,
        dataKey: 'taskName',
        routerLink: (wrapper: TaskWrapper) =>
          this.renderTaskWrapperLink(wrapper),
        isSortable: true
      },
      {
        name: TaskTableColumnLabel.STATUS,
        dataKey: 'keyspaceProgress',
        async: (wrapper: TaskWrapper) => this.renderSpeed(wrapper),
        icons: (wrapper: TaskWrapper) => this.renderStatusIcons(wrapper),
        isSortable: false
      },
      {
        name: TaskTableColumnLabel.PRIORITY,
        dataKey: 'priority',
        editable: (wrapper: TaskWrapper) => {
          return {
            data: wrapper,
            value: wrapper.priority + '',
            action: TaskTableEditableAction.CHANGE_PRIORITY
          };
        },
        isSortable: true
      },
      {
        name: TaskTableColumnLabel.PREPROCESSOR,
        dataKey: 'preprocessorId',
        render: (wrapper: TaskWrapper) =>
          wrapper.taskType === 0 && wrapper.tasks[0].preprocessorId === 1
            ? 'Prince'
            : '',
        isSortable: true
      },
      {
        name: TaskTableColumnLabel.HASHLISTS,
        dataKey: 'userId',
        routerLink: (wrapper: TaskWrapper) => this.renderHashlistLinks(wrapper),
        isSortable: false
      },
      {
        name: TaskTableColumnLabel.DISPATCHED_SEARCHED,
        dataKey: 'clientSignature',
        async: (wrapper: TaskWrapper) => this.renderDispatchedSearched(wrapper),
        isSortable: true
      },
      {
        name: TaskTableColumnLabel.CRACKED,
        dataKey: 'cracked',
        routerLink: (wrapper: TaskWrapper) => this.renderCrackedLink(wrapper),
        isSortable: true
      },
      {
        name: TaskTableColumnLabel.AGENTS,
        dataKey: 'agents',
        async: (wrapper: TaskWrapper) => this.renderAgents(wrapper),
        isSortable: false
      },
      {
        name: TaskTableColumnLabel.IS_SMALL,
        dataKey: 'isSmall',
        icons: (wrapper: TaskWrapper) => this.renderIsSmallIcon(wrapper),
        isSortable: true
      },
      {
        name: TaskTableColumnLabel.IS_CPU_TASK,
        dataKey: 'isCpuTask',
        icons: (wrapper: TaskWrapper) => this.renderIsCpuTaskIcon(wrapper),
        isSortable: true
      }
    ];

    return tableColumns;
  }

  rowActionClicked(event: ActionMenuEvent<Task>): void {
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
      case RowActionMenuAction.EDIT_SUBTASKS:
        console.log('edit-subtasks', event.data);
        break;
      case RowActionMenuAction.ARCHIVE:
        this.rowActionArchive(event.data);
        break;
      case RowActionMenuAction.DELETE:
        this.openDialog({
          rows: [event.data],
          title: `Deleting ${event.data.taskName} ...`,
          icon: 'warning',
          body: `Are you sure you want to delete ${event.data.taskName}? Note that this action cannot be undone.`,
          warn: true,
          action: event.menuItem.action
        });
        break;
    }
  }

  bulkActionClicked(event: ActionMenuEvent<Task[]>): void {
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
          body: `Are you sure you want to permanently delete the selected tasks? Note that this action cannot be undone.`,
          warn: true,
          listAttribute: 'taskName',
          action: event.menuItem.action
        });
        break;
    }
  }

  openDialog(data: DialogData<Task>) {
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

  @Cacheable(['_id', 'taskType', 'tasks'])
  async renderStatusIcons(wrapper: TaskWrapper): Promise<HTTableIcon[]> {
    const icons: HTTableIcon[] = [];

    if (wrapper.taskType === 0 && wrapper.tasks.length > 0) {
      const task: Task = wrapper.tasks[0];
      if (!(task._id in this.chunkData)) {
        this.chunkData[task._id] = await this.dataSource.getChunkData(
          task.taskId,
          false,
          task.keyspace
        );
      }
      const speed = this.chunkData[task._id].speed;
      if (speed > 0) {
        icons.push({
          name: 'radio_button_checked',
          cls: 'pulsing-progress',
          tooltip: 'In Progress'
        });
      } else if (
        task.keyspaceProgress >= task.keyspace &&
        task.keyspaceProgress > 0
      ) {
        icons.push({
          name: 'check',
          tooltip: 'Completed'
        });
      } else {
        icons.push({
          name: 'radio_button_checked',
          tooltip: 'Idle',
          cls: 'text-primary'
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
    let html = '';
    if (wrapper.taskType === 0) {
      const task: Task = wrapper.tasks[0];
      if (task.keyspace > 0) {
        if (!(task._id in this.chunkData)) {
          this.chunkData[task._id] = await this.dataSource.getChunkData(
            task.taskId,
            false,
            task.keyspace
          );
        }
        html = `${this.chunkData[task._id].dispatched} / ${
          this.chunkData[task._id].searched
        }`;
      }
    }
    return this.sanitize(html);
  }

  @Cacheable(['_id', 'taskType', 'tasks'])
  override async renderCrackedLink(
    wrapper: TaskWrapper
  ): Promise<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (wrapper.taskType === 0) {
      const task: Task = wrapper.tasks[0];
      if (!(task._id in this.chunkData)) {
        this.chunkData[task._id] = await this.dataSource.getChunkData(
          task.taskId,
          false,
          task.keyspace
        );
      }
      links.push({
        label: this.chunkData[task._id].cracked + '',
        routerLink: ['/hashlists', 'hashes', 'tasks', task._id]
      });
    }

    return links;
  }

  @Cacheable(['_id', 'taskType', 'tasks'])
  async renderAgents(wrapper: TaskWrapper): Promise<SafeHtml> {
    let html = '';
    if (wrapper.taskType === 0) {
      const task: Task = wrapper.tasks[0];
      if (!(task._id in this.chunkData)) {
        this.chunkData[task._id] = await this.dataSource.getChunkData(
          task.taskId,
          false,
          task.keyspace
        );
      }

      html = task.maxAgents
        ? `${this.chunkData[task._id].agents.length} / ${task.maxAgents}`
        : `${this.chunkData[task._id].agents.length}`;
    }
    return this.sanitize(html);
  }

  @Cacheable(['_id', 'taskType', 'tasks'])
  async renderSpeed(wrapper: TaskWrapper): Promise<SafeHtml> {
    let html = '';
    if (wrapper.taskType === 0) {
      const task: Task = wrapper.tasks[0];
      if (!(task._id in this.chunkData)) {
        this.chunkData[task._id] = await this.dataSource.getChunkData(
          task._id,
          false,
          task.keyspace
        );
      }
      html =
        this.chunkData[task._id].speed > 0
          ? `${this.chunkData[task._id].speed}&nbsp;H/s`
          : '';
    }
    return this.sanitize(html);
  }

  // --- Action functions ---

  private rowActionEdit(task: Task): void {
    this.router.navigate(['tasks', 'show-tasks', task._id, 'edit']);
  }

  private bulkActionDelete(tasks: Task[]): void {
    const requests = tasks.map((task: Task) => {
      return this.gs.delete(SERV.TASKS, task._id);
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
          this.dataSource.reload();
        })
    );
  }

  private rowActionDelete(task: Task): void {
    this.subscriptions.push(
      this.gs.delete(SERV.TASKS, task._id).subscribe(() => {
        this.snackBar.open('Successfully deleted task!', 'Close');
        this.dataSource.reload();
      })
    );
  }

  private rowActionCopyToTask(task: Task): void {
    this.router.navigate(['tasks', 'new-tasks', task._id, 'copy']);
  }

  private rowActionCopyToPretask(task: Task): void {
    this.router.navigate([
      'tasks',
      'preconfigured-tasks',
      task._id,
      'copytask'
    ]);
  }

  private rowActionArchive(task: Task): void {
    this.subscriptions.push(
      this.gs.archive(SERV.TASKS, task._id).subscribe(() => {
        this.snackBar.open('Successfully archived task!', 'Close');
        this.dataSource.reload();
      })
    );
  }

  editableSaved(editable: HTTableEditable<TaskWrapper>): void {
    switch (editable.action) {
      case TaskTableEditableAction.CHANGE_PRIORITY:
        this.changePriority(editable.data, editable.value);
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
          this.snackBar.open(`Changed prio to ${val}!`, 'Close');
          this.reload();
        })
    );
  }
}
