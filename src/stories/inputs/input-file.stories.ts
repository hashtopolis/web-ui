import type { Meta, StoryObj } from '@storybook/angular';

import { InputFileComponent } from '@src/app/shared/input/file/file.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<InputFileComponent> = {
  title: 'Inputs/InputFile',
  component: InputFileComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { title: 'Upload wordlist', disabled: false },
  render: (args) => ({
    props: args,
    template: `<div style="width: 360px;">
      <input-file
        [title]="title"
        [disabled]="disabled"
        [error]="error"
        [hint]="hint"
      ></input-file>
    </div>`
  })
};
export default meta;

type Story = StoryObj<InputFileComponent>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const ErrorState: Story = { args: { error: 'File must be under 100 MB' } };
