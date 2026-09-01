import { DateFormat, TimeFormat, browserDateFormat, browserTimeFormat } from '@constants/settings.config';

import { AccessGroupsAgentsTableCol } from '@components/tables/access-groups-agents-table/access-groups-agents-table.constants';
import { AccessGroupsTableCol } from '@components/tables/access-groups-table/access-groups-table.constants';
import { AccessGroupsUsersTableCol } from '@components/tables/access-groups-users-table/access-groups-users-table.constants';
import { AccessPermissionGroupsUserTableCol } from '@components/tables/access-permission-groups-user-table/access-permission-groups-user-table.constants';
import { AccessPermissionGroupsUsersTableCol } from '@components/tables/access-permission-groups-users-table/access-permission-groups-users-table.constants';
import { AgentBinariesTableCol } from '@components/tables/agent-binaries-table/agent-binaries-table.constants';
import { AgentErrorTableCol } from '@components/tables/agent-error-table/agent-error-table.constants';
import { AgentsStatusTableCol } from '@components/tables/agents-status-table/agents-status-table.constants';
import { AgentsTableCol } from '@components/tables/agents-table/agents-table.constants';
import { ApiTokensTableCol } from '@components/tables/api-tokens-table/api-tokens-table.constants';
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
import { TasksAgentsTableCol } from '@components/tables/tasks-agents-table/tasks-agents-table.constants';
import { TasksChunksTableCol } from '@components/tables/tasks-chunks-table/tasks-chunks-table.constants';
import { TasksSupertasksDataSourceTableCol } from '@components/tables/tasks-supertasks-table/tasks-supertasks-table.constants';
import { TaskTableCol } from '@components/tables/tasks-table/tasks-table.constants';
import { UsersTableCol } from '@components/tables/users-table/users-table.constants';
import { VouchersTableCol } from '@components/tables/vouchers-table/vouchers-table.constants';

import { TimePrecision, dateTimeFormat } from '@src/app/shared/utils/datetime';

/** Rows fetched per page before the user picks a different page size. */
export const DEFAULT_PAGE_SIZE = 25;

export const Layout = {
  FULL: 'full',
  FIXED: 'fixed'
} as const;
export type Layout = (typeof Layout)[keyof typeof Layout];

export const BuiltInTheme = {
  LIGHT: 'light',
  DARK: 'dark'
} as const;
export type BuiltInTheme = (typeof BuiltInTheme)[keyof typeof BuiltInTheme];
export type Theme = BuiltInTheme | (string & {});

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
  start?: number | string | undefined;
  order?: Sorting | Sorting[] | undefined;
  page: number;
  search?: string | unknown[] | undefined;
  before?: number | string | undefined;
  index?: number | undefined;
}

/**
 * Interface definition for UIConfig
 * @prop layout           UI layout
 * @prop theme            UI theme
 * @prop tableSettings    UI table settings
 * @prop dateFmt          Date format, used on its own for date-only output
 * @prop timeFmt          Clock convention, combined with dateFmt for date-time output
 * @prop refreshPage      Refresh page true/false
 * @prop refreshInterval  Refresh interval
 */
export interface UIConfig {
  layout: Layout;
  theme: Theme;
  tableSettings: TableSettings;
  dateFmt: DateFormat;
  timeFmt: TimeFormat;
  refreshPage: boolean;
  refreshInterval: number;
}

export type UIConfigKeys = keyof UIConfig;

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
  direction: 'asc' | 'desc' | '';
  parent?: string | undefined;
}

