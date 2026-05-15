import type { Meta, StoryObj } from '@storybook/angular';

import { DividerComponent, DividerOrientation, DividerVariant } from '@src/app/shared/divider/divider.component';
import { withSharedModule } from '@src/stories/_helpers/with-shared-module';

const meta: Meta<DividerComponent> = {
  title: 'Atoms/Divider',
  component: DividerComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  args: {
    variant: DividerVariant.Faint,
    orientation: DividerOrientation.Horizontal
  },
  argTypes: {
    variant: {
      control: 'select',
      options: Object.values(DividerVariant)
    },
    orientation: {
      control: 'select',
      options: Object.values(DividerOrientation)
    }
  }
};
export default meta;

type Story = StoryObj<DividerComponent>;

export const Playground: Story = {
  render: (args) => ({
    props: args,
    template: `<app-divider [variant]="variant" [orientation]="orientation"></app-divider>`
  })
};

export const Showcase: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 420px;">
        <section>
          <h3 style="margin: 0 0 .5rem; font-size: .75rem; text-transform: uppercase; letter-spacing: .04em; color: var(--muted-foreground);">Horizontal variants</h3>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>Faint (default)<app-divider></app-divider></div>
            <div>Default<app-divider variant="default"></app-divider></div>
            <div>Strong<app-divider variant="strong"></app-divider></div>
          </div>
        </section>

        <section>
          <h3 style="margin: 0 0 .5rem; font-size: .75rem; text-transform: uppercase; letter-spacing: .04em; color: var(--muted-foreground);">Vertical</h3>
          <div style="display: flex; align-items: center; gap: .5rem; height: 32px;">
            <span>Left</span>
            <app-divider orientation="vertical"></app-divider>
            <span>Middle</span>
            <app-divider orientation="vertical" variant="default"></app-divider>
            <span>Right</span>
          </div>
        </section>

        <section>
          <h3 style="margin: 0 0 .5rem; font-size: .75rem; text-transform: uppercase; letter-spacing: .04em; color: var(--muted-foreground);">Inside a .form-layout</h3>
          <div class="form-layout">
            <div style="padding: .5rem; background: var(--muted); border-radius: 4px;">Group A — field 1</div>
            <div style="padding: .5rem; background: var(--muted); border-radius: 4px;">Group A — field 2</div>
            <app-divider></app-divider>
            <div style="padding: .5rem; background: var(--muted); border-radius: 4px;">Group B — field 1</div>
            <div style="padding: .5rem; background: var(--muted); border-radius: 4px;">Group B — field 2</div>
          </div>
        </section>
      </div>
    `
  })
};
