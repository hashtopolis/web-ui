import type { Meta, StoryObj } from '@storybook/angular';

import { InputCheckComponent } from '@src/app/shared/input/check/check.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<InputCheckComponent> = {
  title: 'Inputs/InputCheck',
  component: InputCheckComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { title: 'Accept terms', disabled: false, isRequired: false },
  render: (args) => ({
    props: args,
    template: `<div style="min-width: 280px;">
      <input-check
        [title]="title"
        [disabled]="disabled"
        [isRequired]="isRequired"
        [error]="error"
        [hint]="hint"
        [tooltip]="tooltip"
      ></input-check>
    </div>`
  })
};
export default meta;

type Story = StoryObj<InputCheckComponent>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const ErrorState: Story = { args: { error: 'You must accept the terms', isRequired: true } };
export const WithHint: Story = { args: { hint: 'You can revoke consent later in settings.' } };
