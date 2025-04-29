import { AccessGroupsAgentsTableCol } from '@components/tables/access-groups-agents-table/access-groups-agents-table.constants';
import { AccessGroupsTableCol } from '@components/tables/access-groups-table/access-groups-table.constants';
import { AccessGroupsUsersTableCol } from '@components/tables/access-groups-users-table/access-groups-users-table.constants';
import { AccessPermissionGroupsUserTableCol } from '@components/tables/access-permission-groups-user-table/access-permission-groups-user-table.constants';
import { AccessPermissionGroupsUsersTableCol } from '@components/tables/access-permission-groups-users-table/access-permission-groups-users-table.constants';
import { AgentBinariesTableCol } from '@components/tables/agent-binaries-table/agent-binaries-table.constants';
import { AgentsStatusTableCol } from '@components/tables/agents-status-table/agents-status-table.constants';
import { AgentsTableCol } from '@components/tables/agents-table/agents-table.constants';
import { ChunksTableCol } from '@components/tables/chunks-table/chunks-table.constants';
import { CrackersTableCol } from '@components/tables/crackers-table/crackers-table.constants';
import { CracksTableCol } from '@components/tables/cracks-table/cracks-table.constants';
import { FilesAttackTableCol } from '@components/tables/files-attack-table/files-attack-table.constants';
import { FilesTableCol } from '@components/tables/files-table/files-table.constants';
import { HashesTableCol } from '@components/tables/hashes-table/hashes-table.constants';
import { HashlistsTableCol } from '@components/tables/hashlists-table/hashlists-table.constants';
import { HashtypesTableCol } from '@components/tables/hashtypes-table/hashtypes-table.constants';
import { HealthCheckAgentsTableCol } from '@components/tables/health-check-agents-table/health-check-agents-table.constants';
import { HealthChecksTableCol } from '@components/tables/health-checks-table/health-checks-table.constants';
import { LogsTableCol } from '@components/tables/logs-table/logs-table.constants';
import { NotificationsTableCol } from '@components/tables/notifications-table/notifications-table.constants';
import { PermissionsTableCol } from '@components/tables/permissions-table/permissions-table.constants';
import { PreprocessorsTableCol } from '@components/tables/preprocessors-table/preprocessors-table.constants';
import { PretasksTableCol } from '@components/tables/pretasks-table/pretasks-table.constants';
import { SearchHashTableCol } from '@components/tables/search-hash-table/search-hash-table.constants';
import { SuperHashlistsTableCol } from '@components/tables/super-hashlists-table/super-hashlists-table.constants';
import { SupertasksPretasksTableCol } from '@components/tables/supertasks-pretasks-table/supertasks-pretasks-table.constants';
import { SupertasksTableCol } from '@components/tables/supertasks-table/supertasks-table.constants';
import { TasksChunksTableCol } from '@components/tables/tasks-chunks-table/tasks-chunks-table.constants';
import { TasksSupertasksDataSourceTableCol } from '@components/tables/tasks-supertasks-table/tasks-supertasks-table.constants';
import { TaskTableCol } from '@components/tables/tasks-table/tasks-table.constants';
import { UsersTableCol } from '@components/tables/users-table/users-table.constants';
import { VouchersTableCol } from '@components/tables/vouchers-table/vouchers-table.constants';

export type Layout = 'full' | 'fixed';
export type Theme = 'light' | 'dark';

/**
 * Interface definition for TableSettings
 */
export interface TableSettings {
  [key: string]: number[] | TableConfig;
}

/**
 * Interface definition for TableConfig
 * @prop columns List of column number
 * @prop start   Start value for pagination
 * @prop order   Column sorting
 * @prop page    Number of pages
 * @prop search  Saved search
 */
export interface TableConfig {
  columns: number[];
  start: number;
  order: Sorting;
  page: number;
  search: string | [];
}

/**
 * Interface definition for UIConfig
 * @prop layout           UI layout
 * @prop theme            UI theme
 * @prop tableSettings    UI table settings
 * @prop timefmt          Time format
 * @prop refreshPage      Refresh page true/false
 * @prop refreshInterval  Refresh interval
 */
export interface UIConfig {
  layout: Layout;
  theme: Theme;
  tableSettings: TableSettings;
  timefmt: string;
  refreshPage: boolean;
  refreshInterval: number;
}

/**
 * Interface definition for Sorting
 * @prop id         Column id
 * @prop dataKey    Data key to sort
 * @prop isSortable Enable sorting: true, disable sorting: false
 * @prop direction  Sorting direction ('asc', 'desc'
 */
export interface Sorting {
  id: number;
  dataKey: string;
  isSortable: boolean;
  direction: string;
}

