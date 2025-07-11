import { EChartsCoreOption } from 'echarts/core';
import { type EChartsType, init } from 'echarts/core';

import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';

import { JAgentStat } from '@models/agent-stats.model';

import { ASC } from '@src/app/core/_constants/agentsc.config';

/**
 * Component that renders agent statistics in an ECharts line graph.
 * Displays one line per device for a specific stat type (e.g. GPU temperature, utilization).
 */
@Component({
  selector: 'app-agent-stat-graph',
  template: `<div #chartContainer style="width: 100%; height: 300px;"></div>`
})
export class AgentStatGraphComponent implements OnChanges, OnDestroy {
  /**
   * List of agent statistics to be rendered in the graph.
   * These are filtered by `statType` before rendering.
   */
  @Input() agentStats: JAgentStat[] = [];

  /**
   * The statistic type to render. Should match one of the values in the ASC enum
   * (e.g. ASC.GPU_TEMP, ASC.GPU_UTIL, ASC.CPU_UTIL).
   */
  @Input() statType: number;

  /**
   * Reference to the DOM element where the chart will be rendered.
   */
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  /**
   * Holds the ECharts instance for rendering and updating the graph.
   */
  private chartInstance: EChartsType | null = null;

  /**
   * Lifecycle hook called when any data-bound property changes.
   * Re-renders the chart when `agentStats` or `statType` change.
   *
   * @param changes The changed input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['agentStats'] || changes['statType']) {
      this.renderChart();
    }
  }

  /**
   * Renders the chart using the current agentStats and statType.
   * Initializes the chart instance if not already created.
   */
  private renderChart() {
    if (!this.agentStats || !this.chartContainer) return;

    if (!this.chartInstance) {
      this.chartInstance = init(this.chartContainer.nativeElement);
    }

    const option = this.buildOption(this.agentStats, this.statType);
    this.chartInstance.setOption(option);
  }

  /**
   * Builds the ECharts configuration object for the given statistics and type.
   * Each device is rendered as a separate line with a legend and average mark line.
   *
   * @param agentStats - Full list of agent stats.
   * @param statType - Type of statistic to filter and render (e.g. GPU_TEMP).
   * @returns ECharts option object used to configure the chart.
   */
  private buildOption(agentStats: JAgentStat[], statType: number): EChartsCoreOption {
    const filteredStats = agentStats.filter((s) => s.statType === statType);

    let titleText = '';
    let yAxisLabel = '';

    switch (statType) {
      case ASC.GPU_TEMP:
        titleText = 'GPU Temperature';
        yAxisLabel = '°C';
        break;
      case ASC.GPU_UTIL:
        titleText = 'GPU Utilization';
        yAxisLabel = '%';
        break;
      case ASC.CPU_UTIL:
        titleText = 'CPU Utilization';
        yAxisLabel = '%';
        break;
    }

    const flattened = [];
    const timestamps: number[] = [];

    for (const stat of filteredStats) {
      timestamps.push(stat.time);
      for (let i = 0; i < stat.value.length; i++) {
        flattened.push({
          time: new Date(stat.time * 1000).toISOString(),
          value: stat.value[i],
          device: i
        });
      }
    }

    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);

    const deviceCount = Math.max(...flattened.map((f) => f.device)) + 1;

    const seriesData = [];
    const legends: string[] = [];

    for (let device = 0; device < deviceCount; device++) {
      const deviceData = flattened
        .filter((f) => f.device === device)
        .map((f) => ({
          name: `Device ${device}`,
          value: [f.time, f.value]
        }));

      seriesData.push({
        name: `Device ${device}`,
        type: 'line',
        data: deviceData,
        markLine: {
          data: [{ type: 'average', name: 'Avg' }],
          symbol: ['none', 'none']
        }
      });

      legends.push(`Device ${device}`);
    }

    return {
      title: {
        text: titleText
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: legends
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: true },
          restore: {},
          saveAsImage: { name: titleText }
        }
      },
      xAxis: {
        type: 'time',
        min: minTime * 1000,
        max: maxTime * 1000,
        axisLabel: {
          formatter: (value: number) =>
            new Date(value).toLocaleString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: `{value} ${yAxisLabel}`
        }
      },
      series: seriesData
    };
  }

  /**
   * Lifecycle hook called when the component is destroyed.
   * Disposes the chart instance to prevent memory leaks.
   */
  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }
}
