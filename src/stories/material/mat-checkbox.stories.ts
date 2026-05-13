import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MatCheckboxModule } from '@angular/material/checkbox';

const meta: Meta = {
  title: 'Material/Checkbox',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [MatCheckboxModule] })]
};
export default meta;

type Story = StoryObj;

export const Variants: Story = {
  render: () => ({
    template: `<div style="display:flex; flex-direction:column; gap:8px;">
      <mat-checkbox>Default</mat-checkbox>
      <mat-checkbox checked>Checked</mat-checkbox>
      <mat-checkbox indeterminate>Indeterminate</mat-checkbox>
      <mat-checkbox disabled>Disabled</mat-checkbox>
      <mat-checkbox checked disabled>Disabled + checked</mat-checkbox>
    </div>`
  })
};
