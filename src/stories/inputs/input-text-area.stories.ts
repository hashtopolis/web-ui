import type { Meta, StoryObj } from '@storybook/angular';

import { InputTextAreaComponent } from '@src/app/shared/input/text-area/text-area.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<InputTextAreaComponent> = {
  title: 'Inputs/InputTextArea',
  component: InputTextAreaComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { title: 'Notes', disabled: false, isRequired: false },
  render: (args) => ({
    props: args,
    template: `<div style="width: 480px;">
      <input-text-area
        [title]="title"
        [disabled]="disabled"
        [isRequired]="isRequired"
        [error]="error"
        [hint]="hint"
      ></input-text-area>
    </div>`
  })
};
export default meta;

type Story = StoryObj<InputTextAreaComponent>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const ErrorState: Story = { args: { error: 'Required field', isRequired: true } };
