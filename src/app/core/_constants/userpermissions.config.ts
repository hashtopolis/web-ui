/**
 * USER CRUD
**/

// // AGENT
export enum Agent {
  CREATE = 'permAgentCreate',
  DELETE = 'permAgentDelete',
  READ   = 'permAgentRead',
  UPDATE = 'permAgentUpdate',
}
// // AGENT STAT
export enum AgentStat {
  CREATE = 'permAgentStatCreate',
  DELETE = 'permAgentStatDelete',
  READ   = 'permAgentStatRead',
  UPDATE = 'permAgentStatUpdate',
}
// // VOUCHER
export enum Voucher {
  CREATE = 'permRegVoucherCreate',
  DELETE = 'permRegVoucherDelete',
  READ = 'permRegVoucherRead',
  UPDATE = 'permRegVoucherUpdate',
}
// // TASK
export enum Task {
  CREATE = 'permTaskCreate',
  DELETE = 'permTaskDelete',
  READ   = 'permTaskRead',
  UPDATE = 'permTaskUpdate',
}
// // PRETASK
export enum Pretask {
  CREATE = 'permPretaskCreate',
  DELETE = 'permPretaskDelete',
  READ   = 'permPretaskRead',
  UPDATE = 'permPretaskUpdate',
}
// // SUPERTASK
export enum SuperTask {
  CREATE = 'permSupertaskCreate',
  DELETE = 'permSupertaskDelete',
  READ   = 'permSupertaskRead',
  UPDATE = 'permSupertaskUpdate',
}
// // TASK WRAPPER  (Running supertask)
export enum TaskWrapper {
  CREATE = 'permTaskWrapperRead',
  DELETE = '',
  READ   = '',
  UPDATE = 'permTaskWrapperUpdate',
}
// // CHUNK
export enum Chunk {
  CREATE = '',
  DELETE = 'permChunkDelete',
  READ   = 'permChunkRead',
  UPDATE = 'permChunkUpdate',
}
// // HASH-LIST
export enum Hashlist {
  CREATE = 'permHashlistCreate',
  DELETE = 'permHashlistDelete',
  READ   = 'permHashlistRead',
  UPDATE = 'permHashlistUpdate',
}
// // SUPER-HASHLIST
export enum SuperHashlist {
  CREATE = 'permHashlistHashlistCreate',
  DELETE = '',
  READ   = 'permHashlistHashlistRead',
  UPDATE = '',
}
// // HASH
export enum Hash {
  CREATE = '',
  DELETE = '',
  READ   = 'permHashRead',
  UPDATE = '',
}
// // FILE
export enum File {
  CREATE = 'permFileCreate',
  DELETE = 'permFileDelete',
  READ   = 'permFileRead',
  UPDATE = 'permFileUpdate',
}
// // CONFIG
export enum Config {
  CREATE = 'permConfigCreate',
  DELETE = 'permConfigDelete',
  READ   = 'permConfigRead',
  UPDATE = 'permConfigUpdate',
}
// // AGENT BINARY
export enum AgentBinary {
  CREATE = 'permAgentBinaryCreate',
  DELETE = 'permAgentBinaryDelete',
  READ   = 'permAgentBinaryRead',
  UPDATE = 'permAgentBinaryUpdate',
}
// // CRACKER BINARY
export enum CrackerBinary {
  CREATE = 'permCrackerBinaryCreate',
  DELETE = 'permCrackerBinaryDelete',
  READ   = 'permCrackerBinaryRead',
  UPDATE = 'permCrackerBinaryUpdate',
}
// // CRACKER BINARY TYPE
export enum CrackerBinaryType {
  CREATE = 'permCrackerBinaryTypeCreate',
  DELETE = 'permCrackerBinaryTypeDelete',
  READ   = 'permCrackerBinaryTypeRead',
  UPDATE = 'permCrackerBinaryTypeUpdate',
}
// // PREPROCESSOR
export enum Prepro {
  CREATE = 'permPreprocessorCreate',
  DELETE = 'permPreprocessorDelete',
  READ   = 'permPreprocessorRead',
  UPDATE = 'permPreprocessorUpdate',
}
// // HASHTYPES
export enum Hashtype {
  CREATE = 'permHashTypeCreate',
  DELETE = 'permHashTypeDelete',
  READ   = 'permPreprocessorRead',
  UPDATE = 'permHashTypeUpdate',
}
// // HEALTH CHECK
export enum HealthCheck {
  CREATE = 'permHealthCheckCreate',
  DELETE = 'permHealthCheckDelete',
  READ   = 'permHealthCheckRead',
  UPDATE = 'permHealthCheckUpdate',
}
// // HEALTH CHECK AGENT
export enum HealthCheckAgent {
  CREATE = 'permHealthCheckAgentCreate',
  DELETE = 'permHealthCheckAgentDelete',
  READ   = 'permHealthCheckAgentRead',
  UPDATE = 'permHealthCheckAgentUpdate',
}
// // LOGS
export enum Logs {
  CREATE = '',
  DELETE = '',
  READ   = 'permLogEntryRead',
  UPDATE = '',
}
// // USER
export enum User {
  CREATE = 'permUserCreate',
  DELETE = 'permUserDelete',
  READ   = 'permUserRead',
  UPDATE = 'permUserUpdate',
}
// // RIGHT GROUP
export enum RightGroup {
  CREATE = 'permRightGroupCreate',
  DELETE = 'permRightGroupDelete',
  READ   = 'permRightGroupRead',
  UPDATE = 'permRightGroupUpdate',
}
// // GROUP ACCESS
export enum GroupAccess {
  CREATE = 'permAccessGroupCreate',
  DELETE = 'permAccessGroupDelete',
  READ   = 'permAccessGroupRead',
  UPDATE = 'permAccessGroupUpdate'
}
// // NOTIFICATIONS
export enum Notif {
  CREATE = 'permNotificationSettingCreate',
  DELETE = 'permNotificationSettingDelete',
  READ   = 'permNotificationSettingRead',
  UPDATE = 'permNotificationSettingUpdate',
}

export class Perm {
  static readonly Agent = Agent;
  static readonly AgentStat = AgentStat;
  static readonly Voucher = Voucher;
  static readonly Task = Task;
  static readonly Pretask = Pretask;
  static readonly SuperTask = SuperTask;
  static readonly TaskWrapper = TaskWrapper;
  static readonly Chunk = Chunk;
  static readonly Hashlist = Hashlist;
  static readonly SuperHashlist = SuperHashlist;
  static readonly Hash = Hash;
  static readonly File = File;
  static readonly Config = Config;
  static readonly AgentBinary = AgentBinary;
  static readonly CrackerBinary = CrackerBinary;
  static readonly CrackerBinaryType = CrackerBinaryType;
  static readonly Prepro = Prepro;
  static readonly Hashtype = Hashtype;
  static readonly HealthCheck = HealthCheck;
  static readonly HealthCheckAgent = HealthCheckAgent;
  static readonly Logs = Logs;
  static readonly User = User;
  static readonly RightGroup = RightGroup;
  static readonly GroupAccess = GroupAccess;
  static readonly Notif = Notif;
}
