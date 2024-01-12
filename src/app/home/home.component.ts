import {
  CalendarComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent
} from 'echarts/components';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CanvasRenderer } from 'echarts/renderers';
import { HeatmapChart } from 'echarts/charts';
import * as echarts from 'echarts/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { GlobalService } from 'src/app/core/_services/main.service';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { SERV } from '../core/_services/main.config';
import { LocalStorageService } from '../core/_services/storage/local-storage.service';
import { UIConfig } from '../core/_models/config-ui.model';
import { UISettingsUtilityClass } from '../shared/utils/config';
import { Subscription } from 'rxjs';
import { ListResponseWrapper } from '../core/_models/response.model';
import { Agent } from '../core/_models/agent.model';
import { Task } from '../core/_models/task.model';
import { SuperTask } from '../core/_models/supertask.model';
import { Hash } from '../core/_models/hash.model';
import {
  formatDate,
  formatUnixTimestamp,
  unixTimestampInPast
} from '../shared/utils/datetime';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
@PageTitle(['Dashboard'])
export class HomeComponent implements OnInit, OnDestroy {
  util: UISettingsUtilityClass;

  /** Flags for responsive design */
  screenXS = false;
  screenS = false;
  screenM = false;
  screenL = false;
  screenXL = false;

  /** DarkMode */
  protected uiSettings: UISettingsUtilityClass;
  isDarkMode = false;

  /** Counters for dashboard statistics */
  activeAgents = 0;
  totalAgents = 0;
  totalTasks = 0;
  totalCracks = 0;
  totalSupertasks = 0;

  lastUpdated: string;

  private maxResults = environment.config.prodApiMaxResults;
  private subscriptions: Subscription[] = [];
  private pageReloadTimeout: NodeJS.Timeout;
  private crackedChart: echarts.ECharts;

  constructor(
    private gs: GlobalService,
    private service: LocalStorageService<UIConfig>,
    private snackBar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    this.uiSettings = new UISettingsUtilityClass(this.service);
    this.isDarkMode = this.uiSettings.getSetting('theme') === 'dark';
    // Observe screen breakpoints for responsive design
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge
      ])
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

  ngOnInit(): void {
    this.util = new UISettingsUtilityClass(this.service);
    this.initChart();
    this.initData();
    this.onAutorefresh();
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
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
      this.snackBar.open(message, 'Close');
    }
    this.initData();
    this.onAutorefresh();
  }

  /**
   * Initialize dashboard data.
   */
  initData(): void {
    this.getAgents();
    this.getTasks();
    this.getSuperTasks();
    this.getCracks();
  }

  /**
   * Get the list of active agents.
   */
  private getAgents(): void {
    const params = { maxResults: this.maxResults, filter: 'isActive=true' };
    this.subscriptions.push(
      this.gs
        .getAll(SERV.AGENTS, params)
        .subscribe((response: ListResponseWrapper<Agent>) => {
          this.totalAgents = response.total | 0;
          this.activeAgents = response.values.length | 0;
        })
    );
  }

  /**
   * Get the list of tasks.
   */
  private getTasks(): void {
    const params = { maxResults: this.maxResults, filter: 'isArchived=false' };

    this.subscriptions.push(
      this.gs
        .getAll(SERV.TASKS, params)
        .subscribe((response: ListResponseWrapper<Task>) => {
          this.totalTasks = response.values.length | 0;
        })
    );
  }

  /**
   * Get the list of supertasks.
   */
  private getSuperTasks(): void {
    const params = { maxResults: this.maxResults };

    this.subscriptions.push(
      this.gs
        .getAll(SERV.SUPER_TASKS, params)
        .subscribe((response: ListResponseWrapper<SuperTask>) => {
          this.totalSupertasks = response.total | 0;
        })
    );
  }

  /**
   * Get the list of cracked hashes from the last seven days.
   */
  private getCracks(): void {
    const timestampInPast = unixTimestampInPast(7);
    const params = {
      maxResults: this.maxResults,
      filter: 'isCracked=true'
    };

    this.subscriptions.push(
      this.gs
        .getAll(SERV.HASHES, params)
        .subscribe((response: ListResponseWrapper<Hash>) => {
          const lastsevenObject = response.values.filter(
            (u) => u.isCracked == true && u.timeCracked > timestampInPast
          );
          this.totalCracks = lastsevenObject.length | 0;
          this.updateChart(response.values);
        })
    );
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
   *
   * @param data - Hash data used for the chart.
   */
  updateChart(data: Hash[]): void {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // Extract and format cracked dates
    const formattedDates: string[] = data.map((item) =>
      formatUnixTimestamp(item.timeCracked, 'yyyy-MM-dd')
    );

    // Count occurrences of each date
    const dateCounts: { [key: string]: number } =
      this.countOccurrences(formattedDates);

    // Convert date counts to the required format
    const countsExtended = Object.keys(dateCounts).map((date) => [
      date,
      dateCounts[date]
    ]);

    // DarkMode
    const backgroundColor = this.isDarkMode ? '#212121' : '';

    const option = {
      darkMode: true,
      title: {},
      tooltip: {
        position: 'top',
        formatter: function (p) {
          const format = echarts.time.format(
            p.data[0],
            '{dd}-{MM}-{yyyy}',
            false
          );
          return format + ': ' + p.data[1];
        }
      },
      backgroundColor: backgroundColor,
      visualMap: {
        min: 0,
        max: 300,
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
  }
}
