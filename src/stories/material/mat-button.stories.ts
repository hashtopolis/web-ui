import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const meta: Meta = {
  title: 'Material/Button',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [MatButtonModule, MatIconModule] })]
};
export default meta;

type Story = StoryObj;

export const AllVariants: Story = {
  render: () => ({
    template: `<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
      <button matButton>Basic</button>
      <button matButton="filled">Filled</button>
      <button matButton="tonal">Tonal</button>
      <button matButton="outlined">Outlined</button>
      <button matButton="elevated">Elevated</button>
    </div>`
  })
};

export const Disabled: Story = {
  render: () => ({
    template: `<div style="display:flex; flex-wrap:wrap; gap:12px; align-items:center;">
      <button matButton disabled>Basic</button>
      <button matButton="filled" disabled>Filled</button>
      <button matButton="tonal" disabled>Tonal</button>
      <button matButton="outlined" disabled>Outlined</button>
    </div>`
  })
};

export const IconButtons: Story = {
  render: () => ({
    template: `<div style="display:flex; gap:8px; align-items:center;">
      <button matIconButton aria-label="search"><mat-icon>search</mat-icon></button>
      <button matIconButton aria-label="favorite"><mat-icon>favorite</mat-icon></button>
      <button matIconButton aria-label="delete" disabled><mat-icon>delete</mat-icon></button>
    </div>`
  })
};

export const Fab: Story = {
  render: () => ({
    template: `<div style="display:flex; gap:12px; align-items:center;">
      <button matFab aria-label="add"><mat-icon>add</mat-icon></button>
      <button matMiniFab aria-label="add"><mat-icon>add</mat-icon></button>
    </div>`
  })
};
