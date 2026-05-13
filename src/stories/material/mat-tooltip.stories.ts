import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

const meta: Meta = {
  title: 'Material/Tooltip',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [MatTooltipModule, MatButtonModule] })]
};
export default meta;

type Story = StoryObj;

export const HoverOrFocus: Story = {
  render: () => ({
    template: `<div style="display:flex; gap:16px;">
      <button matButton matTooltip="Default tooltip">Default</button>
      <button matButton matTooltip="Top placement" matTooltipPosition="above">Above</button>
      <button matButton matTooltip="Right placement" matTooltipPosition="right">Right</button>
    </div>`
  })
};
