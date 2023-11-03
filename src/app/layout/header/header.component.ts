import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/_services/access/auth.service';
import { MainMenuItem } from './header.model';
import { ActionMenuItem } from 'src/app/core/_components/menus/action-menu/action-menu.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []

  headerConfig = environment.config.header;
  isAuthentificated = false;
  mainMenu: MainMenuItem[] = [
    this.getAgentsMenu(),
    this.getTasksMenu(),
    this.getHashlistsMenu(),
    this.getFilesMenu(),
    this.getBinariesMenu(),
    this.getConfigMenu(),
    this.getUsersMenu(),
    this.getAdminMenu()
  ]

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.authService.user
      .subscribe(user => {
        this.isAuthentificated = !!user;
      })
    )
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  onLogOut(): void {
    this.authService.logOut();
  }

  /**
   * Retrieves the 'Agents' menu item.
   * @returns A MainMenuItem for the 'Agents' menu.
   */
  getAgentsMenu(): MainMenuItem {
    return {
      label: 'Agents',
      actions: [[
        {
          label: 'Show Agents',
          routerLink: ['agents', 'show-agents']
        },
        {
          label: 'Agent Status',
          routerLink: ['agents', 'agent-status']
        }
      ]]
    }
  }

  /**
   * Retrieves the 'Tasks' menu item.
   * @returns A MainMenuItem for the 'Tasks' menu.
   */
  getTasksMenu(): MainMenuItem {
    return {
      label: 'Tasks',
      actions: [[
        {
          label: 'Show Tasks',
          routerLink: ['tasks', 'show-tasks']
        },
        {
          label: 'Preconfigured Tasks',
          routerLink: ['tasks', 'preconfigured-tasks']
        },
        {
          label: 'Supertasks',
          routerLink: ['tasks', 'supertasks']
        },
        {
          label: 'Import Supertask',
          routerLink: ['tasks', 'import-supertasks', 'masks']
        },
        {
          label: 'Chunk activity',
          routerLink: ['tasks', 'chunks']
        },
      ]]
    }
  }

  /**
   * Retrieves the 'Hashlists' menu item.
   * @returns A MainMenuItem for the 'Hashlists' menu.
   */
  getHashlistsMenu(): MainMenuItem {
    return {
      label: 'Hashlists',
      actions: [[
        {
          label: 'Hashlists',
          routerLink: ['hashlists', 'hashlist']
        },
        {
          label: 'Superhashlists',
          routerLink: ['hashlists', 'superhashlist']
        },
        {
          label: 'Search Hash',
          routerLink: ['hashlists', 'search-hash']
        },
        {
          label: 'Show cracks',
          routerLink: ['hashlists', 'show-cracks']
        }
      ]]
    }
  }

  /**
   * Retrieves the 'Files' menu item.
   * @returns A MainMenuItem for the 'Files' menu.
   */
  getFilesMenu(): MainMenuItem {
    return {
      label: 'Files',
      actions: [[
        {
          label: 'Wordlists',
          routerLink: ['files', 'wordlist']
        },
        {
          label: 'Rules',
          routerLink: ['files', 'rules']
        },
        {
          label: 'Other',
          routerLink: ['files', 'other']
        },
      ]]
    }
  }

  /**
   * Retrieves the 'Admin' menu item.
   * @returns A MainMenuItem for the 'Admin' menu.
   */
  getAdminMenu(): MainMenuItem {
    return {
      label: 'Admin',
      actions: [
        [
          {
            label: 'Account Settings',
            routerLink: ['account', 'acc-settings']
          },
          {
            label: 'UI Settings',
            routerLink: ['account', 'ui-settings']
          },
          {
            label: 'Notifications',
            routerLink: ['account', 'notifications']
          },
          {
            label: 'Support',
            routerLink: ['https://discord.com/channels/419123475538509844/419123475538509846']
          },
        ]
      ]
    };
  }

  /**
   * Retrieves the 'Users' menu item.
   * @returns A MainMenuItem for the 'Users' menu.
   */
  getUsersMenu(): MainMenuItem {
    return {
      label: 'Users',
      actions: [
        [
          {
            label: 'All users',
            routerLink: ['users', 'all-users']
          },
          {
            label: 'Global Permissions',
            routerLink: ['users', 'global-permissions-groups']
          },
          {
            label: 'Access Groups',
            routerLink: ['users', 'access-groups']
          },
        ]
      ]
    };
  }

  /**
 * Retrieves the 'Config' menu item.
 * @returns A MainMenuItem for the 'Config' menu.
 */
  getConfigMenu(): MainMenuItem {
    return {
      label: 'Config',
      actions: [
        [
          {
            label: 'Settings',
            routerLink: ['config', 'agent']
          },
          {
            label: 'Hashtypes',
            routerLink: ['config', 'hashtypes']
          },
          {
            label: 'Health Checks',
            routerLink: ['config', 'health-checks']
          },
          {
            label: 'Log',
            routerLink: ['config', 'log']
          },
        ]
      ]
    };
  }

  /**
   * Retrieves the 'Binaries' menu item.
   * @returns A MainMenuItem for the 'Binaries' menu.
   */
  getBinariesMenu(): MainMenuItem {
    return {
      label: 'Binaries',
      actions: [
        [
          {
            label: 'Crackers',
            routerLink: ['config', 'engine', 'crackers']
          },
          {
            label: 'Preprocessors',
            routerLink: ['config', 'engine', 'preprocessors']
          },
          {
            label: 'Agent Binaries',
            routerLink: ['config', 'engine', 'agent-binaries']
          },
        ]
      ]
    };
  }
}




