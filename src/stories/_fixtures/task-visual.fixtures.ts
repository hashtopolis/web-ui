export interface TaskVisualArgs {
  taskid: number;
  taskWrapperId: number;
  tkeyspace: number;
  cprogress: number;
  tusepreprocessor: number;
  view: string;
}

interface StubChunk {
  skip: number;
  length: number;
  progress: number;
  cracked: number;
  state: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export interface TaskVisualFixture extends TaskVisualArgs {
  chunks: StubChunk[];
}

const KEYSPACE = 100_000_000;

// Each fixture defines how the keyspace is split into chunks and which colors
// the canvas should draw. The component's canvas logic uses (skip, length,
// state, cracked) per chunk and the task-level `cprogress` to paint a fill
// proportional to progress (gray base + yellow/green/red overlay).

export const ZERO_PERCENT: TaskVisualFixture = {
  taskid: 1,
  taskWrapperId: 1,
  tkeyspace: KEYSPACE,
  cprogress: 0,
  tusepreprocessor: 0,
  view: 'task',
  chunks: [{ skip: 0, length: KEYSPACE, progress: 0, cracked: 0, state: 4 }]
};

export const QUARTER: TaskVisualFixture = {
  ...ZERO_PERCENT,
  cprogress: 2_500,
  chunks: [
    { skip: 0, length: KEYSPACE / 4, progress: 10_000, cracked: 0, state: 5 },
    { skip: KEYSPACE / 4, length: (KEYSPACE * 3) / 4, progress: 0, cracked: 0, state: 4 }
  ]
};

export const HALF: TaskVisualFixture = {
  ...ZERO_PERCENT,
  cprogress: 5_000,
  chunks: [
    { skip: 0, length: KEYSPACE / 4, progress: 10_000, cracked: 2, state: 5 },
    { skip: KEYSPACE / 4, length: KEYSPACE / 4, progress: 10_000, cracked: 0, state: 5 },
    { skip: KEYSPACE / 2, length: KEYSPACE / 2, progress: 0, cracked: 0, state: 4 }
  ]
};

export const COMPLETE: TaskVisualFixture = {
  ...ZERO_PERCENT,
  cprogress: 10_000,
  chunks: [
    { skip: 0, length: KEYSPACE / 2, progress: 10_000, cracked: 5, state: 5 },
    { skip: KEYSPACE / 2, length: KEYSPACE / 2, progress: 10_000, cracked: 3, state: 5 }
  ]
};

export const WITH_PREPROCESSOR: TaskVisualFixture = {
  ...ZERO_PERCENT,
  cprogress: 5_000,
  tusepreprocessor: 1,
  chunks: [
    { skip: 0, length: KEYSPACE / 4, progress: 10_000, cracked: 1, state: 5 },
    { skip: KEYSPACE / 4, length: KEYSPACE / 4, progress: 10_000, cracked: 0, state: 6 },
    { skip: KEYSPACE / 2, length: KEYSPACE / 2, progress: 0, cracked: 0, state: 4 }
  ]
};

function envelope<T extends object>(type: string, items: T[]) {
  return {
    jsonapi: { version: '1.1' },
    data: items.map((attrs, i) => ({ id: i + 1, type, attributes: attrs }))
  };
}

export function buildTasksResponse(args: TaskVisualArgs) {
  return envelope('task', [
    {
      taskName: 'storybook-task',
      attackCmd: '',
      chunkTime: 600,
      statusTimer: 5,
      keyspace: args.tkeyspace,
      keyspaceProgress: args.cprogress,
      priority: 1,
      maxAgents: 1,
      color: null,
      isSmall: false,
      isCpuTask: false,
      useNewBench: true,
      skipKeyspace: 0,
      crackerBinaryId: 1,
      crackerBinaryTypeId: null,
      taskWrapperId: args.taskWrapperId,
      isArchived: false,
      notes: '',
      staticChunks: 0,
      chunkSize: 0,
      forcePipe: false,
      preprocessorId: 0,
      preprocessorCommand: ''
    }
  ]);
}

export function buildTaskWrappersResponse() {
  return envelope('taskWrapper', [
    {
      priority: 1,
      maxAgents: 1,
      taskType: 0 as const,
      hashlistId: 1,
      accessGroupId: 1,
      taskWrapperName: 'storybook-wrapper',
      isArchived: false,
      cracked: 0
    }
  ]);
}

export function buildChunksResponse(chunks: StubChunk[]) {
  return envelope(
    'chunk',
    chunks.map((c) => ({
      taskId: 1,
      skip: c.skip,
      length: c.length,
      agentId: 1,
      dispatchTime: 0,
      solveTime: 0,
      checkpoint: 0,
      progress: c.progress,
      state: c.state,
      cracked: c.cracked,
      speed: 0
    }))
  );
}
