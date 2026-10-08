import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { JTaskWrapperDisplayOverview, TaskType } from '@models/task.model';

import { ContextMenuService } from '@services/context-menu/base/context-menu.service';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { TaskStatusBadge, taskStatusBadge } from '@components/tables/task-status.util';

import { convertCrackingSpeed } from '@src/app/shared/utils/util';

/** A link rendered on the card: label plus the route it points at. */
interface TaskCardLink {
  label: string;
  routerLink: Array<string | number>;
}

/** A single-glance attribute of a task, rendered as an icon pill (small task, CPU task, ...). */
interface TaskCardFlag {
  icon: string;
  label: string;
}

/**
 * Everything the template renders, derived once per `task` input instead of recomputed by
 * getters on every change-detection pass (auto-refresh replaces every row object).
 */
interface TaskCardView {
  taskId: number | null;
  name: string;
  isSupertask: boolean;
  attackCmd: string;
  status: TaskStatusBadge;
  /** Route to the task's detail page; `null` for supertasks, which open a dialog instead. */
  detailLink: Array<string | number> | null;
  /** Keyspace progress in percent. `null` for supertasks, which do not report it. */
  keyspace: { dispatched: number; searched: number } | null;
  /**
   * Hashes this task cracked, as a plain count. Deliberately not a percentage: `cracked` counts
   * what this task found while the only available denominator is the whole hashlist, so a ratio
   * would read as "this task finished the hashlist" even when other tasks did the work.
   */
  cracked: { count: number; routerLink: Array<string | number> | null };
  /** Any hash cracked — mirrors the table's `row-cracked` row highlight. */
  hasCracks: boolean;
  /** The hashlist has no uncracked hashes left — a hashlist fact, as in the table's hashlist column. */
  hashlistFullyCracked: boolean;
  speed: string | null;
  agents: number;
  priority: number;
  maxAgents: number;
  hashtype: string | null;
  hashlist: TaskCardLink | null;
  accessGroup: TaskCardLink | null;
  flags: TaskCardFlag[];
}

/**
 * A task rendered as a card: one status badge and one progress bar in place of the task table's
 * status and dispatched/searched columns, so a page of tasks can be scanned without reading
 * across columns.
 *
 * Used as the card template of the tasks `ht-table`; see `TasksTableComponent`.
 */
@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  standalone: false
})
export class TaskCardComponent {
  private _task: JTaskWrapperDisplayOverview;

  @Input()
  set task(value: JTaskWrapperDisplayOverview) {
    this._task = value;
    this.view = this.buildView(value);
  }

  get task(): JTaskWrapperDisplayOverview {
    return this._task;
  }

  /** Whether to render the selection checkbox (mirrors the table's select column). */
  @Input() selectable = false;

  /** Whether this task is part of the current bulk-action selection. */
  @Input() selected = false;

  /** Context menu backing the card's row-action menu; omitted when the user may do nothing. */
  @Input() contextMenuService?: ContextMenuService;

  /** Emitted when the selection checkbox is toggled. */
  @Output() selectedToggled = new EventEmitter<void>();

  /** Emitted when an entry of the row-action menu is picked. */
  @Output() rowActionClicked = new EventEmitter<ActionMenuEvent<JTaskWrapperDisplayOverview>>();

  /** Emitted when a supertask's name is clicked; the parent opens the subtasks dialog. */
  @Output() supertaskClicked = new EventEmitter<JTaskWrapperDisplayOverview>();

  view: TaskCardView;

  private buildView(wrapper: JTaskWrapperDisplayOverview): TaskCardView {
    const isSupertask = wrapper.taskType !== TaskType.TASK;
    const taskId = wrapper.taskId ?? null;
    const hashlistTotal = wrapper.hashCount ?? 0;
    const crackedCount = wrapper.cracked ?? 0;

    return {
      taskId: isSupertask ? null : taskId,
      name: wrapper.displayName ?? '',
      isSupertask,
      attackCmd: wrapper.attackCmd ?? '',
      status: taskStatusBadge(wrapper.status),
      detailLink: isSupertask || taskId === null ? null : ['/tasks', 'show-tasks', taskId, 'edit'],
      keyspace: isSupertask
        ? null
        : {
            dispatched: this.toPercent(wrapper.dispatched),
            searched: this.toPercent(wrapper.searched)
          },
      cracked: {
        count: crackedCount,
        // Supertasks aggregate several tasks, so there is no single task's crack list to open.
        routerLink:
          !isSupertask && crackedCount > 0 && taskId !== null ? ['/hashlists', 'hashes', 'tasks', taskId] : null
      },
      hasCracks: crackedCount > 0,
      hashlistFullyCracked: hashlistTotal > 0 && wrapper.hashlistCracked === hashlistTotal,
      speed: isSupertask ? null : convertCrackingSpeed(wrapper.currentSpeed ?? 0),
      agents: wrapper.totalAssignedAgents ?? 0,
      priority: (isSupertask ? wrapper.taskWrapperPriority : wrapper.taskPriority) ?? 0,
      maxAgents: (isSupertask ? wrapper.taskWrapperMaxAgents : wrapper.taskMaxAgents) ?? 0,
      hashtype:
        wrapper.hashTypeId !== undefined && wrapper.hashTypeDescription
          ? `${wrapper.hashTypeId} - ${wrapper.hashTypeDescription}`
          : null,
      hashlist:
        wrapper.hashlistId !== undefined
          ? {
              label: wrapper.hashlistName || String(wrapper.hashlistId),
              routerLink: ['/hashlists', 'hashlist', wrapper.hashlistId, 'edit']
            }
          : null,
      accessGroup:
        wrapper.accessGroupId && wrapper.groupName
          ? { label: wrapper.groupName, routerLink: ['/users', 'access-groups', wrapper.accessGroupId, 'edit'] }
          : null,
      flags: this.buildFlags(wrapper, isSupertask)
    };
  }

  private buildFlags(wrapper: JTaskWrapperDisplayOverview, isSupertask: boolean): TaskCardFlag[] {
    if (isSupertask) {
      return [];
    }
    const flags: TaskCardFlag[] = [];
    if (wrapper.isSmall) {
      flags.push({ icon: 'compress', label: 'Small task' });
    }
    if (wrapper.isCpuTask) {
      flags.push({ icon: 'memory', label: 'CPU task' });
    }
    if (wrapper.taskUsePreprocessor === 1) {
      flags.push({ icon: 'filter_alt', label: 'Preprocessor: Prince' });
    }
    return flags;
  }

  /** `dispatched` / `searched` arrive as percentage strings; clamp them into a usable bar width. */
  private toPercent(value: string | undefined | null): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return 0;
    }
    return Math.max(0, Math.min(100, parsed));
  }
}
