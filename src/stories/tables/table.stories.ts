import type { Meta, StoryObj } from '@storybook/angular';

import { TableComponent } from '@src/app/shared/table/table.component';

import { withSharedModule } from '../_helpers/with-shared-module';

const meta: Meta<TableComponent> = {
  title: 'Data/Table',
  component: TableComponent,
  tags: ['autodocs'],
  decorators: [withSharedModule],
  render: () => ({
    template: `<div style="min-width: 720px;">
      <app-table>
        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align:left; padding:8px;">ID</th>
              <th style="text-align:left; padding:8px;">Name</th>
              <th style="text-align:left; padding:8px;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style="padding:8px;">1</td><td style="padding:8px;">agent-eu-01</td><td style="padding:8px;">running</td></tr>
            <tr><td style="padding:8px;">2</td><td style="padding:8px;">agent-eu-02</td><td style="padding:8px;">idle</td></tr>
            <tr><td style="padding:8px;">3</td><td style="padding:8px;">agent-us-01</td><td style="padding:8px;">offline</td></tr>
          </tbody>
        </table>
      </app-table>
    </div>`
  })
};
export default meta;

type Story = StoryObj<TableComponent>;

export const Default: Story = {};

export const Empty: Story = {
  render: () => ({
    template: `<div style="min-width: 720px;">
      <app-table>
        <table style="width:100%;"><tbody><tr><td style="padding:24px; text-align:center; color: var(--muted-foreground);">No data</td></tr></tbody></table>
      </app-table>
    </div>`
  })
};
