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

const BUCKET_ALPHAS = [0.18, 0.32, 0.55, 0.78, 0.95];

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

  /**
   * Resolve --primary from the document root and return rgba strings at the
   * legend's bucket alphas. Canvas can't parse color-mix(), so we expand the
   * design token into plain rgba here. Falls back to the hard-coded token
   * value when the variable is unresolved (jsdom / pre-bootstrap).
   */
  private bucketColors(): string[] {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    const hex = /^#([0-9a-f]{6})$/i.test(raw) ? raw : this.isDarkMode ? '#ffffff' : '#18181b';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return BUCKET_ALPHAS.map((a) => `rgba(${r}, ${g}, ${b}, ${a})`);
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
    const colors = this.bucketColors();
    const pieces = [
      { gte: 1, lte: step, color: colors[0] },
      { gt: step, lte: step * 2, color: colors[1] },
      { gt: step * 2, lte: step * 3, color: colors[2] },
      { gt: step * 3, lte: step * 4, color: colors[3] },
      { gt: step * 4, color: colors[4] }
    ];

    const subtleForeground =
      getComputedStyle(document.documentElement).getPropertyValue('--subtle-foreground').trim() ||
      (this.isDarkMode ? 'rgba(255, 255, 255, 0.55)' : '#a1a1aa');

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
        splitLine: { lineStyle: { color: subtleForeground } },
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
