import type { Meta, StoryObj } from '@storybook/angular';

import { PassMatchComponent } from '@src/app/shared/password/pass-match/pass-match.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<PassMatchComponent> = {
  title: 'Password/PasswordMatch',
  component: PassMatchComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { newPassword: '', confirmPassword: '' },
  render: (args) => ({
    props: args,
    template: `<div style="width: 320px;">
      <app-pass-match
        [newPassword]="newPassword"
        [confirmPassword]="confirmPassword"
      ></app-pass-match>
    </div>`
  })
};
export default meta;

type Story = StoryObj<PassMatchComponent>;

export const BothEmpty: Story = {};
export const Matching: Story = { args: { newPassword: 'hunter2', confirmPassword: 'hunter2' } };
export const NotMatching: Story = {
  args: { newPassword: 'hunter2', confirmPassword: 'hunter22' }
};
