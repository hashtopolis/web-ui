import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

import { ScrollYTopComponent } from '@src/app/shared/scrollytop/scrollytop.component';

const meta: Meta<ScrollYTopComponent> = {
  title: 'Utilities/ScrollToTop',
  component: ScrollYTopComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      declarations: [ScrollYTopComponent],
      imports: [CommonModule, FontAwesomeModule]
    })
  ],
  render: () => ({
    template: `<div style="height: 1600px; padding: 16px;">
      <p>Scroll down to reveal the floating button (host listens to window scroll).</p>
      <app-scroll-top></app-scroll-top>
    </div>`
  })
};
export default meta;

type Story = StoryObj<ScrollYTopComponent>;

export const Default: Story = {};
