import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

const meta: Meta = {
  title: 'Material/Card',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [MatCardModule, MatButtonModule] })]
};
export default meta;

type Story = StoryObj;

export const Basic: Story = {
  render: () => ({
    template: `<mat-card style="max-width: 360px;">
      <mat-card-content>Simple card content with no header.</mat-card-content>
    </mat-card>`
  })
};

export const WithHeader: Story = {
  render: () => ({
    template: `<mat-card style="max-width: 360px;">
      <mat-card-header>
        <mat-card-title>Agent eu-01</mat-card-title>
        <mat-card-subtitle>Active · 3 GPU devices</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>Last seen 2 minutes ago.</mat-card-content>
    </mat-card>`
  })
};

export const WithActions: Story = {
  render: () => ({
    template: `<mat-card style="max-width: 360px;">
      <mat-card-header>
        <mat-card-title>Confirm deletion</mat-card-title>
      </mat-card-header>
      <mat-card-content>This will permanently remove the hashlist and all associated chunks.</mat-card-content>
      <mat-card-actions align="end">
        <button matButton>Cancel</button>
        <button matButton="filled" color="warn">Delete</button>
      </mat-card-actions>
    </mat-card>`
  })
};
