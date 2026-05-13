import type { Meta, StoryObj } from '@storybook/angular';

import { GridButtonsComponent } from '@src/app/shared/buttons/grid-cancel';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<GridButtonsComponent> = {
  title: 'Buttons/GridButtons',
  component: GridButtonsComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  render: () => ({
    template: `<div style="width: 520px;">
      <grid-buttons>
        <button-submit name="Save" type="submit"></button-submit>
        <button-submit name="Cancel" type="cancel-dialog"></button-submit>
      </grid-buttons>
    </div>`
  })
};
export default meta;

type Story = StoryObj<GridButtonsComponent>;

export const TwoButtons: Story = {};

export const ThreeButtons: Story = {
  render: () => ({
    template: `<div style="width: 520px;">
      <grid-buttons>
        <button-submit name="Save" type="submit"></button-submit>
        <button-submit name="Reset" type="cancel-dialog"></button-submit>
        <button-submit name="Delete" type="delete"></button-submit>
      </grid-buttons>
    </div>`
  })
};
