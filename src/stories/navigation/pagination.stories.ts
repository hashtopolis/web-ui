import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { MatPaginatorModule } from '@angular/material/paginator';

interface PaginationArgs {
  length: number;
  pageIndex: number;
  pageSize: number;
  pageSizeOptions: number[];
}

// Mirrors the production wrapper used in ht-table.component.html so the story
// renders the pager in the same flex footer that the app actually ships.
const meta: Meta<PaginationArgs> = {
  title: 'Navigation/Pagination',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [MatPaginatorModule] })],
  args: {
    length: 250,
    pageIndex: 0,
    pageSize: 25,
    pageSizeOptions: [10, 25, 50, 100]
  },
  render: (args) => ({
    props: { ...args, onPage: action('page') },
    template: `<div class="flex justify-between items-center gap-3 mt-1 pt-2 text-subtle-foreground text-xs"
                    style="min-width: 640px;">
      <span>250 rows</span>
      <mat-paginator
        (page)="onPage($event)"
        [length]="length"
        [pageIndex]="pageIndex"
        [pageSizeOptions]="pageSizeOptions"
        [pageSize]="pageSize">
      </mat-paginator>
    </div>`
  })
};
export default meta;

type Story = StoryObj<PaginationArgs>;

export const Default: Story = {};
export const SinglePage: Story = { args: { length: 6 } };
export const ManyPages: Story = { args: { length: 1_000, pageSize: 25 } };
export const MidwayOffset: Story = { args: { length: 250, pageIndex: 4 } };
export const ZeroItems: Story = { args: { length: 0 } };
