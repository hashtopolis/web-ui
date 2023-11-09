import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/_services/access/auth.service';
import { MainMenuItem } from './header.model';
import { User, UserData } from 'src/app/core/_models/auth-user.model';
import { ActionMenuEvent } from 'src/app/core/_components/menus/action-menu/action-menu.model';
import { HeaderMenuAction, HeaderMenuLabel } from './header.constants';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = []
  private username = ''

  headerConfig = environment.config.header;
  mainMenu: MainMenuItem[] = []

  constructor(private authService: AuthService) {
    this.rebuildMenu()
  }

  ngOnInit(): void {
    this.subscriptions.push(this.authService.user.subscribe((user: User) => {
      console.log(user)
      if (user) {
        this.username = user._username
      }
      this.rebuildMenu()
    }))
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  menuItemClicked(event: ActionMenuEvent<any>): void {
    if (event.menuItem.action === HeaderMenuAction.LOGOUT) {
      this.authService.logOut();
      this.rebuildMenu()
      window.location.reload();
    }
  }

  rebuildMenu(): void {
    this.mainMenu = [
      this.getAgentsMenu(),
      this.getTasksMenu(),
      this.getHashlistsMenu(),
      this.getFilesMenu(),
      this.getBinariesMenu(),
      this.getConfigMenu(),
      this.getUsersMenu(),
      this.getAdminMenu()
    ]
  }

  /**
   * Retrieves the 'Agents' menu item.
   * @returns A MainMenuItem for the 'Agents' menu.
   */
  getAgentsMenu(): MainMenuItem {
    return {
      display: true,
      label: HeaderMenuLabel.AGENTS,
      actions: [[
        {
          label: HeaderMenuLabel.SHOW_AGENTS,
          routerLink: ['agents', 'show-agents']
        },
        {
          label: HeaderMenuLabel.AGENT_STATUS,
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
      display: true,
      label: HeaderMenuLabel.TASKS,
      actions: [[
        {
          label: HeaderMenuLabel.SHOW_TASKS,
          routerLink: ['tasks', 'show-tasks']
        },
        {
          label: HeaderMenuLabel.PRECONFIGURED_TASKS,
          routerLink: ['tasks', 'preconfigured-tasks']
        },
        {
          label: HeaderMenuLabel.SUPERTASKS,
          routerLink: ['tasks', 'supertasks']
        },
        {
          label: HeaderMenuLabel.IMPORT_SUPERTASK,
          routerLink: ['tasks', 'import-supertasks', 'masks']
        },
        {
          label: HeaderMenuLabel.CHUNK_ACTIVITY,
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
      display: true,
      label: HeaderMenuLabel.HASHLISTS,
      actions: [[
        {
          label: HeaderMenuLabel.SHOW_HASHLISTS,
          routerLink: ['hashlists', 'hashlist']
        },
        {
          label: HeaderMenuLabel.SUPERHASHLISTS,
          routerLink: ['hashlists', 'superhashlist']
        },
        {
          label: HeaderMenuLabel.SEARCH_HASH,
          routerLink: ['hashlists', 'search-hash']
        },
        {
          label: HeaderMenuLabel.SHOW_CRACKS,
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
      display: true,
      label: HeaderMenuLabel.FILES,
      actions: [[
        {
          label: HeaderMenuLabel.WORDLISTS,
          routerLink: ['files', 'wordlist']
        },
        {
          label: HeaderMenuLabel.RULES,
          routerLink: ['files', 'rules']
        },
        {
          label: HeaderMenuLabel.OTHER,
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
      display: this.username !== '',
      icon: 'person',
      label: this.username,
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
        ],
        [
          {
            label: 'Logout',
            action: HeaderMenuAction.LOGOUT,
            red: true
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
      display: true,
      label: HeaderMenuLabel.USERS,
      actions: [
        [
          {
            label: HeaderMenuLabel.ALL_USERS,
            routerLink: ['users', 'all-users']
          },
          {
            label: HeaderMenuLabel.GLOBAL_PERMISSIONS,
            routerLink: ['users', 'global-permissions-groups']
          },
          {
            label: HeaderMenuLabel.ACCESS_GROUPS,
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
      display: true,
      label: HeaderMenuLabel.CONFIG,
      actions: [
        [
          {
            label: HeaderMenuLabel.SETTINGS,
            routerLink: ['config', 'agent']
          },
          {
            label: HeaderMenuLabel.HASHTYPES,
            routerLink: ['config', 'hashtypes']
          },
          {
            label: HeaderMenuLabel.HEALTH_CHECKS,
            routerLink: ['config', 'health-checks']
          },
          {
            label: HeaderMenuLabel.LOG,
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
      display: true,
      label: HeaderMenuLabel.BINARIES,
      actions: [
        [
          {
            label: HeaderMenuLabel.CRACKERS,
            routerLink: ['config', 'engine', 'crackers']
          },
          {
            label: HeaderMenuLabel.PREPROCESSORS,
            routerLink: ['config', 'engine', 'preprocessors']
          },
          {
            label: HeaderMenuLabel.AGENT_BINARIES,
            routerLink: ['config', 'engine', 'agent-binaries']
          },
        ]
      ]
    };
  }
}




