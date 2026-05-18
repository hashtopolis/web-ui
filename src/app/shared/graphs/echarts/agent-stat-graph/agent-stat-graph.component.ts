import { EChartsCoreOption } from 'echarts/core';
import { type EChartsType, init } from 'echarts/core';

import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';

import { JAgentStat } from '@models/agent-stats.model';

import { ASC } from '@src/app/core/_constants/agentsc.config';

/**
 * Displays agent stats (GPU temp/util or CPU util) in a continuous ECharts line graph.
 * Each device’s data is shown as a separate line over time.
 */
@Component({
  selector: 'app-agent-stat-graph',
  templateUrl: './agent-stat-graph.component.html'
})
export class AgentStatGraphComponent implements OnChanges, OnDestroy {
  /**
   * List of agent statistics to visualize.
   */
  @Input() agentStats: JAgentStat[] = [];

  /**
   * The stat type to filter and render (e.g., ASC.GPU_TEMP, ASC.CPU_UTIL).
   */
  @Input() statType: number;

  /**
   * DOM element used as the chart container.
   */
  @ViewChild('chartContainer', { static: true }) chartContainer: ElementRef;

  private chartInstance: EChartsType | null = null;
  hasData: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['agentStats'] || changes['statType']) {
      this.hasData = this.agentStats.some((s) => s.statType === this.statType);
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.chartInstance?.dispose();
  }

  /**
   * Initializes or updates the ECharts chart.
   */
  private renderChart(): void {
    if (!this.agentStats?.length || !this.chartContainer) return;

    if (!this.chartInstance) {
      this.chartInstance = init(this.chartContainer.nativeElement);
    }

    const option = this.buildOption(this.agentStats, this.statType);
    this.chartInstance.setOption(option);
  }

  /**
   * Builds chart options using filtered agent statistics.
   */
  private buildOption(agentStats: JAgentStat[], statType: number): EChartsCoreOption {
    const filteredStats = agentStats.filter((s) => s.statType === statType);

    // Configure chart title based on stat type
    const titleText =
      {
        [ASC.GPU_TEMP]: 'GPU Temperature',
        [ASC.GPU_UTIL]: 'GPU Utilization',
        [ASC.CPU_UTIL]: 'CPU Utilization'
      }[statType] ?? 'Agent Stat';

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
        showSymbol: false,
        smooth: false,
        connectNulls: true,
        markLine: {
          data: [{ type: 'average', name: 'Avg' }],
          symbol: ['none', 'none']
        }
      });

      legends.push(`Device ${device}`);
    }

    return {
      title: { text: titleText },
      tooltip: { trigger: 'axis' },
      legend: { data: legends },
      toolbox: {
        feature: {
          dataZoom: { yAxisIndex: 'none' },
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
        type: 'value' // Label format removed (you requested no extra unit)
      },
      dataZoom: [
        { type: 'slider', xAxisIndex: 0 },
        { type: 'inside', xAxisIndex: 0 }
      ],
      series: seriesData
    };
  }
}
