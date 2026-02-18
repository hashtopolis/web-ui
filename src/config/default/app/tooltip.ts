/*
 * Tooltip generator
 * 0 - Concise
 * 1 - Precise
 * 2 - Exhaustive
 *
 */
export const DEFAULT_CONFIG_TOOLTIP = {
  tasks: {
    0: {
      chunkTime: 'Task will be divided into chunks of this expected duration',
      statusTimer: 'Frequency of task status updates',
      useNewBench: 'Benchmark methodology',
      skipKeyspace: 'Keyspace offset for task',
      isCpuTask: 'Task is assigned only to CPU agents',
      isSmall: 'Only one agent is assigned to the task',
      preprocessorId: 'Preprocessor',
      staticChunks: 'Static chunking method',
      chunkSize: 'Size (keyspace) of chunks when using static chunking',
      forcePipe: 'To apply rules before reject'
    },
    1: {
      chunkTime: 'Task will be divided into chunks of this expected duration in seconds.',
      statusTimer: 'Frequency (in seconds) at which agents report task status updates',
      useNewBench: 'Benchmark methodology for performance testing',
      skipKeyspace: 'Keyspace offset for skipping initial portion of task',
      isCpuTask: 'When enabled, task is assigned only to CPU agents',
      isSmall: 'When enabled, only one agent is assigned to the task',
      preprocessorId: 'Preprocessor for task',
      staticChunks: 'Static chunking method to divide task',
      chunkSize: 'Size of each chunk when using static chunking option. Divides total keyspace into fixed-size chunks.',
      forcePipe: 'To apply rules before reject'
    },
    2: {
      chunkTime: 'Task will be divided into chunks of this expected duration in seconds.',
      statusTimer:
        'Status reporting interval in seconds. Defines how frequently agents should report task progress to the server.',
      useNewBench:
        'Benchmark methodology: Runtime Benchmark uses actual task execution, Speed Test uses synthetic benchmarks',
      skipKeyspace:
        'Keyspace offset in characters. Allows skipping initial portion of keyspace, useful for resuming interrupted tasks.',
      isCpuTask:
        'Restricts task assignment to CPU-only agents. Useful for tasks that do not benefit from GPU acceleration.',
      isSmall:
        'Forces task to be assigned to exactly one agent. Prevents task distribution for serial or single-threaded workloads.',
      preprocessorId: 'Preprocessor to apply before task execution',
      staticChunks: 'Static chunking method to divide task into fixed-size or fixed-count chunks',
      chunkSize:
        'When using static chunking, this parameter specifies the size of each chunk in keyspace units. The total keyspace is divided into chunks of this size and distributed to agents for parallel processing.',
      forcePipe: 'To apply rules before reject'
    }
  },
  config: {
    0: {
      agent: {
        agenttimeout: 'Inactivity timeout for disconnected agents',
        benchtime: 'Maximum wait time for issued chunks before timeout',
        statustimer: 'Interval for task status updates',
        agentDataLifetime: 'Retention period for agent utilisation and temperature data',
        hideIpInfo: 'Hide agent IP information from users',
        voucherDeletion: 'Allow deletion of vouchers after use',
        agentStatLimit: 'Maximum number of agent statistics to retain',
        agentStatTension: 'Time period for agent statistics aggregation',
        agentTempThreshold1: 'Warning temperature threshold for agents',
        agentTempThreshold2: 'Critical temperature threshold for agents',
        agentUtilThreshold1: 'Warning utilisation threshold for agents',
        agentUtilThreshold2: 'Critical utilisation threshold for agents'
      },
      tc: {
        chunktime: 'Expected duration for chunk completion',
        disptolerance: 'Allowed expansion percentage for final chunk',
        defaultBenchmark: 'Default benchmark method for new tasks',
        disableTrimming: 'Disable output trimming for task results',
        hashlistAlias: 'Display hashlist aliases',
        blacklistChars: 'Characters to exclude from attacks',
        priority0Start: 'Start time for priority level 0 tasks',
        showTaskPerformance: 'Display task performance metrics',
        ruleSplitSmallTasks: 'Split small tasks with rules',
        ruleSplitAlways: 'Always split tasks with rules',
        ruleSplitDisable: 'Disable automatic rule splitting'
      },
      hch: {
        maxHashlistSize: 'Maximum size limit for hashlist import',
        pagingSize: 'Number of items per page in lists',
        hashesPerPage: 'Number of hashes displayed per page',
        fieldseparator: 'Character used to separate hash fields',
        hashlistImportCheck: 'Validate hashes during import',
        batchSize: 'Number of hashes to process in batch operations',
        plainTextMaxLength: 'Maximum length for plaintext values',
        hashMaxLength: 'Maximum length for hash values'
      },
      notif: {
        emailSender: 'Email address for sending notifications',
        emailSenderName: 'Display name for notification emails',
        telegramBotToken: 'API token for Telegram bot integration',
        notificationsProxyEnable: 'Enable proxy for notification delivery',
        notificationsProxyServer: 'Proxy server address',
        notificationsProxyPort: 'Proxy server port number',
        notificationsProxyType: 'Type of proxy protocol (HTTP, SOCKS, etc.)'
      },
      gs: {
        hashcatBrainEnable: 'Enable Hashcat Brain integration for distributed crack correlation',
        hashcatBrainHost: 'Host address for Hashcat Brain server',
        hashcatBrainPort: 'Port number for Hashcat Brain connection',
        hashcatBrainPass: 'Password for Hashcat Brain authentication',
        hcErrorIgnore: 'Ignore non-critical Hashcat errors',
        numLogEntries: 'Number of log entries to display',
        timefmt: 'Time format for log timestamps',
        maxSessionLength: 'Maximum duration for user sessions',
        baseHost: 'Base hostname for the server',
        contactEmail: 'Contact email for support and inquiries',
        serverLogLevel: 'Logging level for server events'
      }
    },
    1: {
      agent: {
        agenttimeout:
          'Time in seconds before an agent is marked as inactive if it does not communicate with the server',
        benchtime: 'Time in seconds to wait for chunk completion from an agent before marking it as timed out',
        statustimer: 'Interval in seconds for agents to report their task status and progress',
        agentDataLifetime: 'Number of days to retain agent utilisation and temperature statistics',
        hideIpInfo: 'When enabled, agent IP addresses are hidden from regular users',
        voucherDeletion: 'When enabled, allow deletion of vouchers after they have been used',
        agentStatLimit: 'Maximum number of agent statistics records to keep in the database',
        agentStatTension: 'Time window in hours for aggregating agent statistics',
        agentTempThreshold1: 'Agent temperature (°C) at which to display warning status',
        agentTempThreshold2: 'Agent temperature (°C) at which to display critical status',
        agentUtilThreshold1: 'Agent CPU utilisation (%) at which to display warning status',
        agentUtilThreshold2: 'Agent CPU utilisation (%) at which to display critical status'
      },
      tc: {
        chunktime:
          'Expected duration in seconds for a single chunk. Used for performance estimation and task progress calculation',
        disptolerance: 'Percentage to allow the final chunk in a task to exceed the expected chunk duration',
        defaultBenchmark: 'Benchmark method used when creating new tasks (Runtime Benchmark or Speed Test)',
        disableTrimming: 'When enabled, keep original output formatting without trimming whitespace',
        hashlistAlias: 'When enabled, display human-readable aliases for hashlists if configured',
        blacklistChars: 'Characters to exclude from rule-based attacks to improve performance',
        priority0Start: 'Scheduled start time for high-priority tasks (format: HH:MM)',
        showTaskPerformance: 'When enabled, display detailed performance metrics for running tasks',
        ruleSplitSmallTasks: 'Automatically split small tasks when rules are applied',
        ruleSplitAlways: 'Always split tasks when rules are applied',
        ruleSplitDisable: 'Disable automatic task splitting when rules are applied'
      },
      hch: {
        maxHashlistSize: 'Maximum file size in MB allowed when importing a hashlist',
        pagingSize: 'Number of items displayed per page in table listings',
        hashesPerPage: 'Number of individual hashes shown per page when browsing hashlist contents',
        fieldseparator: 'Delimiter character used to separate multiple fields in hash:plaintext entries',
        hashlistImportCheck: 'Perform validation checks on hashes during import to ensure data integrity',
        batchSize: 'Number of hashes processed in a single batch during import operations',
        plainTextMaxLength: 'Maximum allowed length (characters) for plaintext values',
        hashMaxLength: 'Maximum allowed length (characters) for hash values'
      },
      notif: {
        emailSender: 'SMTP email address used as the sender for system notifications',
        emailSenderName: 'Display name that appears as the sender in notification emails',
        telegramBotToken: 'Telegram Bot API token for sending notifications via Telegram',
        notificationsProxyEnable: 'Enable proxy server for routing notification deliveries',
        notificationsProxyServer: 'Hostname or IP address of the proxy server',
        notificationsProxyPort: 'Port number of the proxy server',
        notificationsProxyType: 'Proxy protocol type: HTTP, HTTPS, SOCKS4, or SOCKS5'
      },
      gs: {
        hashcatBrainEnable: 'Integration with Hashcat Brain for correlating cracks across distributed instances',
        hashcatBrainHost: 'Hostname or IP address of the Hashcat Brain server',
        hashcatBrainPort: 'Port number used to connect to Hashcat Brain server',
        hashcatBrainPass: 'Authentication password for connecting to Hashcat Brain',
        hcErrorIgnore: 'Ignore non-critical errors from Hashcat to prevent task failures',
        numLogEntries: 'Number of historical log entries to display in the UI',
        timefmt: 'Time format string for displaying timestamps in logs (e.g., YYYY-MM-DD HH:MM:SS)',
        maxSessionLength: 'Maximum session duration in minutes before automatic logout',
        baseHost: 'Base URL/hostname used for generating links in the application',
        contactEmail: 'Email address for support inquiries and system notifications',
        serverLogLevel: 'Logging verbosity: DEBUG, INFO, WARN, ERROR'
      }
    },
    2: {
      agent: {
        agenttimeout:
          'Time in seconds before an agent is considered inactive and disconnected. If no communication is received within this period, the agent is marked offline and its tasks are reassigned.',
        benchtime:
          'Maximum time in seconds to wait for a chunk to be completed by an agent. If exceeded, the chunk is reassigned to another agent to ensure progress.',
        statustimer:
          'Interval in seconds at which agents automatically report their current status and progress on assigned tasks back to the server.',
        agentDataLifetime:
          'Number of days to retain historical agent performance data (utilisation and temperature records) before automatic deletion.',
        hideIpInfo:
          'When enabled, hides agent IP addresses from regular users. Only administrators can see IP information.',
        voucherDeletion:
          'When enabled, vouchers are automatically deleted after they have been used to register an agent (prevents voucher reuse).',
        agentStatLimit:
          'Maximum number of agent statistics snapshots to retain in the database. Older records are purged when limit is reached.',
        agentStatTension:
          'Time window in hours for aggregating agent performance statistics. Used for displaying average performance over a period.',
        agentTempThreshold1:
          'Agent temperature in Celsius at which warning status (yellow) is displayed. Indicates elevated but acceptable temperature.',
        agentTempThreshold2:
          'Agent temperature in Celsius at which critical status (red) is displayed. Indicates dangerous temperature requiring attention.',
        agentUtilThreshold1:
          'Agent CPU utilisation percentage at which warning status (yellow) is displayed. Indicates high but acceptable load.',
        agentUtilThreshold2:
          'Agent CPU utilisation percentage at which critical status (red) is displayed. Indicates excessive load potentially affecting performance.'
      },
      tc: {
        chunktime:
          'Expected time in seconds for completing a standard chunk. This value is critical for load balancing as it helps the system estimate task duration and distribute workload effectively across agents.',
        disptolerance:
          'Percentage margin to allow the final chunk in a task to exceed the normal expected chunk duration. Prevents timeouts on the last chunk which may process remaining items.',
        defaultBenchmark:
          'Default benchmarking methodology for newly created tasks. Runtime Benchmark tests actual performance; Speed Test uses synthetic benchmarks and is faster.',
        disableTrimming:
          'When enabled, preserves original formatting and whitespace in task output. When disabled, automatically removes leading/trailing whitespace from results.',
        hashlistAlias:
          'When enabled, displays human-readable aliases for hashlists in the UI. Aliases must be configured per hashlist; falls back to regular names if not set.',
        blacklistChars:
          'String of characters to exclude from rule-based and hybrid attacks. Improves performance by reducing keyspace but may miss valid passwords.',
        priority0Start:
          'Scheduled time (format HH:MM in 24-hour format) at which highest-priority tasks automatically start. Allows scheduling intensive tasks during off-peak hours.',
        showTaskPerformance:
          'When enabled, displays detailed performance graphs and metrics for running tasks showing speed, progress, and estimated completion time.',
        ruleSplitSmallTasks:
          'Automatically splits small tasks when rules are applied to improve performance through parallelization across multiple agents.',
        ruleSplitAlways:
          'Always splits tasks when rules are applied, regardless of task size. Ensures maximum parallelization but may increase overhead.',
        ruleSplitDisable:
          'Completely disables automatic task splitting when rules are applied. Tasks remain as single units assigned to single agents.'
      },
      hch: {
        maxHashlistSize:
          'Maximum file size in MB allowed when uploading a hashlist file. Limits are enforced during import to prevent excessive server resource consumption.',
        pagingSize:
          'Number of rows displayed per page in table listings throughout the application. Affects pagination control and performance in large datasets.',
        hashesPerPage:
          'Number of individual hash entries shown per page when browsing hashes within a hashlist. Lower values improve performance with very large hashlists.',
        fieldseparator:
          'Delimiter character used to separate multiple fields in import files containing hash:plaintext:salt format entries. Common separators are colon (:) or pipe (|).',
        hashlistImportCheck:
          'Perform comprehensive validation on all hashes during import including format verification and duplicate detection to ensure data quality.',
        batchSize:
          'Number of hashes processed in each batch during import operations. Larger batches improve performance but consume more memory.',
        plainTextMaxLength:
          'Maximum allowed character length for plaintext values in hash:plaintext pairs. Longer plaintexts are truncated during import.',
        hashMaxLength:
          'Maximum allowed character length for hash values. Longer hashes are rejected during import to maintain data consistency.'
      },
      notif: {
        emailSender:
          'SMTP email address (from address) used when sending system notifications and alerts via email. Must be a valid address configured in your mail server.',
        emailSenderName:
          'Display name shown in the "From" field of notification emails. Helps recipients identify the message source as coming from your Hashtopolis instance.',
        telegramBotToken:
          'Telegram Bot API token obtained from BotFather. Enables sending task completion and alert notifications via Telegram messenger.',
        notificationsProxyEnable:
          'Enable routing of notification traffic through a proxy server. Useful in restricted network environments where direct SMTP/Telegram access is blocked.',
        notificationsProxyServer:
          'Hostname or IP address of the proxy server used for notification delivery. Required when notifications proxy is enabled.',
        notificationsProxyPort:
          'Network port number of the proxy server. Typically 8080 for HTTP proxies, 1080 for SOCKS, or other configured values.',
        notificationsProxyType:
          'Protocol type of the proxy: HTTP/HTTPS for HTTP proxies, SOCKS4/SOCKS5 for SOCKS proxies. Must match your proxy server configuration.'
      },
      gs: {
        hashcatBrainEnable:
          'Integration with Hashcat Brain distributed password cracking correlation system. Enables sharing of attack fingerprints across Hashtopolis instances to avoid duplicate work.',
        hashcatBrainHost:
          'Hostname or IP address of the Hashcat Brain server. Leave empty to disable Brain integration. Usually a dedicated server in your infrastructure.',
        hashcatBrainPort:
          'Network port number for connecting to the Hashcat Brain server. Default is typically 5000. Must be accessible from all agents and the main server.',
        hashcatBrainPass:
          'Shared secret password for authenticating with the Hashcat Brain server. Keep this secure as it controls access to the distributed correlation database.',
        hcErrorIgnore:
          "When enabled, non-critical errors from Hashcat binary are ignored and don't cause task failure. Useful for environments with minor compatibility issues.",
        numLogEntries:
          'Maximum number of recent log entries displayed in the dashboard and log viewer. Lower values improve UI responsiveness with large logs.',
        timefmt:
          'Time format specification for timestamps in logs and UI. Uses standard strftime format (e.g., %Y-%m-%d %H:%M:%S for 2026-02-16 14:30:45).',
        maxSessionLength:
          'Maximum duration in minutes a user session remains valid. Applies to web UI sessions. Users are logged out automatically after this period.',
        baseHost:
          'Base URL/hostname for your Hashtopolis installation. Used for generating links in emails, notifications, and APIs. Must be publicly accessible or match your network configuration.',
        contactEmail:
          'Email address displayed for support and inquiries. Used in notifications, error messages, and as contact point for system administrators.',
        serverLogLevel:
          'Logging verbosity level: DEBUG (most verbose), INFO, WARN, or ERROR (least verbose). Higher levels generate more logs but aid in troubleshooting.'
      }
    }
  }
};
