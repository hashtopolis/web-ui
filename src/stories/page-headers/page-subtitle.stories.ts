import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/angular';

import { PageSubTitleComponent } from '@src/app/shared/page-headers/page-subtitle/page-subtitle.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<PageSubTitleComponent> = {
  title: 'PageHeaders/PageSubtitle',
  component: PageSubTitleComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { subtitle: 'Workers connected to this Hashtopolis server', actionTitle: '', actionIcon: '' },
  render: (args) => ({
    props: { ...args, actionClicked: action('actionClicked') },
    template: `<div style="min-width: 720px;">
      <app-page-subtitle
        [subtitle]="subtitle"
        [actionTitle]="actionTitle"
        [actionIcon]="actionIcon"
        (actionClicked)="actionClicked()"
      ></app-page-subtitle>
    </div>`
  })
};
export default meta;

type Story = StoryObj<PageSubTitleComponent>;

export const Default: Story = {};
export const WithAction: Story = {
  args: { actionTitle: 'New', actionIcon: 'add' }
};
