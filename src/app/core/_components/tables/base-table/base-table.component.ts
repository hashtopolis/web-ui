/* eslint-disable @angular-eslint/component-selector */
import { Observable, Subscription, of } from 'rxjs';

import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { JAccessGroup } from '@models/access-group.model';
import { JAgent } from '@models/agent.model';
import { JChunk } from '@models/chunk.model';
import { UIConfig, uiConfigDefault } from '@models/config-ui.model';
import { JGlobalPermissionGroup } from '@models/global-permission-group.model';
import { JHealthCheckAgent } from '@models/health-check.model';
import { JSuperTask } from '@models/supertask.model';
import { JUser } from '@models/user.model';

import { ExportService } from '@services/export/export.service';
import { GlobalService } from '@services/main.service';
import { ConfigService } from '@services/shared/config.service';
import { UIConfigService } from '@services/shared/storage.service';
import { UtilService } from '@services/shared/util.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { HTTableIcon, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';

import { Cacheable } from '@src/app/core/_decorators/cacheable';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

@Component({
  selector: 'base-table',
  template: '',
  standalone: false
})
export class BaseTableComponent {
  @ViewChild('table') table: HTTableComponent;
  @Input() hashlistId: number;
  @Input() shashlistId: number;
  /** Name of the table, used when storing user customizations */
  @Input() name: string;
  /** Flag to enable bulk action menu */
  @Input() hasBulkActions = true;
  /** Flag to enable row action menu */
  @Input() hasRowAction = true;
  /** Flag to enable or disable selectable rows. */
  @Input() isSelectable = true;
  /** Flag to enable or disable filtering. */
  @Input() isFilterable = true;
  protected uiSettings: UISettingsUtilityClass;
  protected dateFormat: string;
  protected subscriptions: Subscription[] = [];
  protected columnLabels: { [key: string]: string } = {};

  constructor(
    protected gs: GlobalService,
    protected cs: ConfigService,
    public clipboard: Clipboard,
    protected router: Router,
    protected settingsService: LocalStorageService<UIConfig>,
    protected sanitizer: DomSanitizer,
    protected snackBar: MatSnackBar,
    protected uiService: UIConfigService,
    protected exportService: ExportService,
    protected cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public utilService: UtilService
  ) {
    this.uiSettings = new UISettingsUtilityClass(settingsService);
    this.dateFormat = this.getDateFormat();
  }

  reload(): void {
    if (this.table) {
      this.table.reload();
    }
  }

  @Cacheable(['id']) async renderSupertaskLink(obj: JSuperTask): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: ['/tasks/', obj.id, 'edit'],
        label: obj.supertaskName
      }
    ];
  }

  @Cacheable(['id']) async renderCrackedLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: obj && obj['taskId'] ? ['/hashlists', 'hashes', 'tasks', obj['taskId']] : [],
        label: obj['cracked']
      }
    ];
  }

  @Cacheable(['id']) async renderHashlistLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: obj && obj['id'] ? ['/hashlists', 'hashlist', obj['id'], 'edit'] : [],
        label: obj['name']
      }
    ];
  }

  @Cacheable(['id']) async renderHashCountLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: obj && obj['id'] ? ['/hashlists', 'hashes', 'hashlists', obj['id']] : [],
        label: obj['hashCount']
      }
    ];
  }

  @Cacheable(['id']) async renderPermissionLink(obj: JGlobalPermissionGroup): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: obj && obj['id'] ? ['/users', 'global-permissions-groups', obj['id'], 'edit'] : [],
        label: obj['name']
      }
    ];
  }

  @Cacheable(['isActive']) async renderStatusIcon(obj: unknown): Promise<HTTableIcon[]> {
    if (obj) {
      return obj['isActive']
        ? [{ name: 'check_circle', cls: 'text-ok' }]
        : [
            {
              name: 'remove_circle',
              cls: 'text-critical'
            }
          ];
    }
    return [];
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
   * Render all access group links and agent belongs to to be displayed in HTML code
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
   * @param model - Agent, Chunk or HealthcheckAgent model to render agent router link for
   * @return observable object containing a router link array
   */
  renderAgentLink(model: JAgent | JChunk | JHealthCheckAgent): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (model) {
      links.push({
        routerLink: ['/agents', 'show-agents', model.id, 'edit'],
        label: model.agentName
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
   * @return observable object containing a router link array
   */
  renderTaskLink(model: JAgent | JChunk): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (model) {
      links.push({
        routerLink: ['/tasks', 'show-tasks', model.taskId, 'edit'],
        label: model.taskName
      });
    }
    return of(links);
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
