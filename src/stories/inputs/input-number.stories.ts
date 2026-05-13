import type { Meta, StoryObj } from '@storybook/angular';

import { InputNumberComponent } from '@src/app/shared/input/number/number.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<InputNumberComponent> = {
  title: 'Inputs/InputNumber',
  component: InputNumberComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { title: 'Concurrent tasks', disabled: false, isRequired: false },
  render: (args) => ({
    props: args,
    template: `<div style="width: 280px;">
      <input-number
        [title]="title"
        [disabled]="disabled"
        [isRequired]="isRequired"
        [error]="error"
        [hint]="hint"
      ></input-number>
    </div>`
  })
};
export default meta;

type Story = StoryObj<InputNumberComponent>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const ErrorState: Story = { args: { error: 'Must be a positive integer' } };
