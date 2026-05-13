import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { TaskSpeedGraphComponent } from '@src/app/shared/graphs/echarts/task-speed-graph/task-speed-graph.component';

import {
  EMPTY,
  HIGH_RATE_GHZ,
  LONG_RUN_WITH_ZOOM,
  SHORT_RUN,
  SINGLE_POINT
} from '../_fixtures/task-speed.fixtures';

const meta: Meta<TaskSpeedGraphComponent> = {
  title: 'Graphs/TaskSpeedGraph',
  component: TaskSpeedGraphComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [TaskSpeedGraphComponent] })],
  render: (args) => ({
    props: args,
    template: `<div style="width: 800px;"><app-task-speed-graph [speeds]="speeds"></app-task-speed-graph></div>`
  })
};
export default meta;

type Story = StoryObj<TaskSpeedGraphComponent>;

export const Empty: Story = { args: { speeds: EMPTY } };
export const SinglePoint: Story = { args: { speeds: SINGLE_POINT } };
export const ShortRun: Story = { args: { speeds: SHORT_RUN } };
export const LongRunWithZoom: Story = { args: { speeds: LONG_RUN_WITH_ZOOM } };
export const HighRateGHz: Story = { args: { speeds: HIGH_RATE_GHZ } };
