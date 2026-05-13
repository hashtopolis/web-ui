import type { Meta, StoryObj } from '@storybook/angular';

import { PassStrenghtComponent } from '@src/app/shared/password/pass-strenght/pass-strenght.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<PassStrenghtComponent> = {
  title: 'Password/PasswordStrength',
  component: PassStrenghtComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: { passwordToCheck: 'hello' },
  render: (args) => ({
    props: args,
    template: `<div style="width: 320px;">
      <app-pass-strenght [passwordToCheck]="passwordToCheck"></app-pass-strenght>
    </div>`
  })
};
export default meta;

type Story = StoryObj<PassStrenghtComponent>;

export const Empty: Story = { args: { passwordToCheck: '' } };
export const Weak: Story = { args: { passwordToCheck: 'hello' } };
export const Medium: Story = { args: { passwordToCheck: 'Hello123' } };
export const Strong: Story = { args: { passwordToCheck: 'C0rrect-H0rse!Battery#Bench' } };
