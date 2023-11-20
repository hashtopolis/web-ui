export type LogLevel = 'warning' | 'error' | 'fatal error' | 'information';
export type Issuer = 'API' | 'User';

export interface Log {
  _id: number;
  _self: string;
  issuer: Issuer;
  issuerId: string;
  level: LogLevel;
  logEntryId: number;
  message: string;
  time: number;
}
