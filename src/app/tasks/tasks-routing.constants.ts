export const NewTaskRouteKind = {
  NewTask: 'new-task',
  CopyTask: 'copy-task',
  CopyPreTask: 'copy-pretask'
} as const;

export type NewTaskRouteKind = (typeof NewTaskRouteKind)[keyof typeof NewTaskRouteKind];

export const EditTaskRouteKind = {
  EditTask: 'edit-task',
  EditTaskShowAllChunks: 'edit-task-cAll'
} as const;

export type EditTaskRouteKind = (typeof EditTaskRouteKind)[keyof typeof EditTaskRouteKind];

export const PretaskRouteKind = {
  List: 'preconfigured-tasks',
  New: 'new-preconfigured-tasks',
  Edit: 'edit-preconfigured-tasks',
  CopyPretask: 'copy-preconfigured-tasks',
  CopyTaskToPretask: 'copy-tasks'
} as const;

export type PretaskRouteKind = (typeof PretaskRouteKind)[keyof typeof PretaskRouteKind];

export const SupertaskRouteKind = {
  List: 'supertasks',
  New: 'new-supertasks',
  Edit: 'edit-supertasks',
  ApplyHashlist: 'applyhashlist'
} as const;

export type SupertaskRouteKind = (typeof SupertaskRouteKind)[keyof typeof SupertaskRouteKind];

export const TaskRoutePath = {
  PretaskList: 'tasks/preconfigured-tasks',
  SupertaskList: '/tasks/supertasks'
} as const;

export const FileEditType = {
  Task: 0,
  Pretask: 1
} as const;

export type FileEditType = (typeof FileEditType)[keyof typeof FileEditType];
