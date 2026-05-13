import type { Meta, StoryObj } from '@storybook/angular';

import { InputDateComponent } from '@src/app/shared/input/date/date.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<InputDateComponent> = {
  title: 'Inputs/InputDate',
  component: InputDateComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { title: 'Expires on', disabled: false, isRequired: false },
  render: (args) => ({
    props: args,
    template: `<div style="width: 320px;">
      <input-date
        [title]="title"
        [disabled]="disabled"
        [isRequired]="isRequired"
        [error]="error"
        [hint]="hint"
      ></input-date>
    </div>`
  })
};
export default meta;

type Story = StoryObj<InputDateComponent>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const ErrorState: Story = { args: { error: 'Date is required', isRequired: true } };
