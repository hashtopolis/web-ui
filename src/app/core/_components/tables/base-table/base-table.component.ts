import { faKey, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subscription, of } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectorRef, Component, Injector, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { JAccessGroup } from '@models/access-group.model';
import { JAgent } from '@models/agent.model';
import { BaseModel } from '@models/base.model';
import { JChunk } from '@models/chunk.model';
import { UIConfig, uiConfigDefault } from '@models/config-ui.model';
import { JHashlist } from '@models/hashlist.model';
import { JNotification } from '@models/notification.model';
import { JSuperTask } from '@models/supertask.model';
import { JTask, JTaskWrapper, TaskType } from '@models/task.model';
import { JUser } from '@models/user.model';

import { ContextMenuService } from '@services/context-menu/base/context-menu.service';
import { ExportService } from '@services/export/export.service';
import { GlobalService } from '@services/main.service';
import { PermissionService } from '@services/permission/permission.service';
import { PreconfiguredTasksRoleService } from '@services/roles/tasks/preconfiguredTasks-role.service';
import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';
import { AlertService } from '@services/shared/alert.service';
import { ConfigService } from '@services/shared/config.service';
import { UIConfigService } from '@services/shared/storage.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableIcon, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';

import { JAgentErrors } from '@src/app/core/_models/agent-errors.model';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { formatPercentage } from '@src/app/shared/utils/util';

@Component({
  selector: 'app-base-table',
  template: '',
  standalone: false
})
export class BaseTableComponent {
  @ViewChild('table') table: HTTableComponent;
  @Input() shashlistId: number;
  /** Name of the table, used when storing user customizations */
  @Input() name: string;
  /** Flag to enable or disable selectable rows. */
  @Input() isSelectable = true;
  /** Flag to enable or disable filtering. */
  @Input() isFilterable = true;
  /** Flag to enable  temperature Information dialog */
  @Input() hasTemperatureInformation = true;

  protected uiSettings: UISettingsUtilityClass;
  protected dateFormat: string;
  protected subscriptions: Subscription[] = [];
  protected columnLabels: { [key: string]: string } = {};
  protected contextMenuService: ContextMenuService;

  constructor(
    protected injector: Injector,
    protected gs: GlobalService,
    protected cs: ConfigService,
    protected clipboard: Clipboard,
    protected router: Router,
    protected settingsService: LocalStorageService<UIConfig>,
    protected sanitizer: DomSanitizer,
    protected alertService: AlertService,
    protected uiService: UIConfigService,
    protected exportService: ExportService,
    protected cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    protected permissionService: PermissionService,
    readonly tasksRoleService: TasksRoleService,
    readonly preconfiguredTasksRoleService: PreconfiguredTasksRoleService
  ) {
    this.uiSettings = new UISettingsUtilityClass(settingsService);
    this.dateFormat = this.getDateFormat();
  }

  reload(): void {
    if (this.table) {
      this.table.reload();
    }
  }

  renderStatusIcon(model: JAgent | JNotification): HTTableIcon {
    if (model) {
      return model.isActive
        ? { name: 'check_circle', cls: 'text-ok' }
        : { name: 'remove_circle', cls: 'text-critical' };
    }
    return { name: '' };
  }

