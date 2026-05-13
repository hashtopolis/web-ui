import { EMPTY, of } from 'rxjs';

import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { TaskVisualComponent } from '@src/app/shared/graphs/task-visual/task-visual.component';
import { GraphsModule } from '@src/app/shared/graphs/graphs.module';

import { GlobalService } from '@src/app/core/_services/main.service';

import {
  COMPLETE,
  HALF,
  QUARTER,
  TaskVisualArgs,
  TaskVisualFixture,
  WITH_PREPROCESSOR,
  ZERO_PERCENT,
  buildChunksResponse,
  buildTasksResponse,
  buildTaskWrappersResponse
} from '../_fixtures/task-visual.fixtures';

// Storybook stubs GlobalService so the canvas can render without a backend.
// Requests are routed by the SERV constant's URL so each fixture can supply
// its own chunk shape and the canvas draws a visibly different progress bar.
function buildStub(fixture: TaskVisualFixture) {
  return class StorybookGlobalServiceStub {
    getAll(serv: { URL: string }) {
      if (serv.URL.includes('chunks')) {
        return of(buildChunksResponse(fixture.chunks));
      }
      if (serv.URL.includes('taskwrappers')) {
        return of(buildTaskWrappersResponse());
      }
      if (serv.URL.includes('tasks')) {
        return of(buildTasksResponse(fixture));
      }
      return of({ jsonapi: { version: '1.1' }, data: [] });
    }
    get() {
      return EMPTY;
    }
  };
}

const meta: Meta<TaskVisualComponent> = {
  title: 'Graphs/TaskVisual',
  component: TaskVisualComponent,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [GraphsModule] })],
  render: (args) => ({
    props: args,
    template: `<div style="width: 800px;">
      <task-visual
        [taskid]="taskid"
        [taskWrapperId]="taskWrapperId"
        [tkeyspace]="tkeyspace"
        [cprogress]="cprogress"
        [tusepreprocessor]="tusepreprocessor"
        [view]="view"
      ></task-visual>
    </div>`
  })
};
export default meta;

type Story = StoryObj<TaskVisualArgs>;

function storyFor(fixture: TaskVisualFixture): Story {
  const { chunks: _chunks, ...args } = fixture;
  return {
    args,
    decorators: [
      applicationConfig({
        providers: [{ provide: GlobalService, useClass: buildStub(fixture) }]
      })
    ]
  };
}

export const ZeroPercent: Story = storyFor(ZERO_PERCENT);
export const Quarter: Story = storyFor(QUARTER);
export const Half: Story = storyFor(HALF);
export const Complete: Story = storyFor(COMPLETE);
export const WithPreprocessor: Story = storyFor(WITH_PREPROCESSOR);
