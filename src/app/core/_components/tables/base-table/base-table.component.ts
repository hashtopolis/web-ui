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

  @Cacheable(['attributes']['taskId'])
  async renderTaskLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['attributes']['taskId']
            ? ['/tasks', 'show-tasks', obj['attributes']['taskId'], 'edit']
            : [],
        label: obj['attributes']['taskName']
      }
    ];
  }

  @Cacheable(['supertaskId'])
  async renderSupertaskLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: ['/tasks/', obj['_id'], 'edit']
      }
    ];
  }

  @Cacheable(['id'])
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

  @Cacheable(['taskId'])
  async renderCrackedLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['taskId']
            ? ['/hashlists', 'hashes', 'tasks', obj['taskId']]
            : []
      }
    ];
  }

  @Cacheable(['id'])
  async renderUserLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink: obj && obj['id'] ? ['/users', obj['id'], 'edit'] : []
      }
    ];
  }

  @Cacheable(['attributes']['chunkId'])
  async renderChunkLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['attributes']['chunkId']
            ? ['/tasks', 'chunks', obj['attributes']['chunkId'], 'view']
            : [],
        label: obj['attributes']['chunkId']
      }
    ];
  }

  @Cacheable(['hashlistId'])
  async renderHashlistLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['hashlistId']
            ? ['/hashlists', 'hashlist', obj['hashlistId'], 'edit']
            : []
      }
    ];
  }

  @Cacheable(['hashlistId'])
  async renderHashCountLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['hashlistId']
            ? ['/hashlists', 'hashes', 'hashlists', obj['hashlistId']]
            : []
      }
    ];
  }

  @Cacheable(['id'])
  async renderPermissionLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['id']
            ? ['/users', 'global-permissions-groups', obj['id'], 'edit']
            : []
      }
    ];
  }

  @Cacheable(['accessGroupId'])
  async renderAccessGroupLink(obj: unknown): Promise<HTTableRouterLink[]> {
    return [
      {
        routerLink:
          obj && obj['accessGroupId']
            ? ['/users', 'access-groups', obj['accessGroupId'], 'edit']
            : []
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
