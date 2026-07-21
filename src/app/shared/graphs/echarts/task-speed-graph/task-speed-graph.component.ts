import { LineChart, LineSeriesOption } from 'echarts/charts';
import {
  DataZoomComponent,
  DataZoomComponentOption,
  GridComponent,
  GridComponentOption,
  MarkLineComponent,
  MarkLineComponentOption,
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption
} from 'echarts/components';
import { ComposeOption, EChartsType, init } from 'echarts/core';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import type { TopLevelFormatterParams } from 'echarts/types/dist/shared';

import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { AgentId } from '@models/id.types';

import { SpeedStat } from '@src/app/core/_models/speed-stat.model';
import { getHashRateFormatComponents } from '@src/app/core/_pipes/hashrate-pipe';

/**
 * Group speeds into bucket (previously exact timestamp was used) so that we sum up the speed reports of parallel agents. 
 */
const BUCKET_SECONDS = 10;

/**
 * If an agent has not given a report within this time it is not counted to the current bucket.
 * Deliberately larger than the sampling interval: err towards keeping an active
 * agent rather than dropping it.
 */
const ACTIVE_WINDOW_SECONDS = 60;

/**
 * How much of the most recent history the chart shows by default. The full range
 * (roughly the last hour) stays reachable via the zoom slider and mouse wheel.
 */
const DEFAULT_WINDOW_SECONDS = 30 * 60;

// Compose ECharts option type
type EChartsOption = ComposeOption<
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DataZoomComponentOption
  | MarkLineComponentOption
  | LineSeriesOption
>;

use([
  LineChart,
  CanvasRenderer,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent
]);

@Component({
  selector: 'app-task-speed-graph',
  template: `<div #chart style="height: 310px;"></div>`
})
export class TaskSpeedGraphComponent implements AfterViewInit, OnChanges {
  @Input() speeds: SpeedStat[] = [];

  @ViewChild('chart', { static: true }) chartRef!: ElementRef;

  private chart: EChartsType;

  /**
   * Initializes the chart after view is ready.
   */
  ngAfterViewInit(): void {
    if (this.speeds?.length) {
      this.drawChart();
    }
  }

