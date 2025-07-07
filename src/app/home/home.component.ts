import { HeatmapChart } from 'echarts/charts';
import { CalendarComponent, TitleComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { Subscription } from 'rxjs';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

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
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  util: UISettingsUtilityClass;

  /** Flags for responsive design */
  screenXS = false;
  screenS = false;
  screenM = false;
  screenL = false;
  screenXL = false;
  isDarkMode = false;
  /** Counters for dashboard statistics */
  activeAgents = 0;
  totalAgents = 0;
  totalTasks = 0;
  completedTasks = 0;
  totalCracks = 0;
  completedSupertasks = 0;
  totalSupertasks = 0;
  lastUpdated: string;

  /** User permissions */
  canReadAgents = false;
  canReadTasks = false;
  canReadCracks = false;

  /** DarkMode */
  protected uiSettings: UISettingsUtilityClass;
  private subscriptions: Subscription[] = [];
  private pageReloadTimeout: NodeJS.Timeout;
  private crackedChart: echarts.ECharts;

  constructor(
    private gs: GlobalService,
    private service: LocalStorageService<UIConfig>,
    private alertService: AlertService,
    private breakpointObserver: BreakpointObserver,
    private permissionService: PermissionService
  ) {
    this.uiSettings = new UISettingsUtilityClass(this.service);
    this.isDarkMode = this.uiSettings.getSetting('theme') === 'dark';
    // Observe screen breakpoints for responsive design
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe((result) => {
        const breakpoints = result.breakpoints;

        this.screenXS = false;
        this.screenS = false;
        this.screenM = false;
        this.screenL = false;
        this.screenXL = false;

        if (breakpoints[Breakpoints.XSmall]) {
          this.screenXS = true;
        } else if (breakpoints[Breakpoints.Small]) {
          this.screenS = true;
        } else if (breakpoints[Breakpoints.Medium]) {
          this.screenM = true;
        } else if (breakpoints[Breakpoints.Large]) {
          this.screenL = true;
        } else if (breakpoints[Breakpoints.XLarge]) {
          this.screenXL = true;
        }
      });
  }

  /**
   * Get the autorefresh interval setting.
   */
  get refreshInterval(): number {
    return this.util.getSetting<number>('refreshInterval');
  }

  /**
   * Check if autorefresh of the page is enabled.
   */
  get refreshPage(): boolean {
    return this.util.getSetting<boolean>('refreshPage');
  }

  ngOnInit(): void {
    this.canReadAgents = this.permissionService.hasPermissionSync(Perm.Agent.READ);
    this.canReadTasks = this.permissionService.hasPermissionSync(Perm.Task.READ);
    this.canReadCracks = this.permissionService.hasPermissionSync(Perm.Hash.READ);
    this.util = new UISettingsUtilityClass(this.service);
    this.initData();
    this.onAutorefresh();
  }

  ngAfterViewInit() {
    if (this.canReadCracks) {
      this.initChart();
    }
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  /**
   * Automatically refresh the page based on the configured interval.
   */
  onAutorefresh() {
    const timeout = this.refreshInterval;
    if (this.refreshPage) {
      this.pageReloadTimeout = setTimeout(() => {
        this.initData();
        this.onAutorefresh();
      }, timeout * 1000);
    }
  }

  /**
   * Toggle the autoreload setting and refresh the data.
   *
   * @param flag - New autoreload flag.
   */
  setAutoreload(flag: boolean) {
    const updatedSettings = this.util.updateSettings({ refreshPage: flag });
    let message = '';

    if (updatedSettings) {
      if (flag) {
        message = 'Autoreload is enabled';
      } else {
        message = 'Autoreload is paused';
        clearTimeout(this.pageReloadTimeout);
      }
      this.alertService.showSuccessMessage(message);
    }
    this.initData();
    this.onAutorefresh();
  }

  /**
   * Initialize dashboard data conditionally on user's permission.
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
   * Count the occurrences of items in an array.
   *
   * @param arr - The array to count occurrences in.
   * @returns An object with the occurrences of each item.
   */
  countOccurrences(arr: string[]): { [key: string]: number } {
    return arr.reduce((counts, date) => {
      counts[date] = (counts[date] || 0) + 1;
      return counts;
    }, {});
  }

  /**
   * Initialize the heatmap chart.
   */
  initChart(): void {
    echarts.use([
      TitleComponent,
      CalendarComponent,
      TooltipComponent,
      VisualMapComponent,
      HeatmapChart,
      CanvasRenderer
    ]);
    const isDarkTheme = this.isDarkMode ? 'dark' : '';
    const chartDom = document.getElementById('pcard');
    this.crackedChart = echarts.init(chartDom, isDarkTheme);
  }

  /**
   * Update the heatmap chart.
   */
  updateChart(): void {
    const params = new RequestParamBuilder()
      .addFilter({
        field: 'isCracked',
        operator: FilterType.EQUAL,
        value: 1
      })
      .create();
    this.subscriptions.push(
      this.gs.getAll(SERV.HASHES, params).subscribe((response: ResponseWrapper) => {
        const hashes = new JsonAPISerializer().deserialize<JHash[]>({
          data: response.data,
          included: response.included
        });
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Extract and format cracked dates
        const formattedDates: string[] = hashes.map((hash) => formatUnixTimestamp(hash.timeCracked, 'yyyy-MM-dd'));

        // Count occurrences of each date
        const dateCounts: { [key: string]: number } = this.countOccurrences(formattedDates);

        // Convert date counts to the required format
        const countsExtended = Object.keys(dateCounts).map((date) => [date, dateCounts[date]]);

        // DarkMode
        const backgroundColor = this.isDarkMode ? '#212121' : '';

        const option = {
          darkMode: true,
          title: {},
          tooltip: {
            position: 'top',
            formatter: function (p) {
              const format = echarts.time.format(p.data[0], '{dd}-{MM}-{yyyy}', false);
              return format + ': ' + p.data[1];
            }
          },
          backgroundColor: backgroundColor,
          visualMap: {
            min: 0,
            max: Math.ceil(hashes.length / 10) * 10,
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            top: 65
          },
          calendar: {
            top: 120,
            left: 30,
            right: 30,
            cellSize: ['auto', 13],
            range: currentYear,
            splitLine: this.isDarkMode
              ? {
                  lineStyle: {
                    color: '#FFFFFF'
                  }
                }
              : {},
            itemStyle: {
              borderWidth: 0.5
            },
            yearLabel: { show: false }
          },
          series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: countsExtended,
            label: {
              show: true,
              formatter: function (params) {
                return currentDate.getDate() === params.data[0] ? 'X' : '';
              }
            }
          }
        };

        this.crackedChart.setOption(option);
        this.lastUpdated = formatDate(new Date(), this.util.getSetting('timefmt'));
      })
    );
  }

  /**
   * Get the list of active agents.
   */
  private getAgents(): void {
    const params = new RequestParamBuilder()
      .addFilter({
        field: 'isActive',
        operator: FilterType.EQUAL,
        value: true
      })
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
   * Get the list of tasks.
   */
  private getTasks(): void {
    const paramsTotalTasks = new RequestParamBuilder()
      .addInclude('tasks')
      .addFilter({
        field: 'taskType',
        operator: FilterType.EQUAL,
        value: 0
      })
      .addFilter({ field: 'isArchived', operator: FilterType.EQUAL, value: 0 })
      .create();
    this.subscriptions.push(
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsTotalTasks).subscribe((response: ResponseWrapper) => {
        this.totalTasks = response.meta.count;
      })
    );

    const paramsCompletedTasks = new RequestParamBuilder()
      .addInclude('tasks')
      .addFilter({
        field: 'taskType',
        operator: FilterType.EQUAL,
        value: 0
      })
      .addFilter({ field: 'keyspace', operator: FilterType.GREATER, value: 0 })
      .create();
    this.subscriptions.push(
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsCompletedTasks).subscribe((response: ResponseWrapper) => {
        this.completedTasks = response.meta.count;
      })
    );
  }

  /**
   * Get the list of supertasks.
   */
  private getSuperTasks(): void {
    const paramsTotalTasks = new RequestParamBuilder()
      .addFilter({ field: 'taskType', operator: FilterType.EQUAL, value: TaskType.SUPERTASK })
      .create();

    this.subscriptions.push(
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsTotalTasks).subscribe((response: ResponseWrapper) => {
        this.totalSupertasks = response.meta.count;
      })
    );

    const paramsCompletedTasks = new RequestParamBuilder()
      .addFilter({ field: 'keyspace', operator: FilterType.EQUAL, value: 'keyspaceProgress' })
      .addFilter({ field: 'keyspace', operator: FilterType.GREATER, value: 0 })
      .addFilter({ field: 'taskType', operator: FilterType.EQUAL, value: TaskType.SUPERTASK })
      .addInclude('tasks')
      .create();

    this.subscriptions.push(
      this.gs.getAll(SERV.TASKS_WRAPPER_COUNT, paramsCompletedTasks).subscribe((response: ResponseWrapper) => {
        this.completedSupertasks = response.meta.count;
      })
    );
  }

  /**
   * Get the list of cracked hashes from the last seven days.
   */
  private getCracks(): void {
    const timestampInPast = unixTimestampInPast(7);
    const params = new RequestParamBuilder()
      .addFilter({
        field: 'timeCracked',
        operator: FilterType.GREATER,
        value: timestampInPast
      })
      .create();

    this.subscriptions.push(
      this.gs.getAll(SERV.HASHES_COUNT, params).subscribe((response: ResponseWrapper) => {
        this.totalCracks = response.meta.count;
        this.updateChart();
      })
    );
  }
}
