import type { Meta, StoryObj } from '@storybook/angular';

import { InputTextComponent } from '@src/app/shared/input/text/text.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<InputTextComponent> = {
  title: 'Inputs/InputText',
  component: InputTextComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: {
    title: 'Name',
    inputType: 'text',
    disabled: false,
    isRequired: false,
    hint: ''
  },
  render: (args) => ({
    props: args,
    template: `<div style="width: 360px;">
      <input-text
        [title]="title"
        [inputType]="inputType"
        [icon]="icon"
        [disabled]="disabled"
        [isRequired]="isRequired"
        [error]="error"
        [hint]="hint"
        [tooltip]="tooltip"
        [minLength]="minLength"
        [maxLength]="maxLength"
        [showPasswordToggle]="showPasswordToggle"
        [passwordIsVisible]="passwordIsVisible"
      ></input-text>
    </div>`
  })
};
export default meta;

type Story = StoryObj<InputTextComponent>;

export const Default: Story = {};

export const WithIcon: Story = { args: { icon: 'search', title: 'Search' } };

export const Password: Story = {
  args: {
    title: 'Password',
    inputType: 'password',
    showPasswordToggle: true,
    passwordIsVisible: false
  }
};

export const Disabled: Story = { args: { disabled: true } };

export const ErrorState: Story = {
  args: { error: 'This field is required', isRequired: true }
};

export const WithHint: Story = {
  args: { hint: 'Use the same display name shown elsewhere in the app.' }
};

export const WithMaxLength: Story = {
  args: { maxLength: 32, hint: 'Up to 32 characters.' }
};
