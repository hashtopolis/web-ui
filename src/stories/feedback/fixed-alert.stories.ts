import type { Meta, StoryObj } from '@storybook/angular';

import { FixedAlertComponent } from '@src/app/shared/alert/fixed-alert/fixed-alert.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<FixedAlertComponent> = {
  title: 'Feedback/FixedAlert',
  component: FixedAlertComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { message: 'Your session is about to expire.' },
  render: (args) => ({
    props: args,
    template: `<div style="min-width: 480px;">
      <fixed-alert [message]="message"></fixed-alert>
    </div>`
  })
};
export default meta;

type Story = StoryObj<FixedAlertComponent>;

export const Default: Story = {};
export const Empty: Story = { args: { message: '' } };
export const LongMessage: Story = {
  args: {
    message:
      'Heads up: your API key is missing the "agent.read" scope. The agent list will be empty until you regenerate the key with the required permissions.'
  }
};
