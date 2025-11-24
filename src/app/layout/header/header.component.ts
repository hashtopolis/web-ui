import { Subject, Subscription, takeUntil } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthUser } from '@models/auth-user.model';
import { UIConfig } from '@models/config-ui.model';

import { AuthService } from '@services/access/auth.service';
import { PermissionService } from '@services/permission/permission.service';
import { AgentRoleService } from '@services/roles/agents/agent-role.service';
import { AgentBinaryRoleService } from '@services/roles/binaries/agent-binary-role.service';
import { CrackerBinaryRoleService } from '@services/roles/binaries/cracker-binary-role.service';
import { PreprocessorRoleService } from '@services/roles/binaries/preprocessor-role.service';
import { ConfigRoleWrapperService } from '@services/roles/config/config-role-wrapper.service';
import { FileRoleService } from '@services/roles/file-role.service';
import { HashRoleService } from '@services/roles/hashlists/hash-role.service';
import { HashListRoleService } from '@services/roles/hashlists/hashlist-role.service';
import { SuperHashListRoleService } from '@services/roles/hashlists/superhashlist-role.service';
import { TasksRoleService } from '@services/roles/tasks/tasks-role.service';
import { UserRoleWrapperService } from '@services/roles/user/user-role-wrapper.service';
import { ThemeService } from '@services/shared/theme.service';
import { LocalStorageService } from '@services/storage/local-storage.service';

import { ActionMenuEvent, ActionMenuItem } from '@components/menus/action-menu/action-menu.model';

