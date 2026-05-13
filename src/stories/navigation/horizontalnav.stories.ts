import type { Meta, StoryObj } from '@storybook/angular';

import { HorizontalNavComponent } from '@src/app/shared/navigation/horizontalnav.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<HorizontalNavComponent> = {
  title: 'Navigation/HorizontalNav',
  component: HorizontalNavComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  render: (args) => ({
    props: args,
    template: `<div style="min-width: 720px;">
      <horizontalnav [menuItems]="menuItems"></horizontalnav>
    </div>`
  })
};
export default meta;

type Story = StoryObj<HorizontalNavComponent>;

export const FewItems: Story = {
  args: {
    menuItems: [
      { label: 'Overview', routeName: 'overview' },
      { label: 'Details', routeName: 'details' },
      { label: 'Settings', routeName: 'settings' }
    ]
  }
};

export const ManyItems: Story = {
  args: {
    menuItems: [
      { label: 'Tasks', routeName: 'tasks' },
      { label: 'Agents', routeName: 'agents' },
      { label: 'Hashlists', routeName: 'hashlists' },
      { label: 'Files', routeName: 'files' },
      { label: 'Pretasks', routeName: 'pretasks' },
      { label: 'Crackers', routeName: 'crackers' },
      { label: 'Health', routeName: 'health' }
    ]
  }
};
