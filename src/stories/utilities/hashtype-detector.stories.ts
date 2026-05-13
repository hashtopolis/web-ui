import type { Meta, StoryObj } from '@storybook/angular';

import { HashtypeDetectorComponent } from '@src/app/shared/hashtype-detector/hashtype-detector.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<HashtypeDetectorComponent> = {
  title: 'Utilities/HashtypeDetector',
  component: HashtypeDetectorComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  render: () => ({
    template: `<div style="width: 520px;"><hashtype-detector></hashtype-detector></div>`
  })
};
export default meta;

type Story = StoryObj<HashtypeDetectorComponent>;

export const Default: Story = {};
