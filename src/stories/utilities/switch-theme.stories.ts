import type { Meta, StoryObj } from '@storybook/angular';

import { SwitchThemeComponent } from '@src/app/shared/switch-theme/button/switch-theme.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<SwitchThemeComponent> = {
  title: 'Utilities/SwitchTheme',
  component: SwitchThemeComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  render: () => ({ template: `<app-switch-theme></app-switch-theme>` })
};
export default meta;

type Story = StoryObj<SwitchThemeComponent>;

export const Default: Story = {};
