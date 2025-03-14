/* eslint-disable @angular-eslint/component-selector */
import {
  ChangeDetectorRef,
  Component,
  Input,
  Renderer2,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HTTableIcon, HTTableRouterLink } from '../ht-table/ht-table.models';
import {
  UIConfig,
  uiConfigDefault
} from 'src/app/core/_models/config-ui.model';

import { Cacheable } from 'src/app/core/_decorators/cacheable';
import { Clipboard } from '@angular/cdk/clipboard';
import { ConfigService } from 'src/app/core/_services/shared/config.service';
import { ExportService } from 'src/app/core/_services/export/export.service';
import { GlobalService } from 'src/app/core/_services/main.service';
import { HTTableComponent } from '../ht-table/ht-table.component';
import { LocalStorageService } from 'src/app/core/_services/storage/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UIConfigService } from 'src/app/core/_services/shared/storage.service';
import { UISettingsUtilityClass } from 'src/app/shared/utils/config';
import { UtilService } from 'src/app/core/_services/shared/util.service';
import { GlobalPermissionGroupData } from '../../../_models/global-permission-group.model';
import { JAccessGroup } from '../../../_models/access-group.model';
import { SuperTaskData } from '../../../_models/supertask.model';
import { TaskData } from '../../../_models/task.model';

@Component({
  selector: 'base-table',
  template: ''
})
export class BaseTableComponent {
  protected uiSettings: UISettingsUtilityClass;
  protected dateFormat: string;
  protected subscriptions: Subscription[] = [];
  protected columnLabels: { [key: string]: string } = {};

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

  constructor(
    protected gs: GlobalService,
    protected cs: ConfigService,
    protected renderer: Renderer2,
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

  /**
   * Retrieves the date format for rendering timestamps.
   * @returns The date format string.
   */
  private getDateFormat(): string {
    const fmt = this.uiSettings.getSetting<string>('timefmt');

    return fmt ? fmt : uiConfigDefault.timefmt;
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

  reload(): void {
    if (this.table) {
      this.table.reload();
    }
  }

  @Cacheable(['id'])
  async renderTaskLink(obj: TaskData): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj.id
            ? ['/tasks', 'show-tasks', obj.id, 'edit']
            : [],
        label: obj.attributes.taskName
      }
    ];
  }

  @Cacheable(['id'])
  async renderSupertaskLink(obj: SuperTaskData): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: ['/tasks/', obj.id, 'edit'],
        label: obj.attributes.supertaskName
      }
    ];
  }

  @Cacheable(['attributes']['agentId'])
  async renderAgentLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['id']
            ? ['/agents', 'show-agents', obj['id'], 'edit']
            : [],
        label: obj['attributes']['agentName']
      }
    ];
  }

  @Cacheable(['attributes']['taskId'])
  async renderCrackedLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['attributes']['taskId']
            ? ['/hashlists', 'hashes', 'tasks', obj['attributes']['taskId']]
            : [],
        label: obj['attributes']['cracked']
      }
    ];
  }

  @Cacheable(['id'])
  async renderUserLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: obj && obj['id'] ? ['/users', obj['id'], 'edit'] : [],
        label: obj['name']
      }
    ];
  }

  @Cacheable(['chunkId'])
  async renderChunkLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['chunkId']
            ? ['/tasks', 'chunks', obj['chunkId'], 'view']
            : [],
        label: obj['chunkId']
      }
    ];
  }

  @Cacheable(['id'])
  async renderHashlistLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['id']
            ? ['/hashlists', 'hashlist', obj['id'], 'edit']
            : [],
        label: obj['name']
      }
    ];
  }

  @Cacheable(['id'])
  async renderHashCountLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['id']
            ? ['/hashlists', 'hashes', 'hashlists', obj['id']]
            : [],
        label: obj['hashCount']
      }
    ];
  }

  @Cacheable(['id'])
  async renderPermissionLink(obj: GlobalPermissionGroupData): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['id']
            ? ['/users', 'global-permissions-groups', obj['id'], 'edit']
            : [],
        label: obj['attributes']['name']
      }
    ];
  }

  @Cacheable(['id'])
  async renderAccessGroupLink(obj: JAccessGroup): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj.id
            ? ['/users', 'access-groups', obj.id, 'edit']
            : [],
        label: obj.groupName
      }
    ];
  }

  @Cacheable(['id', 'accessGroup'])
  async renderAccessGroupLinks(obj: unknown): Promise<HTTableRouterLink[]> {
    let links: HTTableRouterLink[] = [];
    if (obj && obj['relationships']) {
      links = [
        {
          routerLink: [
            '/users',
            'access-groups',
            obj['relationships']['accessGroups']['data'][0]['id'],
            'edit'
          ],
          label: obj['attributes']['accessGroup']
        }
      ];
      return links;
    } else {
      return links;
    }
  }

  @Cacheable(['attributes']['isActive'])
  async renderStatusIcon(obj: unknown): Promise<HTTableIcon[]> {
    if (obj) {
      return obj['attributes']['isActive']
        ? [
            {
              name: 'check_circle',
              cls: 'text-ok'
            }
          ]
        : [
            {
              name: 'remove_circle',
              cls: 'text-critical'
            }
          ];
    }

    return [];
  }
}
