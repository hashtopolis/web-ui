export const NewTaskRouteKind = {
  NewTask: 'new-task',
  CopyTask: 'copy-task',
  CopyPreTask: 'copy-pretask',
} as const;

export type NewTaskRouteKind = (typeof NewTaskRouteKind)[keyof typeof NewTaskRouteKind];
