
/*
 * Tooltip generator
 * 0 - Concise
 * 1 - Precise
 * 2 - Exhaustive
 *
*/
export const DEFAULT_CONFIG_TOOLTIP = {
  tasks:{
    0:{
      chunkTime: 'chunk size Level 0',
      statusTimer: 'status timer level 0',
      useNewBench: 'Concise infomation',
      skipKeyspace: 'skipKeyspace level 0',
      isCpuTask: 'Task is assigned only to CPU agents',
      isSmall: 'Only one agent is assigned to the task',
      preprocessorId: 'Preprocessor Level 0',
      staticChunks: 'Static chunk level 0',
      forcePipe: 'To apply rules before reject',
    },
    1:{
      chunkTime: 'chunk size Level 1',
      statusTimer: 'status timer level 1',
      useNewBench: 'Detailed infomation',
      skipKeyspace: 'skipKeyspace level 1',
      isCpuTask: 'Task is assigned only to CPU agents',
      isSmall: 'Only one agent is assigned to the task',
      preprocessorId: 'Preprocessor Level 1',
      staticChunks: 'Static chunk level 1',
      forcePipe: 'To apply rules before reject'
    },
    2:{
      chunkTime: 'chunk size Level 2',
      statusTimer: 'status timer level 2',
      skipKeyspace: 'skipKeyspace level 2',
      useNewBench: 'Exhaustive infomation',
      isCpuTask: 'Task is assigned only to CPU agents',
      isSmall: 'Only one agent is assigned to the task',
      preprocessorId: 'Preprocessor Level 2',
      staticChunks: 'Static chunk level 2',
      forcePipe: 'To apply rules before reject'
    }
  },
  config:{
    0:{
      agent:{
        agenttimeout: 'Level 0',
        benchtime: 'Level 0',
        statustimer: 'Level 0',
        agentDataLifetime: 'Level 0',
        hideIpInfo: 'Level 0',
        voucherDeletion: 'Level 0',
        agentStatLimit: 'Level 0',
        agentStatTension: 'Level 0',
        agentTempThreshold1: 'Level 0',
        agentTempThreshold2: 'Level 0',
        agentUtilThreshold1: 'Level 0',
        agentUtilThreshold2: 'Level 0',
      },
      tc:{
        chunktime: 'Level 0',
        disptolerance: 'Level 0',
        defaultBenchmark: 'Level 0',
        disableTrimming: 'Level 0',
        hashlistAlias: 'Level 0',
        blacklistChars: 'Level 0',
        priority0Start: 'Level 0',
        showTaskPerformance: 'Level 0',
        ruleSplitSmallTasks: 'Level 0',
        ruleSplitAlways: 'Level 0',
        ruleSplitDisable: 'Level 0'
      },
      hch:{
        maxHashlistSize: 'Level 0',
        pagingSize: 'Level 0',
        hashesPerPage: 'Level 0',
        fieldseparator: 'Level 0',
        hashlistImportCheck: 'Level 0',
        batchSize: 'Level 0',
        plainTextMaxLength: 'Level 0',
        hashMaxLength: 'Level 0',
      },
      notif:{
        emailSender: 'Level 0',
        emailSenderName: 'Level 0',
        telegramBotToken: 'Level 0',
        notificationsProxyEnable: 'Level 0',
        notificationsProxyServer: 'Level 0',
        notificationsProxyPort: 'Level 0',
        notificationsProxyType: 'Level 0',
      },
      gs:{
        hashcatBrainEnable: 'Once enable, new options will show in hashlists',
        hashcatBrainHost: 'Level 0',
        hashcatBrainPort: 'Level 0',
        hashcatBrainPass: 'Level 0',
        hcErrorIgnore: 'Level 0',
        numLogEntries: 'Level 0',
        timefmt: 'Level 0',
        maxSessionLength: 'Level 0',
        baseHost: 'Level 0',
        contactEmail: 'Level 0',
        serverLogLevel: 'Level 0',
      }
    },
    1:{
      agent:{
        agenttimeout: 'Level 1',
        benchtime: 'Level 1',
        statustimer: 'Level 1',
        agentDataLifetime: 'Level 1',
        hideIpInfo: 'Level 1',
        voucherDeletion: 'Level 1',
        agentStatLimit: 'Level 1',
        agentStatTension: 'Level 1',
        agentTempThreshold1: 'Level 1',
        agentTempThreshold2: 'Level 1',
        agentUtilThreshold1: 'Level 1',
        agentUtilThreshold2: 'Level 1',
      },
      tc:{
        chunktime: 'Level 1',
        disptolerance: 'Level 1',
        defaultBenchmark: 'Level 1',
        disableTrimming: 'Level 1',
        hashlistAlias: 'Level 1',
        blacklistChars: 'Level 1',
        priority0Start: 'Level 1',
        showTaskPerformance: 'Level 1',
        ruleSplitSmallTasks: 'Level 1',
        ruleSplitAlways: 'Level 1',
        ruleSplitDisable: 'Level 1'
      },
      hch:{
        maxHashlistSize: 'Level 1',
        pagingSize: 'Level 1',
        hashesPerPage: 'Level 1',
        fieldseparator: 'Level 1',
        hashlistImportCheck: 'Level 1',
        batchSize: 'Level 1',
        plainTextMaxLength: 'Level 1',
        hashMaxLength: 'Level 1',
      },
      notif:{
        emailSender: 'Level 1',
        emailSenderName: 'Level 1',
        telegramBotToken: 'Level 1',
        notificationsProxyEnable: 'Level 1',
        notificationsProxyServer: 'Level 1',
        notificationsProxyPort: 'Level 1',
        notificationsProxyType: 'Level 1',
      },
      gs:{
        hashcatBrainEnable: 'Once enable, new options will show in hashlists',
        hashcatBrainHost: 'Level 1',
        hashcatBrainPort: 'Level 1',
        hashcatBrainPass: 'Level 1',
        hcErrorIgnore: 'Level 1',
        numLogEntries: 'Level 1',
        timefmt: 'Level 1',
        maxSessionLength: 'Level 1',
        baseHost: 'Level 1',
        contactEmail: 'Level 1',
        serverLogLevel: 'Level 1',
      }
    },
    2:{
      agent:{
        agenttimeout: 'Level 2',
        benchtime: 'Level 2',
        statustimer: 'Level 2',
        agentDataLifetime: 'Level 2',
        hideIpInfo: 'Level 2',
        voucherDeletion: 'Level 2',
        agentStatLimit: 'Level 2',
        agentStatTension: 'Level 2',
        agentTempThreshold1: 'Level 2',
        agentTempThreshold2: 'Level 2',
        agentUtilThreshold1: 'Level 2',
        agentUtilThreshold2: 'Level 2',
      },
      tc:{
        chunktime: 'Level 2',
        disptolerance: 'Level 2',
        defaultBenchmark: 'Level 2',
        disableTrimming: 'Level 2',
        hashlistAlias: 'Level 2',
        blacklistChars: 'Level 2',
        priority0Start: 'Level 2',
        showTaskPerformance: 'Level 2',
        ruleSplitSmallTasks: 'Level 2',
        ruleSplitAlways: 'Level 2',
        ruleSplitDisable: 'Level 2'
      },
      hch:{
        maxHashlistSize: 'Level 2',
        pagingSize: 'Level 2',
        hashesPerPage: 'Level 2',
        fieldseparator: 'Level 2',
        hashlistImportCheck: 'Level 2',
        batchSize: 'Level 2',
        plainTextMaxLength: 'Level 2',
        hashMaxLength: 'Level 2',
      },
      notif:{
        emailSender: 'Level 2',
        emailSenderName: 'Level 2',
        telegramBotToken: 'Level 2',
        notificationsProxyEnable: 'Level 2',
        notificationsProxyServer: 'Level 2',
        notificationsProxyPort: 'Level 2',
        notificationsProxyType: 'Level 2',
      },
      gs:{
        hashcatBrainEnable: 'Once enable, new options will show in hashlists',
        hashcatBrainHost: 'Level 2',
        hashcatBrainPort: 'Level 2',
        hashcatBrainPass: 'Level 2',
        hcErrorIgnore: 'Level 2',
        numLogEntries: 'Level 2',
        timefmt: 'Level 2',
        maxSessionLength: 'Level 2',
        baseHost: 'Level 2',
        contactEmail: 'Level 2',
        serverLogLevel: 'Level 2',
      }
    }
  }
};


