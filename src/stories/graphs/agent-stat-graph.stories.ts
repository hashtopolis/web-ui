import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { AgentStatGraphComponent } from '@src/app/shared/graphs/echarts/agent-stat-graph/agent-stat-graph.component';

import { ASC } from '@src/app/core/_constants/agentsc.config';

import {
  CPU_UTIL_OVER_DAY,
  EMPTY,
  MULTI_DEVICE_GPU_UTIL,
  SINGLE_DEVICE_GPU_TEMP
} from '../_fixtures/agent-stat.fixtures';

const meta: Meta<AgentStatGraphComponent> = {
  title: 'Graphs/AgentStatGraph',
  component: AgentStatGraphComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [AgentStatGraphComponent] })],
  render: (args) => ({
    props: args,
    template: `<div style="width: 800px; height: 360px;">
      <app-agent-stat-graph [agentStats]="agentStats" [statType]="statType"></app-agent-stat-graph>
    </div>`
  })
};
export default meta;

type Story = StoryObj<AgentStatGraphComponent>;

export const GpuTempEmpty: Story = { args: { agentStats: EMPTY, statType: ASC.GPU_TEMP } };
export const GpuTempSingleDevice: Story = {
  args: { agentStats: SINGLE_DEVICE_GPU_TEMP, statType: ASC.GPU_TEMP }
};
export const GpuUtilMultiDevice: Story = {
  args: { agentStats: MULTI_DEVICE_GPU_UTIL, statType: ASC.GPU_UTIL }
};
export const CpuUtilOverHalfDay: Story = {
  args: { agentStats: CPU_UTIL_OVER_DAY, statType: ASC.CPU_UTIL }
};
