/**
 * USER CRUD
 **/

// // AGENT
export const Agent = {
  CREATE: 'permAgentCreate',
  DELETE: 'permAgentDelete',
  READ: 'permAgentRead',
  UPDATE: 'permAgentUpdate'
} as const;
// // AGENT STAT
export const AgentStat = {
  CREATE: 'permAgentStatCreate',
  DELETE: 'permAgentStatDelete',
  READ: 'permAgentStatRead',
  UPDATE: 'permAgentStatUpdate'
} as const;

export const AgentAssignment = {
  CREATE: 'permAgentAssignmentCreate',
  DELETE: 'permAgentAssignmentDelete',
  READ: 'permAgentAssignmentRead',
  UPDATE: 'permAgentAssignmentUpdate'
} as const;

export const AgentError = {
  READ: 'permAgentErrorRead'
} as const;

// // VOUCHER
export const Voucher = {
  CREATE: 'permRegVoucherCreate',
  DELETE: 'permRegVoucherDelete',
  READ: 'permRegVoucherRead',
  UPDATE: 'permRegVoucherUpdate'
} as const;
// // TASK
export const Task = {
  CREATE: 'permTaskCreate',
  DELETE: 'permTaskDelete',
  READ: 'permTaskRead',
  UPDATE: 'permTaskUpdate'
} as const;
// // PRETASK
export const Pretask = {
  CREATE: 'permPretaskCreate',
  DELETE: 'permPretaskDelete',
  READ: 'permPretaskRead',
  UPDATE: 'permPretaskUpdate'
} as const;
// // SUPERTASK
export const SuperTask = {
  CREATE: 'permSupertaskCreate',
  DELETE: 'permSupertaskDelete',
  READ: 'permSupertaskRead',
  UPDATE: 'permSupertaskUpdate'
} as const;
// // TASK WRAPPER  (Running supertask)
export const TaskWrapper = {
  CREATE: 'permTaskWrapperCreate',
  UPDATE: 'permTaskWrapperUpdate',
  READ: 'permTaskWrapperRead'
} as const;
// // CHUNK
export const Chunk = {
  DELETE: 'permChunkDelete',
  READ: 'permChunkRead',
  UPDATE: 'permChunkUpdate'
} as const;
// // Speed
export const Speed = {
  READ: 'permSpeedRead'
} as const;
// // HASH-LIST
export const Hashlist = {
  CREATE: 'permHashlistCreate',
  DELETE: 'permHashlistDelete',
  READ: 'permHashlistRead',
  UPDATE: 'permHashlistUpdate'
} as const;
// // SUPER-HASHLIST
export const SuperHashlist = {
  CREATE: 'permHashlistHashlistCreate',
  READ: 'permHashlistHashlistRead',
  UPDATE: 'permHashlistHashlistUpdate',
  DELETE: 'permHashlistHashlistDelete'
} as const;
// // HASH
export const Hash = {
  READ: 'permHashRead'
} as const;
// // FILE
export const File = {
  CREATE: 'permFileCreate',
  DELETE: 'permFileDelete',
  READ: 'permFileRead',
  UPDATE: 'permFileUpdate'
} as const;
// // CONFIG
export const Config = {
  CREATE: 'permConfigCreate',
  DELETE: 'permConfigDelete',
  READ: 'permConfigRead',
  UPDATE: 'permConfigUpdate'
} as const;
// // AGENT BINARY
export const AgentBinary = {
  CREATE: 'permAgentBinaryCreate',
  DELETE: 'permAgentBinaryDelete',
  READ: 'permAgentBinaryRead',
  UPDATE: 'permAgentBinaryUpdate'
} as const;
// // CRACKER BINARY
export const CrackerBinary = {
  CREATE: 'permCrackerBinaryCreate',
  DELETE: 'permCrackerBinaryDelete',
  READ: 'permCrackerBinaryRead',
  UPDATE: 'permCrackerBinaryUpdate'
} as const;
// // CRACKER BINARY TYPE
export const CrackerBinaryType = {
  CREATE: 'permCrackerBinaryTypeCreate',
  DELETE: 'permCrackerBinaryTypeDelete',
  READ: 'permCrackerBinaryTypeRead',
  UPDATE: 'permCrackerBinaryTypeUpdate'
} as const;
// // PREPROCESSOR
export const Prepro = {
  CREATE: 'permPreprocessorCreate',
  DELETE: 'permPreprocessorDelete',
  READ: 'permPreprocessorRead',
  UPDATE: 'permPreprocessorUpdate'
} as const;
// // HASHTYPES
export const Hashtype = {
  CREATE: 'permHashTypeCreate',
  DELETE: 'permHashTypeDelete',
  READ: 'permHashTypeRead',
  UPDATE: 'permHashTypeUpdate'
} as const;
// // HEALTH CHECK
export const HealthCheck = {
  CREATE: 'permHealthCheckCreate',
  DELETE: 'permHealthCheckDelete',
  READ: 'permHealthCheckRead',
  UPDATE: 'permHealthCheckUpdate'
} as const;
// // HEALTH CHECK AGENT
export const HealthCheckAgent = {
  CREATE: 'permHealthCheckAgentCreate',
  DELETE: 'permHealthCheckAgentDelete',
  READ: 'permHealthCheckAgentRead',
  UPDATE: 'permHealthCheckAgentUpdate'
} as const;
// // LOGS
export const Logs = {
  READ: 'permLogEntryRead'
} as const;
// // USER
export const User = {
  CREATE: 'permUserCreate',
  DELETE: 'permUserDelete',
  READ: 'permUserRead',
  UPDATE: 'permUserUpdate'
} as const;
// // RIGHT GROUP
export const RightGroup = {
  CREATE: 'permRightGroupCreate',
  DELETE: 'permRightGroupDelete',
  READ: 'permRightGroupRead',
  UPDATE: 'permRightGroupUpdate'
} as const;
// // GROUP ACCESS
export const GroupAccess = {
  CREATE: 'permAccessGroupCreate',
  DELETE: 'permAccessGroupDelete',
  READ: 'permAccessGroupRead',
  UPDATE: 'permAccessGroupUpdate'
} as const;
// // NOTIFICATIONS
export const Notif = {
  CREATE: 'permNotificationSettingCreate',
  DELETE: 'permNotificationSettingDelete',
  READ: 'permNotificationSettingRead',
  UPDATE: 'permNotificationSettingUpdate'
} as const;
// // JWT API KEY
export const JwtApiKey = {
  CREATE: 'permJwtApiKeyCreate',
  DELETE: 'permJwtApiKeyDelete',
  READ: 'permJwtApiKeyRead',
  UPDATE: 'permJwtApiKeyUpdate'
} as const;

export const Perm = {
  Agent,
  AgentStat,
  AgentAssignment,
  AgentError,
  Voucher,
  Task,
  Pretask,
  SuperTask,
  TaskWrapper,
  Chunk,
  Speed,
  Hashlist,
  SuperHashlist,
  Hash,
  File,
  Config,
  AgentBinary,
  CrackerBinary,
  CrackerBinaryType,
  Prepro,
  Hashtype,
  HealthCheck,
  HealthCheckAgent,
  Logs,
  User,
  RightGroup,
  GroupAccess,
  Notif,
  JwtApiKey
} as const;

type PermissionGroupValues<T> = T[keyof T];

export type PermissionValues = {
  [K in keyof typeof Perm]: PermissionGroupValues<(typeof Perm)[K]>;
}[keyof typeof Perm];
