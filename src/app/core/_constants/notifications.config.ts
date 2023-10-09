/**
 * Notifications
**/

export class ACTION {
  static readonly AGENT_ERROR = 'agentError';
  static readonly OWN_AGENT_ERROR = 'ownAgentError';
  static readonly DELETE_AGENT = 'deleteAgent';
  static readonly NEW_TASK = 'newTask';
  static readonly TASK_COMPLETE = 'taskComplete';
  static readonly DELETE_TASK = 'deleteTask';
  static readonly NEW_HASHLIST = 'newHashlist';
  static readonly DELETE_HASHLIST = 'deleteHashlist';
  static readonly HASHLIST_ALL_CRACKED = 'hashlistAllCracked';
  static readonly HASHLIST_CRACKED_HASH = 'hashlistCrackedHash';
  static readonly USER_CREATED = 'userCreated';
  static readonly USER_DELETED = 'userDeleted';
  static readonly USER_LOGIN_FAILED = 'userLoginFailed';
  static readonly LOG_WARN = 'logWarn';
  static readonly LOG_FATAL = 'logFatal';
  static readonly LOG_ERROR = 'logError';
}

export class NOTIF {
  static readonly CHATBOT = 'ChatBot';
  static readonly DISCORD = 'Discord Webhook';
  static readonly EMAIL = 'Email';
  static readonly EXAMPLE = 'Example';
  static readonly SLACK = 'Slack';
  static readonly TELEGRAM = 'Telegram';
}

export const ACTIONARRAY = [
  ACTION.AGENT_ERROR,
  ACTION.OWN_AGENT_ERROR,
  ACTION.DELETE_AGENT,
  ACTION.NEW_TASK,
  ACTION.TASK_COMPLETE,
  ACTION.DELETE_TASK,
  ACTION.NEW_HASHLIST,
  ACTION.DELETE_HASHLIST,
  ACTION.HASHLIST_ALL_CRACKED,
  ACTION.HASHLIST_CRACKED_HASH,
  ACTION.USER_CREATED,
  ACTION.USER_DELETED,
  ACTION.USER_LOGIN_FAILED,
  ACTION.LOG_WARN,
  ACTION.LOG_FATAL,
  ACTION.LOG_ERROR
]

export const NOTIFARRAY = [
  NOTIF.CHATBOT,
  NOTIF.DISCORD,
  NOTIF.EMAIL,
  NOTIF.EXAMPLE,
  NOTIF.SLACK,
  NOTIF.TELEGRAM,
]
