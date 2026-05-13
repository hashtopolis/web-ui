import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

const meta: Meta = {
  title: 'Material/Menu',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [MatMenuModule, MatButtonModule, MatIconModule] })]
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    template: `<button matButton [matMenuTriggerFor]="menu">Open menu</button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item>Refresh</button>
        <button mat-menu-item>Settings</button>
        <button mat-menu-item disabled>Disabled</button>
        <button mat-menu-item>Log out</button>
      </mat-menu>`
  })
};

export const WithIcons: Story = {
  render: () => ({
    template: `<button matButton [matMenuTriggerFor]="menu">Actions</button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item><mat-icon>edit</mat-icon><span>Edit</span></button>
        <button mat-menu-item><mat-icon>content_copy</mat-icon><span>Duplicate</span></button>
        <button mat-menu-item><mat-icon>delete</mat-icon><span>Delete</span></button>
      </mat-menu>`
  })
};
