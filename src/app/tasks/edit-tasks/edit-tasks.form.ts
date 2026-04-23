import { FormControl, FormGroup } from '@angular/forms';

export const ChunkView = {
  Live: 0,
  All: 1
} as const;

export type ChunkView = (typeof ChunkView)[keyof typeof ChunkView];

export const ForcePipeLabel = {
  Yes: 'Yes',
  No: 'No'
} as const;

export type ForcePipeLabel = (typeof ForcePipeLabel)[keyof typeof ForcePipeLabel];

export interface EditTaskUpdateDataForm {
  taskName: FormControl<string>;
  attackCmd: FormControl<string>;
  notes: FormControl<string>;
  color: FormControl<string | null>;
  chunkTime: FormControl<number>;
  statusTimer: FormControl<number>;
  priority: FormControl<number>;
  maxAgents: FormControl<number>;
  isCpuTask: FormControl<boolean>;
  isSmall: FormControl<boolean>;
}

export interface EditTaskForm {
  taskId: FormControl<number>;
  forcePipe: FormControl<ForcePipeLabel>;
  staticChunks: FormControl<string>;
  skipKeyspace: FormControl<number | 'N/A'>;
  keyspace: FormControl<number>;
  keyspaceProgress: FormControl<number>;
  crackerBinaryId: FormControl<number>;
  chunkSize: FormControl<number>;
  updateData: FormGroup<EditTaskUpdateDataForm>;
}

export interface AssignAgentForm {
  agentId: FormControl<number | null>;
}
