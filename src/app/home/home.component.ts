import { Observable, Subscription, catchError, forkJoin, map, of } from 'rxjs';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { TaskType } from '@models/task.model';

import { PermissionService } from '@services/permission/permission.service';
import { AutoRefreshService } from '@services/shared/refresh/auto-refresh.service';

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
import { formatUnixTimestamp, unixTimestampInPast } from '@src/app/shared/utils/datetime';

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

  /** Last data load timestamp */
  lastUpdated!: Date;

  /** Loading state */
  loading = false;

  /** Refreshing state */
  refreshing = false;

  /** User permission flags */
  canReadAgents = false;
  canReadTasks = false;
  canReadCracks = false;

  refreshFlash = false;

  /**
   * Heatmap chart data as array of tuples: [date string, count].
   * Example: [['2025-07-01', 5], ['2025-07-02', 7], ...]
   */
  heatmapData: [string, number][] = [];

  private uiSettings: UISettingsUtilityClass;
  private subscriptions: Subscription[] = [];
  private pageReloadTimeout: NodeJS.Timeout;

  /** Auto-refresh subscription */
  private autoRefreshSubscription?: Subscription;

  /**
   * HomeComponent constructor.
   * Sets up breakpoint observers for responsive layout and reads initial theme mode.
   *
   * @param gs GlobalService for API calls.
   * @param autoRefreshService AutoRefreshService to manage auto-refresh logic.
   * @param service LocalStorageService to manage UI config.
   * @param breakpointObserver BreakpointObserver to detect screen sizes.
   * @param permissionService PermissionService to check user permissions.
   */
  constructor(
    private gs: GlobalService,
    protected autoRefreshService: AutoRefreshService,
    private service: LocalStorageService<UIConfig>,
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
   * Angular lifecycle hook: initializes permissions, UI utilities,
   * loads initial data, and sets up auto-refresh if enabled.
   */
  ngOnInit(): void {
    // Initialize permissions
    this.canReadAgents = this.permissionService.hasPermissionSync(Perm.Agent.READ);
    this.canReadTasks = this.permissionService.hasPermissionSync(Perm.Task.READ);
    this.canReadCracks = this.permissionService.hasPermissionSync(Perm.Hash.READ);

    this.loadData();
    // Start auto-refresh if enabled.

    if (this.autoRefreshService.refreshPage) {
      this.autoRefreshSubscription = this.autoRefreshService.refresh$.subscribe(() => this.loadData(true));
      this.subscriptions.push(this.autoRefreshSubscription);
      this.autoRefreshService.startAutoRefresh({ immediate: false });
    }
  }

  /**
   * Angular lifecycle hook: unsubscribes all subscriptions and clears any active timeout.
   */
  ngOnDestroy(): void {
    this.unsubscribeAll();
    this.autoRefreshService.stopAutoRefresh();
    if (this.pageReloadTimeout) {
      clearTimeout(this.pageReloadTimeout);
    }
  }

  /**
   * Unsubscribes from all active subscriptions to prevent memory leaks.
   */
  unsubscribeAll() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  /**
   * Loads dashboard data with loading state
   * @param isRefresh Whether this is a refresh action (true) or initial load (false)
   */
  private loadData(isRefresh = false): void {
    if (isRefresh) {
      this.refreshing = true;
    } else {
      this.loading = true;
    }

    this.initData$().subscribe({
      next: () => {},
      error: (err) => console.error('Failed to load dashboard data:', err),
      complete: () => {
        this.lastUpdated = new Date();
        if (isRefresh) {
          this.refreshing = false;
          this.flashDashboard(); // Flash effect on refresh
        } else {
          this.loading = false;
        }
      }
    });
  }

  /**
   * Fetches all dashboard data depending on user permissions using forkJoin for parallel execution.
   * @returns Observable<void> completing when all requested data is loaded or errored
   */
  private initData$(): Observable<void> {
    const observables: Observable<void>[] = [];

    if (this.canReadAgents) observables.push(this.getAgents$());
    if (this.canReadTasks) observables.push(this.getTasks$(), this.getSuperTasks$());
    if (this.canReadCracks) observables.push(this.getCracks$(), this.updateHeatmapData$());

    if (observables.length === 0) return of(undefined);

    return forkJoin(observables).pipe(map(() => undefined));
  }

  /**
   * Enables or disables the auto-reload functionality and displays
   * a corresponding success message.
   *
   * @param flag True to enable autoreload, false to pause it.
   */
  protected setAutoRefresh(flag: boolean): void {
    // Unsubscribe existing
    if (this.autoRefreshSubscription) {
      this.autoRefreshSubscription.unsubscribe();
      this.autoRefreshSubscription = undefined;
    }
    this.autoRefreshService.toggleAutoRefresh(flag, { immediate: true });
    if (flag) {
      const sub = this.autoRefreshService.refresh$.subscribe(() => {
        // Only reload if no load/refresh is in progress
        if (!this.loading && !this.refreshing) {
          this.loadData(true);
        }
      });
      this.subscriptions.push(sub);
    }
  }

  /**
   * Fetches the number of active and total agents.
   * @returns Observable<void> completing when data is loaded or errored
   */
  private getAgents$(): Observable<void> {
    const params = new RequestParamBuilder()
      .addFilter({ field: 'isActive', operator: FilterType.EQUAL, value: true })
      .addIncludeTotal(true)
      .create();

    return this.gs.getAll(SERV.AGENTS_COUNT, params).pipe(
      map((response: ResponseWrapper) => {
        this.totalAgents = response.meta.total_count;
        this.activeAgents = response.meta.count;
      }),
      catchError((err) => {
        console.error('Failed to fetch agents:', err);
        return of(undefined);
      })
    );
  }

  /**
   * Fetches total and completed tasks count.
   * Archived tasks are excluded.
   * @returns Observable<void> completing when data is loaded or errored
   */
  private getTasks$(): Observable<void> {
    const paramsTotalTasks = new RequestParamBuilder()
      .addInclude('tasks')
      .addFilter({ field: 'taskType', operator: FilterType.EQUAL, value: 0 })
      .addFilter({ field: 'isArchived', operator: FilterType.EQUAL, value: 0 })
      .create();

    const paramsCompletedTasks = new RequestParamBuilder()
      .addInclude('tasks')
      .addFilter({ field: 'taskType', operator: FilterType.EQUAL, value: 0 })
      .addFilter({ field: 'isArchived', operator: FilterType.EQUAL, value: 0 })
      .addFilter({ field: 'keyspace', operator: FilterType.GREATER, value: 0 })
      .create();

    return forkJoin([
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsTotalTasks).pipe(
        map((res: ResponseWrapper) => (this.totalTasks = res.meta.count)),
        catchError((err) => {
          console.error('Failed to fetch total tasks:', err);
          return of(undefined);
        })
      ),
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsCompletedTasks).pipe(
        map((res: ResponseWrapper) => (this.completedTasks = res.meta.count)),
        catchError((err) => {
          console.error('Failed to fetch completed tasks:', err);
          return of(undefined);
        })
      )
    ]).pipe(map(() => undefined));
  }

  /**
   * Fetches total and completed supertasks count.
   * @returns Observable<void> completing when data is loaded or errored
   */
  private getSuperTasks$(): Observable<void> {
    const paramsTotalSupertasks = new RequestParamBuilder()
      .addFilter({ field: 'taskType', operator: FilterType.EQUAL, value: TaskType.SUPERTASK })
      .create();

    const paramsCompletedSupertasks = new RequestParamBuilder()
      .addFilter({ field: 'keyspace', operator: FilterType.EQUAL, value: 'keyspaceProgress' })
      .addFilter({ field: 'keyspace', operator: FilterType.GREATER, value: 0 })
      .addFilter({ field: 'taskType', operator: FilterType.EQUAL, value: TaskType.SUPERTASK })
      .addInclude('tasks')
      .create();

    return forkJoin([
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsTotalSupertasks).pipe(
        map((res: ResponseWrapper) => (this.totalSupertasks = res.meta.count)),
        catchError((err) => {
          console.error('Failed to fetch total supertasks:', err);
          return of(undefined);
        })
      ),
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsCompletedSupertasks).pipe(
        map((res: ResponseWrapper) => (this.completedSupertasks = res.meta.count)),
        catchError((err) => {
          console.error('Failed to fetch completed supertasks:', err);
          return of(undefined);
        })
      )
    ]).pipe(map(() => undefined));
  }

  /**
   * Fetches cracks count for the past 7 days and updates the heatmap data.
   * @returns Observable<void> completing when data is loaded or errored
   */
  private getCracks$(): Observable<void> {
    const timestampInPast = unixTimestampInPast(7);
    const params = new RequestParamBuilder()
      .addFilter({ field: 'timeCracked', operator: FilterType.GREATER, value: timestampInPast })
      .create();

    return this.gs.getAll(SERV.HASHES_COUNT, params).pipe(
      map((res: ResponseWrapper) => {
        this.totalCracks = res.meta.count;
      }),
      catchError((err) => {
        console.error('Failed to fetch cracks count:', err);
        return of(undefined);
      }),
      map(() => undefined)
    );
  }

  /**
   * Loads cracked hashes and prepares heatmap data as date/count pairs.
   * Updates the lastUpdated timestamp.
   * @returns Observable<void> completing when data is loaded or errored
   */
  private updateHeatmapData$(): Observable<void> {
    const params = new RequestParamBuilder()
      .addFilter({ field: 'isCracked', operator: FilterType.EQUAL, value: 1 })
      .create();

    return this.gs.getAll(SERV.HASHES, params).pipe(
      map((res: ResponseWrapper) => {
        const hashes = new JsonAPISerializer().deserialize<JHash[]>({
          data: res.data,
          included: res.included
        });

        const formattedDates: string[] = hashes.map((h) => formatUnixTimestamp(h.timeCracked, 'yyyy-MM-dd'));
        const dateCounts = this.countOccurrences(formattedDates);

        this.heatmapData = Object.entries(dateCounts).map(([date, count]) => [date, count]);
      }),
      catchError((err) => {
        console.error('Failed to fetch hash heatmap data:', err);
        return of(undefined);
      }),
      map(() => undefined)
    );
  }

  /**
   * Triggers a brief flash effect on the dashboard to indicate data refresh.
   * @private
   */
  private flashDashboard(): void {
    this.refreshFlash = true;
    setTimeout(() => {
      this.refreshFlash = false;
    }, 500); // duration of the flash in ms
  }

  /**
   * Counts occurrences of each string in the given array.
   *
   * @param arr Array of strings (e.g., dates)
   * @returns Object with keys as strings and values as their counts
   */
  private countOccurrences(arr: string[]): { [key: string]: number } {
    return arr.reduce((counts, item) => {
      counts[item] = (counts[item] || 0) + 1;
      return counts;
    }, {});
  }
}