export const uiConfigDefault: UIConfig = {
  layout: 'fixed',
  theme: 'light',
  timefmt: 'dd/MM/yyyy h:mm:ss',
  tableSettings: {
    notificationsTable: {
      start: 0,
      page: 25,
      columns: [
        NotificationsTableCol.ID,
        NotificationsTableCol.STATUS,
        NotificationsTableCol.APPLIED_TO,
        NotificationsTableCol.ACTION,
        NotificationsTableCol.NOTIFICATION,
        NotificationsTableCol.RECEIVER
      ],
      order: {
        id: NotificationsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    vouchersTable: {
      start: 0,
      page: 25,
      columns: [VouchersTableCol.ID, VouchersTableCol.KEY, VouchersTableCol.CREATED],
      order: {
        id: VouchersTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    permissionsTable: {
      start: 0,
      page: 25,
      columns: [PermissionsTableCol.ID, PermissionsTableCol.NAME, PermissionsTableCol.MEMBERS],
      order: {
        id: PermissionsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    cracksTable: {
      start: 0,
      page: 25,
      columns: [
        CracksTableCol.FOUND,
        CracksTableCol.PLAINTEXT,
        CracksTableCol.HASH,
        CracksTableCol.AGENT,
        CracksTableCol.TASK,
        CracksTableCol.CHUNK,
        CracksTableCol.TYPE
      ],
      order: {
        id: CracksTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    agentsTable: {
      start: 0,
      page: 25,
      columns: [
        AgentsTableCol.ID,
        AgentsTableCol.NAME,
        AgentsTableCol.STATUS,
        AgentsTableCol.CURRENT_TASK,
        AgentsTableCol.CLIENT,
        AgentsTableCol.GPUS_CPUS,
        AgentsTableCol.LAST_ACTIVITY
      ],
      order: {
        id: AgentsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    agentStatusTable: {
      start: 0,
      page: 25,
      columns: [
        AgentsStatusTableCol.ID,
        AgentsStatusTableCol.STATUS,
        AgentsStatusTableCol.NAME,
        AgentsStatusTableCol.AGENT_STATUS,
        AgentsStatusTableCol.WORKING_ON,
        AgentsStatusTableCol.ASSIGNED,
        AgentsStatusTableCol.LAST_ACTIVITY
      ],
      order: {
        id: AgentsStatusTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    assignedAgentsTable: {
      start: 0,
      page: 25,
      columns: [
        AgentsTableCol.ID,
        AgentsTableCol.NAME,
        AgentsTableCol.STATUS,
        AgentsTableCol.TASK_SPEED,
        AgentsTableCol.LAST_ACTIVITY,
        AgentsTableCol.TIME_SPENT,
        AgentsTableCol.BENCHMARK,
        AgentsTableCol.CRACKED,
        AgentsTableCol.SEARCHED
      ],
      order: {
        id: AgentsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    chunksTable: {
      start: 0,
      page: 25,
      columns: [
        ChunksTableCol.ID,
        ChunksTableCol.PROGRESS,
        ChunksTableCol.TASK,
        ChunksTableCol.AGENT,
        ChunksTableCol.DISPATCH_TIME,
        ChunksTableCol.LAST_ACTIVITY,
        ChunksTableCol.TIME_SPENT,
        ChunksTableCol.STATE,
        ChunksTableCol.CRACKED
      ],
      order: {
        id: ChunksTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    hashlistsTable: {
      start: 0,
      page: 25,
      columns: [
        HashlistsTableCol.ID,
        HashlistsTableCol.NAME,
        HashlistsTableCol.HASHTYPE,
        HashlistsTableCol.FORMAT,
        HashlistsTableCol.CRACKED,
        HashlistsTableCol.HASH_COUNT
      ],
      order: {
        id: HashlistsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    hashlistsInShTable: {
      start: 0,
      page: 25,
      columns: [
        HashlistsTableCol.ID,
        HashlistsTableCol.NAME,
        HashlistsTableCol.FORMAT,
        HashlistsTableCol.CRACKED,
        HashlistsTableCol.HASH_COUNT
      ],
      order: {
        id: HashlistsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    superHashlistsTable: {
      start: 0,
      page: 25,
      columns: [
        SuperHashlistsTableCol.ID,
        SuperHashlistsTableCol.NAME,
        SuperHashlistsTableCol.HASHTYPE,
        SuperHashlistsTableCol.CRACKED,
        SuperHashlistsTableCol.HASHLISTS
      ],
      order: {
        id: SuperHashlistsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    hashtypesTable: {
      start: 0,
      page: 25,
      columns: [
        HashtypesTableCol.HASHTYPE,
        HashtypesTableCol.DESCRIPTION,
        HashtypesTableCol.SALTED,
        HashtypesTableCol.SLOW_HASH
      ],
      order: {
        id: HashtypesTableCol.HASHTYPE,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    filesTable: {
      start: 0,
      page: 25,
      columns: [
        FilesTableCol.ID,
        FilesTableCol.NAME,
        FilesTableCol.SIZE,
        FilesTableCol.LINE_COUNT,
        FilesTableCol.ACCESS_GROUP
      ],
      order: {
        id: FilesTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    filesAttackTable: {
      start: 0,
      page: 25,
      columns: [FilesAttackTableCol.ID, FilesAttackTableCol.NAME, FilesAttackTableCol.SIZE],
      order: {
        id: FilesAttackTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    crackersTable: {
      start: 0,
      page: 25,
      columns: [CrackersTableCol.ID, CrackersTableCol.NAME, CrackersTableCol.VERSIONS],
      order: {
        id: CrackersTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    preprocessorsTable: {
      start: 0,
      page: 25,
      columns: [PreprocessorsTableCol.ID, PreprocessorsTableCol.NAME],
      order: {
        id: PreprocessorsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    agentBinariesTable: {
      start: 0,
      page: 25,
      columns: [
        AgentBinariesTableCol.ID,
        AgentBinariesTableCol.FILENAME,
        AgentBinariesTableCol.OS,
        AgentBinariesTableCol.TYPE,
        AgentBinariesTableCol.UPDATE_TRACK,
        AgentBinariesTableCol.VERSION
      ],
      order: {
        id: AgentBinariesTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    healthChecksTable: {
      start: 0,
      page: 25,
      columns: [
        HealthChecksTableCol.ID,
        HealthChecksTableCol.CREATED,
        HealthChecksTableCol.STATUS,
        HealthChecksTableCol.TYPE
      ],
      order: {
        id: HealthChecksTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    healthCheckAgentsTable: {
      start: 0,
      page: 25,
      columns: [
        HealthCheckAgentsTableCol.AGENT_ID,
        HealthCheckAgentsTableCol.AGENT_NAME,
        HealthCheckAgentsTableCol.STATUS,
        HealthCheckAgentsTableCol.START,
        HealthCheckAgentsTableCol.GPUS,
        HealthCheckAgentsTableCol.CRACKED,
        HealthCheckAgentsTableCol.ERRORS
      ],
      order: {
        id: HealthCheckAgentsTableCol.AGENT_ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    pretasksTable: {
      start: 0,
      page: 25,
      columns: [
        PretasksTableCol.ID,
        PretasksTableCol.NAME,
        PretasksTableCol.ATTACK_COMMAND,
        PretasksTableCol.FILES_TOTAL,
        PretasksTableCol.FILES_SIZE,
        PretasksTableCol.PRIORITY,
        PretasksTableCol.MAX_AGENTS
      ],
      order: {
        id: PretasksTableCol.PRIORITY,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    tasksTable: {
      start: 0,
      page: 25,
      columns: [
        TaskTableCol.ID,
        TaskTableCol.TASK_TYPE,
        TaskTableCol.NAME,
        TaskTableCol.STATUS,
        TaskTableCol.HASHTYPE,
        TaskTableCol.HASHLISTS,
        TaskTableCol.PRIORITY,
        TaskTableCol.AGENTS,
        TaskTableCol.MAX_AGENTS,
        TaskTableCol.DISPATCHED_SEARCHED,
        TaskTableCol.CRACKED
      ],
      order: {
        id: TaskTableCol.PRIORITY,
        dataKey: '',
        isSortable: true,
        direction: 'desc'
      },
      search: ''
    },
    tasksChunksTable: {
      start: 0,
      page: 25,
      columns: [
        TasksChunksTableCol.ID,
        TasksChunksTableCol.PROGRESS,
        TasksChunksTableCol.AGENT,
        TasksChunksTableCol.DISPATCH_TIME,
        TasksChunksTableCol.LAST_ACTIVITY,
        TasksChunksTableCol.TIME_SPENT,
        TasksChunksTableCol.STATE,
        TasksChunksTableCol.CRACKED
      ],
      order: {
        id: TasksChunksTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    tasksSupertasksTable: {
      start: 0,
      page: 25,
      columns: [
        TasksSupertasksDataSourceTableCol.ID,
        TasksSupertasksDataSourceTableCol.NAME,
        TasksSupertasksDataSourceTableCol.DISPATCHED_SEARCHED,
        TasksSupertasksDataSourceTableCol.CRACKED,
        TasksSupertasksDataSourceTableCol.AGENTS,
        TasksSupertasksDataSourceTableCol.PRIORITY,
        TasksSupertasksDataSourceTableCol.MAX_AGENTS
      ],
      order: {
        id: TasksSupertasksDataSourceTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    supertasksTable: {
      start: 0,
      page: 25,
      columns: [SupertasksTableCol.ID, SupertasksTableCol.NAME, SupertasksTableCol.PRETASKS],
      order: {
        id: SupertasksTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    supertasksPretasksTable: {
      start: 0,
      page: 25,
      columns: [
        SupertasksPretasksTableCol.ID,
        SupertasksPretasksTableCol.NAME,
        SupertasksPretasksTableCol.PRIORITY,
        SupertasksPretasksTableCol.MAX_AGENTS
      ],
      order: {
        id: SupertasksPretasksTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    superTasksPretasksEditTable: {
      start: 0,
      page: 25,
      columns: [
        PretasksTableCol.ID,
        PretasksTableCol.NAME,
        PretasksTableCol.ATTACK_COMMAND,
        PretasksTableCol.ESTIMATED_KEYSPACE,
        PretasksTableCol.ATTACK_RUNTIME,
        PretasksTableCol.FILES_TOTAL,
        PretasksTableCol.FILES_SIZE,
        PretasksTableCol.PRIORITY,
        PretasksTableCol.MAX_AGENTS
      ],
      order: {
        id: PretasksTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    hashlistTasksTable: {
      start: 0,
      page: 25,
      columns: [TaskTableCol.ID, TaskTableCol.NAME, TaskTableCol.DISPATCHED_SEARCHED, TaskTableCol.CRACKED],
      order: {
        id: TaskTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    hashesTable: {
      start: 0,
      page: 25,
      columns: [
        HashesTableCol.HASHES,
        HashesTableCol.PLAINTEXT,
        HashesTableCol.SALT,
        HashesTableCol.CRACK_POSITION,
        HashesTableCol.ISCRACKED,
        HashesTableCol.TIMECRACKED
      ],
      order: {
        id: HashesTableCol.TIMECRACKED,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    searchHashTable: {
      start: 0,
      page: 25,
      columns: [SearchHashTableCol.HASH, SearchHashTableCol.INFO],
      order: {
        id: SearchHashTableCol.HASH,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    usersTable: {
      start: 0,
      page: 25,
      columns: [
        UsersTableCol.ID,
        UsersTableCol.NAME,
        UsersTableCol.REGISTERED,
        UsersTableCol.LAST_LOGIN,
        UsersTableCol.EMAIL,
        UsersTableCol.STATUS,
        UsersTableCol.SESSION,
        UsersTableCol.PERM_GROUP
      ],
      order: {
        id: UsersTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    logsTable: {
      start: 0,
      page: 25,
      columns: [LogsTableCol.ID, LogsTableCol.ISSUER, LogsTableCol.LEVEL, LogsTableCol.MESSAGE, LogsTableCol.TIME],
      order: {
        id: LogsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    accessGroupsTable: {
      start: 0,
      page: 25,
      columns: [
        AccessGroupsTableCol.ID,
        AccessGroupsTableCol.NAME,
        AccessGroupsTableCol.NUSERS,
        AccessGroupsTableCol.NAGENTS
      ],
      order: {
        id: AccessGroupsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    accessGroupsUsersTable: {
      start: 0,
      page: 25,
      columns: [AccessGroupsUsersTableCol.ID, AccessGroupsUsersTableCol.NAME, AccessGroupsUsersTableCol.STATUS],
      order: {
        id: AccessGroupsUsersTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    accessPermissionGroupsUserTable: {
      start: 0,
      page: 50,
      columns: [
        AccessPermissionGroupsUserTableCol.NAME,
        AccessPermissionGroupsUserTableCol.CREATE,
        AccessPermissionGroupsUserTableCol.READ,
        AccessPermissionGroupsUserTableCol.UPDATE,
        AccessPermissionGroupsUserTableCol.DELETE
      ],
      order: {
        id: AccessPermissionGroupsUserTableCol.NAME,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    accessPermissionGroupsUsersTable: {
      start: 0,
      page: 25,
      columns: [
        AccessPermissionGroupsUsersTableCol.ID,
        AccessPermissionGroupsUsersTableCol.NAME,
        AccessPermissionGroupsUsersTableCol.STATUS,
        AccessPermissionGroupsUsersTableCol.LAST_LOGIN
      ],
      order: {
        id: AccessPermissionGroupsUsersTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    accessGroupsAgentsTable: {
      start: 0,
      page: 25,
      columns: [AccessGroupsAgentsTableCol.ID, AccessGroupsAgentsTableCol.NAME],
      order: {
        id: AccessGroupsAgentsTableCol.ID,
        dataKey: '',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    }
  },
  refreshPage: false,
  refreshInterval: 10
};
