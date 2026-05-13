import type { Meta, StoryObj } from '@storybook/angular';

import { LoadingSpinnerComponent } from '@src/app/shared/loading-spinner/loading-spinner.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<LoadingSpinnerComponent> = {
  title: 'Loading/LoadingSpinner',
  component: LoadingSpinnerComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  render: () => ({
    template: `<div style="display:flex; align-items:center; gap:12px;">
      <app-loading-spinner></app-loading-spinner>
      <span>Loading…</span>
    </div>`
  })
};
export default meta;

type Story = StoryObj<LoadingSpinnerComponent>;

export const Default: Story = {};
