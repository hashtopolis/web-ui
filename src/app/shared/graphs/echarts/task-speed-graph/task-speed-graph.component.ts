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

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import { HashRatePipe } from '@src/app/core/_pipes/hashrate-pipe';

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
  template: `<div #chart style="height: 310px;"></div>`,
  providers: [HashRatePipe]
})
export class TaskSpeedGraphComponent implements AfterViewInit, OnChanges {
  @Input() speeds: any[] = [];

  @ViewChild('chart', { static: true }) chartRef!: ElementRef;

  private chart: EChartsType;

  constructor(private hashratePipe: HashRatePipe) {}

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

    const result = [];
    const reducer = this.speeds.reduce((res, value) => {
      if (!res[value.time]) {
        res[value.time] = { time: value.time, speed: 0 };
        result.push(res[value.time]);
      }
      res[value.time].speed += value.speed;
      return res;
    }, {});

    const arr = [];
    const timestamps = [];

    for (const item of result) {
      const iso = this.transDate(item.time);
      const transformed = this.hashratePipe.transform(item.speed, 2, true) as {
        value: number;
        unit: string;
      };

      if (!transformed) continue;

      arr.push({
        name: iso,
        value: [iso, transformed.value],
        unit: transformed.unit
      });

      timestamps.push(item.time);
    }

    if (!arr.length) {
      this.chart.clear();
      return;
    }

    const speedsOnly = arr.map((item) => item.value[1]);
    const maxSpeed = Math.max(...speedsOnly);
    const minSpeed = Math.min(...speedsOnly);
    const maxIndex = speedsOnly.indexOf(maxSpeed);
    const minIndex = speedsOnly.indexOf(minSpeed);

    const displayUnit = arr[maxIndex]?.unit || 'H/s';
    const startdate = timestamps[0];
    const enddate = timestamps[timestamps.length - 1];
    const datelabel = this.transDate(enddate);

    const xAxis = this.generateIntervalsOf(1, +startdate, +enddate);
    const xAxisData = xAxis.map((ts) => this.transDate(ts));

    const option: EChartsOption = {
      title: {
        subtext: 'Last record: ' + datelabel
      },
      tooltip: {
        position: 'top',
        formatter: (params) => {
          if (params.componentType === 'markPoint') {
            return `${params.name}: <strong>${params.data.value}</strong>`;
          }
          const data = params.data;
          if (data?.value?.[1]) {
            return `${params.name}: <strong>${data.value[1]} ${data.unit ?? ''}</strong>`;
          }
          return '';
        }
      },
      grid: {
        left: '5%',
        right: '4%'
      },
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        name: displayUnit,
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
        { type: 'slider', xAxisIndex: 0, start: 0, end: 100 },
        { type: 'inside', xAxisIndex: 0, start: 0, end: 100 }
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
              value: `${arr[maxIndex]?.value?.[1]} ${arr[maxIndex]?.unit}`
            },
            {
              name: 'Min',
              coord: arr[minIndex]?.value ?? [],
              value: `${arr[minIndex]?.value?.[1]} ${arr[minIndex]?.unit}`
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
   * Generates an array of timestamps from `start` to `end` with a fixed `interval`.
   */
  private generateIntervalsOf(interval: number, start: number, end: number): number[] {
    const result = [];
    let current = start;
    while (current < end) {
      result.push(current);
      current += interval;
    }
    return result;
  }
}
