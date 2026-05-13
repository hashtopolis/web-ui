import type { Meta, StoryObj } from '@storybook/angular';

import { InputMultiSelectComponent } from '@src/app/shared/input/multiselect/multiselect.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const items = [
  { id: 1, name: 'MD5' },
  { id: 2, name: 'SHA-1' },
  { id: 3, name: 'SHA-256' },
  { id: 4, name: 'bcrypt' },
  { id: 5, name: 'NTLM' },
  { id: 6, name: 'scrypt' }
];

const meta: Meta<InputMultiSelectComponent> = {
  title: 'Inputs/InputMultiSelect',
  component: InputMultiSelectComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: {
    title: 'Hash types',
    label: 'Select hash types:',
    placeholder: 'Search or select…',
    items,
    isLoading: false,
    disabled: false,
    multiselectEnabled: true,
    mergeIdAndName: false
  },
  render: (args) => ({
    props: args,
    template: `<div style="width: 480px;">
      <input-multiselect
        [title]="title"
        [label]="label"
        [placeholder]="placeholder"
        [items]="items"
        [isLoading]="isLoading"
        [disabled]="disabled"
        [error]="error"
        [hint]="hint"
        [multiselectEnabled]="multiselectEnabled"
        [mergeIdAndName]="mergeIdAndName"
        [initialHashlistId]="initialHashlistId"
      ></input-multiselect>
    </div>`
  })
};
export default meta;

type Story = StoryObj<InputMultiSelectComponent>;

export const Default: Story = {};
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const ErrorState: Story = { args: { error: 'Choose at least one hash type' } };
export const SingleSelect: Story = { args: { multiselectEnabled: false } };
export const MergedIdAndName: Story = { args: { mergeIdAndName: true } };
