import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/angular';

import { FilterTextboxComponent } from '@src/app/shared/filter-textbox/filter-textbox.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<FilterTextboxComponent> = {
  title: 'Filters/FilterTextbox',
  component: FilterTextboxComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  render: () => ({
    props: { changed: action('changed') },
    template: `<div style="width: 360px;">
      <cm-filter-textbox (changed)="changed($event)"></cm-filter-textbox>
    </div>`
  })
};
export default meta;

type Story = StoryObj<FilterTextboxComponent>;

export const Default: Story = {};
