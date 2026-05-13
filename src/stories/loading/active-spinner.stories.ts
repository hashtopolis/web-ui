import type { Meta, StoryObj } from '@storybook/angular';

import { ActiveSpinnerComponent } from '@src/app/shared/loading-spinner/loading-spinner-active.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<ActiveSpinnerComponent> = {
  title: 'Loading/ActiveSpinner',
  component: ActiveSpinnerComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  render: () => ({ template: `<app-active-spinner></app-active-spinner>` })
};
export default meta;

type Story = StoryObj<ActiveSpinnerComponent>;

export const Default: Story = {};