import { Perm } from '@src/app/core/_constants/userpermissions.config';
import { EasterEggService } from '@src/app/core/_services/shared/easter-egg.service';
import { HeaderMenuAction, HeaderMenuLabel } from '@src/app/layout/header/header.constants';
import { MainMenuItem } from '@src/app/layout/header/header.model';
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

  // Before showing header check Authentification
  private userSub: Subscription;
  isAuthenticated = false;

  headerConfig = environment.config.header;
  mainMenu: MainMenuItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private storage: LocalStorageService<UIConfig>,
    private themes: ThemeService,
    private permissionService: PermissionService,
    private easterEggService: EasterEggService,
    private tasksRoleService: TasksRoleService,
    private hashListRoleService: HashListRoleService,
    private agentRoleService: AgentRoleService,
    private superHashListRoleService: SuperHashListRoleService,
    private hashRoleService: HashRoleService,
    private fileRoleService: FileRoleService,
    private crackerBinaryRoleService: CrackerBinaryRoleService,
    private agentBinaryRoleService: AgentBinaryRoleService,
    private preprocessorRoleService: PreprocessorRoleService,
    private configRoleWrapper: ConfigRoleWrapperService,
    private userRoleWrapperService: UserRoleWrapperService
  ) {
    this.isAuth();
    this.uiSettings = new UISettingsUtilityClass(this.storage, this.themes);
  }

  isAuth(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
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

  menuItemClicked(event: ActionMenuEvent<unknown>): void {
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
    const actions: Array<ActionMenuItem> = [];

    if (this.agentRoleService.hasRole('read')) {
      actions.push({
        label: HeaderMenuLabel.SHOW_AGENTS,
        routerLink: ['agents', 'show-agents'],
        showAddButton: this.agentRoleService.hasRole('create'),
        routerLinkAdd: ['agents', 'new-agent'],
        tooltipAddButton: 'New Agent'
      });
    }

    if (this.agentRoleService.hasRole('readStat')) {
      actions.push({
        label: HeaderMenuLabel.AGENT_STATUS,
        routerLink: ['agents', 'agent-status'],
        showAddButton: false,
        routerLinkAdd: [],
        tooltipAddButton: ''
      });
    }

    return {
      display: true,
      label: HeaderMenuLabel.AGENTS,
      actions: [actions]
    };
  }

  /**
   * Retrieves the 'Tasks' menu item
   * @returns a MainMenuItem for the 'Tasks' menu
   */
  getTasksMenu(): MainMenuItem {
    const taskActions: Array<ActionMenuItem> = [];

    if (this.tasksRoleService.hasRole('read')) {
      taskActions.push({
        label: HeaderMenuLabel.SHOW_TASKS,
        routerLink: ['tasks', 'show-tasks'],
        showAddButton: this.tasksRoleService.hasRole('create'),
        routerLinkAdd: ['tasks', 'new-task'],
        tooltipAddButton: 'New Task'
      });
    }

    // Require TaskWrapper.READ permission for menu to display
    const canReadPreTasks = this.permissionService.hasPermissionSync(Perm.Pretask.READ);
    const canReadSupertasks = this.permissionService.hasPermissionSync(Perm.SuperTask.READ);
    const canReadChunks = this.permissionService.hasPermissionSync(Perm.Chunk.READ);

    if (!canReadPreTasks && !canReadSupertasks && !canReadChunks) {
      return { display: false, label: HeaderMenuLabel.TASKS, actions: [] };
    }

    if (canReadPreTasks) {
      taskActions.push({
        label: HeaderMenuLabel.PRECONFIGURED_TASKS,
        routerLink: ['tasks', 'preconfigured-tasks'],
        showAddButton: this.permissionService.hasPermissionSync(Perm.Pretask.CREATE),
        routerLinkAdd: ['tasks', 'new-preconfigured-tasks'],
        tooltipAddButton: 'New Preconfigured Task'
      });
    }

    if (canReadSupertasks) {
      taskActions.push(
        {
          label: HeaderMenuLabel.SUPERTASKS,
          routerLink: ['tasks', 'supertasks'],
          showAddButton: this.permissionService.hasPermissionSync(Perm.SuperTask.CREATE),
          routerLinkAdd: ['tasks', 'new-supertasks'],
          tooltipAddButton: 'New Supertask'
        },
        {
          label: HeaderMenuLabel.IMPORT_SUPERTASK,
          routerLink: ['tasks', 'import-supertasks', 'masks']
        }
      );
    }

    // Require Chunk.READ permission for chunk activity menu item to display
    if (canReadChunks) {
      taskActions.push({
        label: HeaderMenuLabel.CHUNK_ACTIVITY,
        routerLink: ['tasks', 'chunks']
      });
    }

    return {
      display: taskActions.length > 0,
      label: HeaderMenuLabel.TASKS,
      actions: [taskActions]
    };
  }

  /**
   * Retrieves the 'Hashlists' menu item.
   * @returns A MainMenuItem for the 'Hashlists' menu.
   */
  getHashlistsMenu(): MainMenuItem {
    const actions: Array<ActionMenuItem> = [];

    if (this.hashListRoleService.hasRole('read')) {
      actions.push({
        label: HeaderMenuLabel.SHOW_HASHLISTS,
        routerLink: ['hashlists', 'hashlist'],
        showAddButton: this.hashListRoleService.hasRole('create'),
        routerLinkAdd: ['hashlists', 'new-hashlist'],
        tooltipAddButton: 'New Hashlist'
      });
    }

    if (this.superHashListRoleService.hasRole('read')) {
      actions.push({
        label: HeaderMenuLabel.SUPERHASHLISTS,
        routerLink: ['hashlists', 'superhashlist'],
        showAddButton: this.superHashListRoleService.hasRole('create'),
        routerLinkAdd: ['hashlists', 'new-superhashlist'],
        tooltipAddButton: 'New Superhashlist'
      });
    }

    if (this.hashRoleService.hasRole('read')) {
      actions.push(
        {
          label: HeaderMenuLabel.SEARCH_HASH,
          routerLink: ['hashlists', 'search-hash'],
          showAddButton: false,
          routerLinkAdd: [],
          tooltipAddButton: ''
        },
        {
          label: HeaderMenuLabel.SHOW_CRACKS,
          routerLink: ['hashlists', 'show-cracks'],
          showAddButton: false,
          routerLinkAdd: [],
          tooltipAddButton: ''
        }
      );
    }

    return {
      display: actions.length > 0,
      label: HeaderMenuLabel.HASHLISTS,
      actions: [actions]
    };
  }

  /**
   * Retrieves the 'Files' menu item.
   * @returns A MainMenuItem for the 'Files' menu.
   */
  getFilesMenu(): MainMenuItem {
    const actions: Array<ActionMenuItem> = [];

    if (this.fileRoleService.hasRole('read')) {
      const canCreateFiles = this.fileRoleService.hasRole('create');
      actions.push(
        {
          label: HeaderMenuLabel.WORDLISTS,
          routerLink: ['files', 'wordlist'],
          showAddButton: canCreateFiles,
          routerLinkAdd: ['files', 'wordlist', 'new-wordlist'],
          tooltipAddButton: 'New Wordlist'
        },
        {
          label: HeaderMenuLabel.RULES,
          routerLink: ['files', 'rules'],
          showAddButton: canCreateFiles,
          routerLinkAdd: ['files', 'rules', 'new-rule'],
          tooltipAddButton: 'New Rule'
        },
        {
          label: HeaderMenuLabel.OTHER,
          routerLink: ['files', 'other'],
          showAddButton: canCreateFiles,
          routerLinkAdd: ['files', 'other', 'new-other'],
          tooltipAddButton: 'New File'
        }
      );
    }

    return {
      display: actions.length > 0,
      label: HeaderMenuLabel.FILES,
      actions: [actions]
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

    if (this.configRoleWrapper.hasNotificationRole('read')) {
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
    const actions: Array<ActionMenuItem> = [];

    if (this.userRoleWrapperService.hasUserRole('read')) {
      actions.push({
        label: HeaderMenuLabel.ALL_USERS,
        routerLink: ['users', 'all-users']
      });
    }
    if (this.userRoleWrapperService.hasPermissionRole('read')) {
      actions.push({
        label: HeaderMenuLabel.GLOBAL_PERMISSIONS,
        routerLink: ['users', 'global-permissions-groups']
      });
    }
    if (this.userRoleWrapperService.hasAccessGroupRole('read')) {
      actions.push({
        label: HeaderMenuLabel.ACCESS_GROUPS,
        routerLink: ['users', 'access-groups']
      });
    }

    return {
      display: actions.length > 0,
      label: HeaderMenuLabel.USERS,
      actions: [actions]
    };
  }

  /**
   * Retrieves the 'Config' menu item.
   * @returns A MainMenuItem for the 'Config' menu.
   */
  getConfigMenu(): MainMenuItem {
    const actions: Array<ActionMenuItem> = [];

    if (this.configRoleWrapper.hasSettingsRole('read')) {
      actions.push({
        label: HeaderMenuLabel.SETTINGS,
        routerLink: ['config', 'agent']
      });
    }
    if (this.configRoleWrapper.hasHashTypesRole('read')) {
      actions.push({
        label: HeaderMenuLabel.HASHTYPES,
        routerLink: ['config', 'hashtypes']
      });
    }
    if (this.configRoleWrapper.hasHealthCheckRole('read')) {
      actions.push({
        label: HeaderMenuLabel.HEALTH_CHECKS,
        routerLink: ['config', 'health-checks']
      });
    }
    if (this.configRoleWrapper.hasLogRole('read')) {
      actions.push({
        label: HeaderMenuLabel.LOG,
        routerLink: ['config', 'log']
      });
    }
    return {
      display: actions.length > 0,
      label: HeaderMenuLabel.CONFIG,
      actions: [actions]
    };
  }

  /**
   * Retrieves the 'Binaries' menu item.
   * @returns A MainMenuItem for the 'Binaries' menu.
   */
  getBinariesMenu(): MainMenuItem {
    const actions: Array<ActionMenuItem> = [];

    if (this.crackerBinaryRoleService.hasRole('read')) {
      actions.push({
        label: HeaderMenuLabel.CRACKERS,
        routerLink: ['config', 'engine', 'crackers']
      });
    }

    if (this.preprocessorRoleService.hasRole('read')) {
      actions.push({
        label: HeaderMenuLabel.PREPROCESSORS,
        routerLink: ['config', 'engine', 'preprocessors']
      });
    }

    if (this.agentBinaryRoleService.hasRole('read')) {
      actions.push({
        label: HeaderMenuLabel.AGENT_BINARIES,
        routerLink: ['config', 'engine', 'agent-binaries']
      });
    }

    return {
      display: actions.length > 0,
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
            routerLink: ['https://github.com/hashtopolis/server/issues/new/choose'],
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
