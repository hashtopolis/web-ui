import type { Meta, StoryObj } from '@storybook/angular';

import { InputSelectComponent } from '@src/app/shared/input/select/select.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const SHORT_ITEMS = [
  { id: 1, name: 'Quick' },
  { id: 2, name: 'Standard' },
  { id: 3, name: 'Exhaustive' }
];

const MANY_ITEMS = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: `Option ${i + 1}` }));

const meta: Meta<InputSelectComponent> = {
  title: 'Inputs/InputSelect',
  component: InputSelectComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: {
    title: 'Mode',
    items: SHORT_ITEMS,
    isLoading: false,
    disabled: false,
    isRequired: false,
    isBlankOptionDisabled: false
  },
  render: (args) => ({
    props: args,
    template: `<div style="width: 360px;">
      <input-select
        [title]="title"
        [items]="items"
        [isLoading]="isLoading"
        [disabled]="disabled"
        [isRequired]="isRequired"
        [error]="error"
        [hint]="hint"
        [blankOptionText]="blankOptionText"
        [isBlankOptionDisabled]="isBlankOptionDisabled"
      ></input-select>
    </div>`
  })
};
export default meta;

type Story = StoryObj<InputSelectComponent>;

export const Default: Story = {};
export const Loading: Story = { args: { isLoading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const ErrorState: Story = { args: { error: 'Select an option' } };
export const WithBlankOption: Story = {
  args: { blankOptionText: '— select —', isBlankOptionDisabled: false }
};
export const ManyItems: Story = { args: { items: MANY_ITEMS, title: 'Items' } };
