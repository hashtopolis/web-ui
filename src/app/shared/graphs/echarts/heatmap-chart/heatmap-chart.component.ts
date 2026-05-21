// heatmap-chart.component.ts

import { EChartsType, init, time } from 'echarts/core';
import type { CallbackDataParams } from 'echarts/types/dist/shared';

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-heatmap-chart',
  template: `<div #chartContainer style="height: 300px; width: 100%;"></div>`
})
export class HeatmapChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() data: [string, number][] = [];
  @Input() isDarkMode = false;

  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  private chart: EChartsType | undefined;

  ngAfterViewInit() {
    if (this.chartContainer?.nativeElement) {
      this.initChart();
      if (this.data.length) {
        this.setOption();
      }
    } else {
      console.warn('Chart container not available in ngAfterViewInit');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.chart) {
      return;
    }

    if (changes['isDarkMode'] && !changes['isDarkMode'].firstChange) {
      this.chart.dispose();
      this.initChart();
    }

    if (changes['data'] || changes['isDarkMode']) {
      this.setOption();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  private initChart() {
    if (!this.chartContainer || !this.chartContainer.nativeElement) {
      console.error('Chart container DOM element is missing');
      return;
    }
    this.chart = init(this.chartContainer.nativeElement, this.isDarkMode ? 'dark' : undefined);
  }

  private setOption() {
    if (!this.chart) return;

    const currentYear = new Date().getFullYear();
    const todayStr = new Date().toISOString().slice(0, 10);
    const max = Math.max(...this.data.map((d) => d[1]), 10);
    const rawStep = max / 5;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const normalized = rawStep / magnitude;
    const niceStep = normalized <= 2 ? 2 * magnitude : normalized <= 5 ? 5 * magnitude : 10 * magnitude;
    const step = Math.max(2, niceStep);
    const pieces = [
      { gte: 1, lte: step },
      { gt: step, lte: step * 2 },
      { gt: step * 2, lte: step * 3 },
      { gt: step * 3, lte: step * 4 },
      { gt: step * 4 }
    ];

    const option = {
      darkMode: this.isDarkMode,
      tooltip: {
        position: 'top',
        formatter: (params: CallbackDataParams) => {
          const data = params.data as [string, number];
          const formattedDate = time.format(data[0], '{dd}-{MM}-{yyyy}', false);
          return `${formattedDate}: ${data[1]}`;
        }
      },
      visualMap: {
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 65,
        pieces,
        outOfRange: { color: 'transparent' }
      },
      calendar: {
        top: 120,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: currentYear,
        splitLine: this.isDarkMode ? { lineStyle: { color: '#FFFFFF' } } : {},
        itemStyle: { borderWidth: 0.5 },
        yearLabel: { show: false }
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: this.data,
          label: {
            show: true,
            color: this.isDarkMode ? '#ffffff' : '#333333',
            formatter: (params: CallbackDataParams) => {
              const data = params.data as [string, number];
              return data[0] === todayStr ? 'X' : '';
            }
          }
        }
      ]
    };

    const currentOption = this.chart.getOption() as Record<string, unknown[]>;
    const currentVisualMap = currentOption?.['visualMap']?.[0] as Record<string, unknown> | undefined;
    if (currentVisualMap?.['selected']) {
      (option.visualMap as Record<string, unknown>)['selected'] = currentVisualMap['selected'];
    }

    this.chart.setOption(option);
  }
}
