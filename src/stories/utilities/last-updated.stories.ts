import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { LastUpdatedComponent } from '@src/app/shared/widgets/last-updated/last-updated.component';

const minutesAgo = (n: number) => new Date(Date.now() - n * 60_000);
const hoursAgo = (n: number) => new Date(Date.now() - n * 3_600_000);
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

const meta: Meta<LastUpdatedComponent> = {
  title: 'Utilities/LastUpdated',
  component: LastUpdatedComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [LastUpdatedComponent] })],
  render: (args) => ({
    props: args,
    template: `<last-updated
      [lastUpdated]="lastUpdated"
      [nextRefreshTimestamp]="nextRefreshTimestamp"
      [refreshing]="refreshing"
    ></last-updated>`
  })
};
export default meta;

type Story = StoryObj<LastUpdatedComponent>;

export const JustNow: Story = { args: { lastUpdated: minutesAgo(0), refreshing: false } };
export const OneMinuteAgo: Story = { args: { lastUpdated: minutesAgo(1) } };
export const OneHourAgo: Story = { args: { lastUpdated: hoursAgo(1) } };
export const OneDayAgo: Story = { args: { lastUpdated: daysAgo(1) } };
export const Refreshing: Story = {
  args: { lastUpdated: minutesAgo(2), refreshing: true }
};
export const WithCountdown: Story = {
  args: {
    lastUpdated: minutesAgo(1),
    nextRefreshTimestamp: Date.now() + 30_000
  }
};
