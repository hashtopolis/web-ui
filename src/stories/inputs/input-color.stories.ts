import type { Meta, StoryObj } from '@storybook/angular';

import { InputColorComponent } from '@src/app/shared/input/color/color.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<InputColorComponent> = {
  title: 'Inputs/InputColor',
  component: InputColorComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { title: 'Accent color', disabled: false },
  render: (args) => ({
    props: args,
    template: `<div style="width: 280px;">
      <input-color
        [title]="title"
        [disabled]="disabled"
        [hint]="hint"
      ></input-color>
    </div>`
  })
};
export default meta;

type Story = StoryObj<InputColorComponent>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
