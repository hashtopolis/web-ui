import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { HeatmapChartComponent } from '@src/app/shared/graphs/echarts/heatmap-chart/heatmap-chart.component';

import { DENSE_FULL_YEAR, EMPTY, SHORT_12_WEEKS, SPARSE } from '../_fixtures/heatmap.fixtures';

const meta: Meta<HeatmapChartComponent> = {
  title: 'Graphs/HeatmapChart',
  component: HeatmapChartComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [HeatmapChartComponent] })],
  render: (args) => ({
    props: args,
    template: `<div style="width: 900px;">
      <app-heatmap-chart
        [data]="data"
        [showLegend]="showLegend"
        [weekCount]="weekCount"
      ></app-heatmap-chart>
    </div>`
  }),
  args: { showLegend: true, weekCount: 52 }
};
export default meta;

type Story = StoryObj<HeatmapChartComponent>;

export const Empty: Story = { args: { data: EMPTY } };
export const Sparse: Story = { args: { data: SPARSE } };
export const DenseFullYear: Story = { args: { data: DENSE_FULL_YEAR } };
export const ShortRange12Weeks: Story = { args: { data: SHORT_12_WEEKS, weekCount: 12 } };
export const WithoutLegend: Story = { args: { data: DENSE_FULL_YEAR, showLegend: false } };
