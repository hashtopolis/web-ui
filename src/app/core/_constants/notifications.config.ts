/**
 * Notifications
 **/

export const ACTION = {
  AGENT_ERROR: 'agentError',
  OWN_AGENT_ERROR: 'ownAgentError',
  DELETE_AGENT: 'deleteAgent',
  NEW_TASK: 'newTask',
  TASK_COMPLETE: 'taskComplete',
  DELETE_TASK: 'deleteTask',
  NEW_HASHLIST: 'newHashlist',
  DELETE_HASHLIST: 'deleteHashlist',
  HASHLIST_ALL_CRACKED: 'hashlistAllCracked',
  HASHLIST_CRACKED_HASH: 'hashlistCrackedHash',
  USER_CREATED: 'userCreated',
  USER_DELETED: 'userDeleted',
  USER_LOGIN_FAILED: 'userLoginFailed',
  LOG_WARN: 'logWarn',
  LOG_FATAL: 'logFatal',
  LOG_ERROR: 'logError'
} as const;
export type ACTION = (typeof ACTION)[keyof typeof ACTION];

export const NOTIF = {
  CHATBOT: 'ChatBot',
  DISCORD: 'Discord Webhook',
  EMAIL: 'Email',
  EXAMPLE: 'Example',
  SLACK: 'Slack',
  TELEGRAM: 'Telegram'
} as const;
export type NOTIF = (typeof NOTIF)[keyof typeof NOTIF];

export const AGENT_ACTIONS: ACTION[] = [ACTION.AGENT_ERROR, ACTION.OWN_AGENT_ERROR, ACTION.DELETE_AGENT];

export const TASK_ACTIONS: ACTION[] = [ACTION.NEW_TASK, ACTION.TASK_COMPLETE, ACTION.DELETE_TASK];

export const HASHLIST_ACTIONS: ACTION[] = [
  ACTION.NEW_HASHLIST,
  ACTION.DELETE_HASHLIST,
  ACTION.HASHLIST_ALL_CRACKED,
  ACTION.HASHLIST_CRACKED_HASH
];

export const USER_ACTIONS: ACTION[] = [ACTION.USER_CREATED, ACTION.USER_DELETED, ACTION.USER_LOGIN_FAILED];

export const LOG_ACTIONS: ACTION[] = [ACTION.LOG_WARN, ACTION.LOG_FATAL, ACTION.LOG_ERROR];

export const NOTIFARRAY: NOTIF[] = [
  NOTIF.CHATBOT,
  NOTIF.DISCORD,
  NOTIF.EMAIL,
  NOTIF.EXAMPLE,
  NOTIF.SLACK,
  NOTIF.TELEGRAM
];
