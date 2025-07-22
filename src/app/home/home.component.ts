import { Subscription } from 'rxjs';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { TaskType } from '@models/task.model';

import { PermissionService } from '@services/permission/permission.service';
import { AlertService } from '@services/shared/alert.service';

import { Perm } from '@src/app/core/_constants/userpermissions.config';
import { PageTitle } from '@src/app/core/_decorators/autotitle';
import { UIConfig } from '@src/app/core/_models/config-ui.model';
import { JHash } from '@src/app/core/_models/hash.model';
import { FilterType } from '@src/app/core/_models/request-params.model';
import { ResponseWrapper } from '@src/app/core/_models/response.model';
import { JsonAPISerializer } from '@src/app/core/_services/api/serializer-service';
import { SERV } from '@src/app/core/_services/main.config';
import { GlobalService } from '@src/app/core/_services/main.service';
import { RequestParamBuilder } from '@src/app/core/_services/params/builder-implementation.service';
import { LocalStorageService } from '@src/app/core/_services/storage/local-storage.service';
import { UISettingsUtilityClass } from '@src/app/shared/utils/config';
import { formatDate, formatUnixTimestamp, unixTimestampInPast } from '@src/app/shared/utils/datetime';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
@PageTitle(['Dashboard'])
export class HomeComponent implements OnInit, OnDestroy {
  /**
   * Utility class for UI settings retrieval and updates.
   */
  util: UISettingsUtilityClass;

  /** Flags for responsive design */
  screenXS = false;
  screenS = false;
  screenM = false;
  screenL = false;
  screenXL = false;

  /** Whether dark mode is enabled */
  isDarkMode = false;

  /** Dashboard statistics counters */
  activeAgents = 0;
  totalAgents = 0;
  totalTasks = 0;
  completedTasks = 0;
  totalCracks = 0;
  completedSupertasks = 0;
  totalSupertasks = 0;

  /** Timestamp string for last update */
  lastUpdated: string;

  /** User permission flags */
  canReadAgents = false;
  canReadTasks = false;
  canReadCracks = false;

  /**
   * Heatmap chart data as array of tuples: [date string, count].
   * Example: [['2025-07-01', 5], ['2025-07-02', 7], ...]
   */
  heatmapData: [string, number][] = [];

  private uiSettings: UISettingsUtilityClass;
  private subscriptions: Subscription[] = [];
  private pageReloadTimeout: NodeJS.Timeout;

  /**
   * HomeComponent constructor.
   * Sets up breakpoint observers for responsive layout and reads initial theme mode.
   *
   * @param gs GlobalService for API calls.
   * @param service LocalStorageService to manage UI config.
   * @param alertService AlertService to show messages.
   * @param breakpointObserver BreakpointObserver to detect screen sizes.
   * @param permissionService PermissionService to check user permissions.
   */
  constructor(
    private gs: GlobalService,
    private service: LocalStorageService<UIConfig>,
    private alertService: AlertService,
    private breakpointObserver: BreakpointObserver,
    private permissionService: PermissionService
  ) {
    this.uiSettings = new UISettingsUtilityClass(this.service);
    this.isDarkMode = this.uiSettings.getSetting('theme') === 'dark';

    // Observe screen size breakpoints for responsive behavior
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((result) => {
        const breakpoints = result.breakpoints;

        this.screenXS = breakpoints[Breakpoints.XSmall] || false;
        this.screenS = breakpoints[Breakpoints.Small] || false;
        this.screenM = breakpoints[Breakpoints.Medium] || false;
        this.screenL = breakpoints[Breakpoints.Large] || false;
        this.screenXL = breakpoints[Breakpoints.XLarge] || false;
      });
  }

  /**
   * Returns the current refresh interval from UI settings.
   */
  get refreshInterval(): number {
    return this.util.getSetting<number>('refreshInterval');
  }

  /**
   * Returns whether auto-refresh page reload is enabled in UI settings.
   */
  get refreshPage(): boolean {
    return this.util.getSetting<boolean>('refreshPage');
  }

  /**
   * Angular lifecycle hook: initializes permissions, UI utilities,
   * loads initial data, and sets up auto-refresh if enabled.
   */
  ngOnInit(): void {
    this.canReadAgents = this.permissionService.hasPermissionSync(Perm.Agent.READ);
    this.canReadTasks = this.permissionService.hasPermissionSync(Perm.Task.READ);
    this.canReadCracks = this.permissionService.hasPermissionSync(Perm.Hash.READ);
    this.util = new UISettingsUtilityClass(this.service);

    this.initData();
    this.onAutorefresh();
  }