  /**
   * Redraw chart on input changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['speeds'] && !changes['speeds'].firstChange) {
      this.drawChart();
    }
  }

  /**
   * Renders the line chart from speed data.
   */
  private drawChart(): void {
    if (!this.chart) {
      this.chart = init(this.chartRef.nativeElement);
    }

    if (!this.speeds || !this.speeds.length) {
      this.chart.clear();
      return;
    }

    const result = this.aggregateTotalSpeeds();

    if (!result.length) {
      this.chart.clear();
      return;
    }

    const maxRawSpeed = Math.max(...result.map((item) => item.speed));
    const { unit, scale } = getHashRateFormatComponents(maxRawSpeed);

    const arr = result.map((item) => ({
      name: this.transDate(item.time),
      value: [item.time * 1000, +(item.speed / scale).toFixed(2)] as [number, number],
      unit
    }));

    const speedsOnly = arr.map((item) => item.value[1]);
    const maxIndex = speedsOnly.indexOf(Math.max(...speedsOnly));
    const minIndex = speedsOnly.indexOf(Math.min(...speedsOnly));

    const startdate = result[0].time;
    const enddate = result[result.length - 1].time;
    const lastRecord = this.speeds.reduce((latest, stat) => Math.max(latest, stat.time), enddate);
    const windowStart = Math.max(startdate, enddate - DEFAULT_WINDOW_SECONDS);

    const option: EChartsOption = {
      title: {
        subtext: 'Last record: ' + this.transDate(lastRecord)
      },
      tooltip: {
        trigger: 'axis',
        position: 'top',
        formatter: (params: TopLevelFormatterParams) => {
          const point = Array.isArray(params) ? params[0] : params;
          const data = point?.data as { value: [number, number]; unit: string } | undefined;
          if (!Array.isArray(data?.value)) return '';
          return `${this.transDate(data.value[0] / 1000)}: <strong>${data.value[1]} ${data.unit}</strong>`;
        }
      },
      grid: {
        left: '5%',
        right: '4%'
      },
      xAxis: {
        type: 'time',
        min: startdate * 1000,
        max: enddate * 1000,
        axisLabel: {
          formatter: (value: number) => this.transTime(value)
        }
      },
      yAxis: {
        type: 'value',
        name: unit,
        position: 'left',
        alignTicks: true
      },
      useUTC: true,
      toolbox: {
        show: true,
        right: 20,
        top: 10,
        itemGap: 10,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
            title: {
              zoom: 'Zoom in',
              back: 'Zoom reset'
            }
          },
          restore: {},
          saveAsImage: { name: 'Task Speed' }
        }
      },
      dataZoom: [
        { type: 'slider', xAxisIndex: 0, startValue: windowStart * 1000, endValue: enddate * 1000 },
        { type: 'inside', xAxisIndex: 0, startValue: windowStart * 1000, endValue: enddate * 1000 }
      ],
      series: {
        name: '',
        type: 'line',
        data: arr,
        connectNulls: true,
        markPoint: {
          data: [
            {
              name: 'Max',
              coord: arr[maxIndex]?.value ?? [],
              value: `${arr[maxIndex]?.value?.[1]} ${unit}`
            },
            {
              name: 'Min',
              coord: arr[minIndex]?.value ?? [],
              value: `${arr[minIndex]?.value?.[1]} ${unit}`
            }
          ]
        },
        markLine: {
          lineStyle: { color: '#333' }
        }
      }
    };

    this.chart.setOption(option);
  }

  /**
   * Aggregates the per-agent speed samples into a single total-throughput series.
   *
   * Speeds are grouped into buckets. Sweeping the bucket
   * grid, each agent contributes its most recent speed for as long as it keeps
   * reporting (within ACTIVE_WINDOW_SECONDS), so a bucket the agent
   * happens to skip carries its previous value instead of dropping to a false
   * dip, while an agent that stops reporting falls out of the total once its last
   * sample ages past the window. Returns points sorted ascending by time, where
   * `time` is the bucket start in UNIX seconds.
   */
  private aggregateTotalSpeeds(): { time: number; speed: number }[] {
    const sorted = [...this.speeds].sort((a, b) => a.time - b.time);
    if (!sorted.length) {
      return [];
    }

    const bucketOf = (time: number): number => Math.floor(time / BUCKET_SECONDS) * BUCKET_SECONDS;

    // Latest speed each agent reported within each bucket.
    const perAgent = new Map<AgentId, Map<number, number>>();
    for (const { time, agentId, speed } of sorted) {
      let byBucket = perAgent.get(agentId);
      if (!byBucket) {
        byBucket = new Map<number, number>();
        perAgent.set(agentId, byBucket);
      }
      byBucket.set(bucketOf(time), speed);
    }

    const firstBucket = bucketOf(sorted[0].time);
    const lastBucket = bucketOf(sorted[sorted.length - 1].time);

    const lastValue = new Map<AgentId, number>();
    const lastSeen = new Map<AgentId, number>();
    const result: { time: number; speed: number }[] = [];

    for (let bucket = firstBucket; bucket <= lastBucket; bucket += BUCKET_SECONDS) {
      let speed = 0;
      let active = false;
      for (const [agentId, byBucket] of perAgent) {
        const reported = byBucket.get(bucket);
        if (reported !== undefined) {
          lastValue.set(agentId, reported);
          lastSeen.set(agentId, bucket);
        }
        const seen = lastSeen.get(agentId);
        if (seen !== undefined && bucket - seen <= ACTIVE_WINDOW_SECONDS) {
          speed += lastValue.get(agentId) as number;
          active = true;
        }
      }
      if (active) {
        result.push({ time: bucket, speed });
      }
    }

    return result;
  }

  /**
   * Returns a date string with leading zeros for formatting.
   */
  private leadingZeros(dt: number): string {
    return dt < 10 ? '0' + dt : dt.toString();
  }

  /**
   * Converts a UNIX timestamp to formatted date string (UTC).
   */
  private transDate(dt: number): string {
    const date = new Date(dt * 1000);
    return (
      date.getUTCDate() +
      '-' +
      this.leadingZeros(date.getUTCMonth() + 1) +
      '-' +
      date.getUTCFullYear() +
      ',' +
      this.leadingZeros(date.getUTCHours()) +
      ':' +
      this.leadingZeros(date.getUTCMinutes()) +
      ':' +
      this.leadingZeros(date.getUTCSeconds())
    );
  }

  /**
   * Converts a millisecond timestamp to a compact UTC time label (HH:MM:SS) for axis ticks.
   */
  private transTime(ms: number): string {
    const date = new Date(ms);
    return (
      this.leadingZeros(date.getUTCHours()) +
      ':' +
      this.leadingZeros(date.getUTCMinutes()) +
      ':' +
      this.leadingZeros(date.getUTCSeconds())
    );
  }
}
