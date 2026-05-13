import type { Meta, StoryObj } from '@storybook/angular';

import { PageComponent } from '@src/app/shared/page-headers/page/page.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<PageComponent> = {
  title: 'PageHeaders/Page',
  component: PageComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { title: 'Agents', subtitle: '', actionTitle: '', actionLink: '', showAction: false },
  render: (args) => ({
    props: args,
    template: `<div style="min-width: 720px;">
      <app-page
        [title]="title"
        [subtitle]="subtitle"
        [actionTitle]="actionTitle"
        [actionLink]="actionLink"
        [showAction]="showAction"
      ></app-page>
    </div>`
  })
};
export default meta;

type Story = StoryObj<PageComponent>;

export const Default: Story = { args: { title: 'Agents' } };
export const WithSubtitle: Story = {
  args: { title: 'Agents', subtitle: 'Workers connected to this Hashtopolis server' }
};
export const WithActionButton: Story = {
  args: {
    title: 'Tasks',
    subtitle: 'Running and scheduled cracking jobs',
    actionTitle: 'New task',
    actionLink: '/tasks/new',
    showAction: true
  }
};
