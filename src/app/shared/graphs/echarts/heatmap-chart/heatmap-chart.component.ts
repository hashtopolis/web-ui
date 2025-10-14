// heatmap-chart.component.ts

import { EChartsType, init, time } from 'echarts/core';

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
    if (this.chart && (changes['data'] || changes['isDarkMode'])) {
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

    const option = {
      darkMode: this.isDarkMode,
      tooltip: {
        position: 'top',
        formatter: (p: any) => {
          const formattedDate = time.format(p.data[0], '{dd}-{MM}-{yyyy}', false);
          return `${formattedDate}: ${p.data[1]}`;
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(...this.data.map((d) => d[1]), 10),
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
            formatter: (params: any) => {
              const todayStr = new Date().toISOString().slice(0, 10);
              return params.data[0] === todayStr ? 'X' : '';
            }
          }
        }
      ]
    };

    this.chart.setOption(option);
  }
}
