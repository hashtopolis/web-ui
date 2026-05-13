import type { Meta, StoryObj } from '@storybook/angular';

import { HexconvertorComponent } from '@src/app/shared/utils/hexconvertor/hexconvertor.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<HexconvertorComponent> = {
  title: 'Utilities/HexConvertor',
  component: HexconvertorComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  render: () => ({ template: `<div style="width: 520px;"><app-hexconvertor></app-hexconvertor></div>` })
};
export default meta;

type Story = StoryObj<HexconvertorComponent>;

export const Default: Story = {};