  /**
   * Render suopertask link to be displayed in HTML code
   * @param superTask - supertaskgroup object to render router link for
   * @return observable object containing a router link array
   */
  renderSupertaskLink(superTask: JSuperTask): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (superTask) {
      links.push({
        routerLink: ['/tasks/', superTask.id, 'edit'],
        label: superTask.supertaskName
      });
    }
    return of(links);
  }

  /**
   * Render cracked link to be displayed in HTML code
   * @param chunk - chunk object to render router link for
   * @return observable object containing a router link array
   */
  renderCrackedLinkFromChunk(chunk: JChunk): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (chunk) {
      links.push({
        routerLink: ['/hashlists', 'hashes', 'tasks', chunk.taskId],
        label: chunk.cracked.toLocaleString()
      });
    }
    return of(links);
  }

  /**
   * Render cracked link from task object to be displayed in HTML code
   * @return observable object containing a router link array
   * @param task
   */
  renderCrackedLinkFromTask(task: JTask): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (task.chunkData.cracked) {
      links.push({
        routerLink: ['/hashlists', 'hashes', 'tasks', task.id],
        label: task.chunkData.cracked.toLocaleString()
      });
    }
    return of(links);
  }

  /**
   * Render router link to show cracked hashes for a task if any.
   * For supertasks only the cracked number as text is shown
   * @param wrapper - the task wrapper object to render the link for
   * @return observable containing an array of router links to be rendered in HTML
   */
  protected renderCrackedLinkFromWrapper(wrapper: JTaskWrapper): Observable<HTTableRouterLink[]> {
    if (wrapper.cracked === 0) {
      return of([{ label: null, routerLink: null }]);
    }

    const isSupertask = wrapper.taskType === TaskType.SUPERTASK;

    const link: HTTableRouterLink = {
      label: wrapper.cracked.toLocaleString(),
      routerLink: isSupertask ? null : ['/hashlists', 'hashes', 'tasks', wrapper.tasks[0].id],
      tooltip: isSupertask ? 'Please access the cracked hashes via the row\'s context menu "show subtasks"' : undefined
    };

    return of([link]);
  }

  /**
   * Render hashlist link to be displayed in HTML code
   * @param hashlist - hashlist object to render router link for
   * @return observable object containing a router link array
   */
  renderHashlistLink(hashlist: JHashlist): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (hashlist) {
      links.push({
        routerLink: ['/hashlists', 'hashlist', hashlist.id, 'edit'],
        label: hashlist.name,
        icon: {
          faIcon: hashlist.isSecret ? faKey : undefined,
          tooltip: hashlist.isSecret ? 'Secret hashlist' : ''
        }
      });
    }
    return of(links);
  }

  /**
   * Render access group link to be displayed in HTML code
   * @param accessGroup - access group object to render router link for
   * @return observable object containing a router link array
   */
  renderAccessGroupLink(accessGroup: JAccessGroup): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (accessGroup) {
      links.push({
        routerLink: ['/users', 'access-groups', accessGroup.id, 'edit'],
        label: accessGroup.groupName
      });
    }
    return of(links);
  }

  /**
   * Render all access group links of an agent to be displayed in HTML code
   * @param agent - agent model to render all access group objects for
   * @return observable object containing a router link array
   */
  renderAccessGroupLinks(agent: JAgent): Observable<HTTableRouterLink[]> {
    let links: HTTableRouterLink[] = [];
    if (agent && agent.accessGroups) {
      links = agent.accessGroups.map((accessGroup) => ({
        routerLink: ['/users', 'access-groups', accessGroup.id, 'edit'],
        label: accessGroup.groupName
      }));
    }
    return of(links);
  }

  /**
   * Render agent edit link to be displayed in HTML code
   * @param model - Agent model to render agent router link for
   * @return observable object containing a router link array
   */
  renderAgentLink(model: JAgent): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (model) {
      const agentIsTrusted = 'isTrusted' in model && model.isTrusted;
      links.push({
        routerLink: ['/agents', 'show-agents', model.id, 'edit'],
        label: model.agentName,
        icon: { faIcon: agentIsTrusted ? faShieldHalved : undefined, tooltip: agentIsTrusted ? 'Trusted Agent' : '' }
      });
    }
    return of(links);
  }

  /**
   * Render agent edit link to be displayed in HTML code given a chunk instance
   * @param chunk - chunk model to render agent router link for
   * @return observable object containing a router link array
   */
  renderAgentLinkFromChunk(chunk: JChunk): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (chunk) {
      links.push({
        routerLink: ['/agents', 'show-agents', chunk.agentId, 'edit'],
        label: chunk.agentName?.trim() || String(chunk.agentId)
      });
    }
    return of(links);
  }

  /**
   * Render edit user link from a user model
   * @param user - User to render edit link for
   * @return observable object containing a router link array
   */
  renderUserLink(user: JUser): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (user) {
      links.push({
        routerLink: ['/users', user.id, 'edit'],
        label: user.name
      });
    }
    return of(links);
  }

  /**
   * Render edit user link for agent owner, if any
   * @param agent - Agent to render owner link for
   * @return observable object containing a router link array
   */
  renderUserLinkFromAgent(agent: JAgent): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (agent && agent.user) {
      links.push({
        routerLink: ['/users', agent.user.id, 'edit'],
        label: agent.user.name
      });
    }
    return of(links);
  }

  /**
   * Render edit link for task
   * @param model - agent or chunk to render tasl link for
   * @param idLink - if true, the task ID will be used as label, otherwise the task name
   * @return observable object containing a router link array
   */
  renderTaskLink(model: JAgent | JChunk | JAgentErrors, idLink: boolean = false): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (model) {
      links.push({
        routerLink: ['/tasks', 'show-tasks', model.taskId, 'edit'],
        label: idLink ? model?.taskId.toString() : model.task?.taskName.toString()
      });
    }
    return of(links);
  }

  /* Render edit link for subtask
   * @param model - agent or chunk to render tasl link for
   * @param idLink - if true, the task ID will be used as label, otherwise the task name
   * @return observable object containing a router link array
   */
  renderTaskLinkSubtasks(model: JTask, idLink: boolean = false): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (model) {
      links.push({
        routerLink: ['/tasks', 'show-tasks', model.id, 'edit'],
        label: idLink ? model.id.toString() : model.taskName.toString()
      });
    }
    return of(links);
  }

  /**
   * Render a valid or invalid icon for the given user
   * @param user - user th get icon for
   * @return a valid or invalid icon depending on the user.isValid setting
   */
  renderIsValidIcon(user: JUser): HTTableIcon {
    return user.isValid ? { name: 'check_circle', cls: 'text-ok' } : { name: 'remove_circle', cls: 'text-critical' };
  }

  renderSecretIcon(model: BaseModel): HTTableIcon {
    if (model && 'isSecret' in model && model.isSecret === true) {
      return {
        name: 'lock',
        tooltip: 'Secret'
      };
    }
    return { name: '' };
  }

  renderCrackedHashes(hashlist: JHashlist, isExport: boolean): string {
    if (hashlist.cracked !== hashlist.hashCount || isExport) {
      return `${hashlist.cracked} (${formatPercentage(hashlist.cracked, hashlist.hashCount)})`;
    }
    return '';
  }

  /**
   * Sanitizes the given HTML string to create a safe HTML value.
   * @param html - The HTML string to be sanitized.
   * @returns A SafeHtml object that represents the sanitized HTML.
   */
  protected sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  protected setColumnLabels(labels: { [key: string]: string }): void {
    this.columnLabels = labels;
  }

  /**
   * Retrieves the date format for rendering timestamps.
   * @returns The date format string.
   */
  private getDateFormat(): string {
    const fmt = this.uiSettings.getSetting<string>('timefmt');

    return fmt ? fmt : uiConfigDefault.timefmt;
  }
}
