import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HTTableIcon, HTTableRouterLink } from '@components/tables/ht-table/ht-table.models';
import { Observable, Subscription, of } from 'rxjs';
import { UIConfig, uiConfigDefault } from '@models/config-ui.model';
import { faKey, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

import { BaseModel } from '@models/base.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { ConfigService } from '@services/shared/config.service';
import { ExportService } from '@services/export/export.service';
import { GlobalService } from '@services/main.service';
import { HTTableComponent } from '@components/tables/ht-table/ht-table.component';
import { JAccessGroup } from '@models/access-group.model';
import { JAgent } from '@models/agent.model';
import { JChunk } from '@models/chunk.model';
import { JHashlist } from '@models/hashlist.model';
import { JNotification } from '@models/notification.model';
import { JSuperTask } from '@models/supertask.model';
import { JUser } from '@models/user.model';
import { LocalStorageService } from '@services/storage/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UIConfigService } from '@services/shared/storage.service';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';

@Component({
  selector: 'app-base-table',
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
  /** Flag to enable  temperature Information dialog */
  @Input() hasTemperatureInformation = true;
  
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
    public dialog: MatDialog
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
  renderCrackedLink(chunk: JChunk): Observable<HTTableRouterLink[]> {
    const links: HTTableRouterLink[] = [];
    if (chunk) {
      links.push({
        routerLink: ['/hashlists', 'hashes', 'tasks', chunk.taskId],
        label: chunk.cracked
      });
    }
    return of(links);
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
        label: chunk.agentName
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
