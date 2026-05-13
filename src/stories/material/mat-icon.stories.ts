import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MatIconModule } from '@angular/material/icon';

const meta: Meta = {
  title: 'Material/Icon',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [MatIconModule] })]
};
export default meta;

type Story = StoryObj;

const COMMON_ICONS = [
  'add', 'edit', 'delete', 'search', 'check', 'close', 'arrow_back', 'arrow_forward',
  'more_vert', 'settings', 'refresh', 'download', 'upload', 'info', 'warning', 'error',
  'check_circle', 'visibility', 'visibility_off', 'open_in_new', 'menu', 'filter_list',
  'sort', 'play_arrow', 'pause', 'stop', 'help_outline', 'lock', 'logout', 'login'
];

export const Grid: Story = {
  render: () => ({
    props: { icons: COMMON_ICONS },
    template: `<div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:16px; padding:8px;">
      <div *ngFor="let icon of icons" style="display:flex; flex-direction:column; align-items:center; gap:6px;">
        <mat-icon>{{ icon }}</mat-icon>
        <span style="font-size:11px; color:var(--muted-foreground);">{{ icon }}</span>
      </div>
    </div>`
  })
};
