import type { Meta, StoryObj } from '@storybook/angular';

import { ButtonSubmitComponent, ButtonSubmitType } from '@src/app/shared/buttons/button-submit';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<ButtonSubmitComponent> = {
  title: 'Buttons/ButtonSubmit',
  component: ButtonSubmitComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { name: 'Save', disabled: false, loading: false, type: ButtonSubmitType.Submit },
  argTypes: {
    type: {
      control: 'select',
      options: Object.values(ButtonSubmitType)
    }
  },
  render: (args) => ({
    props: args,
    template: `<button-submit
      [name]="name"
      [disabled]="disabled"
      [loading]="loading"
      [type]="type"
    ></button-submit>`
  })
};
export default meta;

type Story = StoryObj<ButtonSubmitComponent>;

export const Submit: Story = { args: { type: ButtonSubmitType.Submit, name: 'Save' } };
export const Cancel: Story = { args: { type: ButtonSubmitType.Cancel, name: 'Cancel' } };
export const CancelDialog: Story = {
  args: { type: ButtonSubmitType.CancelDialog, name: 'Close' }
};
export const Delete: Story = { args: { type: ButtonSubmitType.Delete, name: 'Delete' } };
export const Loading: Story = {
  args: { type: ButtonSubmitType.Submit, name: 'Saving…', loading: true }
};
export const Disabled: Story = {
  args: { type: ButtonSubmitType.Submit, name: 'Save', disabled: true }
};
export const DeleteLoading: Story = {
  args: { type: ButtonSubmitType.Delete, name: 'Deleting…', loading: true }
};