  /**
   * Angular lifecycle hook: unsubscribes all subscriptions and clears any active timeout.
   */
  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    if (this.pageReloadTimeout) {
      clearTimeout(this.pageReloadTimeout);
    }
  }

  /**
   * Initiates a page reload at intervals defined by refreshInterval setting,
   * if the refreshPage setting is enabled.
   */
  onAutorefresh(): void {
    if (!this.refreshPage) {
      return;
    }
    const timeoutMs = this.refreshInterval * 1000;
    this.pageReloadTimeout = setTimeout(() => {
      this.initData();
      this.onAutorefresh();
    }, timeoutMs);
  }

  /**
   * Enables or disables the auto-reload functionality and displays
   * a corresponding success message.
   *
   * @param flag True to enable autoreload, false to pause it.
   */
  setAutoreload(flag: boolean): void {
    const updatedSettings = this.util.updateSettings({ refreshPage: flag });
    if (updatedSettings) {
      const message = flag ? 'Autoreload is enabled' : 'Autoreload is paused';
      if (!flag && this.pageReloadTimeout) {
        clearTimeout(this.pageReloadTimeout);
      }
      this.alertService.showSuccessMessage(message);
    }
    this.initData();
    this.onAutorefresh();
  }

  /**
   * Fetches all dashboard data depending on user permissions.
   * Retrieves agents, tasks, supertasks, cracks, and heatmap data.
   */
  initData(): void {
    if (this.canReadAgents) {
      this.getAgents();
    }
    if (this.canReadTasks) {
      this.getTasks();
      this.getSuperTasks();
    }
    if (this.canReadCracks) {
      this.getCracks();
    }
  }

  /**
   * Counts occurrences of each string in the given array.
   *
   * @param arr Array of strings (e.g., dates)
   * @returns Object with keys as strings and values as their counts
   */
  countOccurrences(arr: string[]): { [key: string]: number } {
    return arr.reduce((counts, item) => {
      counts[item] = (counts[item] || 0) + 1;
      return counts;
    }, {});
  }

  /**
   * Fetches the number of active and total agents.
   */
  private getAgents(): void {
    const params = new RequestParamBuilder()
      .addFilter({ field: 'isActive', operator: FilterType.EQUAL, value: true })
      .addIncludeTotal(true)
      .create();

    this.subscriptions.push(
      this.gs.getAll(SERV.AGENTS_COUNT, params).subscribe((response: ResponseWrapper) => {
        this.totalAgents = response.meta.total_count;
        this.activeAgents = response.meta.count;
      })
    );
  }

  /**
   * Fetches total and completed tasks count.
   */
  private getTasks(): void {
    const paramsTotalTasks = new RequestParamBuilder()
      .addInclude('tasks')
      .addFilter({ field: 'taskType', operator: FilterType.EQUAL, value: 0 })
      .addFilter({ field: 'isArchived', operator: FilterType.EQUAL, value: 0 })
      .create();

    this.subscriptions.push(
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsTotalTasks).subscribe((response: ResponseWrapper) => {
        this.totalTasks = response.meta.count;
      })
    );

    const paramsCompletedTasks = new RequestParamBuilder()
      .addInclude('tasks')
      .addFilter({ field: 'taskType', operator: FilterType.EQUAL, value: 0 })
      .addFilter({ field: 'keyspace', operator: FilterType.GREATER, value: 0 })
      .create();

    this.subscriptions.push(
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsCompletedTasks).subscribe((response: ResponseWrapper) => {
        this.completedTasks = response.meta.count;
      })
    );
  }

  /**
   * Fetches total and completed supertasks count.
   */
  private getSuperTasks(): void {
    const paramsTotalSupertasks = new RequestParamBuilder()
      .addFilter({ field: 'taskType', operator: FilterType.EQUAL, value: TaskType.SUPERTASK })
      .create();

    this.subscriptions.push(
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsTotalSupertasks).subscribe((response: ResponseWrapper) => {
        this.totalSupertasks = response.meta.count;
      })
    );

    const paramsCompletedSupertasks = new RequestParamBuilder()
      .addFilter({ field: 'keyspace', operator: FilterType.EQUAL, value: 'keyspaceProgress' })
      .addFilter({ field: 'keyspace', operator: FilterType.GREATER, value: 0 })
      .addFilter({ field: 'taskType', operator: FilterType.EQUAL, value: TaskType.SUPERTASK })
      .addInclude('tasks')
      .create();

    this.subscriptions.push(
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsCompletedSupertasks).subscribe((response: ResponseWrapper) => {
        this.completedSupertasks = response.meta.count;
      })
    );
  }

  /**
   * Fetches cracks count for the past 7 days and updates the heatmap data.
   */
  private getCracks(): void {
    const timestampInPast = unixTimestampInPast(7);
    const params = new RequestParamBuilder()
      .addFilter({ field: 'timeCracked', operator: FilterType.GREATER, value: timestampInPast })
      .create();

    this.subscriptions.push(
      this.gs.getAll(SERV.HASHES_COUNT, params).subscribe((response: ResponseWrapper) => {
        this.totalCracks = response.meta.count;
        this.updateHeatmapData();
      })
    );
  }

  /**
   * Loads cracked hashes and prepares heatmap data as date/count pairs.
   * Updates the lastUpdated timestamp.
   */
  private updateHeatmapData(): void {
    const params = new RequestParamBuilder()
      .addFilter({ field: 'isCracked', operator: FilterType.EQUAL, value: 1 })
      .create();

    this.subscriptions.push(
      this.gs.getAll(SERV.HASHES, params).subscribe((response: ResponseWrapper) => {
        const hashes = new JsonAPISerializer().deserialize<JHash[]>({
          data: response.data,
          included: response.included
        });

        const formattedDates: string[] = hashes.map((hash) => formatUnixTimestamp(hash.timeCracked, 'yyyy-MM-dd'));

        const dateCounts = this.countOccurrences(formattedDates);
        this.heatmapData = Object.entries(dateCounts).map(([date, count]) => [date, count]);

        this.lastUpdated = formatDate(new Date(), this.util.getSetting('timefmt'));
      })
    );
  }
}
