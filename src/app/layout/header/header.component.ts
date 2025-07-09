import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderMenuAction, HeaderMenuLabel } from '@src/app/layout/header/header.constants';
import { Subject, Subscription, takeUntil } from 'rxjs';

import { ActionMenuEvent } from '@components/menus/action-menu/action-menu.model';
import { AuthService } from '@services/access/auth.service';
import { AuthUser } from '@models/auth-user.model';
import { EasterEggService } from '@src/app/core/_services/shared/easter-egg.service';
import { LocalStorageService } from '@services/storage/local-storage.service';
import { MainMenuItem } from '@src/app/layout/header/header.model';
import { Perm } from '@src/app/core/_constants/userpermissions.config';
import { PermissionService } from '@services/permission/permission.service';
import { ThemeService } from '@services/shared/theme.service';
import { UIConfig } from '@models/config-ui.model';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  protected uiSettings: UISettingsUtilityClass;
  private username = '';
  isDarkMode = false;
  private themeSub: Subscription;

  isHovering = false;
  hoverTimeout: ReturnType<typeof setTimeout>;

  // Before showing header check Authentification
  private userSub: Subscription;
  isAuthentificated = false;

  headerConfig = environment.config.header;
  mainMenu: MainMenuItem[] = [];
  private destroy$ = new Subject<void>();
  constructor(
    private authService: AuthService,
    private storage: LocalStorageService<UIConfig>,
    private themes: ThemeService,
    private permissionService: PermissionService,
    private easterEggService: EasterEggService
  ) {
    this.isAuth();
    this.uiSettings = new UISettingsUtilityClass(this.storage, this.themes);
  }

  isAuth(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthentificated = !!user;
    });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.user.subscribe((user: AuthUser) => {
        if (user) {
          this.username = user._username;
        }
      })
    );
    this.subscriptions.push(
      this.permissionService.getPermissions().subscribe(() => {
        // Trigger menu rebuild once permissions are available
        this.rebuildMenu();
      })
    );
    this.themeSub = this.themes.theme$.subscribe((theme) => {
      this.isDarkMode = theme === 'dark';
    });
    // Listen for Konami code
    this.easterEggService
      .onKonamiCodeDetected()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('🎮 Konami code detected!');
        this.activateSecretFeature();
      });
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    this.userSub.unsubscribe();
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
  easterEggFlag: boolean = false;
  private activateSecretFeature(): void {
    // Add your secret feature here
    if (this.easterEggFlag) {
      alert('Blue eyes activated! #️⃣2️⃣💅');
    } else {
      alert('Red eyes activated! #️⃣2️⃣😻');
    }
    // Example: Enable a hidden feature, change theme, etc.
    this.easterEggFlag = !this.easterEggFlag;
  }

  toggleTheme() {
    const newTheme = this.isDarkMode ? 'light' : 'dark';
    this.uiSettings.updateSettings({ theme: newTheme });
    window.location.reload();
  }

  menuItemClicked(event: ActionMenuEvent<any>): void {
    if (event.menuItem.action === HeaderMenuAction.LOGOUT) {
      this.authService.logOut();
      this.rebuildMenu();
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
      this.getHelpMenu(),
      this.getAdminMenu()
    ];
  }

  /**
   * Retrieves the 'Agents' menu item.
   * @returns A MainMenuItem for the 'Agents' menu.
   */
  getAgentsMenu(): MainMenuItem {
    const canReadAgents = this.permissionService.hasPermissionSync(Perm.Agent.READ);
    // Require Agent.READ permission for menu to display
    if (!canReadAgents) {
      return { display: false, label: HeaderMenuLabel.AGENTS, actions: [] };
    }

    const agentActions = [
      {
        label: HeaderMenuLabel.SHOW_AGENTS,
        routerLink: ['agents', 'show-agents']
      }
    ];

    // Reqire AgentStat.READ permission for 'agent-status' menu item to display
    const canReadAgentStats = this.permissionService.hasPermissionSync(Perm.AgentStat.READ);
    if (canReadAgentStats) {
      agentActions.push({
        label: HeaderMenuLabel.AGENT_STATUS,
        routerLink: ['agents', 'agent-status']
      });
    }

    return {
      display: true,
      label: HeaderMenuLabel.AGENTS,
      actions: [agentActions]
    };
  }

  /**
   * Retrieves the 'Tasks' menu item
   * @returns a MainMenuItem for the 'Tasks' menu
   */
  getTasksMenu(): MainMenuItem {
    // Require TaskWrapper.READ permission for menu to display
    const canReadTasks = this.permissionService.hasPermissionSync(Perm.TaskWrapper.READ);
    if (!canReadTasks) {
      return { display: false, label: HeaderMenuLabel.TASKS, actions: [] };
    }

    const taskActions = [
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
      }
    ];

    // Require Chunk.READ permission for chunk activity menu item to display
    const canReadChunks = this.permissionService.hasPermissionSync(Perm.Chunk.READ);
    if (canReadChunks) {
      taskActions.push({
        label: HeaderMenuLabel.CHUNK_ACTIVITY,
        routerLink: ['tasks', 'chunks']
      });
    }

    return {
      display: true,
      label: HeaderMenuLabel.TASKS,
      actions: [taskActions]
    };
  }

  /**
   * Retrieves the 'Hashlists' menu item.
   * @returns A MainMenuItem for the 'Hashlists' menu.
   */
  getHashlistsMenu(): MainMenuItem {
    const canReadHashlists = this.permissionService.hasPermissionSync(Perm.Hashlist.READ);
    if (!canReadHashlists) {
      return { display: false, label: HeaderMenuLabel.HASHLISTS, actions: [] };
    }

    const actions = [
      {
        label: HeaderMenuLabel.SHOW_HASHLISTS,
        routerLink: ['hashlists', 'hashlist']
      },
      {
        label: HeaderMenuLabel.SUPERHASHLISTS,
        routerLink: ['hashlists', 'superhashlist']
      }
    ];

    const canReadHash = this.permissionService.hasPermissionSync(Perm.Hash.READ);
    if (canReadHash) {
      actions.push(
        {
          label: HeaderMenuLabel.SEARCH_HASH,
          routerLink: ['hashlists', 'search-hash']
        },
        {
          label: HeaderMenuLabel.SHOW_CRACKS,
          routerLink: ['hashlists', 'show-cracks']
        }
      );
    }

    return {
      display: true,
      label: HeaderMenuLabel.HASHLISTS,
      actions: [actions]
    };
  }

  /**
   * Retrieves the 'Files' menu item.
   * @returns A MainMenuItem for the 'Files' menu.
   */
  getFilesMenu(): MainMenuItem {
    // Require File.READ permission for menu to display
    const canRead = this.permissionService.hasPermissionSync(Perm.File.READ);
    if (!canRead) {
      return { display: false, label: HeaderMenuLabel.FILES, actions: [] };
    }
    return {
      display: true,
      label: HeaderMenuLabel.FILES,
      actions: [
        [
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
          }
        ]
      ]
    };
  }

  /**
   * Retrieves the 'Admin' menu item.
   * @returns A MainMenuItem for the 'Admin' menu.
   */
  getAdminMenu(): MainMenuItem {
    if (this.username === '') {
      return { display: false, label: this.username, actions: [] };
    }

    const actions = [
      {
        label: 'Account Settings',
        routerLink: ['account', 'acc-settings']
      },
      {
        label: 'UI Settings',
        routerLink: ['account', 'ui-settings']
      }
    ];

    const canReadNotifications = this.permissionService.hasPermissionSync(Perm.Notif.READ);
    if (canReadNotifications) {
      actions.push({
        label: 'Notifications',
        routerLink: ['account', 'notifications']
      });
    }

    const logoutActions = [
      {
        label: 'Logout',
        action: HeaderMenuAction.LOGOUT,
        red: true
      }
    ];

    return {
      display: true,
      icon: 'person',
      label: this.username,
      actions: [actions, logoutActions]
    };
  }

  /**
   * Retrieves the 'Users' menu item.
   * @returns A MainMenuItem for the 'Users' menu.
   */
  getUsersMenu(): MainMenuItem {
    // Require User.READ permission for menu to display
    const canReadUsers = this.permissionService.hasPermissionSync(Perm.User.READ);
    if (!canReadUsers) {
      return { display: false, label: HeaderMenuLabel.USERS, actions: [] };
    }

    const actions = [
      {
        label: HeaderMenuLabel.ALL_USERS,
        routerLink: ['users', 'all-users']
      }
    ];

    // Require RightGroup.READ permission for 'Global Permissions' menu item
    const canReadRightGroup = this.permissionService.hasPermissionSync(Perm.RightGroup.READ);
    if (canReadRightGroup) {
      actions.push({
        label: HeaderMenuLabel.GLOBAL_PERMISSIONS,
        routerLink: ['users', 'global-permissions-groups']
      });
    }

    // Require AccessGroup.READ permission for 'Access Groups' menu item
    const canReadAccessGroup = this.permissionService.hasPermissionSync(Perm.GroupAccess.READ);
    if (canReadAccessGroup) {
      actions.push({
        label: HeaderMenuLabel.ACCESS_GROUPS,
        routerLink: ['users', 'access-groups']
      });
    }

    return {
      display: true,
      label: HeaderMenuLabel.USERS,
      actions: [actions]
    };
  }

  /**
   * Retrieves the 'Config' menu item.
   * @returns A MainMenuItem for the 'Config' menu.
   */
  getConfigMenu(): MainMenuItem {
    const canRead = this.permissionService.hasPermissionSync(Perm.Config.READ);
    if (!canRead) {
      return { display: false, label: HeaderMenuLabel.CONFIG, actions: [] };
    }
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
          }
        ]
      ]
    };
  }

  /**
   * Retrieves the 'Binaries' menu item.
   * @returns A MainMenuItem for the 'Binaries' menu.
   */
  getBinariesMenu(): MainMenuItem {
    // Require at least one of CrackerBinary.READ, AgentBinary.READ, or Prepro.READ permissions for menu to display
    const canReadCrackerBinary = this.permissionService.hasPermissionSync(Perm.CrackerBinary.READ);
    const canReadAgentBinary = this.permissionService.hasPermissionSync(Perm.AgentBinary.READ);
    const canReadPreprocessors = this.permissionService.hasPermissionSync(Perm.Prepro.READ);

    if (!canReadCrackerBinary && !canReadAgentBinary && !canReadPreprocessors) {
      return { display: false, label: HeaderMenuLabel.BINARIES, actions: [] };
    }

    const actions = [];

    if (canReadCrackerBinary) {
      actions.push({
        label: HeaderMenuLabel.CRACKERS,
        routerLink: ['config', 'engine', 'crackers']
      });
    }

    if (canReadPreprocessors) {
      actions.push({
        label: HeaderMenuLabel.PREPROCESSORS,
        routerLink: ['config', 'engine', 'preprocessors']
      });
    }

    if (canReadAgentBinary) {
      actions.push({
        label: HeaderMenuLabel.AGENT_BINARIES,
        routerLink: ['config', 'engine', 'agent-binaries']
      });
    }

    return {
      display: true,
      label: HeaderMenuLabel.BINARIES,
      actions: [actions]
    };
  }

  /**
   * Retrieves the 'Help' menu item.
   * @returns A MainMenuItem for the 'Help' menu.
   */
  getHelpMenu(): MainMenuItem {
    return {
      display: true,
      icon: 'contact_support',
      label: 'Help / Contact',
      actions: [
        [
          {
            label: 'Documentation',
            icon: 'faBook',
            routerLink: ['https://docs.hashtopolis.org/'],
            external: true
          },
          {
            label: 'Hashtopolis Website',
            icon: 'faGlobe',
            routerLink: ['https://hashtopolis.eu/'],
            external: true
          },
          {
            label: 'Bug Report / Enhancement',
            routerLink: ['https://github.com/h1ashtopolis/server/issues/new/choose'],
            icon: 'faGithub',
            external: true
          },
          {
            label: 'Write us an email',
            icon: 'faPaperplane',
            routerLink: ['mailto:contact@hashtoplis.org'],
            external: true
          },
          {
            label: 'Support',
            icon: 'faDiscord',
            routerLink: ['https://discord.com/invite/S2NTxbz'],
            external: true
          }
        ]
      ]
    };
  }
}
