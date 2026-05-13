import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

const meta: Meta = {
  title: 'Material/Toolbar',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [MatToolbarModule, MatButtonModule, MatIconModule] })
  ]
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => ({
    template: `<mat-toolbar>
      <span>Hashtopolis</span>
      <span style="flex: 1;"></span>
      <button matIconButton><mat-icon>notifications</mat-icon></button>
      <button matIconButton><mat-icon>account_circle</mat-icon></button>
    </mat-toolbar>`
  })
};