const _uiConfigDefault = {
  layout: Layout.FIXED,
  theme: BuiltInTheme.LIGHT,
  dateFmt: browserDateFormat(),
  timeFmt: browserTimeFormat(),
  tableSettings: {
    notificationsTable: {
      page: DEFAULT_PAGE_SIZE,
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
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    apiTokensTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        ApiTokensTableCol.ID,
        ApiTokensTableCol.VALID_FROM,
        ApiTokensTableCol.VALID_UNTIL,
        ApiTokensTableCol.STATUS,
        ApiTokensTableCol.CREATOR
      ],
      order: {
        id: ApiTokensTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'desc'
      },
      search: ''
    },
    vouchersTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [VouchersTableCol.ID, VouchersTableCol.KEY, VouchersTableCol.CREATED],
      order: {
        id: VouchersTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    permissionsTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [PermissionsTableCol.ID, PermissionsTableCol.NAME, PermissionsTableCol.MEMBERS],
      order: {
        id: PermissionsTableCol.NAME,
        dataKey: 'name',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    cracksTable: {
      page: DEFAULT_PAGE_SIZE,
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
        id: CracksTableCol.FOUND,
        dataKey: 'timeCracked',
        isSortable: true,
        direction: 'desc'
      },
      search: ''
    },
    agentsTable: {
      page: DEFAULT_PAGE_SIZE,
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
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    agentErrorTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        AgentErrorTableCol.ID,
        AgentErrorTableCol.TIME,
        AgentErrorTableCol.TASK_ID,
        AgentErrorTableCol.TASK,
        AgentErrorTableCol.CHUNK,
        AgentErrorTableCol.MESSAGE
      ],
      order: {
        id: AgentErrorTableCol.TIME,
        dataKey: 'time',
        isSortable: true,
        direction: 'desc'
      },
      search: ''
    },
    agentStatusTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        AgentsStatusTableCol.ID,
        AgentsStatusTableCol.NAME,
        AgentsStatusTableCol.AGENT_STATUS,
        AgentsStatusTableCol.STATUS,
        AgentsStatusTableCol.WORKING_ON,
        AgentsStatusTableCol.ASSIGNED,
        AgentsStatusTableCol.LAST_ACTIVITY,
        AgentsStatusTableCol.GPU_UTILISATION,
        AgentsStatusTableCol.GPU_TEMPERATURE,
        AgentsStatusTableCol.CPU_UTILISATION
      ],
      order: {
        id: AgentsStatusTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    assignedAgentsTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        TasksAgentsTableCol.ID,
        TasksAgentsTableCol.NAME,
        TasksAgentsTableCol.STATUS,
        TasksAgentsTableCol.TASK_SPEED,
        TasksAgentsTableCol.LAST_ACTIVITY,
        TasksAgentsTableCol.TIME_SPENT,
        TasksAgentsTableCol.BENCHMARK,
        TasksAgentsTableCol.CRACKED,
        TasksAgentsTableCol.SEARCHED
      ],
      order: {
        id: TasksAgentsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    chunksTable: {
      page: DEFAULT_PAGE_SIZE,
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
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    hashlistsTable: {
      page: DEFAULT_PAGE_SIZE,
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
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    hashlistsInShTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        HashlistsTableCol.ID,
        HashlistsTableCol.NAME,
        HashlistsTableCol.FORMAT,
        HashlistsTableCol.CRACKED,
        HashlistsTableCol.HASH_COUNT
      ],
      order: {
        id: HashlistsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    superHashlistsTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        SuperHashlistsTableCol.ID,
        SuperHashlistsTableCol.NAME,
        SuperHashlistsTableCol.HASHTYPE,
        SuperHashlistsTableCol.CRACKED,
        SuperHashlistsTableCol.HASHLISTS
      ],
      order: {
        id: SuperHashlistsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    hashtypesTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        HashtypesTableCol.HASHTYPE,
        HashtypesTableCol.DESCRIPTION,
        HashtypesTableCol.SALTED,
        HashtypesTableCol.SLOW_HASH
      ],
      order: {
        id: HashtypesTableCol.HASHTYPE,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    filesTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        FilesTableCol.ID,
        FilesTableCol.NAME,
        FilesTableCol.SIZE,
        FilesTableCol.LINE_COUNT,
        FilesTableCol.ACCESS_GROUP
      ],
      order: {
        id: FilesTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    filesWordlistTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        FilesTableCol.ID,
        FilesTableCol.NAME,
        FilesTableCol.SIZE,
        FilesTableCol.LINE_COUNT,
        FilesTableCol.ACCESS_GROUP
      ],
      order: {
        id: FilesTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    filesRuleTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        FilesTableCol.ID,
        FilesTableCol.NAME,
        FilesTableCol.SIZE,
        FilesTableCol.LINE_COUNT,
        FilesTableCol.ACCESS_GROUP
      ],
      order: {
        id: FilesTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    filesOtherTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        FilesTableCol.ID,
        FilesTableCol.NAME,
        FilesTableCol.SIZE,
        FilesTableCol.LINE_COUNT,
        FilesTableCol.ACCESS_GROUP
      ],
      order: {
        id: FilesTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    filesTableInPreTasks: {
      start: 0,
      page: DEFAULT_PAGE_SIZE,
      columns: [FilesTableCol.ID, FilesTableCol.NAME, FilesTableCol.SIZE, FilesTableCol.LINE_COUNT],
      order: {
        id: FilesTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    filesAttackTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [FilesAttackTableCol.ID, FilesAttackTableCol.NAME, FilesAttackTableCol.SIZE],
      order: {
        id: FilesAttackTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    crackersTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [CrackersTableCol.ID, CrackersTableCol.TYPE, CrackersTableCol.VERSIONS],
      order: {
        id: CrackersTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    preprocessorsTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [PreprocessorsTableCol.ID, PreprocessorsTableCol.NAME],
      order: {
        id: PreprocessorsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    agentBinariesTable: {
      page: DEFAULT_PAGE_SIZE,
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
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    healthChecksTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        HealthChecksTableCol.ID,
        HealthChecksTableCol.CREATED,
        HealthChecksTableCol.STATUS,
        HealthChecksTableCol.TYPE
      ],
      order: {
        id: HealthChecksTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    healthCheckAgentsTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        HealthCheckAgentsTableCol.AGENT_ID,
        HealthCheckAgentsTableCol.AGENT_NAME,
        HealthCheckAgentsTableCol.STATUS,
        HealthCheckAgentsTableCol.START,
        HealthCheckAgentsTableCol.GPUS,
        HealthCheckAgentsTableCol.ERRORS
      ],
      order: {
        id: HealthCheckAgentsTableCol.AGENT_ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    pretasksTable: {
      page: DEFAULT_PAGE_SIZE,
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
        dataKey: 'priority',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    tasksTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        TaskTableCol.ID,
        TaskTableCol.TASK_TYPE,
        TaskTableCol.NAME,
        TaskTableCol.STATUS,
        TaskTableCol.HASHTYPE,
        TaskTableCol.HASHLISTS,
        TaskTableCol.PRIORITY,
        TaskTableCol.AGENTS,
        TaskTableCol.TASK_SPEED,
        TaskTableCol.MAX_AGENTS,
        TaskTableCol.DISPATCHED_SEARCHED,
        TaskTableCol.CRACKED
      ],
      order: {
        id: TaskTableCol.PRIORITY,
        dataKey: 'taskWrapperPriority',
        isSortable: true,
        direction: 'desc'
      },
      search: ''
    },
    tasksChunksTable: {
      page: DEFAULT_PAGE_SIZE,
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
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    tasksSupertasksTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        TasksSupertasksDataSourceTableCol.ID,
        TasksSupertasksDataSourceTableCol.NAME,
        TasksSupertasksDataSourceTableCol.STATUS,
        TasksSupertasksDataSourceTableCol.DISPATCHED_SEARCHED,
        TasksSupertasksDataSourceTableCol.CRACKED,
        TasksSupertasksDataSourceTableCol.AGENTS,
        TasksSupertasksDataSourceTableCol.SPEED,
        TasksSupertasksDataSourceTableCol.PRIORITY,
        TasksSupertasksDataSourceTableCol.MAX_AGENTS
      ],
      order: {
        id: TasksSupertasksDataSourceTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    supertasksTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [SupertasksTableCol.ID, SupertasksTableCol.NAME, SupertasksTableCol.PRETASKS],
      order: {
        id: SupertasksTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    supertasksPretasksTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        SupertasksPretasksTableCol.ID,
        SupertasksPretasksTableCol.NAME,
        SupertasksPretasksTableCol.PRIORITY,
        SupertasksPretasksTableCol.MAX_AGENTS
      ],
      order: {
        id: SupertasksPretasksTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    superTasksPretasksEditTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        PretasksTableCol.ID,
        PretasksTableCol.NAME,
        PretasksTableCol.ATTACK_COMMAND,
        PretasksTableCol.ESTIMATED_KEYSPACE,
        PretasksTableCol.FILES_TOTAL,
        PretasksTableCol.FILES_SIZE,
        PretasksTableCol.PRIORITY,
        PretasksTableCol.MAX_AGENTS
      ],
      order: {
        id: PretasksTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    hashlistTasksTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [TaskTableCol.ID, TaskTableCol.NAME, TaskTableCol.DISPATCHED_SEARCHED, TaskTableCol.CRACKED],
      order: {
        id: TaskTableCol.ID,
        dataKey: 'taskWrapperId',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    hashesTable: {
      page: DEFAULT_PAGE_SIZE,
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
        dataKey: 'timeCracked',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    searchHashTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        SearchHashTableCol.HASH,
        SearchHashTableCol.PLAINTEXT,
        SearchHashTableCol.HASHLIST,
        SearchHashTableCol.INFO
      ],
      order: {
        id: SearchHashTableCol.HASH,
        dataKey: 'hash',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    usersTable: {
      page: DEFAULT_PAGE_SIZE,
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
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    logsTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [LogsTableCol.ID, LogsTableCol.ISSUER, LogsTableCol.LEVEL, LogsTableCol.MESSAGE, LogsTableCol.TIME],
      order: {
        id: LogsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    accessGroupsTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        AccessGroupsTableCol.ID,
        AccessGroupsTableCol.NAME,
        AccessGroupsTableCol.NUSERS,
        AccessGroupsTableCol.NAGENTS
      ],
      order: {
        id: AccessGroupsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    accessGroupsUsersTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [AccessGroupsUsersTableCol.ID, AccessGroupsUsersTableCol.NAME, AccessGroupsUsersTableCol.STATUS],
      order: {
        id: AccessGroupsUsersTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    accessPermissionGroupsUserTable: {
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
        dataKey: 'name',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    accessPermissionGroupsUsersTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [
        AccessPermissionGroupsUsersTableCol.ID,
        AccessPermissionGroupsUsersTableCol.NAME,
        AccessPermissionGroupsUsersTableCol.STATUS,
        AccessPermissionGroupsUsersTableCol.LAST_LOGIN
      ],
      order: {
        id: AccessPermissionGroupsUsersTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    },
    accessGroupsAgentsTable: {
      page: DEFAULT_PAGE_SIZE,
      columns: [AccessGroupsAgentsTableCol.ID, AccessGroupsAgentsTableCol.NAME],
      order: {
        id: AccessGroupsAgentsTableCol.ID,
        dataKey: 'id',
        isSortable: true,
        direction: 'asc'
      },
      search: ''
    }
  },
  refreshPage: false,
  refreshInterval: 10
} as const satisfies UIConfig;

export type TableSettingsKey = keyof (typeof _uiConfigDefault)['tableSettings'];
export const uiConfigDefault: UIConfig = _uiConfigDefault;

/** Date-time format from the default config, for use before the stored UI config has been read. */
export const DEFAULT_DATETIME_FORMAT = dateTimeFormat(
  uiConfigDefault.dateFmt,
  uiConfigDefault.timeFmt,
  TimePrecision.SECONDS
);
