/**
 * Services Available
 **/

/**
 * Interface definition for available API services
 * @prop URL      API endpoint URL
 * @prop RESOURCE Resource type according to json:api standard
 */
export interface ServiceConfig {
  URL: string;
  RESOURCE: string;
}

export class SERV {
  // HELPER
  public static HELPER = { URL: '/helper', RESOURCE: 'Helper' };
  public static HELPER_CHANGE_OWN_PASSWORD = { URL: '/helper/changeOwnPassword', RESOURCE: 'ChangeOwnPassword' };
  // ACCESS
  public static AUTH = { URL: '/auth', RESOURCE: 'Auth' };
  public static ACCESS_GROUPS = { URL: '/ui/accessgroups', RESOURCE: 'AccessGroups' };
  public static ACCESS_PERMISSIONS_GROUPS = { URL: '/ui/globalpermissiongroups', RESOURCE: 'GlobalPermissionGroups' };
  // AGENTS
  public static AGENTS = { URL: '/ui/agents', RESOURCE: 'Agents' };
  public static AGENTS_STATS = { URL: '/ui/agentstats', RESOURCE: 'AgentStats' };
  public static AGENT_ASSIGN = { URL: '/ui/agentassignments', RESOURCE: 'AgentAssignments' };
  public static AGENTS_COUNT = { URL: '/ui/agents/count', RESOURCE: 'AgentsCount' };
  public static VOUCHER = { URL: '/ui/vouchers', RESOURCE: 'Vouchers' };
  // CONFIGURATION
  public static AGENT_BINARY = { URL: '/ui/agentbinaries', RESOURCE: 'AgentBinaries' };
  public static CONFIGS = { URL: '/ui/configs', RESOURCE: 'Configs' };
  public static CRACKERS = { URL: '/ui/crackers', RESOURCE: 'Crackers' };
  public static CRACKERS_TYPES = { URL: '/ui/crackertypes', RESOURCE: 'CrackerTypes' };
  public static HASHTYPES = { URL: '/ui/hashtypes', RESOURCE: 'HashTypes' };
  public static HEALTH_CHECKS = { URL: '/ui/healthchecks', RESOURCE: 'HealthCheck' };
  public static HEALTH_CHECKS_AGENTS = { URL: '/ui/healthcheckagents', RESOURCE: 'HealthCheckAgents' };
  public static LOGS = { URL: '/ui/logentries', RESOURCE: 'LogEntries' };
  public static PREPROCESSORS = { URL: '/ui/preprocessors', RESOURCE: 'Preprocessors' };
  // FILES
  public static FILES = { URL: '/ui/files', RESOURCE: 'Files' };
  // HASHLISTS
  public static HASHES = { URL: '/ui/hashes', RESOURCE: 'Hashes' };
  public static HASHLISTS = { URL: '/ui/hashlists', RESOURCE: 'HashLists' };
  public static SUPER_HASHLISTS = { URL: '/ui/superhashlists', RESOURCE: 'SuperHashLists' };
  public static HASHES_COUNT = { URL: '/ui/hashes/count', RESOURCE: 'HashesCount' };
  // TASKS
  public static CHUNKS = { URL: '/ui/chunks', RESOURCE: 'Chunks' };
  public static PRETASKS = { URL: '/ui/pretasks', RESOURCE: 'PreTasks' };
  public static SPEEDS = { URL: '/ui/speeds', RESOURCE: 'Speeds' };
  public static SUPER_TASKS = { URL: '/ui/supertasks', RESOURCE: 'SuperTasks' };
  public static TASKS = { URL: '/ui/tasks', RESOURCE: 'Tasks' };
  public static TASKS_WRAPPER = { URL: '/ui/taskwrappers', RESOURCE: 'TaskWrappers' };
  public static TASKS_WRAPPER_COUNT = { URL: '/ui/taskwrappers/count', RESOURCE: 'TaskWrappersCount' };
  // USERS
  public static NOTIFICATIONS = { URL: '/ui/notifications', RESOURCE: 'Notifications' };
  public static USERS = { URL: '/ui/users', RESOURCE: 'Users' };
  // PROJECTS
  public static PROJECTS = { URL: '/ui/tasks', RESOURCE: 'Projects' };
}

/**
 * Different RelationshipTypes used in API requests
 * @enum
 */
export enum RelationshipType {
  ACCESSGROUP = 'accessGroup',
  ACCESSGROUPS = 'accessGroups',
  AGENT = 'agent',
  AGENTMEMBER = 'agentMembers',
  AGENTSTAT = 'agentStats',
  ASSIGNMENT = 'assignments',
  ASSIGNEDAGENTS = 'assignedAgents',
  CHUNK = 'chunk',
  CHUNKS = 'chunks',
  CONFIGSECTION = 'configSection',
  CRACKERBINARY = 'crackerBinary',
  CRACKERBINARYTYPE = 'crackerBinaryType',
  CRACKERVERSION = 'crackerVersions',
  FILES = 'files',
  GLOBALPERMISSIONGROUP = 'globalPermissionGroup',
  HASHES = 'hashes',
  HASHLIST = 'hashlist',
  HASHLISTS = 'hashlists',
  HASHTYPE = 'hashtype',
  HEALTHCHECK = 'healthCheck',
  HEALTHCHECKAGENTS = 'healthCheckAgents',
  PRETASKS = 'pretasks',
  PRETASKFILES = 'pretaskFiles',
  SPEEDS = 'speeds',
  TASK = 'task',
  TASKS = 'tasks',
  USER = 'user',
  USERMEMERS = 'userMembers'
}
