import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'sb-snackbar-host',
  standalone: false,
  template: `<div style="display:flex; gap:8px; flex-wrap: wrap;">
    <button matButton="filled" (click)="open('Saved successfully')">Default</button>
    <button matButton="outlined" (click)="open('Action complete', 'Undo')">With action</button>
    <button matButton="outlined" (click)="open('New SuperTask created', 'Close', 'snackbar-success')">Success</button>
    <button matButton="outlined" (click)="open('Failed to delete hashlist', 'Close', 'snackbar-error')">Error</button>
    <button matButton="outlined" (click)="open('Agent will reconnect shortly', 'Close', 'snackbar-info')">Info</button>
  </div>`
})
class SnackbarHostComponent {
  private readonly sb = inject(MatSnackBar);

  open(msg: string, action: string = '', panelClass?: string) {
    this.sb.open(msg, action || undefined, { duration: 4000, panelClass });
  }
}

const meta: Meta<SnackbarHostComponent> = {
  title: 'Material/SnackBar',
  component: SnackbarHostComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [SnackbarHostComponent],
      imports: [MatButtonModule, MatSnackBarModule]
    }),
    applicationConfig({ providers: [] })
  ],
  render: () => ({ template: `<sb-snackbar-host></sb-snackbar-host>` })
};
export default meta;

type Story = StoryObj<SnackbarHostComponent>;

export const TriggerFromButton: Story = {};
